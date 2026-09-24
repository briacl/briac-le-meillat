---
title: "Fondations du Web & Bootstrap"
module: "R209"
competence: ["Programmer"]
ac_lies: ["AC13.04"]
techs: ["HTML5", "CSS3", "Web"]
date: "2026-05-02"
status: "Terminé"
image: ""
---
# Compte-Rendu Technique : Fondations du Web (HTML5/CSS3) & Framework Bootstrap
> **R209 — Initiation au Développement Web** — *Briac Le Meillat*

Ce compte-rendu détaille la mise en œuvre pratique des fondamentaux du développement web front-end. L'objectif de ce premier TP est de concevoir un site web monopage (landing page) à l'esthétique décalée et humoristique sur le thème du "Lama", d'abord en écrivant des structures HTML5 sémantiques et des styles CSS3 personnalisés de zéro (Vanilla CSS), avant de réaliser un refactoring complet en intégrant le framework CSS moderne Bootstrap 5 afin d'assurer l'adaptabilité et la réactivité mobile (Responsive Design).

---

## 🛠️ Étape Préparatoire : Visualisation locale en temps réel (Live Server)

### 💡 L'explication vulgarisée
Pour développer et tester notre site internet en direct sans avoir à rafraîchir manuellement le navigateur à chaque modification de code, nous utilisons l'extension **Live Server** intégrée à notre éditeur de code. Elle lance instantanément un mini-serveur web local temporaire (généralement accessible sur le port 5500). Dès qu'un fichier HTML ou CSS est sauvegardé, la page se met à jour automatiquement dans le navigateur. C'est l'outil standard en développement front-end rapide.

---

### 🖥️ Explication Détaillée & Réalisation

Contrairement aux architectures complexes (comme Flask ou LAMP), ce TP repose uniquement sur des technologies front-end statiques. L'utilisation de Live Server évite le protocole brut `file:///` qui peut bloquer certaines fonctionnalités du navigateur (comme le chargement de polices distantes ou les requêtes asynchrones).

#### A. Démarrage de la prévisualisation
Dans notre éditeur de code, un clic sur le bouton **"Go Live"** en bas à droite de la barre d'état génère et ouvre l'URL locale suivante :

```text
http://127.0.0.1:5500/tp1/index.html
```

#### B. La Contrainte Structurale Majeure (Zéro texte isolé)
> [!IMPORTANT]
> **Contrainte de développement imposée par le sujet :**
> Aucun texte ne doit être laissé "seul" ou "nu" dans le code HTML. La moindre chaîne de caractères (même à l'intérieur d'un bouton, d'une cellule de tableau ou d'un lien) doit être rigoureusement enveloppée dans une balise sémantique de texte comme `<p>` ou `<span>`.

---

## 🔴 Partie 1 — Intégration HTML5 & CSS3 Pure (Vanilla CSS)

### 💡 L'explication vulgarisée
Dans cette première phase, nous créons la structure et la mise en page de notre site de toutes pièces. 
Le fichier HTML5 (`index.html`) définit la structure sémantique (l'ossature) de notre page : le menu de navigation (redirigeant vers des points d'ancrage), le contenu principal découpé en sections logiques et le formulaire de contact.
Le fichier CSS3 (`css/style.css`) gère l'apparence visuelle (l'habillage) : les alignements, le positionnement horizontal du menu, la dimension et le centrage de l'image du lama, ainsi que l'esthétique du tableau et des boutons.

---

### 🖥️ Explication Détaillée & Réalisation

#### A. L'ossature sémantique HTML5 (`index.html`)
La page est encodée en UTF-8 avec le titre obligatoire `TP 1 - R209`. Elle comprend un titre principal `H1`, une liste de navigation, une image de lama stockée en local, un tableau de performances comparées, et un formulaire de contact non fonctionnel.

##### 1. Menu de navigation par ancres
Les liens du menu redirigent vers des sections précises de la même page grâce aux identifiants (ancrages) :

```html
<header>
    <nav>
        <ul id="menu-principal">
            <li><a href="https://www.legorafi.fr/"><span>L'Éveil</span></a></li>
            <li><a href="#stats"><span>La Fiche Technique</span></a></li>
            <li><a href="#anatomie"><span>L'Anatomie</span></a></li>
            <li><a href="#rh"><span>Plainte RH</span></a></li>
        </ul>
    </nav>
</header>
```

##### 2. Formulaire de contact réglementaire
Conformément au sujet, il comprend un champ sujet, un textarea pour le message, un champ e-mail et un bouton d'envoi :

```html
<form action="#">
    <div class="form-item">
        <p><span>Sujet du ticket Jira :</span></p>
        <input type="text" name="sujet" placeholder="Ex: Mon lama ne répond plus aux pings">
    </div>
    <div class="form-item">
        <p><span>Email de l'esclave :</span></p>
        <input type="text" name="email" placeholder="burnout@startup-nation.com">
    </div>
    <div class="form-item">
        <p><span>Confession (Ferrari style) :</span></p>
        <textarea name="corps" placeholder="Dites-nous tout..."></textarea>
    </div>
    <button type="submit" class="btn-envoi"><span>Envoyer (ASAP)</span></button>
</form>
```

#### B. Les fonctionnalités esthétiques et interactives clés du CSS3

##### 1. Le menu de navigation horizontal
Il prend toute la largeur de l'écran avec Flexbox et reste collé en haut grâce au positionnement collant :

```css
#menu-principal {
    display: flex;
    justify-content: center;
    list-style-type: none;
    padding: 30px;
    margin: 0;
    background: linear-gradient(90deg, #2c3e50, #000000);
    position: sticky;
    top: 0;
    z-index: 1000;
}
```

##### 2. Centrage et dimensions de l'image
Conformément au sujet, l'image prend 38% (entre 30 et 40%) de la largeur de la page et est parfaitement centrée horizontalement :

```css
.lama-link {
    position: relative;
    display: block;
    width: 38%; /* Contrainte 30-40% respectée */
    margin: 40px auto; /* Centrage horizontal automatique */
}
.img-lama {
    width: 100%;
    border: 10px solid white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    transform: rotate(-2deg); /* Inclinaison Castello-Lopes */
    transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

##### 3. Tableau avec contours 2px et effet zèbre (`:nth-child`)
Les lignes paires et impaires alternent les couleurs gris clair et blanc :

```css
table {
    width: 90%;
    margin: 50px auto;
    border-collapse: collapse;
    border: 2px solid #000; /* Contour noir 2px */
}
td {
    padding: 15px;
    border: 2px solid #000; /* Contour intérieur noir 2px */
}
tr:nth-child(even) {
    background-color: #ecf0f1; /* Ligne sur deux foncée (gris) */
}
tr:nth-child(odd) {
    background-color: #ffffff; /* Ligne sur deux claire (blanc) */
}
```

##### 4. Boutons interactifs et stress de saisie (:focus / :hover)
*   **Bouton d'envoi** : Noir/texte blanc au survol, et blanc/texte noir par défaut (contour noir maintenu).
*   **Champs de saisie** : Bordure rouge intense au focus pour matérialiser l'interaction.

```css
/* Bouton d'envoi */
.btn-envoi {
    background-color: #fff;
    color: #000;
    border: 2px solid #000;
    padding: 15px 40px;
    transition: 0.2s;
}
.btn-envoi:hover {
    background-color: #000; /* Devient noir */
    color: #fff; /* Texte blanc */
}

/* Saisie active */
input:focus,
textarea:focus {
    border: 2px solid #e74c3c;
    background-color: #fff5f5;
    outline: none;
}
```

---

## 🔑 Partie 2 — Transition Moderne : Refactoring avec le Framework Bootstrap

### 💡 L'explication vulgarisée
Pour accélérer le développement et standardiser le design, nous intégrons **Bootstrap 5**. Ce framework CSS nous fournit des composants pré-stylisés (cartes, alertes, formulaires, barres de navigation) et un système de grille fluide de 12 colonnes. Nous retirons nos styles CSS écrits à la main pour le formulaire et le tableau et laissons Bootstrap gérer l'aspect professionnel et responsive, tout en surchargeant quelques éléments dans `style-bootstrap.css` pour conserver notre identité graphique décalée.

---

### 🖥️ Explication Détaillée & Réalisation

Le refactoring complet est stocké dans le fichier `index-bootstrap.html` avec la feuille de style complémentaire `css/style-bootstrap.css`.

#### A. Intégration de Bootstrap 5
Nous lions le CDN en ligne dans l'entête :

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

> [!WARNING]
> **L'importance de l'ordre d'appel :**
> Pour que nos personnalisations prennent effet, notre feuille de style `style-bootstrap.css` doit impérativement être appelée **après** le lien CDN de Bootstrap. Dans le cas contraire, les règles globales de Bootstrap écraseront nos modifications spécifiques.

#### B. Intégration des composants Bootstrap requis
1.  **L'Alerte dismissed** : Un bandeau d'alerte rouge (`.alert-danger`) dismissible, simulant un piratage de lama.
2.  **La Barre de navigation** : Un menu moderne sombre (`.navbar-dark .bg-dark`) avec comportement sticky.
3.  **Le Tableau responsive** : Classes `.table .table-striped .table-bordered` appliquées au tableau technique.
4.  **Le Formulaire standardisé** : Champs stylisés avec les classes `.form-label` et `.form-control` de Bootstrap.

#### C. Les 3 éléments complémentaires choisis
Pour aller plus loin dans la découverte de Bootstrap (Partie 3 du sujet), nous avons intégré :
*   **Shadows (Ombrages)** : Utilisation de la classe utilitaire `.shadow-sm` sur le formulaire pour créer du relief.
*   **Borders personnalisés** : Application de bordures de couleur secondaires épaisses (`.border-start .border-5 .border-secondary`) sur la section de citation et le formulaire pour renforcer l'aspect corporate.
*   **Marges et Espacements (Utilities)** : Structuration du layout mobile-first à l'aide des classes d'espacement de grille de Bootstrap (comme `.my-5`, `.mb-4`, `.py-3`).

#### D. Surcharges CSS intelligentes (`css/style-bootstrap.css`)
Nous avons fusionné les classes Bootstrap et nos règles comportementales CSS :

```css
/* Adaptation du zébrage sur la structure de tableau de Bootstrap */
.table tr:nth-child(even) {
    background-color: #e9ecef !important;
}
.table tr:nth-child(odd) {
    background-color: #ffffff !important;
}

/* Le Stress de la Saisie appliqué aux inputs de formulaire Bootstrap */
.form-control:focus {
    border: 2px solid #dc3545 !important;
    background-color: #fff5f5 !important;
    box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
}
```

---

## 🛡️ Partie 3 — Comparaison et Analyse (CSS Custom vs Bootstrap)

Afin de mesurer l'impact de l'utilisation d'un framework, voici un comparatif direct sur les points structurels étudiés durant ce TP :

| Critère | Partie 1 : Vanilla HTML/CSS | Partie 2 : Refactoring Bootstrap 5 |
| :--- | :--- | :--- |
| **Grille & Structure** | Positionnement manuel fastidieux (Flexbox, Grilles CSS brutes). | Classes de mise en page immédiates (`.container`, `.row`, `.col-md-6`). |
| **Adaptabilité Mobile** | Nécessite d'écrire des `@media screen` pour ajuster chaque taille. | Mobile-first natif avec système de grille fluide. |
| **Composants natifs** | Doivent être construits entièrement (Boutons, menus, alertes). | Bibliothèque riche et immédiate (`.navbar`, `.alert`, `.card`, `.btn`). |
| **Vitesse de développement**| Plus lente, codage de chaque propriété visuelle de zéro. | Très rapide, assemblage de classes prédéfinies. |

---

## ✅ Conclusion

Ce premier TP met en relief la complémentarité entre la maîtrise du code CSS pur et l'utilisation de frameworks industriels comme Bootstrap 5. Si Vanilla CSS offre une liberté artistique totale et indispensable pour des animations uniques (comme l'image rotative interactive ou les effets au survol du menu), Bootstrap s'impose comme un outil incontournable pour structurer rapidement des maquettes complexes, assurer une compatibilité mobile instantanée et intégrer des composants interactifs standardisés sans avoir à écrire de JavaScript.

> [!TIP]
> **Résumé des compétences acquises :**
> - 📂 **Visualisation agile** : Utilisation de l'extension *Live Server* pour tester les modifications HTML/CSS en temps réel sans rechargement manuel.
> - 🎨 **Sémantique & Style** : Structuration de sections HTML5 sous la contrainte de non-isolation du texte (`<p>`/`<span>`) et manipulation fine de pseudo-classes CSS.
> - 📱 **Transition Responsive** : Refactoring moderne avec Bootstrap 5 en préservant des comportements CSS originaux par surcharge.
