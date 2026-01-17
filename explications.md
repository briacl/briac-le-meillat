# Comprendre l'Architecture de Synapseo

Ce document a pour but d'expliquer de manière pédagogique comment fonctionne le site web Synapseo, de la base de données jusqu'à l'affichage sur votre écran.

## 1. Vue d'Ensemble

Synapseo est une application "Full-Stack" moderne. Elle utilise deux technologies principales qui communiquent entre elles :

*   **Laravel (PHP)** : C'est le "Backend" (l'arrière-boutique). Il gère la sécurité, la base de données, et la logique métier.
*   **React (JavaScript)** : C'est le "Frontend" (la vitrine). Il gère ce que vous voyez à l'écran, les animations et les interactions.

Le lien entre les deux est fait par **Inertia.js** et **Laravel Breeze**, qui permettent de coder en React tout en gardant la simplicité de Laravel.

---

## 2. Comment s'affiche une page ? (Exemple de la Page d'Accueil)

Quand vous tapez `http://synapseo.test` dans votre navigateur, voici ce qui se passe étape par étape :

### Étape 1 : La Route (Le GPS)
Le navigateur envoie une demande au serveur. Laravel reçoit cette demande et regarde son fichier de "routes" : `routes/web.php`.
Il trouve ceci :
```php
Route::get('/', function () {
    return Inertia::render('LandingPage');
});
```
Cela signifie : *"Si l'utilisateur demande la racine du site (`/`), affiche le composant React appelé 'LandingPage'."*

### Étape 2 : Inertia (Le Messager)
Au lieu de renvoyer du simple HTML, Laravel envoie une réponse spéciale via **Inertia**. Cette réponse contient :
1.  Le nom du composant à afficher (`LandingPage`).
2.  Les données nécessaires (ex: nom de l'utilisateur connecté).

### Étape 3 : React (L'Artiste)
Sur votre navigateur, le code JavaScript prend le relais. Il va chercher le fichier `resources/js/Pages/LandingPage.tsx`.
C'est ici que tout le visuel est défini (HTML, CSS Tailwind, Animations Canvas).
React "dessine" la page et l'affiche à l'utilisateur.

---

## 3. La Base de Données

Le site a besoin de stocker des informations (utilisateurs, prescriptions, etc.).

### Le Stockage (SQLite / MariaDB)
*   Actuellement, nous utilisons **SQLite** (`database/database.sqlite`). C'est un simple fichier qui contient toutes les tables. C'est parfait pour le développement car cela ne nécessite aucune installation complexe.
*   En production, on utiliserait **MariaDB** ou MySQL pour plus de puissance.
*   La configuration se trouve dans le fichier `.env` (qui contient les mots de passe et réglages secrets).

### L'Accès aux Données (Eloquent)
Pour parler à la base de données, on n'écrit pas de SQL compliqué. On utilise **Eloquent**.
Exemple : Pour trouver un utilisateur, on écrit simplement en PHP :
```php
$user = User::find(1);
```
Laravel traduit cela automatiquement en requête SQL pour la base de données.

## 4. L'Architecture des Dossiers

Voici où trouver les fichiers importants :

*   `app/Http/Controllers/` : Les "cerveaux" qui traitent les formulaires et préparent les données.
*   `routes/web.php` : La liste des adresses accessibles sur le site.
*   `resources/js/Pages/` : Les pages visibles (le visuel en React).
*   `resources/js/Components/` : Les briques réutilisables (boutons, champs de saisie) fournies par HeroUI.
*   `database/migrations/` : Les plans de construction de la base de données (décrit les colonnes des tables).

## 5. Résumé pour Débuter

Si vous voulez modifier...
*   **Le design / texte** : Allez dans `resources/js/Pages/`.
*   **La logique / routes** : Allez dans `routes/web.php` ou `app/Http/`.
*   **Le style global** : Allez dans `resources/css/app.css` ou `tailwind.config.js`.

C'est cette séparation claire qui rend le développement maintenable et robuste !
