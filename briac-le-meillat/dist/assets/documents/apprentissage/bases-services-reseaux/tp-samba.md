---
title: "Interopérabilité des Systèmes : Samba, CUPS, Webmin & Rsync"
module: "R203"
competence: "Administrer"
ac_lies: ["AC11.01", "AC11.02"]
techs: ["Samba", "CUPS", "Webmin", "Rsync", "SSH"]
date: "2026-06-01"
status: "Terminé"
image: "/assets/projects/samba-visu.png"
---

# Compte-Rendu Technique : Interopérabilité des Systèmes (Samba, CUPS, Webmin)
> **R203 — Administration Réseau** — *Briac Le Meillat*

**Objectif :** Mise en place d'un réseau hybride fonctionnel permettant le partage de fichiers et de périphériques (imprimantes) entre des machines Linux (Ubuntu) et Windows 10, tout en sécurisant les accès et en automatisant les sauvegardes.

## 💡 C'est quoi ce charabia de Samba, CUPS et Rsync ?
Vous vous êtes déjà retrouvé avec votre magnifique PC sous Linux à côté de votre collègue sous Windows, et impossible de lui envoyer un fichier facilement par le réseau ? C'est frustrant, non ? C'est parce que Windows et Linux ne parlent pas la même langue nativement quand il s'agit de partager des fichiers.
Et bien c'est là que **Samba** intervient ! C'est un traducteur universel. Grâce à lui, votre machine Linux va se déguiser et apparaître comme par magie dans l'onglet "Réseau" du PC Windows de votre collègue.

Ensuite, imaginez que vous avez une seule imprimante pour tout le bureau. Vous n'allez pas la brancher et la débrancher à chaque fois que quelqu'un veut imprimer, si ? C'est là qu'on utilise **CUPS**. Ça permet de transformer votre petit serveur Linux en chef d'orchestre des impressions. L'imprimante est branchée dessus, et c'est lui qui gère la file d'attente pour tout le monde sur le réseau.

Enfin, on va rajouter **Webmin** pour vous simplifier la vie en vous offrant une jolie interface web pour tout configurer à la souris au lieu de taper des lignes de commande, et **Rsync** pour être sûr de ne jamais perdre vos configurations (parce que bon, on connaît tous l'angoisse du "oups, j'ai tout cassé et j'ai pas de sauvegarde (ça aussi, s'est arrivé à la pépinière)"). Vous allez voir, c'est ultra pratique de faire communiquer tout ce beau monde !

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

### B. Exécution technique (Serveur Linux)

#### 1.1 Installation et configuration graphique
1.  **Ajout de l'imprimante** : Depuis l'interface graphique des paramètres d'Ubuntu (`Paramètres` > `Imprimantes` > `Ajouter`), nous avons ajouté l'imprimante réseau (modèle de la salle : **Oki-C710**).
2.  **Restriction des accès** : Dans les propriétés avancées de l'imprimante (`Propriétés` > `Contrôle d'accès`), l'accès a été restreint pour n'autoriser que les machines appartenant au sous-réseau **`192.31.25.0/24`**.

#### 1.2 Fichiers de configuration et logs
Les modifications effectuées graphiquement modifient directement les fichiers système suivants :
*   📄 **`/etc/cups/printers.conf`** : Contient la définition et la configuration matérielle de l'imprimante installée.
*   📄 **`/etc/cups/cupsd.conf`** : Gère les directives d'accès et les règles de sécurité du serveur CUPS.

> [!NOTE]
> **Suivi et diagnostic (Logs) :**
> En cas de dysfonctionnement, l'historique et les erreurs sont tracés en temps réel dans :
> *   `access_log` : `/var/log/cups/access_log` (Qui a imprimé quoi ?)
> *   `error_log` : `/var/log/cups/error_log` (Pourquoi ça n'a pas imprimé ?)

#### 1.3 Commandes de vérification
Pour s'assurer du bon fonctionnement de l'imprimante, de son état et de sa file d'attente :
```bash
# Vérifie l'état général et la disponibilité du service d'impression
lpstat -p

# Affiche l'état de la file d'attente pour l'imprimante Oki-C710
lpq -P Oki-C710
```

---

### C. Client Linux (Ubuntu)
Pour connecter une autre machine Linux au serveur d'impression :
1. **Ajout de l'imprimante** : Ajout de l'imprimante réseau via l'interface graphique en pointant vers l'adresse IP du serveur (`192.31.25.12`).
2. **Validation** : Lancement d'une page de test pour confirmer la liaison et le traitement.

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

#### 2.3 Validation et application
Avant d'appliquer les modifications, on valide la syntaxe :
```bash
# Vérification syntaxique du fichier de configuration
testparm
```

Une fois validée, on redémarre les démons et on liste les partages actifs :
```bash
# Redémarrage des services Samba
sudo systemctl restart smbd nmbd

# Liste les partages actifs sur la machine locale
smbclient -L localhost
```

---

## 📁 3. Partage de Fichiers Bilatéral

### A. Le concept
Une fois Samba actif, il faut déclarer quels dossiers nous souhaitons partager, de quelle façon (lecture seule ou écriture), et à quels utilisateurs. Nous avons mis en place un **partage bilatéral** :
1.  **Linux ➔ Windows** : Partage d'un dossier public et des répertoires personnels.
2.  **Windows ➔ Linux** : Montage d'un dossier Windows distant sur l'arborescence Linux.

---

### B. Export Serveur Linux vers Client Windows

#### 1. Création de l'utilisateur système et Samba
Samba a sa propre base de données d'utilisateurs. On doit d'abord créer l'utilisateur sur le système Linux, puis lui attribuer un mot de passe Samba :
```bash
# Ajout de l'utilisateur sur la VM Linux
sudo adduser user5

# Liaison de l'utilisateur à la base Samba avec mot de passe
sudo smbpasswd -a user5
```

#### 2. Configuration des partages dans `smb.conf`
Nous avons décommenté la section par défaut `[homes]` (qui partage automatiquement le répertoire `/home/utilisateur` de façon sécurisée) et configuré le partage public en lecture seule pointant vers `/opt`.

**Configuration du partage `/opt` dans `/etc/samba/smb.conf` :**
```ini
[Dossier_Opt]
   comment = Dossier public
   path = /opt
   browseable = yes
   guest ok = yes
   read only = yes
```

**Configuration avancée (masquage et liens symboliques) :**
Pour affiner les permissions et le comportement du serveur Samba, les paramètres suivants ont été ajoutés sous le partage :
```ini
   hide local users = No
   hide dot files = Yes
   hide unreadable = No
   wide links = Yes
   follow symlinks = Yes
```

*   **Résultat** : Depuis l'explorateur Windows, en tapant **`\\192.31.25.12`** dans la barre d'adresse, on accède directement aux dossiers partagés de Linux !

---

### C. Montage Client Windows vers Client Linux

#### 1. Configuration côté Windows (Source)
* **Partage du dossier** : Partager le dossier cible sur le réseau.
* **Droits NTFS** : Associer les autorisations "Tout le monde" (*Everyone*) en lecture/écriture dans l'onglet *Sécurité*.
* **Sécurité** : Désactiver le *partage protégé par mot de passe* dans les paramètres de partage avancés de Windows.

#### 2. Configuration et montage côté Linux (Destination)
```bash
# Mise à jour des dépôts de paquets
sudo apt-get update

# Installe les outils de montage CIFS
sudo apt-get install smbclient cifs-utils --fix-missing -y

# Crée le point de montage dans l'arborescence locale
sudo mkdir -p /mnt/partagewin

# Vérifie la visibilité du partage Windows depuis Linux (sans mot de passe)
smbclient -L 192.31.25.18 -U administrateur%

# Effectue le montage réseau du dossier Windows
sudo mount -t cifs //192.31.25.18/PartageWindows /mnt/partagewin -o username=guest,password=

# Valide l'accès aux fichiers
ls -l /mnt/partagewin
```

> [!IMPORTANT]
> **Pourquoi `username=guest` ?**
> Même pour un partage public "sans mot de passe", les versions récentes de Windows 10 rejettent catégoriquement les connexions 100% anonymes (null sessions). L'argument `-o username=guest` force Windows à accepter la connexion sans requérir de mot de passe réel.

---

## 🖨️ 4. Partage d'Imprimantes Samba (Linux vers Windows)

### A. Le concept
L'imprimante configurée localement sur le serveur avec CUPS (Partie 1) doit maintenant être distribuée à l'ensemble du parc via Samba pour que les clients Windows puissent imprimer dessus de façon transparente.

---

### B. Exécution technique

#### 4.1 Configuration du Serveur Linux (`smb.conf`)
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

#### 4.2 Configuration du Client Windows 10
1. **Purge du cache d'impression** : Si Windows bloque ou refuse de récupérer le bon pilote réseau :
   ```cmd
   printui.exe /s /t2
   ```
2. **Ajout manuel** : Ajout de l'imprimante via l'explorateur Windows en spécifiant le chemin réseau exact :
   **`\\192.31.25.12\Oki-C710`**
3. **Validation** : Impression d'une page de test pour confirmer la bonne transmission.

---

## ⚙️ 5. L'Interface de Configuration Graphique Webmin

### A. Le concept
La gestion en ligne de commande peut s'avérer fastidieuse. **Webmin** résout ce problème en fournissant un panneau de contrôle web complet. Il permet d'administrer graphiquement les utilisateurs, les services (Samba, CUPS), le stockage, etc., depuis n'importe quel navigateur web sécurisé.

---

### B. Exécution technique

#### 5.1 Installation des prérequis
Avant d'installer Webmin, on installe le serveur HTTP Apache :
```bash
sudo apt-get install apache2 -y
```

#### 5.2 Déploiement de Webmin (Contournement du proxy)
En raison du proxy de l'IUT bloquant le téléchargement direct via internet, nous téléchargeons le paquet Debian (`.deb`) officiel de Webmin via Firefox dans le dossier `Téléchargements`. 

Avant de l'installer, nous effectuons une sauvegarde de notre configuration Samba :
```bash
# Sauvegarde préventive de la configuration Samba
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.original

# Installation locale du paquet téléchargé en gérant les dépendances
sudo apt-get install /home/administrateur/Téléchargements/webmin_2.641_all.deb -y
```

#### 5.3 Utilisation et modification du partage
* **Accès** : Connexion sécurisée sur **`https://localhost:10000`** (ou l'IP du serveur).
* **Action** : Modification des paramètres du partage `[Dossier_Opt]` via l'interface graphique.

---

### C. ⚠️ Un constat fondamental à retenir

> [!WARNING]
> **Le comportement destructeur de Webmin :**
> Lors d'une modification effectuée depuis l'interface graphique de Webmin, l'outil réécrit **intégralement** le fichier de configuration `/etc/samba/smb.conf`.
> 
> Si vous affichez la configuration modifiée après coup :
> ```bash
> cat /etc/samba/smb.conf
> ```
> Vous constaterez la suppression totale des commentaires d'origine (lignes commençant par `#` ou `;`) et une réécriture structurelle totale imposée par Webmin. Il convient donc de sauvegarder ses fichiers avant de basculer sur ce type d'outil.

---

## ☁️ 6. Sauvegarde Réseau avec Rsync

### A. Le concept
Un bon administrateur applique la règle d'or : *"Pas de sauvegarde, pas de pitié"*. **Rsync** est le standard de l'industrie pour réaliser des sauvegardes incrémentielles. Il permet de copier des dossiers de manière optimisée en comparant les différences, tout en chiffrant les flux via un tunnel sécurisé **SSH**.

---

### B. Exécution technique

#### 6.1 Transfert sécurisé des configurations (Rsync)
Nous sauvegardons l'intégralité du dossier de configuration Samba vers le serveur de stockage distant de l'IUT (`172.31.25.9`) :
```bash
rsync -avz /etc/samba/ briac_lemeillat@172.31.25.9:~/sauvegarde_samba_tp/
```

> [!IMPORTANT]
> **Décryptage des options de la commande `rsync` :**
> - **`-a`** (*Archive*) : Conserve les permissions, les dates de modification, les liens symboliques et les propriétaires originels.
> - **`-v`** (*Verbose*) : Affiche les détails complets des fichiers copiés à l'écran.
> - **`-z`** (*Zip*) : Active la compression des données lors du transfert réseau pour optimiser l'usage de la bande passante.

#### 6.2 Validation
Après saisie de **`yes`** pour valider l'empreinte de la clé SSH lors de la première connexion, puis du mot de passe de l'utilisateur distant, le transfert s'est exécuté rapidement et sans erreur. Le dossier `/etc/samba/` est désormais sauvegardé en lieu sûr à distance.

---

## ✅ Conclusion
Le TP a permis de concrétiser l'interopérabilité au sein d'un réseau hétérogène (Linux / Windows). La centralisation des impressions via **CUPS**, le partage fluide de fichiers bidirectionnel grâce à **Samba/CIFS**, la facilité d'administration via **Webmin** et la mise en sécurité finale des configurations via **Rsync/SSH** forment un ensemble complet et professionnel pour l'administration de parc.

> [!TIP]
> **État final des services :**
> - 🖨️ **Impression** : CUPS (Port 631) ➔ **Opérationnel**
> - 📂 **Partage de fichiers** : Samba (smbd/nmbd - Ports 139/445) ➔ **Opérationnel**
> - ⚙️ **Gestion Web** : Webmin (Port 10000) ➔ **Opérationnel**
> - ☁️ **Sécurité** : Rsync via SSH (Port 22) ➔ **Sauvegarde validée**