---
title: "Virtualisation ESXi - Infrastructure St Bernard"
module: "R103"
competence: ["Administrer"]
ac_lies: ["AC11.01"]
project_type: "perso"
techs: ["ESXi", "Virtualisation"]
reference_tp: "Inspiré par les SAEs et TPs de Virtualisation"
date: "2026-06-01"
status: "Terminé"
image: ""
---

# Créer une VM Ubuntu Server Gateway sur VMware ESXi Roubaix - v05072026

stbernard : VMWare-NB-us-gtw

## Objectif

Créer une VM Ubuntu 22.04 LTS Server avec 2 cartes réseau qui remplace NBWS comme Gateway du réseau 192.168.50.0/24 :
- **NIC 1** (ens192) : bridge sur le réseau 192.168.168.x du datacenter Roubaix (uplink)
- **NIC 2** (ens160) : réseau interne NetworkBriac 192.168.50.0/24 (downlink)

Cette VM est la **RT-Box Roubaix** — on l'allume, on configure les services nécessaires, et elle route le lab entier.

---

## Prérequis

- Accès VPN à BIGWALL depuis chez toi
- Accès à l'UI web ESXi (fourni par papa)
- ISO Ubuntu 22.04 LTS Server disponible dans le datastore ESXi (`ISO/ubuntu-22.04-live-server-amd64.iso`)

---

## Partie 1 : Créer la VM dans ESXi

### Étape 1.1 – Créer une nouvelle VM

Dans l'UI ESXi :
```
Actions → Créer/enregistrer une machine virtuelle
```

Choisis : **Créer une machine virtuelle**

### Étape 1.2 – Nom et OS

- **Nom** : `VMWare-NB-us-gtw`
- **Famille de SE invité** : Linux
- **Version du SE invité** : Ubuntu Linux (64 bits)

### Étape 1.3 – Ressources

- **CPU** : 2 vCPU
- **RAM** : 2 Go (suffisant pour une Gateway en labo)
- **Disque** : 16 Go, Thin Provision

### Étape 1.4 – Réseau

Ajoute **une seule NIC pour l'instant** :
- **Réseau** : `briac_network`
- **Connecter lors de la mise sous tension** : coché ✓

> **Important** : N'ajoute pas la 2e NIC maintenant. Tu l'ajouteras après l'installation pour éviter les conflits de boot PXE.

### Étape 1.5 – ISO CD-ROM

- **Lecteur CD/DVD** : Fichier ISO banque de données
- **ISO** : `ISO/ubuntu-22.04-live-server-amd64.iso`
- **Connecté** : coché ✓
- **Connecter lors de la mise sous tension** : coché ✓

> **Attention** : Vérifier absolument que "Connecter lors de la mise sous tension" est coché sur le lecteur CD/DVD, sinon la VM ne bootera pas sur l'ISO.

### Étape 1.6 – Firmware BIOS

Dans **Options VM → Options de démarrage** :
- **Microprogramme** : BIOS (pas UEFI)
- **Forcer la configuration du BIOS** : décoché (laisser décoché)

Click **Finish**.

---

## Partie 2 : Boot et installation Ubuntu Server

### Étape 2.1 – Power On

Sélectionne la VM → **Mettre sous tension**.

Ouvre la console ESXi (onglet Console).

> Si la VM fait du PXE boot (cherche un OS sur le réseau) au lieu de booter sur le CD-ROM : vérifie que "Connecter lors de la mise sous tension" est bien coché sur le lecteur CD/DVD dans les paramètres de la VM.

### Étape 2.2 – Installation Ubuntu Server

Suis les étapes :

- **Langue** : English
- **Clavier** : French (AZERTY)
- **Réseau** : Skip (pas de 2e NIC encore, on configure après)
- **Proxy** : aucun
- **Stockage** : Use entire disk, LVM, pas d'encryption
- **Profil utilisateur** :
  - Nom machine : `vmware-nb-us-gtw`
  - Nom d'utilisateur : `briacl`
  - Password : (note-le)
- **SSH** : coché "Install OpenSSH server" ✓
- **Snaps** : aucun

Click **Install**. L'installation prend 10-30 min (inclut le téléchargement des security updates).

### Étape 2.3 – Reboot

À la fin, le système affiche :
```
Please remove the installation medium, then press ENTER
```

Appuie sur **ENTER**. Ubuntu redémarre sur le disque.

> Le message `[FAILED] Failed unmounting /cdrom` est normal, ignore-le.

---

## Partie 3 : Post-install — Ajout de la 2e NIC

### Étape 3.1 – Arrêter la VM

Une fois Ubuntu booté et le prompt de login visible, arrête la VM proprement :
```
Actions → Mettre hors tension
```

### Étape 3.2 – Ajouter la 2e NIC

Dans **Modifier les paramètres → Matériel virtuel** :
- Click **Ajouter un périphérique → Adaptateur réseau**
- **Réseau** : `Internal SCTG VPN Network` (le switch interne 192.168.50.x)
- **Connecter lors de la mise sous tension** : coché ✓

Enregistre et redémarre la VM.

---

## Partie 4 : Configuration réseau (Netplan)

### Étape 4.1 – Login et vérification des interfaces

Login : `briacl` / ton mot de passe.

Vérifie les interfaces :
```bash
ip a
```

Tu dois voir :
- **lo** : loopback
- **ens192** : IP DHCP 192.168.168.x (uplink bridge Roubaix) — UP
- **ens160** : pas d'IP (réseau interne, futur downlink) — UP sans IP

> Les noms exacts peuvent varier. Sur cette VM : ens192 = bridge Roubaix, ens160 = réseau interne.

### Étape 4.2 – Configurer Netplan

Lis la config actuelle :
```bash
cat /etc/netplan/*.yaml
```

Édite :
```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

**Config finale :**

```yaml
network:
  version: 2
  ethernets:
    ens192:
      dhcp4: true
    ens160:
      dhcp4: false
      optional: true
      addresses:
        - 192.168.50.1/24
```

- **ens192** : DHCP depuis le réseau Roubaix (reçoit une IP du DHCP de papa)
- **ens160** : IP statique 192.168.50.1/24 (c'est la Gateway du réseau interne)

Sauvegarde (Ctrl+O, Enter, Ctrl+X) et applique :

```bash
sudo netplan apply
```

Vérifie :
```bash
ip a
```

- ens192 → 192.168.168.x ✓
- ens160 → 192.168.50.1/24 ✓

### Étape 4.3 – Clavier en français (si besoin)

Si les caractères ne correspondent pas à ton clavier AZERTY Mac :
```bash
sudo loadkeys fr
```

> Note : `sudo loadkeys fr` est temporaire (jusqu'au reboot). Pour le rendre permanent, utilise `sudo dpkg-reconfigure keyboard-configuration`.

---

## Partie 5 : Configurer la Gateway

### Étape 5.1 – IP Forwarding

Active le routage IPv4 de façon persistante :
```bash
echo 'net.ipv4.ip_forward=1' > /tmp/ip-forward.conf && sudo cp /tmp/ip-forward.conf /etc/sysctl.d/99-ip-forward.conf
```

Vérifie :
```bash
sysctl net.ipv4.ip_forward
```

Doit retourner `net.ipv4.ip_forward = 1`.

### Étape 5.2 – nftables (NAT + Firewall)

Édite le fichier de règles :
```bash
sudo nano /etc/nftables.conf
```

**Config complète :**

```bash
#!/usr/sbin/nft -f
flush ruleset

table inet filter {
    chain input {
        type filter hook input priority filter; policy drop;
        iifname "lo" accept
        ct state established,related accept
        iifname "ens160" accept
        iifname "ens192" tcp dport 22 accept
    }
    chain forward {
        type filter hook forward priority filter; policy accept;
    }
}

table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat; policy accept;
        oifname "ens192" masquerade
    }
}
```

**Explication des règles :**

- `flush ruleset` : vide toutes les règles existantes
- `chain input policy drop` : par défaut tout est rejeté en entrée
- `iifname "lo" accept` : autorise le loopback (localhost)
- `ct state established,related accept` : autorise les réponses aux connexions déjà établies
- `iifname "ens160" accept` : autorise tout depuis le réseau interne (LAN)
- `iifname "ens192" tcp dport 22 accept` : autorise SSH depuis l'uplink
- `chain forward policy accept` : autorise le forwarding (routage entre les 2 interfaces)
- `oifname "ens192" masquerade` : NAT — masque les IPs internes derrière l'IP publique de ens192

Applique et active au démarrage :
```bash
sudo nft -f /etc/nftables.conf
sudo systemctl enable nftables
```

### Étape 5.3 – isc-dhcp-server

Installe :
```bash
sudo apt install isc-dhcp-server -y
```

Configure l'interface d'écoute :
```bash
sudo nano /etc/default/isc-dhcp-server
```

Modifie la ligne :
```
INTERFACESv4="ens160"
INTERFACESv6=""
```

Configure le DHCP :
```bash
sudo nano /etc/dhcp/dhcpd.conf
```

**Config :**
```
default-lease-time 600;
max-lease-time 7200;
authoritative;

subnet 192.168.50.0 netmask 255.255.255.0 {
    range 192.168.50.10 192.168.50.60;
    option routers 192.168.50.1;
    option domain-name-servers 192.168.50.1;
}
```

> **Attention aux fautes fréquentes :**
> - `authoritative` (pas `authorative`)
> - `option routers` (pas `options routers`)

Active et démarre :
```bash
sudo systemctl enable isc-dhcp-server
sudo systemctl restart isc-dhcp-server
sudo systemctl status isc-dhcp-server
```

Doit afficher `active (running)`.

En cas d'erreur, consulte les logs :
```bash
journalctl -u isc-dhcp-server --no-pager -n 30
```

### Étape 5.4 – Bind9 (DNS forwarder pour networkbriac.local)

La gateway doit forwarder les requêtes DNS `networkbriac.local` vers NBWS (192.168.50.10). Sans ça, les clients ne peuvent pas résoudre le domaine AD et la jonction au domaine échoue.

Installe :
```bash
sudo apt install bind9 bind9-utils -y
```

Configure la zone forward :
```bash
sudo nano /etc/bind/named.conf.local
```

Ajoute à la fin :
```
zone "networkbriac.local" {
    type forward;
    forwarders { 192.168.50.10; };
    forward only;
};
```

Configure les options globales :
```bash
sudo nano /etc/bind/named.conf.options
```

Dans le bloc `options { }`, modifie ou ajoute :
```
dnssec-validation no;
listen-on { any; };
```

> **Critique — `dnssec-validation no` :** Windows Server DNS ne signe pas ses réponses avec DNSSEC. Sans cette ligne, Bind9 retourne SERVFAIL sur toutes les requêtes forwardées vers NBWS car il considère les réponses comme invalides.

> **`listen-on { any; }` :** par défaut Bind9 n'écoute que sur 127.0.0.1. Sans cette ligne, les clients du réseau interne ne peuvent pas l'interroger.

Vérifie la syntaxe :
```bash
sudo named-checkconf
```

Active et redémarre :
```bash
sudo systemctl enable bind9
sudo systemctl restart bind9
sudo systemctl status bind9
```

Vérification depuis la gateway :
```bash
nslookup NBWS.networkbriac.local 127.0.0.1
```

Doit retourner `192.168.50.10`.

Vérification depuis un client Windows :
```
nslookup NBWS.networkbriac.local
```

Doit retourner `192.168.50.10` via 192.168.50.1.

---

## Partie 6 : Vérification finale

Depuis un client sur le réseau 192.168.50.x (ex: NBWS) :

```
ping 192.168.50.1                    → Gateway joignable ✓
ping 8.8.8.8                         → Routage Internet ✓
ping google.com                      → DNS Internet fonctionnel ✓
nslookup NBWS.networkbriac.local     → 192.168.50.10 (DNS AD fonctionnel) ✓
```

Depuis la Gateway :
```bash
ping 8.8.8.8             → Internet via ens192 ✓
ping 192.168.50.10       → NBWS joignable ✓
nslookup NBWS.networkbriac.local 127.0.0.1   → 192.168.50.10 ✓
```

---

## Récapitulatif architecture

```
Internet/Roubaix
      │
   ens192 (192.168.168.x DHCP)
      │
  [vmware-nb-us-gtw]
  - nftables NAT
  - isc-dhcp-server (192.168.50.10–60)
  - Bind9 (forward networkbriac.local → 192.168.50.10)
      │
   ens160 (192.168.50.1/24 statique)
      │
  Switch briac_network
      │
  ┌───┴───┐
 NBWS   Clients
192.168.50.10  192.168.50.12+
```

---

## Troubleshooting

### PXE boot au lieu du CD-ROM
"Connecter lors de la mise sous tension" n'est pas coché sur le lecteur CD/DVD. Vérifier dans Edit Settings.

### isc-dhcp-server failed
Vérifier les logs :
```bash
journalctl -u isc-dhcp-server --no-pager -n 30
```
Erreurs fréquentes : faute de frappe dans `authoritative` ou `option routers`, ou interface mal configurée dans `/etc/default/isc-dhcp-server`.

### Bind9 retourne SERVFAIL sur networkbriac.local
Cause la plus fréquente : `dnssec-validation auto` dans `named.conf.options`. Windows Server DNS ne signe pas ses réponses, Bind9 les rejette. Solution : `dnssec-validation no`.

### Bind9 écoute mais les clients ne peuvent pas l'interroger
Vérifier que `listen-on { any; }` est présent dans `named.conf.options`. Par défaut Bind9 n'écoute que sur 127.0.0.1.

### Ping ne passe pas entre 2 VMs
Vérifier que les 2 VMs sont bien connectées au même switch virtuel ESXi, et qu'une seule carte réseau est active sur chaque VM (pas de conflit d'IP entre plusieurs cartes).

### chain forward policy drop
Si le forwarding ne fonctionne pas, vérifier que `chain forward` a bien `policy accept` dans nftables. Avec `policy drop`, les paquets des clients ne sont pas routés vers l'uplink.

### Clavier AZERTY — caractères manquants
Le `|` n'est pas disponible sur tous les layouts. Contournement :
```bash
echo 'texte' > /tmp/fichier.conf && sudo cp /tmp/fichier.conf /chemin/destination
```
