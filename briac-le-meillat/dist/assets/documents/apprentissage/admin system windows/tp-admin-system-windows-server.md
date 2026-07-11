---
title: "Administration Système Windows Server 2016"
module: "R202"
competence: "Administrer"
ac_lies: ["AC11.01", "AC11.02", "AC11.05"]
techs: ["Windows Server", "Active Directory", "DHCP", "GPO", "PowerShell", "NTFS"]
date: "2026-02-01"
status: "Terminé"
image: "/assets/projects/windows-admin.webp"
---

# Compte-Rendu Technique : Administration Windows Server 2016
> **R202 — Administration Système** — *Briac Le Meillat (Janvier – Février 2026)*

**Objectif :** Mettre en place le déploiement complet d'une infrastructure centralisée sous Windows Server 2016. La topologie met en jeu deux machines virtuelles interconnectées en réseau interne : un **Contrôleur de domaine** `srv-LeMeillat` gérant le domaine `dom-LeMeillat.local`, et un **poste client** `client-LeMeillat` (Windows 10 Pro). Les travaux couvrent le DHCP, l'Active Directory, la sécurité NTFS, les profils itinérants, l'automatisation PowerShell et le déploiement de logiciels par GPO.

---

## 🌐 1. Installation et Configuration du Serveur DHCP

### 💡 L'explication vulgarisée

Le serveur DHCP, c'est le **gardien des adresses IP** de votre réseau. Plutôt que de configurer manuellement chaque machine, le DHCP distribue automatiquement une adresse IP, une passerelle, un DNS — tout le nécessaire pour qu'un poste démarre et sache où aller sur le réseau.

La **réservation DHCP**, c'est comme une place de parking nominative : l'adresse `172.31.19.119` est réservée au client dont l'adresse MAC correspond, et uniquement lui.

---

### 🖥️ Configuration du rôle DHCP

#### Installation du rôle

Le rôle **Serveur DHCP** est installé via l'assistant d'ajout de rôles et de fonctionnalités du Gestionnaire de serveur.

> [!NOTE]
> Pour éviter tout conflit avec le réseau physique de l'IUT, l'étendue est volontairement restreinte à **une seule adresse IP** dédiée au client virtuel.

#### Réservation statique IP / MAC

| Paramètre | Valeur |
|---|---|
| Nom de la réservation | `client-LeMeillat` |
| Adresse IP allouée | `172.31.19.119` |
| Adresse MAC associée | `08:00:27:30:a6:dd` |

#### Options d'étendue configurées

| Option DHCP | Valeur |
|---|---|
| 003 Routeur (Passerelle) | `172.31.16.1` |
| 006 Serveurs DNS | `172.31.19.118` puis `193.49.62.9` |
| 015 Nom de domaine DNS | `univ-artois.fr` |
| 004 Serveur de temps (NTP) | `172.31.25.9` |

> [!NOTE]
> Le serveur DNS primaire pointe vers l'IP locale du contrôleur de domaine (`172.31.19.118`) — indispensable pour que le client puisse résoudre le nom du domaine Active Directory et s'y joindre.

#### Validation côté client

Après passage du client en adressage automatique, `ipconfig /all` valide la bonne réception des paramètres :

```dos
C:\Users\admin>ipconfig /all

Configuration IP de Windows
   Nom de l'hôte . . . . . . . . . . . . . : client-LeMeillat
   Suffixe DNS principal . . . . . . . . . : univ-artois.fr

Carte Ethernet Ethernet:
   Adresse physique. . . . . . . . . . . . : 08-00-27-8A-29-68
   DHCP activé. . . . . . . . . . . . . . : Oui
   Adresse IPv4. . . . . . . . . . . . . . : 172.31.19.119 (préféré)
   Masque de sous-réseau. . . . . . . . . : 255.255.240.0
   Passerelle par défaut. . . . . . . . . : 172.31.16.1
   Serveur DHCP. . . . . . . . . . . . . . : 172.31.19.118
   Serveurs DNS. . . . . . . . . . . . . . : 172.31.19.118
                                             193.49.62.9
```

---

## 🏛️ 2. Active Directory et Stratégies de Groupe (GPO)

### 💡 L'explication vulgarisée

**Active Directory**, c'est l'**annuaire central** de l'entreprise : il recense tous les utilisateurs, tous les groupes, tous les ordinateurs du domaine. C'est le seul endroit où l'on définit "qui a le droit de faire quoi".

Les **GPO** (Group Policy Objects), ce sont des **règlements internes distribués automatiquement**. Dès qu'un utilisateur ouvre une session, le serveur lui pousse silencieusement un ensemble de règles : complexité de son mot de passe, logiciels installés, imprimantes disponibles — sans qu'il ait à faire quoi que ce soit.

---

### 🖥️ Création des groupes et utilisateurs

Deux groupes de sécurité sont créés dans l'Active Directory :

| Groupe | Étendue | Type | Membres |
|---|---|---|---|
| `eleves` | Globale | Sécurité | `etu01` |
| `Profs` | Globale | Sécurité | `prof01` |

> [!NOTE]
> **Étendue Globale** : permet d'inclure des utilisateurs du domaine et d'être imbriqué dans des groupes locaux de ressources pour l'attribution de droits NTFS et de partages.

### 🖥️ Configuration des GPO

Deux GPO sont modifiées pour répondre au scénario pédagogique :

**Default Domain Policy :**
- Désactivation de l'exigence de complexité des mots de passe
- Longueur minimale du mot de passe fixée à 0 caractère

> [!WARNING]
> Ces assouplissements sont strictement réservés au contexte de TP. En production, les mots de passe complexes et une longueur minimale de 12 caractères sont impératifs.

**Default Domain Controllers Policy :**
- Ajout explicite de `dom-LeMeillat\eleves` et `dom-LeMeillat\Profs` dans le droit **« Permettre l'ouverture d'une session locale »** (`SeInteractiveLogonRight`)
- Le groupe **Administrateurs** est conservé pour éviter tout verrouillage

---

## 💾 3. Stockage, Partages et Sécurité NTFS

### 💡 L'explication vulgarisée

Les **droits NTFS** sont les serrures sur chaque tiroir du coffre-fort. Même si quelqu'un accède au réseau, il ne peut lire que ce que vous lui autorisez.

L'astuce du **partage masqué** (`$`) : en ajoutant un `$` à la fin du nom de partage, le dossier reste invisible dans l'explorateur réseau standard — seuls ceux qui connaissent le chemin exact (`\\srv-LeMeillat\etu01$`) peuvent y accéder.

---

### 🖥️ Initialisation du volume de stockage

Un second disque dur virtuel de **1 Go** est raccordé à la VM. Depuis la console **Gestion des disques** :
1. Initialisation du disque
2. Formatage en **NTFS**
3. Montage sous le nom `volume`

L'arborescence `C:\volume\Utilisateurs` est créée pour héberger les répertoires personnels.

### 🖥️ Sécurisation NTFS par utilisateur

| Cible | Permissions |
|---|---|
| Utilisateur lui-même (`etu01`) | Contrôle total `(OI)(CI)F` |
| Groupe `Administrateurs` | Contrôle total `(OI)(CI)F` |
| Groupe `Profs` | Lecture seule sur les dossiers élèves |

> [!NOTE]
> **Partages masqués** : le suffixe `$` (ex: `etu01$`) rend le dossier partagé invisible lors du parcours réseau standard. L'accès direct par chemin UNC reste possible pour les utilisateurs autorisés.

---

## 🔄 4. Profils Itinérants et Script de Connexion

### 💡 L'explication vulgarisée

Un **profil itinérant**, c'est la **mallette de travail personnelle** d'un utilisateur, stockée sur le serveur. Où qu'il ouvre sa session — sur n'importe quel poste du domaine — il retrouve son bureau, ses documents, ses paramètres.

Le **script de connexion** est un automatisme déclenché à chaque ouverture de session : il monte un lecteur réseau personnel `R:` pointant vers le dossier de l'utilisateur connecté.

---

### 🖥️ Profil itinérant

Le compte `etu01` est configuré avec le chemin de profil suivant dans Active Directory :

```
\\srv-LeMeillat\Utilisateurs\etu01\profil
```

Pour que chaque nouvel utilisateur du domaine trouve un fichier de bienvenue sur son bureau dès la première connexion, `bienvenue.txt` est déposé dans le répertoire modèle par défaut :

```
C:\Users\Default\Desktop\
```

### 🖥️ Script de connexion automatique (NETLOGON)

Le fichier `common.bat` est placé dans le partage NETLOGON du contrôleur de domaine :

```
C:\Windows\SYSVOL\sysvol\dom-LeMeillat.local\scripts\common.bat
```

```dos
@echo off
net use R: /delete /yes
net use R: \\srv-LeMeillat\Utilisateurs\%USERNAME%
```

> [!NOTE]
> La variable `%USERNAME%` est résolue dynamiquement au moment de l'ouverture de session — un seul script générique suffit pour tous les utilisateurs du domaine.

---

## ⚙️ 5. Automatisation PowerShell — Création de comptes en masse

### 💡 L'explication vulgarisée

Créer un utilisateur à la main dans l'interface graphique, c'est accepter de recommencer 30 fois la même procédure pour une classe entière. Le script PowerShell automatise tout : création du compte AD, ajout au groupe, création du dossier, partage réseau masqué, droits NTFS stricts — **en une seule commande**.

---

### 🖥️ Script `create_user.ps1`

```powershell
# --- RECONSTITUTION DES ARGUMENTS ---
$Nom    = $args[0]
$Prenom = $args[1]
$Groupe = $args[2]

# --- CONFIGURATION LOCALE ---
$DomainName     = "dom-LeMeillat"
$ServerName     = "srv-LeMeillat"
$SecurePassword = ConvertTo-SecureString "Password123" -AsPlainText -Force
$RootPath       = "C:\volume\Utilisateurs"

# 1. CRÉATION DU COMPTE UTILISATEUR DANS ACTIVE DIRECTORY
Write-Host "Création du compte : $Prenom $Nom"
New-ADUser -Name "$Prenom $Nom" `
           -SamAccountName "$Nom" `
           -UserPrincipalName "$Nom@$DomainName.local" `
           -AccountPassword $SecurePassword `
           -Enabled $true `
           -Path "CN=Users,DC=$DomainName,DC=local" `
           -ScriptPath "common.bat"

# 2. AJOUT DE L'UTILISATEUR À SON GROUPE RESPECTIF
Write-Host "Ajout au groupe : $Groupe"
Add-ADGroupMember -Identity "$Groupe" -Members "$Nom"

# 3. CRÉATION DU RÉPERTOIRE PHYSIQUE SUR LE VOLUME
$UserDir = "$RootPath\$Nom"
Write-Host "Création du dossier : $UserDir"
New-Item -Path $UserDir -ItemType Directory -Force

# 4. CRÉATION DU PARTAGE RÉSEAU SMB CACHÉ ($)
Write-Host "Création du partage SMB..."
New-SmbShare -Name "$Nom`$" -Path $UserDir -FullAccess "Tout le monde"

# 5. SÉCURISATION NTFS VIA ICACLS
Write-Host "Application des droits de sécurité..."
icacls $UserDir /grant "$DomainName\$Nom`:(OI)(CI)F"
icacls $UserDir /grant "Administrateurs:(OI)(CI)F"

Write-Host "Terminé avec succès."
```

### 🖥️ Exécution et rollback

Instanciation d'un enseignant `olivier gombert` dans le groupe `profs` :

```powershell
PS C:\> .\create_user.ps1 gombert olivier profs
```

En cas d'erreur, rollback propre en trois commandes :

```powershell
PS C:\volume\Utilisateurs> Remove-ADUser -Identity gombert -Confirm:$false
PS C:\volume\Utilisateurs> Remove-SmbShare -Name "gombert$" -Force
PS C:\volume\Utilisateurs> Remove-Item -Path "C:\volume\Utilisateurs\gombert" -Recurse -Force
```

> [!TIP]
> Le rollback en trois étapes garantit la cohérence : suppression AD, suppression du partage réseau, puis purge physique du répertoire. Inverser l'ordre risque de laisser des partages orphelins inaccessibles.

---

## 🖨️ 6. Quotas, Déploiement de Logiciels et Imprimante Réseau

### 💡 L'explication vulgarisée

Les **quotas de disque** sont les limites de remplissage de chaque casier : passé 1 Go, le système refuse toute nouvelle écriture. Sans quotas, un seul utilisateur peut saturer le volume entier.

Le **déploiement de logiciels par GPO** est l'équivalent d'une mise à jour silencieuse obligatoire : au démarrage du poste client, Windows installe automatiquement le logiciel défini dans la stratégie — sans intervention de l'utilisateur.

---

### 🖥️ Configuration des quotas de disque

Quotas activés sur le volume dédié :

| Paramètre | Valeur |
|---|---|
| Limite d'espace disque | 1 Go |
| Niveau d'avertissement | 900 Mo |
| Comportement au dépassement | Écriture refusée strictement |

### 🖥️ Déploiement de Notepad++ par GPO

1. Création d'une **Unité d'Organisation (OU)** nommée `Machines Cibles`
2. Déplacement de l'objet ordinateur client dans cette OU
3. Création et liaison d'une GPO `notepad++` à cette OU
4. Configuration du package MSI `npp6.9.2.installer.msi` sous :
   `Configuration ordinateur → Stratégies → Paramètres du logiciel → Installation de logiciel`
5. Mode de déploiement : **Attribué** (installation silencieuse au démarrage)

### 🖥️ Déploiement de l'imprimante réseau

Le rôle **Services d'impression et de numérisation** est activé sur le contrôleur de domaine. L'imprimante `imprimante-salle-h111` est configurée avec le pilote **HP Universal Printing PCL 6**.

> [!WARNING]
> **Anomalie rencontrée :** lors du déploiement initial via la console d'impression, l'erreur `Une référence a été renvoyée par le serveur` est apparue. Contournement : la GPO d'imprimante a été générée manuellement depuis la console GPMC, liée à la racine du domaine, puis associée à la ressource d'impression en mode déploiement par ordinateur.

Pour forcer la prise en compte immédiate sur le client :

```dos
C:\Users\admin> gpupdate /force
```

L'imprimante réseau remonte instantanément dans le panneau de configuration du client.

---

## ✅ Conclusion

Ce cycle de TP valide le déploiement complet d'une architecture centralisée et sécurisée sous Windows Server 2016. L'association des partages masqués, des droits NTFS stricts par profil, des quotas de disque et des scripts PowerShell garantit une gestion industrialisée et scalable du cycle de vie des utilisateurs dans une infrastructure R&T.

> [!TIP]
> **Récapitulatif des briques déployées :**
> - 🌐 **DHCP** : attribution centralisée avec réservation MAC et options d'étendue complètes
> - 🏛️ **Active Directory + GPO** : groupes, utilisateurs, politique de sécurité domaine
> - 💾 **NTFS + Partages masqués** : confidentialité par utilisateur, visibilité contrôlée
> - 🔄 **Profils itinérants + Script NETLOGON** : mobilité et montage réseau automatique
> - ⚙️ **PowerShell** : création de masse, partage SMB, droits NTFS, rollback propre
> - 🖨️ **GPO logiciels + Quotas** : déploiement silencieux et gouvernance du stockage
