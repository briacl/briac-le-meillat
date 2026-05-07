import pdfplumber
import json
import re

pdf_path = "./briac-le-meillat/public/assets/documents/apprentissage/admin-reseau/Annexe_22_RT_BUT_annee_1_1411365.pdf"
output_file = "./briac-le-meillat/public/data/courses.json"


def extract_courses():
    courses = {}
    
    with pdfplumber.open(pdf_path) as pdf:
        # Les fiches ressources commencent vers la page 74
        for i in range(73, len(pdf.pages)):
            page = pdf.pages[i]
            text = page.extract_text()
            
            if not text:
                continue
                
            # Regex plus stricte pour le début d'une fiche ressource
            # Format attendu : "R101 Initiation aux réseaux informatiques"
            lines = text.split('\n')
            header_line = ""
            for line in lines[:5]: # On regarde les 5 premières lignes
                match = re.search(r'^(R\d{3})\s+(.*)', line)
                if match:
                    code = match.group(1)
                    title = re.sub(r'\d+$', '', match.group(2)).strip() # Enlever le numéro de page à la fin
                    
                    # Si on a déjà extrait cette ressource, on passe (la première est souvent la fiche détaillée)
                    if code in courses:
                        continue
                        
                    # Extraction des mots-clés
                    keywords = []
                    kw_match = re.search(r'Mots-clés\s+(.*)', text)
                    if kw_match:
                        keywords = [k.strip() for k in kw_match.group(1).split(',')]
                    
                    # Heuristique pour les UEs
                    ues = []
                    text_lower = text.lower()
                    if any(x in text_lower for x in ["réseau", "lan", "wan", "protocole", "transmission"]):
                        ues.append("Connecter")
                    if any(x in text_lower for x in ["système", "administration", "serveur", "linux", "windows", "os"]):
                        ues.append("Administrer")
                    if any(x in text_lower for x in ["programmation", "code", "python", "algorithme", "web"]):
                        ues.append("Programmer")
                    if any(x in text_lower for x in ["sécurité", "hygiène", "cryptographie", "vpn", "firewall"]):
                        ues.append("Sécuriser")
                    
                    if not ues:
                        ues = ["Administrer"]
                    
                    semestre = 1 if code.startswith("R1") else 2
                    
                    courses[code] = {
                        "titre": title,
                        "ue": list(set(ues)),
                        "semestre": semestre,
                        "competences": keywords[:5],
                        "description": text.split("Objectifs")[0].split(title)[-1].strip() if "Objectifs" in text else ""
                    }
                    
                    print(f"Extrait : {code} - {title}")
                    break

    # Sauvegarde
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(courses, f, indent=4, ensure_ascii=False)
    
    print(f"\nTotal : {len(courses)} ressources extraites vers {output_file}")

if __name__ == "__main__":
    import os
    extract_courses()
