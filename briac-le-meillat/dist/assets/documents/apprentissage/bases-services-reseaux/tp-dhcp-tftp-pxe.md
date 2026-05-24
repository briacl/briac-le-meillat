---
title: "Mise en œuvre d'un serveur de boot PXE"
module: "R203"
competence: "Administrer"
ac_lies: ["AC11.01", "AC11.02"]
techs: ["PXE", "Dnsmasq", "NFS", "DHCP", "TFTP"]
date: "2026-05-11"
status: "Terminé"
---

# Compte-Rendu Technique : Mise en œuvre d'un serveur de boot PXE
> **R203 — Administration Réseau** — *Briac Le Meillat (11/05/2026)*

Ce compte-rendu détaille le déploiement d'une infrastructure permettant le démarrage d'un client "diskless" via le réseau.

---

## 💡 Pourquoi utiliser le PXE ?
Voici concrètement à quoi sert le **PXE** (*Pre-boot eXecution Environment*) :

### 1. Le déploiement de masse (L'usine à PC)
Imagine que tu reçois 200 nouveaux ordinateurs pour équiper des salles de TP.
- **Sans PXE** : Tu dois préparer 200 clés USB, passer devant chaque PC, brancher la clé, démarrer, cliquer sur "Suivant", attendre... Tu y passes la semaine.
- **Avec PXE** : Tu branches tous les PC au réseau, tu les allumes tous en même temps. Ils contactent ton serveur PXE, téléchargent l'installeur automatiquement et s'installent tout seuls pendant que tu vas boire un café.

### 2. Les terminaux "Diskless" (Sans disque dur)
Dans certains milieux sécurisés (banques, armée) ou pour réduire les coûts, on utilise des ordinateurs qui n'ont pas de disque dur interne. Rien n'est stocké sur le PC.
Au démarrage, la carte réseau "va chercher" le système d'exploitation sur le serveur.
- **Avantage** : Si le PC est volé, il n'y a aucune donnée dessus. Si le système plante, il suffit de redémarrer pour retrouver un environnement propre stocké sur le serveur.

### 3. La maintenance et le dépannage
Si un parc informatique est infecté par un virus ou si un disque dur tombe en panne :
Tu peux démarrer via le réseau sur un outil de diagnostic ou de récupération de données (comme Clonezilla ou un Live Linux) sans avoir besoin de support physique.

### 🎯 En résumé : le scénario de ce TP
Dans ce TP, nous simulons exactement ce processus :
*   **DHCP** : Le client crie *"Qui peut me donner une IP et me dire où est le serveur de démarrage ?"*
*   **TFTP** : Le client télécharge le "menu de démarrage" (comme un menu de restaurant) pour savoir quel système il peut lancer.
*   **NFS/HTTP** : Le client télécharge les gros fichiers du système (le "plat principal") pour pouvoir l'exécuter.

> [!TIP]
> C'est le moyen ultime de prendre le contrôle d'une machine dès la première seconde où elle est sous tension.

---

## 🛠 1. Préparation de l'environnement et services isolés
Avant la centralisation, les briques de base ont été validées individuellement. Le rôle ici est de donner une IP au client et de lui dire : *"Hé, si tu veux booter, va voir le serveur TFTP"*.

### Étape 0 : Fixer l'adresse IP du serveur
Avant d'installer le DHCP, votre serveur doit passer d'une adresse dynamique à une adresse statique.

> [!IMPORTANT]
> **Le cycle de vie du serveur pour ce TP :**
> 1. **Phase Installation** : On démarre la VM en mode **DHCP**. Elle contacte la **RT-Box** (le serveur de l'IUT qui a Internet) pour obtenir une IP. Cela nous permet de faire un `apt-get install` et de télécharger les dépendances.
> 2. **Phase Serveur** : Une fois les outils installés, on n'a plus besoin de la RT-Box. On fixe alors l'adresse du serveur en **Statique** pour qu'il puisse à son tour distribuer des IPs aux autres.

**Procédure pour fixer l'IP :**
1.  Vérifiez le nom de l'interface réseau : `ip a` (souvent `enp0s3` ou `eth0`).
2.  Configurez l'adresse **`192.31.25.10`**.
    - *Méthode simple* : Utilisez l'interface graphique de la VM.
    - *Méthode terminal* : Modifiez `/etc/network/interfaces` ou utilisez `ip addr add`.
3.  Assurez-vous que l'IP est bien fixée avant de passer à la suite.

---

### A. Service DHCP (ISC-DHCP-Server)

#### 1.1 Installation
```bash
sudo apt-get update && sudo apt-get install isc-dhcp-server
```
> [!NOTE]
> Si vous avez un message d'erreur au démarrage du service juste après l'installation, c'est normal : il n'est pas encore configuré !

#### 1.2 Configuration du fichier `dhcpd.conf`
Édition du fichier de configuration principal : `sudo nano /etc/dhcp/dhcpd.conf`.

**Contenu de la configuration :**
```text
# Options globales
option domain-name "mondomaine.lan";
option domain-name-servers 193.49.62.9;

default-lease-time 600;
max-lease-time 7200;

# Définition du sous-réseau
subnet 192.31.16.0 netmask 255.255.240.0 {
  range 192.31.25.100 192.31.25.200;
  option routers 192.31.25.1; # Adresse de la passerelle (RTBox)
}

# Réservation pour le client spécifique
host rt-client {
  hardware ethernet XX:XX:XX:XX:XX:XX; # <--- Adresse MAC du client
  fixed-address 192.31.25.20;
}
```

> [!TIP]
> **Comprendre `dhcpd.conf` (Le cerveau du réseau) :**
> - `subnet 192.31.16.0 ...` : Définit la zone (le parc) où le serveur a le droit de donner des adresses.
> - `range 192.31.25.100 ...` : **Le sac de billes**. Le serveur pioche une adresse là-dedans pour les inconnus.
> - `option routers ...` : Dit aux clients que pour sortir vers Internet, ils doivent passer par la RT-Box.
> - `host rt-client { ... }` : **Le traitement VIP**. Si le serveur reconnaît cette plaque d'immatriculation physique (MAC), il lui donne toujours la même IP fixe.

#### 1.3 Redémarrage et Vérification
1.  **Interface d'écoute** : Dans `/etc/default/isc-dhcp-server`, ajouter l'interface (ex: `INTERFACESv4="enp0s3"`).
2.  **Relance** : `sudo systemctl restart isc-dhcp-server`
3.  **Vérification** :
    - `systemctl status isc-dhcp-server` (doit être *active*)
    - `ps aux | grep dhcpd` (pour trouver le PID)
    - **Côté Client** : `sudo dhclient -v`. Il doit recevoir l'IP `192.31.25.20`.

---

### B. Service TFTP indépendant (TFTPD-HPA)
Le TFTP est utilisé pour envoyer le noyau Linux au client sans authentification.

#### 2.1 Installation
```bash
sudo apt-get install tftpd-hpa tftp-hpa net-tools
```

#### 2.2 Configuration
1.  **Dossier racine** : `sudo mkdir -p /var/lib/tftpboot`
2.  **Droits** : `sudo chown -R tftp:nogroup /var/lib/tftpboot`
3.  **Fichier de config** : `sudo nano /etc/default/tftpd-hpa`

```text
TFTP_USERNAME="tftp"
TFTP_DIRECTORY="/var/lib/tftpboot"
TFTP_ADDRESS=":69"
TFTP_OPTIONS="--secure --create"
RUN_DAEMON="yes"
```
4.  **Relance** : `sudo systemctl restart tftpd-hpa`

#### 2.3 Tests et validation
- **Vérification du port 69** : `netstat -a | grep tftp`
- **Test de transfert (Put)** :
  ```bash
  # Sur le client
  echo "test pxe" > test.txt
  tftp 192.31.25.10 -c put test.txt
  ```
- **Vérification Serveur** : Le fichier doit apparaître dans `/var/lib/tftpboot/`.


---

## 2. Centralisation avec Dnsmasq (Phase PXE)
Conformément aux exigences du TP, les services isolés ont été coupés au profit de dnsmasq.

### A. Nettoyage des services
```bash
sudo systemctl stop isc-dhcp-server tftpd-hpa
sudo systemctl disable isc-dhcp-server tftpd-hpa
```

> [!WARNING]
> **Alerte Conflit Port 69** : Il est impératif de s'assurer que `tftpd-hpa` est non seulement arrêté mais aussi désactivé (`disable`). Si ce service reste actif, il "vole" le port UDP 69, empêchant `dnsmasq` de distribuer le fichier `pxelinux.0`. Un seul service TFTP peut écouter sur la machine à la fois.

### B. Configuration de dnsmasq
Le fichier `/etc/dnsmasq.conf` a été édité pour gérer simultanément le DHCP et le TFTP :

```text
interface=enp0s3
bind-interfaces
domain=mondomaine.lan
dhcp-range=enp0s3,192.31.25.100,192.31.25.200,255.255.240.0,8h
enable-tftp
tftp-root=/netboot/tftp
dhcp-boot=pxelinux.0
pxe-service=x86PC, "Install OS via PXE", pxelinux
```

> [!TIP]
> **Comprendre `dnsmasq.conf` (L'outil tout-en-un) :**
> - `interface=enp0s3` : Dit au service d'écouter uniquement sur cette carte réseau.
> - `enable-tftp` : La commande magique qui active le serveur de transfert de fichiers intégré.
> - `tftp-root=/netboot/tftp` : Le dossier où sont rangés les fichiers que les clients ont le droit de télécharger.
> - `dhcp-boot=pxelinux.0` : **L'instruction cruciale**. Elle dit au client : *"Une fois que tu as ton IP, télécharge ce fichier pour savoir comment démarrer"*.

### C. Mise en place des fichiers de boot
On crée les dossiers et on copie les fichiers vitaux pour que le PC puisse "réfléchir" au démarrage :

```bash
# On crée le dossier qui va contenir tous les fichiers de boot
sudo mkdir -p /netboot/tftp/pxelinux.cfg
# installation du serveur d'amorçage
sudo apt-get install syslinux pxelinux

# Copie du "cerveau" du boot
sudo cp /usr/lib/PXELINUX/pxelinux.0 /netboot/tftp/

# Copie des modules nécessaires (BIOS)
sudo cp /usr/lib/syslinux/modules/bios/{ldlinux.c32,libcom32.c32,libutil.c32,vesamenu.c32} /netboot/tftp/
```

> [!TIP]
> **Le dossier `/netboot/tftp` (Le vestiaire) :**
> Imagine ce dossier comme un libre-service où le client vient piocher ce dont il a besoin pour s'allumer.
> - `pxelinux.0` : Le programme qui s'exécute en premier. Il affiche le menu de démarrage.
> - `Les fichiers .c32` : Des bibliothèques graphiques. `vesamenu.c32` permet d'afficher un **joli menu en couleur** plutôt qu'un texte brut moche.
> - `pxelinux.cfg/default` : **Le script du menu**. Il dit au client : *"Si l'utilisateur choisit Ubuntu, va chercher le noyau (vmlinuz) dans tel dossier"*.

### D. Lancer dnsmasq
Maintenant que tout est configuré (DHCP, TFTP et fichiers de boot), on démarre le service :

```bash
sudo systemctl restart dnsmasq
sudo systemctl status dnsmasq
```

### La séquence de réveil du client

Voici ce qu'il se passe réellement pour le client une fois que `dnsmasq` est lancé :
1. **Le réveil (DHCP)** : Le client obtient son IP et l'adresse du serveur de boot.
2. **La lecture de la carte (TFTP)** : Il télécharge `pxelinux.0` et les modules `.c32`. C'est là qu'il affiche le menu bleu.
3. **Le choix du moteur (Kernel)** : Quand vous validez "Installer Ubuntu", il télécharge via TFTP le fichier `vmlinuz` (le cœur du système) et l'ouvrir en mémoire vive.
4. **L'appel de la carrosserie (NFS)** : Une fois le noyau lancé, il n'utilise plus le TFTP (trop lent). Il monte le dossier `/netboot/nfs` via le protocole NFS pour accéder aux logiciels et à l'interface graphique.

---

## 3. Déploiement du Système de Fichiers Réseau (NFS)
Le protocole NFS permet au client de charger l'intégralité de l'OS (plusieurs Go) une fois le noyau démarré.

### A. Installation et Partage
```bash
sudo apt-get install nfs-kernel-server
sudo mkdir -p /netboot/nfs/ubuntu1804
```

### B. Configuration des exports
Ajout dans `/etc/exports` pour autoriser le montage réseau :
```text
/netboot/nfs *(ro,sync,no_wdelay,insecure_locks,no_root_squash,insecure,no_subtree_check)
```

**Application :**
```bash
sudo exportfs -ra
sudo systemctl restart nfs-kernel-server
```

### C. NFS et Image ISO (Le "plat principal")
C'est ici qu'on prépare l'OS Ubuntu qui sera envoyé au client.

1.  **Montage du NAS** : `sudo mount -t nfs rt-nas:/srv/nas /srv/nas` (permet de récupérer les sources de l'école).
2.  **Copie des fichiers** : Utilisez les commandes `cp -Rfv` pour remplir `/netboot/nfs/ubuntu1804/` avec le contenu de l'ISO.
3.  **Finalisation** : Une fois les copies terminées, créez le fichier de menu `/netboot/tftp/pxelinux.cfg/default` avec le contenu `label install1` définit dans le TP.

---

## 4. Gestion des sources (Le contournement du NAS)

### Diagnostic de la panne réseau
Avant de basculer sur l'ISO locale, une phase de diagnostic a été menée pour identifier pourquoi le montage du NAS échouait avec l'erreur `Resource temporarily unavailable`. 

Les commandes suivantes ont permis de confirmer que le serveur DNSMasq était prêt, mais que la ressource distante était saturée ou injoignable :
- `ss -tunlp | grep -E ':67|:69|:2049'` : Vérification que les ports DHCP, TFTP et NFS du serveur étaient bien ouverts et écoutés par les bons services.
- `showmount -e rt-nas` : Tentative de lister les exports du serveur distant (échec de réponse).
- `losetup -a` : Vérification qu'aucun périphérique de boucle (loop device) n'était resté bloqué, empêchant un nouveau montage d'ISO.

Suite à l'indisponibilité du serveur `rt-nas` (*Resource temporarily unavailable*), une solution locale via le lecteur optique de VirtualBox a été utilisée.

### A. Montage de l'ISO locale
```bash
# Montage du CD virtuel de la VM
sudo mount /dev/sr0 /mnt
```

### B. Peuplement des arborescences de boot
Extraction du "moteur" (TFTP) et de la "carrosserie" (NFS) :

```bash
# Copie pour le système de fichiers (NFS)
sudo cp -Rfv /mnt/* /netboot/nfs/ubuntu1804/

# Copie du Noyau et de l'Initrd (TFTP)
sudo cp -v /mnt/casper/vmlinuz /netboot/tftp/ubuntu1804/
sudo cp -v /mnt/casper/initrd /netboot/tftp/ubuntu1804/
```

### Plan C : Récupération des fichiers par le Web

Si aucun support (NAS ou ISO) n'est disponible, il est possible de télécharger uniquement le "moteur" de boot directement depuis les dépôts officiels d'Ubuntu pour valider le menu PXE :
```bash
cd /netboot/tftp/ubuntu1804
sudo wget [http://archive.ubuntu.com/ubuntu/dists/bionic-updates/main/installer-amd64/current/images/netboot/ubuntu-installer/amd64/linux](http://archive.ubuntu.com/ubuntu/dists/bionic-updates/main/installer-amd64/current/images/netboot/ubuntu-installer/amd64/linux) -O vmlinuz
sudo wget [http://archive.ubuntu.com/ubuntu/dists/bionic-updates/main/installer-amd64/current/images/netboot/ubuntu-installer/amd64/initrd.gz](http://archive.ubuntu.com/ubuntu/dists/bionic-updates/main/installer-amd64/current/images/netboot/ubuntu-installer/amd64/initrd.gz) -O initrd
```

Cette méthode permet de prouver que le menu PXE et le chargement du Kernel fonctionnent, même sans l'intégralité du système NFS.

---

## 5. Configuration du Bootloader PXE
Le fichier `/netboot/tftp/pxelinux.cfg/default` définit le menu que le client affiche au démarrage.

**Fichier de configuration final :**
```text
default vesamenu.c32
prompt 0
timeout 300
menu title Menu de Boot PXE - R203

label install1
    menu label ^Installer Ubuntu via Reseau
    menu default
    kernel ubuntu1804/vmlinuz
    append initrd=ubuntu1804/initrd ip=192.31.25.20::192.31.25.1:255.255.240.0::enp0s3:off boot=casper netboot=nfs nfsroot=192.31.25.10:/netboot/nfs/ubuntu1804/ splash toram ---
```

> [!IMPORTANT]
> **Note technique** : L'ajout de l'argument `ip=...` est crucial pour stabiliser la connexion NFS et éviter les conflits DHCP lors du basculement du noyau.

---

## 6. Finalisation et Droits
Dernière étape pour garantir qu'aucun service ne bloque l'accès aux fichiers :

```bash
sudo chmod -R 777 /netboot
sudo systemctl restart dnsmasq
```

### Commande de validation ultime
Pour être certain que le serveur est prêt à servir le client, cette commande doit être lancée :
```bash
sudo exportfs -v
```

Résultat attendu : Vous devez voir apparaître la ligne /netboot/nfs avec les options (ro, ...). Si la liste est vide, le client affichera une erreur "NFS mount failed" au démarrage.

---

## ✅ Conclusion
L'infrastructure est fonctionnelle. Le client VirtualBox, configuré avec l'ordre d'amorçage "Réseau" en priorité, récupère son IP, affiche le menu de boot personnalisé, et charge l'OS Ubuntu via les protocoles TFTP et NFS fournis par le serveur.

> [!TIP]
> **État final des services :**
> - 🌐 **DHCP/TFTP** : dnsmasq (Port 67 & 69) — **OK**
> - 📂 **NFS** : nfs-kernel-server (Port 2049) — **OK**
> - 🖥️ **Menu PXE** : vesamenu.c32 — **OK**