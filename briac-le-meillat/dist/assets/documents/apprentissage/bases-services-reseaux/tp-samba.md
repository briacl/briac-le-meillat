---
title: "Interopérabilité des Systèmes : Samba, CUPS, Webmin & Rsync"
module: "R203"
competence: "Administrer"
ac_lies: ["AC11.01", "AC11.02"]
techs: ["Samba", "CUPS", "Webmin", "Rsync", "SSH"]
date: "2026-06-01"
status: "Terminé"
---

# Compte-Rendu Technique : Interopérabilité des Systèmes (Samba, CUPS, Webmin)
> **R203 — Administration Réseau** — *Briac Le Meillat*

Ce compte-rendu détaille la mise en place d'un réseau hybride fonctionnel permettant le partage de fichiers et de périphériques (imprimantes) entre des machines Linux (Ubuntu) et Windows 10, tout en sécurisant les accès et en automatisant les sauvegardes.

---

## 🎯 Introduction et Topologie
Ce TP repose sur une architecture composée de trois machines virtuelles (VM) configurées sur le même sous-réseau :

*   🖥️ **Serveur Linux (Ubuntu)** : `192.31.25.12` (Héberge les partages Samba, l'imprimante CUPS et l'interface de gestion Webmin).
*   💻 **Client Windows 10** : `192.31.25.18` (Accède aux partages du serveur et partage un dossier en retour).
*   🐧 **Client Linux (Ubuntu)** : Accède au partage Windows.

---

## 🖨️ 1. Serveur d'impression (CUPS)

### A. Le concept
Linux ne gère pas les imprimantes de la même façon que Windows. Il utilise un "chef d'orchestre" appelé **CUPS** (*Common UNIX Printing System*). L'objectif est d'installer une imprimante sur notre serveur Linux et de restreindre son utilisation à notre seul réseau local pour des raisons de sécurité.

> [!TIP]
> **Pourquoi CUPS ?**
> CUPS permet de transformer n'importe quel ordinateur sous Linux en un serveur d'impression réseau capable d'accepter des travaux d'impression depuis n'importe quel type de client (Windows, macOS, Linux).

---

### B. Exécution technique

#### 1.1 Installation et configuration graphique
1.  **Ajout de l'imprimante** : Depuis l'interface graphique des paramètres d'Ubuntu, nous avons ajouté l'imprimante réseau (modèle de la salle : **Oki-C710**).
2.  **Restriction des accès** : Dans les propriétés avancées de l'imprimante, l'accès a été restreint pour n'autoriser que les machines appartenant au sous-réseau **`192.31.25.0/24`**.

#### 1.2 Vérification en ligne de commande
Pour s'assurer du bon fonctionnement de l'imprimante et de son état :
```bash
# Permet de voir l'état de la file d'attente de l'imprimante
lpq
```

#### 1.3 Fichiers de configuration et logs
Les modifications effectuées graphiquement modifient directement les fichiers système suivants :
*   📄 **`/etc/cups/printers.conf`** : Contient la définition et l'état des imprimantes installées.
*   📄 **`/etc/cups/cupsd.conf`** : Gère les directives d'accès et les règles de sécurité du serveur CUPS.

> [!NOTE]
> **Suivi et diagnostic (Logs) :**
> En cas de dysfonctionnement, l'historique et les erreurs sont tracés en temps réel dans :
> *   `access_log` : `/var/log/cups/access_log` (Qui a imprimé quoi ?)
> *   `error_log` : `/var/log/cups/error_log` (Pourquoi ça n'a pas imprimé ?)

---

## 🤝 2. Installation et Configuration de Samba

### A. Le concept
Windows et Linux ne parlent pas la même langue nativement pour s'échanger des fichiers. **Samba** est le "traducteur universel". Il permet à Linux de comprendre et d'utiliser le protocole **SMB/CIFS** de Microsoft. Grâce à lui, notre serveur Linux va apparaître comme par magie dans l'onglet "Réseau" d'un PC Windows.

> [!TIP]
> **Deux services clés :**
> - **smbd** : Gère les transferts de fichiers et le partage d'imprimantes.
> - **nmbd** : S'occupe de la résolution de noms NetBIOS (permettant de trouver le serveur par son nom `Serveur10` plutôt que son IP).

---

### B. Exécution technique

#### 2.1 Installation des paquets
```bash
sudo apt-get update && sudo apt-get install samba smbclient -y
```

#### 2.2 Configuration globale du fichier `smb.conf`
Le fichier de configuration principal est `/etc/samba/smb.conf`. Nous l'avons configuré pour définir le groupe de travail, le nom NetBIOS et limiter l'accès à notre réseau local.

**Configuration ajoutée dans `/etc/samba/smb.conf` :**
```ini
[global]
   workgroup = RT10
   netbios name = Serveur10
   server string = Serveur samba 10
   hosts allow = 192.31.25.
   wins support = yes
```

> [!IMPORTANT]
> **Décryptage de la configuration globale :**
> - `workgroup = RT10` : Aligne notre groupe de travail avec celui du client Windows.
> - `hosts allow = 192.31.25.` : Sécurise le serveur en limitant l'accès au seul réseau `192.31.25.0/24`.
> - `wins support = yes` : Permet au serveur de résoudre les noms d'hôtes locaux.

#### 2.3 Vérification des erreurs de syntaxe
Avant de redémarrer, il est vital de valider la structure du fichier de configuration :
```bash
# Commande indispensable pour valider la syntaxe sans erreur
testparm
```

#### 2.4 Redémarrage et tests de bon fonctionnement
Une fois la configuration validée, nous redémarrons les démons et listons les partages actifs :
```bash
# Redémarrage des deux démons Samba
sudo systemctl restart smbd nmbd

# Test de listing local des partages Samba
smbclient -L localhost
```

---

## 📁 3. Partage de Fichiers Bilatéral

### A. Le concept
Une fois Samba actif, il faut déclarer quels dossiers nous souhaitons partager, de quelle façon (lecture seule ou écriture), et à quels utilisateurs. Nous avons mis en place un **partage bilatéral** :
1.  **Linux ➔ Windows** : Partage d'un dossier public et des répertoires personnels.
2.  **Windows ➔ Linux** : Montage d'un dossier Windows distant sur l'arborescence Linux.

---

### B. 3.1 Partage depuis le Serveur Linux vers le Client Windows

#### 1. Création de l'utilisateur système et Samba
Samba a sa propre base de données d'utilisateurs. On doit d'abord créer l'utilisateur sur le système Linux, puis lui attribuer un mot de passe Samba :
```bash
# Ajout de l'utilisateur sur la VM Linux
sudo adduser user5

# Liaison de l'utilisateur à la base Samba avec mot de passe
sudo smbpasswd -a user5
```

#### 2. Configuration des partages dans `smb.conf`
Nous avons activé la section par défaut `[homes]` (qui partage automatiquement le `/home/utilisateur` de façon sécurisée) et créé un partage public en lecture seule pointant vers `/opt`.

**Configuration du partage `/opt` dans `/etc/samba/smb.conf` :**
```ini
[Dossier_Opt]
   comment = Dossier public
   path = /opt
   browseable = yes
   guest ok = yes
   read only = yes
```

*   **Résultat** : Depuis l'explorateur Windows, en tapant **`\\192.31.25.12`** dans la barre d'adresse, on accède directement aux dossiers partagés de Linux !

---

### C. 3.2 Partage depuis le Client Windows vers le Client Linux

> [!WARNING]
> **Le piège des droits Windows :**
> Partager un dossier Windows "sans mot de passe" nécessite deux étapes de sécurité souvent oubliées :
> 1.  Désactiver le *"partage protégé par mot de passe"* dans le Centre Réseau et Partage de Windows.
> 2.  Assurer que l'onglet **Sécurité** (droits NTFS) du dossier autorise l'accès en lecture/écriture à l'utilisateur **"Tout le monde"** (*Everyone*).

#### 1. Installation des prérequis côté client Linux
*Note : Les options d'installation prennent en compte le contournement du proxy réseau de l'IUT.*
```bash
sudo apt-get update
sudo apt-get install smbclient cifs-utils --fix-missing -y
```

#### 2. Montage réseau du dossier Windows
Pour monter la ressource Windows dans le système de fichiers Linux :
```bash
# Création du point de montage
sudo mkdir -p /mnt/partagewin

# Commande de montage CIFS
sudo mount -t cifs //192.31.25.18/PartageWindows /mnt/partagewin -o username=guest,password=
```

> [!IMPORTANT]
> **Pourquoi `username=guest` ?**
> Même pour un partage public "sans mot de passe", les versions récentes de Windows 10 rejettent catégoriquement les connexions 100% anonymes (null sessions). L'argument `-o username=guest` force Windows à accepter la connexion sans requérir de mot de passe réel.

*   **Résultat et validation** : La commande `ls -l /mnt/partagewin` affiche parfaitement le fichier `ligne42.txt` initialement créé sur l'OS Windows.

---

## 🖨️ 4. Partage d'Imprimantes (Linux vers Windows)

### A. Le concept
L'imprimante configurée localement sur le serveur avec CUPS (Partie 1) doit maintenant être distribuée à l'ensemble du parc via Samba pour que les clients Windows puissent imprimer dessus de façon transparente.

---

### B. Exécution technique

#### 4.1 Configuration de Samba (`smb.conf`)
Nous avons vérifié et activé les sections spéciales de partage d'imprimante dans `/etc/samba/smb.conf` :
```ini
[printers]
   comment = All Printers
   browseable = no
   path = /var/spool/samba
   printable = yes
   guest ok = no
   read only = yes
   create mask = 0700

[print$]
   comment = Printer Drivers
   path = /var/lib/samba/printers
   browseable = yes
   read only = yes
   guest ok = no
```

#### 4.2 Installation côté Client Windows 10
Sur la machine Windows 10, l'ajout s'effectue en spécifiant le chemin réseau exact :
**`\\192.31.25.12\Oki-C710`**

> [!CAUTION]
> **Résolution de bug - Blocage de pilotes (printui) :**
> Si Windows bloque ou refuse de récupérer le bon pilote réseau en silencieux :
> Lancez une console `cmd` en administrateur sur Windows et exécutez la commande suivante pour forcer la purge complète des pilotes d'imprimante obsolètes :
> ```cmd
> printui.exe /s /t2
> ```
> Cela permet de réinstaller proprement le pilote depuis une base propre.

#### 4.3 Validation
Un envoi de page de test a été déclenché depuis le client Windows 10. La file d'attente CUPS sur le serveur Linux l'a parfaitement intercepté et transmis physiquement à l'imprimante.

---

## ⚙️ 5. L'Interface de Configuration Graphique Webmin

### A. Le concept
La gestion en ligne de commande peut s'avérer fastidieuse. **Webmin** résout ce problème en fournissant un panneau de contrôle web complet. Il permet d'administrer graphiquement les utilisateurs, les services (Samba, CUPS), le stockage, etc., depuis n'importe quel navigateur web sécurisé.

---

### B. Exécution technique

#### 5.1 Contournement du proxy & Installation locale
En raison du proxy de l'IUT bloquant le téléchargement direct via la commande `wget`, nous avons téléchargé manuellement le paquet Debian (`.deb`) officiel de Webmin via Firefox, avant de l'installer localement :
```bash
# Installation locale du paquet téléchargé en gérant les dépendances
sudo apt-get install ~/Téléchargements/webmin_*_all.deb -y
```

#### 5.2 Accès à l'interface
L'accès s'effectue de manière sécurisée en HTTPS sur le port `10000` :
👉 **`https://localhost:10000`** (ou `https://192.31.25.12:10000`)
*(Authentification avec le compte et mot de passe de l'administrateur système).*

---

### C. ⚠️ Un constat fondamental à retenir

> [!WARNING]
> **Le comportement destructeur de Webmin :**
> Lors d'une modification (par exemple du partage `[Dossier_Opt]`) effectuée depuis l'interface graphique de Webmin :
> Webmin va réécrire **intégralement** le fichier de configuration `/etc/samba/smb.conf`.
> 
> **Conséquence directe :**
> Tous les commentaires humains (lignes commençant par `#` ou `;`) et les indentations esthétiques personnalisées sont **définitivement effacés**. Les outils graphiques d'administration imposent leur propre standardisation de code. Il convient donc de sauvegarder ses fichiers avant de basculer sur ce type d'outil.

---

## ☁️ 6. Sauvegarde Réseau avec Rsync

### A. Le concept
Un bon administrateur applique la règle d'or : *"Pas de sauvegarde, pas de pitié"*. **Rsync** est le standard de l'industrie pour réaliser des sauvegardes incrémentielles. Il permet de copier des dossiers de manière optimisée en comparant les différences, tout en chiffrant les flux via un tunnel sécurisé **SSH**.

---

### B. Exécution technique

#### 6.1 Lancement de la sauvegarde incrémentielle
Nous sauvegardons l'intégralité du dossier de configuration Samba vers le serveur de stockage central de l'IUT (`172.31.25.9`) :
```bash
rsync -avz /etc/samba/ briac_lemeillat@172.31.25.9:~/sauvegarde_samba_tp/
```

> [!IMPORTANT]
> **Décryptage des options de la commande `rsync` :**
> - **`-a`** (*Archive*) : Conserve les permissions, les dates de modification, les liens symboliques et les propriétaires originels.
> - **`-v`** (*Verbose*) : Affiche les détails complets des fichiers copiés à l'écran.
> - **`-z`** (*Zip*) : Active la compression des données lors du transfert réseau pour optimiser l'usage de la bande passante.

#### 6.2 Validation
Après l'échange initial de clés d'empreinte SSH (validation par `yes`) et la saisie du mot de passe étudiant, le transfert s'est exécuté rapidement et sans erreur. Le dossier `/etc/samba/` est désormais sauvegardé en lieu sûr à distance.

---

## ✅ Conclusion
Le TP a permis de concrétiser l'interopérabilité au sein d'un réseau hétérogène (Linux / Windows). La centralisation des impressions via **CUPS**, le partage fluide de fichiers bidirectionnel grâce à **Samba/CIFS**, la facilité d'administration via **Webmin** et la mise en sécurité finale des configurations via **Rsync/SSH** forment un ensemble complet et professionnel pour l'administration de parc.

> [!TIP]
> **État final des services :**
> - 🖨️ **Impression** : CUPS (Port 631) ➔ **Opérationnel**
> - 📂 **Partage de fichiers** : Samba (smbd/nmbd - Ports 139/445) ➔ **Opérationnel**
> - ⚙️ **Gestion Web** : Webmin (Port 10000) ➔ **Opérationnel**
> - ☁️ **Sécurité** : Rsync via SSH (Port 22) ➔ **Sauvegarde validée**