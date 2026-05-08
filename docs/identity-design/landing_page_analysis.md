# Analyse Structurelle et Narrative de la Landing Page - Briac Le Meillat

Ce document détaille l'architecture, le contenu textuel, les animations et les interactions de la landing page actuelle. L'objectif est de fournir une base de connaissances exhaustive pour une refonte narrative suivant le storytelling Apple.

---

## 1. Architecture Globale & Design System

### Identité Visuelle
- **Style Principal** : Minimalisme futuriste, Dark mode prédominant avec accents de Glassmorphisme.
- **Typographies Clés** :
    - `'Paris2024'` : Utilisée pour les titres majeurs, liens de navigation et accents (Majuscules, espacement large).
    - `'NeutrafaceText'` : Utilisée pour le branding "Bérangère" (Élégant, italo-géométrique).
    - `'Baskerville'` : Utilisée pour les citations et textes narratifs (Sérif, élégance classique).
- **Composant de Base : GlassCard** :
    - Fond : Flou de profondeur (`backdrop-filter: blur(12px)`).
    - Bordure : Fine, translucide (`border-skin-card-border`).
    - Ombre : Portée bleutée légère (`shadow-blue-900/10`).

### Structure de la Page (Scroll Séquentiel)
1. **Navigation** (Fixe)
2. **Hero Section** (Immersive, plein écran)
3. **Manifesto Section** (Révélation textuelle au scroll)
4. **Flux Lab Section** (Preuves d'activités techniques)
5. **Exploration Section** (Interaction avec le réseau de neurones)
6. **CV Section** (Parcours et timeline)
7. **Compétences BUT** (Détails académiques profonds)
8. **Certifications** (Validation externe)
9. **Collaborateurs** (Réseau professionnel)
10. **Contact & Footer**

---

## 2. Analyse Détaillée par Module

### A. Barre de Navigation (`Navbar.tsx`)
- **Structure** : Flottante (`top-8`), centrée, 75% de largeur, bords arrondis (pill-shaped).
- **Éléments** :
    - Gauche : Logo "Bérangère" (Italique, lettre 'a' minuscule isolée avant).
    - Centre : Liens (accueil, vision, recherches, cv, contact) en majuscules `'Paris2024'`.
    - Droite : Toggle de thème, Boutons Login/Sign In.
- **Interactions** : 
    - Effets au survol : Légère mise à l'échelle (1.05x), lueur externe blanche/bleue (`drop-shadow`).
    - Toggle Thème : Animation fluide via contexte.

### B. Section Hero (`LandingPage.tsx`)
- **Textes** :
    - "a Bérangère branch"
    - "Bérangère • Development" (Gradient sur Development)
    - Typewriter : "par Briac Le Meillat, étudiant de 1ère année en Réseaux et Télécommunications"
- **Animations au Chargement** :
    - Titres : Apparition séquentielle avec flou progressif (Blur 10px -> 0px) et opacité.
    - Typewriter : Effet de frappe différé.
- **Interaction** :
    - Bouton de scroll (Flèche animée "Bounce") menant au Manifesto.
    - Arrière-plan : Flou dynamique qui s'estompe au scroll.

### C. Le Manifesto (`ManifestoSection.tsx`)
- **Mécanique Narrative** : "Reveal-on-scroll". Les mots changent d'opacité (0.2 -> 1.0) selon la progression du scroll.
- **Contenu** :
    - Principale : "Pour certains, un clavier n'est qu'un outil de saisie. Pour moi, c'est un instrument." (Gradient sur la deuxième phrase).
    - Citation 1 : "Chaque ligne de code est une note, chaque projet une partition." (Typographie Baskerville).
    - Citation 2 : "Explorez les neurones pour découvrir mes domaines d'expérimentation..."
- **Transition** : Ancre visuelle vers le réseau de neurones.

### D. Flux Lab (`FluxLabSection.tsx`)
- **Concept** : "Real-time Activity". Présentation des derniers travaux académiques.
- **Structure** : Grille de cartes 3D-light avec verre dépoli.
- **Données** : Titre du rapport, Module (ex: R1.01), Technologie, Date.
- **Interaction** : 
    - Survol : Ligne d'accent défilante, apparition des tags technos, translation de l'icône flèche.
    - Clic : Ouverture d'un viewer de document plein écran (Expérience immersive sans quitter la page).

### E. Le Réseau de Neurones (`NeuralNetworkBackground.tsx`)
- **Technique** : Canvas interactif avec système de particules.
- **Nodes Majeurs (Domaines)** :
    1. DÉVELOPPEMENT WEB
    2. RÉSEAUX INFORMATIQUES
    3. INTELLIGENCE ARTIFICIELLE
    4. TÉLÉCOMMUNICATIONS
    5. PROGRAMMATION
- **Interaction Utilisateur** :
    - **Le Clic** : Zoom "Caméra" (3x) sur le nœud cliqué. Verrouillage du scroll de la page.
    - **L'Overlay** : Apparition d'une carte massive contenant :
        - Titre et description détaillée du domaine.
        - Listes de projets associés (Récents, Meilleurs, Autres) extraits de `projects.json`.
        - Cartes de projets avec images, tags et liens "Voir le projet".
    - **Fermeture** : Dézoom et retour à l'état fluide.

### F. Section CV (`CVSection.tsx`)
- **Visuel** : Photo de profil avec lueur pulsante (Gradient Bleu/Rose).
- **Timeline (`Timeline.tsx`)** : Système de "DaisyUI" adapté avec icônes de validation (CheckCircle).
- **Interaction** : Navigation temporelle interactive (2026, 2027, 2028). Le clic change le contenu avec une animation de slide et d'opacité.
- **Contenu** : Détails du BUT R&T à l'IUT de Béthune.

### G. Compétences BUT (`CompetencesBUT.tsx`)
- **Structure académique** : Basée sur les 3 piliers du BUT R&T (Administrer, Connecter, Programmer).
- **Architecture de l'information** :
    - Niveau 1 : Cartes de compétences (Icônes Layers, Target, BarChart).
    - Niveau 2 : Modal avec Accordéon détaillant les Apprentissages Critiques (AC). 
    - Niveau 3 : Réflexion structurée (Fait, Pourquoi, Comment, Difficultés, Acquis) et Galerie de preuves liées.

### H. Formulaire de Contact
- **Design** : Carte en verre centrée.
- **Champs** : Nom, Email, Message (Icônes Lucide : User, Mail, MessageSquare).
- **Feedback** : État de succès avec icône `CheckCircle` et mise à l'échelle.

---

## 3. Analyse des Transitions et Micro-interactions

### Framer Motion
- Ample utilisation de `useScroll` et `useTransform` pour lier le design au mouvement de l'utilisateur.
- `AnimatePresence` pour les transitions entre états (ex: Intro Code Animation).
- `whileHover={{ scale: 1.02 }}` et `y: -10` systématiques sur les cartes pour le sentiment de "profondeur".

### Effets Spéciaux
- **Glassmorphisme** : `backdrop-filter: blur(12px)` quasi-omniprésent pour le côté premium.
- **3D Hover** : Présent sur les certifications pour un effet "carte physique" (Cisco Python). Utilise une structure de 8 couches de divs superposées pour simuler la profondeur.
- **Gradients Animés** : Utilisés sur les titres et les boutons pour un effet "High-Tech".

---

## 4. Points d'Amélioration Narratifs (Storytelling Apple)

- **Simplicité du Message** : Certains textes sont très techniques (AC, modules), il faudrait une couche de "bénéfice utilisateur/vision" avant la technique pure.
- **Rythme** : Le passage de la poésie du Manifesto à la rigueur des Compétences BUT est brutal. Une transition narrative plus douce est nécessaire.
- **Imagerie** : Utilisation de placeholders (UI-Avatars) et manque de visuels produits haute-fidélité pour les projets.
- **Interactions de transition** : Le passage d'une section à l'autre pourrait être plus fluide (transitions de section "Seamless" au scroll).
