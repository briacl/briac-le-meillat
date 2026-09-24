import json
import os

with open("briac-le-meillat/public/data/registry.json", "r") as f:
    data = json.load(f)

network_tps = []
homelab_projects = []

for proof in data['proofs']:
    path = proof.get('path', '')
    title = proof.get('title', '')
    module = proof.get('module', '')
    ac_lies = ", ".join(proof.get('ac_lies', []))
    
    entry = f"- **{title}**\n  - *Ressource* : {module}\n  - *ACs* : {ac_lies if ac_lies else 'Aucun'}"
    
    if 'NetworkBriac' in path or 'homelab' in path.lower() or 'perso' in path.lower():
        homelab_projects.append(entry)
    
    # Network topics
    if any(k in path for k in ['admin-reseau', 'r101', 'r102', 'tech-internet', 'virtualisation', 'bases-services-reseaux', 'telephonie', 'sae23', 'sae102']):
        network_tps.append(entry)

out_file = "/home/briacl/.gemini/antigravity/brain/50a8250a-2d88-44cf-89aa-b32bca792678/scratch/research_notes.md"
os.makedirs(os.path.dirname(out_file), exist_ok=True)
with open(out_file, "w") as f:
    f.write("# Rapport des TPs Réseaux et Projets Homelab\n\n")
    f.write("## 🌐 TPs Réseaux (IUT)\n\n")
    f.write("\n".join(network_tps))
    f.write("\n\n## 🏠 Projets Homelab & Perso\n\n")
    f.write("\n".join(homelab_projects))

