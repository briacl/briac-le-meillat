# 📄 Compte-Rendu de TP : Mise en place d'un filtrage par ACL sur routeur Cisco

**Objectif principal :** Configurer une topologie réseau fonctionnelle sous Cisco Packet Tracer, mettre en place un routage statique, puis appliquer des règles de sécurité via des Access Control Lists (ACL) Standards et Étendues.

---

## 🛠️ Partie 1 : Configuration initiale et Adressage IP

La première étape a consisté à attribuer les adresses IP aux différentes interfaces des routeurs pour initialiser la topologie, et à allumer ces interfaces.

### Configuration du routeur France
```bash
Router> enable
Router# configure terminal
Router(config)# hostname France

# Configuration de l'interface vers le réseau local (LAN)
France(config)# interface fa0/0
France(config-if)# ip address 192.168.1.1 255.255.255.0
France(config-if)# no shutdown  # Allume physiquement l'interface
France(config-if)# exit

# Configuration de l'interface vers le routeur Belgique
France(config)# interface fa0/1
France(config-if)# ip address 192.168.2.1 255.255.255.0
France(config-if)# no shutdown
```

### Configuration du routeur Belgique
*Note : Lors du TP, nous avons veillé à utiliser un câble croisé (crossover) pour relier les deux routeurs directement.*

```bash
Router> enable
Router# configure terminal
Router(config)# hostname Belgique

# Configuration de l'interface vers le routeur France
Belgique(config)# interface fa0/0
Belgique(config-if)# ip address 192.168.2.2 255.255.255.0
Belgique(config-if)# no shutdown
Belgique(config-if)# exit

# Configuration de l'interface vers le réseau local (LAN)
Belgique(config)# interface fa0/1
Belgique(config-if)# ip address 192.168.3.1 255.255.255.0
Belgique(config-if)# no shutdown
```

### Configuration des Postes Clients (PC)
Il a été crucial de définir correctement la **Passerelle par défaut (Default Gateway)** sur chaque PC. Sans cela, les PC ne savent pas à qui envoyer les paquets destinés à un autre réseau.
*   **PC1 :** IP `192.168.1.10` / Masque `255.255.255.0` / Passerelle `192.168.1.1`
*   **PC2 :** IP `192.168.3.10` / Masque `255.255.255.0` / Passerelle `192.168.3.1`
*   **PC3 :** IP `192.168.3.20` / Masque `255.255.255.0` / Passerelle `192.168.3.1`

---

## 🔀 Partie 2 : Routage Statique

Pour que les réseaux `192.168.1.0` et `192.168.3.0` puissent communiquer, les routeurs doivent connaître le chemin vers ces réseaux distants.

**Sur le routeur France :**
```bash
France(config)# ip route 192.168.3.0 255.255.255.0 192.168.2.2
```
*Explication : On indique que pour joindre le réseau cible 3.0, les paquets doivent être envoyés à l'adresse du prochain saut (l'interface de Belgique, 2.2).*

**Sur le routeur Belgique :**
```bash
Belgique(config)# ip route 192.168.1.0 255.255.255.0 192.168.2.1
```
*Validation : Un ping de PC1 vers PC3 fonctionne correctement après cette étape.*

---

## 🛡️ Partie 3 : Filtrage par ACL Standard

**Objectif :** Couper les communications de PC3 (`192.168.3.20`) vers PC1 (`192.168.1.10`), tout en laissant PC2 communiquer avec PC1.

**Règle théorique :** Une ACL Standard (numérotée de 1 à 99) ne filtre que sur l'IP source. Elle doit donc être placée **au plus près de la destination** pour ne pas bloquer le trafic légitime de PC3 vers d'autres réseaux éventuels.

**Configuration sur le routeur France :**
```bash
France# configure terminal
France(config)# access-list 1 deny host 192.168.3.20
France(config)# access-list 1 permit any
```
*Explication : La première ligne cible et bloque spécifiquement l'IP de PC3. La seconde ligne (`permit any`) est obligatoire car toute ACL possède une règle finale implicite qui bloque tout (`deny any`). On autorise donc tout le reste (dont PC2).*

**Application de l'ACL :**
```bash
France(config)# interface fa0/0
France(config-if)# ip access-group 1 out
```
*Explication : On applique l'ACL sur l'interface Fa0/0 en direction `out` (sortie) car le paquet provient de Belgique, traverse le routeur France, et "sort" par Fa0/0 pour aller vers PC1.*

**Résultats et observations (Questions du TP) :**
*   Le ping de PC3 vers PC1 renvoie *Destination host unreachable* (bloqué par le routeur France).
*   Le ping de PC1 vers PC3 échoue (*Request timed out*) : bien que la requête aller de PC1 atteigne PC3, le paquet de réponse (Echo Reply) renvoyé par PC3 est bloqué par l'ACL en sortant du routeur France.

**Modification de l'ACL (Bloquer tout le sous-réseau) :**
```bash
France(config)# ip access-list standard 1
France(config-std-nacl)# no 10
France(config-std-nacl)# 10 deny 192.168.3.0 0.0.0.255
```
*Explication : On remplace la règle spécifique à l'hôte par une règle bloquant tout le réseau. On utilise le masque générique (wildcard) `0.0.0.255` qui est l'inverse du masque de sous-réseau `255.255.255.0`.*

---

## 🎯 Partie 4 : Filtrage par ACL Étendue

**Objectif :** Ajouter un serveur Web (`192.168.1.254`) dans le LAN France. Depuis le LAN Belgique, n'autoriser QUE l'accès Web et le Ping vers ce serveur, et interdire tout le reste.

**Nettoyage préalable (Sur France) :**
```bash
France(config)# interface fa0/0
France(config-if)# no ip access-group 1 out
France(config)# no access-list 1
```
*Explication : Il est impératif de supprimer l'application de l'ancienne ACL pour éviter les conflits.*

**Règle théorique :** Une ACL étendue (100 à 199) précise la source, la destination et le protocole/port. Elle doit être placée **au plus près de la source** pour économiser la bande passante du réseau. On la configure donc sur le routeur **Belgique**.

**Configuration sur le routeur Belgique :**
```bash
Belgique# configure terminal
# Règle 1 : Autorise le trafic Web (TCP port 80)
Belgique(config)# access-list 100 permit tcp 192.168.3.0 0.0.0.255 host 192.168.1.254 eq 80

# Règle 2 : Autorise le ping (ICMP) vers le serveur
Belgique(config)# access-list 100 permit icmp 192.168.3.0 0.0.0.255 host 192.168.1.254 echo

# Application sur l'interface proche de la source (LAN Belgique)
Belgique(config)# interface fa0/1
Belgique(config-if)# ip access-group 100 in
```
*Explication : Le paramètre `eq 80` spécifie le port HTTP. Le paramètre `in` indique que le routeur analyse et filtre le trafic dès qu'il entre sur l'interface Fa0/1 en provenance de PC2/PC3.*

**Validation finale :**
*   Depuis PC2 : Le site Web `192.168.1.254` s'affiche.
*   Depuis PC2 : `ping 192.168.1.254` fonctionne.
*   Depuis PC2 : `ping 192.168.1.10` (PC1) est rejeté, l'ACL étendue jouant parfaitement son rôle de sécurité par défaut (Drop Default).

---

### 📝 Synthèse globale
Ce TP nous a permis de comprendre l'importance du positionnement des ACL :
1.  **ACL Standard :** Placée près de la destination car elle manque de précision (filtre uniquement la source).
2.  **ACL Étendue :** Placée près de la source car sa précision (source + destination + port) permet de détruire les paquets indésirables au plus tôt, allégeant ainsi le réseau global. 
De plus, ce TP a mis en évidence l'importance du dépannage réseau de couche 2 et 3 (configuration des passerelles par défaut et validation des liaisons croisées entre routeurs).