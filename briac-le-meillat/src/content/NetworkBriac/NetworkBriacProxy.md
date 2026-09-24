---
title: "Proxy Squid Forward & SSL-Bump"
module: "R103"
competence: ["Administrer"]
ac_lies: ["AC11.04"]
project_type: "perso"
techs: ["Squid", "Proxy", "SSL"]
reference_tp: "Inspiré par les TPs de Bases des Services Réseaux"
date: "2026-06-01"
status: "Terminé"
image: ""
---

# TP : Mise en place et configuration d'un Proxy Squid (Forward & SSL-Bump)

## 1. C'est quoi un Proxy et comment ça marche ?
Une Gateway (passerelle) travaille principalement au niveau de la couche Réseau (Couche 3 du modèle OSI). Elle route les paquets d'un réseau à un autre, modifie les IP (NAT), mais elle ne lit pas le contenu des données applicatives (comme le HTTP).

Un Proxy (mandataire), lui, agit généralement au niveau de la couche Application (Couche 7). C'est un intermédiaire complet. Quand tu demandes une page web :
1. Ton navigateur n'envoie pas la requête directement au site final.
2. Il l'envoie au Proxy.
3. Le Proxy établit sa propre connexion avec le site web, récupère la page, et te la renvoie.

### Pourquoi on utilise ça à l'IUT ou en entreprise ?
* **Le Filtrage :** Interdire l'accès à certains sites (comme les réseaux sociaux ou les sites malveillants).
* **La Mise en cache (Caching) :** Si 50 étudiants demandent la même page de doc technique le même matin, le proxy la télécharge une seule fois, la stocke, et la sert instantanément aux 49 autres. Cela économise la bande passante.
* **L'Anonymisation / Traçabilité :** Pour le site web cible, c'est l'IP du proxy qui s'affiche, pas la tienne. Pour l'administrateur du réseau local, le proxy garde un historique (logs) de qui a visité quoi.

---

## 2. Notre plan d'attaque
Pour comprendre comment ça marche, on va utiliser l'un des proxys open-source les plus célèbres et robustes du marché : **Squid**.

On va le configurer sur ta machine Linux (celle qui te sert de lab/passerelle) en mode **Forward Proxy** (le mode classique où le proxy travaille pour les clients du LAN).

Les étapes :
1. Installer Squid (version avec support SSL).
2. Comprendre et épurer son fichier de configuration.
3. Configurer le SSL-Bump pour intercepter le HTTPS.
4. Installer le certificat CA sur le client.
5. Créer des règles de filtrage (bloquer un domaine spécifique).
6. Analyser les logs en temps réel pour voir la magie opérer.

---

## 3. Mise en place technique (Step-by-Step)

> [!IMPORTANT]
> **Version testée :** Squid 7.2 sur Ubuntu 26.04 LTS. Les commandes ci-dessous sont validées pour cette version. La version standard (`squid`) ne suffit pas — il faut absolument `squid-openssl` qui inclut le support SSL/TLS compilé.

### Étape 1 : Installation de Squid avec support SSL
Sur ta machine Linux, installe la version de Squid compilée avec OpenSSL :
```bash
apt update
apt install squid-openssl -y
```

Vérifie que le support SSL est bien présent :
```bash
squid -v | grep -i ssl
```
Tu dois voir `--with-openssl` et `--enable-ssl-crtd` dans la sortie.

Par défaut, Squid se lance immédiatement et écoute sur le port `3128`.

---

### Étape 2 : Sauvegarde et nettoyage de la configuration
Le fichier de configuration de Squid se trouve dans `/etc/squid/squid.conf`. On fait une sauvegarde puis on repart sur une base propre.
```bash
cp /etc/squid/squid.conf /etc/squid/squid.conf.bak
truncate -s 0 /etc/squid/squid.conf
```

---

### Étape 3 : Générer l'autorité de certification (CA) du Proxy
Squid a besoin de son propre certificat CA pour générer à la volée de faux certificats pour chaque site HTTPS visité par les clients.

```bash
# Créer le dossier pour stocker les certificats
mkdir -p /etc/squid/certs
cd /etc/squid/certs

# Générer la clé privée et le certificat racine (valable 10 ans)
openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 \
  -keyout squidCA.pem -out squidCA.pem \
  -subj "/CN=NetworkBriacProxy/O=NetworkBriac/C=FR"

# Convertir en .der pour l'importer facilement sur les clients (macOS, Windows, Firefox)
openssl x509 -in squidCA.pem -outform DER -out squidCA.der

# Donner les droits à l'utilisateur squid
chown -R proxy:proxy /etc/squid/certs
chmod 400 /etc/squid/certs/squidCA.pem
```

---

### Étape 4 : Initialiser la base de données des certificats dynamiques
Squid génère un certificat unique pour chaque domaine visité et les stocke dans une base de données.

```bash
# Créer le répertoire parent si nécessaire
mkdir -p /var/spool/squid
chown proxy:proxy /var/spool/squid

# Initialiser la base (IMPORTANT : le dossier ssl_db ne doit PAS exister avant)
# Si ssl_db existe déjà : rm -rf /var/spool/squid/ssl_db
/usr/lib/squid/security_file_certgen -c -s /var/spool/squid/ssl_db -M 4MB

# Donner les droits à l'utilisateur squid
chown -R proxy:proxy /var/spool/squid/ssl_db
```

> [!NOTE]
> La commande `security_file_certgen` **crée elle-même** le dossier `ssl_db`. Si le dossier existe déjà (même vide), elle échoue. Supprime-le d'abord si nécessaire.

---

### Étape 5 : Configuration complète de Squid avec SSL-Bump

Ouvre le fichier de configuration :
```bash
nano /etc/squid/squid.conf
```

Colle cette configuration complète (adapte le sous-réseau à ton LAN) :
```plaintext
# ============================================================
# ACL - Listes de contrôle d'accès
# ============================================================
acl localnet src 192.168.100.0/24   # Adapte à ton sous-réseau
acl SSL_ports port 443
acl Safe_ports port 80
acl Safe_ports port 443

# ============================================================
# Règles de sécurité
# ============================================================
http_access deny !Safe_ports
http_access deny CONNECT !SSL_ports

# ============================================================
# Autoriser le LAN et localhost
# ============================================================
http_access allow localhost
http_access allow localnet
http_access deny all

# ============================================================
# Port d'écoute avec SSL-Bump activé
# ============================================================
http_port 3128 ssl-bump \
  cert=/etc/squid/certs/squidCA.pem \
  generate-host-certificates=on \
  dynamic_cert_mem_cache_size=4MB

# ============================================================
# Moteur de génération de certificats dynamiques
# ============================================================
sslcrtd_program /usr/lib/squid/security_file_certgen \
  -s /var/spool/squid/ssl_db -M 4MB
sslcrtd_children 5

# ============================================================
# Stratégie SSL-Bump
# peek : Squid lit le SNI (nom de domaine) sans casser le chiffrement
# bump : Squid intercepte et déchiffre le flux TLS
# ============================================================
ssl_bump peek all
ssl_bump bump all

# ============================================================
# Cache
# ============================================================
cache_dir ufs /var/spool/squid 100 16 256
```

Sauvegarde (Ctrl+O, Entrée, Ctrl+X).

**Valide la config sans redémarrer :**
```bash
squid -k parse
```
Si aucune erreur n'apparaît, redémarre :
```bash
systemctl restart squid
systemctl status squid
```

---

### Étape 6 : Configurer le client macOS

#### Transférer le certificat CA vers le Mac
Si tu as un partage Samba entre le Lenovo et le Mac :
```bash
cp /etc/squid/certs/squidCA.der /chemin/vers/dossier/samba/
```

Sinon via SCP depuis le Mac :
```bash
scp root@192.168.100.1:/etc/squid/certs/squidCA.der ~/Desktop/squidCA.der
```

#### Installer le certificat CA sur macOS
La méthode la plus fiable est via la ligne de commande (depuis le Mac) :
```bash
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain /chemin/vers/squidCA.der
```

> [!NOTE]
> Le double-clic sur le .der fonctionne aussi mais peut ne pas mettre le certificat dans le bon trousseau. La commande ci-dessus le place directement dans le trousseau Système avec une confiance totale.

#### Configurer le proxy sur macOS
Réglages Système → Réseau → ton interface → Détails → Proxy :
- **Proxy Web (HTTP)** : `192.168.100.1` port `3128`
- **Proxy Web sécurisé (HTTPS)** : `192.168.100.1` port `3128`

> [!IMPORTANT]
> Les deux (HTTP et HTTPS) pointent vers le **même port 3128**. C'est normal : avec `ssl-bump` sur `http_port`, Squid gère les deux protocoles sur un seul port.

---

## 4. Ajouter une règle de filtrage

Pour bloquer un ou plusieurs sites, ajoute ces deux lignes dans `/etc/squid/squid.conf`, **juste avant** `http_access allow localnet` :

```plaintext
# Bloquer des sites spécifiques
acl sites_bloques dstdomain .facebook.com .tiktok.com .apple.com
http_access deny sites_bloques
```

Redémarre Squid pour appliquer :
```bash
systemctl restart squid
```

Dans les logs, tu verras apparaître `TCP_DENIED` pour les tentatives d'accès aux sites bloqués :
```plaintext
1781970950.421   49 192.168.100.11 TCP_DENIED/200 0 CONNECT www.apple.com:443 - HIER_NONE/- -
```

---

## 5. Analyser les logs en temps réel

```bash
tail -f /var/log/squid/access.log
```

Structure d'une ligne de log :
```plaintext
1718312345.123  150 192.168.100.11 TCP_MISS/200 12345 GET https://www.google.com/ - HIER_DIRECT/142.250.179.142 text/html
```

| Champ | Signification |
|-------|--------------|
| `1718312345.123` | Timestamp Unix |
| `150` | Temps de réponse (ms) |
| `192.168.100.11` | IP du client |
| `TCP_MISS/200` | Statut Squid / code HTTP |
| `12345` | Taille en octets |
| `GET` | Méthode HTTP |
| `https://www.google.com/` | URL complète (visible grâce au SSL-Bump !) |
| `HIER_DIRECT/...` | Comment Squid a récupéré la ressource |

**Codes Squid courants :**
* `TCP_MISS` : Page non cachée, téléchargée depuis Internet.
* `TCP_HIT` : Page servie depuis le cache de Squid.
* `TCP_DENIED` : Requête bloquée par une règle ACL.
* `TCP_TUNNEL` : Tunnel HTTPS opaque (SSL-Bump non actif pour ce site).

**Filtrer les logs :**
```bash
# Toutes les requêtes d'une IP
cat /var/log/squid/access.log | grep "192.168.100.11"

# Toutes les visites d'un domaine
cat /var/log/squid/access.log | grep "google"

# Afficher les timestamps en format lisible
perl -p -e 's/^\d+\.\d+/localtime($&)/e' /var/log/squid/access.log | tail -n 20
```

---

## 6. Activer / Désactiver le proxy

**Arrêter Squid (proxy inactif) :**
```bash
systemctl stop squid
```

**Démarrer Squid :**
```bash
systemctl start squid
```

> [!IMPORTANT]
> Si le proxy est arrêté sur le Lenovo, pense à **désactiver le proxy dans les réglages réseau de ton Mac** — sinon ton Mac essaiera de passer par un proxy injoignable et n'aura plus accès à Internet.
> De même, si tu te connectes à un autre réseau (chez toi, à l'IUT...), désactive le proxy sur ton Mac : il ne sera joignable que sur le réseau NetworkBriac (`192.168.100.0/24`).

---

## 7. Résumé des fichiers importants

| Fichier | Rôle |
|---------|------|
| `/etc/squid/squid.conf` | Configuration principale de Squid |
| `/etc/squid/squid.conf.bak` | Sauvegarde de la config d'origine |
| `/etc/squid/certs/squidCA.pem` | Clé privée + certificat CA du proxy |
| `/etc/squid/certs/squidCA.der` | Certificat CA à importer sur les clients |
| `/var/spool/squid/ssl_db` | Base de données des certificats dynamiques |
| `/var/log/squid/access.log` | Logs de toutes les requêtes HTTP/HTTPS |
| `/var/log/squid/cache.log` | Logs de démarrage et d'erreurs de Squid |