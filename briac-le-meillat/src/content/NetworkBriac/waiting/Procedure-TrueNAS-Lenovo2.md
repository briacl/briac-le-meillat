# Mise en place du serveur NAS (Lenovo2 - TrueNAS)

Objectif : installer TrueNAS sur le SSD Samsung 250Go (boot-pool dédié), puis ajouter progressivement les disques de données plus volumineux dans un pool séparé, sans jamais avoir à réinstaller l'OS.

## 1. Matériel de départ

- Lenovo2 : 4Go RAM DDR3
- 2 baies disque disponibles
- SSD Samsung 250Go → réservé exclusivement au boot-pool TrueNAS
- 1 disque de données pour démarrer (au choix selon dispo immédiate, ex : Samsung 750Go)
- Les autres disques (WD 3To, WD 500Go, WD 320Go, Samsung 250Go HDD, 2nd SSD 250Go) seront ajoutés plus tard, une fois la carte contrôleur SATA PCIe installée.

## 2. Téléchargement et préparation de la clé USB d'installation

Depuis un PC annexe (pas le Lenovo2) :

1. Télécharger l'image TrueNAS CORE (ou SCALE selon préférence — CORE = FreeBSD/ZFS natif, plus simple pour débuter ; SCALE = Linux, plus moderne, supporte containers/VM) depuis le site officiel TrueNAS.
2. Graver l'image sur une clé USB (minimum 8Go) avec un outil comme `dd` (Linux/Mac) ou Rufus (Windows) :

```bash
sudo dd if=TrueNAS-XX.iso of=/dev/sdX bs=4M status=progress
```

⚠️ Vérifier `/dev/sdX` avec `lsblk` avant de lancer la commande pour ne pas écraser le mauvais disque.

## 3. Préparation physique du Lenovo2

1. Éteindre la machine, débrancher l'alimentation.
2. Installer **uniquement** le SSD Samsung 250Go dans une des 2 baies pour l'installation initiale (laisser la 2e baie libre pour le disque de données, qu'on ajoutera après installation de l'OS).
3. Brancher la clé USB d'installation.
4. Démarrer, entrer dans le BIOS (touche selon modèle, souvent F2/F12/Del) :
   - Vérifier que le boot sur USB est prioritaire
   - Activer AHCI (pas IDE/RAID) pour le contrôleur SATA si l'option existe
   - Sauvegarder, redémarrer

## 4. Installation de TrueNAS sur le SSD

1. Démarrer sur la clé USB, sélectionner **Install/Upgrade**.
2. Sélectionner le SSD Samsung 250Go comme disque de destination du boot-pool (c'est le seul disque visible à cette étape, donc pas d'ambiguïté).
3. Définir le mot de passe root.
4. Choisir le mode de boot : UEFI si le BIOS du Lenovo2 le supporte, sinon Legacy/BIOS.
5. Confirmer l'installation, attendre la fin, retirer la clé USB, redémarrer.

Au redémarrage, TrueNAS boot directement depuis le SSD et affiche dans la console l'IP attribuée par DHCP (à récupérer pour l'étape suivante).

## 5. Première connexion à l'interface web

Depuis un PC du même réseau :

```
https://IP_LENOVO2/
```

Se connecter avec le compte `root` et le mot de passe défini à l'installation.

### 5.1 Configuration réseau (recommandé : IP fixe)

**Network** → **Interfaces** → modifier l'interface active :
- Désactiver DHCP
- Attribuer une IP statique (ex : 192.168.2.50, en dehors de la plage DHCP du BIGWALL pour éviter les conflits)
- Définir la passerelle (BIGWALL, 192.168.2.1) et le DNS

## 6. Ajout du premier disque de données (Samsung 750Go)

1. Éteindre proprement le Lenovo2 (**Power** → **Shutdown**, pas d'arrêt brutal).
2. Insérer le disque de données (Samsung 750Go) dans la 2e baie libre.
3. Redémarrer.

## 7. Création du pool de données (séparé du boot-pool)

**Storage** → **Pools** → **Add** :
- **Create new pool**
- Nom du pool : ex `data-pool`
- Sélectionner le disque Samsung 750Go disponible (le SSD boot n'apparaît pas dans la liste, il est déjà utilisé par le système)
- Layout : avec un seul disque, le choix est forcément **Stripe** (pas de RAID possible à 1 disque, donc pas de tolérance de panne pour l'instant — c'est normal et temporaire)
- Confirmer la création

À ce stade : OS sur SSD (boot-pool, isolé), données sur Samsung 750Go (data-pool, 1 disque, sans redondance).

## 8. Évolution future du pool (une fois la carte SATA PCIe installée)

Quand tu auras la carte contrôleur SATA (voir doc NAS - extension matérielle) et que tu pourras brancher plusieurs disques simultanément :

### 8.1 Étendre le pool existant (ajouter de la capacité)
**Storage** → **Pools** → sélectionner `data-pool` → **Add Vdev** : permet d'ajouter un nouveau disque/vdev au pool existant sans perdre les données déjà présentes.

⚠️ Limite ZFS : tu ne peux pas transformer après-coup un simple Stripe 1 disque en RAIDZ. Si tu veux passer en RAIDZ1 avec tolérance de panne, il faudra recréer le pool depuis zéro avec tous les disques en même temps (donc prévoir de sauvegarder les données ailleurs avant cette migration si besoin).

### 8.2 Migration recommandée vers RAIDZ1 (sécurité contre panne disque)

Une fois 3 disques ou plus disponibles simultanément (ex : Samsung 750Go + WD 500Go + WD 320Go) :
1. Sauvegarder les données critiques du data-pool actuel ailleurs (disque externe temporaire ou autre).
2. Détruire le pool actuel : **Storage** → **Pools** → **Export/Disconnect** → cocher **Destroy data**.
3. Recréer un nouveau pool en sélectionnant les 3 disques simultanément, layout **RAIDZ1** (tolère la perte d'1 disque sans perte de données, capacité utile = somme des disques - 1 disque de parité).
4. Restaurer les données sauvegardées.

### 8.3 Utilisation du 2e SSD 250Go restant

Une fois la carte SATA installée et un disque/port supplémentaire libre :
**Storage** → **Pools** → sélectionner `data-pool` → **Add Vdev** → type **Cache (L2ARC)** ou **Log (SLOG)** :
- **L2ARC** : étend le cache de lecture, accélère l'accès aux fichiers fréquemment lus.
- **SLOG** : accélère les écritures synchrones (utile surtout si usage NFS/iSCSI intensif, moins critique pour un usage SMB basique).

Pour un usage NAS familial classique, L2ARC est suffisant et plus simple.

## 9. Création d'un partage SMB pour accès depuis le LAN

**Sharing** → **Windows Shares (SMB)** → **Add** :
- Path : sélectionner un dataset dans `data-pool` (créer d'abord un dataset via **Storage** → **Pools** → **Add Dataset**, ex : `documents`)
- Activer le partage
- **Services** → activer le service **SMB** (toggle ON, et activer **Start Automatically**)

Créer un utilisateur NAS dédié : **Credentials** → **Local Users** → **Add**, donner les permissions sur le dataset via **Storage** → **Pools** → dataset → **Edit Permissions**.

## 10. Test d'accès depuis un client du LAN

### macOS
Finder → **CMD+K** → `smb://IP_LENOVO2/documents`

### Windows
Explorateur → barre d'adresse → `\\IP_LENOVO2\documents`

### Linux
```bash
sudo apt install cifs-utils
sudo mount -t cifs //IP_LENOVO2/documents /mnt/nas -o username=USER
```

## 11. Récapitulatif architecture finale visée

```
Lenovo2 (TrueNAS)
├── Boot-pool : SSD Samsung 250Go (OS uniquement, jamais touché par les données)
└── Data-pool : RAIDZ1 (à terme) sur WD 3To + Samsung 750Go + WD 500Go (ou combinaison choisie)
    ├── Cache L2ARC : 2e SSD Samsung 250Go
    └── Datasets : documents, backups, media, etc. (partagés en SMB/NFS sur le LAN)
```

## 12. Points de vigilance

| Risque | Mitigation |
|---|---|
| RAM 4Go limite pour ZFS (recommandé 1Go RAM par To de stockage) | Acceptable pour démarrer petit, prévoir upgrade DDR3 8Go avant migration vers gros volumes (WD 3To) |
| Pas de redondance tant qu'un seul disque dans le pool | Sauvegarder ailleurs en attendant la carte SATA et la migration RAIDZ1 |
| Boot-pool et data-pool sur le même contrôleur SATA limité à 2 ports natifs | La carte PCIe SATA est indispensable avant d'aller au-delà de 2 disques simultanés |
