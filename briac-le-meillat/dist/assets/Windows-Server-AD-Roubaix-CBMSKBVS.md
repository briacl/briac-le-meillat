# Mise en place Windows Server (AD DS) - VM Roubaix + Test client domaine local
Legort25  
Objectif : configurer le rôle Contrôleur de Domaine (AD DS) sur une VM Windows Server 2025 hébergée à Roubaix (accessible via tunnel VPN par BIGWALL), puis valider la jonction au domaine depuis une machine physique de test chez toi.

## 0. Architecture et tunnel réseau

**BIGWALL (routeur maison, 192.168.2.1)** établit un tunnel VPN vers un serveur à Roubaix, via lequel la VM Windows Server est accessible. 

- VM Windows Server 2025 (Roubaix) : OS déjà installé, disque Windows Server 2025 complet, l'installation physique est déjà faite par ton père.
- Machine physique de test (chez toi) : rejoindra le domaine une fois connectée au réseau tunnel.

Tu n'as donc **rien à installer côté OS**, uniquement à configurer les rôles AD DS sur la VM existante.

## 1. Vérification : accès à la VM depuis le tunnel

Avant de commencer, teste que tu peux accéder à la VM Windows Server via le tunnel :
- Demande à ton père l'**IP de la VM Windows Server 2025** sur le réseau tunnel (ex : 10.0.0.5 ou une IP du réseau privé tunnellisé).
- Depuis une machine chez toi connectée au LAN maison (via BIGWALL), teste :
```
ping <IP_VM>
nslookup <IP_VM>
```

Si ça répond, le tunnel fonctionne. Continue.

## 2. Renommage de la machine et configuration réseau

Accède à la VM (RDP depuis une machine chez toi via le tunnel, ou directement sur la console chez ton père si accès physique) :

**Paramètres système** → renommer en `DC1` (ou un autre nom de domain controller), redémarrer.

Après redémarrage, vérifier l'IP et la passerelle :
**Panneau de configuration** → **Centre Réseau et partage** → vérifier que la connexion réseau est active et a une IP attribuée (soit par DHCP du tunnel, soit statique selon la config de ton père).

## 3. Installation du rôle AD DS

1. **Gestionnaire de serveur** → **Gérer** → **Ajouter des rôles et fonctionnalités**.
2. Cocher **Services AD DS** (Active Directory Domain Services).
3. Cocher aussi **Serveur DNS** (obligatoire pour le fonctionnement du domaine).
4. Valider l'installation, attendre la fin.

### 3.1 Promotion en contrôleur de domaine

1. Dans **Gestionnaire de serveur**, cliquer sur le triangle d'avertissement jaune → **Promouvoir ce serveur en contrôleur de domaine**.
2. Choisir **Ajouter une nouvelle forêt**.
3. Nom de domaine racine, ex : `networkbriac.local` (le suffixe `.local` est conventionnel pour un domaine AD privé, à ne pas confondre avec ton domaine DNS réel `networkbriac.net`).
4. Niveau fonctionnel de la forêt/domaine : choisir le plus récent compatible (Windows Server 2022 pour cette VM).
5. Définir le mot de passe DSRM (Directory Services Restore Mode — mot de passe de secours pour la maintenance AD).
6. Laisser les options DNS par défaut (le serveur DNS va se configurer automatiquement pour le domaine).
7. Vérifier le chemin des bases NTDS/SYSVOL/Logs par défaut (C:\Windows\NTDS, C:\Windows\SYSVOL).
8. Lancer la vérification des prérequis, puis l'installation. Le serveur redémarre automatiquement à la fin.

## 4. Création de l'utilisateur de test

**Outils d'administration** → **Utilisateurs et ordinateurs Active Directory** :
1. Clic droit sur le domaine → **Nouveau** → **Unité d'organisation (OU)**, ex : `Etudiants`.
2. Dans cette OU → **Nouveau** → **Utilisateur** :
   - Nom d'ouverture de session : ex `jdupont`
   - Mot de passe, cocher **L'utilisateur doit changer le mot de passe à la prochaine connexion** (bonne pratique réaliste type établissement)

## 5. Création du partage réseau du domaine

1. Créer un dossier ex `C:\Partage_Etudiants`.
2. Clic droit → **Propriétés** → **Partage avancé** → **Partager ce dossier**, nom de partage `Partage`.
3. **Sécurité** (onglet NTFS) : donner les droits **Modifier** au groupe `Etudiants` ou à l'utilisateur de test.
4. Optionnel : créer une **GPO** pour mapper automatiquement ce partage en lecteur réseau à la connexion (Configuration utilisateur → Préférences → Paramètres Windows → Mappages de lecteurs).

## 6. Jonction du client physique au domaine (machine de test chez toi)

Une machine physique quelconque chez toi (Packard Bell, un laptop, ou un PC désaffecté) va servir de client de test. Elle doit d'abord accéder au tunnel VPN pour voir la VM AD à Roubaix.

### Prérequis client

Demande à ton père comment accéder au VPN du tunnel :
- Est-ce qu'il faut configurer un client VPN spécifique (OpenVPN, WireGuard, etc.) ?
- Ou le tunnel passe-t-il automatiquement par BIGWALL (auquel cas il suffit d'être branché au LAN maison) ?
- A-t-il un profil VPN/config à te donner ?

Une fois connecté au tunnel, la VM Windows Server doit être pingable depuis la machine de test.

### Cas A : Client Windows

1. Vérifier que la machine peut accéder à la VM Roubaix (ping, RDP).
2. **Paramètres** → **Système** → **À propos** → **Renommer ce PC (options avancées)** → onglet **Nom de l'ordinateur** → **Modifier**.
3. Sélectionner **Domaine**, saisir `networkbriac.local` (ou le nom de domaine défini lors de la promotion DC).
4. Authentification avec un compte ayant les droits de joindre une machine au domaine (administrateur du domaine, ex `Administrator` / mot de passe défini à l'étape 4.5).
5. Redémarrer.
6. À l'écran de connexion, sélectionner **Autre utilisateur**, se connecter avec `NETWORKBRIAC\jdupont`.
7. Vérifier l'accès au partage réseau : `\\DC1\Partage` (ou l'IP si nécessaire `\\IP_VM\Partage`).

### Cas B : Client Linux

```bash
sudo apt install realmd sssd sssd-tools adcli samba-common-bin -y
sudo realm discover networkbriac.local
sudo realm join networkbriac.local -U Administrateur
```

Vérifier la jonction :
```bash
realm list
```

Connexion avec le compte du domaine via l'écran de connexion GDM, format `jdupont@networkbriac.local`.

## 7. Vérifications finales

| Test | Commande / Action | Résultat attendu |
|---|---|---|
| DNS du domaine fonctionne | `nslookup networkbriac.local` depuis le client | Résolution vers IP de la VM (Roubaix, tunnel) |
| Compte utilisateur authentifie | Connexion avec `jdupont` sur le client | Session ouverte, profil créé |
| Accès partage réseau | `\\DC1\Partage` ou montage SMB | Accès en lecture/écriture selon droits NTFS |
| GPO appliquée (si configurée) | `gpupdate /force` côté client Windows | Lecteur réseau mappé automatiquement |

## 8. Schéma récapitulatif (infra réaliste type IUT)

```
BIGWALL (192.168.2.1) ← VPN tunnel
    ↓
Roubaix
├── VM Windows Server 2025 → DC1 (AD DS + DNS) → networkbriac.local
└── (Storage partagé, backups, etc.)

Machine physique de test (chez toi, branchée sur BIGWALL)
└── Accès au tunnel → Joint au domaine networkbriac.local
    └── Accès \\DC1\Partage selon droits NTFS définis dans l'OU Etudiants
```

## 9. Points de vigilance

| Risque | Mitigation |
|---|---|
| Tunnel VPN indisponible = domaine inaccessible | C'est la réalité en vrai infra centralisée ; pour du lab isolé, Dell1 physique aurait été plus simple, mais ce setup est plus réaliste |
| DNS du domaine pointe vers IP Roubaix (non local) | Normal, il faut que le client passe par le tunnel pour résoudre le domaine |
| Latence réseau plus importante qu'en local | Acceptable pour une démo/test, mais note que les perfs réseaux seront visibles (login plus lent, etc.) |

