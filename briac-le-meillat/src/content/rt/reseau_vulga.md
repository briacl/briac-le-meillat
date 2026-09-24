---
title: ""
module: ""
competence: ""
ac_lies: []
techs: []
date: "2026-07-11"
status: "Terminé"
image: ""
---

# Le Réseau expliqué — De zéro à technicien
### Par Briac Le Meillat | BUT R&T 1ère année

> Ce document, c'est un an de cours de réseau raconté comme si NetworkChuck me l'avait expliqué. L'idée : n'importe qui qui n'y connaît rien doit pouvoir le lire du début à la fin et comprendre comment fonctionne un réseau — des bits jusqu'à la téléphonie sur IP. Et pour ceux qui veulent aller plus loin, chaque section finit par "La vraie tech" avec les vrais noms de protocoles, les couches OSI, les commandes.
>
> Le fil rouge : toi, ton papa et ta maman. Trois PC. On va les connecter, les sécuriser, leur faire accéder à Internet — en comprenant pourquoi chaque chose existe.

---

## Table des matières

**Partie 1 — Les fondations**
1. [Le binaire — la langue secrète des machines](#1-le-binaire)
2. [Les couches OSI et TCP/IP — le voyage d'un message](#2-les-couches-osi-et-tcpip)
3. [L'encapsulation — les poupées russes du réseau](#3-lencapsulation)

**Partie 2 — Relier deux PC**
4. [La trame Ethernet et l'adresse MAC](#4-ethernet-et-ladresse-mac)
5. [L'adresse IPv4 — ton numéro de téléphone sur le réseau](#5-ladresse-ipv4)
6. [ARP — "C'est qui le 192.168.1.1 ?"](#6-arp)
7. [IP et ICMP — le voyage du paquet et le ping](#7-ip-et-icmp)

**Partie 3 — Connecter plusieurs machines**
8. [Le switch et la table CAM](#8-le-switch)
9. [Les VLAN et le trunk 802.1Q](#9-les-vlan)
10. [STP — éviter les boucles infinies](#10-stp)
11. [EtherChannel — plusieurs câbles, une seule autoroute](#11-etherchannel)

**Partie 4 — TCP, UDP et les ports**
12. [TCP vs UDP — le recommandé vs la radio](#12-tcp-vs-udp)
13. [Les ports — les quais du port du Havre](#13-les-ports)

**Partie 5 — Sortir du sous-réseau**
14. [Le routeur — le chef d'orchestre des réseaux](#14-le-routeur)
15. [Routage inter-VLAN — le router-on-a-stick](#15-routage-inter-vlan)
16. [Routage statique — les panneaux posés à la main](#16-routage-statique)
17. [Routage dynamique — RIPv2 et OSPF](#17-routage-dynamique)
18. [NAT/PAT — le réceptionniste de l'hôtel](#18-nat-pat)

**Partie 6 — Les protocoles applicatifs**
19. [DNS — l'annuaire d'Internet](#19-dns)
20. [DHCP — le serveur qui distribue les adresses](#20-dhcp)
21. [HTTP/HTTPS et TLS — le web de bout en bout](#21-http-https-tls)
22. [SSH — se connecter à distance en sécurité](#22-ssh)
23. [FTP et PXE — transfert de fichiers et boot réseau](#23-ftp-et-pxe)

**Partie 7 — Sécurité et filtrage**
24. [ACL Cisco — le videur de boîte](#24-acl-cisco)
25. [iptables et nftables — le portier Linux](#25-iptables-nftables)

**Partie 8 — Infrastructure avancée**
26. [La virtualisation — VM, Docker, hyperviseurs](#26-la-virtualisation)
27. [Haute disponibilité et clusters](#27-clusters-et-ha)
28. [Cloud et Green Computing](#28-cloud-et-green-computing)
29. [Serveurs web — Apache2 et Nginx](#29-serveurs-web)
30. [VoIP et Asterisk — la voix sur IP](#30-voip-asterisk)

**Partie 9 — IPv6**
31. [IPv6 — le futur qui est déjà là](#31-ipv6)

**Partie 10 — Le Web de l'URL à l'écran**
32. [De l'URL à l'écran — le parcours complet](#32-de-lurl-a-lecran)
33. [Le navigateur — l'architecte et le traducteur](#33-le-navigateur)

**Annexes**
- [Commandes Cisco IOS essentielles](#annexe-a--cisco-ios)
- [Commandes Linux réseau essentielles](#annexe-b--linux-réseau)
- [Windows Server et Active Directory](#annexe-c--windows-server)
- [Tableau des protocoles de référence](#annexe-d--protocoles)

---

## PARTIE 1 — LES FONDATIONS

---

## 1. Le Binaire

### L'histoire

Imagine que tu essaies d'envoyer un message à ton papa en morse. Tu n'as qu'une lampe torche. Allumée, c'est un 1. Éteinte, c'est un 0. C'est tout ce que tu as. Et pourtant, avec ça, on peut encoder n'importe quelle information — du texte, des images, de la musique, des films.

Les ordinateurs, c'est exactement ça. Ils ne parlent qu'une langue : les transistors. Un transistor, c'est un tout petit interrupteur électronique. **Ouvert = 0, fermé = 1.** Chaque transistor transporte un **bit** (Binary Digit). Un bit tout seul ne sert à rien. Mais quand tu en mets 8 ensemble, tu obtiens un **octet**, et là ça devient intéressant.

### Pourquoi 8 bits ?

Un octet, c'est une boîte à 8 interrupteurs. Chaque interrupteur peut être à 0 ou à 1. Ça donne 2⁸ = **256 combinaisons possibles** — de 0 à 255. C'est suffisant pour représenter tous les caractères d'un clavier, toutes les valeurs d'une couleur RVB, ou... chaque partie d'une adresse IP.

```
Position :  2⁷  2⁶  2⁵  2⁴  2³  2²  2¹  2⁰
Valeur   : 128   64   32   16   8    4    2    1

Exemple : 11000000 = 128 + 64 = 192
Exemple : 10101000 = 128 + 8 = 168
```

Tu vois où je veux en venir ? `192.168.1.1`, c'est **quatre octets**, quatre fois 8 bits, soit 32 bits en tout. C'est une adresse IPv4. Chaque chiffre entre deux points, c'est un nombre entre 0 et 255. Rien de plus.

### L'hexadécimal — le raccourci des développeurs

8 bits à lire, c'est long. Alors on a inventé le **système hexadécimal** (base 16), qui compresse 4 bits en un seul caractère.

```
Décimal  Binaire   Hex
  0       0000      0
  9       1001      9
 10       1010      A
 15       1111      F
```

Un octet = 2 caractères hex. C'est pourquoi les adresses MAC s'écrivent `AA:BB:CC:11:22:33` — 6 octets, 12 caractères hexadécimaux.

En réseau, tu croiseras souvent des valeurs hex dans les en-têtes de trames :
- `0x0800` → IPv4 dans une trame Ethernet
- `0x0806` → ARP
- `0x86DD` → IPv6
- `0x8100` → tag VLAN 802.1Q

---

> **La vraie tech — Couche concernée : aucune spécifiquement**
> Le binaire est le socle de tout. Une adresse IPv4 = 32 bits. Une adresse IPv6 = 128 bits. Une adresse MAC = 48 bits. Tout l'adressage réseau repose sur la puissance de 2.
>
> **Nombres magiques des masques** : `0, 128, 192, 224, 240, 248, 252, 254, 255` — ce sont les seules valeurs valides dans un masque de sous-réseau. Chaque octet d'un masque est l'un de ces neuf nombres, et rien d'autre.

---

## 2. Les Couches OSI et TCP/IP

### L'histoire

Dematt. Imagine que tu veux envoyer un cadeau à ton papa qui habite à l'autre bout de la France. Tu ne mets pas juste le cadeau dans ta voiture et tu roules. Tu :
1. Embales le cadeau dans du papier bulle
2. Le mets dans une boîte avec une étiquette d'expédition
3. Déposes la boîte au bureau de poste
4. La poste la charge dans un camion
5. Le camion roule sur une autoroute

À chaque étape, quelqu'un s'occupe d'une tâche précise. Le facteur ne sait pas ce qu'il y a dans la boîte. Le camionneur ne sait pas que c'est pour papa. Chacun fait son boulot à son niveau.

C'est exactement ce qu'est le **modèle OSI** : une façon d'organiser le travail en **7 couches**, où chaque couche s'occupe d'un aspect précis de la communication réseau.

### Mais concrètement, une "couche", c'est où ?

C'est la vraie question. Quand on dit "couche 3", ce n'est pas un meuble dans une salle serveur. Une couche, c'est un **niveau d'abstraction dans le traitement des données**, qui se manifeste :
- **Dans la RAM de ta machine** : quand ton navigateur prépare une requête HTTP, il y a une zone mémoire pour les données applicatives, une autre pour l'en-tête TCP, une autre pour l'en-tête IP
- **Dans le câble** : au moment où les données quittent ta carte réseau, tout est mélangé en bits. Mais dans ce flux de bits, les octets 0-5 sont la MAC destination, les octets 6-11 sont la MAC source, etc. Chaque "couche" correspond à une portion précise des données

**Une "couche", c'est une portion d'un paquet, traitée par un équipement ou un logiciel précis.**

### Le modèle OSI — 7 couches

```
┌────────────────────────────────────────────────────┐
│  7 — Application   │ Ce que voit l'utilisateur     │
│  6 — Présentation  │ Format, chiffrement (TLS)     │
│  5 — Session       │ Gestion des sessions          │
│  4 — Transport     │ TCP / UDP — fiabilité         │
│  3 — Réseau        │ IP — adressage logique        │
│  2 — Liaison       │ Ethernet, MAC, switch         │
│  1 — Physique      │ Bits sur le câble             │
└────────────────────────────────────────────────────┘
```

Moyen mnémotechnique (de haut en bas) : **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing.

### Le modèle TCP/IP — la version pratique

En pratique, on utilise surtout le modèle TCP/IP qui regroupe les couches 5-6-7 en une seule couche "Application" :

| Couche OSI | N° | Couche TCP/IP | Protocoles |
|---|:-:|---|---|
| Application/Présentation/Session | 7-6-5 | **Application** | HTTP, SSH, DNS, DHCP, SIP |
| Transport | 4 | **Transport** | TCP, UDP |
| Réseau | 3 | **Internet** | IP, ICMP, OSPF |
| Liaison + Physique | 2-1 | **Accès réseau** | Ethernet (802.3), ARP |

### Quel équipement travaille à quelle couche ?

| Équipement | Couche | Ce qu'il voit |
|---|:-:|---|
| **Câble / Hub** | 1 | Des bits bruts |
| **Switch** | 2 | Des trames Ethernet (adresses MAC) |
| **Routeur** | 3 | Des paquets IP (adresses IP) |
| **Ton PC / serveur** | 4 à 7 | TCP, UDP, HTTP, tout |

Un switch ne "sait" pas ce qu'il y a dans le paquet IP. Il voit juste les adresses MAC et fait son travail. Un routeur, lui, "ouvre" la couche 2 (il vérifie la MAC), puis lit la couche 3 (l'IP de destination) pour décider où envoyer le paquet.

---

> **La vraie tech**
> Le modèle OSI est défini par l'ISO (ISO/IEC 7498). Le modèle TCP/IP est issu des travaux ARPA (RFC 1122). En pratique, les ingénieurs utilisent le modèle TCP/IP au quotidien mais référencent souvent les couches OSI pour la précision ("problème de couche 2", "filtrage couche 4").

---

## 3. L'Encapsulation

### L'histoire

Tu veux envoyer un email à papa. Tu tapes ton message dans ton logiciel de mail. Mais entre "Envoyer" et les électrons qui circulent dans le câble, il se passe quelque chose de fascinant : ton message est emballé, re-emballé, re-re-emballé. Comme des **poupées russes**.

À chaque couche, on rajoute un **en-tête** (parfois un pied aussi) qui contient les informations nécessaires pour cette couche. C'est ça, l'**encapsulation**.

### Comment ça marche concrètement

Ton texte "Salut papa" part de la couche Application :

```
7 — Application  →  [ "Salut papa" ]
                                ↓ ajout en-tête HTTP
4 — Transport    →  [ TCP header | "Salut papa" ]
                                ↓ ajout en-tête IP
3 — Réseau       →  [ IP header | TCP header | "Salut papa" ]
                                ↓ ajout en-tête + pied Ethernet
2 — Liaison      →  [ ETH header | IP header | TCP header | "Salut papa" | CRC ]
                                ↓
1 — Physique     →  0101101001011010110101010...  (bits sur le câble)
```

À l'arrivée chez papa, le processus inverse se produit : **désencapsulation**. Sa carte réseau lit l'en-tête Ethernet, confirme que la trame lui est destinée, retire l'en-tête Ethernet et passe le reste à la couche IP. La couche IP lit l'en-tête IP, confirme que le paquet lui est destiné, retire l'en-tête IP, passe à TCP. Et ainsi de suite jusqu'à ce que le texte "Salut papa" arrive dans son logiciel de mail.

### Les noms selon la couche

Selon la couche où on se trouve, les données emballées portent un nom différent :

| Couche | Nom de l'unité |
|---|---|
| Application (HTTP, DNS...) | **Message** / données |
| Transport (TCP/UDP) | **Segment** (TCP) ou **Datagramme** (UDP) |
| Réseau (IP) | **Paquet** |
| Liaison (Ethernet) | **Trame** |
| Physique | **Bits** |

### Les encapsulations classiques à connaître

| Situation | Encapsulation complète |
|---|---|
| Tu fais un ping | `ETH \| IP \| ICMP` |
| Tu charges une page web | `ETH \| IP \| TCP \| HTTP` |
| Tu te connectes en SSH | `ETH \| IP \| TCP \| SSH` |
| Ton PC cherche le DNS | `ETH \| IP \| UDP \| DNS` |
| Ton PC demande une IP | `ETH \| IP \| UDP \| DHCP` |
| Ton PC cherche une MAC | `ETH \| ARP` (pas d'IP ici !) |

> **Note importante sur ARP** : ARP est l'exception. C'est le seul protocole courant qui encapsule directement dans Ethernet sans passer par IP. Il opère strictement à la couche 2/3 frontière, pour résoudre une MAC à partir d'une IP.

---

> **La vraie tech**
> L'encapsulation est définie dans chaque RFC de protocole. Le concept est central au modèle OSI (ISO/IEC 7498-1). En Ethernet, l'en-tête IP commence à l'octet 14 de la trame (après 6+6+2 octets d'en-tête Ethernet). L'en-tête TCP commence à l'octet 14+20=34 (IP standard sans options). Wireshark te permet de visualiser exactement chaque couche en couleur.
>
> → Simulation disponible : `bible_code/module_01_liaison/03_encapsulateur.py`

---

## PARTIE 2 — RELIER DEUX PC

---

## 4. Ethernet et l'adresse MAC

### L'histoire

Papa et toi êtes dans la même maison. Tu prends un câble Ethernet, tu le branches entre vos deux PC. Aucune configuration particulière — juste un câble. Mais déjà là, pour qu'un bit voyagea de ton PC à celui de papa, il faut un protocole. Ce protocole s'appelle **Ethernet**.

Ethernet, c'est la langue parlée sur le câble. Quand tu envoies des données, elles ne partent pas comme ça, n'importe comment. Elles sont structurées dans une **trame Ethernet**, comme une lettre dans une enveloppe.

### L'adresse MAC — la carte d'identité de ta carte réseau

Avant même de parler de la trame, parlons de l'adresse MAC. MAC, c'est **Media Access Control**. C'est un identifiant unique gravé dans ta carte réseau au moment de sa fabrication. Comme un numéro de série.

```
Format : AA:BB:CC:11:22:33
         ───────  ────────
         OUI      NIC
     (fabricant) (numéro carte)
```

Les 3 premiers octets identifient le fabricant (OUI — Organizationally Unique Identifier). Les 3 derniers identifient la carte spécifique.

Sur Linux :
```bash
ip link show     # ou
ip a             # → affiche enp0s3: ... link/ether AA:BB:CC:11:22:33
```

Sur Windows :
```cmd
ipconfig /all    # → Adresse physique : AA-BB-CC-11-22-33
```

### La trame Ethernet — l'enveloppe sur le câble

Voici à quoi ressemble une trame Ethernet (au niveau des octets) :

```
[ Préambule 7B | SFD 1B | MAC Dest 6B | MAC Src 6B | EtherType 2B | Données 46-1500B | CRC 4B ]
```

| Champ | Taille | Rôle |
|---|:-:|---|
| Préambule | 7 octets | Synchronisation — "attention, trame qui arrive" |
| SFD | 1 octet | Start Frame Delimiter — "la trame commence maintenant" |
| MAC Destination | 6 octets | À qui c'est destiné. `FF:FF:FF:FF:FF:FF` = broadcast |
| MAC Source | 6 octets | Qui envoie |
| EtherType | 2 octets | Quel protocole suit (`0x0800`=IPv4, `0x0806`=ARP) |
| Données | 46–1500 o. | Le contenu (IP+TCP+HTTP par exemple) |
| CRC | 4 octets | Contrôle d'intégrité — détecte les corruptions |

Une trame qui arrive avec un CRC incorrect est jetée sans aucun message d'erreur. Silence total. C'est la couche 2 qui gère l'intégrité physique.

### CSMA/CD — comment deux PC évitent de parler en même temps

Sur un câble partagé (comme à l'époque des hubs), deux PC peuvent essayer d'envoyer en même temps. Résultat : **collision**, les deux trames sont corrompues.

Le protocole **CSMA/CD** (Carrier Sense Multiple Access / Collision Detection) résout ça :
1. **Écoute** avant d'émettre — si quelqu'un parle, j'attends
2. **Détecte** si une collision arrive quand même
3. **Attend un délai aléatoire** avant de réémettre

Avec les switches modernes (chaque port = lien dédié), les collisions n'existent plus. Mais le principe reste dans la spec.

---

> **La vraie tech**
> Ethernet est défini par **IEEE 802.3**. Couches concernées : **1 (physique)** et **2 (liaison)**. Câble Cat5e : 1 Gbps à 100m. Cat6 : 10 Gbps à 55m. Connecteur : RJ45. Les équipements modernes ont l'**Auto MDI-X** qui détecte automatiquement si le câble est droit ou croisé.
>
> → Simulation disponible : `bible_code/module_01_liaison/01_sniffer_ethernet.py`

---

## 5. L'adresse IPv4

### L'histoire

Super, tu as un câble entre ton PC et celui de papa. Mais comment tu identifies ton PC et le sien ? Les adresses MAC, c'est pour le réseau local — elles ne sont pas routables sur Internet. Pour parler à quelqu'un à l'autre bout du monde, il faut un système d'adressage logique, organisé hiérarchiquement. C'est l'**adresse IPv4**.

Pense à ton adresse postale. Elle a une hiérarchie : pays → département → ville → rue → numéro. Une adresse IP, c'est pareil : réseau → sous-réseau → machine.

### Structure d'une adresse IPv4

Une adresse IPv4, c'est **32 bits**, écrits en 4 octets séparés par des points :

```
192   .  168   .   1   .   1
↑          ↑       ↑       ↑
octet 1   octet 2  octet 3  octet 4

En binaire :
11000000 . 10101000 . 00000001 . 00000001
```

Chaque octet vaut entre 0 et 255. C'est tout.

Mais une adresse seule ne suffit pas. Il faut aussi le **masque de sous-réseau** pour savoir quelle partie identifie le réseau et quelle partie identifie la machine.

### Le masque — couper l'adresse en deux

Le masque de sous-réseau est aussi sur 32 bits. Il est constitué de 1 consécutifs (la partie réseau) suivis de 0 consécutifs (la partie hôte). C'est une **règle absolue** — jamais de 0 avant des 1.

```
IP     : 192.168.1.10
Masque : 255.255.255.0  = /24 (24 bits à 1)

En binaire :
IP     : 11000000.10101000.00000001.00001010
Masque : 11111111.11111111.11111111.00000000
AND    : 11000000.10101000.00000001.00000000 = 192.168.1.0
                                              ↑ adresse réseau
```

L'opération ET logique (AND) bit à bit entre l'IP et le masque donne l'**adresse réseau**. C'est toujours comme ça qu'on la calcule.

### La notation CIDR

Au lieu d'écrire le masque en décimal, on écrit juste le nombre de bits à 1 après un `/` :

| Masque décimal | CIDR | Hôtes utilisables |
|---|:-:|:-:|
| 255.255.255.0 | /24 | 254 |
| 255.255.255.128 | /25 | 126 |
| 255.255.255.192 | /26 | 62 |
| 255.255.255.252 | /30 | 2 |

La formule : **2ⁿ − 2** où n = nombre de bits à 0. On retire 2 pour l'adresse réseau et l'adresse de broadcast.

### Les adresses réservées

Dans chaque réseau, deux adresses ne peuvent jamais être assignées à une machine :
- **Adresse réseau** : tous les bits hôte à 0 (ex: `192.168.1.0`)
- **Adresse de broadcast** : tous les bits hôte à 1 (ex: `192.168.1.255`)

### Les adresses privées (RFC 1918)

Ces plages d'adresses sont réservées aux réseaux internes. Elles ne circulent **jamais** sur Internet — le NAT s'en occupera plus tard.

| Plage | CIDR | Usage typique |
|---|:-:|---|
| `10.0.0.0` – `10.255.255.255` | /8 | Grandes entreprises |
| `172.16.0.0` – `172.31.255.255` | /12 | Moyennes entreprises |
| `192.168.0.0` – `192.168.255.255` | /16 | Domicile, PME |

Et quelques adresses spéciales :
- `127.0.0.1` → loopback (ton PC te parle à lui-même)
- `169.254.x.x` → APIPA (ton PC s'auto-attribue une IP quand le DHCP ne répond pas)
- `0.0.0.0` → route par défaut (vers tout le monde)

### Découpage en sous-réseaux

Si tu as un `/24` (256 adresses) et que tu veux le couper en 4 sous-réseaux, tu passes en `/26` (64 adresses chacun). Règle : ajouter n bits au masque = créer 2ⁿ sous-réseaux.

```
192.168.1.0/24 découpé en /26 :
→ 192.168.1.0/26   (hôtes : .1 à .62)
→ 192.168.1.64/26  (hôtes : .65 à .126)
→ 192.168.1.128/26 (hôtes : .129 à .190)
→ 192.168.1.192/26 (hôtes : .193 à .254)
```

---

> **La vraie tech**
> IPv4 est défini dans **RFC 791**. Couche concernée : **3 (réseau)**. Le CIDR (Classless Inter-Domain Routing) est défini dans **RFC 1519** — il a remplacé le système de classes (A/B/C) dans les années 90. Le `/30` est utilisé pour les liaisons point-à-point entre routeurs : seulement 2 hôtes utilisables, exactement ce qu'il faut.

---

## 6. ARP

### L'histoire

Papa et toi avez chacun une adresse IP (`192.168.1.1` et `192.168.1.2`). Mais pour envoyer une trame Ethernet, tu as besoin de la **MAC** de papa — pas juste son IP. Comment tu la trouves ?

C'est le problème qu'**ARP** (Address Resolution Protocol) résout. ARP fait le lien entre la couche 3 (IP) et la couche 2 (MAC).

### Comment ARP fonctionne

Imagine que tu arrives dans une salle de classe. Tu veux parler à quelqu'un mais tu ne sais pas où il est assis. Tu cries : **"Hé, qui est le 192.168.1.2 ?"**. Tout le monde t'entend. Seulement la personne avec cette IP répond : **"C'est moi, je suis à la place AA:BB:CC:11:22:33 !"**. Tu notes ça dans ton carnet. Les prochaines fois, tu n'as plus besoin de crier.

En réseau :

```
Étape 1 — ARP Request (broadcast)
  Toi → TOUT LE MONDE
  "Who has 192.168.1.2? Tell 192.168.1.1"
  MAC Destination : FF:FF:FF:FF:FF:FF (broadcast)
  EtherType : 0x0806

Étape 2 — ARP Reply (unicast)
  Papa → Toi
  "192.168.1.2 is at AA:BB:CC:11:22:33"
  MAC Destination : ta propre MAC

Étape 3 — Mise en cache
  Tu stockes "192.168.1.2 → AA:BB:CC:11:22:33" dans ta table ARP
```

### La table ARP

```bash
# Linux
ip neigh show
# ou l'ancienne commande :
arp -a

# Résultat typique :
# 192.168.1.2 dev enp0s3 lladdr AA:BB:CC:11:22:33 REACHABLE
```

Cette table est temporaire. Si l'association n'est pas utilisée pendant un certain temps, elle expire. Pourquoi ? Parce qu'une IP peut changer de MAC (changement de carte réseau, machine virtuelle...).

### Le Gratuitous ARP

Quand une machine démarre ou change d'IP, elle envoie un **Gratuitous ARP** : elle annonce sa propre IP→MAC sans que personne ne l'ait demandé. Ça met à jour les caches des voisins.

---

> **La vraie tech**
> ARP est défini dans **RFC 826** (1982). Couche : **2/3 (frontière liaison/réseau)**. ARP n'existe que dans les réseaux IPv4. IPv6 utilise **NDP (Neighbor Discovery Protocol)** à la place. ARP ne traverse pas les routeurs — il est strictement local au sous-réseau. C'est pourquoi quand ton PC parle à une machine sur un autre réseau, il envoie l'ARP request pour la **passerelle** (le routeur), pas pour la destination finale.
>
> → Simulation disponible : `bible_code/module_01_liaison/02_arp_forge.py`

---

## 7. IP et ICMP

### L'histoire

Ton message a une enveloppe Ethernet, il a une IP de destination. Maintenant parlons de ce qui se passe dans l'en-tête IP lui-même, et de ICMP — le protocole de diagnostic.

### L'en-tête IPv4 — ce qu'il y a vraiment dans le paquet

Un paquet IP commence presque toujours par `0x4500` :
- `4` = Version IPv4
- `5` = longueur de l'en-tête (5 × 4 octets = 20 octets)
- `00` = QoS par défaut

Les champs importants :

| Champ | Taille | Rôle |
|---|:-:|---|
| TTL | 8 bits | Time To Live — décrémenté à chaque routeur |
| Protocol | 8 bits | `1`=ICMP, `6`=TCP, `17`=UDP, `89`=OSPF |
| IP Source | 32 bits | Qui envoie |
| IP Destination | 32 bits | Où ça va |
| DF (Don't Fragment) | 1 bit | Ne pas fragmenter |

### Le TTL — la date de péremption du paquet

Le TTL (Time To Live) est un compteur initialisé par l'émetteur (64 sur Linux, 128 sur Windows, 255 sur Cisco). À chaque routeur traversé, le TTL est décrémenté de 1. Si le TTL atteint 0, le routeur **détruit le paquet** et envoie un message ICMP "Time Exceeded" à l'émetteur.

Ça évite que des paquets se baladent indéfiniment sur Internet en cas de boucle de routage.

### ICMP — le protocole de diagnostic

ICMP (Internet Control Message Protocol) est encapsulé dans IP (protocol = 1). C'est le protocole qui transporte les messages d'erreur et de contrôle.

**Ping = ICMP Echo Request/Reply :**

```bash
ping 192.168.1.2
# ICMP Type 8 → Echo Request (tu demandes)
# ICMP Type 0 → Echo Reply (il répond)
```

Si un routeur ne peut pas atteindre la destination, il renvoie un message "Destination Unreachable" (Type 3). Si le TTL expire, c'est "Time Exceeded" (Type 11).

**Traceroute — tracer le chemin :**

Traceroute exploite brillamment le TTL. Il envoie des paquets avec TTL=1, puis TTL=2, puis TTL=3... À chaque fois, le routeur qui reçoit TTL=0 répond avec "Time Exceeded" et révèle son identité.

```bash
traceroute 8.8.8.8
# 1  192.168.1.254   (ta box)
# 2  10.x.x.x        (routeur FAI)
# 3  ...
# 13 8.8.8.8         (Google DNS)
```

---

> **La vraie tech**
> IP est défini dans **RFC 791**. ICMP dans **RFC 792**. Couche concernée : **3 (réseau)**. TTL initiaux typiques : **64** (Linux), **128** (Windows), **255** (Cisco IOS). ICMP est encapsulé directement dans IP, sans TCP ni UDP — c'est une exception à côté de la règle. Les firewalls bloquent souvent ICMP (ce qui casse le ping) mais c'est une mauvaise pratique car ICMP est essentiel au fonctionnement de Path MTU Discovery.

---

## PARTIE 3 — CONNECTER PLUSIEURS MACHINES

---

## 8. Le Switch

### L'histoire

Papa et toi êtes connectés. Super. Mais maman veut rejoindre la conversation. Et le voisin. Et ton ami d'enfance. Problème : ton PC n'a qu'un ou deux ports Ethernet. On ne peut pas brancher vingt PC ensemble avec des câbles entre chaque paire.

La solution : le **switch** (commutateur). Un switch, c'est une boîte avec 8, 24, 48 ports Ethernet. Tu branches tout le monde dessus. Et le switch fait le travail d'aiguillage — il sait où envoyer chaque trame.

### Comment le switch apprend — la table CAM

La différence entre un **hub** (ancien) et un **switch** (moderne) :
- **Hub** : quand une trame arrive, il la redirige vers **tous les ports**. Tout le monde voit tout. Collision possible. Domaine de broadcast = tout le monde.
- **Switch** : il apprend les adresses MAC et n'envoie les trames **qu'au bon port**. Chaque port est son propre domaine de collision.

Le switch apprend en observant :

```
Étape 1 — Apprentissage
  Trame reçue sur port 1, MAC source = AA:BB:CC:11:22:33
  → Le switch note : "AA:BB:CC:11:22:33 est sur le port 1"

Étape 2 — Commutation
  Trame vers MAC AA:BB:CC:11:22:33 ?
  → Je sais qu'elle est sur le port 1 → j'envoie uniquement sur le port 1

Étape 3 — Flooding (MAC inconnue)
  Trame vers une MAC jamais vue ?
  → J'envoie sur TOUS les ports sauf celui d'arrivée
  (comme un ARP Request — le switch ne "sait" pas encore où est cette MAC)
```

C'est la **table CAM** (Content Addressable Memory) ou table MAC address :

```cisco
SW1# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    aabb.cc11.2233    DYNAMIC     Fa0/1
   1    aabb.cc44.5566    DYNAMIC     Fa0/2
   1    aabb.cc77.8899    DYNAMIC     Fa0/3
```

---

> **La vraie tech**
> Le switch opère à la **couche 2 (liaison)**. Norme : **IEEE 802.3**. La table CAM est temporaire — les entrées expirent après ~300 secondes d'inactivité par défaut. Un switch de couche 3 (L3 switch) peut aussi faire du routage IP — c'est une alternative au router-on-a-stick. Commande de vérification clé : `show mac address-table`.

---

## 9. Les VLAN

### L'histoire

Tout le monde est sur le switch. Mais tu veux qu'entre papa et maman il y ait des murs invisibles : maman peut te voir (toi et ton PC), mais ne voit pas papa. Papa te voit, mais pas maman. Ils partagent le même switch physique, mais ils sont dans des mondes différents.

C'est ça, un **VLAN** (Virtual Local Area Network). Des **murs invisibles** dans le switch.

### Pourquoi les VLAN ?

Sans VLAN, tout le monde partage le même **domaine de broadcast**. Quand ton PC envoie un ARP Request en broadcast, tout le monde le reçoit — la caméra de surveillance, l'imprimante, le PC de direction. Mauvais pour la sécurité, mauvais pour les performances.

Avec les VLAN :
- **Sécurité** : le VLAN comptabilité est isolé du VLAN informatique
- **Performance** : les broadcasts restent dans leur VLAN
- **Flexibilité** : on peut regrouper des machines logiquement, peu importe où elles sont branchées physiquement

### Les ports Access et Trunk

**Port Access** : branché sur un PC. Transporte **un seul VLAN**. Le PC ne sait même pas qu'il est dans un VLAN.

**Port Trunk** : branché sur un autre switch ou un routeur. Transporte **plusieurs VLAN en même temps**. Les trames sont **taguées** avec leur numéro de VLAN.

### 802.1Q — le tag dans la trame

Sur un lien trunk, le switch insère 4 octets supplémentaires dans la trame Ethernet, juste après les adresses MAC :

```
Trame normale :
[ MAC Dest | MAC Src | EtherType | Données | CRC ]

Trame taguée 802.1Q :
[ MAC Dest | MAC Src | 0x8100 | PCP+DEI+VID | EtherType | Données | CRC ]
                       ↑ TPID   ↑ Tag 802.1Q
```

- **TPID** = `0x8100` : signale la présence d'un tag VLAN
- **VID** = 12 bits : l'identifiant du VLAN (1 à 4094)

Quand la trame arrive sur le port Access côté destination, le switch retire le tag avant de l'envoyer au PC. Le PC ne voit jamais le tag.

### Configuration Cisco

```cisco
! Créer les VLAN
SW1(config)# vlan 10
SW1(config-vlan)# name FAMILLE_TOI
SW1(config)# vlan 20
SW1(config-vlan)# name FAMILLE_PAPA
SW1(config)# vlan 30
SW1(config-vlan)# name FAMILLE_MAMAN

! Port Access (PC branché dessus)
SW1(config)# interface fa0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10

! Port Trunk (vers un autre switch ou routeur)
SW1(config)# interface gi0/1
SW1(config-if)# switchport mode trunk

! Vérification
SW1# show vlan brief
SW1# show interfaces trunk
```

---

> **La vraie tech**
> Les VLAN sont définis dans **IEEE 802.1Q**. Couche concernée : **2 (liaison)**. VLAN natif : le VLAN dont les trames ne sont **pas taguées** sur un trunk (VLAN 1 par défaut sur Cisco). Les deux extrémités d'un trunk doivent avoir le même VLAN natif. ID VLAN valides : 1 à 4094 (12 bits dans le tag, 0 et 4095 réservés). **VTP** (VLAN Trunking Protocol) est un protocole Cisco qui propage la base VLAN entre les switches — pratique, mais dangereux si mal configuré (un switch VTP serveur peut écraser la config de tout le réseau).

---

## 10. STP

### L'histoire

Pour avoir de la redondance, tu branches deux câbles entre SW1 et SW2. Sécurisé ? Oui. Mais catastrophique si on n'y prend pas garde : les trames de broadcast vont tourner en boucle entre les deux câbles à l'infini, de plus en plus vite, jusqu'à saturer complètement le réseau. C'est une **tempête de broadcast**. En quelques secondes, le réseau est mort.

**STP** (Spanning Tree Protocol) est le policier qui bloque un des chemins redondants pour casser la boucle — tout en gardant le câble en réserve.

### Comment STP élit le Root Bridge

Chaque switch a un **Bridge ID (BID)** = Priorité (2 octets, défaut 32768) + Adresse MAC (6 octets). Le switch avec le BID le plus bas est élu **Root Bridge** — c'est le centre de l'arbre.

Ensuite :
- Chaque switch non-root choisit son **Root Port** (RP) : le port offrant le chemin le moins coûteux vers le Root Bridge
- Sur chaque segment, un seul port est **Designated Port** (DP) : celui qui relaie le trafic
- Les ports restants deviennent **Blocked** (BP) : ils ne transmettent rien, mais écoutent

Les **BPDU** (Bridge Protocol Data Units) sont les messages échangés entre switches pour maintenir cet arbre.

Si un lien actif tombe, STP réactive le port bloqué — en quelques dizaines de secondes pour 802.1D, quasi-instantanément pour **RSTP** (802.1w).

### Forcer le Root Bridge

```cisco
! Définir la priorité manuellement
SW1(config)# spanning-tree vlan 10 priority 4096
! ou automatiquement
SW1(config)# spanning-tree vlan 10 root primary

! Vérification
SW1# show spanning-tree vlan 10
```

---

> **La vraie tech**
> STP est défini dans **IEEE 802.1D**. RSTP (Rapid STP) dans **IEEE 802.1w** — convergence en < 2 secondes. **PVST+** (Per-VLAN Spanning Tree Plus) est la variante Cisco qui crée une instance STP par VLAN. Couche concernée : **2 (liaison)**. Coûts de lien : 10Mbps=100, 100Mbps=19, 1Gbps=4. En production, on configure toujours manuellement quel switch est Root Bridge pour éviter l'élection par défaut.

---

## 11. EtherChannel

### L'histoire

Entre SW1 et SW2, tu as un lien de 1 Gbps. En heure de pointe, ça sature. Solution intuitive : brancher un deuxième câble. Problème : STP va bloquer l'un des deux (il a peur des boucles).

**EtherChannel** dit à STP : "Ces deux câbles sont en réalité un seul et même lien logique". STP les voit comme une seule interface. Pas de blocage. La bande passante est doublée. Et si un câble casse, l'autre continue sans interruption.

C'est l'**autoroute à plusieurs files** : les conducteurs voient une autoroute, mais la capacité est multipliée.

### Configuration Cisco (LACP)

```cisco
! Sur SW1 et SW2 — même configuration des deux côtés
SW1(config)# interface range gi0/1 - 2
SW1(config-if-range)# switchport mode trunk
SW1(config-if-range)# channel-group 1 mode active    ! LACP mode actif
SW1(config-if-range)# no shutdown

! Vérification
SW1# show etherchannel summary
```

| Protocole | Standard | Modes |
|---|---|---|
| **LACP** | IEEE 802.3ad | `active` / `passive` |
| **PAgP** | Cisco propriétaire | `desirable` / `auto` |
| **On** | Manuel | Sans négociation |

---

> **La vraie tech**
> EtherChannel = agrégation de liens (LAG). Défini dans **IEEE 802.3ad** (LACP). Maximum : **8 ports physiques** par EtherChannel. Couche concernée : **2 (liaison)**. En production, on préfère LACP (standard ouvert) à PAgP (propriétaire Cisco).

---

## PARTIE 4 — TCP, UDP ET LES PORTS

---

## 12. TCP vs UDP

### L'histoire

Tu veux envoyer un fichier important à papa. Tu veux être sûr qu'il arrive complet, dans l'ordre, sans perte. Mais tu veux aussi lui parler en vidéo en temps réel — là, si quelques pixels sont perdus, ce n'est pas grave, l'important c'est la fluidité.

Ces deux besoins opposés correspondent à deux protocoles de transport : **TCP** et **UDP**.

### TCP — le recommandé

TCP (Transmission Control Protocol) est **fiable, ordonné, contrôlé**. Avant d'envoyer quoi que ce soit, il établit une connexion via le **three-way handshake** :

```
Client                    Serveur
  │  ───── SYN ────────►  │   "Je veux parler"
  │  ◄── SYN + ACK ─────  │   "D'accord, moi aussi"
  │  ───── ACK ────────►  │   "Parfait, on est connectés"
  │   [connexion établie] │
```

Ensuite, pour chaque segment envoyé, TCP attend un **ACK** (accusé de réception). Si l'ACK ne revient pas dans le délai, il retransmet. Les segments arrivent-ils dans le désordre ? TCP les réordonne avant de les passer à l'application.

Fermeture propre en **4 étapes** (chaque sens de communication se ferme indépendamment).

**Usages** : HTTP/HTTPS, SSH, FTP, SMTP — tout ce qui nécessite de la fiabilité.

### UDP — la radio

UDP (User Datagram Protocol) n'établit pas de connexion. Il envoie et c'est tout. Pas d'ACK, pas de retransmission, pas de garantie d'ordre. L'en-tête fait seulement **8 octets** (contre 20 minimum pour TCP).

```
En-tête UDP :
[Port source 2B | Port destination 2B | Longueur 2B | Checksum 2B]
```

C'est rapide, c'est léger. Si un paquet est perdu dans un jeu vidéo ou pendant une conversation VoIP, on s'en fout — on en envoie un autre et on continue.

**Usages** : DNS, DHCP, VoIP (SIP, RTP), streaming, jeux en ligne, NTP.

### Comparatif

| Critère | TCP | UDP |
|---|---|---|
| Connexion | 3-way handshake | Aucune |
| Fiabilité | ACK + retransmission | Aucune garantie |
| Ordre | Garanti | Non garanti |
| Vitesse | Plus lent | Plus rapide |
| En-tête | 20 octets min | 8 octets |
| Usages | HTTP, SSH, FTP | DNS, DHCP, VoIP, streaming |

---

> **La vraie tech**
> TCP est défini dans **RFC 793**. UDP dans **RFC 768**. Couche concernée : **4 (transport)**. Les flags TCP à connaître : **SYN** (initier connexion), **ACK** (accuser réception), **FIN** (fermer proprement), **RST** (fermer brutalement). Le champ **Window** contrôle le débit (combien d'octets l'émetteur peut envoyer avant d'attendre un ACK). La valeur `Seq` + `Ack` permet de numéroter et d'ordonner les octets échangés.

---

## 13. Les Ports

### L'histoire — le port du Havre

Imagine le **port du Havre**. Des centaines de bateaux arrivent chaque jour, chargés de marchandises différentes. Comment s'organiser ? Simple : chaque type de marchandise a son **quai dédié**. Les conteneurs frais arrivent au quai 22. Les voitures au quai 80. Les liquides au quai 443. Les techniciens savent : "Le bateau arrive au quai 22 → c'est du frais, on sort les camions réfrigérés."

Ton PC, c'est pareil. Il reçoit des paquets de partout, pour des services différents. Comment sait-il si le paquet entrant est une page web, un email, une connexion SSH, un appel téléphonique ? Le **numéro de port**.

### Ou encore — les chambres d'hôtel

Autre analogie : tu arrives à l'hôtel (ton serveur). Tu as une adresse IP — c'est l'adresse de l'hôtel. Mais pour parler au réceptionniste, tu frappes à la **porte 80** (HTTP). Pour les archives, c'est la **porte 22** (SSH). Pour la sécurité, la **porte 443** (HTTPS). Chaque service a sa porte. Tu frapper à la mauvaise porte → personne ne répond.

### Les plages de ports

| Plage | Type | Exemples |
|---|---|---|
| **0 – 1023** | Ports bien connus (Well-Known) | HTTP:80, HTTPS:443, SSH:22 |
| **1024 – 49151** | Ports enregistrés (Registered) | — |
| **49152 – 65535** | Ports éphémères (côté client) | Assignés dynamiquement |

### Les ports à connaître absolument

| Port | Protocole | Transport | Usage |
|:-:|---|:-:|---|
| 22 | SSH | TCP | Administration à distance chiffrée |
| 23 | Telnet | TCP | Administration à distance (non chiffré — obsolète) |
| 25 | SMTP | TCP | Envoi d'email |
| 53 | DNS | UDP/TCP | Résolution de noms |
| 67 | DHCP serveur | UDP | Attribution d'IP |
| 68 | DHCP client | UDP | Demande d'IP |
| 80 | HTTP | TCP | Web non chiffré |
| 110 | POP3 | TCP | Réception d'email |
| 143 | IMAP | TCP | Réception d'email (sync) |
| 443 | HTTPS | TCP | Web chiffré (TLS) |
| 520 | RIP | UDP | Routage dynamique |
| 5060 | SIP | UDP | VoIP — signalisation |

### Le multiplexage

Un port, c'est ce qui permet à ton PC de gérer **plusieurs connexions simultanées**. Tu peux avoir Firefox ouvert sur Google (port 443 destination), une connexion SSH vers un serveur (port 22 destination), et un jeu en ligne (port 3074 destination) — tout en même temps.

Côté client, chaque connexion utilise un **port source éphémère** différent (>49152). Le routeur/serveur différencie les connexions par le quadruplet : IP source + port source + IP destination + port destination.

```
Ton PC (192.168.1.10:54231) ──► Google (8.8.8.8:443)  ← connexion HTTPS
Ton PC (192.168.1.10:54232) ──► Serveur (10.0.0.1:22)  ← connexion SSH
Ton PC (192.168.1.10:54233) ──► Jeu (5.6.7.8:3074)     ← connexion jeu
```

---

> **La vraie tech**
> Couche concernée : **4 (transport)**. Les ports sont dans l'en-tête TCP ou UDP — champ sur **16 bits** = 65535 ports possibles (0 à 65535). Les ports bien connus sont gérés par l'IANA (Internet Assigned Numbers Authority). Sur Linux, le fichier `/etc/services` liste les associations port↔service. `ss -tlnp` ou `netstat -tlnp` listent les ports ouverts sur ta machine.

---

## PARTIE 5 — SORTIR DU SOUS-RÉSEAU

---

## 14. Le Routeur

### L'histoire

Toi, papa et maman êtes tous sur le même switch, dans le même sous-réseau `192.168.1.0/24`. Vous vous parlez sans problème. Mais maintenant tu veux accéder à Internet — parler à un serveur à l'autre bout du monde. Problème : ton sous-réseau privé (`192.168.1.x`) n'est pas routable sur Internet. Il te faut quelqu'un qui connaît la route.

C'est le **routeur**. Il est l'**aiguilleur du ciel** du réseau. Il reçoit un paquet, regarde l'IP de destination, consulte sa **table de routage**, et décide : par quel câble je l'envoie ?

### Ce que fait le routeur à chaque saut

1. Il reçoit une trame Ethernet
2. Il vérifie que la MAC de destination est la sienne (sinon → poubelle)
3. Il retire l'en-tête Ethernet (couche 2), lit l'IP de destination (couche 3)
4. Il consulte sa table de routage : quelle est la meilleure route ?
5. Il **réécrit** la MAC source (sa propre MAC) et la MAC destination (MAC du prochain saut)
6. Il remet un en-tête Ethernet neuf et envoie

**Important** : les adresses IP source et destination ne changent jamais pendant le routage (sauf avec NAT). Seules les MAC changent à chaque saut.

```
PC toi → Routeur → Serveur distant

Hop 1 : MAC_toi → MAC_routeur  (IP_toi → IP_serveur)
Hop 2 : MAC_routeur → MAC_prochain  (IP_toi → IP_serveur)  ← MAC changée, IP identique
```

### La table de routage

```cisco
R1# show ip route

C    192.168.1.0/24 is directly connected, Gi0/0    ← réseau connecté
L    192.168.1.1/32 is directly connected, Gi0/0    ← adresse locale
S    10.0.0.0/8 [1/0] via 192.168.3.2              ← route statique
O    172.16.0.0/16 [110/64] via 192.168.3.2        ← route OSPF
S*   0.0.0.0/0 [1/0] via 192.168.1.254             ← route par défaut
```

**Longest Prefix Match** : si plusieurs routes correspondent, le routeur prend la plus spécifique. `/30` est préféré à `/24` qui est préféré à `/0` (route par défaut).

### La Distance Administrative

Quand deux protocoles annoncent la même destination, le routeur préfère la source la plus fiable (DA la plus basse) :

| Source | DA |
|---|:-:|
| Directement connectée | 0 |
| Route statique | 1 |
| OSPF | 110 |
| RIP | 120 |

---

> **La vraie tech**
> Le routeur opère à la **couche 3 (réseau)**. IP est défini dans **RFC 791**. La notion de Longest Prefix Match est fondamentale — sans elle, l'Internet ne fonctionnerait pas. Sur Linux, `ip route` affiche la table de routage. Sur Cisco, `show ip route`.

---

## 15. Routage Inter-VLAN

### L'histoire

Maman est dans VLAN 30, papa dans VLAN 20. Toi dans VLAN 10. Les VLAN créent des murs invisibles — très bien pour l'isolation. Mais parfois, papa et maman ont besoin de communiquer. Comment on fait franchir ces murs ?

Un équipement de couche 3 (routeur) peut franchir les frontières entre VLAN. La méthode la plus économique en câbles : **router-on-a-stick**.

### Router-on-a-Stick — un câble, plusieurs VLAN

Un seul câble physique en **trunk** entre le switch et le routeur. Sur le routeur, on crée des **sous-interfaces** logiques, une par VLAN. Chaque sous-interface a une IP qui sert de passerelle pour ce VLAN.

```
[PC VLAN10 - 192.168.10.10/24] ─┐
[PC VLAN20 - 192.168.20.10/24] ─┤─[Switch]─(trunk)─[Routeur R1]
[PC VLAN30 - 192.168.30.10/24] ─┘             Gi0/0.10 → 192.168.10.254
                                               Gi0/0.20 → 192.168.20.254
                                               Gi0/0.30 → 192.168.30.254
```

### Configuration

```cisco
! Côté Switch — lien vers routeur en trunk
interface gi0/1
 switchport mode trunk

! Côté Routeur — sous-interfaces
interface gi0/0
 no shutdown

interface gi0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.254 255.255.255.0

interface gi0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.254 255.255.255.0

interface gi0/0.30
 encapsulation dot1Q 30
 ip address 192.168.30.254 255.255.255.0
```

Sur les PC clients : configurer la passerelle = IP de la sous-interface du VLAN correspondant.

---

> **La vraie tech**
> Couches concernées : **2** (trunk 802.1Q) et **3** (routage IP entre VLAN). Alternative au router-on-a-stick : le **switch de couche 3 (L3 switch)** qui intègre le routage directement. Plus performant car le routage est fait en matériel (ASIC). Sur les grands réseaux, on préfère les L3 switches.

---

## 16. Routage Statique

### L'histoire

Ton réseau a trois sous-réseaux : `192.168.1.0/24` (toi), `192.168.2.0/24` (papa), et entre les deux routeurs `192.168.3.0/30`. Si ton PC veut joindre le réseau de papa, ton routeur doit savoir qu'il faut envoyer par `192.168.3.0`. Tu lui dis manuellement. C'est du **routage statique**.

### Configuration Cisco

```cisco
! R1 — pour atteindre le réseau de papa, passe par R2 (192.168.3.2)
ip route 192.168.2.0 255.255.255.0 192.168.3.2

! R2 — pour atteindre ton réseau, passe par R1 (192.168.3.1)
ip route 192.168.1.0 255.255.255.0 192.168.3.1

! Route par défaut (gateway of last resort)
! "Pour tout ce que je ne connais pas, envoie par là"
ip route 0.0.0.0 0.0.0.0 192.168.1.254
```

La route `0.0.0.0 0.0.0.0` est la **route par défaut**. Elle capte tout ce que les routes plus spécifiques ne couvrent pas. Sans elle, si ton routeur reçoit un paquet pour `8.8.8.8` et n'a pas de route vers ce réseau → paquet jeté.

### Vérification

```cisco
R1# show ip route
R1# ping 192.168.2.10 source 192.168.1.1
```

---

> **La vraie tech**
> Couche concernée : **3 (réseau)**. La route statique a une Distance Administrative de **1** (très fiable). Le routage statique est simple mais ne s'adapte pas aux pannes — si un lien tombe, la route reste dans la table mais les paquets sont perdus. Pour les réseaux complexes ou évolutifs, on utilise le routage dynamique. La route `0.0.0.0/0` est appelée "route par défaut" ou "gateway of last resort".

---

## 17. Routage Dynamique

### L'histoire

Ton réseau grandit. Tu as 10 routeurs. Configurer les routes statiques sur chacun d'eux devient un cauchemar. Et si un lien tombe, tu dois manuellement changer toutes les tables.

Le routage dynamique règle ça : les routeurs **se parlent entre eux** et s'échangent leurs connaissances. Si un lien tombe, ils recalculent automatiquement le meilleur chemin. C'est le **GPS du réseau** — il recalcule la route en temps réel.

### RIPv2 — le plus simple

RIP (Routing Information Protocol) v2 est un protocole de type **distance-vector** : chaque routeur connaît la distance (en nombre de sauts) vers chaque destination, et l'envoie à ses voisins toutes les 30 secondes.

| Caractéristique | Valeur |
|---|---|
| Métrique | Nombre de sauts (max 15 — 16 = infini) |
| Distance Administrative | 120 |
| Mise à jour | Toutes les 30s, multicast `224.0.0.9` |
| Encapsulation | UDP port 520 |

```cisco
router rip
 version 2
 no auto-summary    ! OBLIGATOIRE — évite le regroupement par classe
 network 192.168.1.0
 network 192.168.3.0
```

### OSPF — le plus puissant

OSPF (Open Shortest Path First) est un protocole de type **link-state** : chaque routeur connaît la **topologie complète** du réseau. Il calcule lui-même le plus court chemin (algorithme de Dijkstra).

| Caractéristique | Valeur |
|---|---|
| Métrique | Coût (10⁸ / débit en bps) |
| Distance Administrative | 110 |
| Mise à jour | Déclenchée par événement (pas de flood toutes les 30s) |
| Encapsulation | Directement dans IP, protocole 89 |
| Zone obligatoire | **Area 0** (backbone) |

```cisco
router ospf 1
 network 192.168.1.0 0.0.0.255 area 0    ! wildcard = inverse du masque
 network 192.168.3.0 0.0.0.3 area 0
```

**Masque wildcard** : inverse du masque réseau. `/24` → `0.0.0.255`. `/30` → `0.0.0.3`.

### RIP vs OSPF

| Critère | RIPv2 | OSPF |
|---|---|---|
| Type | Distance-vector | Link-state |
| Métrique | Sauts | Coût (débit) |
| Limite | 15 sauts | Aucune |
| Convergence | Lente (minutes) | Rapide (secondes) |
| Usage | Très petits réseaux | Réseaux moyens/grands |

---

> **La vraie tech**
> RIPv2 : **RFC 2453**. OSPF v2 : **RFC 2328**. Couche : **3 (réseau)**. Si RIP et OSPF coexistent pour la même destination, OSPF gagne (DA 110 < DA 120). Commandes de vérification : `show ip route`, `show ip protocols`, `show ip ospf neighbor`. Sur un lien série entre deux routeurs Cisco, le côté DCE doit configurer `clock rate 128000` — vérifier avec `show controllers Serial0/0/0`.

---

## 18. NAT/PAT

### L'histoire

Tout ton réseau utilise des adresses privées (`192.168.x.x`). Ces adresses ne circulent pas sur Internet. Mais tu veux quand même accéder à Google. Comment ?

C'est le **NAT** (Network Address Translation). Ton routeur (ou ta box internet) joue le rôle du **réceptionniste d'un hôtel** :
- Tu es la chambre 12 (192.168.1.10)
- L'hôtel a une adresse postale officielle (ton IP publique, ex: 82.65.100.50)
- Quand tu envoies une lettre à Google, le réceptionniste met l'adresse de l'hôtel sur l'enveloppe
- Quand Google répond, le réceptionniste voit que c'est pour la chambre 12 et te la donne

### PAT (NAT Overload)

En réalité, toute ta famille (plusieurs PC) partage **une seule IP publique**. Comment le routeur différencie les retours ? En utilisant les **ports** source : chaque connexion utilise un port source différent. Le routeur retient le mapping "IP privée + port source → IP publique + port source modifié".

C'est le **PAT** (Port Address Translation) ou NAT Overload. C'est de loin le cas le plus courant.

### Configuration Linux (iptables)

```bash
# Activer le routage
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
# Permanent : ajouter "net.ipv4.ip_forward=1" dans /etc/sysctl.conf

# NAT Masquerade sur l'interface WAN
sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE

# Vérification
sudo iptables -t nat -L -v -n
```

### Configuration Cisco

```cisco
! ACL — définir qui est "inside"
access-list 1 permit 192.168.0.0 0.0.0.255

! NAT Overload (PAT) — toute la plage privée → interface WAN
ip nat inside source list 1 interface GigabitEthernet0/0 overload

! Marquer les interfaces
interface GigabitEthernet0/0
 ip nat outside     ! WAN
interface GigabitEthernet0/1
 ip nat inside      ! LAN

! Vérification
show ip nat translations
show ip nat statistics
```

---

> **La vraie tech**
> NAT est défini dans **RFC 1631**. PAT/NAT Overload n'est pas un standard distinct — c'est une extension de NAT. Couche : **3 (réseau)** pour l'IP, mais touche aussi la **couche 4** car les ports sont modifiés. NAT résout l'épuisement des adresses IPv4, mais crée des problèmes pour les protocoles pair-à-pair (le correspondant ne peut pas initier une connexion vers toi sans "port forwarding"). IPv6 rend le NAT inutile — chaque appareil peut avoir sa propre adresse IP mondiale.

---

## PARTIE 6 — LES PROTOCOLES APPLICATIFS

---

## 19. DNS

### L'histoire

Dematt. Tu ouvres ton navigateur et tu tapes `youtube.com`. Mais les routeurs ne connaissent pas "youtube.com" — ils ne connaissent que des adresses IP. Quelqu'un doit faire la traduction. C'est le **DNS** (Domain Name System) — l'annuaire mondial d'Internet.

### La résolution DNS — étape par étape

```
1. Ton PC interroge son serveur DNS configuré (souvent ta box, 192.168.1.1)
2. La box demande au résolveur DNS du FAI
3. Le résolveur interroge un serveur racine (.) → "Je ne sais pas, demande à .com"
4. Il interroge le serveur .com → "Je ne sais pas, demande à youtube.com"
5. Il interroge le serveur DNS de youtube.com → "Voici l'IP : 172.217.x.x"
6. La réponse remonte jusqu'à ton PC et est mise en cache
```

```bash
# Tester la résolution DNS
nslookup youtube.com       # Windows/Linux — simple
dig youtube.com            # Linux — détaillé
dig +trace youtube.com     # Voir la résolution récursive complète
```

### Les types d'enregistrements

| Type | Rôle | Exemple |
|:-:|---|---|
| **A** | Nom → IPv4 | `youtube.com → 172.217.x.x` |
| **AAAA** | Nom → IPv6 | `youtube.com → 2607:f8b0:...` |
| **CNAME** | Alias (nom → nom) | `www.example.com → example.com` |
| **MX** | Serveur mail du domaine | `mail.example.com` |
| **PTR** | IP → Nom (résolution inverse) | `x.x.217.172.in-addr.arpa → youtube.com` |
| **NS** | Serveurs DNS de la zone | — |

---

> **La vraie tech**
> DNS est défini dans **RFC 1034/1035**. Port : **UDP 53** (TCP 53 pour les réponses > 512 octets et les transferts de zone). Encapsulation : `ETH | IP | UDP | DNS`. Le cache DNS a un TTL (Time To Live) — les entrées expirent après ce délai. Sur Linux : `resolvectl flush-caches` ou `systemd-resolve --flush-caches` pour vider le cache. Couche concernée : **7 (application)**.

---

## 20. DHCP

### L'histoire

Tu arrives dans un hôtel avec ton ordinateur portable. Tu n'as pas envie de configurer une IP manuellement. Le **DHCP** (Dynamic Host Configuration Protocol) c'est le réceptionniste qui te remet les clés automatiquement : "Voici ton IP, voici le serveur DNS, voici la passerelle — bonne installation."

### Le processus DORA

```
Client                              Serveur DHCP
  │ ── DISCOVER (broadcast) ──────► │  "Y a-t-il un serveur DHCP ?"
  │ ◄── OFFER ──────────────────── │  "Je t'offre 192.168.1.50"
  │ ── REQUEST (broadcast) ───────► │  "J'accepte 192.168.1.50"
  │ ◄── ACK ────────────────────── │  "C'est confirmé, bail de 24h"
```

Le serveur distribue : IP, masque, passerelle, DNS, durée du bail.

Si le DHCP ne répond pas → ton PC s'auto-attribue une adresse **APIPA** `169.254.x.x` (et ne peut plus aller sur Internet).

### Configuration sur routeur Cisco

```cisco
ip dhcp excluded-address 192.168.1.1 192.168.1.20    ! Réserver les premières IPs

ip dhcp pool MAISON
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 8.8.8.8 1.1.1.1
 lease 1    ! bail de 1 jour
```

---

> **La vraie tech**
> DHCP est défini dans **RFC 2131**. Ports : **UDP 67** (serveur) / **UDP 68** (client). Encapsulation : `ETH | IP | UDP | DHCP`. DORA = Discover, Offer, Request, Ack. Couche : **7 (application)**. L'agent relais DHCP (commande `ip helper-address` sur Cisco) permet à un routeur de relayer les requêtes DHCP broadcast vers un serveur DHCP distant.

---

## 21. HTTP, HTTPS et TLS

### L'histoire

Tu tapes `https://youtube.com`. Ton navigateur va construire une requête HTTP, la chiffrer via TLS, l'envoyer au serveur de YouTube. Le serveur répondra avec le HTML de la page. Voilà le Web.

### HTTP — le protocole du Web

HTTP (HyperText Transfer Protocol) définit comment le navigateur demande des ressources et comment le serveur répond. C'est du texte lisible.

**Requête type :**
```http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

**Réponse type :**
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 4256

<!DOCTYPE html>
<html>...
```

**Codes de statut à connaître :**

| Code | Signification |
|:-:|---|
| 200 | OK |
| 301/302 | Redirection |
| 404 | Not Found |
| 403 | Forbidden |
| 500 | Internal Server Error |

**Méthodes HTTP :** GET (demander), POST (envoyer), PUT (mettre à jour), DELETE (supprimer).

### HTTPS = HTTP + TLS

TLS (Transport Layer Security) chiffre le contenu HTTP. Avant d'envoyer quoi que ce soit, un **handshake TLS** établit une clé de session :

```
Client                              Serveur
  │ ── ClientHello ───────────────► │  (versions, algorithmes)
  │ ◄── ServerHello + Certificat ── │  (algo choisi, preuve d'identité)
  │ ── Finished ──────────────────► │  (clé de session établie)
  │   [tout le reste est chiffré]   │
```

Le certificat est signé par une **Autorité de Certification (CA)** — c'est ce qui prouve que tu parles vraiment à YouTube et pas à quelqu'un qui se fait passer pour eux.

---

> **La vraie tech**
> HTTP : **RFC 7230**. HTTPS = HTTP + TLS (**RFC 8446** pour TLS 1.3). Ports : **80** (HTTP), **443** (HTTPS). Encapsulation : `ETH | IP | TCP | HTTP`. TLS opère à la **couche 6 (présentation)** dans le modèle OSI. HTTP/2 (RFC 7540) ajoute le multiplexage sur une connexion TCP. HTTP/3 utilise QUIC (UDP) pour éliminer le head-of-line blocking. Couche : **7 (application)**.

---

## 22. SSH

### L'histoire

Tu veux administrer un serveur à distance — accéder à son terminal, modifier des fichiers de configuration. Tu pourrais utiliser Telnet... mais Telnet envoie tout en clair. N'importe qui qui sniffe le réseau voit ton mot de passe. **SSH** (Secure Shell) chiffre tout de bout en bout.

### Configuration SSH sur Cisco

```cisco
! Prérequis
ip domain-name monreseau.local
crypto key generate rsa modulus 2048
username admin privilege 15 secret monMotDePasse

! Forcer SSH v2 uniquement
ip ssh version 2
line vty 0 4
 transport input ssh
 login local
```

Sur Linux :
```bash
ssh admin@192.168.1.1             # Connexion basique
ssh -p 2222 admin@192.168.1.1    # Port non-standard
ssh-keygen                        # Générer une paire de clés
ssh-copy-id admin@192.168.1.1    # Copier sa clé publique
```

---

> **La vraie tech**
> SSH est défini dans **RFC 4253**. Port : **TCP 22**. L'authentification peut se faire par mot de passe ou par **paire de clés (RSA/Ed25519)**. La clé publique est déposée sur le serveur (`~/.ssh/authorized_keys`). La clé privée reste chez toi. Telnet (port 23) est à bannir de tout réseau — tout passe en clair. Couche : **7 (application)**.

---

## 23. FTP et PXE

### FTP — transfert de fichiers

FTP (File Transfer Protocol) utilise **deux connexions TCP** :
- Port **21** : contrôle (commandes)
- Port **20** (mode actif) ou port dynamique (mode passif) : données

Non chiffré par défaut → préférer **SFTP** (FTP via SSH, port 22) ou **FTPS** (FTP + TLS).

### PXE — démarrer un PC depuis le réseau

Imagine une salle de 30 PC. Tu dois installer Linux sur chacun. Tu n'as pas 30 clés USB. **PXE** (Preboot eXecution Environment) permet à un PC sans OS de démarrer depuis le réseau.

Flux PXE :
```
PC sans OS
  │ 1. DHCP DISCOVER (avec option PXE)
  ◄── 2. DHCP OFFER → IP + option 66 (serveur TFTP) + option 67 (fichier de boot)
  │ 3. TFTP GET pxelinux.0       → téléchargement du bootloader
  │ 4. Montage NFS               → système de fichiers depuis le réseau
  └── 5. Démarrage de l'OS ✓
```

Protocoles impliqués : **DHCP** (UDP 67/68), **TFTP** (UDP 69), **NFS** (TCP 2049).

---

> **La vraie tech**
> FTP : **RFC 959**. TFTP : **RFC 1350** (UDP 69, très simple, pas d'authentification). PXE est une spécification Intel. Couches : **7 (application)** pour FTP/PXE. TFTP est utilisé aussi pour les mises à jour de firmware sur les équipements réseau Cisco.

---

## PARTIE 7 — SÉCURITÉ ET FILTRAGE

---

## 24. ACL Cisco

### L'histoire

Tu as un serveur web dans ton réseau. Tu veux que certains PC puissent y accéder, et d'autres non. Tu veux qu'une certaine machine ne puisse jamais sortir sur Internet. Sur un routeur Cisco, les **ACL** (Access Control Lists) font ce travail.

C'est le **videur de boîte de nuit** : il a une liste, il vérifie, il laisse passer ou il refuse. Et il y a une règle implicite à la fin : **tout ce qui n'est pas explicitement autorisé est refusé** (deny any implicite).

### ACL Standard (1-99)

Filtre uniquement sur l'**IP source**. Placement : **près de la destination** (car elle est peu précise — elle bloquerait toute communication depuis cette source).

```cisco
access-list 1 deny host 192.168.3.20     ! Bloquer ce PC
access-list 1 permit any                 ! OBLIGATOIRE — sinon tout est bloqué

interface fa0/0
 ip access-group 1 out    ! Appliqué en sortie
```

### ACL Étendue (100-199)

Filtre sur : source, destination, protocole, port. Placement : **près de la source** (plus précis → bloquer dès l'origine).

```cisco
! Autoriser HTTP du LAN vers le serveur web uniquement
access-list 100 permit tcp 192.168.3.0 0.0.0.255 host 192.168.1.254 eq 80
! Autoriser les pings vers le serveur
access-list 100 permit icmp 192.168.3.0 0.0.0.255 host 192.168.1.254 echo
! Le deny any implicite bloque tout le reste

interface fa0/1
 ip access-group 100 in    ! Appliqué en entrée (côté source)
```

**Masque wildcard** (inverse du masque réseau) :
- `host 192.168.3.20` = `192.168.3.20 0.0.0.0`
- `192.168.3.0 0.0.0.255` = tout le /24
- `any` = `0.0.0.0 255.255.255.255`

```cisco
! Voir les ACL
show access-lists
```

---

> **La vraie tech**
> Couche : **3 (réseau)** pour les ACL standard, **3 et 4** pour les ACL étendues. Les ACL nommées (`ip access-list standard NOM`) sont plus lisibles et modifiables (on peut ajouter/supprimer des règles individuelles). Règle de placement : **Standard → près de la destination, Étendue → près de la source**.

---

## 25. iptables et nftables

### L'histoire

Sur Linux, le filtrage réseau est géré par **Netfilter**, le sous-système du noyau. `iptables` et `nftables` sont les interfaces pour le configurer.

Imagine ta machine Linux comme un immeuble avec plusieurs portes :
- **Chaîne INPUT** : le portier à l'entrée. Il contrôle ce qui entre chez toi.
- **Chaîne OUTPUT** : le portier à la sortie. Il contrôle ce qui sort.
- **Chaîne FORWARD** : le portier du couloir. Il contrôle le trafic qui traverse ta machine (rôle de passerelle).

### Stratégie "tout fermer, puis ouvrir"

```bash
# Politique par défaut : tout bloquer en entrée et transit
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Autoriser le loopback (indispensable)
sudo iptables -A INPUT -i lo -j ACCEPT

# Connexions déjà établies
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Ouvrir les services voulus
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT     # SSH
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT     # HTTP
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT    # HTTPS
sudo iptables -A INPUT -p icmp -j ACCEPT               # Ping
```

### DROP vs REJECT

- **DROP** : le portier fait semblant de ne pas voir. L'attaquant ne sait pas si le port existe. Adapté contre les scanners.
- **REJECT** : le portier dit clairement "interdit". Le client comprend et s'arrête. Adapté en réseau interne.

### nftables — le successeur moderne

nftables remplace iptables depuis Linux 3.13 (défaut Debian 10+). Syntaxe plus lisible :

```bash
#!/usr/sbin/nft -f
flush ruleset

table ip filter {
    chain input {
        type filter hook input priority 0; policy drop;
        iif "lo" accept
        ct state established,related accept
        ip protocol icmp accept
        tcp dport 22 accept
        tcp dport { 80, 443 } accept
    }
    chain forward {
        type filter hook forward priority 0; policy drop;
        ct state established,related accept
    }
    chain output {
        type filter hook output priority 0; policy accept;
    }
}
```

---

> **La vraie tech**
> iptables : noyau Linux depuis les années 2000. nftables : défaut Debian 10+, Fedora, Ubuntu 20.10+. Couches concernées : **3 (réseau)** et **4 (transport)**. Sauvegarder les règles : `sudo iptables-save > /etc/iptables/rules.v4`. Avec nftables : `sudo nft list ruleset > /etc/nftables.conf`. Les deux coexistent — mais ne pas mélanger sur le même système.

---

## PARTIE 8 — INFRASTRUCTURE AVANCÉE

---

## 26. La Virtualisation

### L'histoire

Avant, c'était une règle : une machine = un service. Le serveur DNS, le serveur web, le serveur de base de données — trois machines physiques. Chacune consomme de l'électricité, de la place, de la climatisation. Et souvent, elles tournent à 5% de leur capacité.

La **virtualisation**, c'est mettre des colocataires dans la maison : **plusieurs machines virtuelles sur un seul matériel physique**. Chaque VM croit être sur son propre matériel. Elle ne sait pas qu'il y a des voisins.

### L'hyperviseur — le syndic de l'immeuble

L'**hyperviseur** est le logiciel qui virtualise le matériel et distribue les ressources (CPU, RAM, réseau, stockage) entre les VMs.

| Type | Description | Exemples |
|---|---|---|
| **Type 1 (Bare-metal)** | Installé directement sur le matériel, sans OS hôte. Production. | VMware ESXi, Proxmox VE, Hyper-V |
| **Type 2 (Hosted)** | Installé comme une application dans un OS. Dev/test. | VirtualBox, VMware Workstation |

```
Type 1 :                     Type 2 :
┌────────────────┐           ┌─────────────────────┐
│  VM1  │  VM2  │           │   VM1   │   VM2      │
├────────────────┤           ├─────────────────────┤
│  Hyperviseur   │           │     Hyperviseur      │
├────────────────┤           ├─────────────────────┤
│   Matériel     │           │      OS Hôte         │
└────────────────┘           ├─────────────────────┤
                             │      Matériel        │
                             └─────────────────────┘
```

### Les modes réseau d'une VM

| Mode | Comportement | Usage |
|---|---|---|
| **NAT** | La VM partage l'IP de l'hôte. Accès Internet, pas joignable de l'extérieur. | Cas le plus courant |
| **Bridge** | La VM obtient une IP du même réseau que l'hôte. Directement visible sur le LAN. | Production |
| **Réseau interne** | Communication uniquement entre VMs. Pas d'accès extérieur. | TP, isolation totale |
| **Host-Only** | Communication uniquement avec l'hôte. | Dev local |

### Docker — les conteneurs

Les **conteneurs** sont plus légers que les VMs. Ils partagent le noyau (kernel) de l'hôte. Pas d'OS complet = démarrage en millisecondes, taille en Mo au lieu de Go.

| Critère | VM | Conteneur Docker |
|---|---|---|
| Isolation | OS complet | Processus isolés, kernel partagé |
| Démarrage | Minutes | Secondes |
| Taille | Go | Mo |
| Usage | Virtualisation complète | Déploiement d'applications |

```bash
docker pull ubuntu:22.04            # Télécharger une image
docker run -it ubuntu:22.04 bash    # Démarrer un conteneur interactif
docker run -d -p 8080:80 nginx      # Nginx en fond, port 8080 hôte → 80 conteneur
docker ps                           # Conteneurs actifs
docker images                       # Images disponibles
```

---

> **La vraie tech**
> VMware ESXi (Type 1) est le standard de l'industrie. Proxmox VE est l'alternative open-source très utilisée. Docker utilise des namespaces Linux et cgroups pour l'isolation. `docker run -d -p HOTE:CONTENEUR` permet le port mapping. Les **snapshots** permettent de sauvegarder l'état d'une VM et de revenir en arrière — indispensable avant toute mise à jour risquée.

---

## 27. Clusters et Haute Disponibilité

### L'histoire

Ton serveur principal tombe en panne. Plus de site web, plus de service. Pertes financières, clients mécontents. La solution : ne jamais dépendre d'une seule machine. C'est la **haute disponibilité**.

### Métriques clés

| Métrique | Définition | Exemple |
|---|---|---|
| **Disponibilité** | % du temps opérationnel | 99,9% = 8,76h d'arrêt/an |
| **RPO** | Perte de données max tolérée | "Pas plus d'1h de données perdues" |
| **RTO** | Durée max de remise en service | "Service restauré en < 30 min" |

### Architectures

**Actif-Passif (Failover)** : un serveur actif fait tout le travail. Un serveur passif surveille et prend le relais si l'actif tombe. Une **VIP** (Virtual IP) est l'adresse qui "suit" le nœud actif.

**Actif-Actif (Load Balancing)** : tous les nœuds travaillent simultanément. Un load balancer distribue la charge.

**VRRP** (Virtual Router Redundancy Protocol) : protocole standard pour partager une IP virtuelle entre plusieurs routeurs/serveurs. Un Master détient la VIP, les Backup écoutent. Si le Master disparaît, le Backup reprend la VIP.

```
Clients → [VIP: 10.0.0.100]
              │
    ┌─────────┴─────────┐
    │ Actif (Nœud 1)    │ Passif (Nœud 2) — heartbeat
    │ 10.0.0.101        │ 10.0.0.102
    └───────────────────┘
```

---

> **La vraie tech**
> VRRP : **RFC 5798**. HAProxy : load balancer open-source TCP/HTTP très répandu. Keepalived : implémentation Linux de VRRP. **Five nines** (99,999%) = 5 minutes d'arrêt par an — c'est ce que visent les opérateurs télécom et les banques. La scalabilité horizontale (ajouter des nœuds) est préférée à la scalabilité verticale (augmenter une seule machine) pour les architectures cloud.

---

## 28. Cloud et Green Computing

### L'histoire

Au lieu d'acheter et de maintenir tes propres serveurs, tu loues de la puissance de calcul à la demande. Comme l'eau ou l'électricité — tu ne te fournis pas en eau toi-même, tu te branches sur le réseau de la ville et tu payes ce que tu consommes.

### Les modèles de service

| Modèle | Ce que le fournisseur gère | Ce que tu gères | Exemple |
|---|---|---|---|
| **IaaS** | Matériel virtualisé | OS, apps, données | AWS EC2, Azure VMs |
| **PaaS** | IaaS + OS + runtime | Apps et données | Heroku, Google App Engine |
| **SaaS** | Tout | Tes données seulement | Gmail, Office 365 |

### Green Computing

Le numérique représente ~4% des émissions mondiales de CO₂. Un datacenter moyen consomme autant d'électricité qu'une ville de 50 000 habitants.

**PUE (Power Usage Effectiveness)** = énergie totale datacenter / énergie consommée par les équipements IT. Un bon datacenter vise PUE < 1,5.

Leviers : mutualisation (virtualisation), free cooling (air extérieur), énergies renouvelables, localisation dans des pays froids (Islande, pays nordiques).

---

> **La vraie tech**
> AWS (~32% du marché), Azure (~22%), GCP (~11%). Les trois proposent des services équivalents : VM (EC2/Instances), stockage objet (S3/Blob), DNS géré (Route53/Azure DNS), CDN (CloudFront/Azure CDN). **Vendor lock-in** : risque de dépendre d'un seul fournisseur → stratégie multi-cloud pour l'éviter.

---

## 29. Serveurs Web

### L'histoire

Tu veux héberger un site web sur ton propre serveur Linux. Tu as deux grands acteurs : **Apache2** (le bibliothécaire traditionnel, robuste) et **Nginx** (le bibliothécaire moderne, ultra-rapide pour les gros volumes).

### Apache2

```bash
sudo apt install apache2 -y
sudo systemctl status apache2

# Configuration d'un virtual host
# /etc/apache2/sites-available/monsite.conf
```

```apache
<VirtualHost *:80>
    ServerName monsite.local
    DocumentRoot /var/www/monsite
    ErrorLog ${APACHE_LOG_DIR}/monsite_error.log
</VirtualHost>
```

```bash
sudo a2ensite monsite.conf
sudo systemctl reload apache2
```

### Nginx + stack LEMP (Linux + Nginx + MariaDB + PHP)

```bash
sudo apt install nginx mariadb-server php-fpm php-mysql -y
```

```nginx
# /etc/nginx/sites-available/default
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.1-fpm.sock;
}
```

### Commandes essentielles

```bash
sudo systemctl start|stop|restart|status apache2
sudo apache2ctl configtest      # Vérifier la syntaxe
sudo nginx -t                   # Vérifier la syntaxe Nginx
```

---

> **La vraie tech**
> Apache2 : MPM Worker/Event ou Prefork selon le module PHP. Nginx : architecture asynchrone, excellente sous charge. Les **virtual hosts** permettent d'héberger plusieurs sites sur le même serveur, différenciés par le nom de domaine (champ `Host` dans la requête HTTP). Port 80 pour HTTP, 443 pour HTTPS. Les logs sont dans `/var/log/apache2/` ou `/var/log/nginx/`.

---

## 30. VoIP et Asterisk

### L'histoire

Ta voix, c'est un signal analogique. Pour l'envoyer sur un réseau IP, il faut la numériser (échantillonner), la compresser (codec), et l'encapsuler dans des paquets UDP. C'est la **VoIP** (Voice over IP).

**Asterisk** est le serveur IPBX open-source qui joue le rôle du standardiste : il reçoit les appels, les route, gère la messagerie vocale, les menus interactifs (IVR).

### Les protocoles VoIP

**SIP** (Session Initiation Protocol, UDP 5060) gère la **signalisation** : "je veux appeler le 0601...", "ça sonne", "il décroche", "il raccroche".

**RTP** (Real-time Transport Protocol, UDP ports dynamiques) transporte l'**audio** en temps réel.

### Flux d'un appel SIP

```
INVITE → (sonnerie) Ringing → (décroché) 200 OK → ACK
 │                                                   │
 └──────────────── RTP audio ───────────────────────┘
                                                    BYE → 200 OK
```

### Configuration Asterisk (dialplan)

```asterisk
; /etc/asterisk/extensions.conf
[AccueilAnnonce]
exten => s,1,Answer()
 same => n,Playback(/var/lib/asterisk/sounds/accueil)
 same => n,Background(/var/lib/asterisk/sounds/menu)
 same => n,WaitExten(5)

exten => 1,1,Dial(PJSIP/0106,12)
 same => n,VoiceMail(0106@default)

exten => 2,1,Dial(PJSIP/0206,12)
```

---

> **La vraie tech**
> SIP : **RFC 3261**. RTP : **RFC 3550**. SIP port **UDP 5060**. RTP ports dynamiques (généralement 10000-20000). Codec courants : **G.711** (PCM, haute qualité, 64 kbps), **G.729** (compressé, 8 kbps). Encapsulation : `ETH | IP | UDP | SIP` (signalisation) et `ETH | IP | UDP | RTP` (audio). UDP est choisi pour RTP car la latence compte plus que la fiabilité — mieux vaut perdre un paquet que d'attendre une retransmission.

---

## PARTIE 9 — IPv6

---

## 31. IPv6

### L'histoire

IPv4 = 32 bits = ~4,3 milliards d'adresses. En 1981, quand IPv4 est créé, ça semblait énorme. Aujourd'hui, avec des milliards de smartphones, d'objets connectés, de serveurs — c'est épuisé. La solution : **IPv6**, sur 128 bits.

Avec 128 bits, on peut créer ~3,4 × 10³⁸ adresses. C'est assez pour donner plusieurs adresses IP à chaque grain de sable sur Terre.

### Notation IPv6

Format : **8 groupes de 4 caractères hexadécimaux** séparés par `:`.

```
Complet : 2001:0db8:85a3:0000:0000:8a2e:0370:7334

Règles d'abréviation :
1. Supprimer les zéros de tête dans chaque groupe : 0db8 → db8
2. Remplacer UNE suite de groupes nuls par :: (une seule fois par adresse)

→ 2001:db8:85a3::8a2e:370:7334
```

### Adresses IPv6 spéciales

| Adresse | Signification |
|---|---|
| `::1` | Loopback (équivalent de 127.0.0.1) |
| `fe80::/10` | Lien-local (non routable, portée d'un seul lien) |
| `ff02::1` | Tous les nœuds du lien (multicast) |
| `ff02::2` | Tous les routeurs du lien (multicast) |

### Différences clés avec IPv4

| Critère | IPv4 | IPv6 |
|---|---|---|
| Longueur | 32 bits | 128 bits |
| Notation | Décimale pointée | Hexadécimale groupée |
| NAT | Nécessaire | Inutile |
| ARP | Oui | Remplacé par NDP |
| DHCP | DHCP v4 | DHCPv6 ou SLAAC |
| En-tête | Variable 20-60 octets | Fixe 40 octets |

### NDP — le remplaçant d'ARP

En IPv6, pas d'ARP. À la place : **NDP** (Neighbor Discovery Protocol), basé sur ICMPv6. Il gère la résolution d'adresses (Neighbor Solicitation/Advertisement), la détection des routeurs, et la configuration automatique SLAAC.

---

> **La vraie tech**
> IPv6 : **RFC 8200**. NDP : **RFC 4861**. SLAAC (StateLess Address AutoConfiguration, RFC 4862) permet à un hôte de se configurer une adresse IPv6 automatiquement sans serveur DHCP — en combinant le préfixe annoncé par le routeur et son propre identifiant d'interface. La coexistence IPv4/IPv6 est gérée par des mécanismes de transition : dual-stack (les deux en même temps), tunneling (IPv6 dans IPv4), translation (NAT64).

---

## PARTIE 10 — LE WEB DE L'URL À L'ÉCRAN

---

## 32. De l'URL à l'Écran

### Le parcours complet d'une requête web

Tu tapes `https://www.youtube.com` dans ton navigateur. Voici ce qui se passe, dans l'ordre :

**1. Résolution DNS**
Le navigateur cherche d'abord dans son cache local. Sinon il demande au serveur DNS configuré (ta box), qui remonte si nécessaire jusqu'aux serveurs racine. Au final, il obtient l'IP de youtube.com.

**2. Connexion TCP**
Three-way handshake vers l'IP obtenue, port 443 (HTTPS).

**3. Handshake TLS**
Négociation du chiffrement, échange du certificat, établissement de la clé de session. Après ça, tout le trafic HTTP sera chiffré.

**4. Requête HTTP**
```http
GET / HTTP/1.1
Host: www.youtube.com
User-Agent: Mozilla/5.0 ...
Accept: text/html
```

**5. Réponse HTTP**
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html>...
```

**6. Rendu**
Le navigateur parse le HTML, charge les ressources (CSS, JS, images via de nouvelles requêtes HTTP), exécute le JavaScript, et affiche la page.

### Anatomie d'une URL

```
https://www.example.com:443/dossier/page.html?id=42&lang=fr#section2
│────│  │──────────────│ │──│ │─────────────────│ │──────────│ │───────│
schéma    domaine       port      chemin            paramètres   fragment
```

### La barre d'adresse : recherche ou navigation ?

Quand tu tapes dans la barre d'adresse :
- `youtube.com` → le navigateur détecte un TLD (`.com`, pas d'espace) → résolution DNS directe → connexion directe à YouTube
- `youtube` → mot-clé sans TLD → envoyé à ton moteur de recherche par défaut (Google)
- `comment faire des crêpes` → espaces → requête de recherche → `https://www.google.com/search?q=comment+faire+des+crêpes`

---

## 33. Le Navigateur

### Les composants internes

Un navigateur moderne est un système complexe divisé en sous-systèmes :

| Composant | Rôle |
|---|---|
| **Interface Utilisateur** | Barre d'adresse, onglets, boutons |
| **Moteur du navigateur** | Chef d'orchestre, coordonne les autres |
| **Moteur de rendu** | Parse HTML+CSS, construit le DOM, dessine les pixels |
| **Couche réseau** | HTTP/HTTPS, DNS, TCP, cache |
| **Interpréteur JavaScript** | Compile et exécute le JS |
| **Stockage** | Cookies, LocalStorage, cache |

| Navigateur | Moteur de rendu | JS Engine |
|---|---|---|
| Chrome, Edge, Opera | Blink | V8 |
| Firefox | Gecko | SpiderMonkey |
| Safari | WebKit | JavaScriptCore |

> Node.js utilise V8 — le même moteur que Chrome. C'est pourquoi JavaScript peut s'exécuter côté serveur.

### Le pipeline de rendu

```
[Flux HTML] ──► Parsing ──► [ DOM Tree   ] ──┐
                                              ├──► [ Render Tree ] ──► Layout ──► Painting
[Flux CSS ] ──► Parsing ──► [ CSSOM Tree ] ──┘
                                              ↑
                                         Exécution JS
                                    (peut modifier le DOM)
```

1. **DOM** : arbre de nœuds HTML
2. **CSSOM** : arbre de règles CSS
3. **Render Tree** : fusion DOM + CSSOM (seulement les éléments visibles)
4. **Layout** : calcul de la position et taille de chaque élément
5. **Painting** : remplissage des pixels

---

> **La vraie tech**
> Le moteur V8 (Chrome/Node.js) compile le JavaScript en code machine natif (JIT compilation). Le DOM est défini par le W3C. Les cookies sont limités à 4096 octets par cookie. HTTP/3 (QUIC) réduit le temps de connexion en combinant le handshake TCP et TLS en un seul. `Ctrl+Shift+I` (ou F12) dans Chrome/Firefox ouvre les DevTools — onglet Network pour voir toutes les requêtes HTTP, onglet Console pour le JavaScript.

---

## ANNEXES

---

## Annexe A — Cisco IOS

### Navigation et modes

```cisco
! Passer en mode privilégié
Router> enable
Router#

! Passer en mode configuration globale
Router# configure terminal
Router(config)#

! Retour
Router(config)# end    ! → mode privilégié
Router(config)# exit   ! → mode précédent
```

### Commandes de vérification essentielles

```cisco
show running-config             ! Configuration active en RAM
show startup-config             ! Configuration sauvegardée
show ip route                   ! Table de routage
show ip interface brief         ! État et IP de toutes les interfaces
show interfaces                 ! Détails des interfaces
show mac address-table          ! Table MAC du switch
show vlan brief                 ! VLANs et ports
show interfaces trunk           ! Liens trunk
show spanning-tree              ! État STP
show ip ospf neighbor           ! Voisins OSPF
show ip protocols               ! Protocoles de routage actifs
show ip nat translations        ! Table NAT active
show etherchannel summary       ! État EtherChannel
show ssh                        ! Sessions SSH actives
```

### Commandes de base

```cisco
! Nommer l'équipement
hostname SW1

! Mot de passe mode enable
enable secret monMotDePasse

! Sauvegarder la config
copy running-config startup-config
! ou
write memory

! Désactiver les messages de log dans le terminal
no logging console

! Interface — activer/désactiver
interface fa0/1
 no shutdown    ! activer
 shutdown       ! désactiver

! Interface — assigner une IP (routeur)
interface gi0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown
```

---

## Annexe B — Linux Réseau

### Commandes ip (modernes)

```bash
ip a                          # Toutes les IPs
ip link show                  # État des interfaces
ip route                      # Table de routage
ip neigh show                 # Table ARP (équivalent arp -a)
ip addr add 192.168.1.10/24 dev eth0    # Assigner une IP
ip link set eth0 up           # Activer une interface
ip route add default via 192.168.1.1    # Route par défaut
ip route add 10.0.0.0/8 via 192.168.1.254   # Route statique
```

### Diagnostic réseau

```bash
ping 8.8.8.8                  # Test connectivité ICMP
traceroute 8.8.8.8            # Tracer le chemin
traceroute -A 8.8.8.8         # + numéros AS
mtr 8.8.8.8                   # Traceroute en temps réel
nslookup youtube.com          # Résolution DNS
dig youtube.com               # DNS détaillé
dig +trace youtube.com        # Résolution récursive complète
ss -tlnp                      # Ports TCP ouverts (à la place de netstat)
netstat -tlnp                 # Ports ouverts (ancienne commande)
tcpdump -i eth0               # Capturer le trafic en temps réel
```

### Gestion des services

```bash
sudo systemctl start|stop|restart|status SERVICE
sudo systemctl enable SERVICE     # Démarrage automatique au boot
sudo systemctl disable SERVICE
journalctl -u SERVICE -f          # Logs en temps réel
```

### Fichiers de configuration réseau importants

```bash
/etc/resolv.conf              # Serveurs DNS
/etc/hosts                    # Résolution locale statique
/etc/hostname                 # Nom de la machine
/etc/network/interfaces       # Config réseau Debian statique
/etc/netplan/*.yaml           # Config réseau Ubuntu moderne
```

---

## Annexe C — Windows Server et Active Directory

### L'analogie du maire de la ville numérique

**Active Directory**, c'est le registre officiel d'une ville (ton réseau d'entreprise). Il recense chaque habitant (utilisateur), chaque bâtiment (ordinateur), chaque groupe (service RH, service IT...).

Le **Contrôleur de Domaine** est la mairie. Quand un utilisateur arrive devant un PC, le PC appelle la mairie : *"Il dit s'appeler etu01, il a le droit de rentrer ?"*.

Les **GPO** (Group Policy Objects) sont les règlements municipaux distribués automatiquement : "Tous les PC de l'école ont Notepad++ installé", "Les élèves ne peuvent pas changer leur fond d'écran". Ces règles s'appliquent seules au démarrage.

### Pourquoi le DNS est vital pour AD

Sans DNS, les postes clients ne savent même pas où se trouve le contrôleur de domaine. Si le DNS tombe, personne ne peut se connecter au domaine — même si le contrôleur est physiquement allumé et fonctionnel.

### Commandes Windows Server

```powershell
# Active Directory
Get-ADUser -Filter *                  # Lister tous les utilisateurs
New-ADUser -Name "Briac" -SamAccountName briac
Add-ADGroupMember -Identity "Groupe1" -Members briac

# Réseau
ipconfig /all                         # Config réseau complète
ipconfig /flushdns                    # Vider le cache DNS
nslookup                              # Résolution DNS
netstat -an                           # Connexions actives
route print                           # Table de routage
```

---

## Annexe D — Tableau des Protocoles

| Protocole | Couche OSI | Port | Transport | Encapsulation |
|---|:-:|:-:|:-:|---|
| **HTTP** | 7 | 80 | TCP | ETH\|IP\|TCP\|HTTP |
| **HTTPS** | 7 | 443 | TCP | ETH\|IP\|TCP\|TLS\|HTTP |
| **SSH** | 7 | 22 | TCP | ETH\|IP\|TCP\|SSH |
| **FTP contrôle** | 7 | 21 | TCP | ETH\|IP\|TCP\|FTP |
| **SMTP** | 7 | 25 | TCP | ETH\|IP\|TCP\|SMTP |
| **DNS** | 7 | 53 | UDP/TCP | ETH\|IP\|UDP\|DNS |
| **DHCP** | 7 | 67/68 | UDP | ETH\|IP\|UDP\|DHCP |
| **SIP** | 7 | 5060 | UDP | ETH\|IP\|UDP\|SIP |
| **RTP** | 7 | dyn. | UDP | ETH\|IP\|UDP\|RTP |
| **TCP** | 4 | — | — | ETH\|IP\|TCP |
| **UDP** | 4 | — | — | ETH\|IP\|UDP |
| **IP** | 3 | — | — | ETH\|IP |
| **ICMP** | 3 | — | IP(1) | ETH\|IP\|ICMP |
| **OSPF** | 3 | — | IP(89) | ETH\|IP\|OSPF |
| **RIPv2** | 3/4 | 520 | UDP | ETH\|IP\|UDP\|RIP |
| **ARP** | 2/3 | — | — | ETH\|ARP |
| **Ethernet** | 1/2 | — | — | bits sur câble |

---

## Récapitulatif — Le voyage d'un paquet

Pour finir, le voyage complet d'un paquet "GET /index.html" de ton PC vers un serveur web :

```
[Ton PC]
  Application : navigateur prépare "GET /index.html HTTP/1.1"
  Transport   : TCP ajoute [port src:54231 | port dst:80 | SYN, ACK, Seq...]
  Réseau      : IP ajoute [IP src:192.168.1.10 | IP dst:93.184.216.34 | TTL:64]
  Liaison     : Ethernet ajoute [MAC src:AA:BB | MAC dst:CC:DD (ta box)]
  Physique    : Bits sur le câble
                        ↓
[Ta box / routeur]
  Couche 2 : reçoit la trame, vérifie MAC de destination (c'est la sienne)
  Couche 3 : lit l'IP de destination (93.184.216.34 — pas local)
  NAT      : remplace IP src 192.168.1.10 par ton IP publique + port NAT
  Couche 2 : nouvelle trame, MAC src = MAC de la box, MAC dst = MAC du routeur FAI
  Physique : envoyé vers le FAI
                        ↓
[Routeurs Internet — 10 à 15 sauts]
  À chaque saut : TTL décrémenté, MAC source/destination changées
  IP source/destination : inchangées
                        ↓
[Serveur web 93.184.216.34]
  Couche 2 : reçoit la trame
  Couche 3 : IP de destination = la sienne → accepte
  Couche 4 : port 80 ouvert → passe à Apache/Nginx
  Application : Apache lit "GET /index.html" → renvoie la page
```

Et la réponse fait le même chemin en sens inverse.

**C'est ça, le réseau.**

---

*Document rédigé à partir de BIBLE_RESEAUX.md et bible_reseaux_vulga.md.*
*Simulations interactives disponibles dans le dossier `bible_code/`.*
