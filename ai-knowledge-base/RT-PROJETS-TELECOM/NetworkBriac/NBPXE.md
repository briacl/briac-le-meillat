---
title: "Déploiement Automatique PXE"
module: "R103"
competence: ["Administrer"]
ac_lies: ["AC11.03"]
project_type: "perso"
techs: ["PXE", "DHCP", "TFTP"]
reference_tp: "Inspiré par le TP Serveur de Boot PXE"
date: "2026-06-01"
status: "Terminé"
image: ""
---

# Guide 1 — PXE sur la gateway : déploiement automatique Ubuntu Server par le réseau

But : je crée une VM **sans lui attacher d'ISO**. Au démarrage elle fait sa demande DHCP, reçoit l'adresse du serveur PXE, boote sur l'installeur récupéré par le réseau, et s'installe **toute seule** grâce à un fichier de réponses (autoinstall cloud-init). Zéro clic sur la VM cliente.

Base : principe DHCP + TFTP + PXE du cours R203, posé sur la **gateway Ubuntu réelle** (192.168.50.1) qui fait déjà DHCP (isc-dhcp-server, plage .50.10–.60), Bind9 et NAT. On ajoute 4 briques : **TFTP**, **NFS**, **HTTP** (pour l'autoinstall uniquement), et **2 options DHCP**.

Architecture finale :
```
[VM cliente neuve, sans ISO]
        |  1) DHCP -> Gateway 192.168.50.1
        |       reçoit IP + next-server + filename
        |  2) TFTP -> /srv/tftp (pxelinux.0 + vmlinuz + initrd)
        |  3) NFS  -> /mnt/iso (ISO montée sur le CD de la gateway, zéro copie)
        |       casper monte la racine live depuis l'ISO
        |  4) HTTP -> /var/www/html/autoinstall/ (user-data + meta-data)
        |       cloud-init lit les réponses et installe sans intervention
        v
   Ubuntu 22.04 LTS installé, reboot sur disque
```

Rappel des pièges connus :
- `authoritative` (pas `authorative`), `option routers` (pas `options routers`) dans dhcpd.conf.
- Clavier Mac AZERTY sans `|` en console : toutes les commandes ci-dessous sont **sans pipe**.
- Le mdp dans `user-data` doit être un **hash SHA-512** (pas en clair) — voir étape 6.

---

## Lien avec le TP R203 (et les 3 écarts assumés)

Le TP suit la chaîne : **DHCP** → **TFTP** (`pxelinux.0` + menu) → **source** (NFS/ISO). On garde exactement cette chaîne. Trois choses changent :

**Écart 1 — On ne bascule PAS sur dnsmasq.**
Dans le TP la phase 2 remplace `isc-dhcp-server` + `tftpd-hpa` par dnsmasq. Sur la gateway c'est impossible : dnsmasq entrerait en conflit avec Bind9 et doublonnerait isc-dhcp-server. On reste sur les services isolés du TP (sections A + B), auxquels on ajoute juste les options PXE.

**Écart 2 — Pas de `toram`, autoinstall au lieu de live.**
Le TP boote un système live via NFS (`boot=casper netboot=nfs nfsroot=... toram`) où il faut cliquer. Ici on ajoute `autoinstall ds=nocloud-net;s=http://...` : cloud-init répond à toutes les questions automatiquement. La VM s'installe seule sur son disque et reboot dessus.

**Écart 3 — On ne recopie PAS l'ISO.**
Le TP fait `cp -Rfv /mnt/* /netboot/nfs/...` et duplique tout l'ISO. Ici l'ISO est **montée depuis le lecteur CD ESXi** et exportée directement en NFS depuis `/mnt/iso`. Zéro octet copié sur le disque de la gateway (hors vmlinuz + initrd ~100 Mo).

---

## Étape 0 — Firmware de la VM cliente : BIOS

Pour ce guide, la VM cliente est en **BIOS** (legacy). C'est la méthode du cours R203 (`pxelinux.0`), sans couche shim/GRUB EFI.

Dans ESXi → la future VM cliente → Modifier → Options de la VM → Options de démarrage → Firmware → **BIOS**.

> Piège : si ta VM gateway a le CD/DVD en premier dans l'ordre de boot, elle va booter sur l'ISO au lieu de son Ubuntu existant. Avant de monter l'ISO sur la gateway, vérifier l'ordre de boot de la gateway et s'assurer que le **disque dur est en premier**. Si l'ordre n'est pas modifiable depuis l'interface ESXi, cocher "Forcer la configuration du BIOS" pour entrer dans le BIOS de la VM au prochain démarrage et réordonner manuellement.

---

## Étape 1 — Monter l'ISO Ubuntu Server sur la gateway (sans la copier)

Dans ESXi, sur la VM **gateway** :
- Modifier → Ajouter un périphérique → Lecteur CD/DVD.
- Type : Fichier ISO banque de données → choisir `ubuntu-22.04-live-server-amd64.iso`.
- Cocher **Connecter** et **Connecter lors de la mise sous tension**.

Sur la gateway (SSH depuis le Mac) :
```
mkdir -p /mnt/iso
mount /dev/sr0 /mnt/iso
ls /mnt/iso/casper/
```
Tu dois voir `vmlinuz`, `initrd`, et les fichiers `.squashfs`. L'ISO est lue depuis le CD — elle ne consomme **pas** le disque de la gateway.

> Note : `mount` affiche `WARNING: source write-protected, mounted read-only` → c'est normal, un CD est en lecture seule.

---

## Étape 2 — Serveur TFTP

```
apt update
apt install tftpd-hpa
```
Éditer `/etc/default/tftpd-hpa` :
```
TFTP_USERNAME="tftp"
TFTP_DIRECTORY="/srv/tftp"
TFTP_ADDRESS=":69"
TFTP_OPTIONS="--secure"
```
- `TFTP_DIRECTORY` : dossier racine servi en TFTP. Le client ne peut accéder qu'à ce dossier (`--secure`).

```
mkdir -p /srv/tftp
systemctl restart tftpd-hpa
systemctl enable tftpd-hpa
```

---

## Étape 3 — Copier le noyau + initrd depuis le CD (~100 Mo, seule copie)

```
cp /mnt/iso/casper/vmlinuz /srv/tftp/vmlinuz
cp /mnt/iso/casper/initrd  /srv/tftp/initrd
```

---

## Étape 4 — Bootloader dans /srv/tftp (BIOS)

```
apt install pxelinux syslinux-common
cp /usr/lib/PXELINUX/pxelinux.0 /srv/tftp/
cp /usr/lib/syslinux/modules/bios/ldlinux.c32 /srv/tftp/
mkdir -p /srv/tftp/pxelinux.cfg
```
- `pxelinux.0` : premier fichier chargé par la VM via TFTP, lit ensuite `pxelinux.cfg/default`.
- `ldlinux.c32` : bibliothèque requise par pxelinux.

---

## Étape 5 — Config du menu de boot

Créer `/srv/tftp/pxelinux.cfg/default` :
```
DEFAULT ubuntu
PROMPT 0
TIMEOUT 50

LABEL ubuntu
    KERNEL vmlinuz
    APPEND initrd=initrd ip=dhcp boot=casper netboot=nfs nfsroot=192.168.50.1:/mnt/iso autoinstall ds=nocloud-net;s=http://192.168.50.1/autoinstall/ ---
```
Ligne par ligne :
- `ip=dhcp` : le kernel reprend une IP en DHCP après le boot. **Obligatoire** : sans ça le réseau n'est pas configuré au niveau kernel et NFS est injoignable.
- `boot=casper netboot=nfs` : dit à l'initrd de monter la racine live via NFS.
- `nfsroot=192.168.50.1:/mnt/iso` : l'ISO montée sur la gateway, exportée en NFS (étape 6).
- `autoinstall` : active Subiquity en mode sans interaction.
- `ds=nocloud-net;s=http://192.168.50.1/autoinstall/` : où chercher `user-data` + `meta-data`.
- `---` : séparateur pxelinux, ce qui suit va au kernel, pas à l'initrd.

> Piège critique : `initrd=initrd` avec un **signe égal**, pas un tiret. `initrd-initrd` ne transmet pas le fichier initrd au kernel → kernel panic immédiat.

---

## Étape 6 — Serveur NFS : exporter l'ISO montée

```
apt install nfs-kernel-server
```

Éditer `/etc/exports`, ajouter :
```
/mnt/iso 192.168.50.0/24(ro,sync,no_subtree_check,no_root_squash,fsid=1)
```
- `ro` : lecture seule.
- `fsid=1` : obligatoire pour exporter un système de fichiers iso9660, sinon NFS refuse.
- `no_root_squash` : le client peut accéder en tant que root (nécessaire pour casper).

```
exportfs -ra
systemctl restart nfs-kernel-server
exportfs -v
```
Tu dois voir `/mnt/iso` listé avec ses options.

---

## Étape 7 — Serveur HTTP : fichier autoinstall uniquement

Apache sert **uniquement** le dossier `autoinstall/` (user-data + meta-data). Il ne sert plus la source d'install (c'est NFS qui s'en charge).

```
apt install apache2
mkdir -p /var/www/html/autoinstall
```

Créer `/var/www/html/autoinstall/meta-data` (vide, mais obligatoire) :
```
touch /var/www/html/autoinstall/meta-data
```

Créer `/var/www/html/autoinstall/user-data` avec la here-doc :
```
cat > /var/www/html/autoinstall/user-data << 'ENDFILE'
#cloud-config
autoinstall:
  version: 1
  locale: fr_FR.UTF-8
  keyboard:
    layout: fr
    variant: mac
  identity:
    hostname: poste-ubuntu
    username: bribri
    password: $6$REMPLACER_PAR_LE_HASH
  ssh:
    install-server: true
  storage:
    layout:
      name: direct
  late-commands: []
ENDFILE
```

**Le mot de passe doit être un hash SHA-512**, pas un mdp en clair. Un mdp en clair peut foirer silencieusement selon la façon dont cloud-init interprète le YAML. Générer le hash sur la gateway :
```
openssl passwd -6
```
Il demande le mdp au clavier, affiche `$6$...`. Recopier ce hash dans le champ `password` **sans guillemets**.

```
systemctl restart apache2
```

---

## Étape 8 — Options DHCP : pointer vers le PXE

Éditer `/etc/dhcp/dhcpd.conf`.

**En haut du fichier** (hors subnet) :
```
option arch code 93 = unsigned integer 16;
```

**Dans le bloc `subnet 192.168.50.0 ...`** :
```
    next-server 192.168.50.1;

    if option arch = 00:07 {
        filename "bootx64.efi";
    } elsif option arch = 00:09 {
        filename "bootx64.efi";
    } else {
        filename "pxelinux.0";
    }
```
- `next-server 192.168.50.1` : adresse du serveur TFTP = la gateway. Option 66.
- `option arch` : `00:07`/`00:09` = UEFI x64 → `bootx64.efi` ; sinon BIOS → `pxelinux.0`. Gère les deux firmwares automatiquement.
- Le reste du subnet doit rester intact : `authoritative;`, `option routers 192.168.50.1;`, `range 192.168.50.10 192.168.50.60;`, `option domain-name-servers 192.168.50.1;`.

```
systemctl restart isc-dhcp-server
systemctl status isc-dhcp-server
```

---

## Étape 9 — Pare-feu nftables

UDP/69 (TFTP), TCP/80 (HTTP) et TCP/2049 (NFS) depuis le réseau .50.x. Si `iifname "ens160" accept` est déjà dans la chain input → **rien à faire**, tout est déjà autorisé. Sinon ajouter :
```
nft add rule inet filter input iifname "ens160" udp dport 69 accept
nft add rule inet filter input iifname "ens160" tcp dport 80 accept
nft add rule inet filter input iifname "ens160" tcp dport 2049 accept
```
Rendre persistant dans `/etc/nftables.conf`.

---

## Étape 10 — Créer la VM cliente et tester

ESXi → Créer une VM :
- Aucun lecteur CD/ISO.
- Carte réseau sur le switch interne `briac_network`.
- Ordre de démarrage : **carte réseau en premier**.
- Firmware : **BIOS**.
- Ressources : 2 CPU / 2 Go RAM / 16 Go disque.

Séquence attendue :
1. DHCP → IP 192.168.50.x + next-server + filename.
2. TFTP → `pxelinux.0` + `vmlinuz` + `initrd`.
3. Kernel démarre, reprend une IP en DHCP (`ip=dhcp`).
4. NFS → monte `/mnt/iso` depuis la gateway (l'ISO en direct).
5. HTTP → cloud-init récupère `user-data` + `meta-data`.
6. Subiquity partitionne le disque, déploie l'image, configure l'identité.
7. Reboot sur le disque → Ubuntu 22.04 LTS installé, login `bribri` avec le mdp choisi.

---

## Piège classique : la boucle de réinstallation

Après l'install, la VM redémarre, repart en PXE et réinstalle en boucle. Solution : remettre **le disque en premier** dans l'ordre de boot ESXi après la 1ère install réussie.

---

## Récap des fichiers touchés sur la gateway

| Fichier | Rôle |
|---|---|
| `/etc/default/tftpd-hpa` | racine TFTP = /srv/tftp |
| `/srv/tftp/pxelinux.0` + `ldlinux.c32` | bootloader BIOS |
| `/srv/tftp/vmlinuz` + `initrd` | noyau + initrd (copiés du CD, ~100 Mo) |
| `/srv/tftp/pxelinux.cfg/default` | menu de boot + paramètres kernel |
| `/etc/exports` | export NFS de /mnt/iso |
| `/var/www/html/autoinstall/user-data` + `meta-data` | réponses cloud-init |
| `/etc/dhcp/dhcpd.conf` | next-server + filename (options 66/67) |

Une fois ça validé, toute la plomberie PXE est en place : c'est la fondation réutilisée dans les guides 2 (Windows/WDS) et 3 (dual boot).
