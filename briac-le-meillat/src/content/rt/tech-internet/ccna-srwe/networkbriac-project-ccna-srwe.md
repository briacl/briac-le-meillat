---
title: "CCNA SRWE Project NetworkBriac"
module: "R201"
competence: "Connecter"
ac_lies: ["AC11.03"]
project_type: "perso"
techs: ["Shell", "DHCP", "VLAN", "Cisco", "NAT"]
date: "2026-06-04"
status: "Terminé"
image: "/assets/projects/ccna-srwe-project-networkbriac.png"
---
# 🌐 Projet NetworkBriac — Dossier d'Architecture & Sécurité

## 1. Contexte, Introduction et Objectifs de l'Architecture

L'objectif du projet **NetworkBriac** est de concevoir et simuler une infrastructure réseau d'entreprise miniature, directement inspirée par les architectures "Homelab" avancées. 

Il ne s'agit pas d'un simple exercice de connectivité, mais de la mise en place d'une véritable **DMZ (Zone Démilitarisée) logique**. L'infrastructure permet d'exposer des services de manière sécurisée vers l'extérieur (serveur Web), tout en appliquant une ségrégation stricte des flux internes pour protéger la zone d'administration. Ce laboratoire valide les concepts de commutation de niveau 2 (VLANs, Trunks), de routage inter-VLAN (Router-on-a-Stick), de translation d'adresses (NAT/PAT) et de contrôle d'accès (ACL).

Dans cette optique, ce document présente l'architecture réseau sécurisée mise en place sur le simulateur Cisco Packet Tracer. L'objectif principal est de concevoir une infrastructure d'hébergement et d'administration respectant les principes de cloisonnement, de moindre privilège et de sécurité périmétrique (*Zero Trust*), tout en simulant une exposition de services sur un réseau public (Internet).

L'architecture sépare distinctement les flux utilisateurs, les ressources applicatives et les entités externes grâce à une segmentation logique stricte et un contrôle d'accès rigoureux en périphérie.

---

## 2. Segmentation Logique : L'Utilité des VLANs

Dans le cadre de **NetworkBriac**, la segmentation logique joue un rôle fondamental pour isoler les différents niveaux de confiance. Le réseau est ainsi divisé en zones isolées par des VLANs, dont les flux sont filtrés par le routeur de bordure (`R-Border`).

La mise en place de ces réseaux locaux virtuels (VLANs) répond à trois exigences fondamentales de l'ingénierie réseau :

*   **Sécurité et Isolation (Cloisonnement) :** Par défaut, les équipements situés dans des VLANs différents ne peuvent pas communiquer entre eux au niveau 2 (Liaison), même s'ils sont branchés sur le même commutateur physique. Cela empêche une machine compromise dans la zone des serveurs (DMZ) de sniffer le trafic ou d'attaquer directement la station d'administration.
*   **Réduction des Domaines de Diffusion (Broadcast) :** Les messages de diffusion (comme les requêtes ARP ou DHCP) sont cantonnés à leur VLAN respectif. Cela optimise la bande passante globale et améliore les performances des équipements en limitant le traitement des paquets inutiles.
*   **Flexibilité et Structure :** Les ressources sont regroupées par rôle logique (Administration vs Services) et non par contrainte géographique, facilitant l'application de politiques de sécurité centralisées sur le routeur.

### Les VLANs configurés

*   **VLAN 10 (`SERVERS`) :** Zone d'hébergement des services d'infrastructure et applicatifs (DHCP, DNS, Web). Elle agit comme une DMZ (Zone Démilitarisée) interne.
*   **VLAN 99 (`ADMIN-ZONE`) :** Zone hautement sécurisée réservée aux stations d'administration et de gestion de l'infrastructure.

---

## 3. Plan d'Adressage IP Fonctionnel & Philosophie

Le plan de réseau adopte une structure normalisée où les premières adresses disponibles de chaque sous-réseau sont réservées aux passerelles par défaut et aux serveurs statiques. Le choix des adresses IP respecte les standards de l'IETF pour concilier la réalité d'un réseau local domestique avancé (Homelab) et un déploiement en production.

### Réseaux Internes (LAN) : Norme RFC 1918
*   **Choix :** Utilisation du bloc `192.168.0.0/16` réparti en sous-réseaux `/24` (précisément `192.168.10.0/24` et `192.168.99.0/24`).
*   **Justification :** Ce choix est fidèlement inspiré de la configuration d'un Homelab physique intégré derrière une passerelle résidentielle ou un routeur dédié. L'attribution de ces blocs distincts permet de structurer de manière étanche les différentes fonctions du réseau local sans complexifier l'analyse des masques.

### Réseau Externe (Simulation Internet / WAN) : Norme RFC 5737
*   **Choix :** Utilisation du bloc `203.0.113.0/24` (TEST-NET-3).
*   **Justification :** Lors de la simulation d'une patte publique (WAN), il est techniquement incorrect d'utiliser des adresses IP privées ou des adresses publiques arbitraires (au risque de créer des conflits de routage). Ce bloc est officiellement réservé par l'IANA pour les architectures de test et la documentation, démontrant une rigueur dans le respect des standards internet.

### Matrice d'adressage de la maquette

| Zone / Équipement | Interface / VLAN | Adresse IP | Masque de sous-réseau | Passerelle par défaut | Type d'allocation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Routeur (R-Border)** | Gi0/0.10 (LAN) | `192.168.10.1` | `255.255.255.0` | N/A | Statique |
| **Routeur (R-Border)** | Gi0/0.99 (LAN) | `192.168.99.1` | `255.255.255.0` | N/A | Statique |
| **Routeur (R-Border)** | Gi0/1 (WAN) | `203.0.113.1` | `255.255.255.0` | N/A | Statique (IP Publique) |
| **Server-DHCP** | VLAN 10 | `192.168.10.2` | `255.255.255.0` | `192.168.10.1` | Statique |
| **Server-DNS** | VLAN 10 | `192.168.10.3` | `255.255.255.0` | `192.168.10.1` | Statique |
| **Server-Web** | VLAN 10 | `192.168.10.4` | `255.255.255.0` | `192.168.10.1` | Statique |
| **Laptop-Admin** | VLAN 99 | `192.168.99.50` | `255.255.255.0` | `192.168.99.1` | Dynamique (DHCP) |
| **Laptop-Externe** | Externe (Internet) | `203.0.113.50` | `255.255.255.0` | `203.0.113.1` | Statique |

---

## 4. Configurations Techniques Réalisées et Rationales

### A. Routage Inter-VLAN (Router-on-a-Stick)

Le commutateur `SW-Core` concentre les VLANs et les achemine vers le routeur via un lien d'agrégation unique (Trunk 802.1Q sur `Gi0/1`). Le routeur `R-Border` segmente son interface physique `Gi0/0` en sous-interfaces logiques (`Gi0/0.10` et `Gi0/0.99`) pour assurer le routage entre les sous-réseaux.

### B. Relais DHCP (ip helper-address)

Le serveur DHCP réside dans le VLAN 10 alors que les stations clientes se trouvent dans le VLAN 99. Les requêtes DHCP initiales étant des diffusions (*broadcasts*), elles sont bloquées par les frontières de couche 3 du routeur.

La commande `ip helper-address 192.168.10.2` configurée sur la sous-interface `Gi0/0.99` intercepte ces diffusions, les encapsule dans un paquet de monodiffusion (*unicast*) et les relaie directement au serveur DHCP, garantissant la centralisation de la distribution IP.

### C. NAT Statique (Port Forwarding)

Afin de rendre le serveur Web privé (`192.168.10.4`) accessible depuis l'Internet simulé sans exposer l'adresse interne, une translation d'adresse source statique a été configurée :

```cisco
ip nat inside source static tcp 192.168.10.4 80 203.0.113.1 80
```

Toute requête ciblant l'IP publique `203.0.113.1` sur le port HTTP (80) est automatiquement translatée vers le serveur Web de la DMZ.

### D. Sécurité Périmétrique et ACL "Pré-NAT"

Le pare-feu applique une politique de sécurité stricte par défaut (*Deny All*). La Liste de Contrôle d'Accès (ACL) étendue est positionnée en entrée (*in*) sur l'interface Internet `Gi0/1`.

> [!IMPORTANT]
> **Choix architectural crucial :** Sous l'environnement Cisco IOS, l'ordre de traitement des paquets entrants stipule que l'ACL de l'interface externe est analysée avant l'application de la translation NAT. Par conséquent, pour autoriser le trafic web externe, l'ACL doit cibler l'IP publique de destination (`203.0.113.1`) et non l'IP privée réelle du serveur.

```cisco
ip access-list extended FIREWALL-ACL
 permit tcp any host 203.0.113.1 eq www
 permit tcp host 203.0.113.50 any eq 22
 deny ip any any
```

Ce mécanisme permet au `Laptop-Externe` d'initier une session HTTP légitime tout en interdisant formellement l'utilisation des requêtes de diagnostic ICMP (*Pings*) vers l'infrastructure.

---

## 5. Protocole de Recette pour Validation (Tests Enseignant)

Voici les scénarios pas-à-pas que l'enseignant peut exécuter pour valider la conformité opérationnelle de la maquette :

### Test 1 : Validation de l'allocation dynamique inter-VLAN
*   **Manipulation :** Aller sur le `Laptop-Admin`, ouvrir l'onglet **Desktop** > **IP Configuration**, basculer en mode **Static** puis réactiver le mode **DHCP**.
*   **Résultat attendu :** Statut *"DHCP request successful"*. Le terminal doit obtenir une adresse en `192.168.99.X` (généralement `.50`), prouvant le bon fonctionnement du serveur DHCP (VLAN 10) et du relais configuré sur le routeur.

### Test 2 : Validation de la résolution DNS interne et de l'accès Web LAN
*   **Manipulation :** Depuis le `Laptop-Admin`, ouvrir le **Web Browser** et saisir l'URL : `http://www.networkbriac.local`.
*   **Résultat attendu :** La page web d'administration personnalisée s'affiche avec succès. Cela valide la résolution du nom via le `Server-DNS` (`192.168.10.3`), l'hébergement du `Server-Web` (`192.168.10.4`) et le routage inter-VLAN.

### Test 3 : Validation de l'accès externe contrôlé (NAT)
*   **Manipulation :** Aller sur le `Laptop-Externe` (Zone Internet), ouvrir le **Web Browser** et saisir l'IP publique : `http://203.0.113.1`.
*   **Résultat attendu :** Le site web s'affiche correctement, démontrant que la règle de NAT statique fonctionne et que l'ACL autorise le flux HTTP extérieur.

### Test 4 : Validation de la sécurité périmétrique (Filtrage ICMP)
*   **Manipulation :** Depuis le **Command Prompt** du `Laptop-Externe`, tenter de pinger le routeur ainsi que le serveur web :
    ```cmd
    ping 203.0.113.1
    ping 192.168.10.4
    ```
*   **Résultat attendu :** Tous les pings échouent avec le message `Reply from 203.0.113.1: Destination host unreachable`. Cela prouve l'étanchéité de l'ACL qui détruit silencieusement les paquets non autorisés.

---

## 6. Implémentation et Validation de l'Accès Distant Sécurisé (SSH)

Afin de permettre l'administration de l'infrastructure à distance sans compromettre la confidentialité des identifiants (contrairement au protocole Telnet qui transmet en clair), un accès SSH (*Secure Shell*) a été mis en place sur le routeur de bordure.

### A. Configuration de l'environnement cryptographique et des accès

Pour que le routeur puisse générer des clés de chiffrement asymétriques (RSA), il nécessite impérativement un nom d'hôte unique et un nom de domaine. Un compte d'administration local avec les privilèges maximaux (Niveau 15) a ensuite été créé pour s'affranchir du mot de passe global.

**Commandes appliquées sur `R-Border` :**

```cisco
! 1. Prérequis d'identification pour la cryptographie
hostname R-Border
ip domain-name networkbriac.local

! 2. Génération de la paire de clés RSA (Module de 1024 bits pour une sécurité standard)
crypto key generate rsa

! 3. Création du compte administrateur local avec privilèges complets et mot de passe fort
username NetworkBriac privilege 15 password C!sco123@networkbriac

! 4. Sécurisation des terminaux virtuels (VTY)
line vty 0 4
 login local
 transport input ssh
exit
```

### B. Protocole de Recette : Validation de l'administration externe

Le pare-feu (ACL `FIREWALL-ACL`) ayant été préalablement configuré pour autoriser le port TCP 22 en provenance exclusive de l'IP `203.0.113.50`, le test a été réalisé depuis cette station distante.

*   **Manipulation :** Depuis l'invite de commande (*Command Prompt*) du `Laptop-Externe` (simulant une connexion Internet), la commande d'ouverture de session a été lancée :
    ```cmd
    ssh -l NetworkBriac 203.0.113.1
    ```
*   **Résultat obtenu :** Le routeur a correctement demandé le mot de passe, et l'accès privilégié (`R-Border#`) a été accordé instantanément.
*   **Conclusion :** L'administration à distance est fonctionnelle, chiffrée, et l'usurpation depuis une autre adresse IP publique reste bloquée par la politique de filtrage périmétrique.

---

## 7. Ségrégation des Services Web (Approche "Zero Trust" Interne)

Afin de garantir une sécurité maximale, l'architecture héberge deux portails Web distincts, séparant drastiquement l'accès public de l'interface d'administration.

### A. Le Portail Public (Accessible depuis Internet)
*   **Équipement :** `Server-Web` (`192.168.10.4`)
*   **Exposition :** Règle de NAT Statique liant le port 80 de l'IP publique (`203.0.113.1`) au serveur.
*   **Filtrage (ACL) :** Autorise le trafic HTTP entrant depuis n'importe quelle source (`any`).
*   **Validation :** Depuis le `Laptop-Externe`, l'URL `http://203.0.113.1` affiche la page publique.

### B. Le Portail d'Administration (Strictement Interne)
*   **Équipement :** `Server-Admin` (`192.168.10.5`)
*   **Exposition :** Aucune. Le serveur ne possède pas de translation NAT. Il est invisible depuis le réseau WAN.
*   **Filtrage & Routage :** L'accès repose exclusivement sur le routage inter-VLAN. L'ACL bloque toute tentative de connexion directe depuis l'extérieur vers cette IP privée.
*   **Validation croisée :**
    *   Depuis le `Laptop-Externe` (Internet), l'URL `http://192.168.10.5` renvoie un *Request Timeout* (trafic bloqué et non routable).
    *   Depuis le `Laptop-Admin` (VLAN 99), l'URL `http://192.168.10.5` affiche la page *"ADMIN - Acces Restreint"*.

> [!NOTE]
> Cette méthode garantit que l'interface de gestion reste à l'abri des scans de ports et des attaques par déni de service provenant d'Internet.

---

## 8. Variante Expérimentale : Accès Nomade Sécurisé (Port Obfuscation & Whitelisting)

Après avoir validé l'approche d'isolation totale (*Zero Trust* interne via l'IP `192.168.10.5`), une seconde approche a été configurée et testée avec succès pour permettre l'administration du serveur depuis l'extérieur, sans pour autant compromettre la sécurité globale.

### A. Le Concept Technique
L'objectif est d'exposer le `Server-Admin` sur Internet en utilisant un port non standard (8080) afin de masquer le service (obfuscation), tout en restreignant mathématiquement l'accès à une seule adresse IP publique autorisée via le pare-feu (Whitelisting).

### B. Configuration Déployée sur le Routeur de Bordure
Une traduction de port asymétrique (PAT) a été couplée à une règle de filtrage stricte dans l'ACL existante.

```cisco
! 1. Création de la traduction asymétrique (Port externe 8080 -> Port interne 80)
ip nat inside source static tcp 192.168.10.5 80 203.0.113.1 8080

! 2. Mise à jour du pare-feu avec la règle de Whitelisting
ip access-list extended FIREWALL-ACL
 ! Accès Public standard (Port 80 ouvert à tous)
 permit tcp any host 203.0.113.1 eq www
 
 ! Accès Admin restreint (Port 8080 verrouillé sur l'IP du Laptop-Externe)
 permit tcp host 203.0.113.50 host 203.0.113.1 eq 8080
 
 ! Accès SSH Maintenance (Verrouillé sur l'IP du Laptop-Externe)
 permit tcp host 203.0.113.50 any eq 22
 
 ! Sécurité stricte par défaut
 deny ip any any
exit
```

### C. Protocole de Recette et Validation
Pour valider cette configuration et prouver la fiabilité du filtrage IP, les tests suivants ont été réalisés :

*   **Action :** Depuis le `Laptop-Externe` (possédant l'IP autorisée `203.0.113.50`), ouvrir le navigateur Web et saisir l'URL : `http://203.0.113.1:8080`.
*   **Résultat obtenu :** Le NAT opère la traduction et la page *"ADMIN - Acces Restreint"* s'affiche avec succès.
*   **Preuve de sécurité (Simulation d'intrusion) :** Si la même URL est saisie depuis une machine externe possédant une adresse IP source différente, la connexion est silencieusement détruite par le routeur en périphérie, renvoyant un délai d'attente dépassé (*Request Timeout*). L'infrastructure "reconnaît" la machine de l'administrateur.

## 9. Perspectives d'Évolution de la Maquette (To-Do List)

Afin d'enrichir la maquette et de s'aligner sur les attendus avancés de gestion des infrastructures, les axes de développement suivants sont identifiés :

### 1. Intégration de services de stockage physique (Architecture Homelab)
Bien que la maquette actuelle se concentre sur les services Web et l'infrastructure réseau de base, l'architecture a été pensée pour préfigurer un environnement physique complet. À terme, le VLAN 10 (`SERVERS`) a vocation à accueillir un serveur de stockage en réseau haute capacité, tel qu'un environnement TrueNAS centralisé. Il s'agira de configurer des règles de routage spécifiques et potentiellement des agrégats de liens (LACP) pour assurer des transferts à haute disponibilité vers la zone d'administration, tout en gérant l'automatisation de l'alimentation électrique (Wake-on-LAN).

### 2. Sécurisation des accès physiques de niveau 2 (Port Security)
Afin de prémunir le commutateur `SW-Core` contre les attaques par usurpation ou les raccordements malveillants (par exemple, si un intrus débranche le `Laptop-Admin` pour s'interconnecter au port `Fa0/4`).
* **Tâches :** Verrouiller le port d'administration en limitant le nombre d'adresses MAC apprises à une seule (*Sticky MAC*), et définir une action de violation stricte (*shutdown*) pour désactiver l'interface en cas d'anomalie.

### 3. Centralisation des événements (Serveur Syslog)
Exploiter le serveur d'infrastructure restant pour collecter les informations de diagnostic et de sécurité en temps réel.
* **Tâches :** Configurer les démons de journalisation sur le routeur et le commutateur afin qu'ils transmettent leurs alertes, déconnexions d'interfaces et tentatives d'accès vers l'adresse IP dédiée du serveur Syslog.
