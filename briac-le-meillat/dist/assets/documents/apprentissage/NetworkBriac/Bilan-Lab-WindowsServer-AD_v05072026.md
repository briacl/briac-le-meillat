# Bilan Lab — Windows Server 2025 AD + Client Windows 10 (VMware Roubaix)

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
