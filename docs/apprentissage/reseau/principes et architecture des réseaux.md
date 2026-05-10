
projet vulgarisation visualisation de l'architecture réseau : [briacl/reseau](https://github.com/briacl/reseau)

![[osi_tcpip.png]]

- **Couche Physique** : Transmission effective des bits (par exemple, un signal électrique via une paire torsadée, les ondes radio via le WiFi, ou la lumière via une fibre optique)
- **Couche Liaison de données** : Délimiter les trames et transformer la couche physique en une liaison sans erreur
- **Couche Réseau** : Routage des paquets
- **Couche Transport** : Offrir un service de transport

![[encapsulation.png]]

**Ethernet** : Découpe et commute les trames. Les adresses MAC, par exemple `ab:cd:ef:00:11:22`, n'ont un rôle qu’au niveau local (sur un LAN). L'adresse MAC de destination est l'adresse du prochain saut (**rôle local**).

**ARP** : Obtention de l’adresse MAC associée à une adresse IP (ARP fonctionne avec une question et une réponse. Question envoyée en broadcast : who-has @IP ?. Réponse en unicast : @IP is-at @MAC)

- ARP est encapsulé dans Ethernet dans un réseau filaire (sinon dans du 802.11 pour du Wifi par exemple)

**IP** : Routage des paquets, les adresses IP (par exemple `12.12.12.12`) ont un **rôle global**. On envoie un paquet à une adresse IP destination finale du paquet (`194.254.23.3` pour l'université d'Artois par exemple, qu'on soit à Béthune ou Tokyo).

- IP est encapsulé dans Ethernet dans un réseau filaire (sinon dans du 802.11 pour du Wifi par exemple)

**ICMP** : Contrôles autour d’IP.

- ICMP est encapsulé dans IP

**UDP** : Transport rapide. Protocole non orienté connexion.

- UDP est encapsulé dans IP
- UDP encapsule des protocoles d'applications cherchant un service de transport **rapide** (e.g. SIP pour VoIP) ou s'il s'agit d'échanges courts comme une question/réponse (e.g. DNS, DHCP). 

**TCP** : Transport fiable. Protocole orienté connexion.

- TCP est encapsulé dans IP
- TCP encapsule des protocoles d'applications cherchant un service de transport **fiable** (e.g. HTTP, FTP, SSH). 

**FTP** : Transfert de fichiers.

**HTTP** : Communications Web.

**SSH** : Shell distant sécurisé.

**DNS** : Associations adresses IP / Noms de domaine, par exemple `iut-rt.univ-artois.fr` a pour IP `172.31.25.9`

**DHCP** : Obtention d’une configuration IP (une adresse IP, un masque de réseau, une passerelle, un serveur DNS, ...)

**Encapsulations classiques** dans un réseau filaire Ethernet:

- ETH | ARP
- ETH | IP | ICMP
- ETH | IP | TCP | HTTP
- ETH | IP | TCP | SSH
- ETH | IP | TCP | FTP
- ETH | IP | UDP | DNS
- ETH | IP | UDP | DHCP

![[Ethernet.png]]

![[ARP.gif]]

- Hardware type (HTYPE) : 0x0001 pour Ethernet
- Protocol type (PTYPE) : 0x0800 pour IPv4
- HLEN1 = Hardware address Length (HLEN)= 0x06 = 6 (Une adresse MAC/Ethernet fait 6 octets).
- HLEN2 = Protocol address Length (PLEN)= 0x04 = 4 (Une adresse IPv4 fait 4 octets).
- Opcode = 1 (0x0001) pour une requête (request) ou 2 (0x0002) pour une réponse (reply)

![[IP.png]]

Un paquet IPv4 démarre donc très souvent par **0x4500**, ces 4 nombres hexadécimaux signifiant **Version 4 | Longueur d’en-tête = 5x4 = 20 octets (pas d'option) | 00 : QoS par défaut (la QoS sera vue en R301 au S3)**.

La deuxième ligne du paquet IPv4 concerne la **Fragmentation** :

- Le champ **Identification** identifie les fragments d'un paquet IP
- Le bit **DF** (Don't Fragment) indique si un paquet ne doit pas être fragmenté (0 oui possible, 1 non), si DF=1 et que la fragmentation est nécessaire pour acheminer le paquet, celui-ci est alors détruit (dropped).
- Le bit **MF** (More Fragment) vaut 1, il s'agit d'un fragment, 0 sinon. Le dernier fragment a le bit MF valant 0.
- Le champ **Position du fragment** (Fragment offset) indique où commence un fragment par rapport au paquet IP originel, il est exprimé en blocs de 8 octets, cela veut dire que si ce champ contient la valeur 100, le fragment commence à l'octet 100 × 8 = 800 du paquet IPv4 original. D'autres exemples sont donnés dans le fichier ci-dessous.

![[ICMP.png]]

Type 8 (echo-request) (ping aller)  
Type 0 (echo-reply) (ping retour)  
Type 3 (destination unreachable) (code 0 net, code 1 host, code 3 port)  
Type 11 (time exceeded) (code 0 TTL expired)

![[Réseaux et Télécommunications/apprentissage/reseau/ping.png]]

![[AdrMAC_vs_AdrIP.png]]

![[UDP.png]]

**Transport** **rapide** (e.g. SIP pour VoIP) ou question/réponse (e.g. DNS, DHCP), **non orienté connexion**

![[TCP.png]]

**Transport** **fiable** (e.g. HTTP, FTP, SSH), **orienté** **connexion** (il y a une phase d'établissement de la connexion avant d'envoyer des données)






Physique : Transmission effective des bits 
Etat de lien : D´elimiter les trames et transformer la couche physique en une liaison sans erreur
Reseau : le Routage de paquets
Transport : Offrir un service de transport


synthèse protcoles réseaux fondamentaux

Du plus bas niveau au plus haut, selon la logique du modèle [TCP/IP](https://moodle.univ-artois.fr/mod/resource/view.php?id=95347 "TCP/IP") (liaison → réseau → transport → application).

## Ethernet : Liaison

- **Rôle :** communication sur un réseau local (LAN) via des **trames**. Découpe et commute les trames.
- **Adressage :** **MAC** (48 bits).
- **Fonction clé :** encapsule les données des couches supérieures pour les envoyer sur le lien physique.

## ARP : Liaison ↔ Réseau

- **Rôle :** donne l'adresse **MAC** correspond à une adresse **IP** sur un LAN.
- **Principe :** requête "Who has @IP ?" envoyée en broadcast (FF:FF:FF:FF:FF:FF) → réponse "@IP is-at @MAC" envoyée en unicast.

## IP : Réseau

- **Rôle :** Routage (acheminement) des **paquets** entre réseaux.
- **Adressage :** IPv4 / [IPv6](https://moodle.univ-artois.fr/mod/resource/view.php?id=95331 "IPv6").
- **Caractéristiques :** sans connexion, « best effort » (pas de garantie de livraison/ordre), non fiable

## ICMP : Réseau

- **Rôle :** messages de contrôle et diagnostic (erreurs, états).
- **Exemples :**

- `ping` : Echo Request (Type : 8, Code : 0), Echo Reply (Type: 0, Code: 0).
- `destination unreachable` Type : 3

- Code 0 : Network Unreachable (réseau injoignable)
- Code 1 : Host Unreachable (hôte injoignable)
- Code 3 : Port Unreachable (très fréquent avec UDP)

- `time exceeded` Type : 11, Code : 0 TTL exceeded in transit (TTL expiré en route)

## [RIP](https://moodle.univ-artois.fr/mod/resource/view.php?id=95337 "RIP") : rôle au niveau du réseau mais encapsulé dans UDP port 520

- **Rôle :** Protocole de routage à vecteur de distance

## [OSPF](https://moodle.univ-artois.fr/mod/resource/view.php?id=95336 "OSPF") : Réseau

- **Rôle :** Protocole de routage à état de lien

## UDP : Transport

- **Rôle :** transport rapide et simple (datagrammes).
- **Caractéristiques :** protocole non orienté connexion, pas de retransmission, pas de garantie d’ordre.
- **Atout :** faible latence.
- **Usages typiques :** DNS, [DHCP](https://moodle.univ-artois.fr/mod/resource/view.php?id=98612 "DHCP"), Streaming, VoIP, jeux.

## TCP : Transport

- **Rôle :** transport **fiable** et **ordonné**.
- ****Caractéristiques** :** protocole orientée connexion (3-way handshake), accusés de réception, retransmission, réordonnancement, contrôle de flux, contrôle de congestion.
- **Usages typiques :** HTTP/HTTPS, SSH, FTP.

## HTTP : Application

- **Rôle :** protocole du Web (requête → réponse).
- **Ports :** 80 (HTTP), 443 (HTTPS = HTTP + TLS).

## SSH : Application

- **Rôle :** accès distant sécurisé et administration.
- **Port :** 22.

## FTP : Application

- **Rôle :** transfert de fichiers (historiquement très utilisé).
- **Ports :** 21 (contrôle), données via 20 ou ports dynamiques (actif/passif).
- **Remarque :** non chiffré par défaut → préférer **SFTP** (via SSH) ou **FTPS**.

## DNS : Application

- **Rôle :** traduire un **nom de domaine** en **adresse IP**.
- **Port :** 53 (souvent UDP ; TCP possible notamment pour transferts de zone/grandes réponses).
- **Exemples d’enregistrements :**

- `A` : Nom vers IPv4
- `AAAA` : Nom vers [IPv6](https://moodle.univ-artois.fr/mod/resource/view.php?id=95331 "IPv6").
- `PTR` : IP vers Nom.
- `CNAME` : Alias (nom vers nom)
- `MX` : indique où envoyer les emails pour un domaine.

## [DHCP](https://moodle.univ-artois.fr/mod/resource/view.php?id=98612 "DHCP") : Application

- **Rôle :** configuration automatique réseau : IP, masque, passerelle, DNS.
- **Ports :** UDP 67 (serveur) / 68 (client).
- **Processus :** DORA = Discover → Offer → Request → Acknowledge.

## Récapitulatif

|Protocole|Couche|À retenir|
|---|---|---|
|Ethernet|Liaison|Trames + MAC sur LAN|
|ARP|Liaison/Réseau|Résout IP → MAC|
|IP|Réseau|Routage « best effort »|
|ICMP|Réseau|Diagnostic (ping, erreurs)|
|UDP|Transport|Rapide, pas fiable, non orienté connexion|
|TCP|Transport|Fiable, ordonné, orienté connexion|
|HTTP|Application|Web (80/443)|
|SSH|Application|Accès distant sécurisé (22)|
|FTP|Application|Transfert fichiers (préférer SFTP/FTPS)|
|DNS|Application|Nom ↔ IP (53)|
|[DHCP](https://moodle.univ-artois.fr/mod/resource/view.php?id=98612 "DHCP")|Application|Configuration IP (67/68)|



[[reseau]]
