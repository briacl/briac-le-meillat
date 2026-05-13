---
title: "Cheat Sheet : Setup PostgreSQL (CTP R207)"
module: "R207"
competence: "Programmer"
ac_lies: ["AC13.01", "AC13.05"]
techs: ["PostgreSQL", "Linux", "SQL"]
date: "2026-05-12"
status: "Terminé"
---

# Cheat Sheet : Setup PostgreSQL
> **CTP BDD R207** — *Configuration pour le compte guest*

Ce guide vous accompagne dans l'installation et la configuration de PostgreSQL sur votre VM pour l'examen.

---

## 🛠 1. Configuration de la VM
*À effectuer avant le démarrage de la machine virtuelle.*

1. **Carte Réseau** : Accédez aux réglages de la VM > **Réseau**.
2. **Mode** : Sélectionnez **Accès par pont (Bridge)**.
3. **Interface** : Choisissez `eth0` (ou l'interface reliée au réseau de l'IUT).

---

## 2. Installation et Configuration Système
*Exécutez ces commandes dans votre terminal Linux.*

### Étape A : Installation
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
```

### Étape B : Configuration des accès
Nous allons passer de l'authentification `peer` à `scram-sha-256` pour autoriser la connexion par mot de passe.

#### 1. Éditer `pg_hba.conf`
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```
> [!IMPORTANT]
> **Modifiez la ligne suivante :**
> - ❌ `local   all             all                                     peer`
> - ✅ `local   all             all                                     scram-sha-256`
> 
> **Ajoutez cette ligne à la fin du fichier pour autoriser le réseau de l'IUT :**
> ```text
> host    all             all             172.31.0.0/16            scram-sha-256
> ```

#### 2. Éditer `postgresql.conf`
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```
> [!TIP]
> Recherchez la ligne `listen_addresses` et modifiez-la :
> - ❌ `#listen_addresses = 'localhost'`
> - ✅ `listen_addresses = '*'`

#### 3. Redémarrer le service
```bash
sudo systemctl restart postgresql
```

---

## 3. Création de l'utilisateur et de la Base
> [!WARNING]
> Remplacez `votre_nom` par votre login (ex: `briac_lemeillat`).

```bash
# Création de l'utilisateur et de la base (mot de passe : bdrt00)
sudo -i -u postgres psql -c "CREATE USER votre_nom WITH PASSWORD 'bdrt00';"
sudo -i -u postgres psql -c "CREATE DATABASE votre_nom OWNER votre_nom;"
```

---

## 4. Initialisation du Schéma
Connectez-vous à votre base pour finaliser la configuration :

```bash
psql -U votre_nom -d votre_nom -W
# Entrez le mot de passe : bdrt00
```

Une fois connecté au prompt `votre_nom=>`, exécutez :

```sql
-- Création du schéma obligatoire
CREATE SCHEMA votre_nom;

-- Définition du chemin de recherche par défaut
SET search_path TO votre_nom;
```

---

✅ **C'est prêt !**
Vous pouvez maintenant créer vos tables, elles seront directement rangées dans votre schéma personnel.