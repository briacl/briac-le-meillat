import os

base_dir = "/home/briacl/Development/briac-le-meillat/briac-le-meillat/public/assets/documents/apprentissage/NetworkBriac"

files = [
    {
        "name": "NetworkBriacRoomGtw.md",
        "title": "Passerelle Linux et Serveur Central",
        "module": "R103",
        "competence": "Administrer",
        "ac_lies": "AC11.04",
        "techs": "Linux, Routage, Passerelle",
        "reference_tp": "Inspiré par le TP Passerelle Linux (R201)"
    },
    {
        "name": "partage-reseau.md",
        "title": "Partage Réseau Local (Samba/SMB)",
        "module": "R103",
        "competence": "Administrer",
        "ac_lies": "AC11.04",
        "techs": "Samba, SMB, Linux",
        "reference_tp": "Inspiré par le TP Interopérabilité des systèmes (Samba)"
    },
    {
        "name": "NetworkBriacProxy.md",
        "title": "Proxy Squid Forward & SSL-Bump",
        "module": "R103",
        "competence": "Administrer",
        "ac_lies": "AC11.04",
        "techs": "Squid, Proxy, SSL",
        "reference_tp": "Inspiré par les TPs de Bases des Services Réseaux"
    },
    {
        "name": "stbernard.md",
        "title": "Virtualisation ESXi - Infrastructure St Bernard",
        "module": "R103",
        "competence": "Administrer",
        "ac_lies": "AC11.01",
        "techs": "ESXi, Virtualisation",
        "reference_tp": "Inspiré par les SAEs et TPs de Virtualisation"
    },
    {
        "name": "NBDomain-Etablissement.md",
        "title": "Windows Server (AD DS) - Domaine Établissement",
        "module": "R103",
        "competence": "Administrer",
        "ac_lies": "AC11.04",
        "techs": "Windows Server, AD DS",
        "reference_tp": "Inspiré par le TP Administration Système Windows Server 2016"
    },
    {
        "name": "NBPXE.md",
        "title": "Déploiement Automatique PXE",
        "module": "R103",
        "competence": "Administrer",
        "ac_lies": "AC11.03",
        "techs": "PXE, DHCP, TFTP",
        "reference_tp": "Inspiré par le TP Serveur de Boot PXE"
    }
]

for f_info in files:
    filepath = os.path.join(base_dir, f_info["name"])
    if not os.path.exists(filepath):
        print(f"File {filepath} not found.")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if content.startswith("---"):
        print(f"File {f_info['name']} already has frontmatter. Skipping or modifying manually.")
        continue
        
    frontmatter = f"""---
title: "{f_info['title']}"
module: "{f_info['module']}"
competence: ["{f_info['competence']}"]
ac_lies: ["{f_info['ac_lies']}"]
project_type: "perso"
techs: [{', '.join(['"' + t.strip() + '"' for t in f_info['techs'].split(',')])}]
reference_tp: "{f_info['reference_tp']}"
date: "2026-06-01"
status: "Terminé"
image: ""
---

"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter + content)
    
    print(f"Added frontmatter to {f_info['name']}")
