---
title: "Factorisation de Templates & Persistance avec Jinja2 et Flask (TP3)"
module: "R209"
competence: "Programmer"
ac_lies: ["AC13.01", "AC13.02"]
techs: ["Flask", "Python", "Jinja2", "SQLAlchemy", "MVC"]
date: "2026-05-18"
status: "Terminé"
image: "/assets/projects/tp3-flask-visuel.png"
---

# 🧪 TP3 : Factorisation de Templates & Persistance avec Jinja2 et Flask
> **R209 — Factorisation de Templates & Persistance avec Jinja2 et Flask (TP3)** — *Briac Le Meillat (18/05/2026)*

Ce TP3 porte sur un concept fondamental en développement web : la **factorisation** (ou le découpage en composants) avec le moteur de templates **Jinja2** de Flask. 

Au lieu d'avoir un fichier HTML géant de 1000 lignes, nous allons découper le site en petits morceaux réutilisables (header, footer, sections), ce qui est la norme absolue en entreprise.

---

## 📐 Concept de la Factorisation avec Jinja2

Voici comment les différents morceaux de code HTML (les composants d'inclusion ou *includes*) sont assemblés dynamiquement par Flask pour générer les pages finales :

```mermaid
graph TD
    subgraph Pages Principales
        Index[templates/index.html]
        Contact[templates/contact.html]
    end

    subgraph Composants Réutilisables templates/includes/
        Header[header.html <br> Barre de navigation]
        Footer[footer.html <br> Réseaux sociaux & copyright]
        Comp[competences.html <br> Liste des aptitudes]
        Form[formations.html <br> Parcours scolaire]
    end

    Index -->|{% include %}| Header
    Index -->|{% include %}| Comp
    Index -->|{% include %}| Form
    Index -->|{% include %}| Footer

    Contact -->|{% include %}| Header
    Contact -->|{% include %}| Footer
```

---

## 📦 Partie 1 : Configuration et Structure du Projet

Flask impose une structure de dossiers stricte pour localiser automatiquement les fichiers statiques (images, CSS, téléchargements) et les templates HTML.

### 1. Création de l'arborescence
Dans votre environnement de développement (sous WSL/Ubuntu ou Terminal), créez un dossier pour le TP et configurez la structure suivante :

```text
mon_projet_flask/
│
├── app.py
├── static/
│   ├── css/
│   │   └── style.css
│   ├── files/
│   │   └── cv.pdf          <-- 📄 Téléchargement obligatoire (Contrainte du TP)
│   └── affiches/
│       └── (tes images...)
└── templates/
    ├── index.html
    ├── contact.html
    └── includes/           <-- 🧩 Dossier contenant nos composants réutilisables
        ├── header.html
        ├── footer.html
        ├── competences.html
        └── formations.html
```

### 2. Serveur Flask de base (`app.py`)
Voici le code minimal pour démarrer le serveur Web local :

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # Contrainte du TP : Le titre doit être passé en variable
    nom_site = "Mon Portfolio Professionnel"
    return render_template('index.html', title=nom_site)

@app.route('/contact')
def contact():
    nom_site = "Contactez-moi"
    return render_template('contact.html', title=nom_site)

if __name__ == '__main__':
    # Mode debug activé pour le développement
    app.run(debug=True, port=5000)
```

> [!NOTE]
> **Pourquoi cette configuration ?**
> - `render_template('index.html', title=nom_site)` : Flask va chercher le fichier dans le dossier `templates/`. En passant `title=nom_site`, on injecte une variable Python directement dans le code HTML via le moteur de rendu Jinja2.
> - `debug=True` : Le serveur redémarre automatiquement à chaque fois que vous modifiez votre code Python. De plus, il affiche les erreurs système en clair dans le navigateur en cas de bug.

---

## 🧩 Partie 2 & 3 : Analyse et Développement (La Factorisation)

C'est le cœur du TP. Nous allons utiliser la directive Jinja2 `{% include 'includes/...' %}` pour assembler notre page à partir de fichiers autonomes.

### 1. Créer les sous-sections réutilisables (les *includes*)

Dans le dossier `templates/includes/`, isolez vos composants HTML :

#### 🔹 `templates/includes/header.html` (Barre de navigation Bootstrap) :
```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="#">{{ title }}</a>
    <div class="navbar-nav">
      <a class="nav-link" href="/">Accueil</a>
      <a class="nav-link" href="/contact">Contact</a>
    </div>
  </div>
</nav>
```

#### 🔹 `templates/includes/footer.html` (Contrainte : 3 réseaux sociaux ouverts dans un nouvel onglet) :
```html
<footer class="bg-dark text-white text-center py-4 mt-5">
  <div class="container">
    <p>&copy; 2026 Briac - Tous droits réservés</p>
    <div class="fs-4">
      <a href="https://github.com" target="_blank" rel="noopener" class="text-white mx-2"><i class="bi bi-github"></i></a>
      <a href="https://linkedin.com" target="_blank" rel="noopener" class="text-white mx-2"><i class="bi bi-linkedin"></i></a>
      <a href="https://twitter.com" target="_blank" rel="noopener" class="text-white mx-2"><i class="bi bi-twitter"></i></a>
    </div>
  </div>
</footer>
```

### 2. Assemblage dans le fichier principal (`templates/index.html`)
Voici comment lier vos feuilles de style, intégrer Bootstrap, et assembler la page grâce aux composants :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    
    <!-- Liens CDN Bootstrap & Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    
    <!-- Lien CSS dynamique via url_for -->
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
</head>
<body class="bg-light">

    <!-- 1. Inclusion de l'en-tête -->
    {% include 'includes/header.html' %}

    <main class="container my-5">
        <div class="p-5 mb-4 bg-white rounded-3 shadow-sm">
            <h1 class="display-5 fw-bold">Bienvenue sur mon Portfolio</h1>
            <p class="col-md-8 fs-4">Découvrez mes compétences et mes réalisations.</p>
            
            <!-- Téléchargement du CV avec attribut download -->
            <a href="{{ url_for('static', filename='files/cv.pdf') }}" class="btn btn-primary btn-lg" download>
                <i class="bi bi-download"></i> Télécharger mon CV (PDF)
            </a>
        </div>

        <!-- 2. Inclusion des sections de contenu -->
        {% include 'includes/competences.html' %}
        {% include 'includes/formations.html' %}
    </main>

    <!-- 3. Inclusion du pied de page -->
    {% include 'includes/footer.html' %}

    <!-- Scripts Bootstrap -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

> [!IMPORTANT]
> **Pourquoi utiliser la fonction `url_for()` ?**
> En HTML classique, on écrirait `<link href="/static/css/style.css">`. Cependant, si votre application change d'adresse ou s'exécute dans un sous-dossier sur le serveur de production, ces chemins relatifs casseront.
> `url_for('static', filename='...')` est une fonction dynamique de Flask. Elle génère automatiquement la bonne URL absolue vers le dossier `static/` peu importe l'hôte d'hébergement.

---

## ✉️ Partie 3 : La Page Contact (`templates/contact.html`)

Le TP demande de créer une section "Contact". On va lui dédier une route spécifique en réutilisant exactement les mêmes *Header* et *Footer* afin d'assurer une parfaite cohérence visuelle.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
</head>
<body>

    <!-- Réutilisation du header factorisé -->
    {% include 'includes/header.html' %}

    <div class="container my-5" style="max-width: 600px;">
        <div class="card p-4 shadow-sm">
            <h2 class="mb-4 text-center">Formulaire de Contact</h2>
            <form action="#" method="POST">
                <div class="mb-3">
                    <label for="name" class="form-label">Nom Complet</label>
                    <input type="text" class="form-control" id="name" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Adresse Email</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="mb-3">
                    <label for="message" class="form-label">Message</label>
                    <textarea class="form-control" id="message" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn btn-dark w-100">Envoyer</button>
            </form>
        </div>
    </div>

    <!-- Réutilisation du footer factorisé -->
    {% include 'includes/footer.html' %}

</body>
</html>
```

---

## 🎯 Checklist de Validation du TP (Vérifications Importantes)

Avant de présenter votre travail pour évaluation, assurez-vous de bien valider ces exigences clés :

- [ ] **Arborescence stricte** : Les dossiers obligatoires `static/`, `templates/` et le script `app.py` sont créés au bon endroit.
- [ ] **Ressources dynamiques** : Tous vos fichiers CSS, images et documents PDF sont appelés exclusivement via la fonction `url_for()`.
- [ ] **Routage variables** : Le titre du site n'est pas codé en dur, il est injecté depuis `app.py` via `render_template(..., title=...)`.
- [ ] **Téléchargement sécurisé** : Le lien de téléchargement pointe bien vers un fichier situé dans `static/files/` et possède l'attribut `download`.
- [ ] **Liens sortants** : Les 3 liens de réseaux sociaux dans le footer s'ouvrent tous dans un nouvel onglet (`target="_blank"`).

---

## 💡 Astuce de Gain de Temps : Réutiliser le "Lama" (TP1)

Reprendre la structure graphique et le contenu textuel de votre projet du TP1 va vous faire gagner un temps précieux en séance de TP. Pour réussir cette intégration facilement, respectez ces trois règles techniques :

### 1. Le transfert des assets (Images / CSS)
Déplacez vos fichiers de style CSS personnalisés et vos visuels de lamas du TP1 directement dans les dossiers cibles :
- Vos images dans `static/affiches/` ou `static/images/`.
- Vos règles de style CSS dans `static/css/style.css`.

### 2. Remplacement des liens classiques par la syntaxe Jinja2
Remplacez systématiquement vos balises de lien par des appels `url_for()` :
* **Avant (Classique)** : `<img src="images/votre_img.jpg">`
* **Après (Flask)** : `<img src="{{ url_for('static', filename='affiches/votre_img.jpg') }}">`

### 3. Découper le contenu en fichiers inclus
Dans votre HTML d'origine du TP1, isolez les blocs principaux et transférez-les dans `templates/includes/` :
- Le contenu de la balise `<nav>` ou `<header>` ➡️ `header.html`
- Les détails et la présentation du lama ➡️ `presentation.html`
- Le pied de page et les mentions ➡️ `footer.html`

---

## 💾 Section Avancée : Persistance des Données avec Flask-SQLAlchemy

L'intégration d'une base de données montre votre maîtrise du cycle de vie complet d'une application web (Client ↔️ Serveur ↔️ Base de données).

Nous allons utiliser **Flask-SQLAlchemy**, une extension ORM (Object-Relational Mapping). Elle permet de requêter et structurer les tables MySQL ou SQLite en écrivant du simple code Python.

Voici les raisons concrètes pour lesquelles on utilise un ORM comme **SQLAlchemy** (et son extension Flask-SQLAlchemy) plutôt que d'écrire des requêtes SQL textuelles brutes.

---

### 🌟 Pourquoi utiliser un ORM (SQLAlchemy) ?

#### 1️⃣ L'indépendance vis-à-vis du SGBD (L'abstraction)
C'est le point le plus important en développement. Si vous écrivez du SQL brut, la syntaxe peut différer selon les moteurs (ex: SQLite vs MySQL sur la gestion des clés primaires auto-incrémentées ou certains types de données).
- **Le rôle de SQLAlchemy** : Il agit comme un traducteur universel. Vous écrivez du code Python standard, et SQLAlchemy se charge de le traduire en requêtes SQL parfaites pour le SGBD configuré (MySQL, SQLite, PostgreSQL, etc.). 
- **Bénéfice** : Vous pouvez passer de MySQL à SQLite en modifiant une seule ligne de configuration, sans toucher à un seul morceau de code applicatif.

#### 2️⃣ Le concept d'ORM (Object-Relational Mapping)
Un ORM fait le pont entre deux mondes qui ne se comprennent pas nativement :
*   Le monde de la **Programmation Orientée Objet** (Python), où l'on manipule des classes et des instances.
*   Le monde **Relationnel** (Les bases de données SQL), où l'on manipule des tables, des lignes et des colonnes.

Au lieu de récupérer des listes de tuples complexes ou d'écrire des chaînes de caractères brutes sujettes aux fautes de frappe :
```python
# Vous instanciez un simple objet Python
nouveau_message = ContactMessage(nom="Briac", email="...", message="...")

# SQLAlchemy s'occupe de le traduire en instruction INSERT INTO
db.session.add(nouveau_message)
```

#### 3️⃣ La sécurité native (Contre les Injections SQL)
Lorsqu'on concatène des variables directement dans une requête brute (`"SELECT * FROM users WHERE name = '" + user_input + "'"`), on s'expose à la faille critique des **injections SQL**. Un utilisateur malveillant pourrait saisir du code SQL dans le formulaire pour altérer ou supprimer la base de données.
- **La protection de SQLAlchemy** : Il utilise des **requêtes préparées** (parameterized queries). Il sépare strictement la structure de la requête SQL des données saisies. Les entrées utilisateur sont neutralisées et traitées comme du simple texte inoffensif.

#### 4️⃣ La création automatique du schéma (`db.create_all()`)
Grâce à `db.create_all()`, Flask-SQLAlchemy inspecte vos classes Python de modèle (comme `ContactMessage`) et génère automatiquement les tables SQL correspondantes si elles n'existent pas. Vous n'avez pas besoin d'ouvrir phpMyAdmin ou d'écrire des scripts SQL `CREATE TABLE` complexes à la main.

> [!TIP]
> **Ce qu'il faut retenir pour l'oral :**
> *"On utilise SQLAlchemy parce que c'est un ORM qui sécurise l'application contre les injections SQL, simplifie la manipulation des données via des objets Python, et assure la portabilité : on passe d'un moteur SQL à un autre en ne changeant qu'une ligne de code."*

---

### 🐍 L'Alternative Historique : Le driver MySQL brut (PyMySQL)

Si on met de côté les avantages d'un ORM et la sécurité native pour étudier le fonctionnement le plus direct avec MySQL, on utilise un pilote (driver) brut tel que **PyMySQL** ou `mysql-connector-python`. 

Voici à quoi ressemblerait le code Flask avec cette approche "historique" (sans ORM). C'est le mécanisme que SQLAlchemy encapsule en arrière-plan :

#### 1. Installation du driver
```bash
pip install PyMySQL
```

#### 2. Serveur Flask brut (`app.py`)
Ici, on ouvre une connexion manuelle, on crée un **curseur** (l'entité qui transmet les ordres SQL au serveur), on écrit la requête en texte brut, et on gère manuellement la transaction et la fermeture de la connexion.

```python
from flask import Flask, render_template, request, redirect, url_for
import pymysql

app = Flask(__name__)

# Fonction pour initialiser et retourner une connexion MySQL brute
def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='root',
        database='db_r209_tp3',
        cursorclass=pymysql.cursors.DictCursor # Récupère les lignes sous forme de dictionnaires
    )

@app.route('/')
def index():
    return render_template('index.html', title="Lama-Post-v2")

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # Récupération des données du formulaire HTML
        nom = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # 1. Ouverture manuelle de la connexion
        connection = get_db_connection()
        try:
            with connection.cursor() as cursor:
                # 2. Écriture de la requête SQL en texte brut
                sql = "INSERT INTO contact_messages (nom, email, message) VALUES (%s, %s, %s)"
                
                # 3. Exécution avec paramètres sécurisés par le driver
                cursor.execute(sql, (nom, email, message))
            
            # 4. Validation (commit) de la transaction
            connection.commit()
            
        except Exception as e:
            print(f"⚠️ Erreur SQL : {e}")
        finally:
            # 5. Fermeture OBLIGATOIRE de la connexion
            connection.close()
            
        return redirect(url_for('index'))

    return render_template('contact.html', title="Déposer une main courante")

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
```

#### 🔍 Pourquoi évite-t-on cette méthode en production ?
*   **Gestion manuelle des connexions** : Si vous oubliez d'appeler `connection.close()`, les connexions restent ouvertes. Le serveur MySQL va saturer en quelques minutes et renvoyer une erreur *"Too many connections"*.
*   **Création manuelle du schéma** : Contrairement à `db.create_all()`, si la base de données est vide, ce code plantera immédiatement. Vous devez exécuter vous-même le script `CREATE TABLE` dans votre console MySQL ou phpMyAdmin avant de démarrer l'application.
*   **Lourdeur d'écriture** : Écrire chaque espace, guillemet et virgule dans des chaînes de caractères SQL s'avère extrêmement fastidieux pour les projets d'envergure.

---

### Étape 1 : Installation des dépendances

```bash
pip install Flask-SQLAlchemy PyMySQL
```

### Étape 2 : Serveur mis à jour avec BDD (`app.py`)
Ce code vérifie automatiquement l'existence locale de la base de données `db_r209_tp3` dans MySQL et la crée si nécessaire. Il instancie ensuite SQLAlchemy pour générer la table `contact_messages` :

```python
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import mysql.connector as MC
from mysql.connector import Error

app = Flask(__name__)

# ==============================================================================
# 🔌 ÉTAPE 1 : VÉRIFICATION & CRÉATION AUTOMATIQUE DE LA BASE DE DONNÉES
# ==============================================================================
def ensure_database_exists():
    try:
        # Connexion au serveur MySQL local (sans spécifier de base)
        conn = MC.connect(
            host='localhost',
            user='root',
            password='root'
        )
        cursor = conn.cursor()
        # On utilise des backticks `db_r209_tp3` (plus besoin pour le tiret mais bonne habitude)
        cursor.execute("CREATE DATABASE IF NOT EXISTS `db_r209_tp3` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.close()
        conn.close()
        print("Base de données 'db_r209_tp3' vérifiée ou créée avec succès !")
    except Error as e:
        print(f"⚠️ Erreur lors de la vérification de la BDD MySQL : {e}")

# Appel immédiat de la vérification de la BDD
ensure_database_exists()

# ==============================================================================
# 🗄️ ÉTAPE 2 : CONFIGURATION DE FLASK-SQLALCHEMY (MySQL)
# ==============================================================================
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost/db_r209_tp3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ==============================================================================
# 📝 ÉTAPE 3 : MODÈLE DE DONNÉES (Structure de la table SQL 'contact_messages')
# ==============================================================================
class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)

    def __init__(self, nom, email, message):
        self.nom = nom
        self.email = email
        self.message = message

# Création automatique de la table dans le contexte applicatif si elle n'existe pas
with app.app_context():
    db.create_all()

# ==============================================================================
# 🌐 ÉTAPE 4 : ROUTES & LOGIQUE MÉTIER
# ==============================================================================

@app.route('/')
def index():
    return render_template('index.html', title="Lama-Post-v2")

# Gestion du formulaire de contact (GET pour afficher, POST pour soumettre en BDD)
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # 1. Récupération des données saisies (grâce aux attributs 'name' du HTML)
        nom_saisi = request.form.get('name')
        email_saisi = request.form.get('email')
        message_saisi = request.form.get('message')
        
        # 2. Instanciation du modèle ContactMessage
        nouveau_message = ContactMessage(nom=nom_saisi, email=email_saisi, message=message_saisi)
        
        try:
            # 3. Ajout et persistance dans la table SQL
            db.session.add(nouveau_message)
            db.session.commit()
            # Redirection vers la page d'accueil après succès
            return redirect(url_for('index'))
        except Exception as e:
            db.session.rollback()
            return f"⚠️ Erreur lors de l'enregistrement du message : {e}"

    # Si c'est une requête GET (simple affichage de la page de contact)
    return render_template('contact.html', title="Déposer une main courante")

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
```

### Étape 3 : Adapter le formulaire HTML (`templates/contact.html`)
Pour que le serveur récupère les saisies de l'utilisateur, deux règles de base doivent être appliquées :
1. Le formulaire `<form>` doit disposer de l'attribut `method="POST"`.
2. Chaque champ de saisie (`<input>` ou `<textarea>`) doit impérativement posséder un attribut `name` unique.

```html
<form action="{{ url_for('contact') }}" method="POST">
    <div class="mb-3">
        <label for="name" class="form-label">Nom Complet</label>
        <input type="text" class="form-control" id="name" name="name" required>
    </div>
    <div class="mb-3">
        <label for="email" class="form-label">Adresse Email</label>
        <input type="email" class="form-control" id="email" name="email" required>
    </div>
    <div class="mb-3">
        <label for="message" class="form-label">Message</label>
        <textarea class="form-control" id="message" name="message" rows="4" required></textarea>
    </div>
    <button type="submit" class="btn btn-dark w-100">Envoyer</button>
</form>
```

---

## 🔍 Explications clés pour l'évaluation orale

> [!TIP]
> **Pourquoi utiliser Flask-SQLAlchemy plutôt que du SQL brut ?**
> SQLAlchemy abstrait la couche de données. Si vous passez de MySQL à SQLite, il vous suffit de changer la chaîne de configuration (`SQLALCHEMY_DATABASE_URI`). Tout le reste de votre code applicatif (les requêtes d'insertion, l'instanciation des modèles) reste rigoureusement identique.

> [!IMPORTANT]
> **À quoi sert `db.create_all()` ?**
> Flask-SQLAlchemy inspecte les modèles déclarés (comme `ContactMessage`). Si la table correspondante n'existe pas en base de données, il exécute automatiquement la commande SQL `CREATE TABLE` adéquate. Cela évite d'avoir à exécuter des scripts SQL à la main.

> [!NOTE]
> **Quel est le rôle de `db.session.commit()` ?**
> Dans les bases de données relationnelles, les modifications s'effectuent par "transactions". `db.session.add()` prépare la requête dans un espace tampon temporaire (un brouillon). L'instruction `commit()` valide de manière permanente l'écriture en base. En cas de plantage intermédiaire, `db.session.rollback()` permet d'annuler la transaction pour éviter de corrompre la base de données.