import os
import re

base_dir = "/home/briacl/Development/briac-le-meillat/briac-le-meillat/public/assets/documents/apprentissage"

updates = {
    "admin-reseau/vlan/tp1-vlan.md": {"module": '"R103"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.03", "AC11.05", "AC12.03"]', "techs": '["Cisco", "Switch", "VLAN", "CLI"]'},
    "admin-reseau/vlan-router/tp2-vlan-router.md": {"module": '"R103"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.03", "AC11.05", "AC12.03"]', "techs": '["Cisco", "Routeur", "VLAN", "Routage"]'},
    "admin-reseau/spanning-tree/tp3-spanning-tree.md": {"module": '"R103"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.03", "AC11.05", "AC12.03"]', "techs": '["Cisco", "Switch", "STP", "Redondance"]'},
    "admin-reseau/etherchannel/tp4-etherchannel.md": {"module": '"R103"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.03", "AC11.05", "AC12.03"]', "techs": '["Cisco", "Switch", "Etherchannel", "LACP"]'},
    
    "tech-internet/tp1-switch_routeurs.md": {"module": '"R201"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.03", "AC11.05"]', "techs": '["Cisco", "Switchs", "Routeurs", "CLI"]'},
    "tech-internet/tp2-passerelle_linux.md": {"module": '"R201"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.04", "AC11.03"]', "techs": '["Linux", "Passerelle", "Routage", "NAT"]'},
    "tech-internet/tp4-routage_rip_ospf.md": {"module": '"R201"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.03", "AC12.03"]', "techs": '["OSPF", "RIP", "Cisco", "Routage Dynamique"]'},
    "tech-internet/tp6-tcp_udp.md": {"module": '"R201"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.02", "AC11.05"]', "techs": '["TCP", "UDP", "Wireshark", "Analyse Réseau"]'},
    "tech-internet/tp7-ACL.md": {"module": '"R201"', "competence": '["Administrer", "Sécuriser"]', "ac_lies": '["AC11.03"]', "techs": '["ACL", "Cisco", "Filtrage", "Sécurité"]'},
    "tech-internet/tp9-filtrage-linux.md": {"module": '"R201"', "competence": '["Administrer", "Sécuriser"]', "ac_lies": '["AC11.04"]', "techs": '["Linux", "iptables", "Filtrage", "Pare-feu"]'},
    "tech-internet/tp10-ipv6.md": {"module": '"R201"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.03", "AC12.03"]', "techs": '["IPv6", "Cisco", "Adressage"]'},
    "tech-internet/tp11-routage-inter-vlan.md": {"module": '"R201"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.03", "AC12.03"]', "techs": '["Cisco", "VLAN", "Routage Inter-VLAN"]'},
    
    "admin-reseau-windows/tp-admin-system-windows-server.md": {"module": '"R202"', "competence": '["Administrer", "Sécuriser"]', "ac_lies": '["AC11.04", "AC11.05"]', "techs": '["Windows Server", "Active Directory", "DHCP", "GPO", "PowerShell", "NTFS"]'},
    
    "bases-services-reseaux/tp-apache-nginx.md": {"module": '"R203"', "competence": '["Administrer"]', "ac_lies": '["AC11.04"]', "techs": '["Linux", "Apache", "Nginx", "Serveur Web"]'},
    "bases-services-reseaux/tp-dhcp-tftp-pxe.md": {"module": '"R203"', "competence": '["Administrer", "Connecter"]', "ac_lies": '["AC11.03", "AC11.04"]', "techs": '["DHCP", "TFTP", "PXE", "Linux"]'},
    "bases-services-reseaux/tp-samba.md": {"module": '"R203"', "competence": '["Administrer"]', "ac_lies": '["AC11.04"]', "techs": '["Linux", "Samba", "Partage Réseau", "SMB"]'},
    "bases-services-reseaux/complement-revision.md": {"module": '"R203"', "competence": '["Administrer"]', "ac_lies": '["AC11.04"]', "techs": '["Linux", "Services"]'},
    
    "telephonie/tp2.md": {"module": '"R204"', "competence": '["Administrer", "Programmer", "Connecter"]', "ac_lies": '["AC11.04", "AC12.04"]', "techs": '["Asterisk", "SIP", "IVR", "VoIP"]'},
    
    "dev-web/tp1/tp1-intro-html-css.md": {"module": '"R209"', "competence": '["Programmer"]', "ac_lies": '["AC13.04"]', "techs": '["HTML5", "CSS3", "Web"]'},
    "dev-web/tp2/tp2-flask.md": {"module": '"R209"', "competence": '["Programmer"]', "ac_lies": '["AC13.04", "AC13.05"]', "techs": '["Python", "Flask", "Jinja2", "Web"]'},
    "dev-web/tp2/perso/tp2-flask-wsl.md": {"module": '"R209"', "competence": '["Programmer"]', "ac_lies": '["AC13.04", "AC13.05"]', "techs": '["Python", "Flask", "Jinja2", "Web"]'},
    "dev-web/tp3/tp3-flask.md": {"module": '"R209"', "competence": '["Programmer"]', "ac_lies": '["AC13.04", "AC13.05"]', "techs": '["Python", "Flask", "Web", "Développement"]'},
    "dev-web/tp3/perso/tp-flask-lama.md": {"module": '"R209"', "competence": '["Programmer"]', "ac_lies": '["AC13.04", "AC13.05"]', "techs": '["Python", "Flask", "Web", "Développement"]'},
    "dev-web/tp4/tp4-intro-cyber.md": {"module": '"R209"', "competence": '["Sécuriser"]', "ac_lies": '[]', "techs": '["Cybersécurité", "Web", "Vulnérabilités", "OWASP"]'},
    
    "r207-source_donnees/cheat-sheet.md": {"module": '"R207"', "competence": '["Programmer"]', "ac_lies": '["AC13.05"]', "techs": '["SQL", "Bases de Données", "Requêtes"]'}
}

for rel_path, data in updates.items():
    full_path = os.path.join(base_dir, rel_path)
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        continue
    
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We only want to replace within the first YAML frontmatter block
    parts = content.split("---", 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        
        # Replace the specific lines
        for key, value in data.items():
            # Match the key exactly and replace its value
            pattern = rf"^({key}:\s*).*$"
            if re.search(pattern, frontmatter, re.MULTILINE):
                frontmatter = re.sub(pattern, rf"\g<1>{value}", frontmatter, flags=re.MULTILINE)
            else:
                # If key doesn't exist, append it (unlikely given the current state, but safe)
                frontmatter += f"{key}: {value}\n"
                
        parts[1] = frontmatter
        new_content = "---".join(parts)
        
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated: {rel_path}")
    else:
        print(f"No valid frontmatter found in {rel_path}")

print("Done.")
