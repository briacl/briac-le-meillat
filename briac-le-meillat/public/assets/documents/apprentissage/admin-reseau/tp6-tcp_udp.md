# 📄 Compte-Rendu de TP : Protocoles TCP & UDP

**Étudiant :** Yanni Delattre Balcer  
**Date :** 04/05/2026  
**Environnement :** Ubuntu 22.04 Desktop sur Oracle VirtualBox  
**Infrastructure :** Réseau interne via passerelle RT-Box2  

---

## 🛠️ 1. Préparation de l'environnement

### Installation et lancement de Wireshark
Pour capturer le trafic sur l'interface de boucle locale (`lo`), des privilèges élevés sont nécessaires.

```bash
sudo wireshark &
```
*Explication : Le `sudo` est indispensable pour accéder à l'interface `lo` et capturer les paquets en temps réel. Le `&` permet de libérer le terminal tout en gardant l'interface graphique ouverte.*

**Configuration :** Sélectionner l'interface `lo` et appliquer le filtre d'affichage `tcp`.

---

## 📡 2. Analyse du trafic TCP (Transmission Control Protocol)

### Établissement de la connexion
Nous utilisons l'outil `netcat` (`nc`) pour simuler un client et un serveur.

**Serveur (Terminal 1) :**
```bash
nc -l 8000
```

**Client (Terminal 2) :**
```bash
nc localhost 8000
```

**Vérification :** 
```bash
ss -n | grep 8000
```
*(L'outil `ss` du paquet `IPROUTE2` remplace l'ancien `netstat`).*

### Observation du "3-way handshake"
Wireshark permet d'identifier les trois étapes cruciales de l'établissement d'une connexion TCP :

| Étape | Flag | Rôle |
| :--- | :--- | :--- |
| 1 | `SYN` | Le client initie la connexion. |
| 2 | `SYN, ACK` | Le serveur accepte et synchronise. |
| 3 | `ACK` | Le client confirme, la connexion est établie. |

### Analyse des numéros de séquence et d'acquittement
TCP garantit la livraison des données en suivant la règle : `Seq + Len = Ack`.

*Exemple concret :* Pour le message "Bonjour\n" (8 octets), si le `Seq` est 1, le `Ack` suivant sera 9. L'acquittement indique au partenaire le prochain octet attendu.

### Option Window Scale
Le champ "Window Size" est limité à 16 bits (65 535 octets). Pour le haut débit, TCP utilise l'option *Window Scale* négociée lors du SYN.

*Exemple observé :* Un facteur de multiplication de 7 (soit x 128) permet d'augmenter considérablement la taille de la fenêtre de réception.

### Fermeture de la connexion
En tapant `Ctrl+D` côté client, on observe une fermeture en 4 temps (half-close) :

1.  **FIN, ACK :** L'initiateur demande la fermeture.
2.  **ACK :** Le récepteur acquitte.
3.  **FIN, ACK :** Le récepteur ferme son sens de communication.
4.  **ACK :** L'initiateur termine la procédure.

---

## 🛡️ 3. Gestion des erreurs et Robustesse

### Connexion sur un port fermé
**Commande :** 
```bash
nc localhost 9999
```
**Observation :** Wireshark affiche une trame rouge avec le flag `RST, ACK`.
**Explication :** Le flag `RST` (Reset) indique que le port est fermé et que la connexion est immédiatement refusée sans handshake.

### Simulation de coupure réseau (Ré-émission)
Lors d'une coupure, TCP utilise l'algorithme *Binary Exponential Backoff*.
*   Le délai entre chaque tentative de ré-émission double à chaque fois (ex: 1s, 2s, 4s, 8s...).
*   Sous Linux, TCP insiste environ 15 minutes avant d'abandonner la connexion.

---

## 🚀 4. Analyse du trafic UDP (User Datagram Protocol)
UDP est un protocole "non orienté connexion".

**Serveur :** 
```bash
nc -u -l 9000
```
**Client :** 
```bash
nc -u localhost 9000
```

### Comparaison avec TCP :
| Caractéristique | TCP | UDP |
| :--- | :--- | :--- |
| **Connexion** | 3-way handshake | Aucun (envoi direct) |
| **Fiabilité** | Accusés de réception (ACK) | Aucune garantie |
| **Vitesse** | Plus lent (séquençage) | Très rapide (temps réel) |

---

## 🔍 5. Scans de ports avec Nmap
L'outil `nmap` permet de sonder les ports d'une machine en manipulant les flags TCP.

**Commande principale :** 
```bash
sudo nmap -sS localhost
```
*(Scan SYN Stealth)*

**Résultat :** Détection du port `631/tcp` (IPP) ouvert.

### Analyse des types de scans :
*   `-sS` (SYN) : Envoie un SYN. Si SYN/ACK est reçu, il répond par un RST pour rester discret.
*   `-sX` (Xmas) : Allume les flags FIN, PSH et URG simultanément.
*   `-sN` (Null) : Envoie un paquet sans aucun flag.

---

### 📝 Conclusion
Ce TP a permis de valider les mécanismes de multiplexage via les ports. TCP se révèle être un protocole complexe et robuste (fiabilité, contrôle de flux), tandis qu'UDP privilégie la simplicité et la performance pour les flux en temps réel. L'utilisation de Wireshark est indispensable pour visualiser ces échanges invisibles à l'œil nu.

> [!WARNING]
> Note : Toutes les commandes et analyses ont été vérifiées sur machine virtuelle Ubuntu 22.04. Le scan de machines tierces sans autorisation demeure illégal.

> [!TIP]
> Un dernier point pour ton WU : n'oublie pas d'inclure les captures d'écran de ton "Flow Graph" que nous avons générées, elles illustrent parfaitement le handshake et les échanges PSH/ACK que tu as notés dans les tableaux.