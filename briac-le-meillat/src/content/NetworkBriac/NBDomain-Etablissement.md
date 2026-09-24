---
title: "Windows Server (AD DS) - Domaine Établissement"
module: "R103"
competence: ["Administrer"]
ac_lies: ["AC11.04"]
project_type: "perso"
techs: ["Windows Server", "AD DS"]
reference_tp: "Inspiré par le TP Administration Système Windows Server 2016"
date: "2026-06-01"
status: "Terminé"
image: ""
---

# Chapitre 1 : Windows Server (NBWS) — configuration validée

Domaine : `networkbriac.local` · NetBIOS : `NETWORKBRIAC` · Forêt : `networkbriac.local`
Infra : VM sur ESXi Roubaix, tunnel VPN via BIGWALL

---

## 1. Windows Server (NBWS) — configuration validée

### Système
- OS : Windows Server 2025 Standard (expérience utilisateur / GUI)
- Hostname : `NBWS` → FQDN `NBWS.networkbriac.local` (renommé depuis `WIN-OKCMNTP2HJU`)

### Réseau — 1 carte
| Carte | Réseau | IP | Masque | Passerelle | DNS |
|-------|--------|-----|--------|-----------|-----|
| 1 | Switch virtuel interne (`briac_network`) | 192.168.50.10 (DHCP) | 255.255.255.0 | 192.168.50.1 (gateway) | 192.168.50.1 (gateway) |

### Rôles installés
- AD DS (Active Directory Domain Services)
- DNS
- Gestion de stratégie de groupe (GPMC)
- DHCP
- Promotion en contrôleur de domaine (nouvelle forêt) : OK

### Active Directory
- OU : `Etudiants`
- Utilisateur : `BriBri@networkbriac.local` (dans OU Etudiants)
- Objet ordinateur `CLIENT` : présent dans le conteneur `Computers` (par défaut)

### Partage réseau
- Dossier : `C:\Partage_Etudiants`
- Nom de partage : `Partage_Etudiants`
- Autorisations : `Tout le monde` = Lecture · `BriBri` = Contrôle total

### DHCP
- Scope unique : `192.168.50.0/24`
- Plage distribuée : `192.168.50.10` → `192.168.50.100`
- Masque : 255.255.255.0
- Passerelle : 192.168.50.1
- DNS : 192.168.50.1
- Distribution limitée au réseau interne .50.x uniquement (aucun risque sur Roubaix)

### DNS — correction appliquée
- Problème initial : `NBWS.networkbriac.local` résolvait vers `192.168.168.110` (réseau Roubaix, injoignable depuis .50.x)
- Correction : ajout d'un enregistrement A `NBWS` → `192.168.50.1`
```powershell
Add-DnsServerResourceRecordA -Name "NBWS" -ZoneName "networkbriac.local" -IPv4Address "192.168.50.1"
```
- Résultat : le client résout et joint le DC via 192.168.50.1 → confirmé par `nltest /dsgetdc:networkbriac.local`

### GPO liées à l'OU Etudiants
1. **GPO-Fond-Ecran** : Config utilisateur → Bureau → Papier peint = `C:\Windows\Web\Wallpaper\Windows\img0.jpg`
2. **GPO Mappage lecteur** : Config utilisateur → Préférences → Mappages de lecteurs → Z: → `\\NBWS.networkbriac.local\Partage_Etudiants`
3. **GPO-Bloquer-Youtube** : Config ordinateur → Scripts démarrage → `BlockYoutube.bat` (ajout entrées HOSTS `0.0.0.0 youtube.com`)

Script (dans SYSVOL) :
```batch
@echo off
echo 0.0.0.0 youtube.com >> C:\Windows\System32\drivers\etc\hosts
echo 0.0.0.0 www.youtube.com >> C:\Windows\System32\drivers\etc\hosts
```

### Accès distant
- RDP activé sur le serveur (accès via Windows App / IP 192.168.168.110)

---

## 2. Client Windows 11 (CLIENT) — configuration validée

- OS : Windows 11
- Hostname : `CLIENT`
- Carte réseau : Intel 82574L, branchée sur le switch virtuel interne
- IP obtenue via DHCP : `192.168.50.10` / GW `192.168.50.1` / DNS `192.168.50.1` — **OK**
- Résolution DNS `networkbriac.local` : **OK**
- `ping 192.168.50.1` : **OK**
- Jonction au domaine `networkbriac.local` : **OK**
- Connexion utilisateur `BriBri@networkbriac.local` : **OK**

---

## 3. Tests GPO — résultats

| GPO | Résultat |
|-----|----------|
| Blocage YouTube | ✅ **Fonctionne** (`ping youtube.com` bloqué) |
| Stratégie ordinateur (`gpupdate /force`) | ✅ Appliquée sans erreur (après correction DNS) |
| Stratégie utilisateur (`gpupdate /force`) | ✅ Appliquée sans erreur (après réinit mdp) |
| Fond d'écran | ❌ Échec — écran noir |
| Mappage lecteur Z | ❌ Échec — aucun lecteur mappé |

---

## 4. Problème non résolu — changement de mot de passe à la 1ère connexion

### Objectif visé
Comportement réaliste : l'étudiant se connecte avec un mot de passe initial, Windows le force à définir son propre mot de passe à la première ouverture de session.

### Symptôme
Après saisie (ancien mdp + nouveau + confirmation), le message revient en boucle :
> « Le mot de passe de l'utilisateur doit être modifié avant la première connexion. »

Le changement échoue silencieusement, sans message d'erreur spécifique sur la raison du refus.

### Élément lié identifié
`dir \\NBWS.networkbriac.local\SYSVOL` depuis le client retournait aussi ce message tant que le mdp n'était pas changé → accès SYSVOL conditionné au changement de mdp.

### Tentatives effectuées (aucune n'a résolu le blocage)
1. Réinitialisation du mdp côté DC + décochage « doit changer à la prochaine connexion » (écarté : non réaliste)
2. Vérification/respect de la complexité (majuscule + minuscule + chiffre + spécial)
3. `MinPasswordAge` passé de `1.00:00:00` à `0`
4. Redémarrages complets de la VM cliente
5. `gpupdate /force` (client)
6. `Set-ADAccountPassword -Reset`
7. `Set-ADUser -ChangePasswordAtLogon $true` (n'activait pas le flag)
8. `Set-ADUser -Replace @{pwdLastSet=0}` (activait bien `PasswordExpired = True`)
9. Désactivation totale de la politique : `ComplexityEnabled $false`, `PasswordHistoryCount 0`, `MinPasswordLength 4`
10. Multiples mots de passe testés : `Azerty123!`, `Bonjour99aA/B/C`, `briac`, etc.
11. Hypothèse clavier QWERTY/AZERTY (écartée)

### État de la politique de domaine au moment de l'abandon
```
ComplexityEnabled     : False (désactivée en test)
MinPasswordAge        : 00:00:00
MinPasswordLength     : 4
PasswordHistoryCount  : 0
PasswordExpired (BriBri) : True
```

Malgré une politique volontairement permissive et le flag `PasswordExpired = True` correctement positionné, le changement de mot de passe à l'écran de connexion continue d'échouer.

---

## 5. Manipulations exactes par configuration

### 5.1 Renommage du serveur
Paramètres → Système → Informations système → renommer `WIN-OKCMNTP2HJU` en `NBWS` → redémarrer.

### 5.2 Configuration IP des 2 cartes réseau
Paramètres → Réseau et Internet → Ethernet → chaque carte → Modifier → Manuel :
- Carte Roubaix : IP `192.168.168.110`, masque `255.255.255.0`, passerelle `192.168.168.1`, DNS `192.168.168.100` + `192.168.2.200`
- Carte interne : IP `192.168.50.1`, masque `255.255.255.0`, passerelle **vide**, DNS **vide**

> Piège rencontré : mettre une passerelle/DNS identique sur les 2 cartes déclenche « Valeurs dupliquées dans les champs d'adresse ». La carte interne doit rester sans passerelle ni DNS.

### 5.3 Installation des rôles
Gestionnaire de serveur → Gérer → Ajouter des rôles et fonctionnalités → cocher :
- Services AD DS
- Serveur DNS
- Gestion de stratégie de groupe
- (DHCP ajouté plus tard, voir 5.8)

> L'avertissement « adresse IP statique introuvable » pendant l'install AD DS est un faux positif à ignorer.

### 5.4 Promotion en contrôleur de domaine
Gestionnaire de serveur → triangle d'avertissement jaune → Promouvoir ce serveur en contrôleur de domaine :
- Ajouter une nouvelle forêt
- Nom racine : `networkbriac.local`
- NetBIOS : `NETWORKBRIAC`
- Définir le mot de passe DSRM
- Options DNS par défaut, chemins NTDS/SYSVOL par défaut
- Vérification des prérequis → installer → redémarrage automatique

### 5.5 Création de l'OU et de l'utilisateur
Outils → Utilisateurs et ordinateurs Active Directory :
1. Clic droit sur le domaine → Nouveau → Unité d'organisation → `Etudiants`
2. Clic droit sur l'OU Etudiants → Nouveau → Utilisateur → nom d'ouverture `BriBri` (UPN `BriBri@networkbriac.local`) → définir mot de passe initial

### 5.6 Création du partage réseau
1. Créer le dossier `C:\Partage_Etudiants`
2. Clic droit → Propriétés → onglet Partage → Partage avancé → cocher « Partager ce dossier » → nom `Partage_Etudiants`
3. Autorisations de partage : `Tout le monde` = Lecture
4. Onglet Sécurité (NTFS) : ajouter `BriBri` = Contrôle total

### 5.7 Création des 3 GPO (Gestion de stratégie de groupe)
Toutes liées à l'OU `Etudiants` (clic droit sur l'OU → Créer un objet GPO dans ce domaine et le lier ici → puis clic droit → Modifier).

**GPO fond d'écran :**
Éditeur GPO → Configuration utilisateur → Stratégies → Modèles d'administration → Bureau → Bureau → double-clic « Papier peint du bureau » → Activé → champ « Nom du papier peint » : `C:\Windows\Web\Wallpaper\Windows\img0.jpg` → OK

**GPO mappage lecteur Z :**
Éditeur GPO → Configuration utilisateur → Préférences → Paramètres Windows → Mappages de lecteurs → clic droit → Nouveau → Lecteur mappé :
- Action : Créer
- Emplacement : `\\NBWS.networkbriac.local\Partage_Etudiants`
- Reconnecter : coché
- Libeller en tant que : `Partage Etudiants`
- Lettre de lecteur : Utiliser → `Z`
- OK

**GPO blocage YouTube :**
1. Créer le fichier script dans le SYSVOL de la GPO : `C:\Windows\SYSVOL\networkbriac.local\Policies\{GUID-de-la-GPO}\Machine\Scripts\Startup\BlockYoutube.bat` (créer les dossiers `Machine\Scripts\Startup` s'ils n'existent pas)
2. Contenu du .bat :
```batch
@echo off
echo 0.0.0.0 youtube.com >> C:\Windows\System32\drivers\etc\hosts
echo 0.0.0.0 www.youtube.com >> C:\Windows\System32\drivers\etc\hosts
```
3. Éditeur GPO → Configuration ordinateur → Stratégies → Paramètres Windows → Scripts (démarrage/arrêt) → Démarrage → Ajouter → sélectionner `BlockYoutube.bat` → OK

> Piège rencontré : dans « Ajouter un script », le fichier doit déjà exister dans le SYSVOL avant de pouvoir être sélectionné.

### 5.8 Installation et configuration du DHCP (réseau interne uniquement)
1. Ajouter le rôle **Serveur DHCP** (Gestionnaire de serveur → Ajouter des rôles)
2. Gestionnaire DHCP (clic droit sur NBWS dans Gestionnaire de serveur → Gestionnaire DHCP)
3. Développer NBWS → clic droit sur IPv4 → Nouvelle étendue :
   - Nom : `Reseau-Interne-50`
   - Plage : début `192.168.50.10`, fin `192.168.50.100`
   - Masque : `255.255.255.0`
   - Passerelle par défaut : `192.168.50.1`
   - Serveur DNS : `192.168.50.1`
   - Activer l'étendue : Oui
4. Une seule étendue créée (192.168.50.0/24) → DHCP ne distribue que sur le réseau interne, aucun risque côté Roubaix.

### 5.9 Correction de l'enregistrement DNS du DC
Problème : `NBWS.networkbriac.local` résolvait vers `192.168.168.110` (injoignable depuis .50.x).
Sur le DC, PowerShell admin :
```powershell
Add-DnsServerResourceRecordA -Name "NBWS" -ZoneName "networkbriac.local" -IPv4Address "192.168.50.1"
```
Côté client : `ipconfig /flushdns` puis `ping NBWS.networkbriac.local` → résout vers 192.168.50.1.

### 5.10 Jonction du client Windows 11 au domaine
1. Renommer le PC : Paramètres → Système → Informations système → Renommer ce PC → `CLIENT` → redémarrer
2. Informations système → Modifier (nom/domaine) → sélectionner **Domaine** → `networkbriac.local` → OK
3. Authentification : `NETWORKBRIAC\Administrateur` + mot de passe admin
4. Redémarrer → connexion `BriBri@networkbriac.local`

### 5.11 Vérifications réseau côté client (commandes utilisées)
```
ipconfig /all              # vérifier IP DHCP 192.168.50.10, GW et DNS 192.168.50.1
ping 192.168.50.1          # connectivité DC
nslookup networkbriac.local
nltest /dsgetdc:networkbriac.local   # confirme le DC trouvé via 192.168.50.1
gpupdate /force            # forcer application des GPO
```

---

## 6. Récapitulatif

**Fonctionnel :** infrastructure réseau (DHCP, DNS, connectivité), jonction au domaine, authentification BriBri, application des GPO (ordinateur + utilisateur sans erreur), blocage YouTube.

**Non fonctionnel :** GPO fond d'écran, GPO mappage lecteur Z, changement de mot de passe à la première connexion.

# Chapitre 2 - v05072026

Domaine : `networkbriac.local` · NetBIOS : `NETWORKBRIAC` · Forêt : `networkbriac.local`
Infra : VM sur ESXi Roubaix, tunnel VPN via BIGWALL

---

## 1. Windows Server (NBWS) — configuration validée

### Système
- OS : Windows Server 2025 Standard (expérience utilisateur / GUI)
- Hostname : `NBWS` → FQDN `NBWS.networkbriac.local` (renommé depuis `WIN-OKCMNTP2HJU`)

### Réseau — 1 carte
| Carte | Réseau | IP | Masque | Passerelle | DNS |
|-------|--------|-----|--------|-----------|-----|
| 1 | Switch virtuel interne (`briac_network`) | 192.168.50.10 (DHCP) | 255.255.255.0 | 192.168.50.1 (gateway Ubuntu) | 192.168.50.1 (gateway Ubuntu) |

> La carte Roubaix (192.168.168.110) a été supprimée. NBWS reçoit désormais son IP via DHCP depuis la gateway Ubuntu (`vmware-nb-us-gtw`). La gateway est le seul point de sortie vers Internet et le seul serveur DNS annoncé aux clients.

### Rôles installés
- AD DS (Active Directory Domain Services)
- DNS
- Gestion de stratégie de groupe (GPMC)
- DHCP (installé mais service arrêté et désactivé — DHCP assuré par la gateway Ubuntu)
- Promotion en contrôleur de domaine (nouvelle forêt) : OK

### Active Directory
- OU : `Etudiants`
- Utilisateur : `BriBri@networkbriac.local` (dans OU Etudiants)
- Objet ordinateur `DESKTOP-P3MCL7Q` : présent dans le conteneur `Computers` (par défaut)

### Partage réseau
- Dossier : `C:\Partage_Etudiants`
- Nom de partage : `Partage_Etudiants`
- Autorisations : `Tout le monde` = Lecture · `BriBri` = Contrôle total

### DHCP
- Service arrêté et désactivé sur NBWS
- La distribution DHCP est assurée par la gateway Ubuntu (isc-dhcp-server, plage 192.168.50.10–192.168.50.60)

### DNS — configuration actuelle
- Le serveur DNS de NBWS écoute sur 192.168.50.10:53 (TCP et UDP)
- Les clients reçoivent 192.168.50.1 (gateway) comme DNS via DHCP
- La gateway forwardes les requêtes `networkbriac.local` vers NBWS via Bind9
- Enregistrement A `NBWS` → `192.168.50.10` (l'ancienne entrée 192.168.50.1 a été supprimée et recréée)

```powershell
Remove-DnsServerResourceRecord -ZoneName "networkbriac.local" -Name "NBWS" -RecordType A -Force
Add-DnsServerResourceRecordA -Name "NBWS" -ZoneName "networkbriac.local" -IPv4Address "192.168.50.10"
```

### GPO liées à l'OU Etudiants
1. **GPO-Fond-Ecran** : Config utilisateur → Préférences → Paramètres Windows → Registre → clé `HKCU\Control Panel\Desktop`, valeur `Wallpaper` = `\\NBWS.networkbriac.local\SYSVOL\networkbriac.local\scripts\really-funny-pictures-vsjsgu4mm5y4vufy.jpg` + script de logon `wallpaper.bat` dans le SYSVOL de la GPO
2. **GPO Mappage lecteur** : Config utilisateur → Préférences → Mappages de lecteurs → Z: → `\\NBWS.networkbriac.local\Partage_Etudiants`
3. **GPO-Bloquer-Youtube** : Config ordinateur → Scripts démarrage → `BlockYoutube.bat` (ajout entrées HOSTS `0.0.0.0 youtube.com`)

Script BlockYoutube.bat (dans SYSVOL) :
```batch
@echo off
echo 0.0.0.0 youtube.com >> C:\Windows\System32\drivers\etc\hosts
echo 0.0.0.0 www.youtube.com >> C:\Windows\System32\drivers\etc\hosts
```

Script wallpaper.bat (dans SYSVOL, GPO-Fond-Ecran, script de logon utilisateur) :
```batch
@echo off
copy "\\NBWS.networkbriac.local\SYSVOL\networkbriac.local\scripts\really-funny-pictures-vsjsgu4mm5y4vufy.jpg" "C:\wallpaper.jpg"
reg add "HKCU\Control Panel\Desktop" /v Wallpaper /t REG_SZ /d "C:\wallpaper.jpg" /f
rundll32.exe user32.dll,UpdatePerUserSystemParameters ,1 ,True
```

### Accès distant
- RDP activé sur le serveur (accès via console ESXi ou RDP sur 192.168.50.10 depuis un hôte du réseau interne)

---

## 2. Client Windows 10 (DESKTOP-P3MCL7Q) — configuration validée

- OS : Windows 10
- Hostname : `DESKTOP-P3MCL7Q`
- Carte réseau : branchée sur le switch virtuel interne (`briac_network`)
- IP obtenue via DHCP (gateway Ubuntu) : `192.168.50.12` / GW `192.168.50.1` / DNS `192.168.50.1` — **OK**
- Résolution DNS `networkbriac.local` via gateway (Bind9 forward vers NBWS) : **OK**
- `ping 192.168.50.10` (NBWS) : **OK**
- `ping wikipedia.org` (Internet via NAT gateway) : **OK**
- Jonction au domaine `networkbriac.local` : **OK**
- Connexion utilisateur `BriBri@networkbriac.local` : **OK** (flag ChangePasswordAtLogon désactivé temporairement)

---

## 3. Tests GPO — résultats

| GPO | Résultat |
|-----|----------|
| Blocage YouTube | ✅ Fonctionne (`ping youtube.com` bloqué) |
| Stratégie ordinateur (`gpupdate /force`) | ✅ Appliquée sans erreur |
| Stratégie utilisateur (`gpupdate /force`) | ✅ Appliquée sans erreur |
| Mappage lecteur Z | ⚠️ Fonctionne manuellement (`net use Z: \\NBWS.networkbriac.local\Partage_Etudiants`) mais pas automatiquement via GPO — objet ordinateur CLIENT hors OU Etudiants |
| Fond d'écran | ❌ Échec persistant — registre mis à jour correctement, script de logon configuré, mais Windows 10 n'applique pas le fond d'écran |

---

## 4. Problème non résolu — changement de mot de passe à la 1ère connexion

### Objectif visé
Comportement réaliste : l'étudiant se connecte avec un mot de passe initial, Windows le force à définir son propre mot de passe à la première ouverture de session.

### Symptôme
Après saisie (ancien mdp + nouveau + confirmation), le message revient en boucle :
> « Le mot de passe de l'utilisateur doit être modifié avant la première connexion. »

Le changement échoue silencieusement, sans message d'erreur spécifique sur la raison du refus.

### Élément lié identifié
Hypothèse : le blocage était lié à l'inaccessibilité du SYSVOL au moment du changement de mdp (bug DNS corrigé depuis). À retester avec la nouvelle architecture.

### Contournement temporaire appliqué
```powershell
Set-ADUser -Identity BriBri -ChangePasswordAtLogon $false
```

### Tentatives effectuées (aucune n'a résolu le blocage)
1. Réinitialisation du mdp côté DC + décochage « doit changer à la prochaine connexion » (écarté : non réaliste)
2. Vérification/respect de la complexité (majuscule + minuscule + chiffre + spécial)
3. `MinPasswordAge` passé de `1.00:00:00` à `0`
4. Redémarrages complets de la VM cliente
5. `gpupdate /force` (client)
6. `Set-ADAccountPassword -Reset`
7. `Set-ADUser -ChangePasswordAtLogon $true` (n'activait pas le flag)
8. `Set-ADUser -Replace @{pwdLastSet=0}` (activait bien `PasswordExpired = True`)
9. Désactivation totale de la politique : `ComplexityEnabled $false`, `PasswordHistoryCount 0`, `MinPasswordLength 4`
10. Multiples mots de passe testés : `Azerty123!`, `Bonjour99aA/B/C`, `briac`, etc.
11. Hypothèse clavier QWERTY/AZERTY (écartée)

---

## 5. Manipulations exactes par configuration

### 5.1 Renommage du serveur
Paramètres → Système → Informations système → renommer `WIN-OKCMNTP2HJU` en `NBWS` → redémarrer.

### 5.2 Configuration IP — passage en DHCP
Paramètres → Réseau et Internet → Ethernet → carte interne → Modifier → **Automatique (DHCP)**

> La carte Roubaix a été supprimée des paramètres VM (ESXi). NBWS reçoit 192.168.50.10 depuis la gateway Ubuntu dès le démarrage.

### 5.3 Installation des rôles
Gestionnaire de serveur → Gérer → Ajouter des rôles et fonctionnalités → cocher :
- Services AD DS
- Serveur DNS
- Gestion de stratégie de groupe
- (DHCP installé mais service arrêté)

> L'avertissement « adresse IP statique introuvable » pendant l'install AD DS est un faux positif à ignorer.

### 5.4 Promotion en contrôleur de domaine
Gestionnaire de serveur → triangle d'avertissement jaune → Promouvoir ce serveur en contrôleur de domaine :
- Ajouter une nouvelle forêt
- Nom racine : `networkbriac.local`
- NetBIOS : `NETWORKBRIAC`
- Définir le mot de passe DSRM
- Options DNS par défaut, chemins NTDS/SYSVOL par défaut
- Vérification des prérequis → installer → redémarrage automatique

### 5.5 Création de l'OU et de l'utilisateur
Outils → Utilisateurs et ordinateurs Active Directory :
1. Clic droit sur le domaine → Nouveau → Unité d'organisation → `Etudiants`
2. Clic droit sur l'OU Etudiants → Nouveau → Utilisateur → nom d'ouverture `BriBri` (UPN `BriBri@networkbriac.local`) → définir mot de passe initial

### 5.6 Création du partage réseau
1. Créer le dossier `C:\Partage_Etudiants`
2. Clic droit → Propriétés → onglet Partage → Partage avancé → cocher « Partager ce dossier » → nom `Partage_Etudiants`
3. Autorisations de partage : `Tout le monde` = Lecture
4. Onglet Sécurité (NTFS) : ajouter `BriBri` = Contrôle total

### 5.7 Création des 3 GPO (Gestion de stratégie de groupe)
Toutes liées à l'OU `Etudiants` (clic droit sur l'OU → Créer un objet GPO dans ce domaine et le lier ici → puis clic droit → Modifier).

**GPO fond d'écran :**

Image stockée dans : `C:\Windows\SYSVOL\domain\scripts\really-funny-pictures-vsjsgu4mm5y4vufy.jpg`

Éditeur GPO → Configuration utilisateur → Préférences → Paramètres Windows → Registre → clic droit → Nouveau → Élément de registre :
- Action : Mettre à jour
- Ruche : HKEY_CURRENT_USER
- Chemin : `Control Panel\Desktop`
- Nom : `Wallpaper`
- Type : REG_SZ
- Données : `\\NBWS.networkbriac.local\SYSVOL\networkbriac.local\scripts\really-funny-pictures-vsjsgu4mm5y4vufy.jpg`

Script de logon `wallpaper.bat` ajouté dans : Configuration utilisateur → Stratégies → Paramètres Windows → Scripts → Ouverture de session

> Piège : le fichier image ne doit pas avoir de double extension (`.jpg.jpg`). Vérifier avec `ls C:\Windows\SYSVOL\domain\scripts\` avant de configurer la GPO.

**GPO mappage lecteur Z :**
Éditeur GPO → Configuration utilisateur → Préférences → Paramètres Windows → Mappages de lecteurs → clic droit → Nouveau → Lecteur mappé :
- Action : Créer
- Emplacement : `\\NBWS.networkbriac.local\Partage_Etudiants`
- Reconnecter : coché
- Libeller en tant que : `Partage Etudiants`
- Lettre de lecteur : Utiliser → `Z`
- OK

**GPO blocage YouTube :**
1. Créer le fichier script dans le SYSVOL de la GPO via le bouton « Afficher les fichiers » dans la fenêtre Scripts → Démarrage
2. Contenu du .bat :
```batch
@echo off
echo 0.0.0.0 youtube.com >> C:\Windows\System32\drivers\etc\hosts
echo 0.0.0.0 www.youtube.com >> C:\Windows\System32\drivers\etc\hosts
```
3. Éditeur GPO → Configuration ordinateur → Stratégies → Paramètres Windows → Scripts (démarrage/arrêt) → Démarrage → Ajouter → sélectionner `BlockYoutube.bat` → OK

> Piège : dans « Ajouter un script », le fichier doit déjà exister dans le SYSVOL avant de pouvoir être sélectionné. Utiliser le bouton « Afficher les fichiers » pour y accéder directement.

### 5.8 Désactivation du service DHCP sur NBWS
Le service DHCP de Windows Server doit être arrêté pour éviter les conflits avec le DHCP de la gateway :
```powershell
Stop-Service DHCPServer
Set-Service DHCPServer -StartupType Disabled
```

### 5.9 Correction de l'enregistrement DNS du DC
Après passage en DHCP (nouvelle IP 192.168.50.10), l'ancien enregistrement A pointait vers 192.168.50.1. Correction :
```powershell
Remove-DnsServerResourceRecord -ZoneName "networkbriac.local" -Name "NBWS" -RecordType A -Force
Add-DnsServerResourceRecordA -Name "NBWS" -ZoneName "networkbriac.local" -IPv4Address "192.168.50.10"
```

### 5.10 Jonction du client Windows 10 au domaine
1. Paramètres → Système → Informations système → Modifier (nom/domaine) → sélectionner **Domaine** → `networkbriac.local` → OK
2. Authentification : `Administrateur` + mot de passe admin NBWS
3. Message « Bienvenue dans le domaine networkbriac.local » → redémarrer
4. Connexion `BriBri@networkbriac.local` (ou `NETWORKBRIAC\BriBri`)

### 5.11 Vérifications réseau côté client (commandes utilisées)
```
ipconfig /all                            # vérifier IP DHCP, GW 192.168.50.1, DNS 192.168.50.1
ping 192.168.50.10                       # connectivité NBWS
nslookup NBWS.networkbriac.local         # doit retourner 192.168.50.10 via gateway
nltest /dsgetdc:networkbriac.local       # confirme le DC trouvé
gpupdate /force                          # forcer application des GPO
reg query "HKCU\Control Panel\Desktop" /v Wallpaper   # vérifier valeur registre fond d'écran
net use Z: \\NBWS.networkbriac.local\Partage_Etudiants # test manuel mappage Z
```

---

## 6. Récapitulatif

**Fonctionnel :** domaine networkbriac.local, jonction CLIENT au domaine, authentification BriBri, GPO YouTube (blocage actif), mappage Z fonctionnel manuellement, DNS forward via gateway (Bind9 → NBWS), Internet via NAT gateway.

**Non fonctionnel :** GPO fond d'écran (registre mis à jour mais Windows 10 n'applique pas), GPO mappage Z automatique (objet ordinateur hors OU Etudiants), changement mdp 1ère connexion (contournement temporaire : `ChangePasswordAtLogon $false`).

# Chapitre 3 :  RÉSOLUTION GPO (06/07/2026)

> Suite directe de `Bilan-Lab-WindowsServer-AD.md` (v0) et `Bilan-Lab-WindowsServer-AD_v05072026.md` (v1).
> Ce document clôt les problèmes GPO restés ouverts pendant 2 jours : **fond d'écran** et **mappage automatique du lecteur Z:**.

Domaine : `networkbriac.local` · NetBIOS : `NETWORKBRIAC` · Forêt : `networkbriac.local`
Infra : VM sur ESXi Roubaix, tunnel VPN via BIGWALL
Client de test : Windows 11 (`DESKTOP-FGFBV2J`), remplace l'ancien Windows 10 supprimé.

---

## 1. Résultat final

| GPO | Avant | Après |
|-----|-------|-------|
| Fond d'écran (GPO-Fond-Ecran) | ❌ écran par défaut, ~30 tentatives échouées | ✅ image SYSVOL appliquée automatiquement au logon |
| Mappage lecteur Z (GPO-Mappage-Partage) | ⚠️ fonctionnait uniquement en `net use` manuel | ✅ Z: monté automatiquement au logon |
| Blocage YouTube (GPO-Bloquer-Youtube) | ✅ (déjà OK) | ✅ (inchangé) |

**Les deux GPO problématiques sont désormais résolues et appliquées à la 1ère ouverture de session, sans aucune action manuelle sur le client.**

---

## 2. Les 3 causes racines identifiées

Le blocage n'était pas une seule erreur mais **trois causes cumulées**. Tant que les trois n'étaient pas corrigées ensemble, aucune tentative isolée ne pouvait aboutir — d'où les 2 jours de tentatives infructueuses.

### Cause A — Fast Logon Optimization (concernait fond d'écran ET Z:)
Par défaut, le client Windows applique les GPO **en tâche de fond** avec un cache, pas de façon synchrone au logon. Conséquence : à la 1ère ouverture de session après une modification de GPO, le fond d'écran et le mappage de lecteur **ne s'appliquent pas** (il faudrait ouvrir la session 2 fois). Le rapport `gpresult` affichait pourtant « Une liaison rapide a été détectée » — c'était le symptôme direct.

### Cause B — Chemin SYSVOL erroné dans la GPO fond d'écran
Le chemin configuré pointait vers :
```
\\NBWS.networkbriac.local\SYSVOL\domain\scripts\...
```
Or, **via le partage réseau UNC**, le segment correct après `SYSVOL` n'est pas `domain` mais le **nom du domaine** :
```
\\NBWS.networkbriac.local\SYSVOL\networkbriac.local\scripts\...
```

Explication : `C:\Windows\SYSVOL\domain\` est le chemin **local sur le disque du DC**. Mais le partage réseau `\\NBWS\SYSVOL` pointe déjà à l'intérieur de `domain` et présente son contenu sous le nom du domaine. Donc le `domain` du chemin local **n'existe pas** en accès réseau. Le fichier était introuvable → fond d'écran vide.

**Preuve mesurée** (depuis le client, session BriBri) :
```powershell
# Chemin de la GPO (avec "domain") → ÉCHEC
dir \\NBWS.networkbriac.local\SYSVOL\domain\scripts\really-funny-pictures-vsjsgu4mm5y4vufy.jpg
# → Impossible de trouver le chemin, il n'existe pas

# Chemin réel (avec "networkbriac.local") → SUCCÈS
dir \\NBWS.networkbriac.local\SYSVOL\networkbriac.local\scripts\really-funny-pictures-vsjsgu4mm5y4vufy.jpg
# → -a---- 30/06/2026 22:04 78781 really-funny-pictures-vsjsgu4mm5y4vufy.jpg
```

### Cause C — Action « Créer » bloquée par un mappage manuel préexistant
La préférence de mappage Z: était en action **« Créer »**. Cette action **saute silencieusement si le lecteur existe déjà**. Comme Z: avait été monté manuellement (`net use Z: ...`) et se reconnectait à chaque logon, la GPO trouvait Z: déjà présent et ne faisait rien.

---

## 3. Les corrections appliquées (les 4 modifications gagnantes)

### 3.1 Désactivation de Fast Logon Optimization (nouvelle GPO)
Création d'une GPO `GPO-Fast-Logon-Fix` liée à l'OU `Etudiants` :

`Éditeur GPO → Configuration ordinateur → Stratégies → Modèles d'administration → Système → Ouverture de session →`
**« Toujours attendre le réseau lors du démarrage et de l'ouverture de session de l'ordinateur »** → **Activé**

> Effet visible : l'écran « Bienvenue » devient plus long au logon — c'est normal et attendu, c'est la preuve que les GPO sont désormais traitées **synchronement** au démarrage.

Puis, sur le client, **redémarrage complet** (pas un simple `gpupdate`) pour que cette GPO ordinateur s'applique au boot.

### 3.2 Correction du chemin SYSVOL de la GPO fond d'écran
`GPO-Fond-Ecran → Configuration utilisateur → Stratégies → Modèles d'administration → Bureau → Bureau → « Papier peint du Bureau »`

Ancien chemin (faux) :
```
\\NBWS.networkbriac.local\SYSVOL\domain\scripts\really-funny-pictures-vsjsgu4mm5y4vufy.jpg
```
Nouveau chemin (correct) :
```
\\NBWS.networkbriac.local\SYSVOL\networkbriac.local\scripts\really-funny-pictures-vsjsgu4mm5y4vufy.jpg
```
- Activé : Oui
- Style du papier peint : Ajuster

> Note historique : une version antérieure du chemin dans la GPO avait aussi perdu ses tirets et son `.jpg` (`really-funny-picturesvsjsgu4mm5y4vufy` sans extension). Toujours recopier le chemin au propre et vérifier tirets + extension.

### 3.3 Passage du mappage Z: de « Créer » à « Remplacer »
`GPO-Mappage-Partage → Configuration utilisateur → Préférences → Paramètres Windows → Mappages de lecteurs → Z:`
- Action : **Remplacer** (au lieu de « Créer »)
- Emplacement : `\\NBWS.networkbriac.local\Partage_Etudiants`
- Reconnecter : coché
- Libeller en tant que : `Partage_Etudiants`
- Lettre de lecteur : Utiliser → Z

> « Remplacer » supprime puis recrée le lecteur à chaque logon → robuste, aucun conflit possible avec un mappage préexistant.

### 3.4 Nettoyage du mappage manuel + application propre
Sur le client, en session BriBri :
```powershell
net use Z: /delete /y     # purge le mappage manuel qui bloquait l'action GPO
gpupdate /force
# puis LOGOFF + LOGON complet (le wallpaper et le drive map s'appliquent à l'ouverture de session)
```

---

## 4. Distinction importante — « Lien activé » vs « Appliqué »

Piège de traduction FR rencontré pendant le diagnostic. Dans la console GPMC :

- **« Lien activé » (Link Enabled)** = Oui/Non → détermine si la GPO s'applique. **C'est le paramètre qui compte.** Doit être **Oui**.
- **« Appliqué » (Enforced / forcé)** = Oui/Non → force uniquement la **priorité** de la GPO (écrase les GPO en dessous, ignore un blocage d'héritage). L'état normal est **Non**. Mettre « Appliqué = Oui » partout ne règle rien et peut créer des effets de bord.

Config correcte de l'infra : **Lien activé = Oui**, **Appliqué = Non** pour toutes les GPO.

---

## 5. Méthode de diagnostic qui a débloqué la situation

Plutôt que de continuer à deviner, 3 mesures précises ont tranché :

```powershell
# 1. Le wallpaper est-il écrit dans le registre, et avec quel chemin ?
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" /v Wallpaper
# → la valeur était bien écrite, mais avec le chemin "domain" erroné

# 2. Le fichier image est-il lisible via le chemin de la GPO ?
dir \\NBWS.networkbriac.local\SYSVOL\domain\scripts\really-funny-pictures-vsjsgu4mm5y4vufy.jpg
# → ÉCHEC : c'est ici qu'on a localisé la cause B

# 3. Rapport GPO HTML complet (Détails utilisateur → Préférences / Modèles d'administration)
gpresult /h C:\Users\BriBri\rapport2.html
# → confirme GPO appliquées + montre le chemin résolu et l'action Drive Map
```

**Leçon** : quand une GPO est marquée « appliquée » dans `gpresult` mais n'a aucun effet visible, le problème n'est pas l'application de la GPO mais **son contenu** (chemin invalide, action inadaptée, fichier introuvable). On mesure, on ne suppose pas.

---

## 6. État du lab après cette session

**Entièrement fonctionnel :**
- Domaine `networkbriac.local`, jonction client, authentification BriBri
- Gateway Ubuntu (DHCP, DNS Bind9, NAT, routing)
- GPO blocage YouTube
- **GPO fond d'écran (résolu ce jour)**
- **GPO mappage Z: automatique (résolu ce jour)**
- DNS forward via gateway, Internet via NAT

**Reste ouvert :**
- Changement de mot de passe obligatoire à la 1ère connexion (à retester maintenant que le bug SYSVOL est corrigé — c'était l'hypothèse d'origine).

**Suite envisagée (plus tard) :**
- Serveur PXE pour automatiser l'installation des OS sur les postes clients.
- `redircmp "OU=Etudiants,DC=networkbriac,DC=local"` pour que tout nouveau PC joint au domaine tombe automatiquement dans l'OU Etudiants (au lieu de Computers), sans déplacement manuel.
