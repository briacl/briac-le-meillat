# Guide 3 — Dual boot Windows 11 + Ubuntu sur la VM déployée (esprit R&T)

But : reprendre les guides 1 (PXE Ubuntu) et 2 (WDS Windows), et faire qu'une **nouvelle VM** finisse avec **les deux OS** et un **menu de choix au démarrage**, comme les postes de ton département R&T qui proposent Ubuntu/Windows au boot.

> **À savoir avant** : c'est le doc le **plus expérimental** des trois, et hors périmètre "réalisme scolaire" (les établissements ne dual-bootent pas leurs postes — ton département R&T est justement l'exception, parce que vous êtes des étudiants réseau). Fais d'abord marcher les guides 1 et 2 séparément ; attaque le dual boot ensuite, comme un bonus.

---

## Les 3 règles d'or du dual boot (à respecter sinon ça casse)

1. **Tout en UEFI.** Win11 impose l'UEFI, et un dual boot propre repose sur **une seule partition EFI (ESP)** partagée. Pas de BIOS/MBR ici. La VM = EFI (+ vTPM ou bypass, cf. guide 2).

2. **Windows EN PREMIER, Ubuntu ENSUITE.** Windows est "gourmand" : il écrase le bootloader et ignore Linux. Ubuntu, lui, détecte Windows (via `os-prober`) et l'ajoute à son menu GRUB. Donc :
   - Phase 1 = déploiement Windows (guide 2) mais **sur une partie du disque seulement**.
   - Phase 2 = déploiement Ubuntu (guide 1) **dans l'espace libre restant**, en réutilisant l'ESP existante.
   - L'inverse (Ubuntu puis Windows) = Windows efface GRUB → tu perds le menu.

3. **Ne pas laisser un OS effacer tout le disque.** Le piège n°1 : l'autoinstall Ubuntu en `storage: layout: direct` **formate tout le disque** → il détruit Windows. Il faut le forcer à n'utiliser que l'espace libre.

---

## Plan à suivre

### Phase 1 — Windows sur une partie du disque
Reprendre le guide 2 (WDS), mais modifier le partitionnement du **WDSClientUnattend** pour **ne pas** prendre tout le disque :
- EFI System Partition (~500 Mo)
- MSR (16 Mo)
- Partition Windows : **taille fixe** (ex. 60 Go), et **laisser le reste du disque non alloué**.

À la fin, la VM redémarre sur Windows, termine son `specialize` (jonction domaine dans OU Etudiants) → Windows OK, avec de l'espace libre après lui.

> Désactiver le **démarrage rapide Windows** (fast startup) une fois installé : sinon Windows verrouille les partitions/ESP et Ubuntu peut avoir du mal à écrire dedans.

### Phase 2 — Ubuntu dans l'espace libre
Reprendre le guide 1 (PXE gateway), mais **changer la section `storage`** de l'autoinstall pour qu'il :
- **N'efface pas** le disque (donc **pas** `layout: direct`).
- Installe la racine `/` dans **l'espace non alloué** laissé par Windows.
- **Réutilise l'ESP existante** (ne PAS créer une 2e partition EFI) et y installe GRUB.
- Active `os-prober` pour détecter Windows.

C'est la partie la plus délicate à écrire en YAML du premier coup. **Recommandation niveau 1A** : pour cette phase, fais le partitionnement **une fois en semi-manuel** (installeur Ubuntu en mode interactif juste pour l'étape disque : "installer à côté de Windows" / partitionnement manuel dans l'espace libre), puis **récupère la config `storage` générée** (l'installeur écrit le `storage:` correspondant dans `/var/log/installer/autoinstall-user-data`) et **recopie-la dans ton `user-data`** pour automatiser complètement les fois suivantes. Tu mesures la bonne config au lieu de la deviner (comme pour le debug GPO).

### Phase 3 — Le bootloader final
Après la phase 2, GRUB (Ubuntu) devient le gestionnaire de boot par défaut dans l'ESP. Pour qu'il affiche Windows :
- Dans `/etc/default/grub` : `GRUB_DISABLE_OS_PROBER=false` (sur Ubuntu récent, os-prober est **désactivé par défaut**, d'où un Windows invisible si on oublie).
- Puis `update-grub` → il détecte "Windows Boot Manager" et l'ajoute.
Résultat : au démarrage, menu GRUB → **Ubuntu** ou **Windows Boot Manager**.

---

## Le "menu PXE unique" (le vrai esprit R&T, en option avancée)

Problème : le `filename` DHCP ne peut pointer qu'un seul serveur de boot à la fois (gateway pour Ubuntu, WDS pour Windows). Deux façons de gérer les deux phases :

**Option simple (pour démarrer)** : tu bascules manuellement le `next-server`/`filename` dans `dhcpd.conf` entre la phase 1 (→ WDS) et la phase 2 (→ gateway). Rustique mais ça marche.

**Option élégante (esprit R&T)** : tu fais pointer le DHCP vers **un seul GRUB EFI sur la gateway**, qui affiche un **menu** :
```
menuentry "1. Deployer Windows 11 (via WDS)" {
    # chainload du bootloader WDS sur NBWS
    chainloader (tftp,192.168.50.10)/boot/x64/wdsmgfw.efi
}
menuentry "2. Installer Ubuntu (autoinstall)" {
    linux vmlinuz ip=dhcp autoinstall ds=nocloud-net;s=http://192.168.50.1/autoinstall/ url=http://192.168.50.1/iso/
    initrd initrd
}
```
Un seul PXE, tu choisis l'OS à déployer au boot. C'est l'objectif à viser une fois les deux phases maîtrisées séparément — pas avant.

---

## Pièges à anticiper (récap dual boot)

- **Ordre d'install** : Windows d'abord, Ubuntu ensuite. Le non-respect = perte du menu.
- **`storage: direct` Ubuntu** : efface tout → détruit Windows. Cibler l'espace libre.
- **Deux ESP créées** : confusion de boot. Réutiliser l'ESP unique.
- **os-prober désactivé par défaut** sur Ubuntu récent → Windows absent du menu.
- **Secure Boot + GRUB** : OK grâce au shim signé Ubuntu, mais garder Secure Boot cohérent entre les deux phases.
- **Fast startup Windows** activé → ESP/partitions verrouillées → désactiver.
- **vTPM / bypass LabConfig** : mêmes prérequis Win11 que le guide 2.

## Portée du domaine
Seul **Windows** rejoint le domaine `networkbriac.local` (via l'unattend du guide 2). Le côté **Ubuntu reste autonome** (compte local). Faire joindre Ubuntu à l'AD (realmd/sssd/Kerberos) est un autre chantier, hors périmètre ici — à noter si tu veux pousser plus tard.
