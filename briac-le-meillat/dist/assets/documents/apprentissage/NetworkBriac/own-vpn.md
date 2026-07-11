# TP : Hébergement et configuration de son propre VPN (WireGuard)

## 1. Comment fonctionne la géolocalisation par VPN ?
* **Le Tunnel :** Ton PC crée une connexion chiffrée avec un serveur situé en Suisse.
* **L'Encapsulation :** Tes paquets IP d'origine sont mis à l'intérieur d'un nouveau paquet IP (comme une lettre dans une seconde enveloppe).
* **Le Routage :** Internet voit uniquement le trafic entre ton PC et le serveur suisse.
* **La NAT (Network Address Translation) :** Le serveur suisse reçoit le paquet, retire l'enveloppe externe, et envoie la requête au site web (ex: Netflix) avec sa propre adresse IP suisse. Le site croit donc que tu es en Suisse.

---

## 2. Comment créer ton propre VPN gratuitement ?
Pour avoir une IP en Suisse, ton serveur VPN doit être physiquement en Suisse. Tu ne peux pas faire ça depuis ta box internet en France. Tu dois utiliser un VPS (Serveur Privé Virtuel) gratuit.

### Étape 1 : Obtenir le serveur (VPS)
Crée un compte gratuit sur Oracle Cloud Infrastructure (OCI). Ils proposent une offre "Always Free" avec des serveurs gratuits à vie. Lors de l'inscription, choisis la région Suisse (Zurich ou Genève).

---

### Étape 2 : Installer le protocole VPN (WireGuard)
WireGuard est le protocole moderne, rapide et léger (niveau 1A, plus simple qu'IPsec). Connecte-toi en SSH à ton VPS Linux et lance ce script d'installation automatisé (le plus fiable) :
```bash
wget https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
sudo ./wireguard-install.sh
```

---

### Étape 3 : Explication littérale des commandes du script
* **`wget [URL]`** : Télécharge le script d'installation depuis le dépôt GitHub d'Angristan.
* **`chmod +x [...]`** : Modifie les permissions du fichier pour le rendre exécutable par le système.
* **`sudo ./wireguard-install.sh`** : Exécute le script avec les privilèges root pour installer WireGuard, configurer le pare-feu du serveur et générer les clés de chiffrement.

Le script va te poser des questions (laisse les valeurs par défaut) et te demander un nom de client (ex: `monpc`).

---

### Étape 4 : Configuration des fichiers (Format Export)
Voici la structure et l'explication des fichiers générés sur le serveur.

#### Fichier 1 : Configuration du Serveur (`/etc/wireguard/wg0.conf`)
```ini
[Interface]
Address = 10.8.0.1/24          # Adresse IP privée du serveur dans le tunnel VPN
PrivateKey = <CLE_PRIVE_SERV>  # Clé asymétrique du serveur pour déchiffrer le trafic
ListenPort = 51820             # Port UDP utilisé pour écouter les connexions entrantes

# Règles IPTables pour activer le NAT (routage du trafic du tunnel vers Internet)
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = <CLE_PUBLIQUE_PC>  # Clé publique de ton PC pour l'identifier
AllowedIPs = 10.8.0.2/32       # IP privée attribuée à ton PC dans le tunnel
```

#### Fichier 2 : Configuration du Client (`monpc.conf`)
```ini
[Interface]
Address = 10.8.0.2/24          # IP privée de ton PC dans le tunnel
PrivateKey = <CLE_PRIVE_PC>    # Clé privée de ton PC pour chiffrer son trafic
DNS = 1.1.1.1                  # Serveur DNS utilisé par le PC une fois connecté

[Peer]
PublicKey = <CLE_PUBLIQUE_SERV> # Clé publique du serveur pour vérifier son identité
Endpoint = <IP_PUBLIQUE_SUISSE>:51820 # Adresse IP réelle du serveur en Suisse et son port
AllowedIPs = 0.0.0.0/0         # 0.0.0.0/0 signifie que TOUT le trafic du PC passe par le VPN (Full Tunnel)
```

---

### Étape 5 : Connexion
1. Télécharge l'application WireGuard sur ton PC ou téléphone.
2. Récupère le fichier `monpc.conf` (ou le QR code généré par le script dans ton terminal).
3. Active la connexion. Ton IP publique devient celle du VPS Oracle en Suisse.

---

## 3. Ce qui se passe concrètement au niveau réseau (Modèle OSI)
Quand tu n'as pas de VPN, ton PC encapsule une requête HTTP dans un segment TCP, puis dans un paquet IP avec ton adresse IP réelle (ex: France), et enfin dans une trame Ethernet. Tout le monde sur le chemin (ton FAI, les routeurs intermédiaires) voit où tu vas.

Avec WireGuard, le processus change. C'est de l'encapsulation **IP-dans-UDP** :
1. **Paquet Initial (Original) :** Ton PC génère le paquet IP normal.
   * **IP Source :** Ton IP privée locale (ex: `192.168.1.15`)
   * **IP Destination :** Le site web (ex: Netflix - `45.57.0.1`)
2. **Chiffrement et Encapsulation (Le Tunnel) :** WireGuard prend ce paquet entier, le chiffre, et le place comme donnée utile (Payload) à l'intérieur d'un nouveau paquet UDP.
3. **Nouveau Paquet IP (Externe) :**
   * **IP Source :** Ton IP publique réelle (fournie par ton FAI français).
   * **IP Destination :** L'IP publique de ton VPS Oracle en Suisse.
   * **Protocole :** UDP / Port : `51820`.

### Le cheminement d'un paquet étape par étape
```plaintext
[Ton PC] ---> (Réseau Chiffré) ---> [Ton FAI] ---> [Internet] ---> [VPS Suisse] ---> (Réseau Clair) ---> [Netflix]
```

* **De ton PC à ta Box :** Le paquet sort chiffré. Ta box voit uniquement des données illisibles qui vont vers l'IP du VPS en Suisse sur le port `51820`.
* **De ta Box au VPS :** Ton FAI (Orange, Bouygues, etc.) ne voit que du trafic UDP vers la Suisse. Il est impossible pour lui de savoir que tu visites Netflix ou un autre site.
* **Arrivée au VPS (Suisse) :** Le serveur reçoit le paquet UDP, le décapsule, utilise sa clé privée pour le déchiffrer. Il découvre le paquet initial (celui qui veut aller sur Netflix).
* **Sortie du VPS :** Le serveur fait du NAT. Il remplace l'IP source initiale par sa propre IP publique suisse et envoie le paquet sur Internet vers Netflix.
* **Retour :** Netflix répond au VPS suisse. Le VPS ré-encapsule la réponse dans le tunnel chiffré et te la renvoie.

---

## 4. Le VPN garde-t-il l'historique des recherches web ?
Techniquement, le serveur VPN voit tout ce qui sort de lui. Au moment où il décapsule ton paquet pour l'envoyer sur Internet, il a accès à :
* L'IP de destination (le site web que tu visites).
* L'heure de la connexion.
* Les volumes de données.

Si le site utilise du HTTPS (99% du web actuel), le contenu exact de ta recherche reste chiffré de bout en bout entre ton PC et le site web. Le VPN sait que tu vas sur `google.fr`, mais pas ce que tu tapes dans la barre de recherche.

### La différence cruciale avec ton PROPRE VPN
* **Chez NordVPN / VPN commerciaux :** Tu dois les croire sur parole quand ils disent "No Log" (pas d'historique). Leurs serveurs sont configurés pour tout effacer en RAM, mais tu n'as aucun contrôle dessus.
* **Chez TOI (Ton VPS Oracle) :** Par défaut, Linux ne garde pas d'historique des paquets qui transitent (le routage se fait en mémoire vive sans écrire sur le disque). Comme tu es l'administrateur root de ce serveur, c'est toi qui décides. Si tu n'installes pas d'outil de surveillance (comme `tcpdump` ou des scripts de logs), il n'y a aucun historique de conservé. Tu as le contrôle total de tes données.

---

## 5. Peut-on cacher l'IP de destination au serveur VPN ?
Tu ne peux pas cacher l'IP de destination (ex: `netflix.com`) au VPS si c'est lui qui doit router le paquet. En niveau 1A, tu as appris le routage IP : pour qu'un routeur (ton VPS) envoie un paquet à une destination, il doit savoir où l'envoyer. Si tu chiffres l'IP de destination, le VPS lit une suite de bits incohérente, ne trouve aucune correspondance dans sa table de routage, et jette le paquet (Drop).

Cependant, on peut aller très loin en combinant plusieurs concepts. Voici jusqu'où on peut aller en termes de sécurité et de confidentialité.

### Solution 1 : Le chiffrement de la recherche (Déjà actif via HTTPS)
Tu confonds l'adresse du site (`netflix.com`) et la recherche précise (`netflix.com/search?q=lupin`). Grâce à HTTPS (TLS), ta recherche est déjà chiffrée de bout en bout (de ton navigateur jusqu'à Netflix). Le script que tu imagines avec Python/Scapy est inutile car ton navigateur le fait nativement :
1. Ton PC chiffre la recherche avec la clé publique de Netflix.
2. Ton PC encapsule ce paquet chiffré dans le tunnel VPN WireGuard.
3. Le VPS retire la couche WireGuard. Il voit que le paquet va vers l'IP de Netflix, mais le contenu (la recherche) reste totalement chiffré.
4. Le VPS transmet le paquet à Netflix sans jamais avoir pu lire ta recherche.

* **Ce que le VPS voit :** "Ce client parle à Netflix".
* **Ce que le VPS NE voit PAS :** "Ce client cherche la série Lupin sur Netflix".

### Solution 2 : Cacher aussi le site de destination (Le modèle TOR)
Si tu ne veux même pas que ton VPS sache que tu vas sur Netflix, le protocole VPN classique ne suffit plus. Il faut utiliser le **Routage en Oignon (Tor)**.

Au lieu d'avoir un seul serveur (ton VPS), le trafic passe par 3 serveurs successifs (Nœuds) :
1. **Le Nœud d'entrée (Ton VPS) :** Il sait que le paquet vient de toi, mais le paquet est sur-chiffré. Ton VPS sait juste qu'il doit envoyer le bloc chiffré au Nœud 2. Il ignore que tu vas sur Netflix.
2. **Le Nœud du milieu :** Il reçoit le paquet du Nœud 1 et l'envoie au Nœud 3. Il ne sait ni qui tu es, ni où tu vas.
3. **Le Nœud de sortie :** Il déchiffre la dernière couche, voit l'adresse `netflix.com` et lui transmet le paquet. Il sait où tu vas, mais il ignore totalement qui tu es (il voit juste le Nœud 2).

En faisant cela, aucun serveur sur la chaîne ne possède l'information complète (Qui + Où).

---

## 6. Analyse de paquets à la loupe : Du PC à Wikipédia
Pour voir littéralement les données et les transformations, on va analyser un paquet réseau à la loupe. Quand tu tapes `https://wikipedia.org` dans ton navigateur en étant connecté à ton VPN WireGuard, voici la structure exacte de ce qui circule dans le câble.

### 1. Analyse pas à pas de l'encapsulation

#### Étape A : Le paquet HTTPS d'origine (Généré par le navigateur)
Avant même de parler de VPN, ton navigateur chiffre la requête avec la clé publique de Wikipédia (via le protocole TLS).

```plaintext
+---------------------------------------------------------------------------------+
| EN-TÊTE IP (Couche 3 - Réseau)                                                  |
| IP Source : 10.8.0.2 (Ton IP privée VPN)                                        |
| IP Destination : 91.198.174.192 (IP de Wikipédia)                               |
+---------------------------------------------------------------------------------+
| EN-TÊTE TCP (Couche 4 - Transport)                                              |
| Port Source : 54321 (Port aléatoire de ton PC)                                  |
| Port Destination : 443 (Port HTTPS standard)                                    |
+---------------------------------------------------------------------------------+
| DONNÉES UTILES (PAYLOAD) - CHIFFRÉES PAR TLS (Application)                      |
| Données lisibles : Rien.                                                        |
| Contenu réel : 0x8f3a1b9c2d... (Équivalent chiffré de "GET / HTTP/1.1")          |
+---------------------------------------------------------------------------------+
```
* **Ce qui est masqué ici :** La page exacte demandée et les données du site.
* **Ce qui est visible ici :** L'IP de Wikipédia (`91.198.174.192`).

#### Étape B : L'encapsulation WireGuard (Ce qui sort de ta carte réseau)
WireGuard intercepte le paquet ci-dessus, le chiffre entièrement (en-tête IP Wikipédia compris) et rajoute ses propres en-têtes pour l'envoyer à ton VPS en Suisse.

```plaintext
+---------------------------------------------------------------------------------+
| EN-TÊTE IP EXTERNE (Visible par ton FAI)                                        |
| IP Source : 82.123.X.X (Ton IP publique réelle en France)                       |
| IP Destination : 130.61.X.X (L'IP publique de ton VPS Oracle en Suisse)         |
+---------------------------------------------------------------------------------+
| EN-TÊTE UDP EXTERNE                                                             |
| Port Source : 49152                                                             |
| Port Destination : 51820 (Port WireGuard)                                       |
+---------------------------------------------------------------------------------+
| DONNÉES UTILES (PAYLOAD) - CHIFFRÉES PAR WIREGUARD                              |
| Contenu : Tout le paquet de l'Étape A est devenu une suite de bits illisibles   |
| [ 0x4a7e93b1c2f8e5d... ]                                                        |
+---------------------------------------------------------------------------------+
```
* **Ce que ton FAI voit :** Tu envoies des données chiffrées à ton VPS en Suisse. C'est tout.

#### Étape C : Ce que voit ton VPS en Suisse (Après déchiffrement)
Le VPS reçoit le paquet UDP, retire l'en-tête externe, et déchiffre la charge utile avec sa clé privée. Il se retrouve avec le paquet de l'Étape A.

Il applique le NAT. Le paquet qui sort du VPS pour aller sur le réseau public mondial ressemble à ça :

```plaintext
+---------------------------------------------------------------------------------+
| EN-TÊTE IP (Après NAT du VPS)                                                   |
| IP Source : 130.61.X.X (L'IP de ton VPS en Suisse)                              |
| IP Destination : 91.198.174.192 (IP de Wikipédia)                               |
+---------------------------------------------------------------------------------+
| EN-TÊTE TCP                                                                     |
| Port Source : 36251 (Port ouvert par le VPS pour le NAT)                        |
| Port Destination : 443 (HTTPS)                                                  |
+---------------------------------------------------------------------------------+
| DONNÉES UTILES (PAYLOAD) - CHIFFRÉES PAR TLS                                    |
| Contenu : 0x8f3a1b9c2d... (Toujours chiffré, le VPS ne peut pas le lire)        |
+---------------------------------------------------------------------------------+
```
* **Ce que le VPS sait :** Ton IP réelle (via l'étape B) et que tu vas sur Wikipédia (IP destination).
* **Ce que le VPS ignore :** Ce que tu fais/cherches sur Wikipédia, car la charge utile TLS est restée intacte et chiffrée de bout en bout entre ton PC et Wikipédia.

---

### 2. Le fonctionnement du Routage en Oignon (Tor)

Pour que le VPS ignore aussi que tu vas sur Wikipédia, on doit ajouter ce concept.

> [!NOTE]
> **Histoire IT / Cybersécurité :** Le routage en oignon a été créé par l'armée américaine (US Navy) pour protéger les communications du gouvernement avant de devenir open-source avec Tor.

Si on applique cela à ton infrastructure, ton PC va appliquer 3 couches de chiffrement (comme les couches d'un oignon) avant d'envoyer le paquet.

**Structure du paquet au départ de ton PC :**
```plaintext
[En-tête Chiffré 1 : Pour Nœud 1 (Ton VPS)] 
   ↳ Déchiffre la couche 1 -> Découvre l'adresse du Nœud 2.
      [En-tête Chiffré 2 : Pour Nœud 2 (Intermédiaire)]
         ↳ Déchiffre la couche 2 -> Découvre l'adresse du Nœud 3.
            [En-tête Chiffré 3 : Pour Nœud 3 (Sortie)]
               ↳ Déchiffre la couche 3 -> Découvre l'adresse finale : Wikipédia.
                  [Contenu HTTPS pour Wikipédia (Chiffré)]
```

**Ce qui se passe sur ton VPS (Nœud 1) :**
Il reçoit le paquet, retire la première couche de chiffrement. La seule instruction qu'il découvre est : *"Envoie le reste du paquet au Nœud 2 (IP: X.X.X.X)"*. Ton VPS ignore totalement que la destination finale est Wikipédia.