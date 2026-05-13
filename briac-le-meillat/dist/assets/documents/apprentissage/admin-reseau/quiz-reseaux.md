# Quiz Réseaux : Synthèse de l'Adressage, OSI et Protocoles

Ce document regroupe les concepts essentiels de l'administration réseau (R103) sous forme de questions-réponses détaillées. Chaque réponse est accompagnée d'une explication technique pour approfondir la compréhension.

---

## 1. Adressage et Concepts Réseaux (Calculs et Bases)

| N° | Question | Réponse & Explication |
|:---|:---|:---|
| **Q1** | Combien de machines sur le réseau `192.168.1.128/25` ? | **126**. Un /25 utilise 7 bits pour les hôtes (2⁷ = 128). On retire l'adresse réseau et le broadcast : 128 − 2 = 126. |
| **Q2** | Quel équipement interconnecte plusieurs PC dans un même LAN (couche 2) ? | **Switch**. Le switch travaille en couche 2 (Liaison de données) pour commuter les trames entre les équipements d'un même réseau local. |
| **Q3** | Quel type de câble relie généralement un PC à un switch ? | **Câble droit**. Utilisé pour relier des équipements de couches différentes (PC vers Switch). |
| **Q4** | Quel type de câble est traditionnellement utilisé pour relier deux switchs ? | **Câble croisé**. Traditionnellement requis pour relier deux équipements identiques (Switch vers Switch) sans la fonction auto MDI-X. |
| **Q5** | Quel connecteur est utilisé pour l’Ethernet sur paires torsadées ? | **RJ45**. Le connecteur standard pour les câbles Ethernet à paires torsadées. |
| **Q6** | Dans un réseau `192.168.10.0/24`, quel est le masque ? | **255.255.255.0**. Un /24 signifie que les 24 premiers bits du masque sont à 1, ce qui donne 3 octets à 255. |
| **Q7** | Combien d’hôtes utilisables contient un réseau `/24` ? | **254**. 2^(32-24) - 2 = 2⁸ - 2 = 256 - 2 = 254 adresses utilisables. |
| **Q21** | Quelle est la longueur d’une adresse IPv4 ? | **32 bits**. Une adresse IPv4 est composée de 4 octets de 8 bits chacun (4 × 8 = 32). |
| **Q28** | Quelle est l’adresse réseau de `192.168.1.42/24` ? | **192.168.1.0**. En /24, le dernier octet est réservé aux hôtes. L'adresse réseau commence par mettre ces bits à 0. |
| **Q29** | Quelle est l’adresse de broadcast du réseau `10.0.0.0/8` ? | **10.255.255.255**. En /8, seul le premier octet est le réseau. Le broadcast met tous les autres bits à 1. |
| **Q30** | Quel masque correspond à un `/26` ? | **255.255.255.192**. Un /26 possède 2 bits supplémentaires sur le dernier octet (128 + 64 = 192). |
| **Q31** | Combien d’hôtes utilisables dans un réseau `/30` ? | **2**. Un /30 offre 4 adresses au total (2²), moins le réseau et le broadcast, il reste 2 adresses pour les hôtes. |
| **Q40** | Combien de bits réseau dans un masque `255.255.255.224` ? | **27**. 224 correspond à 128 + 64 + 32 (3 bits). 24 + 3 = 27 bits réseau. |
| **Q56** | Dans `192.168.10.0/26`, combien y a-t-il d’hôtes utilisables ? | **62**. Un /26 laisse 6 bits pour les hôtes (2⁶ - 2 = 64 - 2 = 62). |
| **Q57** | Quelle est l’adresse de broadcast du réseau `192.168.10.0/26` ? | **192.168.10.63**. Pour le réseau .0/26, la plage va de .0 à .63. .63 est la dernière adresse (broadcast). |
| **Q58** | Quelle est la première adresse utilisable dans `192.168.10.0/26` ? | **192.168.10.1**. C'est l'adresse immédiatement après l'adresse réseau (.0). |
| **Q59** | Quelle est la dernière adresse utilisable dans `192.168.10.0/26` ? | **192.168.10.62**. C'est l'adresse immédiatement avant l'adresse de broadcast (.63). |
| **Q61** | Quelle est la classe d’adresse du réseau `172.16.0.0` ? | **Classe B**. La classe B s'étend de 128.0.0.0 à 191.255.255.255. |
| **Q62** | Quelle adresse IPv4 est privée ? | **192.168.5.10**. La plage 192.168.0.0/16 est réservée aux réseaux privés par la RFC 1918. |
| **Q63** | Quelle est la première adresse utilisable dans `192.168.50.0/24` ? | **192.168.50.1**. Première adresse après le réseau 192.168.50.0. |
| **Q64** | Quelle est la dernière adresse utilisable dans `192.168.50.0/24` ? | **192.168.50.254**. Dernière adresse utilisable avant le broadcast (.255). |
| **Q70** | Quelle est la valeur maximale d’un octet ? | **255**. Un octet (8 bits) au maximum vaut 2⁸ - 1 = 255 en décimal. |
| **Q71** | Quelle adresse IPv4 est réservée au loopback ? | **127.0.0.1**. Adresse locale utilisée par une machine pour tester sa propre pile TCP/IP. |
| **Q73** | Combien de réseaux `/26` dans un `/24` ? | **4**. Un /24 contient 256 adresses et un /26 en contient 64. 256/64 = 4. |
| **Q78** | Quelle est la taille d’une adresse MAC ? | **48 bits**. Une adresse MAC est composée de 6 octets représentés en hexadécimal (6 × 8 = 48). |
| **Q80** | Quelle est l’adresse réseau de `192.168.10.64/26` ? | **192.168.10.64**. En /26, les réseaux avancent par pas de 64. .64 est donc un début de réseau. |
| **Q83** | Quel est le nombre total d’adresses dans un `/29` ? | **8**. Un /29 correspond à 2³ = 8 adresses totales (incluant réseau et broadcast). |
| **Q89** | Quelle est l’adresse de broadcast de `192.168.1.128/25` ? | **192.168.1.255**. Pour le réseau .128/25, la plage se termine à .255. |
| **Q91** | Quelle est l’adresse réseau de `10.1.4.32/27` ? | **10.1.4.32**. En /27, les réseaux avancent par pas de 32. .32 est donc l'adresse réseau. |
| **Q92** | Combien d’hôtes utilisables dans un `/27` ? | **30**. Un /27 offre 2⁵ - 2 = 32 - 2 = 30 adresses utilisables. |
| **Q93** | Quel est le masque décimal d’un `/23` ? | **255.255.254.0**. Un /23 utilise 7 bits sur le 3ème octet (256 - 2 = 254). |
| **Q100** | Quel est le nombre maximal d’hôtes utilisables dans un `/22` ? | **1022**. Un /22 laisse 10 bits pour les hôtes (2¹⁰ - 2 = 1024 - 2 = 1022). |

---

## 2. Modèle OSI et Protocoles

| N° | Question | Réponse & Explication |
|:---|:---|:---|
| **Q10** | Quel protocole est utilisé par ping ? | **ICMP**. Le protocole "Internet Control Message Protocol" est utilisé pour les tests de diagnostic comme ping. |
| **Q11** | À quelle couche OSI appartient l’adressage IP ? | **Réseau (Couche 3)**. La couche 3 gère l'adressage logique (IP) et le routage des paquets. |
| **Q12** | À quelle couche OSI appartient l’adressage MAC ? | **Liaison de données (Couche 2)**. La couche 2 gère l'adressage physique (MAC) et l'accès au média. |
| **Q20** | Quelle est l'encapsulation d'un ping sur Ethernet ? | **ETH \| IP \| ICMP**. Ping est un message ICMP encapsulé dans un paquet IP, lui-même dans une trame Ethernet. |
| **Q22** | Quel protocole associe une adresse IP à une adresse MAC ? | **ARP**. "Address Resolution Protocol" permet de trouver l'adresse MAC à partir d'une adresse IP connue. |
| **Q23** | Quel protocole fonctionne sans connexion préalable ? | **UDP**. Protocole sans connexion, plus rapide car il n'attend pas d'accusé de réception. |
| **Q24** | Quel port utilise HTTP par défaut ? | **80**. Port TCP standard utilisé pour le trafic web non chiffré. |
| **Q25** | Quel port est utilisé par SSH ? | **22**. Port standard pour Secure Shell (administration à distance sécurisée). |
| **Q26** | Quel protocole permet d’attribuer automatiquement une adresse IP ? | **DHCP**. "Dynamic Host Configuration Protocol" automatise la distribution des paramètres IP. |
| **Q27** | Combien de messages contient un échange DHCP complet ? | **4 (DORA)**. Discover, Offer, Request, Acknowledgment. |
| **Q32** | Quel protocole signale les erreurs réseau ? | **ICMP**. Utilisé pour envoyer des messages d'erreur si un paquet ne peut être livré. |
| **Q34** | Quel champ TCP garantit la remise en ordre des segments ? | **Numéro de séquence**. TCP numérote chaque segment pour que le récepteur puisse les remettre dans le bon ordre. |
| **Q35** | Quel protocole utilise le port 53 ? | **DNS**. Port 53, utilisé pour convertir des noms de domaines (google.com) en IP. |
| **Q37** | Quelle couche OSI correspond à TCP et UDP ? | **Transport (Couche 4)**. La couche 4 gère les communications de bout en bout (fiabilité ou rapidité). |
| **Q38** | Quel est le premier message envoyé par un client DHCP ? | **DHCP Discover**. Le client envoie un broadcast pour trouver un serveur DHCP disponible. |
| **Q39** | Quel protocole est sécurisé par chiffrement ? | **SSH**. Contrairement à Telnet ou HTTP, SSH chiffre tout le trafic. |
| **Q41** | Quel champ d’une trame Ethernet identifie le protocole transporté ? | **EtherType**. Champ de la trame Ethernet indiquant quel protocole est transporté (IPv4, ARP, etc.). |
| **Q42** | MAC de destination d’une trame ARP Request ? | **FF:FF:FF:FF:FF:FF**. L'ARP Request est un broadcast envoyé à tout le réseau local. |
| **Q44** | Quel est l’ordre correct du 3-way handshake TCP ? | **SYN → SYN-ACK → ACK**. Processus d'établissement de connexion fiable en 3 étapes. |
| **Q45** | Quel champ TCP sert à vérifier l’intégrité ? | **Checksum**. Somme de contrôle permettant de vérifier que les données n'ont pas été altérées. |
| **Q46** | Quel champ IPv4 indique le protocole de couche 4 ? | **Protocol**. Champ de l'en-tête IP identifiant le protocole supérieur (TCP=6, UDP=17). |
| **Q47** | Quel est le port UDP utilisé par DHCP côté serveur ? | **67 UDP**. Port d'écoute du serveur DHCP. |
| **Q48** | Quel est le port UDP utilisé par DHCP côté client ? | **68 UDP**. Port d'écoute du client DHCP. |
| **Q49** | Quel enregistrement DNS retourne une adresse IPv4 ? | **A**. "Address", l'enregistrement DNS qui lie un nom à une adresse IPv4. |
| **Q50** | Quel enregistrement DNS retourne l’adresse IPv6 ? | **AAAA**. "Quad-A", l'équivalent de l'enregistrement A pour IPv6. |
| **Q51** | Quel code HTTP signifie « ressource non trouvée » ? | **404**. Code d'état standard indiquant que le serveur ne trouve pas la ressource. |
| **Q52** | Quelle méthode HTTP sert à demander une ressource ? | **GET**. Méthode HTTP utilisée pour récupérer une donnée ou une page. |
| **Q53** | Quel port utilise DNS le plus souvent ? | **53 UDP**. Le DNS utilise UDP pour la rapidité des requêtes simples. |
| **Q65** | Quel protocole utilise le port 443 ? | **HTTPS**. Le port 443 est utilisé pour le HTTP sécurisé par TLS/SSL. |
| **Q66** | Quel champ IP permet d’éviter les boucles infinies ? | **TTL**. "Time To Live", décrémenté à chaque routeur pour éviter les boucles. |
| **Q67** | Quel protocole est utilisé par traceroute ? | **ICMP**. Sous Windows, traceroute utilise des messages ICMP Echo Request successifs. |
| **Q69** | Quel est le rôle principal de DNS ? | **Résoudre des noms en IP**. Son rôle est d'être l'annuaire du réseau. |
| **Q72** | Quelle adresse est utilisée si DHCP échoue ? | **169.254.x.x (APIPA)**. Adresse auto-assignée si aucun serveur DHCP ne répond. |
| **Q75** | Quel protocole garantit la livraison des données ? | **TCP**. Garantit la livraison via des mécanismes d'acquittement et de retransmission. |
| **Q76** | Quel est le rôle du champ « fenêtre » en TCP ? | **Contrôle de flux**. Indique la quantité de données acceptables avant un acquittement. |
| **Q77** | Quel type de message ICMP est utilisé par ping ? | **Echo Request / Reply**. Type 8 (demande) et Type 0 (réponse) d'ICMP. |
| **Q82** | Quel protocole utilise principalement UDP ? | **DNS**. Utilise principalement UDP pour minimiser le délai de résolution. |
| **Q84** | Quel message ICMP indique un TTL expiré ? | **Time Exceeded**. Message envoyé par un routeur quand le TTL arrive à 0. |
| **Q85** | Quel est le port source minimum possible ? | **0**. Bien que réservé, c'est la valeur numérique minimale possible. |
| **Q86** | Quelle plage correspond aux ports bien connus ? | **0–1023**. Plage réservée aux services systèmes et protocoles standards. |
| **Q87** | Quel protocole est orienté connexion ? | **TCP**. Nécessite une phase d'établissement (handshake) avant l'envoi. |
| **Q90** | Quel est le rôle du NAT ? | **Traduire les adresses IP**. Permet de partager une seule IP publique pour un réseau privé. |
| **Q94** | Quel protocole fonctionne à la couche application ? | **HTTP**. Protocole de niveau utilisateur gérant l'échange de pages web. |
| **Q95** | Quelle est la valeur maximale d’un TTL IPv4 ? | **255**. Le champ TTL est codé sur 8 bits (2⁸ - 1 = 255). |
| **Q97** | Quel est le rôle du champ checksum ? | **Détecter les erreurs**. S'assure que l'en-tête ou les données ne sont pas corrompus. |

---

## 3. Matériel et Commandes (Cisco, Windows, Linux)

| N° | Question | Réponse & Explication |
|:---|:---|:---|
| **Q8** | Commande Windows pour voir la configuration IP ? | **ipconfig**. Affiche les détails (IP, masque, gateway) des interfaces réseau. |
| **Q9** | Commande pour tester la connectivité ? | **ping**. Envoie des paquets ICMP pour vérifier si une machine répond. |
| **Q13** | Que contient une table MAC d’un switch ? | **Correspondances MAC–port**. Mémorise quel appareil (MAC) est sur quel port physique. |
| **Q14** | Commande Cisco pour afficher la table MAC ? | **show mac-address-table**. Commande standard pour visualiser la table de commutation. |
| **Q15** | Configurer l’IP d’un PC dans Packet Tracer ? | **Desktop > IP Configuration**. Interface graphique pour paramétrer un hôte. |
| **Q16** | Mode nécessaire pour 'configure terminal' ? | **Mode privilégié (#)**. On passe en `enable` avant de pouvoir configurer. |
| **Q17** | Commande désactivant la recherche DNS involontaire ? | **no ip domain-lookup**. Empêche le switch de résoudre les commandes mal tapées. |
| **Q18** | Signification d’un lien vert dans Packet Tracer ? | **Interface up**. Indique que les couches physique et liaison sont actives. |
| **Q19** | Outil pour visualiser le trajet des paquets ? | **Mode Simulation**. Permet d'analyser le contenu des paquets étape par étape. |
| **Q33** | Commande table de routage sur routeur Cisco ? | **show ip route**. Affiche les chemins connus par le routeur. |
| **Q36** | Quel est le rôle principal d’un routeur ? | **Acheminer les paquets IP**. Choisit le meilleur chemin vers un réseau distant. |
| **Q54** | Critère principal pour choisir une route ? | **Longest Prefix Match**. Le routeur choisit la route la plus spécifique (masque long). |
| **Q55** | Quelle est la gateway par défaut utile pour sortir ? | **L’IP du routeur sur le LAN**. Porte de sortie pour tous les paquets sortants. |
| **Q60** | MAC utilisée si destination hors sous-réseau ? | **MAC de la gateway**. On confie la trame au routeur via son adresse MAC. |
| **Q68** | Commande Linux pour afficher la configuration IP ? | **ip addr**. Commande moderne pour afficher les interfaces et adresses. |
| **Q74** | Quel équipement travaille à la couche 3 OSI ? | **Routeur**. Capable de prendre des décisions basées sur les adresses IP. |
| **Q79** | Commande pour tester la résolution DNS ? | **nslookup**. Outil permettant d'interroger les serveurs DNS. |
| **Q81** | Quelle est la fonction principale d’un switch ? | **Commuter les trames**. Envoie la donnée uniquement vers le port de destination. |
| **Q88** | Commande pour voir les routes sous Linux ? | **ip route**. Permet de consulter la table de routage du système. |
| **Q96** | Commande Windows pour voir la table ARP ? | **arp -a**. Affiche le cache des correspondances IP-MAC apprises localement. |
| **Q98** | Commande Cisco pour configurer une IP ? | **ip address**. Commande tapée dans une interface pour lui assigner son IP. |
| **Q99** | Administration distante sécurisée ? | **SSH**. Standard sécurisé pour l'administration distante via chiffrement. |

---

## 4. VLAN et Routage Avancé

| N° | Question | Réponse & Explication |
|:---|:---|:---|
| **Q101** | À quelle couche OSI fonctionne un VLAN ? | **Couche 2**. Les VLAN segmentent le réseau au niveau de la commutation. |
| **Q102** | Quel est l’objectif principal d’un VLAN ? | **Segmenter logiquement**. Crée des groupes isolés sans changer le câblage physique. |
| **Q103** | Identifiant maximal d’un VLAN (802.1Q) ? | **4094**. L'ID est sur 12 bits (4096 - 2 IDs réservés). |
| **Q104** | VLAN par défaut sur un switch Cisco ? | **VLAN 1**. Par défaut, tous les ports sont affectés au VLAN 1. |
| **Q105** | Quel type de port transporte plusieurs VLAN ? | **Trunk**. Port capable de transporter les flux de plusieurs VLANs simultanément. |
| **Q106** | Protocole de marquage VLAN sur Ethernet ? | **IEEE 802.1Q (Dot1q)**. Insère l'ID du VLAN directement dans la trame. |
| **Q107** | Un port access appartient à combien de VLAN ? | **1**. Un port en mode accès ne traite qu'un seul VLAN à la fois. |
| **Q108** | Commande Cisco pour créer un VLAN 20 ? | **vlan 20**. Commande de création du VLAN dans la base de données. |
| **Q109** | Équipement faisant communiquer des VLAN ? | **Routeur ou switch L3**. Un équipement de couche 3 est nécessaire pour router. |
| **Q110** | Routage inter-VLAN sur un seul lien physique ? | **Router-on-a-stick**. Utilise des sous-interfaces sur un seul lien trunk. |
| **Q111** | Type du protocole RIP | **Distance-vector**. Décisions basées sur la distance (nombre de routeurs). |
| **Q112** | Type du protocole OSPF | **Link-state**. Construit une carte complète de la topologie. |
| **Q113** | Métrique utilisée par RIP | **Nombre de sauts**. Compte simplement les routeurs intermédiaires. |
| **Q114** | Métrique principale d’OSPF | **Coût**. Calculé de manière inversement proportionnelle à la bande passante. |
| **Q115** | Distance administrative de RIP | **120**. Valeur de confiance par défaut pour le protocole RIP. |
| **Q116** | Distance administrative d’OSPF | **110**. Valeur de confiance par défaut (préférée à RIP car plus petite). |
| **Q117** | Limite maximale de sauts pour RIP | **15**. Au-delà, la destination est considérée comme inaccessible (infini). |
| **Q118** | Avantage principal d’OSPF sur RIP | **Convergence rapide**. Réagit plus vite aux changements de topologie. |
| **Q119** | Numéro de protocole IP pour OSPF | **89**. Identifiant réservé dans l'en-tête IP. |
| **Q120** | Zone OSPF obligatoire | **Area 0 (Backbone)**. Zone centrale à laquelle toutes les autres doivent se connecter. |

---

> [!TIP]
> **Méthode de révision**
> Ce quiz couvre les bases du programme R103. Pour une maîtrise parfaite, entraînez-vous à refaire les calculs de masques (Q1-Q7) et à simuler les échanges DHCP (Q26-Q27) ou TCP (Q44) sur Packet Tracer.