---
title: "TP1 - Gestion des Données"
module: "R310"
competence: ["Gérer des données"]
techs: ["PostgreSQL", "Linux", "SQL"]
date: "2026-09-22"
status: "Terminé"
---

# TP1 - Gestion des Données (PostgreSQL)

## Partie 1 : Installation du service PostgreSQL

Installation du service PostgreSQL :
```bash
apt install postgresql postgresql-contrib postgresql-client
systemctl status postgresql
```

Une fois fait, on va modifier le mot de passe et créer la base.

```bash
sudo -u postgres psql
> psql (18.6 (Ubuntu 18.6-0ubuntu0.26.04.1))
Type "help" for help.

postgres=# 
```

Puis on change le mot de passe :
```bash
postgres=# \password postgres
> Enter new password for user "postgres":
Enter it again:
postgres=# 
```
Mot de passe défini : `Azure1234`

Puis on crée la base et on entre dedans via la commande `\c` :
```bash
postgres=# CREATE DATABASE rt3;
> CREATE DATABASE
postgres=# \c rt3
> You are now connected to database "rt3" as user "postgres".
rt3=# 
```

---

## Partie 2 : Création des utilisateurs et du schéma

Un schéma est un espace logique (un dossier) à l'intérieur de la base (ici `rt3`), il permet de grouper et d'isoler des tables.

- `\du` permet de lister les rôles.
- `\dn` permet de lister les schémas.

```bash
rt3=# CREATE USER invite WITH PASSWORD 'Azerty123!';
> CREATE ROLE
rt3=# \du
>                                   List of roles
 Role name |                         Attributes                         
-----------+------------------------------------------------------------
 invite    | 
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS

rt3=# CREATE SCHEMA forum;
> CREATE SCHEMA
rt3=# \dn
>  List of schemas
  Name  |  Owner   
--------+----------
 forum  | postgres
 public | pg_database_owner
(2 rows)

rt3=# 
```

---

## Partie 3 : Création des tables

```bash
rt3=# CREATE TABLE forum.personne (
rt3(# id_personne SERIAL PRIMARY KEY,
rt3(# nom VARCHAR(50),
rt3(# prenom VARCHAR(50),
rt3(# pseudo VARCHAR(50) UNIQUE,
rt3(# date_naissance DATE
rt3(# );
CREATE TABLE
```

Nouveau tableau nommé `personne`, et précision de ranger bien proprement à l'intérieur de `forum`.

Explications des types et contraintes utilisés :
- `SERIAL` pour incrémenter le numéro tout seul à chaque fois qu'on ajoute un nouvel utilisateur.
- `PRIMARY KEY` pour que le numéro soit l'identifiant unique et absolu de cette ligne.
- `VARCHAR(50)` pour une chaîne de caractères de 50 maximum.
- `UNIQUE` pour que si quelqu'un inscrit un pseudo qui existe déjà dans la base, l'insertion soit impossible.
- `DATE` au format AAAA-MM-JJ.
- `INT REFERENCES` pour integer soit un nombre entier, et l'autre pour clé étrangère, ainsi on vérifie que le numéro d'id_personne existe bel et bien dans la table `personne`, si ce n'est pas le cas, le message est refusé.
- `TEXT` permet de stocker des chaînes de caractères d'une longueur illimitée.

```bash
rt3=# CREATE TABLE forum.message (
id_message SERIAL PRIMARY KEY,
id_pesonne INT REFERENCES forum.personne(id_personne),
contenu TEXT
);
CREATE TABLE
rt3=# 
```

Vérification :

```bash
rt3=# \dt forum.*
>           List of tables
 Schema |   Name   | Type  |  Owner   
--------+----------+-------+----------
 forum  | message  | table | postgres
 forum  | personne | table | postgres
(2 rows)

rt3=# 
```

```bash
rt3=# \d forum.personne
rt3=# \d forum.message
rt3=# 
```

---

## Partie 4 : Insertion et vérification des données

```bash
rt3=# INSERT INTO forum.personne (nom, prenom, pseudo, date_naissance) VALUES ('Le Meillat', 'Briac', 'networkbriac', '2025-04-01'),
rt3-# ('Turing', 'Alan', 'enigma', '1972-06-03');
> INSERT 0 2

rt3=# SELECT * FROM forum.personne;
 id_personne |    nom     | prenom |    pseudo    | date_naissance 
-------------+------------+--------+--------------+----------------
           1 | Le Meillat | Briac  | networkbriac | 2025-04-01
           2 | Turing     | Alan   | enigma       | 1972-06-03
(2 rows)

rt3=# 
```

Entretemps j'ai eu une erreur qui a révélé une faute de frappe, alors je l'ai corrigée.

```bash
rt3=# INSERT INTO forum.message (id_personne, contenu) VALUES (1, 'dematt world !'),
(2, 'il n aura fallu que 2 mots pour casser enigma');
> ERROR:  column "id_personne" of relation "message" does not exist
LINE 1: INSERT INTO forum.message (id_personne, contenu) VALUES (1, ...
```

Correction :

```bash
rt3=# ALTER TABLE forum.message RENAME COLUMN id_pesonne TO id_personne;
> ALTER TABLE
```

```bash
rt3=# INSERT INTO forum.message (id_personne, contenu) VALUES (1, 'dematt world !'),
(2, 'il n aura fallu que 2 mots pour casser enigma');
> INSERT 0 2
rt3=# 

rt3=# SELECT * FROM forum.message;
> id_message | id_personne |                      contenu                      
------------+-------------+---------------------------------------------------
          1 |           1 | dematt world !
          2 |           2 | il n aura fallu que 2 mots pour casser enigma
(2 rows)

rt3=# 
```

---

## Partie 5 : Permissions et accès

Donner l'accès à `invite` au schéma `forum` :

```bash
rt3=# GRANT USAGE ON SCHEMA forum TO invite;
> GRANT
rt3=# 
```

`USAGE` est la clé de la porte, sans ça `invite` ne peut même pas voir que les tables existent.

Donner à `invite` le droit d'insérer dans la table `message`.

```bash
rt3=# GRANT INSERT ON forum.message TO invite;
> GRANT
rt3=# 
```

### Tests des permissions en tant qu'invite

Bascule sur `invite` (attention, mettre le mot de passe de l'invite, pas de l'admin).

```bash
root@rt-mv-xu26:/home/administrateur# psql -U invite -d rt3 -h 127.0.0.1
> Password for user invite: 
psql (18.6 (Ubuntu 18.6-0ubuntu0.26.04.1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off, ALPN: postgresql)
Type "help" for help.

rt3=> 
```

Si jamais vous avez oublié de définir un mot de passe pour l'invite :
```sql
ALTER USER invite WITH PASSWORD 'Azerty123!';
```

Veillez également à donner le droit à `invite` sur la séquence permettant de générer automatiquement la clé primaire `id_message` :
```sql
GRANT USAGE ON SEQUENCE forum.message_id_message_seq TO invite;
```
*(Elle attribue le droit d'utiliser l'objet, spécifie la séquence cible, et applique le droit à invite).*

```sql
GRANT DELETE ON forum.message TO invite;
```
*(Attribue le droit de supprimer des enregistrements, spécifie la cible, applique à invite).*

```sql
GRANT SELECT ON forum.message TO invite;
```
*(Pour permettre à invite de lire les données).*

Test insertion :

```bash
rt3=> INSERT INTO forum.message (id_personne, contenu) VALUES (1, 'message test par invite');
> INSERT 0 1
rt3=> 
```

Vérification :
```bash
rt3=# SELECT * FROM forum.message;
> id_message | id_personne |                      contenu                      
------------+-------------+---------------------------------------------------
          1 |           1 | dematt world !
          2 |           2 | il n aura fallu que 2 mots pour casser enigma
          3 |           1 | message test par invite
(3 rows)

rt3=# 
```

Test suppression :

```bash
rt3=> DELETE FROM forum.message WHERE id_message = 3;
> DELETE 1
rt3=> 
```

*(Vérification de la suppression, de retour sur postgres)* :
```bash
rt3=# SELECT * FROM forum.message;
> id_message | id_personne |                      contenu                      
------------+-------------+---------------------------------------------------
          1 |           1 | dematt world !
          2 |           2 | il n aura fallu que 2 mots pour casser enigma
(2 rows)

rt3=# 
```

Test lecture sur personne (erreur attendue `permission denied for table personne`) :

```bash
rt3=> SELECT * FROM forum.personne;
> ERROR:  permission denied for table personne
rt3=> 
```

On se reconnecte ensuite en `postgres` pour afficher la matrice des droits :
```sql
\c rt3 postgres
\z forum.*
```
On voit que dans "access privileges", le champ pour "forum | personne" est vide, donc les privilèges par défaut s'appliquent, donc invite n'est pas listé donc pas de droit.

---

## Partie 6 : Sauvegardes (Dumps)

Les 3 dumps.

Afin de faire `pg_dump` avec les bons privilèges :
```bash
sudo -u postgres pg_dump -d rt3 -n forum > forum_complet.sql
```

Complet :

```bash
root@rt-mv-xu26:/home/administrateur# sudo -u postgres pg_dump -d rt3 -n forum > forum_complet.sql
root@rt-mv-xu26:/home/administrateur# ls
> Desktop     Downloads   Pictures    Templates   forum_complet.sql
Documents   Music       Public      Videos      snap 
```

Structure seule :

```bash
root@rt-mv-xu26:/home/administrateur# sudo -u postgres pg_dump -d rt3 -n forum -s > forum_structure.sql
root@rt-mv-xu26:/home/administrateur# ls
> Desktop     Downloads   Pictures    Templates   forum_complet.sql   snap
Documents   Music       Public      Videos      forum_structure.sql
```

Données :

```bash
root@rt-mv-xu26:/home/administrateur# sudo -u postgres pg_dump -d rt3 -n forum -a > forum_donnees.sql
root@rt-mv-xu26:/home/administrateur# ls
> Desktop     Music       Templates   forum_donnees.sql
Documents   Pictures    Videos      forum_structure.sql
Downloads   Public      forum_complet.sql   snap
```

Schémas backup :

```bash
root@rt-mv-xu26:/home/administrateur# sudo -u postgres psql -d rt3 -c "CREATE SCHEMA backup;"
> CREATE SCHEMA
```

Restauration complète :

```bash
root@rt-mv-xu26:/home/administrateur# sudo -u postgres psql -d rt3 -c "CREATE SCHEMA fullrestore;"
> CREATE SCHEMA
```

```bash
sed 's/forum/fullrestore/g' forum_complet.sql | sudo -u postgres psql -d rt3
```

*(Vérification depuis postgres)* :
```bash
postgres=# \dn
>  List of schemas
  Name  |  Owner   
--------+----------
 public | pg_database_owner
(1 row)

postgres=# \dt backup.*
> Did not find any tables named "backup.*".
postgres=# \dt fullrestore.*
> Did not find any tables named "fullrestore.*".
postgres=# 
```
