---
title: "Partage Réseau Local (Samba/SMB)"
module: "R103"
competence: ["Administrer"]
ac_lies: ["AC11.04"]
project_type: "perso"
techs: ["Samba", "SMB", "Linux"]
reference_tp: "Inspiré par le TP Interopérabilité des systèmes (Samba)"
date: "2026-06-01"
status: "Terminé"
image: ""
---

# Guide de Partage Réseau local (Samba / SMB)

La technologie recommandée pour le partage de fichiers en réseau local est **SMB (Samba)**. macOS intègre nativement un client SMB, permettant un montage direct des dossiers partagés dans le Finder.

---

## 1. Configuration sur la machine Linux (Ubuntu / Lenovo 1)

### Étape 1 : Installation du service Samba
Mets à jour les dépôts de paquets et installe le service Samba :
```bash
sudo apt update && sudo apt install samba -y
```

---

### Étape 2 : Création du répertoire de partage
Crée le dossier physique qui sera accessible sur le réseau :
```bash
mkdir -p /home/utilisateur/partage
```

---

### Étape 3 : Configuration du fichier `smb.conf`
Ouvre le fichier de configuration de Samba :
```bash
sudo nano /etc/samba/smb.conf
```

Ajoute le bloc suivant tout à la fin du fichier :
```ini
[NetworkBriac]
path = /home/utilisateur/partage
valid users = utilisateur
read only = no
browseable = yes
```

> [!NOTE]
> Remplacer `utilisateur` par ton nom d'utilisateur Ubuntu réel dans le chemin (`path`) et les utilisateurs autorisés (`valid users`).

---

### Étape 4 : Définition du mot de passe Samba
Configure un mot de passe spécifique pour accéder au partage réseau Samba :
```bash
sudo smbpasswd -a utilisateur
```

---

### Étape 5 : Redémarrage du service
Redémarre le démon Samba pour appliquer la nouvelle configuration :
```bash
sudo systemctl restart smbd
```

---

## 2. Accès depuis macOS (Finder)

1. Ouvrir le **Finder** sur ton Mac.
2. Saisir le raccourci clavier **`CMD + K`** (ou aller dans le menu du haut : *Aller -> Se connecter au serveur...*).
3. Entrer l'adresse du serveur :
   ```plaintext
   smb://<IP_LENOVO_1>
   ```
4. Renseigner l'utilisateur et le mot de passe configurés à l'étape 4.