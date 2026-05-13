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

## 🛠 1. Préparation de l'environnement et services isolés
Avant la centralisation, les briques de base ont été validées individuellement.

### A. Service DHCP (ISC-DHCP-Server)
Le serveur a été configuré pour distribuer des adresses dans la plage `192.31.25.100` à `192.31.25.200`.

**Commande de vérification (Client) :**
```bash
ip a
```
> [!NOTE]
> **Résultat** : Attribution confirmée de l'IP `192.31.25.14`.

### B. Service TFTP indépendant (TFTPD-HPA)
Utilisé pour valider le transfert de fichiers avant l'intégration dans dnsmasq.

**Commandes de gestion (Serveur) :**
```bash
sudo systemctl start tftpd-hpa
ls -l /var/lib/tftpboot/test-tp.txt
```

---

## 2. Centralisation avec Dnsmasq (Phase PXE)
Conformément aux exigences du TP, les services isolés ont été coupés au profit de dnsmasq.

### A. Nettoyage des services
```bash
sudo systemctl stop isc-dhcp-server tftpd-hpa
sudo systemctl disable isc-dhcp-server tftpd-hpa
```

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

---

## 4. Gestion des sources (Le contournement du NAS)
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

---

## ✅ Conclusion
L'infrastructure est fonctionnelle. Le client VirtualBox, configuré avec l'ordre d'amorçage "Réseau" en priorité, récupère son IP, affiche le menu de boot personnalisé, et charge l'OS Ubuntu via les protocoles TFTP et NFS fournis par le serveur.

> [!TIP]
> **État final des services :**
> - 🌐 **DHCP/TFTP** : dnsmasq (Port 67 & 69) — **OK**
> - 📂 **NFS** : nfs-kernel-server (Port 2049) — **OK**
> - 🖥️ **Menu PXE** : vesamenu.c32 — **OK**