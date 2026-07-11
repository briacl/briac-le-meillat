# 📖 Guide de Déploiement : Transformer Ubuntu Desktop en Passerelle et Serveur Central (Homelab)

**Objectif du projet :** Intégrer une machine physique (**Lenovo 1**) disposant de deux cartes réseau au sein d'un réseau domestique existant (Maison en `192.168.2.x`). Cette machine agira comme une passerelle (Gateway), isolant un sous-réseau privé (Chambre en `192.168.100.x`), tout en fournissant des services centralisés (DHCP, DNS, Web) à la fois pour le sous-réseau privé et pour le réseau global.

---

## 🧠 Phase 1 : Le Routage (IP Forwarding)

Par défaut, un système d'exploitation de bureau ne fait pas transiter les paquets d'une carte réseau à une autre. Il faut activer l'IP Forwarding au niveau du noyau Linux pour transformer la machine en routeur.

**Commande :**
```bash
echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/99-ip-forward.conf
sudo sysctl -p /etc/sysctl.d/99-ip-forward.conf
```

> [!NOTE]
> **Explication :** Au lieu de modifier le fichier global `/etc/sysctl.conf` ou de faire un `echo 1` volatil dans `/proc/`, on crée un fichier dédié `99-ip-forward.conf`. C'est la méthode moderne. Elle garantit que l'activation du routage survivra à tous les redémarrages et mises à jour du système.

---

## 🛡️ Phase 2 : Le Pare-feu et le NAT (nftables)

Pour que les machines du sous-réseau (Chambre) puissent accéder à Internet, la passerelle doit masquer leurs adresses IP privées (`192.168.100.x`) derrière sa propre adresse IP reconnue par la maison (`192.168.2.36`). C'est le NAT (Network Address Translation). De plus, on sécurise les accès entrants.

**Installation :**
```bash
sudo apt install -y nftables
```

**Configuration (via `sudo nano /etc/nftables.conf`) :**
```nginx
#!/usr/sbin/nft -f

flush ruleset

table inet filter {
    chain input {
        type filter hook input priority filter; policy drop;
        iifname "lo" accept
        ct state established,related accept
        iifname "enx00e04c6836f2" accept # Autorise tout depuis le LAN Chambre
        iifname "enp2s0" tcp dport 22 accept # Autorise SSH depuis la Maison
        iifname "enp2s0" tcp dport 80 accept # Autorise le trafic Web depuis la Maison
    }
    chain forward {
        type filter hook forward priority filter; policy accept;
    }
}

table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat; policy accept;
        oifname "enp2s0" masquerade # Masquage NAT vers le réseau Maison
    }
}
```

> [!NOTE]
> **Explication :**
> * **`#!/usr/sbin/nft -f`** : permet d'exécuter le fichier directement comme script
> * **`flush ruleset`** : vide toutes les règles existantes
> * **`table inet filter`** : crée une table pour filtrer les paquets
> * **`chain input`** : chaîne d'entrée des paquets
> * **`type filter hook input priority filter; policy drop;`** : crée une chaine nommée inpt qui filtre les paquets entrants, policy drop est apr défaut, pour que tout ot rejeté sauf ce qui est explicitement autorisé
iifname "lo" accept : accepte tout depuis loopback (c'est le localhost), nécessaire pour que le système fonctionne
ct state established,related accept : accepte les paquets d'un connexion déjà établie ou liée, crucial pour les réponses aux requêtes sortantes
iifname "enx00e04c6836f2" accept : accepte tout depuis le LAN Chambre
iifname "enp2s0" tcp dport 22 accept : autorise SSH depuis la Maison, pour permettre le contrôle à distance
iifname "enp2s0" tcp dport 80 accept : autorise le trafic Web depuis la Maison, pou rmermettre l'accès au web
chain forward : chaine pour le trafic qui passe à travers le routeur
type filter hook forward priority filter; policy accept; : crée une chaine nommée forward qui filtre les paquets qui transitent par le routeur, policy accept est par défaut, pour que tout passe sauf ce qui est explicitement rejeté
table ip nat : crée une table pour la traduction d'adresses
chain postrouting : chaîne de traduction d'adresses
type nat hook postrouting priority srcnat; policy accept; oifname "enp2s0" masquerade : effectue la traduction d'adresses sur l'interface enp2s0, l'idée est qu'on remplace leur adresse source par celle du routeur, de cette manière on cache le réseau intern vers l'extérieurs

**Application et persistance :**
```bash
sudo nft -f /etc/nftables.conf
sudo systemctl enable nftables
```

---

## 📡 Phase 3 : Le Serveur DHCP (isc-dhcp-server)

Le serveur DHCP distribue automatiquement les configurations réseau (IP, Masque, Passerelle, DNS) aux machines se connectant au switch de la chambre.

**Installation :**
```bash
sudo apt install -y isc-dhcp-server
```

**Configuration de l'interface (via `sudo nano /etc/default/isc-dhcp-server`) :**
```ini
INTERFACESv4="enx00e04c6836f2"
```

**Configuration du sous-réseau (via `sudo nano /etc/dhcp/dhcpd.conf`) :**
```nginx
default-lease-time 600;
max-lease-time 7200;
authoritative;

subnet 192.168.100.0 netmask 255.255.255.0 {
    range 192.168.100.50 192.168.100.150;
    option routers 192.168.100.1;
    option domain-name-servers 192.168.100.1;
}
```

> [!NOTE]
> **Explication :**
> La directive `authoritative` indique que ce serveur est le maître légitime sur ce segment réseau. La ligne `domain-name-servers` force les clients à utiliser notre futur serveur local pour leurs requêtes DNS (Zéro configuration côté client).

---

## 🗺️ Phase 4 : Le Serveur DNS Local (Bind9)

Bind9 gère la résolution de noms pour le domaine privé (`networkbriac.net`) et relaie les requêtes inconnues (comme `google.com`) vers Internet.

> [!TIP]
> Le choix d'une extension valide comme `.net` au lieu de `.webserver` empêche les navigateurs modernes comme Chrome de forcer une recherche Google lors de la saisie.

**Installation :**
```bash
sudo apt install -y bind9 bind9utils
```

**Configuration des relais (via `sudo nano /etc/bind/named.conf.options`) :**
```nginx
options {
    directory "/var/cache/bind";
    recursion yes;
    allow-recursion { 192.168.100.0/24; 127.0.0.1; };
    forwarders { 192.168.2.1; 1.1.1.1; }; 
    listen-on { 192.168.100.1; 127.0.0.1; };
};
```

> [!NOTE]
> **Explication :** La récursion (`recursion yes`) permet de chercher les IP sur le net. `allow-recursion` sécurise le serveur en n'autorisant que le LAN local à utiliser ce relais. Les `forwarders` pointent vers la box de la maison et Cloudflare en secours.

**Déclaration de la zone (via `sudo nano /etc/bind/named.conf.local`) :**
```nginx
zone "networkbriac.net" {
    type master;
    file "/etc/bind/db.networkbriac.net";
};
```

**Fichier de zone (via `sudo nano /etc/bind/db.networkbriac.net`) :**
```dns
$TTL 86400
@ IN SOA srv-gateway.networkbriac.net. admin.networkbriac.net. (
    1 ; Serial
    3600 ; Refresh
    900 ; Retry
    604800 ; Expire
    86400 ) ; Negative Cache TTL

@        IN NS  srv-gateway.networkbriac.net.
srv-gateway   IN A   192.168.100.1
@             IN A   192.168.100.1
```

> [!NOTE]
> **Explication :** La ligne `@ IN A 192.168.100.1` indique que si un utilisateur tape exactement le nom de domaine sans rien devant, il sera redirigé vers le serveur web.

---

## 🌐 Phase 5 : Le Serveur Web (Apache2)

**Installation :**
```bash
sudo apt install -y apache2
```

**Création du Virtual Host (via `sudo nano /etc/apache2/sites-available/webserver.conf`) :**
```apache
<VirtualHost *:80>
    ServerName networkbriac.net
    DocumentRoot /var/www/html
    ErrorLog ${APACHE_LOG_DIR}/webserver_error.log
    CustomLog ${APACHE_LOG_DIR}/webserver_access.log
</VirtualHost>
```

**Activation et gestion des droits :**
```bash
sudo a2ensite webserver.conf
sudo a2dissite 000-default.conf
sudo systemctl daemon-reload
sudo systemctl restart apache2
sudo chown -R briac:briac /var/www/html/
```

> [!NOTE]
> **Explication :** Le `daemon-reload` prévient systemd que les liens des services web ont changé. La commande `chown` donne la propriété du dossier web à l'utilisateur standard, permettant de modifier les fichiers (HTML/CSS) sans nécessiter les droits root.

---

## 🔓 Phase 6 : Accès à Distance (SSH & VS Code)

Pour piloter l'infrastructure et coder directement sur le serveur sans écran physique.

**Installation :**
```bash
sudo apt install -y openssh-server
```

**Utilisation :**
* Connexion depuis n'importe quelle machine du réseau via `ssh briac@192.168.2.36`.
* **VS Code :** Utilisation de l'extension *Remote - SSH* pour ouvrir directement `/var/www/html/` et développer l'interface web (HTML/CSS) avec un confort optimal.

---

## 🚀 Phase 7 : Persistance au Redémarrage (Validation finale)

Afin que le serveur survive aux coupures de courant et redémarre l'intégralité de la configuration de façon autonome :

```bash
sudo systemctl enable named
sudo systemctl enable apache2 isc-dhcp-server ssh
```

*(L'IP Forwarding et nftables ayant déjà été fixés dans les phases précédentes).*

L'IP dynamique du Lenovo est-elle un problème ?
Non, et voici pourquoi : en relisant ton NetworkBriac.md, tout ce qui compte dans ton infrastructure est basé sur des noms d'interfaces (enp2s0, enx00e04c6836f2) et non sur des IPs. Le NAT, le forwarding, le DHCP, Bind9 — rien ne dépend de l'IP WAN du Lenovo. Elle peut changer, tout continue de fonctionner. ✅

Le vrai problème : isc-dhcp-server qui plante au démarrage
C'est le seul point fragile. Il crashe parce que enx00e04c6836f2 n'est pas encore prête quand systemd le lance. La fix propre :
bashsudo systemctl edit isc-dhcp-server
Dans l'éditeur qui s'ouvre, ajoute :
ini[Unit]
After=network-online.target sys-subsystem-net-devices-enx00e04c6836f2.device
Wants=network-online.target sys-subsystem-net-devices-enx00e04c6836f2.device
Puis :
bashsudo systemctl daemon-reload
sudo systemctl enable isc-dhcp-server
Cela force systemd à attendre que l'interface USB soit bien détectée avant de lancer le DHCP.
---

## 📩 Requête à l'Administrateur Réseau (Routeur BIGWALL)

Afin de finaliser l'architecture et de la rendre parfaitement "Plug & Play" pour l'ensemble des équipements de la maison, une intervention unique est requise sur le routeur central (BIGWALL).

**Objectif :** Rendre le serveur web (et tous les futurs sous-domaines de développement) accessible depuis le réseau `192.168.2.x` sans avoir à modifier la configuration DNS individuelle des ordinateurs/smartphones, et sans exposer le réseau privé protégé de la passerelle.

> [!IMPORTANT]
> **Action requise :**
> Merci d'ajouter ces deux entrées DNS statiques (*Host Overrides*) dans la configuration du routeur **BIGWALL** :
> * `networkbriac.net` ➔ `IN A` ➔ `192.168.2.36`
> * `*.networkbriac.net` ➔ `IN A` ➔ `192.168.2.36` (Wildcard)

> [!NOTE]
> **Explication technique du fonctionnement (Zéro Maintenance) :**
> L'ajout du Wildcard (`*`) garantit une évolutivité totale sans nécessiter de nouveaux tickets d'intervention. Si un nouveau service est déployé (ex: `synapseo.networkbriac.net`), la requête sera automatiquement envoyée par le BIGWALL à l'IP WAN de la passerelle (`192.168.2.36`). 
> 
> Le pare-feu interne (nftables) autorisera le port 80, et le routeur applicatif (Apache2 via Virtual Hosts) se chargera d'analyser l'en-tête HTTP pour afficher le bon projet. Tout l'adressage du sous-réseau local (`192.168.100.x`) reste ainsi invisible et isolé du réseau principal de la maison.