---
title: "Serveur DNS & Web"
module: "R303"
competence: ["Administrer", "Connecter"]
techs: ["DNS", "BIND9", "Apache2", "Linux", "Web"]
date: "2026-09-21"
status: "Terminé"
image: "/assets/projects/tp-dns-&-web-server-visu.jpg"
---

# Serveur DNS & Web
> **R303 — Configuration Serveur DNS & Web** — *Briac Le Meillat*

**Objectif :** Configuration d'un serveur DNS (BIND9) et d'un serveur Web (Apache2) avec des VirtualHosts.

---

## 🛠 1. Installation des paquets requis

> [!NOTE]
> **Pourquoi ?** Avant de configurer notre serveur, nous devons installer les logiciels nécessaires : `bind9` (le service DNS) et `apache2` (le service Web). Les utilitaires `bind9utils` et `bind9-doc` apportent des outils de vérification et la documentation associée.

Mise à jour des dépôts et installation du serveur DNS (BIND9) et du serveur Web (Apache2) :
```bash
sudo apt update
sudo apt install bind9 bind9utils bind9-doc apache2 -y
```

## 2. Configuration du réseau et du système

### A. Configuration de l'interface réseau via Netplan

> [!NOTE]
> **Pourquoi ?** Un serveur (DNS ou Web) doit toujours avoir une adresse IP fixe (statique) pour que les clients puissent le trouver de manière fiable. Si on restait en DHCP (dynamique), l'IP pourrait changer à chaque redémarrage et casser nos services.

Édition du fichier `/etc/netplan/00-installer-config.yaml` pour définir une IP statique (`192.31.25.13`) :
```yaml
network:
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.31.25.13/24
      routes:
        - to: default
          via: 192.31.25.1
      nameservers:
        addresses:
          - 127.0.0.1
  version: 2
```

### B. Changement du nom de la machine

> [!NOTE]
> **Pourquoi ?** Le nom d'hôte permet d'identifier facilement la machine sur le réseau. `ns-serveur` (pour Name Server) est beaucoup plus explicite que le nom par défaut de la machine.

Application du nouveau nom d'hôte `ns-serveur` :
```bash
hostnamectl set-hostname ns-serveur
hostname # Vérification
```

---

## 3. Configuration DNS côté client

> [!NOTE]
> **Pourquoi ?** Par défaut, notre machine interroge le DNS de la box ou de l'IUT. En modifiant `resolv.conf`, on force notre serveur à s'interroger *lui-même* en premier (`192.31.25.13`) pour résoudre les noms de domaine locaux qu'on va configurer.

Afin que les requêtes locales interrogent notre propre serveur DNS, on édite le fichier `/etc/resolv.conf` :
```text
nameserver 192.31.25.13
options edns0 trust-ad
search edu.ua
```

---

## 4. Configuration du Serveur DNS (BIND9)

### A. Redirection des requêtes (Forwarders)

> [!NOTE]
> **Pourquoi ?** Notre serveur DNS local ne connaît que notre zone `networkbriac.lan`. Si on lui demande l'adresse de `google.com`, il ne la connaît pas. Les *forwarders* lui disent : "Si tu ne connais pas la réponse, transfère la question aux serveurs de l'IUT".

Édition du fichier `/etc/bind/named.conf.options` pour renvoyer les requêtes vers les serveurs DNS de l'IUT :
```text
options {
    directory "/var/cache/bind";
    forwarders {
        172.18.26.101;
        172.18.26.102;
        172.18.50.101;
    };
    dnssec-validation auto;
    listen-on-v6 { any; };
};
```

### B. Déclaration des zones (Directe et Inverse)

> [!NOTE]
> **Pourquoi ?** On indique à BIND9 quelles sont les zones (domaines) dont il est le "Maître" (l'autorité absolue).
> - **Zone directe** : Traduit un nom (ex: `www.networkbriac.lan`) en adresse IP.
> - **Zone inverse** : Traduit une IP en nom (utile pour la sécurité et le diagnostic).
> - **file** : indique dans quel fichier trouver la config

Définition des zones dans `/etc/bind/named.conf.local` :
```text
zone "networkbriac.lan" {
    type master;
    file "/etc/bind/db.networkbriac.lan";
};

zone "25.31.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.networkbriac.inv";
};
```

### C. Création des fichiers de zone (Copie des modèles)

> [!NOTE]
> **Pourquoi ?** Plutôt que de créer les fichiers de zone de zéro et de risquer des erreurs de syntaxe, il est fortement recommandé de copier un modèle existant fourni par BIND9 (comme `db.127`) puis de le modifier.

Création des fichiers de zone à partir du modèle local :
```bash
sudo cp /etc/bind/db.127 /etc/bind/db.networkbriac.lan
sudo cp /etc/bind/db.127 /etc/bind/db.networkbriac.inv
```

### D. Fichier de zone directe (Nom vers IP)

> [!NOTE]
> **Pourquoi ?** C'est ici que l'on fait le lien réel entre nos noms de domaine (le serveur lui-même `ns-serveur`, et nos futurs sites web `www` et `www2`) et notre adresse IP `192.31.25.13`.

Fichier : `/etc/bind/db.networkbriac.lan`
```text
$TTL 604800
@ IN SOA ns-serveur.networkbriac.lan. admin.networkbriac.lan. (
    2         ; Serial
    604800    ; Refresh
    86400     ; Retry
    2419200   ; Expire
    604800 )  ; Negative Cache TTL
;
@ IN NS ns-serveur.networkbriac.lan.
ns-serveur IN A 192.31.25.13
www IN A 192.31.25.13
www2 IN A 192.31.25.13
```

### E. Fichier de zone inverse (IP vers Nom)

> [!NOTE]
> **Pourquoi ?** Le fichier inverse fait le chemin contraire. Le `13` correspond au dernier octet de notre adresse IP (`192.31.25.13`). Si on interroge le DNS sur l'IP `.13`, il saura répondre que c'est `ns-serveur`.

Fichier : `/etc/bind/db.networkbriac.inv`
```text
$TTL 604800
@ IN SOA ns-serveur.networkbriac.lan. admin.networkbriac.lan. (
    1         ; Serial
    604800    ; Refresh
    86400     ; Retry
    2419200   ; Expire
    604800 )  ; Negative Cache TTL
;
@ IN NS ns-serveur.networkbriac.lan.
13 IN PTR ns-serveur.networkbriac.lan.
13 IN PTR www.networkbriac.lan.
13 IN PTR www2.networkbriac.lan.
```

---

## 5. Vérifications et Tests DNS

> [!NOTE]
> **Pourquoi ?** Avant de redémarrer le service DNS, il est crucial de vérifier qu'il n'y a pas d'erreur de syntaxe (un simple point-virgule oublié peut faire planter tout le serveur DNS). Les commandes `named-checkconf` et `named-checkzone` servent à ça.

Vérification de la syntaxe des fichiers avant redémarrage :
```bash
sudo named-checkconf
> si n affiche rien, alors tout bon
sudo named-checkzone networkbriac.lan /etc/bind/db.networkbriac.lan
> OK
sudo named-checkzone 25.31.192.in-addr.arpa /etc/bind/db.networkbriac.inv
> OK
sudo systemctl restart bind9
```

Test final depuis le client avec `dig` et `nslookup` :

> [!TIP]
> **Test de mise en cache DNS :** Il est recommandé de lancer la commande `dig` **deux fois d'affilée**. 
> - Lors de la première requête, le serveur doit résoudre le nom (le `Query time` sera par exemple de 1 msec).
> - Lors de la deuxième requête, le résultat étant mis en cache, le `Query time` doit obligatoirement passer à **0 msec**.

```bash
dig www.networkbriac.lan
> ; <<>> DiG 9.20.18-1ubuntu2-Ubuntu <<>> www.networkbriac.lan
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 26484
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
; COOKIE: e606b72e80104d44010000006ab13dbb300278bd6cc48330 (good)
;; QUESTION SECTION:
;www.networkbriac.lan.		IN	A

;; ANSWER SECTION:
www.networkbriac.lan.	604800	IN	A	192.31.25.13

;; Query time: 1 msec
;; SERVER: 192.31.25.13#53(192.31.25.13) (UDP)
;; WHEN: Mon Sep 21 16:22:51 CEST 2026
;; MSG SIZE  rcvd: 93
```

```bash
nslookup www.networkbriac.lan
> Server:		192.31.25.13
Address:	192.31.25.13#53

Name:	www.networkbriac.lan
Address: 192.31.25.13
```

---

## 6. Configuration du Serveur Web (Apache2)

### A. Création des dossiers et des fichiers d'index

> [!NOTE]
> **Pourquoi ?** Un serveur web affiche des fichiers stockés dans des dossiers. On crée ici l'arborescence (`/var/www/www` et `www2`) qui contiendra le code HTML de nos deux sites virtuels distincts.

```bash
sudo mkdir -p /var/www/www /var/www/www2
echo "<h1>Bienvenue sur le site principal (WWW)</h1>" | sudo tee /var/www/www/index.html
echo "<h1>Bienvenue sur le site secondaire (WWW2)</h1>" | sudo tee /var/www/www2/index.html
```

### B. Configuration des VirtualHosts Apache

> [!NOTE]
> **Pourquoi ?** Les VirtualHosts permettent d'héberger **plusieurs sites web différents sur un seul serveur** (et une seule adresse IP). Apache regarde le nom de domaine demandé par le client (ex: `www2.networkbriac.lan`) et le redirige vers le bon dossier en fonction.

Fichier `/etc/apache2/sites-available/www.conf` :
```xml
<VirtualHost *:80>
    ServerName www.networkbriac.lan
    DocumentRoot /var/www/www
</VirtualHost>
```

Fichier `/etc/apache2/sites-available/www2.conf` :
```xml
<VirtualHost *:80>
    ServerName www2.networkbriac.lan
    DocumentRoot /var/www/www2
</VirtualHost>
```

Activation des sites et redémarrage du service :
```bash
sudo a2ensite www.conf www2.conf
sudo systemctl reload apache2
```

> [!WARNING]
> **Problème d'affichage Web (XUbuntu 26) :** 
> Suite à la mise à jour des VM de l'IUT vers XUbuntu 26 (Septembre 2026), **Firefox intègre un proxy par défaut**. Ce proxy bloque l'affichage de vos pages web locales, même si votre configuration serveur est parfaite.
> 
> **Solution :**
> 1. Ouvrez les **Paramètres** de Firefox.
> 2. Allez dans la section **Paramètres réseau** (ou Proxy).
> 3. Cochez la case **"Pas de proxy"** (No proxy).
> 4. Rechargez votre page web, elle s'affichera correctement.

---

## 7. Résolution d'incidents (Dépannage IPv6)

> [!WARNING]
> **Problème :** Le statut de `named.service` indique des erreurs de logs ("network unreachable resolving") car la machine n'a pas d'accès IPv6 configuré.

Pour désactiver l'IPv6 de BIND9, on ajoute le drapeau `-4` dans `/etc/default/named` :
```text
# startup options for the server
OPTIONS="-u bind -4"
```

Ensuite, on modifie également `/etc/bind/named.conf.options` pour ignorer l'écoute IPv6 :
```text
listen-on-v6 { none; };
```

Après un redémarrage du service, les logs polluants liés à l'IPv6 n'apparaissent plus.
