# 🧪 TP3 : Factorisation de Templates & Persistance avec Jinja2 et Flask

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
    nom_site = "Lama-Post-v2"
    return render_template('index.html', title=nom_site)

@app.route('/contact')
def contact():
    nom_site = "Déposer une main courante"
    return render_template('contact.html', title=nom_site)

if __name__ == '__main__':
    # Mode debug activé pour le développement
    app.run(host='127.0.0.1', port=5000, debug=True)
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
            <ul class="navbar-nav w-100 justify-content-around" id="menu-principal">
                <li class="nav-item"><a class="nav-link" href="https://www.legorafi.fr/"><span>L'Éveil</span></a></li>
                <li class="nav-item"><a class="nav-link" href="#stats"><span>La Fiche Technique</span></a></li>
                <li class="nav-item"><a class="nav-link" href="#anatomie"><span>L'Anatomie</span></a></li>
                <li class="nav-item"><a class="nav-link" href="/contact" target="_blank"><span>Plainte RH</span></a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

#### 🔹 `templates/includes/footer.html` (Contrainte : 3 réseaux sociaux ouverts dans un nouvel onglet) :
```html
<footer class="bg-dark text-white text-center py-4 mt-5">
  <div class="container">
    <p>&copy; 2026 Lama - Tous droits réservés</p>
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
            <h2 class="mb-4 text-center">Formulaire de plainte</h2>
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

Reprendre la structure graphique et le contenu textuel de votre projet "Lama" du TP1 va vous faire gagner un temps précieux en séance de TP. Pour réussir cette intégration facilement, respectez ces trois règles techniques :

### 1. Le transfert des assets (Images / CSS)
Déplacez vos fichiers de style CSS personnalisés et vos visuels de lamas du TP1 directement dans les dossiers cibles :
- Vos images dans `static/affiches/` ou `static/images/`.
- Vos règles de style CSS dans `static/css/style.css`.

### 2. Remplacement des liens classiques par la syntaxe Jinja2
Remplacez systématiquement vos balises de lien par des appels `url_for()` :
* **Avant (Classique)** : `<img src="images/lama.jpg">`
* **Après (Flask)** : `<img src="{{ url_for('static', filename='affiches/lama.jpg') }}">`

### 3. Découper le contenu en fichiers inclus
Dans votre HTML d'origine du TP1, isolez les blocs principaux et transférez-les dans `templates/includes/` :
- Le contenu de la balise `<nav>` ou `<header>` ➡️ `header.html`
- Les détails et la présentation du lama ➡️ `presentation_lama.html`
- Le pied de page et les mentions ➡️ `footer.html`

---

## 💾 Section Avancée : Persistance des Données avec Flask-SQLAlchemy

L'intégration d'une base de données montre votre maîtrise du cycle de vie complet d'une application web (Client ↔️ Serveur ↔️ Base de données).

Nous allons utiliser **Flask-SQLAlchemy**, une extension ORM (Object-Relational Mapping). Elle permet de requêter et structurer les tables MySQL ou SQLite en écrivant du simple code Python.

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