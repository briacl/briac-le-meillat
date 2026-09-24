# Référentiel des Compétences & Projets Associés

Ce document dresse la cartographie exacte entre les Apprentissages Critiques (AC) du cursus R&T et les projets (scolaires ou personnels) réalisés pour les acquérir et les consolider. Il permet d'avoir une vision claire des réalisations à mettre en avant pour prouver l'acquisition d'une compétence.

---

## 🛠️ COMPÉTENCE 1 — ADMINISTRER (Réseaux de l'entreprise)

### AC11.01 — Configurer les fonctions de base du réseau local
- **TP1 (R103) :** Segmentation VLAN + Trunking 802.1Q (Cisco)
- **TP2 (R103) :** Routage Inter-VLAN (Router-on-a-Stick)
- **TP3 (R103) :** Spanning Tree Protocol (STP / RSTP)
- **TP4 (R103) :** Agrégation de liens (EtherChannel / LACP)
- **Projet SAÉ 1.02 :** Déploiement d'infrastructure PME complète (VLANs, Routage, Sécurité)

### AC11.02 — Maîtriser les interconnexions
- **TP PXE (R203) :** Boot réseau automatisé sans stockage local (Dnsmasq, DHCP, TFTP, NFS)
- **Projet Homemade — Homelab LAN :** Infrastructure physique isolée avec serveurs DHCP et DNS dédiés.

### AC11.03 — Identifier les dysfonctionnements du réseau local
- **TP2 Diagnostic (R103) :** Résolution de pannes de routage Inter-VLAN (Asymétrie config Niveau 2 / Niveau 3).
- *(Notions de diagnostic intégrées également lors des labos STP et EtherChannel)*

### AC11.05 — Déployer des postes dans un domaine
- **TP Administration (R202) :** Windows Server 2016 (AD DS, Scripts de connexion NETLOGON, Déploiement GPO, partages NTFS).
- **Automatisation Active Directory :** Scripts PowerShell complets pour la création d'utilisateurs et de droits en masse.
- **TP Virtualisation (R202) :** Analyse et comparaison des Hyperviseurs (Type 1 vs Type 2).

---

## 🌐 COMPÉTENCE 2 — CONNECTER (Réseaux d'opérateurs)

### AC12.01 — Maîtriser les technologies des réseaux locaux et étendus
- **TP1 & TP4 (R103) :** Commandes CLI Cisco, Routage dynamique (RIPv2, OSPF Single-Area Backbone).
- **TP2 (R103) :** Passerelle Linux (IP Forwarding & NAT/Masquerade via le noyau).
- **TP6 (R101) :** Capture et dissection réseau bas niveau (Wireshark, TCP 3-way handshake, UDP, Nmap).
- **TP7 & TP8 (R201) :** Sécurité via Listes de Contrôle d'Accès (ACL Cisco) et NAT/PAT (Surcharge de ports).
- **TP9 (R201) :** Filtrage avancé Linux (Netfilter : pare-feux en iptables & nftables).

### AC12.02 — Maîtriser les fondamentaux des systèmes d'exploitation
- **TP2 & TP4 (R103) :** Gestion du routage au sein du noyau Linux (sysctl, interfaces, tables de routage croisées Cisco/Linux).
- **Révisions (R205) :** Mathématiques de la transmission, traitement du signal physique et limites fréquentielles.

### AC12.03 — Identifier les niveaux de risques liés à la sécurité
- **TP Serveurs Web (R203) :** Sécurisation Apache2/Nginx, cloisonnement des permissions, gestion des Virtual Hosts.
- **TP Asterisk (R204) :** Architecture VoIP, isolation de la signalisation (SIP) et des flux voix (RTP).
- **Projet Homemade — NetworkBriac Proxy :** Déploiement de proxy Squid avec **SSL-Bump** (Interception et déchiffrement HTTPS dynamique), génération d'autorité de certification CA et règles de filtrage HTTP.

### AC12.04 — Communiquer, travailler en équipe
- **Documentation R203 :** Rédaction collaborative de documentation technique système d'hébergement.
- **SAÉ 1.03 :** Mesures de transmission physique (Coaxial / LTSpice / MATLAB) et partage asynchrone des résultats.

---

## 💻 COMPÉTENCE 3 — PROGRAMMER

### AC13.01 — Utiliser un système informatique et ses outils
- **TP Flask (R209) :** Création d'une API REST backend, Authentification via token JWT, requêtage base de données MySQL.
- **TP MVC (R209) :** Architecture logicielle Modèle-Vue-Contrôleur en Python, ORM SQLAlchemy, templates Jinja2.
- **TP PostgreSQL (R207) :** Modélisation relationnelle rigoureuse et requêtes SQL complexes.
- **Projet SAÉ 2.3 — MiniGPT :** Développement Full-Stack et conteneurisation Docker (Backend Flask, Base MySQL, Interface web TailwindCSS).

### AC13.02 — Lire, exécuter, corriger et modifier un programme
- **Projet Homemade — NotGoogle :** Création d'un mini-navigateur web en Python brut en manipulant les **Sockets TCP** (Forçage manuel de requêtes HTTP et handshake TLS sans abstraction).
- **Projet Homemade — Readme Generator & CLI :** Scripting d'automatisation terminal avec interprétation du code couleur ANSI.

### AC13.05 — Choisir les mécanismes de gestion de données adaptés
- **SAÉ 1.05 :** Nettoyage, parsing (fichiers massifs CSV/JSON) et visualisation de données avec Python.
- **SAÉ 1.04 / Portfolio :** Création de l'interface graphique du portfolio originel (HTML5/CSS3/Bootstrap), illustrant le lien entre la donnée brute et son affichage optimisé.

---

## 🚀 Projets "Homemade" Majeurs pour le CV

*Ces projets prouvent la capacité à faire le lien entre différentes compétences de manière autonome.*

1. **NetworkBriac (L'Architecture de bout en bout) :** 
   Création d'un routeur/passerelle Linux physique isolant un réseau (nftables), hébergeant son propre résolveur DNS autoritatif (Bind9), distribuant les baux (DHCP) et filtrant les accès HTTPS sortants via un proxy (Squid SSL-Bump).
2. **NotGoogle (L'Ingénierie Inverse) :** 
   Abandon des bibliothèques haut niveau (comme `requests`) pour coder l'échange réseau à l'échelle du segment TCP et du paquet IP en Python pur.
3. **Automatisation Active Directory :** 
   Passage de l'administration système "clic bouton" à du déploiement as-code (Scripting PowerShell avancé) pour la gestion d'un domaine Windows.
