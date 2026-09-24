---
title: "SAÉ 2.3 — MiniGPT : Interface de chat administrée"
module: "SAÉ 2.3"
competence: "Programmer"
ac_lies: ["AC13.01"]
techs: ["Python", "Flask", "MySQL", "Docker", "Jinja2"]
date: "2026-06-02"
status: "Terminé"
image: ""
---

# 📖 Bible Finale — MiniGPT
### Le guide exhaustif pour recréer le projet de A à Z

> **Mode d'emploi :** Lis chaque section dans l'ordre. Chaque étape commence par une **explication simple** ("C'est quoi ?"), puis plonge dans le **code commenté ligne par ligne**. Si tu appliques ce document dans l'ordre, tu auras un MiniGPT fonctionnel en environ 2h30.

---

## 🗺️ Vue d'ensemble : Le Système Complet

```
┌─────────────────────────────────────────────────────────────────┐
│                     TON NAVIGATEUR WEB                          │
│   (tu tapes http://localhost:5000 → tu vois l'interface)        │
└─────────────────────┬───────────────────────────────────────────┘
                      │  Requête HTTP (GET/POST)
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│               CONTENEUR DOCKER "app"                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  app/app.py (Flask)                       │   │
│  │  Le routeur : reçoit les URLs, appelle les bons modules   │   │
│  │                                                           │   │
│  │   ┌─────────────┐   ┌─────────────┐   ┌──────────────┐  │   │
│  │   │  models.py  │   │  gemini.py  │   │  templates/  │  │   │
│  │   │  (SQL ↕ DB) │   │  (IA ↕ API)│   │  (HTML affiché)│ │   │
│  │   └──────┬──────┘   └──────┬──────┘   └──────────────┘  │   │
│  └──────────┼─────────────────┼──────────────────────────────┘  │
└─────────────┼─────────────────┼────────────────────────────────┘
              │                 │
              ▼                 ▼
┌─────────────────┐    ┌─────────────────────┐
│ CONTENEUR DOCKER│    │  GOOGLE GEMINI API   │
│     "db"        │    │  (serveurs Google)   │
│  MySQL 8.0      │    │  gemini-flash-latest │
│                 │    │                      │
│  ┌───────────┐  │    │  Reçoit l'historique │
│  │  users    │  │    │  + la question       │
│  │  convs    │  │    │  → renvoie réponse   │
│  │  messages │  │    │                      │
│  └───────────┘  │    └─────────────────────┘
└─────────────────┘
         ▲
         │  PMA_HOST=db (réseau Docker interne)
         │
┌─────────────────┐
│ CONTENEUR DOCKER│
│  "phpmyadmin"   │
│  port 8081      │
│                 │
│  Interface web  │
│  graphique pour │
│  gérer MySQL    │
│  (alternative   │
│  aux commandes) │
└─────────────────┘
         ▲
         │  http://localhost:8081
         │
    TON NAVIGATEUR
```

**Comment les fichiers se parlent :**
```
.env ──────────────────► tous les fichiers lisent les secrets ici
docker-compose.yml ────► lance "db", "app" et "phpmyadmin" ensemble
Dockerfile ────────────► construit l'image de "app"
db/init.sql ───────────► crée les tables au 1er démarrage de "db"

app/app.py ────────────► importe models.py et gemini.py
              ├─────────► appelle models.create_user() pour créer un user
              ├─────────► appelle models.get_messages() pour charger l'historique
              ├─────────► appelle gemini.get_gemini_response() pour l'IA
              └─────────► render_template('index.html', ...) pour afficher

app/models.py ─────────► parle à MySQL via pymysql
app/gemini.py ─────────► parle à Google via google-genai
app/templates/ ────────► HTML + Jinja2 (variables Python dans le HTML)
```

---

## ⚙️ ÉTAPE 0 — L'Arborescence (5 min)

### C'est quoi ?

Avant d'écrire une seule ligne de code, il faut **créer les dossiers**. C'est comme construire les pièces d'une maison avant de les meubler. Chaque dossier a un rôle précis et ne doit contenir que ce qui lui appartient.

### La commande à lancer
```bash
mkdir -p app/templates app/static/src/css app/static/dist/css db
```
- `mkdir` : crée un dossier
- `-p` : crée aussi les dossiers parents s'ils n'existent pas
- On crée tout d'un coup avec les chemins imbriqués

### Structure finale expliquée
```
minigpt/                    ← racine du projet
│
├── .env                    ← SECRETS (jamais versionné dans Git !)
├── .gitignore              ← liste ce que Git doit ignorer
├── Dockerfile              ← recette pour construire la boîte Python
├── docker-compose.yml      ← chef d'orchestre : lance tout
├── requirements.txt        ← liste des librairies Python à installer
│
├── db/
│   └── init.sql            ← le plan SQL (crée les tables au 1er lancement)
│
└── app/
    ├── __init__.py         ← fichier vide = dit à Python que app/ est un "package"
    ├── app.py              ← le cerveau : gère toutes les URLs
    ├── models.py           ← le traducteur : parle à MySQL
    ├── gemini.py           ← l'ambassadeur : parle à l'API Google
    │
    ├── static/
    │   ├── src/css/        ← CSS source (Tailwind input)
    │   └── dist/css/       ← CSS compilé (ce que le navigateur lit)
    │
    └── templates/
        ├── login.html      ← page de connexion
        ├── register.html   ← page d'inscription
        ├── index.html      ← page principale du chat
        └── admin.html      ← tableau de bord administrateur
```

---

## 🐳 ÉTAPE 1 — L'Infrastructure Docker (15 min)

### C'est quoi ?

**Le problème :** Pour faire tourner ce projet, il faut Python, Flask, MySQL... Si chaque développeur installe tout à la main, ça marche différemment sur chaque machine. C'est le cauchemar classique : *"ça marche sur mon PC !"*.

**La solution Docker :** Docker crée des **conteneurs** — des mini-ordinateurs virtuels ultra-légers, chacun avec son propre environnement. On décrit une fois ce qu'on veut, et Docker le recrée identique partout.

Notre projet utilise **2 conteneurs** :
- `app` : la boîte Python/Flask (le cerveau)
- `db` : la boîte MySQL (la mémoire)

```
Ta machine (hôte)
├── Conteneur "app" (Python 3.9 + Flask + toutes les libs)
│   └── code source monté via volume (tu modifies → il voit)
└── Conteneur "db" (MySQL 8.0)
    └── données stockées dans un volume persistant
```

---

### Fichier 1/4 — `.env` (Les Secrets)

**C'est quoi ?** Un fichier qui contient toutes les valeurs sensibles (mots de passe, clés API) **séparées du code**. Ainsi, tu peux partager ton code sans exposer tes secrets. C'est une bonne pratique universelle.

> ⚠️ **Ce fichier ne doit JAMAIS être mis sur GitHub.** Le `.gitignore` est là pour ça.

```env
# Configuration de la base de données
DB_HOST=db                    # ← "db" = le nom du service dans docker-compose.yml
                              #   Docker crée un DNS interne : "db" pointe vers le conteneur MySQL
DB_USER=sae_user              # ← utilisateur MySQL (pas root, bonne pratique sécurité)
DB_PASSWORD=motdepasse        # ← son mot de passe
DB_NAME=minigpt               # ← nom de la base de données à utiliser
DB_ROOT_PASSWORD=root_password # ← mot de passe du super-admin MySQL (pour les opérations admin)

# Configuration Flask
SECRET_KEY=dev_secret_key_change_me  # ← clé secrète pour signer les cookies de session
                                      #   En production, doit être une vraie chaîne aléatoire

# Configuration Gemini API
GEMINI_API_KEY=ta_cle_api_ici  # ← ta clé obtenue sur https://aistudio.google.com
```

---

### Fichier 2/4 — `Dockerfile` (La Recette)

**C'est quoi ?** Une liste d'instructions pour construire l'image Docker de notre application Python. C'est comme une recette de cuisine : à chaque instruction, Docker ajoute une couche à l'image.

```dockerfile
FROM python:3.9-slim
# ← "Je pars d'une image de base : Python 3.9 en version légère"
# "slim" = sans les outils de compilation inutiles → image plus petite

WORKDIR /app
# ← "Toutes les prochaines commandes s'exécutent dans le dossier /app"
# Si /app n'existe pas, Docker le crée automatiquement

COPY requirements.txt .
# ← "Copie le fichier requirements.txt de ma machine vers /app/ dans le conteneur"
# On copie SEULEMENT ce fichier d'abord (optimisation : si requirements.txt ne change pas,
# Docker réutilise le cache de la couche suivante)

RUN pip install --no-cache-dir -r requirements.txt
# ← "Installe toutes les librairies listées dans requirements.txt"
# "--no-cache-dir" : ne garde pas de cache pip → image plus légère

COPY . .
# ← "Copie TOUT le reste de ma machine vers /app/ dans le conteneur"
# C'est fait APRÈS l'install pour profiter du cache Docker

EXPOSE 5000
# ← "Informe Docker que ce conteneur va écouter sur le port 5000"
# C'est déclaratif : ne fait pas d'ouverture de port tout seul

CMD ["python", "app/app.py"]
# ← "Commande lancée quand le conteneur démarre"
# Equivalent à taper "python app/app.py" dans le terminal
```

---

### Fichier 3/4 — `docker-compose.yml` (Le Chef d'Orchestre)

**C'est quoi ?** Là où le Dockerfile définit UNE boîte, `docker-compose.yml` définit **PLUSIEURS boîtes et comment elles fonctionnent ensemble**. C'est lui qu'on lance avec `docker compose up`.

```yaml
services:              # ← déclare la liste des conteneurs à créer

  db:                  # ← nom du 1er service (= nom DNS interne dans le réseau Docker)
    image: mysql:8.0   # ← utilise l'image officielle MySQL version 8.0 (téléchargée depuis Docker Hub)
    restart: always    # ← si le conteneur crash, Docker le relance automatiquement
    environment:       # ← variables d'environnement injectées dans le conteneur MySQL
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}  # ← ${...} lit la valeur depuis le .env
      MYSQL_DATABASE: ${DB_NAME}                # ← crée cette base de données au 1er démarrage
      MYSQL_USER: ${DB_USER}                    # ← crée cet utilisateur
      MYSQL_PASSWORD: ${DB_PASSWORD}            # ← avec ce mot de passe
    ports:
      - "3307:3306"    # ← "port de ta machine : port dans le conteneur"
                       #   3306 est le port standard MySQL, on l'expose en 3307 sur l'hôte
                       #   (évite les conflits si MySQL est aussi installé localement)
    volumes:
      - db_data:/var/lib/mysql
      # ← volume nommé : les données MySQL sont stockées dans "db_data" (géré par Docker)
      #   Même si tu fais "docker compose down", les données survivent
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
      # ← monte notre fichier SQL dans un dossier SPÉCIAL de MySQL
      #   Tout fichier .sql dans ce dossier est exécuté automatiquement au 1er démarrage

  app:                 # ← nom du 2ème service
    build: .           # ← "construis l'image en utilisant le Dockerfile dans le dossier courant (.)"
    ports:
      - "5000:5000"    # ← accès via http://localhost:5000
    volumes:
      - .:/app         # ← LE VOLUME MAGIQUE : lie ton dossier local au /app du conteneur
                       #   Tu modifies un fichier sur ta machine → Flask le voit IMMÉDIATEMENT
                       #   C'est ce qui permet le "hot reload" sans reconstruire l'image
    depends_on:
      - db             # ← "ne démarre app qu'APRÈS db"
                       #   Attention : ça attend que db DÉMARRE, pas qu'il soit PRÊT
                       #   (d'où la boucle retry dans models.py !)
    environment:       # ← variables transmises à Python (lues via os.getenv())
      - DB_HOST=db           # ← "db" = nom du service = DNS Docker
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - SECRET_KEY=${SECRET_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}

  phpmyadmin:                    # ← nom du 3ème service
    image: phpmyadmin:latest     # ← image officielle phpMyAdmin (dernière version)
                                 #   Pas de build: . car on utilise l'image telle quelle
    restart: always              # ← redémarre automatiquement si crash
    ports:
      - "8081:80"                # ← port 80 du conteneur (HTTP standard) → port 8081 sur ta machine
                                 #   Accès via http://localhost:8081
                                 #   On n'utilise pas 8080 (souvent déjà pris par d'autres services)
    environment:
      - PMA_HOST=db              # ← indique à phpMyAdmin où trouver MySQL
                                 #   "db" = le nom du service Docker = DNS interne
                                 #   phpMyAdmin va se connecter à mysql://db:3306 en interne
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
                                 # ← mot de passe root MySQL, nécessaire pour que phpMyAdmin
                                 #   puisse s'authentifier auprès du serveur MySQL
    depends_on:
      - db                       # ← attend que le conteneur "db" soit démarré avant phpMyAdmin

volumes:
  db_data:             # ← déclare le volume nommé "db_data" (géré par Docker)
```

---

### Fichier 4/4 — `requirements.txt` (Les Librairies)

**C'est quoi ?** La liste de la "liste de courses" Python. Quand Docker lance `pip install -r requirements.txt`, il installe tout ce qui est listé.

```txt
flask          # ← le framework web : gère les URLs, les templates, les sessions
flask-bcrypt   # ← extension Flask pour hacher les mots de passe (algorithme bcrypt)
pymysql        # ← pilote Python pour parler à MySQL (le "traducteur" Python↔MySQL)
google-generativeai  # ← ancien SDK Google (gardé pour compatibilité, non utilisé activement)
python-dotenv  # ← permet de lire le fichier .env avec load_dotenv()
google-genai   # ← NOUVEAU SDK officiel Google Gemini (celui qu'on utilise vraiment)
markdown       # ← convertit le texte Markdown en HTML (pour les réponses de l'IA)
```

### 🚀 La commande de lancement
```bash
docker compose up --build -d
# "up"      : démarre tous les services
# "--build" : force la reconstruction de l'image "app" (obligatoire si requirements.txt a changé)
# "-d"      : mode "detached" (tourne en arrière-plan, te rend la main)
```

---

## 🗃️ ÉTAPE 2 — La Base de Données (`db/init.sql`) (10 min)

### C'est quoi ?

**L'analogie :** MySQL est un tableur Excel très puissant et très rapide. `init.sql` crée les "feuilles" (tables) et définit les colonnes avant qu'on y mette des données.

**Ce fichier est exécuté automatiquement** par MySQL au 1er démarrage grâce au volume monté dans `docker-compose.yml`. Après ça, il n'est plus jamais relu (les données sont dans `db_data`).

### Les 3 tables et leurs relations

```
┌─────────────────────────────────────────────────────────────────┐
│                          TABLE users                            │
│  id │ username │ password_hash │ role  │ created_at             │
│   1 │ briac    │ $2b$12$...   │ admin │ 2025-05-01 10:00:00     │
│   2 │ alice    │ $2b$12$...   │ user  │ 2025-05-01 11:00:00     │
└───────────────────────────────────┬─────────────────────────────┘
                                    │ user_id (clé étrangère)
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       TABLE conversations                        │
│  id │ user_id │ title                 │ created_at              │
│   1 │       1 │ Bonjour...            │ 2025-05-01 10:05:00     │
│   2 │       1 │ Explique Python...    │ 2025-05-01 10:30:00     │
└───────────────────────────────────┬─────────────────────────────┘
                                    │ conversation_id (clé étrangère)
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         TABLE messages                           │
│  id │ conversation_id │ role      │ content      │ created_at  │
│   1 │               1 │ user      │ "Bonjour"    │ ...         │
│   2 │               1 │ assistant │ "Bonjour !"  │ ...         │
│   3 │               2 │ user      │ "Explique..."│ ...         │
└─────────────────────────────────────────────────────────────────┘
```

**Règle :** Un utilisateur → plusieurs conversations → plusieurs messages par conversation.

```sql
-- TABLE 1 : les utilisateurs
CREATE TABLE IF NOT EXISTS users (
-- "CREATE TABLE" : crée une table
-- "IF NOT EXISTS" : ne plante pas si la table existe déjà (sécurité au redémarrage)

    id INT AUTO_INCREMENT PRIMARY KEY,
    -- "id" : nom de la colonne
    -- "INT" : nombre entier
    -- "AUTO_INCREMENT" : MySQL attribue automatiquement 1, 2, 3... à chaque nouvel utilisateur
    -- "PRIMARY KEY" : identifiant unique de chaque ligne (obligatoire, jamais NULL)

    username VARCHAR(50) UNIQUE NOT NULL,
    -- "VARCHAR(50)" : texte de 50 caractères maximum
    -- "UNIQUE" : deux utilisateurs ne peuvent pas avoir le même username
    -- "NOT NULL" : ce champ est obligatoire (ne peut pas être vide)

    password_hash VARCHAR(255) NOT NULL,
    -- VARCHAR(255) car les hashs bcrypt font ~60 caractères (on prend de la marge)
    -- On stocke JAMAIS le mot de passe en clair, seulement son empreinte

    role ENUM('user', 'admin') DEFAULT 'user',
    -- "ENUM" : seules les valeurs listées sont acceptées (protection contre les erreurs)
    -- Mieux qu'un boolean : extensible (on pourrait ajouter 'moderator' plus tard)
    -- "DEFAULT 'user'" : si on ne précise pas le rôle, c'est 'user' automatiquement

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- "TIMESTAMP" : date + heure
    -- "DEFAULT CURRENT_TIMESTAMP" : MySQL remplit automatiquement avec l'heure d'insertion
);

-- TABLE 2 : les conversations
CREATE TABLE IF NOT EXISTS conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    -- Référence vers la table users (quelle conversation appartient à quel user)

    title VARCHAR(255) DEFAULT 'Nouvelle conversation',
    -- Le titre affiché dans la sidebar (les 30 premiers caractères du 1er message)

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    -- "FOREIGN KEY" : user_id doit correspondre à un id qui existe dans users
    -- "ON DELETE CASCADE" : si on supprime un utilisateur, TOUTES ses conversations
    --                       sont supprimées automatiquement (cohérence des données)
);

-- TABLE 3 : les messages
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,

    conversation_id INT NOT NULL,
    -- Référence vers la table conversations

    role ENUM('user', 'assistant', 'admin') NOT NULL,
    -- "user" = message de l'humain
    -- "assistant" = réponse de l'IA
    -- "admin" = intervention officielle de l'administrateur
    -- ENUM impose ces 3 valeurs uniquement (pas d'erreur de typo possible)

    content TEXT NOT NULL,
    -- "TEXT" : texte de longueur illimitée (différent de VARCHAR qui est limité)
    -- Nécessaire car les réponses de l'IA peuvent être très longues

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    -- Si on supprime une conversation, tous ses messages disparaissent
);
```

---

## 🔌 ÉTAPE 3 — Le Pont SQL (`app/models.py`) (20 min)

### C'est quoi ?

**L'analogie :** Flask (notre serveur web) parle Python. MySQL parle SQL. Ils ne se comprennent pas nativement. `models.py` est le **traducteur** entre les deux.

Ce fichier contient **uniquement des fonctions** qui font des requêtes SQL. Aucune logique métier, aucune route web. C'est la séparation des responsabilités : chaque fichier fait une seule chose.

```
┌────────────────┐    appel Python     ┌──────────────────┐    requête SQL    ┌──────────┐
│    app.py      │ ─────────────────► │   models.py      │ ────────────────► │  MySQL   │
│  (les routes)  │                    │  (les requêtes)  │                   │  (db)    │
└────────────────┘ ◄───────────────── └──────────────────┘ ◄──────────────── └──────────┘
                    données Python                           données SQL (dict)
```

### Le code complet, ligne par ligne

```python
import pymysql          # ← le pilote MySQL pour Python : permet la connexion à MySQL
import os               # ← module standard Python : accès aux variables d'environnement
import time             # ← module standard Python : pour la fonction time.sleep()
from pymysql.cursors import DictCursor
# ← par défaut, pymysql retourne des TUPLES : (1, 'alice', '$2b$...', 'user', ...)
#   DictCursor retourne des DICTIONNAIRES : {'id': 1, 'username': 'alice', ...}
#   Les dicts sont plus lisibles dans le code : msg['content'] vs msg[3]

def get_db():
    retries = 10                    # ← compteur d'essais restants
    while retries > 0:              # ← "tant qu'il reste des essais..."
        try:                        # ← "essaie ce bloc, sinon va dans 'except'"
            connection = pymysql.connect(
                host=os.getenv('DB_HOST', 'db'),
                # ← os.getenv('VAR', 'defaut') : lit DB_HOST du .env, sinon 'db'
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                database=os.getenv('DB_NAME'),
                cursorclass=DictCursor  # ← active le mode dictionnaire globalement
            )
            return connection           # ← connexion réussie, on la retourne
        except Exception as e:          # ← si MySQL n'est pas encore prêt
            print(f"[*] Attente BDD... ({retries} essais restants)")
            retries -= 1               # ← décrémente le compteur
            time.sleep(3)              # ← attend 3 secondes avant de réessayer

    raise Exception("Impossible de se connecter après plusieurs tentatives.")
    # ← "raise" = lève une erreur fatale si après 10 essais ça ne marche pas

def create_user(username, password_hash, role='user'):
    # ← 'role='user'' : valeur par défaut si non précisé
    db = get_db()
    try:
        with db.cursor() as cursor:
        # ← "with ... as cursor" : context manager, ferme le curseur automatiquement
            sql = "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)"
            # ← %s = MARQUEURS PARAMÉTRÉS : jamais de concaténation directe !
            #   f"INSERT INTO users VALUES ('{username}')" serait vulnérable aux injections SQL
            cursor.execute(sql, (username, password_hash, role))
            # ← pymysql remplace les %s en échappant les valeurs (protection injection)
            db.commit()
            # ← OBLIGATOIRE après INSERT/UPDATE/DELETE : valide l'écriture en base
            return True
    finally:
        db.close()                      # ← toujours fermer, même en cas d'erreur

def get_user_by_username(username):
    db = get_db()
    try:
        with db.cursor() as cursor:
            sql = "SELECT * FROM users WHERE username = %s"
            cursor.execute(sql, (username,))
            # ← (username,) avec virgule = tuple d'1 élément
            #   Sans virgule : (username) = juste des parenthèses, pas un tuple !
            return cursor.fetchone()
            # ← fetchone() : retourne UNE ligne (ou None si aucun résultat)
    finally:
        db.close()

def create_conversation(user_id, title="Nouvelle conversation"):
    db = get_db()
    try:
        with db.cursor() as cursor:
            sql = "INSERT INTO conversations (user_id, title) VALUES (%s, %s)"
            cursor.execute(sql, (user_id, title))
            db.commit()
            return cursor.lastrowid
            # ← lastrowid : l'id AUTO_INCREMENT de la ligne qu'on vient d'insérer
            #   app.py en a besoin pour rediriger vers /chat/<id>
    finally:
        db.close()

def get_conversations_by_user(user_id):
    db = get_db()
    try:
        with db.cursor() as cursor:
            sql = "SELECT * FROM conversations WHERE user_id = %s ORDER BY created_at DESC"
            # ← ORDER BY created_at DESC : les plus récentes en PREMIER (DESC = décroissant)
            cursor.execute(sql, (user_id,))
            return cursor.fetchall()
            # ← fetchall() : retourne TOUTES les lignes sous forme de liste de dicts
    finally:
        db.close()

def add_message(conversation_id, role, content):
    db = get_db()
    try:
        with db.cursor() as cursor:
            sql = "INSERT INTO messages (conversation_id, role, content) VALUES (%s, %s, %s)"
            cursor.execute(sql, (conversation_id, role, content))
            db.commit()
            return True
    finally:
        db.close()

def get_messages_by_conversation(conversation_id):
    db = get_db()
    try:
        with db.cursor() as cursor:
            sql = "SELECT * FROM messages WHERE conversation_id = %s ORDER BY created_at ASC"
            # ← ASC = croissant = ordre chronologique naturel (du + ancien au + récent)
            cursor.execute(sql, (conversation_id,))
            return cursor.fetchall()
    finally:
        db.close()

def get_global_stats():
    db = get_db()
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) as count FROM users")
            # ← COUNT(*) : fonction SQL qui compte les lignes
            # "as count" : renomme la colonne en "count"
            # Avec DictCursor : résultat = {'count': 3}
            users_count = cursor.fetchone()['count']  # ← extrait la valeur : 3
            cursor.execute("SELECT COUNT(*) as count FROM conversations")
            convs_count = cursor.fetchone()['count']
            cursor.execute("SELECT COUNT(*) as count FROM messages")
            msgs_count = cursor.fetchone()['count']
            return {'users': users_count, 'conversations': convs_count, 'messages': msgs_count}
            # ← dict Python → passé à admin.html via render_template()
    finally:
        db.close()

def get_all_users_admin():
    db = get_db()
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC")
            # ← On ne sélectionne PAS password_hash (inutile + bonne pratique sécurité)
            return cursor.fetchall()
    finally:
        db.close()
```


---

## 🔐 ÉTAPE 4 — Le Routeur & La Sécurité (`app/app.py`) (25 min)

### C'est quoi ?

`app.py` est **le chef d'orchestre** de toute l'application. Il reçoit chaque requête du navigateur, appelle les bons modules (`models.py`, `gemini.py`), et renvoie la bonne page HTML.

**Principe clé du web :** Chaque URL correspond à une **route**. Quand tu vas sur `/login`, Flask exécute la fonction `login()`. Quand tu vas sur `/chat/5`, Flask exécute `chat(conv_id=5)`.

```
Navigateur : GET /chat/5
                  ↓
Flask trouve : @app.route('/chat/<int:conv_id>')
                  ↓
Exécute : def chat(conv_id=5):
               ├── models.get_messages_by_conversation(5)  → MySQL
               └── render_template('index.html', messages=...)  → HTML envoyé au navigateur
```

### Le schéma de navigation complet

```
/register  ──POST──► crée user en BDD ──► redirige vers /login
/login     ──POST──► vérifie mdp ──► ouvre session ──► redirige vers /
/logout    ──GET───► vide session ──► redirige vers /login

/          ──GET───► charge conversations user ──► affiche index.html (mode accueil)
/chat/<id> ──GET───► charge messages de <id> ──► affiche index.html (mode chat)
/new_chat  ──POST──► crée conversation ──► délègue à ask() ──► redirige vers /chat/<id>
/ask/<id>  ──POST──► sauve msg user ──► appelle Gemini ──► sauve réponse ──► redirige /chat/<id>
/delete_chat/<id> ──GET──► supprime conversation ──► redirige vers /

/admin     ──GET───► stats + liste users ──► affiche admin.html
```

### Le code complet, ligne par ligne

```python
# ════ IMPORTS ════════════════════════════════════════════════════════════

from flask import Flask, render_template, request, redirect, url_for, session, flash
# ← Flask        : la classe principale du framework
# ← render_template : charge un fichier HTML depuis templates/ et y injecte des variables
# ← request      : objet contenant toutes les données de la requête entrante
#                  (formulaires, URL, méthode HTTP...)
# ← redirect     : renvoie le navigateur vers une autre URL
# ← url_for      : génère une URL à partir du nom d'une fonction (évite les URLs en dur)
# ← session      : dictionnaire persistant côté serveur, lié à un cookie signé
#                  Permet de mémoriser l'utilisateur connecté entre les pages
# ← flash        : envoie un message temporaire au prochain template
#                  (ex: "Connexion réussie !") — disparaît après affichage

from flask_bcrypt import Bcrypt
# ← extension Flask pour le hachage de mots de passe avec l'algorithme bcrypt
#   bcrypt est plus sûr que MD5/SHA1 car il est LENT intentionnellement (résiste aux attaques brute-force)

from functools import wraps
# ← utilitaire Python pour créer des décorateurs proprement
#   Sans @wraps, les fonctions décorées perdraient leur nom et documentation

import os               # ← accès aux variables d'environnement (os.getenv)
import markdown         # ← convertit le Markdown en HTML (pour les réponses Gemini)
from dotenv import load_dotenv  # ← charge le fichier .env
import models           # ← notre fichier models.py (import direct car même dossier)
from gemini import get_gemini_response  # ← importe seulement cette fonction de gemini.py

# ════ INITIALISATION ══════════════════════════════════════════════════════

load_dotenv()
# ← lit le fichier .env et charge toutes les variables dans l'environnement Python
#   Après ça, os.getenv('SECRET_KEY') fonctionne

app = Flask(__name__)
# ← crée l'application Flask
# __name__ : variable Python spéciale qui vaut le nom du module courant ('app' ou '__main__')
# Flask l'utilise pour trouver les fichiers templates/ et static/ relatifs au fichier

app.secret_key = os.getenv('SECRET_KEY', 'dev_secret_key_change_me')
# ← clé secrète utilisée par Flask pour SIGNER les cookies de session
# Grâce à cette clé, Flask peut vérifier qu'un cookie n'a pas été falsifié
# La valeur par défaut 'dev_secret_key_change_me' est là si .env est absent (dev seulement)

bcrypt = Bcrypt(app)
# ← initialise l'extension Bcrypt en lui passant l'app Flask
# Pattern classique des extensions Flask : on passe "app" pour les configurer

# ════ DÉCORATEURS DE SÉCURITÉ ══════════════════════════════════════════════

# UN DÉCORATEUR, c'est quoi ?
# C'est une fonction qui "enveloppe" une autre fonction pour lui ajouter du comportement.
# @login_required devant une route = "avant d'exécuter cette route, vérifie que l'user est connecté"

def login_required(f):
    # ← f = la fonction de route qu'on va protéger (ex: la fonction home())
    @wraps(f)
    # ← @wraps(f) : conserve le nom et la documentation de f
    #   Sans ça, Flask verrait deux routes avec le même nom "decorated_function" → erreur
    def decorated_function(*args, **kwargs):
        # ← *args, **kwargs : capture TOUS les arguments que f pourrait recevoir
        #   Nécessaire car les routes Flask peuvent avoir des paramètres (/chat/<id>)
        if 'user_id' not in session:
            # ← session est un dict : si 'user_id' n'est pas dedans, l'utilisateur n'est pas connecté
            return redirect(url_for('login'))
            # ← url_for('login') génère '/login' (à partir du nom de la fonction login)
            #   Mieux qu'écrire redirect('/login') en dur
        return f(*args, **kwargs)
        # ← si l'user est connecté, on exécute normalement la fonction de route
    return decorated_function
    # ← on retourne la fonction décorée (pas son résultat !)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'admin':
        # ← session.get('role') : version sécurisée de session['role']
        #   session.get() retourne None si la clé n'existe pas (pas d'erreur KeyError)
        #   session['role'] planterait si 'role' n'est pas dans session
            flash("Accès réservé aux administrateurs.", "error")
            # ← flash(message, catégorie) : stocke un message qui sera lu dans le template
            return redirect(url_for('home'))
        return f(*args, **kwargs)
    return decorated_function

# ════ ROUTES D'AUTHENTIFICATION ══════════════════════════════════════════

@app.route('/register', methods=['GET', 'POST'])
# ← @app.route() : lie l'URL '/register' à la fonction register()
# methods=['GET', 'POST'] : cette route accepte GET (affichage) et POST (soumission du formulaire)
# Par défaut, Flask n'accepte que GET si methods n'est pas spécifié
def register():
    if request.method == 'POST':
    # ← request.method : la méthode HTTP de la requête ('GET' ou 'POST')
    # Si POST : l'utilisateur a soumis le formulaire d'inscription
    # Si GET : l'utilisateur arrive juste sur la page (on affiche le formulaire vide)
        username = request.form.get('username')
        # ← request.form : dictionnaire des données du formulaire HTML soumis
        # .get('username') : lit le champ dont name="username" dans le formulaire
        password = request.form.get('password')

        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        # ← generate_password_hash(password) : applique bcrypt au mot de passe
        #   Résultat : une chaîne bytes comme b'$2b$12$...' (60 caractères)
        # .decode('utf-8') : convertit les bytes en string Python normale
        #   Car MySQL attend une string, pas des bytes

        try:
            models.create_user(username, hashed_pw)
            # ← appelle notre fonction models.py qui fait l'INSERT INTO users...
            flash("Compte créé avec succès ! Connectez-vous.", "success")
            return redirect(url_for('login'))
        except Exception:
            flash("Ce nom d'utilisateur est déjà pris.", "error")
            # ← si l'INSERT plante (UNIQUE constraint sur username), on attrape l'erreur

    return render_template('register.html')
    # ← que ce soit GET ou après une erreur POST, on affiche la page d'inscription

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = models.get_user_by_username(username)
        # ← retourne le dict de l'utilisateur, ou None si introuvable

        if user and bcrypt.check_password_hash(user['password_hash'], password):
        # ← "user" : vérifie que l'utilisateur existe (pas None)
        # ← check_password_hash(hash_stocké, mdp_saisi) : compare l'empreinte bcrypt
        #   Retourne True si ça correspond, False sinon
        #   On ne compare JAMAIS les mots de passe en clair !
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['role'] = user['role']
            # ← on stocke dans session les infos nécessaires pour toutes les prochaines requêtes
            #   session est automatiquement sauvegardé dans un cookie signé côté navigateur
            return redirect(url_for('home'))
        else:
            flash("Identifiants incorrects.", "error")

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    # ← supprime TOUTES les clés de la session (user_id, username, role...)
    #   Flask invalidera le cookie côté navigateur
    return redirect(url_for('login'))

# ════ ROUTES PRINCIPALES ══════════════════════════════════════════════════

@app.route('/')
@login_required
# ← les décorateurs s'appliquent de bas en haut :
#   D'abord @login_required vérifie la session, PUIS @app.route('/') est atteint
def home():
    user_conversations = models.get_conversations_by_user(session['user_id'])
    # ← récupère toutes les conversations de l'utilisateur connecté
    return render_template('index.html', conversations=user_conversations, active_conv=None)
    # ← render_template('index.html', cle=valeur) : charge templates/index.html
    #   et y injecte les variables Python : {{conversations}} et {{active_conv}} dans le HTML
    # active_conv=None : on est sur la page d'accueil, pas dans un chat actif

@app.route('/chat/<int:conv_id>')
# ← <int:conv_id> : partie variable de l'URL
#   <int:...> : Flask convertit automatiquement en entier Python
#   Ex: /chat/5 → conv_id=5 dans la fonction
@login_required
def chat(conv_id):
    user_conversations = models.get_conversations_by_user(session['user_id'])

    active_conv = next((c for c in user_conversations if c['id'] == conv_id), None)
    # ← VÉRIFICATION DE PROPRIÉTÉ : est-ce que cette conversation appartient à CET utilisateur ?
    # next(itérable, valeur_par_défaut) : retourne le 1er élément qui satisfait la condition
    # (c for c in user_conversations if c['id'] == conv_id) : génère les convs qui matchent
    # Si aucune ne matche (conv d'un autre user ou inexistante) → retourne None
    if not active_conv:
        flash("Conversation introuvable.", "error")
        return redirect(url_for('home'))

    messages = models.get_messages_by_conversation(conv_id)

    for msg in messages:
        msg['content'] = markdown.markdown(msg['content'], extensions=['fenced_code', 'codehilite'])
        # ← markdown.markdown() : convertit le texte Markdown de Gemini en HTML
        # 'fenced_code' : gère les blocs de code avec ```python ... ```
        # 'codehilite' : ajoute la coloration syntaxique aux blocs de code
        # On MODIFIE le dict en place : msg['content'] passe de "**gras**" à "<strong>gras</strong>"

    return render_template('index.html',
                           conversations=user_conversations,
                           active_conv=active_conv,
                           messages=messages)

@app.route('/new_chat', methods=['GET', 'POST'])
@login_required
def new_chat():
    if request.method == 'GET':
        return redirect(url_for('home'))
        # ← si quelqu'un accède à /new_chat directement (sans formulaire), on redirige

    content = request.form.get('content')
    if not content:
        return redirect(url_for('home'))

    title = content[:30] + "..." if len(content) > 30 else content
    # ← on prend les 30 premiers caractères du message comme titre de la conversation
    # "[:30]" : slice Python, du caractère 0 au 30e (exclu)
    # "if len(content) > 30 else content" : opérateur ternaire Python
    #   = "si plus de 30 chars → ajoute ..., sinon prend le contenu tel quel"
    conv_id = models.create_conversation(session['user_id'], title)
    # ← crée la conversation en BDD et récupère son id (lastrowid)

    return ask(conv_id, initial_content=content)
    # ← appel direct de la fonction ask() (pas une redirection HTTP)
    #   On lui passe le contenu du premier message via initial_content

@app.route('/ask/<int:conv_id>', methods=['POST'])
@login_required
def ask(conv_id, initial_content=None):
    content = initial_content or request.form.get('content')
    # ← "ou logique" : si initial_content est fourni, on l'utilise
    #   sinon on lit le formulaire POST (cas normal d'un message dans un chat existant)
    if not content:
        return redirect(url_for('chat', conv_id=conv_id))

    # ÉTAPE 1 : Sauvegarder le message utilisateur en BDD
    models.add_message(conv_id, 'user', content)

    # ÉTAPE 2 : Récupérer TOUT l'historique de la conversation
    history = models.get_messages_by_conversation(conv_id)
    # ← history contient maintenant le message qu'on vient d'ajouter à la fin

    # ÉTAPE 3 : Préparer le prompt et l'historique pour Gemini
    prompt = history[-1]['content']
    # ← history[-1] : le DERNIER élément de la liste (index négatif en Python)
    #   C'est le message que l'utilisateur vient d'envoyer
    gemini_history = history[:-1]
    # ← history[:-1] : TOUT sauf le dernier élément
    #   C'est l'historique passé, qu'on envoie à Gemini comme "contexte"

    ai_response = get_gemini_response(prompt, gemini_history)
    # ← appelle gemini.py avec la question ET tout l'historique passé
    #   Gemini a ainsi la "mémoire" de toute la conversation

    # ÉTAPE 4 : Sauvegarder la réponse de l'IA en BDD
    models.add_message(conv_id, 'assistant', ai_response)

    return redirect(url_for('chat', conv_id=conv_id))
    # ← redirige vers la page du chat qui rechargera tous les messages depuis la BDD

@app.route('/delete_chat/<int:conv_id>')
@login_required
def delete_chat(conv_id):
    db = models.get_db()
    try:
        with db.cursor() as cursor:
            cursor.execute(
                "DELETE FROM conversations WHERE id = %s AND user_id = %s",
                (conv_id, session['user_id'])
            )
            # ← "AND user_id = %s" : double vérification de sécurité
            #   Un utilisateur ne peut supprimer QUE ses propres conversations
            #   Même s'il forge une URL /delete_chat/99, MySQL refusera si ce n'est pas son chat
            db.commit()
    finally:
        db.close()
    return redirect(url_for('home'))

@app.route('/admin')
@admin_required
# ← @admin_required vérifie que session['role'] == 'admin'
def admin_dashboard():
    stats = models.get_global_stats()   # ← dict avec nb users, convs, messages
    users = models.get_all_users_admin() # ← liste de tous les users
    return render_template('admin.html', stats=stats, users=users)

if __name__ == '__main__':
# ← "__main__" : Python exécute ce bloc seulement si on lance DIRECTEMENT ce fichier
#   Si app.py est importé par un autre module, ce bloc est ignoré
    app.run(debug=True, host='0.0.0.0', port=5000)
    # ← debug=True : mode développement (rechargement auto + messages d'erreur détaillés)
    # ← host='0.0.0.0' : écoute sur TOUTES les interfaces réseau du conteneur
    #   (pas juste 127.0.0.1 qui serait inaccessible depuis l'extérieur du conteneur)
    # ← port=5000 : le port exposé dans le Dockerfile et docker-compose.yml
```


---

## 🤖 ÉTAPE 5 — L'Intelligence Artificielle (`app/gemini.py`) (15 min)

### C'est quoi ?

Ce fichier est le **point de contact** avec Google Gemini. Il a une seule responsabilité : prendre une question + un historique, et retourner une réponse en texte.

**Le défi clé :** Pour que l'IA ait de la "mémoire", on ne lui envoie pas juste la question. On lui envoie **tout l'historique de la conversation** à chaque fois. Gemini n'a pas de mémoire propre entre les appels — c'est nous qui la lui donnons.

```
Appel 1 : [question1]                    → Gemini répond réponse1
Appel 2 : [question1, réponse1, question2] → Gemini répond réponse2 (en se "souvenant")
Appel 3 : [q1, r1, q2, r2, question3]    → Gemini répond réponse3
```

**Problème de format :** Notre BDD stocke `role='assistant'` mais Gemini attend `role='model'`. La boucle de formatage fait cette traduction.

```python
import os
from google import genai          # ← le SDK officiel Google Gemini (nouveau, stable)
from dotenv import load_dotenv

load_dotenv()
# ← recharge le .env (utile si gemini.py est lancé directement pour les tests)

API_KEY = os.getenv("GEMINI_API_KEY")
# ← lit la clé API depuis les variables d'environnement

def get_client():
    # ← fonction séparée pour créer le client (permet de tester si la clé est valide)
    if not API_KEY or API_KEY == "ta_cle_api_ici":
    # ← double vérification : clé absente OU encore à la valeur d'exemple
        return None              # ← on retourne None plutôt que de planter
    try:
        return genai.Client(api_key=API_KEY)
        # ← crée le client officiel Google Gemini avec notre clé
        #   Ce client est l'objet qui va faire les appels réseau vers les serveurs Google
    except Exception as e:
        print(f"[*] Erreur initialisation client : {e}")
        return None

def get_gemini_response(prompt, history=None):
    """
    Envoie un prompt à Gemini et retourne la réponse texte.
    Gère l'historique pour garder le contexte de la conversation.
    """
    client = get_client()
    if not client:
        return "Erreur : Clé API Gemini non configurée dans le fichier .env"
    # ← si pas de client, on retourne un message d'erreur lisible (affiché dans le chat)

    try:
        contents = []
        # ← liste qui va contenir TOUS les messages formatés pour l'API Gemini

        if history:                     # ← si on a un historique (pas la 1ère question)
            for msg in history:
                if msg.get('role') == 'admin':
                    continue
                # ← NOUVEAU : On ignore les messages de l'admin pour ne pas polluer 
                #   le contexte de l'IA (qui ne supporte que user et model)

                role = "user" if msg['role'] == "user" else "model"
                # ← TRADUCTION CRITIQUE :
                #   BDD stocke "assistant" → Gemini attend "model"
                #   BDD stocke "user"      → Gemini attend "user" (ça correspond déjà)
                #   L'API Google est stricte : "assistant" provoquerait une erreur 400

                contents.append({
                    "role": role,
                    "parts": [{"text": msg['content']}]
                })
                # ← FORMAT EXACT exigé par l'API Google :
                #   {
                #     "role": "user" ou "model",
                #     "parts": [{"text": "contenu du message"}]
                #   }
                # "parts" est une liste car Gemini supporte aussi les images, fichiers, etc.

        contents.append({
            "role": "user",
            "parts": [{"text": prompt}]
        })
        # ← ajoute la NOUVELLE question à la fin de l'historique
        # contents = [msg1_formaté, msg2_formaté, ..., nouvelle_question]

        response = client.models.generate_content(
            model="gemini-flash-latest",
            # ← "gemini-flash-latest" : modèle le plus rapide de Gemini
            #   Flash = faible latence (réponse en ~1-2s) + économe en quotas
            #   Idéal pour un chat : on privilégie la réactivité
            contents=contents
            # ← on envoie l'historique COMPLET formaté
        )

        return response.text
        # ← .text : extrait directement le texte de la réponse
        #   response est un objet complexe, .text est le raccourci vers le contenu textuel

    except Exception as e:
        error_msg = f"Erreur Gemini : {str(e)}"
        print(f"[*] {error_msg}")
        return "Désolé, je rencontre une difficulté technique pour répondre."
        # ← on retourne un message d'erreur poli (affiché dans le chat au lieu de crasher)

if __name__ == "__main__":
# ← ce bloc s'exécute SEULEMENT si on lance : python app/gemini.py
#   (pas quand gemini.py est importé par app.py)
    client = get_client()
    if client:
        print("--- Test de réponse Gemini ---")
        res = get_gemini_response("Dis 'Connexion OK'")
        print(f"Réponse : {res}")
        # ← test rapide pour vérifier que la clé API fonctionne
    else:
        print("[!] Clé API manquante ou par défaut dans le .env")
```

**Commande de test :**
```bash
docker exec minigpt-app-1 python app/gemini.py
# ← exécute gemini.py DANS le conteneur (accès aux variables d'env Docker)
# Si réponse "Connexion OK" → la clé API est valide et le réseau fonctionne
```


---

## 🎨 ÉTAPE 6 — Pages d'Authentification (`login.html` & `register.html`) (10 min)

### C'est quoi ?

Ces deux pages sont quasi-identiques : un formulaire centré sur fond sombre avec le logo de l'app. On les crée une fois et on comprend le système de design qui s'applique à TOUS les templates.

**Le système de design "Deep Sea & Cyan" :**
```
Couleur de fond sombre  : #000038  (bleu marine très profond)
Couleur de surface      : #0c0c56  (bleu marine légèrement plus clair)
Couleur d'accent        : #00BFFF  (cyan électrique = "Deep Sky Blue")
Texte principal         : text-white / text-slate-200
Texte secondaire        : text-slate-400 / text-slate-500
```

**Jinja2, c'est quoi ?** Le moteur de templates de Flask. Il permet d'écrire du Python directement dans le HTML avec des balises spéciales :
- `{{ variable }}` → affiche une variable Python
- `{% if ... %} ... {% endif %}` → condition
- `{% for ... %} ... {% endfor %}` → boucle
- `{{ message | filtre }}` → applique un filtre à une variable

### `login.html` commenté ligne par ligne

```html
<!DOCTYPE html>
<!-- Déclaration du type de document : dit au navigateur que c'est du HTML5 -->

<html lang="fr">
<!-- lang="fr" : indique la langue pour les outils d'accessibilité et le référencement -->

<head>
    <meta charset="UTF-8">
    <!-- charset=UTF-8 : encodage universel, supporte tous les caractères (accents, emoji...) -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- viewport : CRUCIAL pour le responsive design sur mobile
         width=device-width  : la largeur de la page = la largeur de l'écran
         initial-scale=1.0   : pas de zoom au chargement
         Sans ça, les mobiles zooment dézooment et le CSS responsive ne fonctionne pas -->

    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap" rel="stylesheet">
    <!-- Import d'une police Google Fonts (chargée depuis les serveurs Google)
         family=Libre+Baskerville : la police choisie (serif, aspect littéraire premium)
         wght@400;700 : charge le poids normal (400) et gras (700) seulement (économie de bande passante)
         display=swap : affiche une police système en attendant le chargement, puis swap (pas de texte invisible) -->

    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Import de Tailwind CSS via CDN (Content Delivery Network)
         Mode CDN = Tailwind analyse le HTML en temps réel et génère le CSS nécessaire
         Avantage : pas besoin de compilation, parfait pour le prototypage
         Inconvénient : légèrement plus lent qu'une version compilée (acceptable en dev) -->

    <title>MiniGPT - Connexion</title>
    <!-- Titre affiché dans l'onglet du navigateur et dans les résultats Google -->

    <style>
        body { font-family: 'Libre Baskerville', Georgia, serif; }
        <!-- Applique la police à tout le body
             'Georgia, serif' = polices de secours si Libre Baskerville ne charge pas -->
    </style>
</head>

<body class="bg-[#000038] text-white h-screen flex items-center justify-center p-6">
<!-- Classes Tailwind analysées :
     bg-[#000038]     : couleur de fond personnalisée (valeur arbitraire entre crochets)
     text-white       : texte blanc par défaut
     h-screen         : hauteur = 100% de la hauteur de l'écran
     flex             : active Flexbox (système de mise en page CSS moderne)
     items-center     : centre les enfants VERTICALEMENT (axe Y)
     justify-center   : centre les enfants HORIZONTALEMENT (axe X)
     p-6              : padding (espace intérieur) de 24px de tous côtés
     → Résultat : la carte de login est parfaitement centrée sur l'écran -->

    <div class="w-full max-w-md bg-[#0c0c56] p-8 rounded-3xl border-2 border-[#00BFFF22] shadow-2xl">
    <!-- w-full       : prend toute la largeur disponible
         max-w-md     : MAIS limitée à 28rem max (448px) → ne s'étire pas sur grands écrans
         bg-[#0c0c56] : couleur de fond de la carte (bleu marine)
         p-8          : padding intérieur de 32px
         rounded-3xl  : coins très arrondis (24px de border-radius)
         border-2     : bordure de 2px
         border-[#00BFFF22] : bordure cyan à 13% d'opacité (le "22" à la fin = opacité hex)
         shadow-2xl   : ombre portée très marquée (effet de profondeur) -->

        <div class="flex flex-col items-center mb-8">
        <!-- flex flex-col : Flexbox en colonne (éléments empilés verticalement)
             items-center  : centrés horizontalement
             mb-8          : margin-bottom de 32px (espace en dessous) -->

            <svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 text-[#00BFFF] mb-4">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/>
            </svg>
            <!-- SVG inline = icône vectorielle (étoile/losange)
                 viewBox="0 0 24 24" : espace de dessin 24x24 unités
                 fill="none"         : pas de remplissage par défaut sur le SVG lui-même
                 text-[#00BFFF]      : Tailwind passe cette couleur à "currentColor"
                 fill="currentColor" : le path utilise la couleur du texte → le SVG est cyan
                 w-12 h-12           : taille 48px × 48px -->

            <h1 class="text-2xl font-bold">Heureux de vous revoir</h1>
            <p class="text-slate-400 text-sm">Connectez-vous pour continuer</p>
            <!-- text-slate-400 : texte gris-bleuté discret -->
        </div>

        {% with messages = get_flashed_messages(with_categories=true) %}
          {% if messages %}
            {% for category, message in messages %}
              <div class="mb-4 p-3 rounded-lg text-sm {% if category == 'error' %}bg-red-500/20 text-red-400{% else %}bg-emerald-500/20 text-emerald-400{% endif %}">
                {{ message }}
              </div>
            {% endfor %}
          {% endif %}
        {% endwith %}
        <!-- BLOC FLASH MESSAGES (système de notifications) :
             get_flashed_messages(with_categories=true) : récupère les messages stockés par flash()
             with_categories=true : retourne des tuples (catégorie, message) ex: ('error', 'Identifiants incorrects.')
             {% with ... %} : crée une variable locale (bonne pratique Jinja)
             bg-red-500/20  : rouge à 20% d'opacité (la notation / est Tailwind v3)
             text-red-400   : texte rouge visible
             → si catégorie 'error' : fond rouge transparent, texte rouge
             → sinon (success) : fond vert transparent, texte vert -->

        <form action="/login" method="POST" class="space-y-6">
        <!-- action="/login" : où envoyer le formulaire (URL)
             method="POST"   : méthode HTTP POST (les données dans le body, pas dans l'URL)
             space-y-6       : espace vertical de 24px ENTRE chaque enfant direct du form -->

            <div>
                <label class="block text-xs font-bold text-[#00BFFF] uppercase mb-2">Nom d'utilisateur</label>
                <!-- block       : le label occupe toute la largeur (affichage au-dessus du champ)
                     text-xs     : texte très petit
                     uppercase   : tout en majuscules (style de label premium)
                     mb-2        : espace sous le label -->

                <input type="text" name="username" required
                    class="w-full bg-[#10264B] border-2 border-[#00BFFF22] rounded-xl px-4 py-3 focus:border-[#00BFFF] focus:outline-none transition-all">
                <!-- type="text"             : champ texte standard
                     name="username"         : CLÉ du formulaire → request.form.get('username') dans Flask
                     required                : attribut HTML5, le navigateur bloque si vide
                     bg-[#10264B]            : fond bleu foncé du champ
                     border-[#00BFFF22]      : bordure cyan très transparente au repos
                     focus:border-[#00BFFF]  : au clic → bordure cyan pleine (effet visuel de focus)
                     focus:outline-none      : supprime l'outline bleue par défaut du navigateur
                     transition-all          : anime TOUS les changements de propriétés CSS (effet smooth) -->
            </div>
            <!-- ... même structure pour le champ mot de passe avec type="password" -->

            <button type="submit"
                class="w-full bg-[#00BFFF] text-[#10264B] font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform">
                Se connecter
            </button>
            <!-- w-full              : bouton pleine largeur
                 bg-[#00BFFF]        : fond cyan électrique
                 text-[#10264B]      : texte bleu foncé (contraste sur fond cyan)
                 hover:scale-[1.02]  : au survol → légèrement agrandi (1.02 = +2%)
                 transition-transform : anime le scale doucement -->
        </form>

        <p class="mt-8 text-center text-sm text-slate-400">
            Nouveau ici ? <a href="/register" class="text-[#00BFFF] hover:underline">Créer un compte</a>
        </p>
    </div>
</body>
</html>
```

> **Note :** `register.html` est structurellement identique. Seuls changent : le titre, le texte du bouton ("S'inscrire"), l'action du formulaire (`action="/register"`), et le lien en bas.


---

## 💬 ÉTAPE 7 — Le Chat Principal (`app/templates/index.html`) (30 min)

### C'est quoi ?

C'est **le fichier le plus complexe** du projet. Il joue deux rôles en un seul fichier grâce à Jinja2 :
- **Mode Accueil** (`active_conv == None`) : page de démarrage avec le formulaire de nouveau chat
- **Mode Chat** (`active_conv` est défini) : conversation active avec historique et formulaire d'envoi

```
Flask appelle render_template('index.html', active_conv=None)
                                   ↓
Jinja2 évalue {% if active_conv %} → False
                                   ↓
Affiche le MODE ACCUEIL (grande zone de saisie centrale)

Flask appelle render_template('index.html', active_conv=conv_obj, messages=[...])
                                   ↓
Jinja2 évalue {% if active_conv %} → True
                                   ↓
Affiche le MODE CHAT (liste de messages + formulaire d'envoi en bas)
```

### Structure visuelle du layout

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR (w-16 fixe)  │         MAIN (flex-1)            │
│ ┌────────────────┐   │                                  │
│ │ Icône sidebar  │◄──┼──(hover)── ASIDE étendu w-64    │
│ └────────────────┘   │                                  │
│                      │  ┌─────────────────────────────┐ │
│                      │  │ MODE ACCUEIL :               │ │
│                      │  │   Logo + Titre + Form        │ │
│                      │  │   ou                         │ │
│                      │  │ MODE CHAT :                  │ │
│                      │  │   Header                     │ │
│                      │  │   Messages scrollables       │ │
│                      │  │   Formulaire d'envoi (bas)   │ │
│                      │  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Section `<head>` et `<style>` commentés

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville..." rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>

    <title>MiniGPT - {% if active_conv %}{{ active_conv.title }}{% else %}Échange{% endif %}</title>
    <!-- Titre dynamique Jinja2 :
         Si conversation active → "MiniGPT - Bonjour comment allez..."
         Sinon → "MiniGPT - Échange"
         Les onglets du navigateur montrent le nom de la conversation active -->

    <style>
        body { font-family: 'Libre Baskerville', Georgia, serif; }

        /* ── SCROLLBAR PERSONNALISÉE ── */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        /* ::-webkit-scrollbar : pseudo-élément CSS pour personnaliser la barre de défilement
           width: 4px → scrollbar très fine et discrète */

        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        /* La "piste" de la scrollbar : transparente (fond de la page visible) */

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #00BFFF44;  /* cyan à 27% d'opacité au repos */
            border-radius: 10px;    /* coins arrondis */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #00BFFF;    /* cyan plein au survol */
        }

        /* ── ANIMATION MACHINE À ÉCRIRE (dernier message IA) ── */
        .typewriter-final {
            overflow: hidden;        /* cache le contenu qui dépasse */
            display: inline-block;
            animation: typing-final 1.5s ease-out forwards;
            /* animation: nom duration timing-function fill-mode
               forwards = garde le style final après l'animation (pas de retour à 0) */
        }
        @keyframes typing-final {
            from { max-height: 0; opacity: 0; }
            to   { max-height: 2000px; opacity: 1; }
            /* Simule un dévoilement : le message "grandit" de 0 à sa taille réelle
               max-height est une astuce car height: auto n'est pas animable directement */
        }

        /* ── ANIMATION RESPIRATION DU LOGO ── */
        @keyframes thinking-breathe {
            0%, 100% {
                transform: scale(1);       /* taille normale */
                opacity: 0.6;              /* légèrement transparent */
                filter: drop-shadow(0 0 5px rgba(0, 191, 255, 0.4));  /* halo faible */
            }
            50% {
                transform: scale(1.1);     /* 10% plus grand */
                opacity: 1;               /* pleinement opaque */
                filter: drop-shadow(0 0 15px rgba(0, 191, 255, 0.8)); /* halo intense */
            }
        }
        /* @keyframes : définit les étapes d'une animation CSS
           0% et 100% : même état → animation cyclique fluide (respiration)
           transform: scale() : zoom sans affecter la mise en page
           filter: drop-shadow() : ombre/halo appliquée sur le SVG (différent de box-shadow) */

        .animate-thinking {
            animation: thinking-breathe 2s ease-in-out infinite;
            /* infinite : boucle infinie
               ease-in-out : accélère puis ralentit (mouvement naturel) */
        }

        /* ── ANIMATION MACHINE À ÉCRIRE (phrases de statut) ── */
        .status-typing {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;  /* empêche le retour à la ligne */
            width: 0;             /* commence à 0 de large */
            border-right: 2px solid #00BFFF;  /* curseur clignotant cyan */
            animation:
                typing-status 1s steps(30, end) forwards,
                blink-caret 0.75s step-end infinite;
            /* 2 animations simultanées :
               typing-status : élargit de 0 à 100%
               blink-caret   : fait clignoter le curseur */
        }
        @keyframes typing-status {
            from { width: 0; }
            to   { width: 100%; }
            /* steps(30, end) dans l'appel animation :
               Au lieu d'une transition fluide, fait 30 "sauts" discrets
               → imite la frappe caractère par caractère d'une machine à écrire */
        }
        @keyframes blink-caret {
            from, to { border-color: transparent; }
            50%      { border-color: #00BFFF; }
            /* le curseur alterne entre transparent et cyan toutes les 0.375s */
        }

        .delay-1 { animation-delay: 0s;   }  /* phrase 1 : commence immédiatement */
        .delay-2 { animation-delay: 1.2s; }  /* phrase 2 : commence après 1.2s */
        .delay-3 { animation-delay: 2.4s; }  /* phrase 3 : commence après 2.4s */
        /* animation-delay : retarde le début de l'animation
           → les 3 éléments "s'écrivent" séquentiellement, l'un après l'autre */

        #thinking-indicator { display: none; }
        /* Caché par défaut, affiché par JavaScript quand l'utilisateur envoie un message */
    </style>
</head>
```

### `<body>` — La Sidebar commentée

```html
<body class="bg-[#000038] text-white h-screen flex overflow-hidden">
<!-- h-screen      : exactement la hauteur de l'écran (pas de scroll de page globale)
     flex          : sidebar et main côte à côte
     overflow-hidden : empêche le scroll horizontal sur la page entière -->

    <!-- ════════════════════════════════════════
         BARRE LATÉRALE (SIDEBAR)
         Mécanisme : CSS pur, pas de JavaScript !
         group-hover élargit l'aside au survol de la div parente
         ════════════════════════════════════════ -->
    <div class="group relative flex h-full">
    <!-- group    : classe Tailwind spéciale → permet aux enfants de réagir au hover de CETTE div
         relative : contexte de positionnement pour l'aside (position: absolute en dessous)
         flex h-full : prend toute la hauteur -->

        <div class="w-16 h-full flex flex-col items-center py-4 border-r border-[#00BFFF11] bg-[#0c0c56] z-50">
        <!-- w-16   : 64px de large (toujours visible, la "bande" fixe)
             z-50   : z-index élevé → passe au-dessus des autres éléments
             bg-[#0c0c56] : fond bleu marine -->
            <a href="{{ url_for('home') }}" ...>
                <!-- url_for('home') : génère l'URL de la fonction 'home' → '/'
                     Mieux qu'écrire href="/" en dur (si l'URL change, tout se met à jour) -->
                <!-- SVG icône "sidebar" (les deux rectangles) -->
            </a>
        </div>

        <aside class="absolute left-16 top-0 h-full w-0 group-hover:w-64 bg-[#0c0c56] ...
                       transition-all duration-300 ease-in-out overflow-hidden z-40 flex flex-col">
        <!-- absolute      : positionné par rapport à la div parente (relative)
             left-16       : commence à 64px du bord gauche (après la bande fixe)
             w-0           : CACHÉ par défaut (largeur nulle)
             group-hover:w-64 : QUAND la div.group est survolée → largeur 256px
             transition-all duration-300 ease-in-out : anime le changement de largeur en 300ms
             overflow-hidden : CRUCIAL : cache le contenu qui déborde de w-0 à w-64
             z-40          : z-index légèrement inférieur à la bande (z-50), passe en dessous -->

            <div class="w-64 flex flex-col h-full p-4 space-y-6">
            <!-- w-64 : ce div interne fait toujours 256px, c'est l'aside qui cache avec overflow:hidden -->

                <!-- Liste des conversations -->
                {% if conversations %}
                    {% for conv in conversations %}
                    <div class="group/item relative">
                    <!-- group/item : Tailwind v3 - nom de groupe pour des hover imbriqués
                         (différent de "group" → permet plusieurs niveaux de hover) -->
                        <a href="{{ url_for('chat', conv_id=conv.id) }}"
                           class="... {% if active_conv and active_conv.id == conv.id %}bg-[#00BFFF22] text-[#00BFFF] font-bold{% else %}text-slate-300{% endif %}">
                        <!-- Jinja2 : si c'est la conv active → surlignée en cyan, sinon grise -->
                            {{ conv.title }}
                        </a>
                        <a href="{{ url_for('delete_chat', conv_id=conv.id) }}"
                           class="absolute right-2 top-2 opacity-0 group-hover/item:opacity-100 ..."
                           onclick="return confirm('Supprimer cette conversation ?')">
                        <!-- opacity-0 : bouton suppression INVISIBLE au repos
                             group-hover/item:opacity-100 : VISIBLE au survol de group/item
                             onclick="return confirm(...)" : boîte de dialogue de confirmation native
                             Si l'utilisateur clique "Annuler" → confirm() retourne false → lien ignoré -->
                        </a>
                    </div>
                    {% endfor %}
                {% else %}
                    <p ...>Aucun historique</p>
                {% endif %}

                <!-- Section Admin (visible SEULEMENT pour les admins) -->
                {% if session.get('role') == 'admin' %}
                <!-- session est accessible directement dans Jinja2 !
                     .get('role') évite une erreur KeyError si 'role' n'est pas dans session -->
                <div class="pt-2 border-t border-[#00BFFF11]">
                    <a href="{{ url_for('admin_dashboard') }}" ...>Administration</a>
                </div>
                {% endif %}

                <!-- Profil utilisateur en bas de sidebar -->
                <div class="pt-4 border-t border-[#00BFFF22] ...">
                    <div class="w-8 h-8 rounded-full bg-[#00BFFF] ...">
                        {{ session['username'][0]|upper if session['username'] else '?' }}
                        <!-- session['username'][0] : première lettre du pseudo
                             |upper : filtre Jinja2 qui met en majuscule
                             → Affiche "B" pour "briac" (avatar initiale) -->
                    </div>
                    <a href="{{ url_for('logout') }}" ...>Déconnexion</a>
                </div>
            </div>
        </aside>
    </div>
```

### `<main>` — Le Double Mode Jinja2

```html
    <main class="flex-1 flex flex-col relative items-center h-full">
    <!-- flex-1 : prend tout l'espace restant après la sidebar (flex sur le body) -->

        {% if active_conv %}
        <!-- ════ MODE CHAT (conversation active) ════ -->
        <div class="flex-1 w-full max-w-4xl flex flex-col min-h-0 pt-6">
        <!-- max-w-4xl : largeur maximale 56rem (896px) → lisibilité optimale
             min-h-0   : CRUCIAL pour que overflow-y-auto fonctionne dans un flex enfant
                         Sans min-h-0, les divs flex grandissent indéfiniment au lieu de scroller -->

            <!-- Header de la conversation -->
            <div class="px-6 pb-4 border-b border-[#00BFFF11] flex justify-between items-center">
                <h2>{{ active_conv.title }}</h2>
                <span>Gemini Flash 2.0</span>
                <!-- Badge du modèle utilisé : information contextuelle pour l'utilisateur -->
            </div>

            <!-- Fenêtre des messages (scrollable) -->
            <div id="chat-window" class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            <!-- overflow-y-auto : scroll vertical si le contenu dépasse la hauteur
                 space-y-8      : espace de 32px entre chaque message
                 id="chat-window" : référencé par JavaScript pour le scroll automatique -->

                {% for msg in messages %}
                    {% if msg.role == 'user' %}
                    <!-- Bulle utilisateur → alignée à DROITE -->
                    <div class="flex justify-end">
                        <div class="max-w-[80%] bg-[#00BFFF22] border border-[#00BFFF44] p-4 rounded-2xl rounded-tr-none ...">
                        <!-- max-w-[80%]    : bulle fait max 80% de la largeur (ne prend pas tout)
                             rounded-tr-none : coin haut-droit non arrondi → queue de bulle côté droit -->
                            {{ msg.content|safe }}
                            <!-- |safe : filtre Jinja2 qui dit "ce contenu HTML est sûr, ne l'échappe pas"
                                 OBLIGATOIRE car msg.content contient du HTML (généré par markdown())
                                 Sans |safe : les balises <strong> s'afficheraient en texte brut -->
                        </div>
                    </div>
                    {% else %}
                    <!-- Bulle IA → alignée à GAUCHE avec avatar -->
                    <div class="flex items-start space-x-4">
                        <!-- Avatar IA (étoile SVG) -->
                        <div class="w-8 h-8 rounded-lg bg-[#00BFFF] flex-shrink-0 ...">
                            <!-- flex-shrink-0 : l'avatar ne rétrécit JAMAIS même si le texte est long -->
                            <svg>...</svg>
                        </div>
                        <div class="flex-1 prose prose-invert max-w-none text-slate-300 pt-1
                                    {% if loop.last %}typewriter-final{% endif %}">
                        <!-- flex-1 : prend tout l'espace disponible à côté de l'avatar
                             prose prose-invert : classes Tailwind Typography
                                 prose          : applique un style riche au HTML généré (marges, tailles, listes...)
                                 prose-invert   : version "dark mode" (texte clair sur fond sombre)
                             max-w-none : désactive la largeur max par défaut de prose
                             loop.last  : variable spéciale Jinja2, True pour la DERNIÈRE itération
                             typewriter-final : applique l'animation de dévoilement AU DERNIER MESSAGE seulement
                                 → Le dernier message IA (la réponse fraîche) s'anime, pas les anciens -->
                            {{ msg.content|safe }}
                        </div>
                    </div>
                    {% endif %}
                {% endfor %}

                <!-- Indicateur de réflexion (affiché par JS quand on attend Gemini) -->
                <div id="thinking-indicator" class="flex items-start space-x-6 p-4">
                <!-- display:none par défaut (défini dans le CSS) -->
                    <svg class="w-10 h-10 text-[#00BFFF] animate-thinking origin-center">...</svg>
                    <!-- animate-thinking : la classe CSS qui applique l'animation de respiration
                         origin-center    : le point de transformation (scale) est le centre du SVG -->
                    <div class="flex flex-col space-y-1 pt-1">
                        <span class="status-typing delay-1 ...">MiniGPT est en train de réfléchir...</span>
                        <div class="h-px w-8 bg-[#00BFFF33] ml-1 status-typing delay-2"></div>
                        <!-- Un trait horizontal qui "s'écrit" aussi (séparateur animé) -->
                        <span class="status-typing delay-3 ...">Élaboration de la réponse...</span>
                    </div>
                </div>
            </div>

            <!-- Formulaire d'envoi de message (MODE CHAT) -->
            <div class="p-6">
                <form id="chat-form" action="{{ url_for('ask', conv_id=active_conv.id) }}" method="POST"
                      class="... border-2 border-[#00BFFF44] focus-within:border-[#00BFFF] transition-all ...">
                <!-- focus-within:border-[#00BFFF] : pseudo-classe CSS
                     Quand UN ÉLÉMENT À L'INTÉRIEUR du form a le focus → la bordure devient cyan
                     C'est l'effet de halo sur la zone de saisie -->
                    <textarea id="chat-input" name="content" ... required></textarea>
                    <button type="submit" ...>
                        <!-- SVG flèche vers le haut -->
                    </button>
                </form>
            </div>
        </div>

        {% else %}
        <!-- ════ MODE ACCUEIL (pas de conversation active) ════ -->
        <div class="w-full max-w-3xl flex flex-col items-center justify-center h-full">
            <div id="home-logo" class="mb-8">
                <svg class="w-16 h-16 text-[#00BFFF]">...</svg>
                <!-- id="home-logo" : référencé par JS pour ajouter l'animation au clic -->
            </div>
            <h1 class="text-4xl font-medium text-slate-100 mb-12 text-center">
                Un moment à échanger avec MiniGPT ?
            </h1>
            <form id="welcome-form" action="{{ url_for('new_chat') }}" method="POST" ...>
                <textarea name="content" ... required></textarea>
                <button type="submit">Démarrer</button>
            </form>
            <!-- Badges décoratifs (catégories de conversation) -->
            <div class="flex flex-wrap justify-center gap-3">
                <span class="px-4 py-2 rounded-full border border-[#00BFFF22] ...">Code</span>
                <span ...>Apprendre</span>
                <span ...>Écrire</span>
                <span class="border-[#00BFFF] bg-[#00BFFF22] text-[#00BFFF]">Choix de MiniGPT</span>
                <!-- Le dernier badge a une bordure plus visible : c'est le badge "sélectionné" -->
            </div>
        </div>
        {% endif %}
    </main>
```

### `<script>` — Le JavaScript commenté

```javascript
<script>
    // ══ SÉLECTION DES ÉLÉMENTS DU DOM ══
    const chatForm = document.getElementById('chat-form');
    // ← getElementById : sélectionne l'élément avec id="chat-form"
    // const : variable constante (la référence ne changera pas)
    // null si l'élément n'existe pas (mode accueil = pas de chat-form)

    const welcomeForm = document.getElementById('welcome-form');
    const thinkingIndicator = document.getElementById('thinking-indicator');
    const chatWindow = document.getElementById('chat-window');
    const homeLogo = document.getElementById('home-logo');
    const chatInput = document.getElementById('chat-input');
    const welcomeInput = document.querySelector('#welcome-form textarea');
    // ← querySelector : sélecteur CSS plus flexible que getElementById
    //   '#welcome-form textarea' = le <textarea> à l'intérieur de #welcome-form

    // ══ FONCTION OPTIMISTIC UI ══════════════════════════════════════════
    // "Optimistic UI" : on affiche le résultat AVANT que le serveur réponde
    // → l'interface paraît instantanée même si Gemini met 2 secondes à répondre
    function showThinking() {
        if (thinkingIndicator && chatInput) {
        // ← vérifie que les éléments existent (on est en mode chat, pas accueil)
        // L'opérateur && : "et" logique — les deux doivent être truthy (non-null)

            const content = chatInput.value;
            // ← .value : le texte actuellement dans le textarea

            if (content.trim()) {
            // ← .trim() : enlève les espaces en début/fin
            // Si le champ est vide (ou que des espaces), on n'affiche rien

                // CRÉATION DE LA BULLE UTILISATEUR EN JAVASCRIPT
                const userMsgHtml = `
                    <div class="flex justify-end animate-pulse">
                        <div class="max-w-[80%] bg-[#00BFFF22] ... p-4 rounded-2xl">
                            ${content.replace(/\n/g, '<br>')}
                        </div>
                    </div>`;
                // ← Template literal (backticks ` `) : chaîne multi-ligne avec interpolation
                // ${...} : insère une expression JavaScript dans la chaîne
                // content.replace(/\n/g, '<br>') :
                //   /\n/g : expression régulière qui matche TOUS les retours à la ligne (\n)
                //   '<br>' : remplace par une balise HTML de saut de ligne
                //   Sans ça, les sauts de ligne dans le textarea n'apparaîtraient pas
                // animate-pulse : classe Tailwind qui fait clignoter l'élément (en attente)

                thinkingIndicator.insertAdjacentHTML('beforebegin', userMsgHtml);
                // ← insertAdjacentHTML(position, html) : insère du HTML à une position relative
                // 'beforebegin' : insère AVANT l'élément (thinking-indicator)
                // → la bulle utilisateur apparaît juste avant l'indicateur de réflexion

                setTimeout(() => {
                    chatInput.value = '';
                }, 10);
                // ← setTimeout(fonction, délai_ms) : exécute la fonction après 10ms
                // Pourquoi 10ms et pas 0 ?
                // Quand on soumet un formulaire, le navigateur lit les champs PUIS déclenche submit
                // Si on vide AVANT (0ms), le formulaire enverrait un champ vide
                // 10ms laisse le temps au formulaire de capturer la valeur, PUIS on vide visuellement
            }

            // AFFICHER L'INDICATEUR DE RÉFLEXION
            thinkingIndicator.style.display = 'flex';
            // ← .style.display : modifie le CSS inline de l'élément
            // 'flex' correspond au display:flex de l'indicateur (pour l'alignement interne)
            // Rappel : dans le CSS, #thinking-indicator { display: none; }

            chatWindow.scrollTop = chatWindow.scrollHeight;
            // ← scrollTop  : position du scroll en pixels depuis le haut
            // scrollHeight : hauteur totale du contenu (incluant la partie cachée par le scroll)
            // scrollTop = scrollHeight → scrolle tout en bas (pour voir la bulle et l'indicateur)
        }
    }

    // ══ FONCTION RACCOURCIS CLAVIER ══════════════════════════════════════
    function handleKeydown(e, form) {
        // ← e : l'objet KeyboardEvent (infos sur la touche pressée)
        // form : le formulaire concerné (passé en paramètre)

        if (e.key === 'Enter' && !e.shiftKey) {
        // ← e.key === 'Enter' : la touche Entrée est pressée
        // !e.shiftKey : la touche Shift N'EST PAS pressée simultanément
        // → "Entrée seul" = envoyer | "Shift+Entrée" = nouvelle ligne (comportement par défaut)

            e.preventDefault();
            // ← preventDefault() : annule le comportement par défaut du navigateur
            // Sans ça, Entrée dans un textarea = retour à la ligne (et c'est ce qu'on ne veut pas)

            const submitBtn = form.querySelector('button[type="submit"]');
            // ← sélectionne le bouton submit à l'intérieur du formulaire
            if (submitBtn) {
                submitBtn.click();
                // ← .click() : simule un clic physique sur le bouton
                // Pourquoi click() plutôt que form.submit() ?
                // form.submit() bypasse les validations HTML5 (l'attribut "required")
                // submitBtn.click() déclenche aussi nos event listeners (showThinking)
            }
        }
        // Si Shift+Entrée : rien n'est fait → le textarea gère nativement le retour à la ligne
    }

    // ══ LIAISON DES ÉVÉNEMENTS ════════════════════════════════════════════
    if (chatForm) {
    // ← vérifie que chatForm existe (null en mode accueil)
        chatForm.addEventListener('submit', showThinking);
        // ← addEventListener('event', fonction) : écoute l'événement 'submit'
        // Quand le formulaire est soumis → appelle showThinking()

        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => handleKeydown(e, chatForm));
            // ← (e) => handleKeydown(e, chatForm) : fonction fléchée
            // Passe l'événement e ET le formulaire à handleKeydown
            // 'keydown' : déclenché QUAND la touche s'enfonce (avant 'keyup' et 'keypress')
        }
    }

    if (welcomeForm) {
        welcomeForm.addEventListener('submit', () => {
        // ← Quand le formulaire d'accueil est soumis
            if (homeLogo) {
                const svg = homeLogo.querySelector('svg');
                svg.classList.add('animate-thinking');
                // ← classList.add() : ajoute une classe CSS à l'élément
                // Le logo se met à "respirer" pendant que le serveur crée la conversation
            }
            const btn = welcomeForm.querySelector('button');
            btn.innerText = 'Réflexion...';  // ← change le texte du bouton
            btn.disabled = true;             // ← désactive le bouton (évite le double-envoi)
        });
        if (welcomeInput) {
            welcomeInput.addEventListener('keydown', (e) => handleKeydown(e, welcomeForm));
        }
    }

    // SCROLL AUTOMATIQUE EN BAS AU CHARGEMENT DE LA PAGE
    if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
        // ← Au chargement de la page de chat, on scrolle directement en bas
        // → l'utilisateur voit le dernier message immédiatement (pas le début de l'historique)
    }
</script>
```


---

## 📊 ÉTAPE 8 — Dashboard Admin (`app/templates/admin.html`) (10 min)

### C'est quoi ?

La page d'administration est accessible **seulement aux users avec `role='admin'`** (vérification dans le décorateur `@admin_required`). Elle s'est enrichie de fonctionnalités de pilotage total :
1. **Dashboard (`admin.html`)** : 3 "Stats Cards" et la liste des utilisateurs avec un bouton **"Gérer"**.
2. **Gestion Utilisateur (`admin_user.html`)** : Liste toutes les conversations d'un utilisateur tiers, avec possibilité de les renommer ou les supprimer.
3. **Gestion Conversation (`admin_conv.html`)** : Permet de voir l'intégralité des messages d'une discussion, de les modifier, de les supprimer ou d'en insérer de nouveaux manuellement (en tant que `user`, `assistant` ou `admin`).

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Même head que les autres templates : fonts, Tailwind CDN, scrollbar CSS -->
    <title>MiniGPT - Administration</title>
</head>

<body class="bg-[#000038] text-white min-h-screen p-8">
<!-- min-h-screen : hauteur MINIMALE de l'écran (contrairement à h-screen)
     Ici on veut que la page scroll si le tableau est long (pas h-screen)
     p-8 : padding généreux de 32px tout autour -->

    <div class="max-w-6xl mx-auto">
    <!-- max-w-6xl  : limite la largeur à 72rem (1152px) → lisible sur grands écrans
         mx-auto   : margin: 0 auto → centre horizontalement -->

        <!-- ── HEADER ── -->
        <header class="flex justify-between items-center mb-12">
        <!-- flex justify-between : les enfants aux extrémités (titre à gauche, bouton à droite)
             items-center : alignés verticalement au centre
             mb-12 : espace en dessous avant les cards -->
            <div>
                <h1 class="text-3xl font-bold text-[#00BFFF]">Tableau de Bord Admin</h1>
                <p class="text-slate-400 text-sm mt-2">Surveillance globale de l'écosystème MiniGPT</p>
            </div>
            <a href="{{ url_for('home') }}" class="... group">
            <!-- group : pour l'effet hover sur le SVG enfant -->
                <svg class="group-hover:-translate-x-1 transition-transform">...</svg>
                <!-- group-hover:-translate-x-1 : au survol du lien parent (group)
                     le SVG se décale de 4px vers la gauche → flèche "animée" -->
                <span>Retour au Chat</span>
            </a>
        </header>

        <!-- ── STATS CARDS (grille responsive) ── -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <!-- grid              : active CSS Grid Layout
             grid-cols-1       : 1 colonne sur mobile
             md:grid-cols-3    : 3 colonnes à partir de "medium" (768px+)
             gap-6             : espace de 24px entre les cellules
             mb-12             : marge en dessous de la grille -->

            <!-- Card 1 : Utilisateurs -->
            <div class="bg-[#0c0c56] border border-[#00BFFF22] p-6 rounded-2xl shadow-xl relative overflow-hidden group">
            <!-- relative      : contexte de positionnement pour l'icône en fond absolu
                 overflow-hidden : cache l'icône décorative qui déborde (-right-4)
                 group          : pour le hover de l'icône en fond -->

                <div class="absolute -right-4 -bottom-4 text-[#00BFFF08] group-hover:text-[#00BFFF11] transition-colors">
                <!-- absolute         : positionné par rapport à la card (relative)
                     -right-4 -bottom-4 : décalé de -16px à droite et en bas → partiellement hors de la card
                     text-[#00BFFF08] : icône quasi-invisible (5% d'opacité)
                     group-hover:text-[#00BFFF11] : légèrement plus visible au survol de la card -->
                    <svg width="120" height="120" ...><!-- icône users --></svg>
                </div>

                <h3 class="text-[#00BFFF66] text-xs uppercase tracking-widest mb-2">Total Utilisateurs</h3>
                <!-- tracking-widest : espacement entre les lettres très large (style premium) -->
                <p class="text-4xl font-bold">{{ stats.users }}</p>
                <!-- stats.users : valeur Python passée par render_template('admin.html', stats=stats)
                     stats est le dict retourné par models.get_global_stats()
                     ex: stats = {'users': 5, 'conversations': 12, 'messages': 47} -->
            </div>

            <!-- Card 2 : Conversations → même structure, {{ stats.conversations }} -->
            <!-- Card 3 : Messages → même structure, {{ stats.messages }} -->
        </div>

        <!-- ── TABLEAU DES UTILISATEURS ── -->
        <div class="bg-[#0c0c56] border border-[#00BFFF22] rounded-2xl shadow-2xl overflow-hidden">
        <!-- overflow-hidden : les coins arrondis s'appliquent aussi au tableau intérieur -->

            <div class="p-6 border-b border-[#00BFFF11] flex justify-between items-center">
                <h2 class="text-xl font-medium">Liste des Utilisateurs</h2>
                <span class="text-[10px] bg-[#00BFFF22] text-[#00BFFF] ...">Accès Restreint</span>
            </div>

            <div class="overflow-x-auto custom-scrollbar">
            <!-- overflow-x-auto : scroll horizontal si le tableau est trop large (mobile) -->
                <table class="w-full text-left">
                    <thead class="bg-[#00BFFF08] text-[#00BFFF66] text-xs uppercase tracking-widest">
                        <tr>
                            <th class="px-6 py-4">ID</th>
                            <th class="px-6 py-4">Pseudo</th>
                            <th class="px-6 py-4">Rôle</th>
                            <th class="px-6 py-4">Date d'inscription</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#00BFFF11]">
                    <!-- divide-y                : ajoute une bordure entre chaque ligne
                         divide-[#00BFFF11]      : bordure cyan très transparente -->

                        {% for user in users %}
                        <tr class="hover:bg-[#00BFFF05] transition-colors">
                        <!-- hover:bg-[#00BFFF05] : légère surbrillance au survol de la ligne -->

                            <td class="px-6 py-4 text-slate-500 font-mono">#{{ user.id }}</td>
                            <!-- font-mono : police monospace (chiffres alignés) -->

                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 rounded-full ... flex items-center justify-center ...">
                                        {{ user.username[0]|upper }}
                                        <!-- Initiale du username en majuscule (avatar) -->
                                    </div>
                                    <span>{{ user.username }}</span>
                                </div>
                            </td>

                            <td class="px-6 py-4">
                                <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase
                                    {% if user.role == 'admin' %}
                                        bg-red-900/30 text-red-400 border border-red-900/50
                                    {% else %}
                                        bg-green-900/30 text-green-400 border border-green-900/50
                                    {% endif %}">
                                <!-- Badge coloré conditionnel :
                                     admin → rouge (mise en évidence du rôle privilégié)
                                     user  → vert (rôle standard, non-dangereux)
                                     /30 et /50 : opacité en % (syntaxe Tailwind v3) -->
                                    {{ user.role }}
                                </span>
                            </td>

                            <td class="px-6 py-4 text-sm text-slate-400 italic">
                                {{ user.created_at.strftime('%d/%m/%Y %H:%M') }}
                                <!-- .strftime() : méthode Python pour formater une date
                                     '%d/%m/%Y %H:%M' : ex → "04/05/2025 10:30"
                                     user.created_at est un objet datetime Python (via pymysql)
                                     Jinja2 peut appeler les méthodes Python directement -->
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## 🚀 ÉTAPE 9 — Lancement & Vérification (10 min)

### Ordre exact des opérations

```bash
# 1. Se placer dans le dossier du projet
cd /chemin/vers/minigpt

# 2. Vérifier que le .env est bien rempli (surtout GEMINI_API_KEY)
cat .env

# 3. Lancer tout l'environnement Docker
docker compose up --build -d
# --build : reconstruit l'image si nécessaire
# -d      : tourne en arrière-plan

# 4. Vérifier que les conteneurs sont bien lancés
docker compose ps
# Doit afficher "Up" pour "app", "db" ET "phpmyadmin"
```

### Vérifications pas à pas

```bash
# Vérifier les logs Flask (si erreur au démarrage)
docker logs minigpt-app-1
# En cas de succès, tu devrais voir :
# [*] Attente de la base de données... (9 essais restants)  ← normal !
# [*] ...
# * Running on http://0.0.0.0:5000  ← Flask est prêt

# Tester la clé API Gemini
docker exec minigpt-app-1 python app/gemini.py
# Doit afficher : "Réponse : Connexion OK" (ou similaire)

# Voir les logs en temps réel (pendant le développement)
docker logs -f minigpt-app-1
# Ctrl+C pour quitter
```

### 🖥️ phpMyAdmin — Interface graphique pour la BDD

**C'est quoi ?** phpMyAdmin est une application web qui permet de **visualiser et modifier la base de données via le navigateur**, sans avoir à taper des commandes SQL dans le terminal. C'est particulièrement utile pour :
- Voir rapidement le contenu des tables
- Promouvoir un utilisateur en admin en 3 clics
- Vérifier que les données sont bien sauvegardées
- Débugger des problèmes de données

**Accès :** [http://localhost:8081](http://localhost:8081)

```
Page de connexion phpMyAdmin :
  Serveur   : (laisse vide, PMA_HOST=db est déjà configuré)
  Utilisateur : root
  Mot de passe : root_password  (la valeur de DB_ROOT_PASSWORD dans le .env)
```

**Opérations courantes via phpMyAdmin (alternatives aux commandes terminal) :**

| Opération | Via terminal (ancienne façon) | Via phpMyAdmin (nouvelle façon) |
|---|---|---|
| Voir les tables | `docker exec minigpt-db-1 mysql ... -e "SHOW TABLES;"` | Clic gauche sur `minigpt` dans le panneau gauche |
| Voir les utilisateurs | `... -e "SELECT * FROM users;"` | Clic sur la table `users` → onglet "Parcourir" |
| Promouvoir un admin | `... -e "UPDATE users SET role='admin'..."` | Table `users` → crayon → modifier le champ `role` |
| Vider une table | `... -e "DELETE FROM messages;"` | Table → onglet "Vider" |
| Reset complet BDD | `docker compose down -v` puis `up` | Structure → "Vider" sur chaque table |

**Rendre un utilisateur admin :**
1. Ouvrir [http://localhost:8081](http://localhost:8081)
2. Se connecter avec `root` / `root_password`
3. Cliquer sur la base `minigpt` (panneau gauche)
4. Cliquer sur la table `users`
5. Onglet **"Parcourir"** → trouver le bon utilisateur
6. Cliquer sur l'icône **crayon** (modifier) à gauche de la ligne
7. Changer le champ `role` de `user` à `admin`
8. Cliquer **"Exécuter"**
9. Se déconnecter et reconnecter dans MiniGPT → le lien Admin apparaît dans la sidebar

### Checklist de validation

```
□ http://localhost:5000/register → page d'inscription visible
□ Créer un compte → redirigé vers /login avec message de succès
□ Se connecter → redirigé vers / (page d'accueil)
□ Écrire un message → conversation créée, réponse de l'IA reçue
□ Cliquer sur une ancienne conversation → historique chargé
□ Survol sidebar → s'ouvre doucement, bouton supprimer visible
□ Supprimer une conversation → disparaît de la sidebar

# Tests sécurité :
□ Accéder à http://localhost:5000/ sans être connecté → redirigé vers /login
□ Accéder à http://localhost:5000/admin avec un compte 'user' → refusé

# phpMyAdmin :
□ http://localhost:8081 → page de connexion phpMyAdmin visible
□ Se connecter avec root / root_password → interface graphique accessible
□ Clic sur base 'minigpt' → 3 tables visibles (users, conversations, messages)

# Créer un compte admin via phpMyAdmin (méthode recommandée) :
# → table users → Parcourir → modifier le champ role → 'admin'
# OU via terminal (méthode alternative) :
docker exec minigpt-db-1 mysql -u sae_user -pmotdepasse \
  -e "USE minigpt; UPDATE users SET role='admin' WHERE username='ton_username';"
□ Se reconnecter → lien "Administration" visible dans la sidebar
□ Accéder à /admin → stats cards et tableau des users visibles
```

### Commandes de maintenance

```bash
# Arrêter l'application (sans perdre les données)
docker compose stop

# Redémarrer
docker compose start

# Arrêter ET supprimer les conteneurs (données conservées dans le volume db_data)
docker compose down

# Tout effacer y compris les données (RESET COMPLET)
docker compose down -v
# -v supprime aussi les volumes → la BDD sera réinitialisée au prochain "up"

# Recompiler Tailwind (si tu modifies le HTML et les classes CSS)
npx tailwindcss -i ./app/static/src/css/input.css -o ./app/static/dist/css/style.css --watch
# --watch : recompile automatiquement à chaque modification
```

---

## 🔑 Récap Express — Tout en 10 lignes

| Quoi | Comment | Fichier |
|---|---|---|
| Lancer le projet | `docker compose up --build -d` | `docker-compose.yml` |
| Base de données | 3 tables SQL relationnelles | `db/init.sql` |
| Gestion BDD (GUI) | http://localhost:8081 (root / root_password) | `docker-compose.yml` |
| Requêtes SQL | Fonctions paramétrées (`%s`) | `app/models.py` |
| Routes web | `@app.route('/url')` | `app/app.py` |
| Protection routes | `@login_required` / `@admin_required` | `app/app.py` |
| Mots de passe | Hachage bcrypt, jamais en clair | `app/app.py` |
| Intelligence IA | `client.models.generate_content(...)` | `app/gemini.py` |
| Mémoire de l'IA | Historique formaté envoyé à chaque appel | `app/gemini.py` |
| Interface | Jinja2 + Tailwind CSS + SVG inline | `app/templates/` |
| Animations | CSS `@keyframes` + JS `addEventListener` | `app/templates/index.html` |

---

*Document généré le 04/05/2025 — MiniGPT SAE 2.3*

