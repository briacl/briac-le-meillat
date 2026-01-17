# 🧠 Comment ça marche ? (Architecture React SPA)

Nous avons pivoté d'une architecture MVC (Laravel) vers une **Single Page Application (SPA)** entièrement construite avec **React**.

## Pourquoi ce changement ?
Au départ, nous utilisions Laravel pour gérer le backend et le frontend via Inertia.js. Cependant, pour plus de flexibilité et une meilleure gestion de l'interface utilisateur, nous avons décidé de passer à **React** pur côté client. Cela signifie que le navigateur charge une seule page HTML (`index.html`), et React s'occupe de modifier le contenu dynamiquement sans jamais recharger la page entière.

## 🏗️ Architecture SPA (Single Page Application)

### 1. Le Point d'Entrée (`index.html`)
Tout commence avec le fichier `synapseo/index.html`. C'est la seule vraie page HTML du site. Elle contient une balise "div" vide (souvent avec l'id `root`) où React va venir injecter toute notre application.

### 2. Le Moteur (Vite + React)
Nous utilisons **Vite** comme outil de développement. Il est extrêmement rapide et sert nos fichiers au navigateur.
React, lui, est la librairie qui nous permet de construire notre interface sous forme de **Composants**.

### 3. Les Composants
Au lieu de penser en "pages", on pense en "composants". Un bouton est un composant, un formulaire est un composant, une carte de profil est un composant.
Ces composants sont réutilisables et imbriquables.

Exemple : La page d'accueil (`Home.tsx`) peut contenir un composant `Navbar` et un composant `Footer`.

### 4. Le Routing (React Router)
Puisqu'on a qu'une seule page HTML, comment avoir plusieurs URLs (`/`, `/about`, `/login`) ?
C'est le rôle de **React Router**. C'est une librairie qui "simule" la navigation.
- Quand tu cliques sur un lien, React Router empêche le navigateur de recharger la page.
- À la place, il change l'URL dans la barre d'adresse et demande à React d'afficher un autre composant à la place du précédent.

## 📂 Structure des Dossiers Importants

Dans le dossier `synapseo/src` :
- `components/` : Les petites briques réutilisables (Boutons, Inputs, Cards...).
- `pages/` : Les composants qui représentent des pages entières (Home, Login, Dashboard...).
- `App.tsx` : Le composant principal qui définit souvent les routes.
- `main.tsx` : Le point de départ du code React qui lie l'app au `index.html`.

## 🔄 Le Cycle de Vie (Data Flow)

Contrairement au MVC où le serveur envoie la page toute faite :
1. Le navigateur demande le site.
2. Le serveur renvoie un fichier HTML vide et les scripts JS React.
3. React démarre dans le navigateur et construit l'interface.
4. Si on a besoin de données (utilisateurs, produits...), React fait des appels API (fetch/axios) vers un serveur externe (si on en a un) et met à jour l'affichage dès qu'il reçoit la réponse.

C'est ce qui rend l'application ultra-réactive et fluide !
