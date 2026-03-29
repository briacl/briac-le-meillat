import json
import os

def load_data(json_path):
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return None
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def parse_grade(grade_str):
    """
    Parses a grade string into a float.
    Returns None if the grade is invalid, ignored (~), or excused (EXC).
    """
    grade_str = grade_str.strip()
    if grade_str in ["~", "EXC", "ABS", ""]:
        return None
    try:
        return float(grade_str)
    except ValueError:
        return None

def analyze_competencies(data):
    if not data:
        return None

    ues = data.get("ues", [])
    resources = data.get("ressources", [])
    saes = data.get("saes", [])

    # 1. Top Domains (UEs)
    ue_scores = []
    for ue in ues:
        avg = parse_grade(ue.get("average", "0"))
        if avg is not None:
            ue_scores.append({
                "title": ue.get("title"),
                "code": ue.get("id"),
                "average": avg
            })
    
    ue_scores.sort(key=lambda x: x["average"], reverse=True)

    # 2. Top Skills (Modules & Resources)
    all_skills = []

    # From UE Modules
    for ue in ues:
        for mod in ue.get("modules", []):
            g = parse_grade(mod.get("grade", ""))
            if g is not None:
                all_skills.append({
                    "name": mod.get("name"),
                    "code": mod.get("code"),
                    "grade": g,
                    "source": "Module"
                })

    # From Resources & SAEs Assessments
    all_assessments = []
    
    # Resources
    for res in resources:
        res_title = res.get("title", "")
        for asm in res.get("assessments", []):
            g = parse_grade(asm.get("grade", ""))
            if g is not None:
                 all_assessments.append({
                    "name": f"{res_title} - {asm.get('name')}",
                    "grade": g
                })

    # SAEs
    for sae in saes:
        sae_title = sae.get("title", "")
        for asm in sae.get("assessments", []):
            g = parse_grade(asm.get("grade", ""))
            if g is not None:
                 all_assessments.append({
                    "name": f"{sae_title} - {asm.get('name')}",
                    "grade": g
                })

    # Sort skills (Modules)
    all_skills.sort(key=lambda x: x["grade"], reverse=True)
    
    # Sort assessments
    all_assessments.sort(key=lambda x: x["grade"], reverse=True)

    # Filter for output > 15
    top_domains = [ue for ue in ue_scores if ue['average'] >= 14] # Lowered threshold slightly to include robust skills
    top_modules = [skill for skill in all_skills if skill['grade'] >= 15]
    
    unique_assessments = []
    seen = set()
    for asm in all_assessments:
        if asm['grade'] >= 16: # Higher threshold for specific assessments
            if asm['name'] not in seen:
                unique_assessments.append(asm)
                seen.add(asm['name'])

    return {
        "top_domains": top_domains,
        "top_modules": top_modules[:10], # Top 10
        "detailed_performances": unique_assessments[:15] # Top 15
    }

if __name__ == "__main__":
    json_file = "bulletin.json"
    output_file = "briac-le-meillat/src/data/skills_analysis.json"
    
    data = load_data(json_file)
    if data:
        analysis = analyze_competencies(data)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=4, ensure_ascii=False)
        
        print(f"Analysis saved to {output_file}")
