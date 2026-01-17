# Comprendre le Rendu de l'Application

Ce document explique comment le navigateur affiche ta page web, depuis le fichier HTML de base jusqu'au rendu des composants React.

## 1. Le Point d'Entrée : `index.html`

Lorsque tu ouvres le site, le navigateur charge d'abord le fichier `/index.html`.
Ce fichier est squelettique et sert principalement de conteneur.

```html
<!-- index.html -->
<body>
  <!-- C'est ici que React va injecter toute ton application -->
  <div id="root"></div> 
  
  <!-- Ce script déclenche le processus de démarrage de React -->
  <script type="module" src="/src/main.tsx"></script>
</body>
```

## 2. Le Script Principal : `src/main.tsx`

Le fichier `main.tsx` est le pont entre le HTML et le monde React. Il s'exécute immédiatement après le chargement de `index.html`.

Son rôle est de :
1.  Trouver l'élément HTML avec l'ID `root`.
2.  Initialiser React dans cet élément (`createRoot`).
3.  Rendre le composant principal de l'application (`<App />`) à l'intérieur.

```tsx
// src/main.tsx
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root'); // Récupère le div vide
const root = createRoot(container!); // Crée la racine React
root.render(<App />); // Injecte le composant App
```

## 3. Le Chef d'Orchestre : `src/App.tsx`

Le composant `<App />` est la racine de ton arbre de composants. C'est lui qui structure l'application globale.

Il gère généralement :
*   **Les Providers** : Comme `HeroUIProvider` pour le style ou des contextes globaux.
*   **Le Router** : `BrowserRouter` et `Routes` qui déterminent quel composant afficher en fonction de l'URL de la barre d'adresse.

```tsx
// src/App.tsx
function App() {
    return (
        <HeroUIProvider>
            <BrowserRouter>
                <Routes>
                    {/* Si l'URL est "/", on affiche LandingPage */}
                    <Route path="/" element={<LandingPage />} />
                    
                    {/* Si l'URL est "/doctor", on affiche Doctor */}
                    <Route path="/doctor" element={<Doctor />} />
                    
                    {/* etc... */}
                </Routes>
            </BrowserRouter>
        </HeroUIProvider>
    );
}
```

## Résumé du Flux

1.  **Navigateur** ➜ Charge `index.html`.
2.  **`index.html`** ➜ Appelle le script `src/main.tsx`.
3.  **`src/main.tsx`** ➜ Injecte `<App />` dans le `<div id="root">`.
4.  **`<App />`** ➜ Regarde l'URL et affiche la page correspondante (ex: `<LandingPage />`).
