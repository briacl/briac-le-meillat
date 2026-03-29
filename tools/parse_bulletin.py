import pdfplumber
import json
import os
import re

def parse_bulletin(pdf_path, json_path):
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found.")
        return

    full_text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return

    data = {
        "ues": [],
        "ressources": [],
        "saes": []
    }

    # Debug: Save full extracted text to debug
    # with open("debug_text.txt", "w") as f:
    #     f.write(full_text)

    lines = full_text.split('\n')
    
    current_section = None # 'UE', 'RESSOURCES', 'SAE_DETAILS'
    current_ue = None
    current_resource = None
    current_sae_detail = None

    # Regex Patterns
    
    # UE Header: "UE11 - Administrer ... 14.24"
    ue_header_pattern = re.compile(r'^(UE\d{1,2}.*?)\s+-\s+(.*?)\s+(\d{1,2}\.\d{2})$')
    
    # Bonus/Rank: "Bonus: 0.22 - Rang: 14 / 57"
    bonus_rank_pattern = re.compile(r'Bonus:\s*([\d\.]+)\s*-\s*Rang:\s*(\d+\s*/\s*\d+)')
    
    # Generic Line with Coeff and Grade (R1.01 ... 10.0 14.00)
    # Allows for "~" or "EXC" as grade
    # Matches: Code Name Coeff Grade
    # We'll use a slightly loose pattern and refine
    # Assumption: Grade is at the end, Coeff is before Grade.
    item_line_pattern = re.compile(r'^([R|S|P|E|A|V][\w\d\.]+(?:\s+[A-Za-z].*?)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?|~|EXC|ABS)$')

    # Resource Header in details: "R1.01 - Initiation..." or "SAÉ11 - ..."
    # Note: Sometimes it's "R1.01 - ..."
    resource_header_pattern = re.compile(r'^([R|S][\w\d\.]+)\s+-\s+(.*)$')
    
    # Assessment Line: Name [Weights...] Coeff Grade
    # This is tricky because the middle part varies.
    # Usually ends with: Coeff Grade
    assessment_pattern = re.compile(r'^(.*?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?|~|EXC|ABS)$')


    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Detect Section Changes
        if "Unités d'enseignement" in line and "Coef." in line:
            current_section = "UE"
            continue
        if line.startswith("Ressources") and "UE" in line and "Coef." in line:
            current_section = "RESSOURCES"
            continue
        if line.startswith("Situations d'apprentissage et d'évaluation") and "Coef." in line:
            current_section = "SAE_DETAILS"
            continue
        if "Édité par ScoDoc" in line:
            continue
        if "Page " in line and len(line) < 10:
            continue

        # Processing logic based on section
        if current_section == "UE":
            # Check for UE Header
            ue_match = ue_header_pattern.match(line)
            if ue_match:
                code_full = ue_match.group(1) # UE11
                name = ue_match.group(2)
                average = ue_match.group(3)
                current_ue = {
                    "id": code_full.split()[0], # UE11
                    "full_id": code_full,
                    "title": name,
                    "average": average,
                    "bonus": "0",
                    "rank": "",
                    "modules": []
                }
                data["ues"].append(current_ue)
                continue
            
            # Check for Bonus/Rank
            if current_ue and line.startswith("Bonus:"):
                br_match = bonus_rank_pattern.match(line)
                if br_match:
                    current_ue["bonus"] = br_match.group(1)
                    current_ue["rank"] = br_match.group(2)
                continue
                
            # Check for Module/Item
            # Look for line ending with two numbers (coeff, grade) or number and ~
            # Regex is hard because names have spaces.
            # Strategy: Split by space, check last two items.
            parts = line.split()
            if len(parts) >= 3:
                grade = parts[-1]
                coeff = parts[-2]
                
                # Check if last two are valid grade/coeff
                is_grade = re.match(r'^(\d+\.\d+|~|EXC|ABS)$', grade)
                is_coeff = re.match(r'^\d+(\.\d+)?$', coeff)
                
                if is_grade and is_coeff and current_ue:
                    # Everything before is the name/code
                    name_code_parts = parts[:-2]
                    full_name = " ".join(name_code_parts)
                    
                    # Try to extract code (R1.01) from start
                    code = ""
                    name = full_name
                    first_word = name_code_parts[0]
                    if re.match(r'^[R|S|P|E][\w\d\.]+$', first_word) or first_word in ["Sport-S1", "SPORT"]:
                         code = first_word
                         name = " ".join(name_code_parts[1:])
                    
                    module_obj = {
                        "code": code,
                        "name": name,
                        "coeff": coeff,
                        "grade": grade
                    }
                    current_ue["modules"].append(module_obj)
                    continue

        elif current_section == "RESSOURCES" or current_section == "SAE_DETAILS":
            # Resources and SAE details have similar structure
            
            # Check for Resource/SAE Header
            # e.g. "R1.01 - Initiation..."
            res_match = resource_header_pattern.match(line)
            if res_match:
                code = res_match.group(1)
                name = res_match.group(2)
                
                new_item = {
                    "code": code,
                    "title": name,
                    "assessments": []
                }
                
                if "SAÉ" in code or current_section == "SAE_DETAILS":
                     current_sae_detail = new_item
                     data["saes"].append(current_sae_detail)
                     current_resource = None # Switch focus
                else:
                    current_resource = new_item
                    data["ressources"].append(current_resource)
                    current_sae_detail = None
                continue
            
            # Check for Assessment line
            # Lines like "Contrôle TP2 1.0 1.0 1.0 01.00 ~"
            # The weights for UEs are in the middle. We want the LAST number (grade) and the ONE BEFORE IT (overall coef? or just last weight?)
            # Actually, the header for resources says: "Ressources UE11 UE12 UE13 Coef. Note/20"
            # So the columns are: Name | W_UE11 | W_UE12 | ... | Coef | Note
            # The quantity of weight columns depends on UEs.
            # However, we simply want the Name, Coeff, and Note.
            # Note is last. Coeff is second to last presumably? 
            # Let's assume the last two identifiable numeric-like tokens are Coeff and Note.
            
            parts = line.split()
            if len(parts) >= 3:
                last = parts[-1]
                second_last = parts[-2]
                
                is_grade = re.match(r'^(\d+\.\d+|~|EXC|ABS)$', last)
                # Second last might be empty in some messy text, but parts split handles spaces.
                # If we have weights, there are multiple numbers.
                # Let's count how many numbers are at the end.
                
                # Reverse iterate to find numbers
                numeric_indices = []
                for i in range(len(parts) - 1, -1, -1):
                    p = parts[i]
                    if re.match(r'^(\d+\.\d+|~|EXC|ABS)$', p) or (re.match(r'^\d+(\.\d+)?$', p)):
                        numeric_indices.append(i)
                    else:
                        break # Stop at first non-number from right (name end)
                
                if len(numeric_indices) >= 2:
                    # We have at least Grade and Coeff
                    # Grade is parts[numeric_indices[0]] (original last)
                    # Coeff is parts[numeric_indices[1]] (original second last)
                    grade = parts[numeric_indices[0]]
                    coeff = parts[numeric_indices[1]]
                    
                    # Name is everything before the group of numbers
                    name_end_index = numeric_indices[-1]
                    name = " ".join(parts[:name_end_index])
                    
                    assessment_obj = {
                        "name": name,
                        "coeff": coeff,
                        "grade": grade
                    }
                    
                    target_list = current_sae_detail["assessments"] if current_sae_detail else (current_resource["assessments"] if current_resource else None)
                    
                    if target_list is not None:
                        target_list.append(assessment_obj)

    # Save to JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"Successfully parsed {pdf_path} to {json_path}")

if __name__ == "__main__":
    pdf_file = "bulletin.pdf"
    json_file = "bulletin.json"
    parse_bulletin(pdf_file, json_file)
