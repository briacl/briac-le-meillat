# Prompt optimisé — Voyage de la Sérénité

## Rôle

Expert Senior en Frontend (React, Three.js/R3F, Framer Motion).

## Objectif

Implémenter la séquence cinématique "Voyage de la Sérénité" pour `UnifiedHeryzeTransition.tsx`.

## 1. Structure de fer (interdiction de bouger)

- **Parent Track**
  - `relative w-full h-[800vh] bg-black`
  - C'est le moteur de la timeline.
- **Sticky Viewport**
  - Enfant direct du Parent Track
  - `sticky top-0 w-full h-screen overflow-hidden`

> ⚠️ Pour que le sticky fonctionne, aucun parent (dans `LandingPage.tsx` ou les layouts) ne doit avoir `overflow-x: hidden` ni `display: flex`. Si besoin, force `style={{ overflow: 'visible' }}` sur le Parent Track.

## 2. Constantes & assets

- **Courbe Apple**
  - `APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98]`
- **Fonts**
  - `Paris2024` : titres et éléments techniques
  - `Baskerville` : narration
- **Image Heryze**
  - `/assets/heryze_dashboard.png`
  - Interface blanche avec bords arrondis `rounded-[2.5rem]`

## 3. Timeline du voyage

Mapping de `scrollYProgress` de `0` à `1`.

### A. La Vitrine (0.00 → 0.10)

- Titre : `HERYZE`
  - Font : `Paris2024`
  - Uppercase
  - Blanc
  - Style monumental
- Sous-titre :
  - "Le réseau tombe. Votre business, jamais."
  - Style normal
  - Gradient bleu-violet proche du traitement "Development" du Hero
- Image Heryze centrée avec `scale: 1`

### B. Le White-Out (0.10 → 0.25)

- Zoom caméra massif sur l'interface blanche
- À `0.25`, le fond devient blanc pur `#ffffff`
- Le blanc occulte le reste de la scène

### C. L'Émanation (0.25 → 0.45)

- `0.25 → 0.35`
  - Une icône de téléphone (Lucide ou SVG) apparaît en `fade-in` sur le fond blanc
- `0.35 → 0.45`
  - Animation de lumière multicolore pulsante autour de l'icône

### D. La Douchette (0.45 → 0.65)

- Le téléphone réduit en taille
- Texte : "Votre smartphone, votre meilleure douchette."
  - Police : `Paris2024`
  - Couleur : blanc
  - Effet Z-axis : le texte arrive de derrière la caméra
  - Scale : `4 → 1`

### E. La Révélation Sérénité (0.65 → 0.85)

- Dézoom monumental
  - La scène précédente (téléphone + texte) se rétrécit pour entrer DANS le mot `sérénité`
- Morphing de couleur
  - Texte `sérénité` initialement blanc et énorme
  - Puis réduit en taille et passe au gradient bleu-violet
- Fond
  - Le blanc s'estompe pour révéler le noir du Neural Network

### F. Handoff Neural Network (0.85 → 1.00)

- Le mot `sérénité` devient minuscule puis disparaît
- Texte "Développement Web" jaillit du fond
  - Scale : `0.1 → 1`
- Apparition de particules (nœuds) et de liens autour du texte
- Texte secondaire : "explorez les noeuds..."
  - `fade-in/out`
- Affichage final : card projet Web

## 4. Code requis

- Utiliser `useScroll` et `useSpring` pour lisser l'expérience
- Utiliser `useTransform` pour chaque transition de `scale`, `opacity`, `color`
- Implémenter la scène Three.js avec :
  - un `PlaneGeometry` pour le mockup
  - un `Canvas` interactif pour le Neural Network final
- Générer du code robuste et modulaire
- Ne pas superposer de textes au début de l'animation
