# BIBLE RÉSEAUX — R&T BUT 1ère Année
### Référentiel technique complet | Briac Le Meillat

> Ce document synthétise l'ensemble des connaissances réseau acquises en 1ère année de BUT Réseaux & Télécommunications. Il est conçu comme un livre de référence : chaque chapitre est indépendant et peut devenir un document séparé.

---

## TABLE DES MATIÈRES

1. [Fondamentaux Numériques](#1-fondamentaux-numériques)
2. [Modèles OSI et TCP/IP](#2-modèles-osi-et-tcpip)
3. [Adressage IPv4](#3-adressage-ipv4)
4. [Adressage IPv6](#4-adressage-ipv6)
5. [Ethernet et ARP](#5-ethernet-et-arp)
6. [IP et ICMP](#6-ip-et-icmp)
7. [Transport : TCP et UDP](#7-transport--tcp-et-udp)
8. [Protocoles Applicatifs](#8-protocoles-applicatifs)
9. [Routage — Principes et Statique](#9-routage--principes-et-statique)
10. [Routage Dynamique : RIP et OSPF](#10-routage-dynamique--rip-et-ospf)
11. [VLAN et Trunk 802.1Q](#11-vlan-et-trunk-8021q)
12. [Routage Inter-VLAN (Router-on-a-Stick)](#12-routage-inter-vlan-router-on-a-stick)
13. [Spanning Tree Protocol (STP)](#13-spanning-tree-protocol-stp)
14. [EtherChannel](#14-etherchannel)
15. [Passerelle Linux (NAT & IP Forwarding)](#15-passerelle-linux-nat--ip-forwarding)
16. [ACL — Listes de Contrôle d'Accès](#16-acl--listes-de-contrôle-daccès)
17. [Serveurs Web : Apache2 et Nginx](#17-serveurs-web--apache2-et-nginx)
18. [Téléphonie sur IP (VoIP / Asterisk)](#18-téléphonie-sur-ip-voip--asterisk)
19. [Administration Cisco IOS — Aide-mémoire](#19-administration-cisco-ios--aide-mémoire)
20. [Commandes Réseau Linux — Aide-mémoire](#20-commandes-réseau-linux--aide-mémoire)

---

## 1. Fondamentaux Numériques

### 1.1 Le Bit

Le **bit** (Binary Digit) est l'unité élémentaire d'information. Il correspond aux deux états physiques d'un transistor :
- **1** : le courant passe (ON).
- **0** : le courant ne passe pas (OFF).

Avec **n** bits, on peut créer **2ⁿ** séquences différentes :

| Nombre de bits | Nombre de combinaisons | Plage décimale |
|:-:|:-:|:-:|
| 1 | 2 | 0 – 1 |
| 4 (nibble) | 16 | 0 – 15 |
| 8 (octet) | 256 | 0 – 255 |
| 16 | 65 536 | 0 – 65 535 |
| 32 | ~4,3 milliards | — |
| 128 | ~3,4 × 10³⁸ | — |

Tout l'adressage réseau repose sur ce principe. Une adresse IPv4 est un nombre de 32 bits ; une adresse IPv6 est un nombre de 128 bits ; une adresse MAC est un nombre de 48 bits.

---

### 1.2 Conversion Binaire ↔ Décimal

**Binaire → Décimal** : chaque position vaut 2ⁿ en partant de la droite (2⁰ = 1).

```
Position :  2⁷  2⁶  2⁵  2⁴  2³  2²  2¹  2⁰
Valeur   : 128   64   32   16   8    4    2    1
```

**Exemple** : `11000000` = 128 + 64 = **192**

**Table de référence rapide pour les octets de masque :**

| Binaire | Décimal | Bits à 1 |
|---|:-:|:-:|
| `00000000` | 0 | 0 |
| `10000000` | 128 | 1 |
| `11000000` | 192 | 2 |
| `11100000` | 224 | 3 |
| `11110000` | 240 | 4 |
| `11111000` | 248 | 5 |
| `11111100` | 252 | 6 |
| `11111110` | 254 | 7 |
| `11111111` | 255 | 8 |

> Ces valeurs sont appelées les **"nombres magiques"** du masque. Tout octet d'un masque valide appartient nécessairement à cette liste.

**Décimal → Binaire** : soustraire les puissances de 2 en partant de la plus grande.

**Exemple** : 172 = 128 + 32 + 8 + 4 = `10101100`

---

### 1.3 Hexadécimal (Base 16)

L'hexadécimal est utilisé pour représenter des données binaires de façon lisible.

**16 symboles** : `0 1 2 3 4 5 6 7 8 9 A B C D E F`

| Hex | Décimal | Binaire |
|:-:|:-:|:-:|
| 0 | 0 | 0000 |
| 9 | 9 | 1001 |
| A | 10 | 1010 |
| F | 15 | 1111 |

**Règle clé** : 1 caractère hex = 4 bits (1 nibble). Donc 1 octet = 2 caractères hex.

Exemples : `FF` = 255, `0x0800` = type IPv4 dans Ethernet, `0x0806` = type ARP.

Utilisations en réseau :
- Adresses MAC : `ab:cd:ef:00:11:22` (6 octets = 12 caractères hex)
- Adresses IPv6 : `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- Champs de protocoles : EtherType, OpCode ARP, etc.

---

## 2. Modèles OSI et TCP/IP

### 2.1 Comparaison des deux modèles

| Couche OSI | N° | Couche TCP/IP | Protocoles/technologies |
|---|:-:|---|---|
| Application | 7 | Application | HTTP, HTTPS, SSH, FTP, DNS, DHCP, SIP |
| Présentation | 6 | Application | TLS/SSL |
| Session | 5 | Application | — |
| Transport | 4 | Transport | TCP, UDP |
| Réseau | 3 | Internet | IP (v4/v6), ICMP, OSPF |
| Liaison de données | 2 | Accès réseau | Ethernet (802.3), Wi-Fi (802.11), ARP |
| Physique | 1 | Accès réseau | Câbles, fibres, ondes radio |

### 2.2 Principes d'encapsulation

Chaque couche **encapsule** les données de la couche supérieure en ajoutant son propre en-tête (et éventuellement un pied de trame).

```
Application  →  [Données]
Transport    →  [TCP/UDP en-tête | Données]
Réseau       →  [IP en-tête | TCP/UDP en-tête | Données]
Liaison      →  [ETH en-tête | IP | TCP/UDP | Données | ETH CRC]
Physique     →  Bits sur le médium
```

**Encapsulations classiques dans un réseau Ethernet filaire :**

| Trafic | Encapsulation |
|---|---|
| Ping | ETH \| IP \| ICMP |
| Navigation web | ETH \| IP \| TCP \| HTTP |
| Administration SSH | ETH \| IP \| TCP \| SSH |
| Résolution DNS | ETH \| IP \| UDP \| DNS |
| Attribution IP | ETH \| IP \| UDP \| DHCP |
| Résolution MAC | ETH \| ARP |
| Transfert fichier | ETH \| IP \| TCP \| FTP |

### 2.3 Rôle des couches — ce que chaque couche "voit"

**Couche Physique (1)** : transmet les bits bruts sur le support physique (signal électrique, optique, radio). Ne connaît que des 0 et des 1.

**Couche Liaison (2)** : délimite les **trames**, détecte les erreurs (CRC), gère l'accès au médium (CSMA/CD). Adresse : **MAC** (48 bits). Portée : **locale** (LAN). Un switch travaille à cette couche.

**Couche Réseau (3)** : route les **paquets** entre réseaux. Adresse : **IP** (32 bits en IPv4). Portée : **globale** (Internet). Un routeur travaille à cette couche.

**Couche Transport (4)** : gère la communication de **bout en bout** entre processus. Utilise les **numéros de port** pour le multiplexage. Protocoles : TCP (fiable) ou UDP (rapide).

**Couche Application (5-7)** : services utilisateurs (web, mail, DNS, etc.).

---

## 3. Adressage IPv4

### 3.1 Structure d'une adresse IPv4

Une adresse IPv4 est un nombre de **32 bits** écrit en notation décimale pointée : 4 octets séparés par des points.

```
Décimal  :  192   .  168   .   10   .   234
Binaire  : 11000000.10101000.00001010.11101010
```

Chaque octet vaut entre 0 et 255. L'adresse IP est **toujours accompagnée d'un masque** pour être exploitable.

### 3.2 Masque de sous-réseau

Le masque est une suite de 32 bits qui divise l'adresse IP en deux parties :
- Les bits à **1** → partie **RÉSEAU (NetID)** : identifie le groupe
- Les bits à **0** → partie **MACHINE (HostID)** : identifie l'hôte dans ce groupe

**Règle de validité absolue** : un masque valide est **obligatoirement** une suite ininterrompue de 1 suivie d'une suite ininterrompue de 0. Exemple invalide : `255.0.0.255` car il y a des 1 après des 0.

**Deux notations équivalentes :**

| Notation décimale | Notation CIDR | Bits à 1 | Bits à 0 |
|---|:-:|:-:|:-:|
| `255.0.0.0` | `/8` | 8 | 24 |
| `255.255.0.0` | `/16` | 16 | 16 |
| `255.255.255.0` | `/24` | 24 | 8 |
| `255.255.255.128` | `/25` | 25 | 7 |
| `255.255.255.192` | `/26` | 26 | 6 |
| `255.255.255.224` | `/27` | 27 | 5 |
| `255.255.255.240` | `/28` | 28 | 4 |
| `255.255.255.248` | `/29` | 29 | 3 |
| `255.255.255.252` | `/30` | 30 | 2 |

### 3.3 Calcul de l'adresse réseau (ET logique)

Pour trouver l'adresse réseau, on applique un **ET logique (AND) bit à bit** entre l'adresse IP et le masque.

| A | B | A AND B |
|:-:|:-:|:-:|
| 1 | 1 | **1** |
| 1 | 0 | **0** |
| 0 | 0 | **0** |
| 0 | 1 | **0** |

**Exemple** : `192.168.10.234/24`
```
IP     : 11000000.10101000.00001010.11101010  (192.168.10.234)
Masque : 11111111.11111111.11111111.00000000  (255.255.255.0)
AND    : 11000000.10101000.00001010.00000000  = 192.168.10.0
```
→ L'adresse réseau est `192.168.10.0`.

**Raccourci pratique** : avec un `/24`, les 3 premiers octets constituent la partie réseau, le dernier est mis à 0. Avec un `/16`, les 2 premiers octets forment la partie réseau.

### 3.4 Adresse réseau et adresse de broadcast

Dans chaque réseau, **deux adresses sont réservées** et ne peuvent jamais être assignées à un hôte :

| Adresse | Comment l'obtenir | Rôle |
|---|---|---|
| **Adresse réseau** | Tous les bits HostID à **0** | Identifiant du réseau, utilisé dans les tables de routage |
| **Adresse de broadcast** | Tous les bits HostID à **1** | Envoi à tous les hôtes du réseau simultanément (ARP, DHCP) |

**Exemples :**

| Réseau CIDR | Adresse réseau | Broadcast | Plage utilisable |
|---|---|---|---|
| `11.12.13.14/8` | `11.0.0.0` | `11.255.255.255` | `11.0.0.1` – `11.255.255.254` |
| `172.31.5.10/16` | `172.31.0.0` | `172.31.255.255` | `172.31.0.1` – `172.31.255.254` |
| `200.1.23.45/24` | `200.1.23.0` | `200.1.23.255` | `200.1.23.1` – `200.1.23.254` |
| `192.168.1.128/25` | `192.168.1.128` | `192.168.1.255` | `192.168.1.129` – `192.168.1.254` |
| `192.168.10.0/26` | `192.168.10.0` | `192.168.10.63` | `192.168.10.1` – `192.168.10.62` |
| `10.1.4.32/27` | `10.1.4.32` | `10.1.4.63` | `10.1.4.33` – `10.1.4.62` |

### 3.5 Calcul du nombre d'hôtes

$$\text{Nombre d'hôtes utilisables} = 2^n - 2$$

Où **n** = nombre de bits à 0 dans le masque (= 32 − CIDR).

Le `−2` exclut l'adresse réseau et l'adresse de broadcast.

| Préfixe | Bits hôte | Total adresses | Hôtes utilisables |
|:-:|:-:|:-:|:-:|
| /30 | 2 | 4 | **2** |
| /29 | 3 | 8 | **6** |
| /28 | 4 | 16 | **14** |
| /27 | 5 | 32 | **30** |
| /26 | 6 | 64 | **62** |
| /25 | 7 | 128 | **126** |
| /24 | 8 | 256 | **254** |
| /23 | 9 | 512 | **510** |
| /22 | 10 | 1 024 | **1 022** |
| /20 | 12 | 4 096 | **4 094** |
| /16 | 16 | 65 536 | **65 534** |
| /10 | 22 | 4 194 304 | **4 194 302** |
| /8 | 24 | 16 777 216 | **16 777 214** |

**Cas particulier `/30`** : seulement 2 hôtes utilisables. Utilisé pour les liaisons point-à-point entre routeurs (un réseau = les 2 routeurs + adresse réseau + broadcast).

### 3.6 Classes IP historiques

Avant le CIDR (Classless Inter-Domain Routing), les adresses étaient regroupées en classes rigides :

| Classe | 1ers bits | Plage | Masque par défaut | Nb de réseaux / hôtes |
|:-:|:-:|---|:-:|---|
| A | `0` | `0.0.0.0` – `127.255.255.255` | /8 | 128 réseaux × 16M hôtes |
| B | `10` | `128.0.0.0` – `191.255.255.255` | /16 | 16 384 réseaux × 65 534 hôtes |
| C | `110` | `192.0.0.0` – `223.255.255.255` | /24 | 2M réseaux × 254 hôtes |
| D | `1110` | `224.0.0.0` – `239.255.255.255` | — | Multicast |
| E | `1111` | `240.0.0.0` – `255.255.255.255` | — | Réservé |

Le CIDR a remplacé ce système pour utiliser les adresses plus efficacement, permettant des masques de n'importe quelle longueur.

### 3.7 Adresses privées (RFC 1918)

Ces plages sont réservées aux réseaux internes (LAN). Elles ne sont **pas routables sur Internet**.

| Classe | Plage | CIDR | Usage typique |
|:-:|---|:-:|---|
| A | `10.0.0.0` – `10.255.255.255` | /8 | Grandes entreprises |
| B | `172.16.0.0` – `172.31.255.255` | /12 | Moyennes entreprises |
| C | `192.168.0.0` – `192.168.255.255` | /16 | Domicile, PME |

**Adresses spéciales à connaître :**

| Adresse | Signification |
|---|---|
| `127.0.0.1` | Loopback — test de la pile TCP/IP locale |
| `0.0.0.0` | Route par défaut (vers tout) |
| `255.255.255.255` | Broadcast limité (tout le réseau local) |
| `169.254.x.x` | APIPA — adresse auto-assignée quand DHCP échoue |

### 3.8 Stratégie d'adressage

Dans la pratique, on organise la plage d'un réseau ainsi :

- **Premières adresses (.1 à .20)** → équipements fixes : serveurs, imprimantes, commutateurs
- **Adresses centrales (.50 à .150)** → pool DHCP pour postes clients
- **Dernières adresses (.254)** → interfaces de routeurs/passerelles

**Exemple `/24` :**
```
192.168.1.0       Adresse réseau (réservée)
192.168.1.1       Serveur principal
192.168.1.10      Serveur DNS
192.168.1.50-150  Pool DHCP
192.168.1.254     Interface routeur (gateway)
192.168.1.255     Broadcast (réservé)
```

### 3.9 Découpage en sous-réseaux

Combien de sous-réseaux `/26` dans un `/24` ?  
Chaque `/26` = 64 adresses. Un `/24` = 256 adresses. → 256 / 64 = **4 sous-réseaux**.

Règle générale : augmenter le préfixe de **n bits** crée **2ⁿ** sous-réseaux.

| Réseau original | Sous-réseaux | Préfixe résultant | Hôtes/sous-réseau |
|---|:-:|:-:|:-:|
| `/24` découpé en 2 | 2 | `/25` | 126 |
| `/24` découpé en 4 | 4 | `/26` | 62 |
| `/24` découpé en 8 | 8 | `/27` | 30 |
| `/24` découpé en 16 | 16 | `/28` | 14 |

---

## 4. Adressage IPv6

### 4.1 Pourquoi IPv6 ?

IPv4 offre ~4,3 milliards d'adresses (2³²). Face à la prolifération des objets connectés, ces adresses sont épuisées. IPv6 résout ce problème radicalement.

| Critère | IPv4 | IPv6 |
|---|---|---|
| Longueur | 32 bits | 128 bits |
| Notation | Décimale pointée | Hexadécimale groupée |
| Espace | ~4,3 milliards | ~3,4 × 10³⁸ (340 sextillions) |
| En-tête | Variable (20–60 octets) | Fixe (40 octets) |
| NAT | Nécessaire | Inutile (assez d'adresses) |

### 4.2 Notation IPv6

Format : **8 groupes de 4 caractères hexadécimaux** séparés par `:`.

Exemple complet : `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

**Règles d'abréviation :**
1. Supprimer les zéros de tête dans chaque groupe : `0db8` → `db8`
2. Remplacer une suite de groupes nuls par `::` (une seule fois par adresse)

`2001:0db8:0000:0000:0000:0000:0000:0001` → `2001:db8::1`

**Adresses spéciales IPv6 :**

| Adresse | Signification |
|---|---|
| `::1` | Loopback (équivalent de `127.0.0.1`) |
| `fe80::/10` | Lien-local (non routable, portée d'un seul lien) |
| `ff02::1` | Tous les nœuds du lien (multicast) |

---

## 5. Ethernet et ARP

### 5.1 Ethernet (IEEE 802.3)

Ethernet est le protocole dominant pour les réseaux locaux filaires. Il opère aux couches 1 et 2.

**Caractéristiques physiques :**

| Catégorie | Débit max | Distance max |
|:-:|:-:|:-:|
| Cat 5 | 100 Mbps | 100 m |
| Cat 5e | 1 Gbps | 100 m |
| Cat 6 | 10 Gbps (courte distance) | 55 m (10G) / 100 m (1G) |
| Cat 6a/7 | 10 Gbps | 100 m |

**Connecteur** : RJ45. Câble droit (PC→Switch) ou câble croisé (Switch→Switch, ancien). Les équipements modernes ont l'**Auto MDI-X** qui détecte automatiquement.

**Trame Ethernet :**
```
[Préambule 7B | SFD 1B | MAC Dest 6B | MAC Src 6B | EtherType 2B | Données | CRC 4B]
```

| Champ | Taille | Valeurs notables |
|---|:-:|---|
| MAC Destination | 6 octets | `FF:FF:FF:FF:FF:FF` = broadcast |
| MAC Source | 6 octets | Adresse de l'émetteur |
| EtherType | 2 octets | `0x0800` = IPv4, `0x0806` = ARP, `0x86DD` = IPv6, `0x8100` = 802.1Q VLAN |
| Données | 46–1500 octets | Payload |
| CRC | 4 octets | Contrôle d'intégrité |

**Gestion des collisions** : protocole **CSMA/CD** (Carrier Sense Multiple Access / Collision Detection). Écoute avant d'émettre, détecte les collisions et attend un délai aléatoire avant de réémettre. Rendu inutile par les switches (chaque port = domaine de collision distinct).

**Adresse MAC** :
- 48 bits (6 octets en hexadécimal, ex : `ab:cd:ef:00:11:22`)
- Les 3 premiers octets = **OUI** (Organizationally Unique Identifier) : identifie le fabricant
- Les 3 derniers octets = **NIC** (Network Interface Controller) : identifie l'interface
- **Rôle local uniquement** : l'adresse MAC de destination dans une trame est toujours celle du **prochain saut**, pas de la destination finale

**Table MAC d'un switch (CAM table)** :
- Le switch apprend les adresses MAC en examinant la MAC source de chaque trame reçue
- Il associe chaque MAC au port physique d'arrivée
- Si la MAC de destination est inconnue → **flooding** (envoi sur tous les ports sauf source)
- Si connue → **commutation sélective** (envoi uniquement vers le bon port)

### 5.2 ARP (Address Resolution Protocol)

**Problème résolu** : on connaît l'IP de destination, mais on a besoin de sa MAC pour construire la trame Ethernet.

**Fonctionnement :**

1. **Requête ARP** (broadcast) : `"Who has 192.168.1.10? Tell 192.168.1.1"`
   - MAC Destination : `FF:FF:FF:FF:FF:FF` (broadcast)
   - EtherType : `0x0806`
   - OpCode : `1` (request)

2. **Réponse ARP** (unicast) : `"192.168.1.10 is at aa:bb:cc:dd:ee:ff"`
   - MAC Destination : adresse MAC de celui qui a posé la question
   - OpCode : `2` (reply)

**Cache ARP** : les associations IP→MAC sont mémorisées temporairement pour éviter de répéter les requêtes.  
Commande Linux : `ip n` ou `arp -a` (Windows)

**Champs ARP :**

| Champ | Valeur (Ethernet/IPv4) |
|---|---|
| HTYPE | `0x0001` (Ethernet) |
| PTYPE | `0x0800` (IPv4) |
| HLEN | `6` (MAC = 6 octets) |
| PLEN | `4` (IPv4 = 4 octets) |
| OpCode | `1` (request) ou `2` (reply) |

**Gratuitous ARP** : machine qui annonce elle-même sa propre adresse IP (lors d'un changement d'IP ou pour mettre à jour les caches des voisins).

---

## 6. IP et ICMP

### 6.1 En-tête IPv4

Un paquet IPv4 commence très souvent par **`0x4500`** :
- `4` = Version IPv4
- `5` = IHL (Internet Header Length) = 5 × 4 octets = 20 octets (sans options)
- `00` = DSCP/ECN (QoS par défaut)

**Champs importants de l'en-tête IPv4 :**

| Champ | Taille | Rôle |
|---|:-:|---|
| Version | 4 bits | `4` pour IPv4 |
| IHL | 4 bits | Longueur de l'en-tête en mots de 4 octets |
| TTL | 8 bits | Time To Live : décrémenté à chaque saut, paquet détruit à 0 |
| Protocol | 8 bits | `1` = ICMP, `6` = TCP, `17` = UDP, `89` = OSPF |
| IP Source | 32 bits | Adresse de l'émetteur |
| IP Destination | 32 bits | Adresse du destinataire final |
| Identification | 16 bits | Identifie les fragments d'un paquet fragmenté |
| DF (Don't Fragment) | 1 bit | `1` = ne pas fragmenter (si nécessaire, détruire le paquet) |
| MF (More Fragments) | 1 bit | `1` = ce paquet est un fragment, il y en a d'autres |
| Fragment Offset | 13 bits | Position du fragment en blocs de 8 octets |

**TTL** : valeur maximale = 255 (8 bits). Valeurs initiales typiques : 64 (Linux), 128 (Windows), 255 (Cisco IOS). Permet d'éviter les boucles de routage infinies. C'est la base du fonctionnement de **traceroute** (on envoie des paquets avec TTL 1, 2, 3... et on collecte les messages "Time Exceeded" pour tracer le chemin).

### 6.2 ICMP (Internet Control Message Protocol)

ICMP est encapsulé dans IP (Protocol = 1). Il transporte des messages de contrôle et d'erreur.

**Messages ICMP principaux :**

| Type | Code | Nom | Usage |
|:-:|:-:|---|---|
| 0 | 0 | Echo Reply | Réponse au ping |
| 3 | 0 | Destination Unreachable – Net | Réseau injoignable |
| 3 | 1 | Destination Unreachable – Host | Hôte injoignable |
| 3 | 3 | Destination Unreachable – Port | Port injoignable (courant avec UDP) |
| 8 | 0 | Echo Request | Envoi d'un ping |
| 11 | 0 | Time Exceeded | TTL expiré (utilisé par traceroute) |

**Fonctionnement de ping :**
1. La source envoie un **Echo Request** (Type 8) vers la destination
2. La destination répond avec un **Echo Reply** (Type 0)
3. Si un routeur intermédiaire ne peut pas router → **Destination Unreachable**

**Fonctionnement de traceroute :**
1. Envoie un ICMP Echo Request avec TTL=1 → le premier routeur répond avec "Time Exceeded"
2. TTL=2 → le deuxième routeur répond
3. Et ainsi de suite jusqu'à la destination

---

## 7. Transport : TCP et UDP

### 7.1 Numéros de port

Les ports permettent le **multiplexage** : plusieurs applications peuvent utiliser le réseau simultanément sur la même machine.

**Plages de ports :**

| Plage | Type | Exemples |
|---|---|---|
| 0 – 1023 | Ports bien connus (Well-Known) | HTTP:80, HTTPS:443, SSH:22, DNS:53 |
| 1024 – 49151 | Ports enregistrés (Registered) | — |
| 49152 – 65535 | Ports éphémères (Ephemeral) | Ports clients dynamiques |

**Ports à mémoriser absolument :**

| Port | Protocole | Transport |
|:-:|---|:-:|
| 20/21 | FTP (données/contrôle) | TCP |
| 22 | SSH | TCP |
| 23 | Telnet | TCP |
| 25 | SMTP | TCP |
| 53 | DNS | UDP (principalement) / TCP |
| 67 | DHCP serveur | UDP |
| 68 | DHCP client | UDP |
| 80 | HTTP | TCP |
| 110 | POP3 | TCP |
| 143 | IMAP | TCP |
| 443 | HTTPS | TCP |
| 520 | RIP | UDP |
| 5060 | SIP (VoIP) | UDP |

### 7.2 UDP (User Datagram Protocol)

**Caractéristiques :**
- **Non orienté connexion** : pas de phase d'établissement
- **Pas de fiabilité** : pas d'accusé de réception, pas de retransmission
- **Pas de garantie d'ordre** : les datagrammes peuvent arriver dans le désordre
- **Très faible overhead** : en-tête de seulement 8 octets
- **Faible latence**

**En-tête UDP :**
```
[Port source 2B | Port destination 2B | Longueur 2B | Checksum 2B]
```

**Usages** : DNS, DHCP, NTP, streaming vidéo/audio, VoIP (SIP, RTP), jeux en ligne.

### 7.3 TCP (Transmission Control Protocol)

**Caractéristiques :**
- **Orienté connexion** : établissement obligatoire avant envoi
- **Fiable** : accusés de réception (ACK), retransmission si perte
- **Ordonné** : numérotation des octets, remise dans l'ordre
- **Contrôle de flux** : mécanisme de fenêtre glissante
- **Contrôle de congestion** : adaptation du débit aux conditions réseau

**En-tête TCP :**
```
[Port src 2B | Port dest 2B | Seq 4B | Ack 4B | Flags 2B | Window 2B | Checksum 2B | ...]
```

**Flags TCP :**

| Flag | Rôle |
|:-:|---|
| **SYN** | Synchronisation — initie ou accepte une connexion |
| **ACK** | Acquittement — confirme la réception |
| **FIN** | Fin — fermeture ordonnée d'un sens de communication |
| **RST** | Reset — fermeture brutale (port fermé, erreur grave) |
| **PSH** | Push — transmettre immédiatement sans attendre le remplissage du buffer |
| **URG** | Urgent — données prioritaires |

**Établissement de connexion — 3-way handshake :**

```
Client                    Serveur
   |  ----  SYN  -------> |   SEQ=x
   |  <-- SYN, ACK -----  |   SEQ=y, ACK=x+1
   |  ----  ACK  -------> |   ACK=y+1
   |   [connexion établie] |
```

**Fermeture — 4-way (half-close) :**

```
Client                    Serveur
   |  -- FIN, ACK ------> |   Client fini d'envoyer
   |  <---- ACK ---------  |   Serveur acquitte
   |  <-- FIN, ACK ------  |   Serveur fini d'envoyer
   |  ------ ACK -------> |   Client acquitte
   |   [connexion fermée]  |
```

**Numéros de séquence et d'acquittement :**
- `Seq` : numéro du premier octet de ce segment
- `Ack` : numéro du prochain octet attendu = Seq + Len du segment reçu
- Règle : `Ack = Seq_reçu + Len_données`

**Contrôle de flux — fenêtre (Window) :**
- Le champ `Window` (16 bits max = 65 535 octets) indique combien d'octets le récepteur peut encore accepter
- L'option **Window Scale** (négociée au SYN) permet d'augmenter cette valeur pour les liaisons haut débit

**Gestion d'erreur — Binary Exponential Backoff :**
En cas de perte, TCP double le délai d'attente avant chaque retransmission (1s, 2s, 4s, 8s...). Linux abandonne après ~15 minutes.

**TCP vs UDP — tableau de synthèse :**

| Critère | TCP | UDP |
|---|---|---|
| Connexion | 3-way handshake | Aucune |
| Fiabilité | ACK + retransmission | Aucune garantie |
| Ordre | Garanti | Non garanti |
| Vitesse | Plus lent | Plus rapide |
| En-tête | 20 octets min | 8 octets |
| Usages | HTTP, SSH, FTP | DNS, DHCP, VoIP, streaming |

---

## 8. Protocoles Applicatifs

### 8.1 DNS (Domain Name System)

**Rôle** : résoudre les noms de domaine en adresses IP.  
**Port** : UDP 53 (TCP 53 pour grandes réponses ou transferts de zone).  
**Encapsulation** : ETH | IP | UDP | DNS

**Types d'enregistrements (Resource Records) :**

| Type | Rôle | Exemple |
|:-:|---|---|
| **A** | Nom → IPv4 | `iut-rt.univ-artois.fr` → `172.31.25.9` |
| **AAAA** | Nom → IPv6 | `example.com` → `2001:db8::1` |
| **PTR** | IP → Nom (résolution inverse) | `9.25.31.172.in-addr.arpa` → `iut-rt` |
| **CNAME** | Alias (Nom → Nom) | `www.example.com` → `example.com` |
| **MX** | Serveur de messagerie du domaine | `mail.example.com` |
| **NS** | Serveur DNS de la zone | — |
| **SOA** | Début de zone (Start of Authority) | — |

**Outils de test DNS :**
```bash
nslookup iut-rt                # Windows/Linux — requête simple
dig iut-rt                     # Linux — sortie détaillée
host iut-rt                    # Linux — simple
```

### 8.2 DHCP (Dynamic Host Configuration Protocol)

**Rôle** : attribuer automatiquement une configuration IP à un client.  
**Ports** : UDP 67 (serveur) / UDP 68 (client).  
**Encapsulation** : ETH | IP | UDP | DHCP

**Processus DORA :**

```
Client                              Serveur DHCP
  | -- DISCOVER (broadcast) -------> |  "Y a-t-il un serveur DHCP ?"
  | <---- OFFER (unicast/broadcast)  |  "Je t'offre 192.168.1.50"
  | -- REQUEST (broadcast) --------> |  "J'accepte 192.168.1.50"
  | <---- ACK (unicast/broadcast) -- |  "C'est confirmé, voilà tes paramètres"
```

**Paramètres distribués :**
- Adresse IP
- Masque de sous-réseau
- Passerelle par défaut (default-router)
- Serveur(s) DNS
- Durée du bail (lease time)

**Si DHCP échoue** → APIPA attribue une adresse `169.254.x.x` (autoconfiguration)

**Configuration DHCP sur routeur Cisco :**
```cisco
! Exclure des adresses du pool
ip dhcp excluded-address 192.168.20.254
ip dhcp excluded-address 192.168.20.10

! Définir le pool
ip dhcp pool POOL_PERSONNEL
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.254
 dns-server 192.168.10.10
```

**Configuration DHCP sous Linux (isc-dhcp-server) :**
```text
# /etc/dhcp/dhcpd.conf
default-lease-time 3600;
max-lease-time 7200;
authoritative;

subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.50 192.168.20.150;
    option routers 192.168.20.254;
    option domain-name-servers 192.168.10.10, 1.1.1.1;
    option domain-name "vlan-personnel.net";
}
```

### 8.3 HTTP / HTTPS

**Rôle** : transfert de pages et ressources web.  
**Ports** : 80 (HTTP), 443 (HTTPS = HTTP + TLS/SSL).

**Méthodes HTTP :**

| Méthode | Rôle |
|---|---|
| GET | Demander une ressource |
| POST | Envoyer des données (formulaire) |
| PUT | Mettre à jour une ressource |
| DELETE | Supprimer une ressource |

**Codes de statut HTTP :**

| Code | Signification |
|:-:|---|
| 200 | OK — succès |
| 301/302 | Redirection |
| 404 | Not Found — ressource introuvable |
| 403 | Forbidden — accès refusé |
| 500 | Internal Server Error |

### 8.4 SSH (Secure Shell)

**Rôle** : accès distant sécurisé (shell, transfert de fichiers, tunneling).  
**Port** : TCP 22.  
**Avantage sur Telnet** : tout le trafic est chiffré.

Administration Cisco via SSH :
```cisco
! Prérequis
ip domain-name monreseau.local
crypto key generate rsa modulus 2048
username admin privilege 15 secret motdepasse

! Activer SSH v2 seulement
ip ssh version 2
line vty 0 4
 transport input ssh
 login local
```

### 8.5 FTP (File Transfer Protocol)

**Rôle** : transfert de fichiers.  
**Ports** : TCP 21 (contrôle), TCP 20 (données en mode actif) ou port dynamique (mode passif).  
**Non chiffré** par défaut → préférer **SFTP** (via SSH) ou **FTPS** (FTP + TLS).

---

## 9. Routage — Principes et Statique

### 9.1 Fonctionnement du routage

Un **routeur** est un équipement de couche 3 qui achemine les paquets IP d'un réseau vers un autre. Il prend sa décision en consultant sa **table de routage**.

**Processus de décision à chaque saut :**
1. Extraire l'IP de destination du paquet
2. Chercher dans la table de routage la route la plus spécifique (**Longest Prefix Match**)
3. Transmettre le paquet vers le **next-hop** (prochain saut) sur l'interface appropriée
4. Décrémenter le TTL — si TTL = 0, détruire le paquet et envoyer un ICMP Time Exceeded

**Longest Prefix Match** : si plusieurs routes correspondent, le routeur choisit celle avec le masque le plus long (le plus spécifique). `/30` est préféré à `/24` qui est préféré à `/0`.

**Rôle de la MAC dans le routage :**
- Quand un routeur reçoit un paquet, il réécrit la **MAC source** (avec sa propre MAC) et la **MAC destination** (avec la MAC du prochain équipement)
- Les IPs source et destination **ne changent jamais** pendant le routage (sauf NAT)

### 9.2 Table de routage Cisco

```
Codes: C = connected, L = local, S = static, R = RIP, O = OSPF
       * = candidate default route

R1# show ip route
C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
L    192.168.1.1/32 is directly connected, GigabitEthernet0/0
S    192.168.2.0/24 [1/0] via 192.168.3.2
R    10.2.0.0/16 [120/1] via 10.1.0.2, Serial0/0/0
O    192.168.2.0/24 [110/64] via 10.1.0.2, Serial0/0/0
```

Format : `Protocole  Réseau/Préfixe  [DA/Métrique] via Next-Hop, Interface`

**Distance Administrative (DA)** : mesure de la fiabilité d'une source de route. **Plus la DA est faible, plus la route est préférée.**

| Source | DA |
|---|:-:|
| Directement connectée (C) | 0 |
| Route statique (S) | 1 |
| OSPF (O) | 110 |
| RIP (R) | 120 |

Si deux protocoles annoncent la même destination, la route avec la **DA la plus basse** est choisie.

### 9.3 Routage statique

On configure manuellement les routes sur chaque routeur. Simple mais ne s'adapte pas automatiquement aux pannes.

**Syntaxe Cisco :**
```cisco
ip route [réseau_dest] [masque_dest] [next-hop_IP]
! ou
ip route [réseau_dest] [masque_dest] [interface_sortie]
```

**Exemple — 2 routeurs, 3 réseaux :**

```
PC1 (192.168.1.10) --- R1 --- [192.168.3.0/24] --- R2 --- PC2 (192.168.2.10)
```

Sur R1 :
```cisco
ip route 192.168.2.0 255.255.255.0 192.168.3.2
! "Pour atteindre 192.168.2.0, envoie à 192.168.3.2 (adresse de R2)"
```

Sur R2 :
```cisco
ip route 192.168.1.0 255.255.255.0 192.168.3.1
! "Pour atteindre 192.168.1.0, envoie à 192.168.3.1 (adresse de R1)"
```

**Route par défaut** (gateway of last resort) :
```cisco
ip route 0.0.0.0 0.0.0.0 192.168.1.254
! "Pour toute destination inconnue, envoie à 192.168.1.254"
```

---

## 10. Routage Dynamique : RIP et OSPF

### 10.1 Concepts communs

Le routage dynamique permet aux routeurs d'**échanger automatiquement leurs informations de routage** et de **recalculer les routes en cas de panne**. Plus adapté aux réseaux complexes ou évolutifs.

**Deux familles de protocoles :**
- **Distance-vector** : chaque routeur ne connaît que ses voisins et envoie sa table complète → simples mais convergence lente.
- **Link-state** : chaque routeur connaît la topologie complète du réseau → complexes mais convergence rapide.

### 10.2 RIP v2 (Routing Information Protocol)

**Type** : Distance-vector.  
**Métrique** : nombre de **sauts** (hop count).  
**Limite** : maximum **15 sauts** (16 = infini/inaccessible).  
**Distance administrative** : **120**.  
**Encapsulation** : UDP port 520.  
**Envoi des mises à jour** : toutes les 30 secondes en multicast `224.0.0.9`.

**Configuration Cisco :**
```cisco
router rip
 version 2
 no auto-summary          ! OBLIGATOIRE avec des masques différents (/16 et /24 mélangés)
 network 192.168.1.0      ! Active RIP sur toutes les interfaces de ce réseau
 network 10.1.0.0
```

**Signification des commandes :**

| Commande | Pourquoi |
|---|---|
| `version 2` | RIPv1 est classfull (ne supporte pas VLSM), v2 supporte les masques variables |
| `no auto-summary` | Empêche RIP de regrouper les routes par classe (indispensable en pratique) |
| `network X.X.X.X` | Annonce ce réseau et active RIP sur les interfaces correspondantes |

**Lecture des routes RIP :**
```
R    10.2.0.0/16 [120/1] via 10.1.0.2
```
- `R` = RIP
- `[120/1]` = DA=120, métrique=1 saut

### 10.3 OSPF (Open Shortest Path First)

**Type** : Link-state.  
**Métrique** : **coût** (inversement proportionnel à la bande passante : coût = 10⁸ / débit_bps).  
**Distance administrative** : **110**.  
**Encapsulation** : directement dans IP, protocole numéro **89**.  
**Base de données** : LSDB (Link State Database) = carte complète du réseau.  
**Zone obligatoire** : Area 0 (Backbone) — tous les routeurs doivent y être connectés.

**Coûts par défaut Cisco :**

| Interface | Bande passante | Coût OSPF |
|---|:-:|:-:|
| Serial (T1) | 1,544 Mbps | 64 |
| FastEthernet | 100 Mbps | 1 |
| GigabitEthernet | 1000 Mbps | 1 |

**Masque générique (wildcard)** : utilisé dans la commande `network` OSPF. C'est l'**inverse du masque réseau**.
- `/24` → wildcard `0.0.0.255` (les 8 bits hôte sont "libres")
- `/16` → wildcard `0.0.255.255`
- `/8` → wildcard `0.255.255.255`

**Configuration Cisco :**
```cisco
router ospf 1                           ! 1 = process-id (local au routeur)
 network 192.168.1.0 0.0.0.255 area 0
 network 10.1.0.0 0.0.255.255 area 0
```

**Lecture des routes OSPF :**
```
O    192.168.2.0/24 [110/129] via 10.1.0.2
```
- `O` = OSPF
- `[110/129]` = DA=110, coût=129 (64+64+1 = 2 liaisons série + 1 Ethernet)

### 10.4 RIP vs OSPF — Tableau comparatif

| Critère | RIP v2 | OSPF |
|---|---|---|
| Type | Distance-vector | Link-state |
| Métrique | Nombre de sauts | Coût (débit) |
| DA | 120 | 110 |
| Limite | 15 sauts | Aucune |
| Convergence | Lente | Rapide |
| Encapsulation | UDP port 520 | IP protocole 89 |
| Marqueur table routage | `R` | `O` |
| Zones | Non | Oui (Area 0 obligatoire) |
| Réseau conseillé | Très petits réseaux | Réseaux moyens/grands |
| Mise à jour | Toutes les 30s | Event-driven (uniquement si changement) |

**Si RIP et OSPF coexistent pour la même destination** → OSPF est choisi (DA 110 < DA 120).

### 10.5 Commandes de vérification

```cisco
show ip route                ! Table de routage complète
show ip protocols             ! Protocoles actifs et leurs paramètres
show ip ospf neighbor         ! Voisins OSPF établis
show ip rip database          ! Base de données RIP
show controllers Serial0/0/0  ! DCE ou DTE sur une liaison série
```

**Identifier le côté DCE** (où configurer le clock rate) :
```cisco
show controllers Serial0/0/0
! Si "DCE" apparaît → clock rate obligatoire ici
R1(config-if)# clock rate 128000
```

---

## 11. VLAN et Trunk 802.1Q

### 11.1 Définition et intérêt des VLANs

Un **VLAN** (Virtual Local Area Network) est une segmentation logique d'un réseau physique en plusieurs domaines de diffusion (broadcast domains) indépendants.

**Sans VLAN** : tous les équipements sur un switch partagent le même domaine de broadcast → tout broadcast (ARP, DHCP Discover) atteint tous les ports.

**Avec VLANs** : on crée des groupes logiques. Un broadcast d'un VLAN ne sort pas vers un autre VLAN.

**Avantages :**
- **Sécurité** : isolation du trafic (ex : VLAN Vidéosurveillance isolé du VLAN RH)
- **Performance** : réduction du trafic de broadcast
- **Flexibilité** : regroupement logique indépendant du câblage physique
- **Gestion** : simplification de l'administration

**VLAN par défaut** : VLAN 1 sur Cisco (tous les ports y appartiennent par défaut, non recommandé en production).

**ID VLAN** : 1 à 4094 (champ de 12 bits dans 802.1Q, 0 et 4095 réservés).

### 11.2 Types de ports

**Port d'accès (Access)** :
- Appartient à **un seul VLAN**
- Connecté à un équipement terminal (PC, imprimante, caméra)
- Les trames sont transmises **sans tag** vers le terminal
- Configuration : `switchport mode access` + `switchport access vlan [ID]`

**Port trunk** :
- Transporte le trafic de **plusieurs VLANs simultanément**
- Connecté à un autre switch ou un routeur
- Les trames sont **taguées** avec l'ID du VLAN (802.1Q)
- Configuration : `switchport mode trunk`

### 11.3 Standard IEEE 802.1Q (Dot1q)

Quand une trame traverse un lien trunk, un **tag de 4 octets** est inséré dans la trame Ethernet :

```
[MAC Dest | MAC Src | 0x8100 (TPID) | PCP (3b) + DEI (1b) + VID (12b) | EtherType | Données | CRC]
```

- **TPID** = `0x8100` : indique la présence d'un tag 802.1Q
- **VID** (VLAN ID) : 12 bits = identifiant du VLAN (0 à 4095)
- **PCP** (Priority Code Point) : 3 bits pour la QoS (IEEE 802.1p)

**VLAN natif** : VLAN dont les trames **ne sont pas taguées** sur un trunk. Par défaut = VLAN 1. Les deux extrémités d'un trunk doivent avoir le même VLAN natif configuré.

### 11.4 Configuration Cisco complète

**Création et nommage des VLANs :**
```cisco
SW1(config)# vlan 10
SW1(config-vlan)# name ADMIN
SW1(config-vlan)# exit
SW1(config)# vlan 20
SW1(config-vlan)# name PERSONNEL
SW1(config-vlan)# exit
```

**Assignation d'un port en mode accès :**
```cisco
SW1(config)# interface fastEthernet 0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# no shutdown
SW1(config-if)# exit
```

**Configuration d'un port trunk :**
```cisco
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 1
SW1(config-if)# no shutdown
SW1(config-if)# exit
```

**Vérifications :**
```cisco
SW1# show vlan brief              ! Liste des VLANs et leurs ports
SW1# show interfaces trunk        ! Liens trunk actifs et VLANs autorisés
SW1# show mac address-table       ! Table MAC
```

### 11.5 VTP (VLAN Trunking Protocol)

Protocole Cisco propriétaire permettant de **propager la base de données VLAN** d'un switch serveur vers les switchs clients sur les liens trunk. Évite de reconfigurer manuellement les VLANs sur chaque switch.

---

## 12. Routage Inter-VLAN (Router-on-a-Stick)

### 12.1 Problématique

Les VLANs sont des domaines de broadcast **isolés**. Pour qu'un hôte du VLAN 10 communique avec un hôte du VLAN 20, il faut **un équipement de couche 3** (routeur ou switch L3).

### 12.2 Méthode Router-on-a-Stick

Un seul câble physique entre le switch et le routeur, configuré en **trunk** côté switch. Le routeur crée des **sous-interfaces** (subinterfaces) logiques, une par VLAN.

```
[PC VLAN10] --- [SW trunk] ---(1 câble physique)--- [Routeur R1]
[PC VLAN20] ---[         ]                            |- Gi0/0.10 → VLAN 10
                                                      |- Gi0/0.20 → VLAN 20
```

### 12.3 Configuration

**Côté Switch — lien vers routeur en trunk :**
```cisco
interface gigabitEthernet 0/1
 switchport mode trunk
 no shutdown
```

**Côté Routeur — sous-interfaces :**
```cisco
! Activer l'interface physique sans IP
interface gigabitEthernet 0/0
 no shutdown
 exit

! Sous-interface VLAN 10
interface gigabitEthernet 0/0.10
 encapsulation dot1Q 10           ! Tagger les trames avec VID=10
 ip address 192.168.10.254 255.255.255.0
 exit

! Sous-interface VLAN 20
interface gigabitEthernet 0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.254 255.255.255.0
 exit

! Sous-interface VLAN 30
interface gigabitEthernet 0/0.30
 encapsulation dot1Q 30
 ip address 192.168.30.254 255.255.255.0
 exit
```

**Sur les PC clients** : configurer la passerelle = l'IP de la sous-interface correspondant à leur VLAN.

**Infrastructure complète SAE 1.02 :**

| VLAN | Nom | Réseau | Passerelle |
|:-:|---|---|---|
| 10 | ADMIN | 192.168.10.0/24 | 192.168.10.254 |
| 20 | PERSONNEL | 192.168.20.0/24 | 192.168.20.254 |
| 30 | PRODUCTION | 192.168.30.0/24 | 192.168.30.254 |
| 40 | VIDEO | 192.168.40.0/24 | 192.168.40.254 |
| 800 | INTERNET | 192.168.100.0/24 | 192.168.100.254 |

---

## 13. Spanning Tree Protocol (STP)

### 13.1 Problème des boucles de niveau 2

Si un réseau commétatif possède des **chemins redondants** (pour la tolérance aux pannes), cela crée des boucles au niveau 2. Une boucle L2 provoque :
- Des **tempêtes de broadcast** (une trame de broadcast se reproduit indéfiniment)
- La **multiplication des frames** dans la table MAC
- La **saturation** du réseau en quelques secondes

### 13.2 Fonctionnement de STP (IEEE 802.1D)

STP bloque **logiquement** certains ports pour éliminer les boucles, tout en conservant la redondance physique. Si un lien actif tombe, STP réactive le port bloqué.

**Élection du Root Bridge :**
1. Chaque switch a un **Bridge ID (BID)** = Priorité (2 octets, par défaut 32768) + Adresse MAC (6 octets)
2. Le switch avec le **BID le plus bas** est élu Root Bridge
3. Pour forcer un switch à devenir Root Bridge → diminuer sa priorité (valeur multiple de 4096)

**Rôles des ports :**

| Rôle | Description |
|---|---|
| **Root Port (RP)** | Port offrant le chemin le plus court vers le Root Bridge. Un par switch non-root. |
| **Designated Port (DP)** | Port responsable de la transmission sur un segment. Un par segment. |
| **Blocked Port (BP)** | Port bloqué logiquement pour rompre la boucle. Ne transmet pas de données. |

**Coûts de liens (802.1D) :**

| Débit | Coût |
|:-:|:-:|
| 10 Mbps | 100 |
| 100 Mbps | 19 |
| 1 Gbps | 4 |
| 10 Gbps | 2 |

**Messages BPDUs** (Bridge Protocol Data Units) : messages échangés entre switches pour l'élection et la maintenance de l'arbre.

**PVST+** (Per-VLAN Spanning Tree Plus) : variante Cisco qui crée une instance STP par VLAN.

**RSTP** (IEEE 802.1w) : version rapide, convergence quasi-instantanée (secondes vs 30-50s pour 802.1D).

### 13.3 Commandes Cisco

```cisco
! Afficher l'état STP
SW1# show spanning-tree
SW1# show spanning-tree summary

! Forcer ce switch à devenir Root Bridge pour le VLAN 10
SW1(config)# spanning-tree vlan 10 priority 4096
! ou commande automatique
SW1(config)# spanning-tree vlan 10 root primary
```

---

## 14. EtherChannel

### 14.1 Principe

L'**EtherChannel** (agrégation de liens / LAG) regroupe plusieurs **liens physiques parallèles** entre deux switches en un **seul lien logique**. Cela permet d'augmenter la bande passante et d'assurer la redondance.

**Avantages :**
- Augmentation du débit (jusqu'à 8 liens × débit unitaire)
- Tolérance aux pannes : si un lien physique tombe, l'EtherChannel reste actif
- STP voit un seul lien logique → pas de port bloqué

**Maximum** : 8 ports physiques par EtherChannel.

### 14.2 Protocoles de négociation

| Protocole | Standard | Mode actif | Mode passif |
|---|---|---|---|
| **LACP** (Link Aggregation Control Protocol) | IEEE 802.3ad | `active` | `passive` |
| **PAgP** (Port Aggregation Protocol) | Cisco propriétaire | `desirable` | `auto` |
| Mode **On** | Manuel | Sans protocole | — |

**Règle** : les deux extrémités doivent utiliser le même protocole. Le mode `On` force sans négociation.

### 14.3 Configuration Cisco

```cisco
! Configurer les 2 interfaces physiques ensemble
SW1(config)# interface range gigabitEthernet 0/1 - 2
SW1(config-if-range)# switchport mode trunk
SW1(config-if-range)# channel-group 1 mode active    ! LACP actif
SW1(config-if-range)# no shutdown

! Vérification
SW1# show etherchannel summary
SW1# show etherchannel 1 detail
```

---

## 15. Passerelle Linux (NAT & IP Forwarding)

### 15.1 Architecture

Une **passerelle Linux** est une machine Linux avec **deux interfaces réseau** :
- **Interface WAN** (`enp0s3`) : connectée au réseau externe (IUT, Internet)
- **Interface LAN** (`enp0s8`) : connectée au réseau interne privé

```
[H1 192.168.0.2] ──┐
[H2 192.168.0.3] ──┤─── [enp0s8:192.168.0.1 | GATEWAY | enp0s3:172.31.x.x] ──── [IUT / Internet]
[H3 192.168.0.4] ──┘
```

**Deux fonctions essentielles :**
1. **IP Forwarding** : autoriser le noyau Linux à relayer les paquets entre les deux interfaces
2. **NAT Masquerade** : remplacer les adresses IP privées par l'adresse IP publique de la passerelle (SNAT)

### 15.2 IP Forwarding

Par défaut, Linux **jette** les paquets qui ne lui sont pas destinés. L'IP Forwarding lui indique de les retransmettre.

**Vérification :**
```bash
cat /proc/sys/net/ipv4/ip_forward
# 0 = désactivé, 1 = activé
```

**Activation immédiate (non persistante) :**
```bash
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
# ou
sudo sysctl -w net.ipv4.ip_forward=1
```

**Activation permanente** (survit au redémarrage) — éditer `/etc/sysctl.conf` :
```text
net.ipv4.ip_forward=1
```
Puis appliquer :
```bash
sudo sysctl -p
```

### 15.3 NAT Masquerade (iptables)

**Pourquoi le NAT est nécessaire ?**

Sans NAT, H1 envoie un paquet vers l'extérieur avec l'IP source `192.168.0.2` (privée, non routable). Le routeur distant ne sait pas où répondre → le paquet est perdu.

Avec NAT **MASQUERADE**, la passerelle :
1. Intercepte le paquet sortant
2. **Remplace l'IP source** `192.168.0.2` par sa propre IP `172.31.x.x`
3. Mémorise la correspondance dans la table de traduction (NAT table)
4. Quand la réponse arrive, **réécrit** l'IP destination avec `192.168.0.2` et retransmet à H1

**Commande iptables :**
```bash
sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE
# -t nat       : table NAT
# -A POSTROUTING : après la décision de routage
# -o enp0s3    : sur les paquets sortant par l'interface WAN
# -j MASQUERADE : appliquer le masquage d'adresse
```

**Vérification des règles NAT :**
```bash
sudo iptables -t nat -L -v -n
```

### 15.4 Configuration des interfaces

**Sur la passerelle :**
```bash
# Interface interne (LAN) — IP statique
sudo ip a add 192.168.0.1/24 dev enp0s8
sudo ip link set dev enp0s8 up

# Interface externe (WAN) — via DHCP si réseau IUT
sudo dhclient enp0s3

# Vérification
ip -4 -br a    # Vue compacte de toutes les IPs
```

**Sur les clients H1, H2 :**
```bash
sudo ip a add 192.168.0.2/24 dev enp0s3
sudo ip link set dev enp0s3 up
sudo ip route add default via 192.168.0.1    # Passerelle par défaut
```

**Sur H3 (Windows) :** IP : `192.168.0.4` | Masque : `255.255.255.0` | Passerelle : `192.168.0.1`  
⚠️ Windows bloque les pings par défaut → activer via Pare-feu > Partage de fichiers et d'imprimantes.

### 15.5 Configuration DNS sur les clients

```bash
# Éditer /etc/resolv.conf
echo 'nameserver 172.18.26.101' > /etc/resolv.conf
echo 'nameserver 172.18.26.102' >> /etc/resolv.conf

# Test de résolution DNS
nslookup iut-rt
ping iut-rt
```

### 15.6 Protocole de validation

| Étape | Commande | Résultat attendu |
|---|---|---|
| 1. Connectivité locale | `ping 192.168.0.1` | OK (passerelle) |
| 2. Connectivité entre clients | `ping 192.168.0.3` | OK (H2) |
| 3. Connectivité WAN | `ping 172.31.25.9` | OK après NAT |
| 4. Vérifier le saut | `traceroute 8.8.8.8` | 1er saut = 192.168.0.1 |
| 5. DNS | `nslookup iut-rt` | Résout correctement |

### 15.7 Résolution de problèmes courants

| Symptôme | Cause probable | Solution |
|---|---|---|
| Pas de route vers l'extérieur | Route par défaut manquante | `ip route add default via 192.168.0.1` |
| Host unreachable sur passerelle | IP Forwarding = 0 | `echo 1 > /proc/sys/net/ipv4/ip_forward` |
| Ping OK, web KO | DNS non configuré | Modifier `/etc/resolv.conf` |
| Ping Windows bloqué | Pare-feu Windows | Activer règle ICMP entrant |

---

## 16. ACL — Listes de Contrôle d'Accès

### 16.1 Principe

Les ACL (Access Control Lists) sont des **listes de règles de filtrage** configurées sur les interfaces d'un routeur Cisco. Elles permettent d'autoriser ou refuser le trafic selon divers critères.

**Règle implicite finale** : toute ACL se termine par un `deny any` implicite. **Si une ACL ne contient pas de `permit any`, tout ce qui ne correspond à aucune règle explicite sera bloqué.**

**Traitement** : les règles sont évaluées dans l'ordre, de haut en bas. Dès qu'une règle correspond, elle est appliquée et l'évaluation s'arrête.

### 16.2 ACL Standard (numéros 1–99)

**Filtre uniquement sur l'IP source.**

**Placement** : **au plus près de la destination** (car elle manque de précision — elle bloquerait tout le trafic de la source vers n'importe quelle destination si placée près de la source).

```cisco
! Bloquer un hôte spécifique
access-list 1 deny host 192.168.3.20
access-list 1 permit any              ! OBLIGATOIRE pour ne pas tout bloquer

! Bloquer tout un sous-réseau (wildcard = inverse du masque)
access-list 1 deny 192.168.3.0 0.0.0.255
access-list 1 permit any

! Appliquer sur l'interface (OUT = sortie vers la destination)
interface fa0/0
 ip access-group 1 out
```

**Masque générique (wildcard)** : 
- `host 192.168.3.20` = un seul hôte = `192.168.3.20 0.0.0.0`
- `192.168.3.0 0.0.0.255` = tout le sous-réseau `/24`
- `any` = toute adresse = `0.0.0.0 255.255.255.255`

### 16.3 ACL Étendue (numéros 100–199)

**Filtre sur : source, destination, protocole, port.**

**Placement** : **au plus près de la source** (car sa précision permet de bloquer dès l'origine, économisant de la bande passante).

```cisco
! Syntaxe :
access-list [100-199] [permit|deny] [protocole] [src + wildcard] [dest + wildcard] [opérateur port]

! Exemples :
! Autoriser HTTP (TCP port 80) du LAN Belgique vers le serveur web
access-list 100 permit tcp 192.168.3.0 0.0.0.255 host 192.168.1.254 eq 80

! Autoriser le ping (ICMP echo) du LAN Belgique vers le serveur
access-list 100 permit icmp 192.168.3.0 0.0.0.255 host 192.168.1.254 echo

! Appliquer sur l'interface côté source (IN = entrée depuis le LAN)
interface fa0/1
 ip access-group 100 in
```

**Opérateurs de port :**

| Opérateur | Signification |
|:-:|---|
| `eq 80` | Égal au port 80 |
| `gt 1023` | Supérieur au port 1023 |
| `lt 1024` | Inférieur au port 1024 |
| `range 20 21` | Entre les ports 20 et 21 |

### 16.4 Gestion des ACL nommées

```cisco
! ACL standard nommée (plus lisible)
ip access-list standard BLOQUER_PC3
 deny host 192.168.3.20
 permit any

! Modifier une règle (supprimer la règle numéro 10)
ip access-list standard 1
 no 10
 10 deny 192.168.3.0 0.0.0.255

! Voir les ACL
show access-lists
show ip interface fa0/0    ! voir quelles ACL sont appliquées
```

### 16.5 Résumé des règles de placement

| Type ACL | Filtre | Placement |
|---|---|---|
| Standard (1-99) | IP source seulement | **Près de la destination** |
| Étendue (100-199) | Source + destination + protocole + port | **Près de la source** |

---

## 17. Serveurs Web : Apache2 et Nginx

### 17.1 Apache2

**Installation :**
```bash
sudo apt update
sudo apt install apache2 -y
sudo systemctl status apache2    # Vérifier : Active (running)
```

**Structure des fichiers de configuration :**
- Sites disponibles : `/etc/apache2/sites-available/`
- Sites activés (liens symboliques) : `/etc/apache2/sites-enabled/`
- Modules : `sudo a2enmod [module]`
- Activer un site : `sudo a2ensite [site].conf`
- Désactiver : `sudo a2dissite [site].conf`
- Racine web par défaut : `/var/www/html/`

**Configuration d'un Virtual Host :**
```apache
# /etc/apache2/sites-available/vendeur.conf
<VirtualHost *:80>
    ServerName vendeur.localhost
    DocumentRoot /var/www/vendeur
    ErrorLog ${APACHE_LOG_DIR}/vendeur_error.log
    CustomLog ${APACHE_LOG_DIR}/vendeur_access.log combined
</VirtualHost>
```

**Authentification par groupe :**
```bash
sudo a2enmod authz_groupfile
sudo htpasswd -c /etc/apache2/.htpasswd user1    # Créer fichier + user1
sudo htpasswd /etc/apache2/.htpasswd user2        # Ajouter user2
echo "RT1: user1 user2" > /etc/apache2/groups
```
```apache
<Directory "/var/www/html/prive">
    AuthType Basic
    AuthName "Acces Reserve au groupe RT1"
    AuthUserFile /etc/apache2/.htpasswd
    AuthGroupFile /etc/apache2/groups
    Require group RT1
</Directory>
```

**Limitation de bande passante :**
```bash
sudo a2enmod ratelimit
```
```apache
SetOutputFilter RATE_LIMIT
SetEnv rate-limit 40    # 40 KB/s
```

**Pages personnelles (UserDir) :**
```bash
sudo a2enmod userdir
mkdir ~/public_html
chmod 755 /home/administrateur ~/public_html
```
Accès via : `http://IP/~administrateur/`

**Résolution DNS locale pour tests :**
```text
# /etc/hosts sur le client
192.31.25.12  vendeur.localhost client.localhost
```

### 17.2 Nginx + LEMP

**LEMP = Linux + nginx + MariaDB + PHP**

**Installation :**
```bash
sudo systemctl stop apache2
sudo apt install nginx mariadb-server php-fpm php-mysql -y
```

**Configuration PHP-FPM dans Nginx :**
```nginx
# /etc/nginx/sites-available/default
index index.php index.html index.htm;

location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.1-fpm.sock;
}
```

**phpMyAdmin avec Nginx :**
```bash
sudo apt install phpmyadmin    # Sélectionner "aucun serveur web"
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
```

**Logs debug Nginx :**
```nginx
# /etc/nginx/nginx.conf
error_log /var/log/nginx/error.log debug;
```

### 17.3 Commandes de service

```bash
sudo systemctl start|stop|restart|reload|status apache2
sudo systemctl start|stop|restart|reload|status nginx
sudo systemctl enable apache2     # Démarrage automatique au boot
sudo apache2ctl configtest        # Vérifier la syntaxe de la config Apache
sudo nginx -t                     # Vérifier la syntaxe de la config Nginx
```

---

## 18. Téléphonie sur IP (VoIP / Asterisk)

### 18.1 Concepts VoIP

**SIP (Session Initiation Protocol)** : protocole de signalisation pour établir, modifier et terminer des sessions VoIP.  
**Port** : UDP 5060 (signalisation).  
**Encapsulation** : ETH | IP | UDP | SIP

**Flux d'un appel SIP :**
1. **INVITE** : le caller initie l'appel
2. **Ringing** : le callee sonne
3. **200 OK** : le callee décroche
4. **ACK** : confirmation de l'établissement
5. **RTP** : flux audio (Real-time Transport Protocol)
6. **BYE** : raccrochage

**Asterisk** : serveur IPBX open-source. Gère la signalisation SIP (via **PJSIP**) et le routage des appels via le **dialplan** (`extensions.conf`).

### 18.2 Configuration IVR (Interactive Voice Response)

```asterisk
; extensions.conf — Contexte principal
[AccueilAnnonce]
exten => s,1,Answer()
 same => n,Playback(/var/lib/asterisk/sounds/accueil)
 same => n,Background(/var/lib/asterisk/sounds/menu)
 same => n,WaitExten(5)

exten => 1,1,Dial(PJSIP/0106,12)
 same => n,VoiceMail(0106@default)    ; Si pas de réponse → messagerie

exten => 2,1,Dial(PJSIP/0206,12)
exten => 3,1,SayUnixTime()
```

**Enregistrement d'un message vocal :**
```asterisk
exten => 0901,1,Record(/var/lib/asterisk/sounds/accueil.gsm)
```

### 18.3 Trunk SIP entre deux serveurs Asterisk

**`pjsip.conf` — blocs clés :**
```ini
[siptrunk-auth]
type=auth
auth_type=userpass
username=Trunk06
password=12345

[siptrunk-identify]
type=identify
endpoint=siptrunk
match=10.15.251.146    ; IP du serveur distant (binôme)

[siptrunk-registration]
type=registration
server_uri=sip:10.15.251.146
client_uri=sip:Trunk06@10.15.251.146
```

**`extensions.conf` — routage vers le site distant :**
```asterisk
; Numéros commençant par 07XX → envoyer via le trunk
exten => _07XX,1,Dial(PJSIP/${EXTEN}@siptrunk,12)
```

**Vérification depuis la CLI Asterisk :**
```asterisk
pjsip show registrations    # Statut : Registered
pjsip show endpoints        # Statut : Reachable
```

---

## 19. Administration Cisco IOS — Aide-mémoire

### 19.1 Modes IOS

```
>  : Mode utilisateur (User EXEC)
#  : Mode privilégié (Privileged EXEC) — accès via : enable
(config)#  : Mode configuration globale — accès via : configure terminal
(config-if)#  : Mode configuration d'interface
(config-router)#  : Mode configuration routage
(config-vlan)#  : Mode configuration VLAN
```

**Navigation :**
```cisco
enable                    ! Entrer en mode privilégié
configure terminal        ! Entrer en mode configuration
end / Ctrl+Z              ! Retour en mode privilégié
exit                      ! Remonter d'un niveau
do show ip route          ! Exécuter une commande EXEC depuis le mode config
```

### 19.2 Configuration de base

```cisco
hostname SW1                        ! Nommer l'équipement
no ip domain-lookup                 ! Désactiver résolution DNS (évite les attentes)
service password-encryption         ! Chiffrer les mots de passe

enable secret monmotdepasse         ! Mot de passe privilégié (chiffré)
line console 0
 password cisco
 login

write memory                        ! Sauvegarder la configuration
! ou
copy running-config startup-config
```

### 19.3 Configuration IP d'une interface

**Routeur :**
```cisco
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown                         ! Activer l'interface (DOWN par défaut)
 description Vers_LAN_Admin
 exit
```

**Interface série (WAN physique) :**
```cisco
interface Serial0/1/0
 ip address 10.1.0.1 255.255.0.0
 clock rate 128000                   ! UNIQUEMENT côté DCE
 no shutdown
 exit
```

**Switch — IP de gestion :**
```cisco
interface vlan 1                     ! Interface de gestion
 ip address 192.168.1.10 255.255.255.0
 no shutdown
 exit
ip default-gateway 192.168.1.1
```

### 19.4 Commandes de vérification essentielles

```cisco
! ─── Interfaces ───
show ip interface brief              ! Tableau synthétique : IP, état
show interfaces GigabitEthernet0/0   ! Détails complets d'une interface
show controllers Serial0/0/0         ! DCE ou DTE sur une liaison série

! ─── Routage ───
show ip route                        ! Table de routage
show ip protocols                    ! Protocoles de routage actifs
show ip ospf neighbor                ! Voisins OSPF
show ip rip database                 ! Base de données RIP

! ─── VLAN & Switch ───
show vlan brief                      ! Liste des VLANs et ports
show interfaces trunk                ! Ports trunk et VLANs autorisés
show mac address-table               ! Table MAC
show spanning-tree                   ! État STP
show etherchannel summary            ! Résumé des EtherChannels

! ─── Général ───
show running-config                  ! Configuration active en RAM
show startup-config                  ! Configuration sauvegardée en NVRAM
show version                         ! Version IOS, modèle, uptime
ping 192.168.1.10                    ! Test de connectivité
traceroute 192.168.2.10              ! Tracer le chemin
```

### 19.5 Cisco Packet Tracer — spécificités

- **Lien vert** = interface UP (couches 1 et 2 actives)
- **Lien orange** = initialisation STP
- **Lien rouge** = interface DOWN
- **Mode Simulation** : visualiser le contenu de chaque paquet étape par étape
- Configuration PC : Desktop > IP Configuration
- `no ip domain-lookup` : évite que Cisco essaie de résoudre les commandes mal tapées comme des noms DNS (économise du temps)

---

## 20. Commandes Réseau Linux — Aide-mémoire

### 20.1 Gestion des interfaces (iproute2)

```bash
# ─── Afficher ───
ip a                          # Toutes les interfaces et leurs adresses
ip -4 -br a                   # IPv4 seulement, format compact
ip link show                  # État des interfaces (UP/DOWN)
ip r                          # Table de routage
ip n                          # Table ARP (voisins)

# ─── Configurer ───
sudo ip a add 192.168.0.1/24 dev enp0s8      # Ajouter une IP
sudo ip a del 192.168.0.1/24 dev enp0s8      # Supprimer une IP
sudo ip link set dev enp0s8 up               # Activer une interface
sudo ip link set dev enp0s8 down             # Désactiver une interface
sudo ip route add default via 192.168.0.1    # Route par défaut
sudo ip route add 10.0.0.0/8 via 192.168.1.254  # Route statique spécifique
sudo dhclient enp0s3                         # Obtenir une IP via DHCP
```

### 20.2 Test de connectivité

```bash
ping 8.8.8.8                    # Test ICMP
ping -c 4 192.168.1.1           # 4 pings seulement
traceroute 8.8.8.8              # Tracer le chemin (utilise UDP par défaut sous Linux)
tracepath 8.8.8.8               # Variante sans root requis

# DNS
nslookup iut-rt                 # Résolution DNS simple
dig iut-rt                      # Résolution DNS détaillée
host iut-rt                     # Résolution rapide

# ARP
arp -a                           # Table ARP
ip n flush dev enp0s3            # Vider le cache ARP d'une interface
```

### 20.3 Analyse de ports et connexions

```bash
ss -tnp                          # Connexions TCP actives avec PID
ss -unp                          # Connexions UDP actives
ss -n | grep 8000                # Filtrer par port
netstat -tulnp                   # Ancien équivalent (net-tools)

# Netcat — simuler client/serveur
nc -l 8000                       # Écouter sur le port 8000 (serveur)
nc localhost 8000                 # Se connecter au port 8000 (client)
nc -u -l 9000                    # Mode UDP serveur
nc -u localhost 9000              # Mode UDP client
```

### 20.4 Wireshark / Capture de trafic

```bash
sudo wireshark &                  # Lancer Wireshark en arrière-plan
sudo tcpdump -i enp0s3            # Capture en ligne de commande
sudo tcpdump -i enp0s3 port 80    # Filtrer par port
```

**Filtres Wireshark courants :**

| Filtre | Signification |
|---|---|
| `tcp` | Tout le trafic TCP |
| `udp` | Tout le trafic UDP |
| `icmp` | Pings et messages ICMP |
| `tcp.port == 80` | Trafic HTTP |
| `arp` | Requêtes et réponses ARP |
| `ip.addr == 192.168.1.1` | Trafic de/vers cette IP |
| `tcp.flags.syn == 1` | Paquets SYN (début de connexion) |

### 20.5 Scans Nmap

```bash
sudo nmap -sS localhost           # Scan SYN Stealth (discret)
sudo nmap -sV 192.168.1.0/24     # Scan réseau + détection de versions
nmap -p 80,443,22 192.168.1.1    # Scanner des ports spécifiques
```

**Types de scans :**

| Option | Type | Comportement |
|---|---|---|
| `-sS` | SYN Stealth | Envoie SYN, attend SYN/ACK, répond RST (discret) |
| `-sT` | TCP Connect | Connexion complète (loggée) |
| `-sU` | UDP | Scanne les ports UDP |
| `-sX` | Xmas | Flags FIN + PSH + URG allumés |
| `-sN` | Null | Aucun flag |

⚠️ Scanner des machines tiers sans autorisation est illégal.

### 20.6 Gestion des services systemd

```bash
sudo systemctl start apache2
sudo systemctl stop apache2
sudo systemctl restart apache2    # Stop + start
sudo systemctl reload apache2     # Recharger la config sans interruption
sudo systemctl enable apache2     # Démarrage automatique au boot
sudo systemctl disable apache2
sudo systemctl status apache2     # État du service
```

### 20.7 Configuration DNS client

```bash
# Fichier /etc/resolv.conf
echo 'nameserver 172.18.26.101' > /etc/resolv.conf
echo 'nameserver 1.1.1.1' >> /etc/resolv.conf

# Résolution DNS locale sans serveur (/etc/hosts)
echo '192.168.1.10  serveur.local' >> /etc/hosts

# Proxy pour accès Internet (IUT)
# Dans Firefox : Préférences > Réseau > Manuel
# Proxy HTTP : cache-etu.univ-artois.fr  Port : 3128
```

### 20.8 IP Forwarding et iptables

```bash
# IP Forwarding
cat /proc/sys/net/ipv4/ip_forward            # Vérifier (0 ou 1)
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward  # Activer (temporaire)
sudo sysctl -w net.ipv4.ip_forward=1         # Activer via sysctl

# iptables NAT
sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE
sudo iptables -t nat -L -v -n                # Lister les règles NAT

# Sauvegarder/restaurer les règles iptables
sudo iptables-save > /etc/iptables/rules.v4
sudo iptables-restore < /etc/iptables/rules.v4
```

---

## Annexe A — Tableau des protocoles de référence

| Protocole | Couche | Port | Transport | Fonction |
|---|:-:|:-:|:-:|---|
| Ethernet | 2 | — | — | Trames sur LAN, adresses MAC |
| ARP | 2↔3 | — | — | IP → MAC sur LAN |
| IP | 3 | — | — | Routage global (adresses IPv4/IPv6) |
| ICMP | 3 | — | — | Diagnostic (ping, erreurs, traceroute) |
| RIP | 3 | 520 | UDP | Routage dynamique distance-vector |
| OSPF | 3 | — | IP (89) | Routage dynamique link-state |
| TCP | 4 | — | — | Transport fiable, orienté connexion |
| UDP | 4 | — | — | Transport rapide, sans connexion |
| DNS | 7 | 53 | UDP/TCP | Nom de domaine → IP |
| DHCP | 7 | 67/68 | UDP | Attribution automatique IP |
| HTTP | 7 | 80 | TCP | Web non chiffré |
| HTTPS | 7 | 443 | TCP | Web chiffré (HTTP + TLS) |
| SSH | 7 | 22 | TCP | Shell distant sécurisé |
| FTP | 7 | 20/21 | TCP | Transfert de fichiers |
| Telnet | 7 | 23 | TCP | Shell distant non chiffré (déprécié) |
| SIP | 7 | 5060 | UDP | Signalisation VoIP |

---

## Annexe B — Calculs rapides : mémo IPv4

**Étant donné une adresse `A.B.C.D/n` :**

| À calculer | Méthode |
|---|---|
| Adresse réseau | `A.B.C.D AND masque` (bits HostID à 0) |
| Broadcast | Bits HostID à 1 |
| Première IP utilisable | Adresse réseau + 1 |
| Dernière IP utilisable | Broadcast − 1 |
| Nombre d'hôtes | 2^(32−n) − 2 |
| Masque décimal | Compter les 1 par octet |

**Exemples de calculs fréquents en examen :**

| Réseau | Masque | Broadcast | Hôtes | 1ère IP | Dernière IP |
|---|---|---|:-:|---|---|
| `192.168.1.128/25` | `255.255.255.128` | `192.168.1.255` | 126 | `192.168.1.129` | `192.168.1.254` |
| `192.168.10.0/26` | `255.255.255.192` | `192.168.10.63` | 62 | `192.168.10.1` | `192.168.10.62` |
| `192.168.10.64/26` | `255.255.255.192` | `192.168.10.127` | 62 | `192.168.10.65` | `192.168.10.126` |
| `10.1.4.32/27` | `255.255.255.224` | `10.1.4.63` | 30 | `10.1.4.33` | `10.1.4.62` |
| `172.16.0.0/16` | `255.255.0.0` | `172.16.255.255` | 65 534 | `172.16.0.1` | `172.16.255.254` |
| `10.0.0.0/8` | `255.0.0.0` | `10.255.255.255` | 16 777 214 | `10.0.0.1` | `10.255.255.254` |

---

## Annexe C — Mnémotechniques et points de vigilance

**Points critiques lors d'une soutenance :**

1. **"Pourquoi une adresse MAC change à chaque saut ?"**  
   → La MAC est locale : elle identifie le prochain équipement sur le lien physique actuel. Quand un routeur retransmet, il réécrit la MAC source (sa propre MAC) et la MAC destination (MAC du prochain saut). L'IP source/destination ne change jamais (sauf NAT).

2. **"Pourquoi pas de routage sans masque ?"**  
   → Le masque dit au routeur quelle partie de l'IP est "réseau" et quelle partie est "hôte". Sans masque, impossible de faire l'opération AND pour trouver l'adresse réseau et décider si la destination est locale ou distante.

3. **"Quelle est la différence entre ARP et DNS ?"**  
   → ARP résout IP→MAC (couche 2, portée locale, réponse directe). DNS résout Nom→IP (couche 7, portée globale, serveur centralisé).

4. **"Pourquoi TCP est fiable et pas UDP ?"**  
   → TCP numérote chaque octet, le récepteur envoie des ACK, et l'émetteur retransmet si nécessaire. UDP envoie et oublie.

5. **"Différence ACL Standard vs Étendue ?"**  
   → Standard = filtre IP source uniquement, placée près de la destination. Étendue = filtre source + destination + protocole + port, placée près de la source.

6. **"Pourquoi `no auto-summary` dans RIP ?"**  
   → Sans ça, RIPv2 regroupe les routes par classe. Si on a `10.1.0.0/16` et `192.168.1.0/24`, RIP annoncerait `10.0.0.0/8` et `192.168.0.0/24` (classful). Avec des masques différents mélangés, ça causerait des erreurs de routage.

7. **"Pourquoi OSPF est meilleur que RIP ?"**  
   → OSPF est link-state (carte complète vs vecteur de distance), convergence rapide, pas de limite de sauts, métrique basée sur la bande passante (pas juste le nombre de sauts).

8. **"Pourquoi NAT ?"**  
   → Les adresses privées (RFC 1918) ne sont pas routables sur Internet. NAT masque toutes les machines d'un réseau privé derrière une seule IP publique, ce qui économise des adresses IPv4 et isole le réseau interne.

9. **"Différence entre `deny any` et `permit any` dans une ACL ?"**  
   → Toute ACL se termine par un `deny any` implicite (tout ce qui n'est pas explicitement autorisé est refusé). Si on veut autoriser le reste après avoir bloqué certaines choses, il FAUT ajouter `permit any` explicitement.

10. **"Qu'est-ce que le TTL ?"**  
    → Champ de l'en-tête IP décrémenté de 1 à chaque routeur. Quand il atteint 0, le routeur détruit le paquet et envoie un ICMP "Time Exceeded" à la source. Empêche les boucles infinies. Valeurs initiales : 64 (Linux), 128 (Windows), 255 (Cisco).

---

*Document rédigé à partir des TPs, cours et SAE de 1ère année BUT R&T — IUT d'Artois, Béthune.*  
*Briac Le Meillat — 2025/2026*
