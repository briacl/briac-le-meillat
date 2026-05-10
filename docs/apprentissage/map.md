

admin system
Windows : 
- j'ai pu installer windows sur un ordinateur pour quelqu'un (tout début découverte informatique)
- gestion d'un domaine constitué d'un server et d'un client
Linux :
- pour mon LAN, j'ai apptis à installer Linux Ubuntu pour être sur une config similaire à celle des machines de l'IUT
- on a étudié la virtualisation (VirtualBox, VMWare ESXI, Docker)

admin réseau
- analyse trame via Wireshark
- cartographie basique LAN & VLAN
- réalisation LAN Homelab (NetworkBriac)
- mise en place de serveur DHCP, DNS, Web sur NetworkBriac
- sae102 : mise en oeuvre réseau informatique :
    - maquette Cisco Packet Tracer
        - mise en place VLAN
        - installation services web (apache), DHCP, DNS
    - compte-rendu maquette
    - maquette in live avec RT2 (étudiants RT de 2e année, qui allaient récupérer notre réalisation pour leur projet important à eux)
- base des services réseaux :
    - services web (apache, nginx)
- technologies de l'Internet :
    - découverte configuration routeur Cisco
    
Semestre 1

r101 : initiation aux réseaus informatiques

r102 : principes et architecture des réseaux
- bases encapsulation, protocoles
Approche en couches et encapsulation.
Étude détaillée des protocoles Ethernet, ARP, ICMP.
Découverte des protocoles IPv4, TCP, UDP et des protocoles applicatifs.
Topologies de réseaux (bus, anneau, étoile).
Principes de normalisation des technologies de l'Internet.
Notions sur les métriques de performances : 
débit : le nombre de données numériques (bits) transmises ou reçues sur une unité de temps (seconde)
fiabilité : assurance de la livraison des données au destinataire
gigue (packet jitter or packet delay variation en anglais)  : variation de temps d'acheminement des paquets d'informations à travers un réseau
taux de pertes : pourcentage de paquets perdus par rapport aux paquets envoyés
=> repo github reseau
=> sae102

r103 : réseaux locaux et équipements actifs
=> dossier briac-le-meillat/public/assets/documents/apprentissage/admin-reseau
=> sae102

r104 : fondamentaux des systèmes électroniques

r105 : supports de transmission pour les réseaux
=> sae103

r106 : architecture des systèmes numériques et informatiques
- système binaire
- bases python binaire
- bases crypto

r107 : fondamentaux de la programmation
- python
=> Python Essential 1 & 2
=> sae105 - traiter des données

r108 : base de systèmes d'exploitation
- bases linux (commandes)

r109 : introduction aux technologies web
- bases html/Css
=> sae104 - se présenter sur internet : création de site web portfolio à partir d'un template bootstrap

r113 : maths du signal

r114 : maths des transmissions

sae101 : se sensibiliser à l'hygiène informatique et à la cybersécurité
=> MOOC ANSII Certification

Semestre 2

r201 : technologie de l'Internet

r202 : admin system et fondamentaux de la virutalisation
Windows : 
- gestion d'un domaine constitué d'un server et d'un client
Linux :
- on a étudié la virtualisation (VirtualBox, VMWare ESXI, Docker)

r203 : bases des services réseaux
- services web (apache, nginx)

r204 : initiation à la téléphonie d'entreprise
- server asterisk et tftp

r205 : signaux et systèmes pour les transmissions

r206 : numérisation de l'information
- sujet de l'échantillonnage

r207 : source de données
- bdd

r208 : analyse et traitement de données structurées
- python

r209 : initiation au dev web

r213 : maths des systèmes numériques

r214 : maths des transmissions

sae201 : construire un réseau informatique pour une petite structure
sae202 : mesurer et caractériser un signal ou un système
sae203 : mettre en place une solution informatique pour l'entreprise
sae204 : projet intégratif




documents/apprentissage/
├── 🔴_administrer (Admin Sys & Virtu)
│   ├── windows-server/
│   ├── linux-base/
│   └── virtualisation/ (Docker, VMware, VirtualBox)
├── 🟠_connecter (Réseau & Télécom)
│   ├── switching-vlan/
│   ├── routage-cisco/
│   ├── services-reseau/ (DHCP, DNS, Web)
│   ├── sae-102-pme/
│   └── telephonie/
└── 🟡_programmer (Dev & Data)
    ├── python-automation/
    ├── web-dev/
    └── analyse-donnees/

Pour que ton site sache comment afficher un TP (Titre, Module, Technos) sans que tu aies à modifier ton code data.json à chaque fois, utilise le Frontmatter en haut de tes fichiers .md.

Ajoute ceci au début de chaque compte-rendu :
---
title: "SAE 1.02 : Déploiement Infrastructure PME"
module: "R103 / SAE102"
competence: "Connecter"
ac_lies: ["AC11.01", "AC11.02"]
techs: ["Cisco", "VLAN", "Packet Tracer"]
date: "2026-03-28"
status: "Terminé"
---

Le bénéfice : Ton IA pourra coder un script qui lit ces lignes pour générer automatiquement les vignettes dans la modale "Administrer"  et dans ton flux de "Derniers TP ajoutés"

Voici comment lier tes cours aux 3 piliers pour ton organisation :CompétenceModules S1/S2 associésTypes de preuves (Fichiers MD)🔴 AdministrerR108, R202Installation Linux/Win, Docker, Gestion de Domaine, Shell.🟠 ConnecterR101, R102, R103, R201, R203, R204SAE 102, Config Routeur, Wireshark, Services Web, Asterisk.🟡 ProgrammerR106, R107, R109, R207, R208, R209Scripts Python, BDD SQL, Portfolio Web, Analyse de données.

Pour que ton organisation soit "intelligente" comme tu le souhaitais, utilise ce système de tags dans tes fichiers .md:Type de contenuDossier conseilléTag Frontmatter competenceSAE 1.02 /apprentissage/sae102/Connecter Virtualisation /apprentissage/virtualisation/Administrer Python / SAE 1.05/apprentissage/programmer/Programmer Services Web (Apache) /apprentissage/bases-services/Connecter ou Administrer

Pourquoi c'est la meilleure solution ?Gain de temps : Tu finis ton TP, tu lances le script, tu push. Ton site est à jour.Performance : Ton site ne cherche pas dans le vide, il lit une liste déjà prête.Propreté : Ta prof voit une structure académique par AC, mais le recruteur voit un flux de travail moderne dès la page d'accueil

