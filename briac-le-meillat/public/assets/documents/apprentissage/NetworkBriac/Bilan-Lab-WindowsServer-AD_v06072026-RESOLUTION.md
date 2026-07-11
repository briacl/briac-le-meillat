# Bilan Lab — Windows Server 2025 AD + Client Windows 11 — RÉSOLUTION GPO (06/07/2026)

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
