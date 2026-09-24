# Guide 2 — Déploiement Windows 11 automatique + jonction domaine (WDS)

But final du projet : je crée une VM **sans ISO**, elle boote sur le réseau, **Windows 11 s'installe seul**, **rejoint seul le domaine `networkbriac.local`** et **atterrit directement dans l'OU `Etudiants`**. Résultat : l'utilisateur `BriBri` se connecte, et ses GPO (fond d'écran, lecteur Z:, blocage YouTube, Fast-Logon-Fix) s'appliquent sans que je touche à la machine. C'est le "je ne veux plus joindre les postes un par un".

C'est le **chemin 2** : le déploiement Windows passe par **WDS** (Windows Deployment Services), le rôle Microsoft dédié, installé sur NBWS. C'est littéralement la méthode des vraies écoles/entreprises. Ta gateway garde son DHCP et pointe juste vers WDS.

Pourquoi pas "tout sur la gateway Ubuntu" : installer Windows par PXE depuis Linux demande iPXE + wimboot + partage SMB pour `install.wim` — bricolé et fragile. WDS gère toute cette plomberie nativement. Plus simple **et** plus réaliste.

---

## Architecture cible

```
[VM cliente neuve EFI, sans ISO]
        |  1) DHCP -> Gateway Ubuntu (192.168.50.1)
        |       la gateway répond: next-server = NBWS, filename = bootloader WDS
        |  2) PXE/TFTP -> NBWS (192.168.50.10, rôle WDS)
        |       télécharge WinPE (boot.wim)
        |  3) WinPE applique l'unattend: partitionne + choisit l'image + déploie install.wim
        |  4) 1er boot Windows: specialize -> UnattendedJoin -> rejoint le domaine dans OU Etudiants
        v
   Windows 11 installé + joint au domaine, BriBri peut se connecter
```

Répartition des rôles : **DHCP = gateway Ubuntu** (inchangé), **PXE/images Windows = WDS sur NBWS**. Les deux sont sur des machines différentes → pas de conflit, il suffit que le DHCP annonce l'adresse de WDS.

---

## Prérequis bloquants à régler AVANT (sinon Windows 11 refuse de s'installer)

Windows 11 exige **UEFI + Secure Boot + TPM 2.0**. Deux options :

**Option A — vTPM sur ESXi (réaliste).** La VM cliente doit être : Firmware **EFI**, **Secure Boot activé**, et **module vTPM ajouté**. Ajouter un vTPM sur ESXi impose que l'hôte ait un **Key Provider** (fournisseur de clés / chiffrement de VM) configuré. Si l'ESXi de ton père n'en a pas, c'est un préalable à voir avec lui.

**Option B — contournement labo (si pas de Key Provider).** Dans la phase WinPE, avant l'install, on injecte les clés de registre `LabConfig` qui désactivent les checks : `BypassTPMCheck`, `BypassSecureBootCheck`, `BypassRAMCheck` (dans `HKLM\SYSTEM\Setup\LabConfig`). Ça permet d'installer Win11 sur une VM sans vTPM. Moins "propre" mais parfait pour un lab.

Autres prérequis VM : ≥ 2 vCPU, ≥ 4 Go RAM, disque ≥ 64 Go, carte réseau sur `briac_network`, **carte réseau en 1er dans l'ordre de boot**, aucun CD/ISO.

---

## Plan à suivre

### 1. Installer le rôle WDS sur NBWS
Gestionnaire de serveur → Ajouter des rôles et fonctionnalités → **Services de déploiement Windows** (cocher *Serveur de déploiement* + *Serveur de transport*) → installer.

### 2. Configurer WDS
Outils → Services de déploiement Windows → clic droit sur NBWS → **Configurer le serveur** :
- **Intégré à Active Directory** (NBWS est déjà DC).
- Dossier `RemoteInstall` : sur le disque C: (voir note stockage plus bas).
- **Paramètres DHCP** : comme le DHCP n'est **pas** sur ce serveur, **laisser les deux cases décochées** ("ne pas écouter sur le port 67" / "option 60"). C'est le point clé de ta situation : le DHCP est déporté sur la gateway.
- **Stratégie de réponse PXE** : *Répondre à tous les ordinateurs (connus et inconnus)* — pratique en lab.

### 3. Ajouter l'image de démarrage (WinPE)
Monter l'ISO Windows 11 sur NBWS (lecteur CD ESXi, comme pour la gateway).
WDS → **Images de démarrage** → Ajouter → sélectionner `D:\sources\boot.wim`.
C'est le mini-Windows (WinPE) qui tourne le temps de l'install.

### 4. Ajouter l'image d'installation (Windows 11)
WDS → **Images d'installation** → créer un groupe (ex. `Win11`) → Ajouter → `D:\sources\install.wim` → choisir l'édition (Pro ou Éducation).

> **Note stockage (≠ gateway)** : contrairement au guide 1, WDS **copie** `install.wim` (~4–5 Go) dans son dossier `RemoteInstall`. C'est inévitable : WDS sert depuis son propre magasin, pas depuis un CD monté. Ça consomme donc du disque sur NBWS (datastore). À anticiper avec ton père.

### 5. Options DHCP sur la gateway Ubuntu — pointer vers WDS
Dans `/etc/dhcp/dhcpd.conf`, subnet `192.168.50.0`, on remplace le `next-server`/`filename` du guide 1 par ceux de WDS :
```
option arch code 93 = unsigned integer 16;
next-server 192.168.50.10;

if option arch = 00:07 {
    filename "boot\\x64\\wdsmgfw.efi";
} elsif option arch = 00:09 {
    filename "boot\\x64\\wdsmgfw.efi";
} else {
    filename "boot\\x64\\wdsnbp.com";
}
```
- `next-server 192.168.50.10` : c'est **NBWS** (WDS) qui sert le boot, plus la gateway.
- `wdsmgfw.efi` : bootloader WDS pour client **UEFI** (ton cas Win11).
- `wdsnbp.com` : équivalent **BIOS** (au cas où).
- Backslashes `\\` : chemins TFTP façon Windows.
Puis `systemctl restart isc-dhcp-server`.

> Tu ne peux servir qu'**un** OS à la fois via ce `filename`. Tant que tu déploies du Windows, il pointe WDS. Si tu veux réutiliser le PXE Ubuntu du guide 1, tu rebascules `next-server`/`filename` sur la gateway. (Le guide 3 explique comment offrir les deux dans un seul menu.)

### 6. Automatiser la phase WinPE (fichier "WDSClientUnattend")
C'est le fichier qui répond aux questions de la phase de démarrage : langue, disque, image. À stocker dans `RemoteInstall\WdsClientUnattend\` et à déclarer dans WDS → propriétés du serveur → onglet **Client** → *Activer l'installation sans assistance* → pointer le fichier (par architecture x64).
Il doit définir :
- Langue/clavier **fr-FR** + AZERTY.
- **Partitionnement disque** : effacer le disque, créer EFI (500 Mo) + MSR (16 Mo) + partition Windows (le reste).
- Sélection automatique de l'image `install.wim` (édition + groupe).
- Identifiants d'un compte du domaine autorisé à lire l'image sur WDS.

### 7. Automatiser Windows + la jonction domaine (fichier "unattend" image)
C'est **le cœur du projet** : le second fichier de réponses, appliqué pendant l'installation de Windows lui-même. Composant clé : **`Microsoft-Windows-UnattendedJoin`** dans la passe `specialize`. Il contient :
- `JoinDomain` : `networkbriac.local`
- Identifiants d'un compte AD autorisé à joindre des machines (ex. un compte dédié, ou Administrateur) + mot de passe.
- **`MachineObjectOU` : `OU=Etudiants,DC=networkbriac,DC=local`**

Ce dernier champ est ce qui règle ton vieux problème : la machine tombe **directement dans l'OU Etudiants**, donc les GPO (fond d'écran, Z:, YouTube, Fast-Logon-Fix) s'appliquent d'emblée. Plus besoin de déplacer l'objet ordinateur à la main, ni même de `redircmp`.
On y met aussi : locale **fr-FR**, clavier AZERTY (`InputLocale 040c:0000040c`), fuseau horaire, et éventuellement un nom d'ordinateur auto.

> Le mot de passe du compte de jonction est stocké de façon peu protégée dans le fichier unattend (obfusqué, pas chiffré). Acceptable en lab, à savoir.

### 8. Déployer et vérifier
Créer la VM (EFI, vTPM ou bypass, sans ISO, NIC en 1er) → allumer.
Séquence attendue : DHCP (gateway) → PXE vers WDS → WinPE → WDSClientUnattend partitionne + choisit l'image → `install.wim` déployé → 1er boot → `specialize` → UnattendedJoin → **la machine rejoint le domaine dans OU Etudiants** → écran de connexion → `BriBri` se connecte → GPO appliquées.

Vérifs :
- Sur NBWS : l'objet ordinateur apparaît dans **OU=Etudiants** (Utilisateurs et ordinateurs AD).
- Sur le client : `nltest /dsgetdc:networkbriac.local`, `gpresult /r`, fond d'écran + Z: présents au logon.

---

## Pièges à anticiper

- **Win11 sans TPM** : sans vTPM ni bypass LabConfig, l'install s'arrête net. Régler ça en tout premier (prérequis).
- **Heure/Kerberos** : la jonction domaine échoue si l'horloge du client dérive (tu connais ce point). NBWS = DC ; vérifier que l'heure de l'hôte ESXi est juste, la VM en hérite.
- **DHCP ≠ WDS sur la même machine** : chez toi ils sont séparés → pas besoin d'option 60, juste `next-server` + `filename`. (L'option 60 ne servirait que si WDS et DHCP cohabitaient sur un seul hôte.)
- **Ordre de boot après install** : comme pour Ubuntu, remettre le **disque en 1er** après le 1er déploiement pour éviter la reboucle PXE.
- **Deux fichiers unattend distincts** : ne pas confondre celui de la phase WinPE (WDSClientUnattend) et celui de l'image (jonction domaine). Les deux sont nécessaires pour le "zéro clic".

## Note sur le mot de passe 1ère connexion (abandonné)
Ce déploiement **ne dépend pas** du problème de changement de mdp à la 1ère connexion que tu as laissé de côté. `BriBri` se connecte avec son mot de passe (flag `ChangePasswordAtLogon $false`). La jonction et les GPO fonctionnent indépendamment de ce bug Windows.
