# Bilan Lab — Windows Server 2025 AD + Client Windows 11 (VMware Roubaix)

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
