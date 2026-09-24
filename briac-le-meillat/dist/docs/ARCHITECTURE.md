# Architecture du Site - Briac Le Meillat Portfolio

Ce document agit comme une **carte de navigation technique**. Inspiré de l'approche MVC et du modèle C4, il vous permet de comprendre la structure globale du site, puis de "zoomer" jusqu'à la ligne de code exacte responsable de l'affichage d'un élément ou d'une donnée sur la Landing Page.

---

## 🌍 Niveau 1 : Vue Système (Global)
L'architecture globale montre comment les différentes briques technologiques interagissent. Le site fonctionne principalement en "CSR" (Client-Side Rendering) avec un backend serverless pour les tâches d'administration.

```mermaid
graph TD
    User([👤 Visiteur])
    Admin([🔑 Administrateur])
    
    subgraph "Frontend (React / Vite)"
        App[📱 Application Portfolio\nReact 18, Tailwind, HeroUI]
        StaticData[(📂 JSON & MD\nDonnées statiques)]
    end
    
    subgraph "Backend Serverless"
        Workers[⚡ Cloudflare Workers\nAuthentification & API GitHub]
    end
    
    subgraph "Services Externes"
        GitHub[🐙 GitHub API\nStockage & Versioning]
    end

    User -->|Visite| App
    App <-->|Fetch dynamique| StaticData
    
    Admin -->|Login & Upload| App
    App -->|Appel API Sécurisé| Workers
    Workers -->|Commits directs| GitHub
    
    style User fill:#0a0a0a,stroke:#3b82f6,color:#fff
    style Admin fill:#0a0a0a,stroke:#ff3b3b,color:#fff
    style App fill:#1e1e1e,stroke:#3b82f6,stroke-width:2px,color:#fff
    style StaticData fill:#1e1e1e,stroke:#8b5cf6,color:#fff
    style Workers fill:#1e1e1e,stroke:#f59e0b,color:#fff
    style GitHub fill:#1e1e1e,stroke:#fff,color:#fff
```

---

## 🏗️ Niveau 2 : Vue Conteneur (L'Application React)
Comment le flux de données circule-t-il dans l'application au niveau du routage et des composants principaux ?

```mermaid
graph TD
    Router[🔀 App.tsx\nReact Router]
    
    subgraph "Routes Principales"
        LP[🏠 LandingPage.tsx]
        AdminPage[⚙️ AdminPanel.tsx]
        DynamicPages[📄 ExPage.tsx / ProjectDetails.tsx]
    end
    
    subgraph "Gestion d'État (Contexts)"
        Crypto[🔐 CryptoContext\nDéchiffrement Bérangère]
    end

    Router -->|/| LP
    Router -->|/admin| AdminPage
    Router -->|/ex| DynamicPages
    
    LP -.-> Crypto
    
    click Router "file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/App.tsx" "Voir App.tsx"
    click LP "file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/Pages/LandingPage.tsx" "Voir LandingPage.tsx"
    
    style Router fill:#0a0a0a,stroke:#3b82f6,color:#fff
    style LP fill:#1e1e1e,stroke:#8b5cf6,color:#fff
    style AdminPage fill:#1e1e1e,stroke:#f59e0b,color:#fff
    style DynamicPages fill:#1e1e1e,stroke:#06b6d4,color:#fff
```

---

## 🔍 Niveau 3 : Exploration Profonde de la Landing Page
La Landing Page est structurée en "Mouvements". Voici la décomposition exacte de ses composants visuels.

```mermaid
graph TD
    Landing[🏠 LandingPage.tsx]

    subgraph "I. L'Émotion (Blanc)"
        Hero[Hero Section\nTexte Animé]
        Manifesto[ManifestoSection.tsx]
        Flux[FluxLabSection.tsx]
    end

    subgraph "II. L'Ingénierie (Pivot Noir)"
        Blueprint[BlueprintTransition.tsx]
        Pure[PureStructure.tsx]
        Foundation[TheFoundation.tsx]
    end

    subgraph "III. Les Instruments"
        Toolset[TheToolset.tsx]
    end

    subgraph "IV. L'Exploration"
        Poetics[CodePoetics.tsx]
        Notes[FieldNotes.tsx]
    end

    Landing --> Hero
    Landing --> Manifesto
    Landing --> Flux
    Landing --> Blueprint
    Landing --> Pure
    Landing --> Foundation
    Landing --> Toolset
    Landing --> Poetics
    Landing --> Notes

    style Landing fill:#000,stroke:#fff,color:#fff
```

---

## 📍 Niveau 4 : Traçabilité MVC (Où est le code ? D'où vient la donnée ?)

Ce tableau vous sert de "GPS" dans le code. Pour chaque morceau visible à l'écran, vous trouverez le composant responsable, la source des données, et les lignes exactes gérant le "Fetch" (récupération) et le "Render" (affichage).

| Section Visuelle | Composant (La "Vue") | Source (Le "Modèle") | Logique Fetch ("Controller") | Ligne de Rendu (JSX) |
| :--- | :--- | :--- | :--- | :--- |
| **Navbar (Menu principal)** | [Navbar.tsx](file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/Components/Navbar.tsx) | *Statique (Hardcodé)* | N/A | Ligne 32 |
| **Bandeau Défilant (News)** | [Newsbar.tsx](file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/Components/Newsbar.tsx) | *State interne (Timer)* | `useEffect` L.11 | Ligne 31 |
| **Texte "Manifeste"** | [ManifestoSection.tsx](file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/Components/ManifestoSection.tsx) | *Constantes `wordsPartX`* | Variables L.53-55 | Ligne 72 |
| **Projets Réseaux (Flux Lab)** | [FluxLabSection.tsx](file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/Components/FluxLabSection.tsx) | 📂 `registry.json` | `fetch()` Ligne 47 | Ligne 116 (`map`) |
| **Bouton "Explorer Fondations"** | [TheFoundation.tsx](file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/Components/TheFoundation.tsx) | *Statique (Pillars array)* | Variables L.13-42 | Ligne 82 (`map`) |
| **Grille des Compétences** | [CompetencesBUT.tsx](file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/Components/CompetencesBUT.tsx) | 📂 `tps.json` & `data.json` | `Promise.all(fetch)` L.116 | Ligne 179 (`map`) |
| **Grille "The Toolset"** | [TheToolset.tsx](file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/Components/TheToolset.tsx) | *Statique (Pillars array)* | Variables L.50-108 | Ligne 111 (`PillarCard`) |
| **Archive "Field Notes"** | [FieldNotes.tsx](file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/src/Components/FieldNotes.tsx) | 📂 `registry.json` | `fetch()` Ligne 45 | Ligne 91 (`map`) |

> [!TIP]
> **Comment utiliser ce tableau ?**
> Cliquez sur les liens des fichiers pour les ouvrir directement dans votre éditeur (VS Code, Cursor, etc.). Allez ensuite à la ligne "Fetch" pour voir comment la donnée est récupérée, et à la ligne "Render" pour voir le code HTML/Tailwind qui la dessine.

---

## 🎨 Philosophie de Design
Le design suit une esthétique **"Apple-Inspired"** :
- Utilisation intensive du **Glassmorphism** (fond flou, bordures translucides).
- Typographies soignées (Paris2024, Baskerville).
- Micro-animations sur chaque interaction utilisateur (Framer Motion).
- Palette de couleurs sombre avec des accents vibrants (Bleu, Rose, Cyan).
