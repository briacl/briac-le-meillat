# Architecture de la Page `/test` — Bérangère • Development
> Document de référence complet — État au 22 avril 2026

---

## 1. Contexte & Storytelling Global

La page `/test` est la **landing page narrative principale** du portfolio de Briac Le Meillat. Elle raconte un voyage en deux actes :

**Acte I — Le Monde de la Lumière (fond blanc)**
Le visiteur entre dans un espace épuré, presque apple-like. Il est accueilli par une typographie sobre, un manifeste scrollé-révélé mot à mot, puis basculé dans un portal conceptuel (Blueprint).

**Acte II — L'Univers Nexus (fond noir)**
Le visiteur pénètre dans l'écosystème professionnel de Bérangère Development. L'esthétique devient dark, premium, glassmorphique. On lui présente la philosophie de l'entreprise, ses architectures logicielles (Synapseo, Heryze), ses méthodes de travail et ses réalisations.

Le storytelling suit la logique Apple : **émerveillement → confiance → désir → action.**

---

## 2. Structure Globale de la Page (ordre de rendu)

```
[FIXED] Navbar
[FIXED] Newsbar (mix-blend-difference)
<main>
  § 1. Hero Section (bg-white)
  § 2. Manifesto Section (bg-white)
  § 3. Blueprint Transition (bg-white → pivot)
  § 4. Pure Structure (bg-[#0d0d0d])
  § 5. Architectures Nexus / NexusCollection (bg-black)
  § 6. Code Poetics (bg-[#0d0d0d])
  § 7. Logic as Canvas (bg-[#0d0d0d])
  § 8. Final CTA (bg-black)
  § 9. UnifiedFooter (bg-black)
  [spacer 20vh bg-black]
</main>
```

> **Note :** TheFoundation, FieldNotes et FluxLabSection sont des composants existants **non encore montés** dans LandingPageTest.tsx. Ils sont à intégrer.

---

## 3. Couche de Navigation (Éléments Fixes)

### 3.1 `Navbar` — `fixed top-6`, `z-[100]`

**Style :** Floating pill, `w-[92%] md:w-[90%] h-16`, `bg-white/70 backdrop-blur-md`, `rounded-full`, `border border-blue-500/10`, `shadow-[0_8px_32px_rgba(0,0,0,0.05)]`.

**Contenu :**
- **Gauche — Logo texte :**
  - *Bérangère* en NeutrafaceText italic, poids 300
  - `•` séparateur `text-black/30`
  - *Development* en `font-['Paris2024']` uppercase, gradient `from-[#0075FF] to-[#f336f0]`
- **Centre (desktop) — Liens :** Heryze / Synapseo / Studies / Contact → tous `/test` pour l'instant. `text-[13px] font-semibold text-gray-500`, hover `text-gray-900`.
- **Droite :** Bouton "Démarrer" → `/contact`, `text-[#0071e3] font-bold`. Sur mobile : hamburger animé (2 barres Framer Motion rotate ±45°).
- **Menu mobile :** Overlay `motion.div` (fade+scale), fond `bg-white/95 backdrop-blur-xl rounded-[2rem]`, liens : Harmony / Curriculum / Lab / Contact.

### 3.2 `Newsbar` — `fixed top-28`, `z-[50]`, `mix-blend-difference`

**Rôle :** Bandeau d'identité narratif. Texte blanc sur `mix-blend-difference` → s'inverse selon le fond sous-jacent.

**Animation en 2 phases (Framer Motion `AnimatePresence`) :**
- **Phase 1 (0→2.5s) :** *"a Bérangère branch"* — NeutrafaceText italic
- **Phase 2 (permanent) :** *"par Briac Le Meillat, étudiant en 1ère année de Réseaux et Télécommunications"* — Paris2024
- Transition : `blur(10px)` → `blur(0px)`, opacity 0→1, `ease: [0.22, 1, 0.36, 1]`

---

## 4. § 1 — Hero Section

**Background :** `bg-white`, `min-h-screen`.

**Contenu :**
- `h1` : **"Build Harmony."** — `font-['Baskerville']`, `clamp(3rem, 10vw, 8rem)`, `font-weight: 400`, `letter-spacing: -0.02em`
- Animation d'entrée : `opacity: 0 → 1`, `y: 20 → 0`, durée 1.2s, easeOut
- Scroll parallax : `heroOpacity` `[0→300px scroll]=[1→0]`, `heroBlur` `blur(0→10px)`

**CTA de scroll :**
- Bouton rond `60x60px`, `rounded-full`, `border-gray-100`, fond blanc, icône chevron SVG `fill-blue-500`
- Bounce animation CSS
- onClick → `scrollIntoView({ behavior: 'smooth' })` vers `#manifesto-section`

---

## 5. § 2 — Manifesto Section (`ManifestoSection`)

**Background :** `bg-white`, `min-h-[100vh]`.

### Header
- Eyebrow : **"Manifeste"** — `font-['Paris2024']`, `tracking-[0.4em]`, `text-[#0075FF]/70`, `text-xs`
- Ligne décorative : `w-12 h-[1px] bg-gradient-to-r from-blue-500 to-transparent`

### Texte Animé Mot à Mot
Deux phrases découpées en mots, chaque mot est un composant `<Word>` :

- **Phrase 1 (noir) :** *"Pour certains, un clavier n'est qu'un outil de saisie."*
- **Phrase 2 (gradient) :** *"Pour moi, c'est un instrument."*

**Mécanique :** `useScroll` avec `offset: ["start 95%", "start 20%"]` sur le conteneur. Chaque mot a une plage `[start, end]` dans le progress. Opacity `0.1 → 1` via `useTransform`. Les mots de la phrase 2 sont en gradient `#0075FF → #f336f0` via `background-clip: text`.

### Citation Italique
> *"Chaque ligne de code est une note, chaque projet une partition."*
- `font-['Baskerville'] italic`, `text-2xl → text-4xl`, `text-gray-400`
- Apparition : `whileInView`, delay 0.5s, durée 1.2s

### CTA Scroll
- `motion.a` bouncing, `60x60px rounded-full`, chevron SVG bleu
- Scroll vers `#blueprint-transition`

---

## 6. § 3 — Blueprint Transition (`BlueprintTransition`)

**Background :** `bg-white`, `min-h-screen`. **Pivot visuel** entre monde blanc et monde noir.

**Déclencheur :** `useInView` avec `margin: "-20% 0px -20% 0px"`.

**Contenu :**
- Titre **"Blueprint."** : `text-[12rem]`, `font-['Paris2024']`, gradient `from-[#00D2FF] to-[#3a7bd5]`, `bg-clip-text`
- Animation : `opacity+scale(0.8→1)+blur(20px→0)` à l'entrée, inverse à la sortie, durée 1.5s, ease Apple `[0.21, 0.47, 0.32, 0.98]`
- Sous-titre : **"Architecture & Conception"** — `font-baskerville uppercase tracking-[0.5em] text-xs`, opacity 0.4, delay 0.8s

**Grille technique de fond :**
- `opacity-[0.42]`, grilles croisées via `backgroundImage` CSS :
  - Lignes majeures : `rgba(0,210,255,0.2)` 2px, grille 100px
  - Lignes mineures : `rgba(0,210,255,0.1)` 1px, grille 20px

---

## 7. § 4 — Pure Structure (`PureStructure`)

**Background :** `bg-[#0d0d0d]`, `min-h-screen`. **Premier écran du monde Nexus.**

**Contenu :**
- `h2` : **"Pure Structure."** — `font-['Paris2024']`, `text-7xl`, `text-white`, `tracking-tighter`
- Paragraph bitonique :
  - Blanc : *"L'invisible au service de l'invincible."*
  - Zinc-400 : *"Nous bâtissons des architectures capables d'absorber la charge sans jamais fléchir. Parce qu'un beau design sans une structure robuste n'est qu'une façade."*
- Animation : `whileInView`, `y: 30→0`, `opacity: 0→1`, durée 1s

---

## 8. § 5 — Architectures Nexus (`NexusCollection`)

**Background :** `bg-black`, `py-40 md:py-64`.

### Header
- `h2` : **"Architectures Nexus."** — `font-['Paris2024']`, `text-6xl→7xl`, `text-white`
- Sous-titre bitonique : "Bérangère Development" (blanc) + texte de collaboration (zinc-400)

### Dual Card Grid
Deux cartes côte à côte (`grid-cols-1 md:grid-cols-2 gap-16→24`, `max-w-5xl`).

#### Carte SYNAPSEO (gauche — Cyan)
- **Icône :** `Activity` (Lucide), `size=40`, `strokeWidth=1.5`, couleur `#00D2FF`
- **Titre gradient :** blanc → `#00D2FF`
- **Sous-titre :** *"La coordination médicale réinventée, le secret professionnel sanctuarisé."*
- **Aura :** `radial-gradient cyan(22%)`, `blur(35px)`
- **Beam color :** `#00D2FF`
- **Specs (gradient) :**
  1. Chiffrement Zero Access
  2. Sanctuaire HDS
  3. Ergonomie Mobile-First
  4. Écosystème Interopérable

#### Carte HERYZE (droite — Violet)
- **Icône :** `Banknote` (Lucide), `size=40`, `strokeWidth=1.5`, couleur `#8E54FF`
- **Titre gradient :** blanc → `#8E54FF`
- **Sous-titre :** *"La caisse qui s'affranchit du réseau pour ne garder que l'essentiel : votre vente."*
- **Aura :** `radial-gradient violet(22%)`, `blur(35px)`
- **Beam color :** `#8E54FF`
- **Specs (gradient) :**
  1. Résilience Offline-First
  2. La Douchette Magique (WebRTC)
  3. Zéro matériel propriétaire
  4. Sérénité Administrative (Z-Caisse / FEC)

### Style des Cartes
- `w-320px h-320px rounded-[3rem] bg-zinc-950`
- `border border-white/10` (hover → `white/18`)
- `box-shadow: inset 0 1px 1px rgba(255,255,255,0.1)`
- Gradient interne 45° : `rgba(255,255,255,0.04) → transparent`
- Réflexion haut-gauche : `linear-gradient(135deg, rgba(255,255,255,0.06) → transparent 45%)`

### Animations
- **Apparition :** `opacity: 0→1`, `y: 40→0`, Framer Motion `useInView`, delay `index * 0.15s`
- **Activation automatique (1.5s après apparition) :** `useEffect + setTimeout(1500ms)` → état `isActive`
  - Aura passe de `opacity 0.7 → 1.0` (1.2s)
  - Bordure s'éclaircit `white/8 → white/18` (0.8s)
  - Icône : `scale 1→1.12` + `drop-shadow intensifié` (1.0s)
  - Border Beam : 4 spans animés séquentiellement (top→right→bottom→left), durée 2.4s, repeat infini

### Footer CTA
- Lien "Explorer la collection →" → `/nexus-prop`, `text-[#0066cc]`

---

## 9. § 6 — Code Poetics (`CodePoetics`)

**Background :** `bg-[#0d0d0d]`, `min-h-screen`, layout 2 colonnes.

**Gauche :**
- `h2` : **"Code Poetics."** — gradient `from-[#0075FF] via-white to-[#0075FF]`, `text-7xl`
- Texte bitonique : *"Écrire pour l'utilisateur, composer pour la machine."* (blanc) + description zinc-400

**Droite :**
- `SoundWave` : 40 barres verticales `w-1.5`, gradient `from-blue-600 to-cyan-400`, `scaleY` animé via `useTransform(scrollYProgress)` → onde sinusoïdale basée sur la position i.

---

## 10. § 7 — Logic as Canvas (`LogicAsCanvas`)

**Background :** `bg-[#0d0d0d]`, `min-h-screen`, layout 2 colonnes inversées.

**Gauche (image) :**
- Screenshot `synapseo_dashboard.png` — `rounded-3xl border border-white/10`
- Halo bleu flou en arrière-plan `bg-blue-500/5 blur-3xl`

**Droite (texte) :**
- `h2` : **"Logic as Canvas."** — gradient `from-white via-[#f336f0] to-[#0075FF]`, `text-7xl`
- Texte : *"Où la donnée devient émotion."* (blanc) + description zinc-400

---

## 11. § 8 — Final CTA (`FinalCTA`)

**Background :** `bg-black`, `min-h-screen`, centré.

**Contenu :**
- `h2` : **"Prêt à composer ?"** — `font-['Paris2024'] uppercase tracking-widest text-white`
- Bouton : `rounded-full`, `border border-blue-600`, `text-blue-600`, hover `bg-blue-600 text-white`
- Halo animé autour du bouton : `bg-blue-500/40 blur-md`, `opacity 20% → 100%` au hover
- Grille décorative en arrière-plan : gradient `from-[#0075FF] to-[#f336f0]` + masques CSS (grille 200px + 40px)

---

## 12. § 9 — UnifiedFooter

**Background :** `bg-black`, `border-t border-white/5`, `py-16`.

**Structure :**
- **Bloc signature centré :** "Bérangère • Development" en `text-zinc-400`
- **Grille 3 colonnes** (2 cols mobile) :
  - *Écosystème* : Nexus / Synapseo / Heryze / Store
  - *Entreprise* : Support / Blog
  - *Légal* : Confidentialité / Conditions
- **Barre de copyright :** `border-t border-white/5` — "© 2026 Bérangère • Development - All Rights Reserved" — `tracking-[0.3em] text-zinc-600`

---

## 13. Composants à Intégrer (non encore montés dans /test)

### 13.1 `NeuralNetworkBackground`

Composant Canvas interactif — fond animé représentant le réseau de compétences.

**Architecture technique :**
- Canvas HTML `absolute top-0 left-0 w-full h-full z-[0]`
- Système de caméra avec zoom et lerp (`factor 0.1`)
- 3 types de particules :
  - **Major** (×5) : nœuds de compétence principaux, `size 6-8px`, `font-['Paris2024'] 28px`, gradient bleu→rose sur leur label, vitesse ×0.2
  - **Minor** (×16) : technologies satellites, `size 3.5-5px`, `font 14px`, gravitation douce vers leur Major parent (`attraction dist 100-300px`)
  - **Background** (×40) : particules décoratives, `size 1-3px`, sans label

**5 nœuds Major — Minor satellites & Projets affichés (`projects.json`) :**

> La logique de filtrage (`DOMAIN_MAP`) dans le composant fait correspondre chaque label de nœud à un ou plusieurs domaines du fichier `projects.json`.

#### 🔵 DÉVELOPPEMENT WEB
*Domaines filtrés : `"DÉVELOPPEMENT WEB"`, `"DÉVELOPPEMENT"`*
*Minor satellites : React, TypeScript, Node.js, Tailwind*

| Titre | Statut | Stack |
|---|---|---|
| **Site Mesvoyages** | ⭐ Best | Symfony, Frontend, Backend |
| Site personnel de Briac | Autre | Frontend, TailwindCSS |
| Le Faux Instagram | Autre | MySQL, Frontend, Backend |
| QEL : Questionnaire en ligne | Autre | MySQL, Frontend, Backend |
| Weackers | Autre | HTML/CSS, PHP |

#### 🟠 RÉSEAUX INFORMATIQUES
*Domaines filtrés : `"RÉSEAU"`, `"ADMINISTRATION RÉSEAU"`, `"ADMINISTRATION"`*
*Minor satellites : Cisco, TCP/IP, VLAN, Cybersécurité*

| Titre | Statut | Stack |
|---|---|---|
| **visualisation de réseau** | ⭐ Best + 🆕 Récent | Python |
| Mise en place d'un DHCP et DNS pour le LAN Homelab | Autre | LAN, DHCP, DNS |
| Réalisation LAN Homelab | Autre | Linux, LAN, VLAN, IPv4, SSH |
| Cartographie basique LAN & VLAN | Autre | Linux, LAN, VLAN, IPv4 |
| Analyse de trame via Wireshark | Autre | Réseau, Linux |
| Installation Linux | Autre | Linux |
| Installation Windows | Autre | Windows |

#### 🟣 INTELLIGENCE ARTIFICIELLE
*Domaines filtrés : `"INTELLIGENCE ARTIFICIELLE"`*
*Minor satellites : Python, PyTorch, Machine Learning, Data Science*

| Titre | Statut | Stack |
|---|---|---|
| machine-learning | 🆕 Récent | Machine Learning |

#### 🩵 TÉLÉCOMMUNICATIONS
*Domaines filtrés : `"TÉLÉCOMMUNICATION"`, `"TÉLÉCOMMUNICATIONS"`*
*Minor satellites : 5G/4G, Signal Processing, VoIP, Optical Fiber*

| Titre | Statut | Stack |
|---|---|---|
| sae103 - découverte d'un dispositif de transmission | 🆕 Récent | LTSpice, MATLAB |

#### 🟢 PROGRAMMATION
*Domaines filtrés : `"PROGRAMMATION"`*
*Minor satellites : (aucun défini)*

| Titre | Statut | Stack |
|---|---|---|
| sae15-traitement-de-donnees | 🆕 Récent | Python |
| **own-cli-template** | ⭐ Best + 🆕 Récent | Python |
| **readme-generator** | ⭐ Best + 🆕 Récent | Python |
| scraper-cinema | 🆕 Récent | Python |
| **willkommen_v2** | ⭐ Best | Python |
| crypto | Autre | Python |
| willkommen_v1 | Autre | Python |
| two-years-leaning-python | Autre | Python |

**Connexions :**
- Minor→Major (même targetId) : ligne `rgba(0/255, 0/255, 0/255, 0.6)`, `lineWidth 1.5`, portée 300px
- Proximité générale : ligne `opacity 0.2`, `lineWidth 0.5`, portée 150px

**Interaction clic :**
- Hit radius : 30px autour du label
- Au clic : `targetZoom = 3` (lerp smooth), tracking caméra vers la particule
- Overlay card : `bg-black/5 backdrop-blur-md rounded-3xl`, `max-w-6xl w-[95vw] h-[85vh]`
  - Header : nom du nœud en gradient + description
  - Corps scrollable : grille de projets issus de `projects.json` filtrés par domaine
  - Sections : "Mes récents projets" / "Mes meilleurs projets" / "Autres Réalisations"
  - Chaque projet : `h-40 overflow-hidden`, hover overlay avec description + lien
- Clic en dehors : reset zoom `targetZoom = 1`, centre caméra
- Lock body scroll quand un nœud est sélectionné

---

### 13.2 `TheFoundation` — Compétences (L'Évidence par Design)

**Background :** `bg-black`, `border-t border-white/5`, `py-32`.

**Header :**
- Eyebrow : **"The Foundation"** — `font-['Paris2024'] uppercase tracking-[0.6em] text-blue-500`
- Titre : **"L'Évidence par Design"** — `text-6xl`, avec "Design" en `opacity-40`

**Niveau 1 — 3 Piliers (grid 1→3 cols) :**

| Pilier | Tagline | Icône | Couleur |
|--------|---------|-------|---------|
| **Administrer** | L'Architecture Invisible | `Layers` (Lucide, strokeWidth 1) | `#0075FF` |
| **Connecter** | Le Dialogue Universel | `Target` (Lucide, strokeWidth 1) | `#f336f0` |
| **Programmer** | L'Art de l'Interaction | `Code` (Lucide, strokeWidth 1) | `#00ccff` |

Style de chaque pilier : `p-10 rounded-[2.5rem] bg-zinc-900/20 border border-white/5`, hover `border-white/10`. Icône `text-white/40 → text-white` au hover. Tagline `text-white/30 → text-blue-500` au hover.

**Niveau 2 — Bouton [ + / − ] :**
- Label : *"Explorer les Fondations Académiques"* / *"Replier L'Architecture"*
- `w-16 h-16 rounded-full border border-white/10`
- Active : `bg-white text-black`, icône `Minus`
- Inactive : `bg-transparent text-white`, icône `Plus`

**Contenu dépliable (`AnimatePresence`) :**
- `height: 0 → auto`, `opacity: 0→1`, `blur: 10px→0`, durée 1s
- Monte `<CompetencesBUT />` : la grille des AC (Apprentissages Critiques) de la formation BUT R&T

---

### 13.3 `FieldNotes` — Archive de Laboratoire

**Background :** `bg-black`, `border-t border-white/5`, `py-32`.

**Header :**
- Eyebrow : `// S01.R&T` — `font-mono text-blue-500 tracking-[0.5em]`, précédé d'un trait `h-px w-16 bg-blue-500/50`
- Titre : **"Field Notes"** — `font-['Paris2024'] text-6xl uppercase`, "Notes" en `opacity-40`
- Sous-titre : *"Exploration technique et rendus critiques indexés en temps réel."* — `font-['Baskerville'] italic text-white/40`

**Source de données :** `fetch('/assets/data/registry.json')` — liste de `Proof` avec `{title, module, competence, ac_lies, techs, date, status, path}`.

**Archive Grid (4 derniers éléments) :**
Lignes horizontales empilées (`grid-cols-1 gap-2`), première et dernière arrondies (`rounded-t-[2.5rem] / rounded-b-[2.5rem]`).

Par ligne :
- **Module_Ref** : code module en `font-mono text-white/70`, hover `text-blue-400`
- **Titre + Tags tech** : `font-['Paris2024'] text-2xl`, badges `font-mono text-[9px] border border-white/10`
- **Index_Time** : date formatée `font-mono text-white/40`
- **Bouton →** : rond `40x40px border border-white/10`, hover `bg-blue-500`

Animation : `x: -10→0`, opacity fade, delay `index × 0.1s`.

**CTA :** Bouton "Accéder au Registre Complet" — ligne qui s'étend `w-12→w-24` au hover, couleur `bg-white/10 → bg-blue-500`.

**Modal détail :** HeroUI `Modal size="full" backdrop="blur"`, fond `bg-black/95`, bouton fermeture `X`. Contenu : `<ExPage embedded file={proof.path} />` dans une `motion.div` avec blur d'entrée.

---

### 13.4 `FluxLabSection` — Journal Temps Réel

**Variante "light" de FieldNotes** — même source `registry.json`, même logique, design différent.

**Background :** Transparent (blanc supposé), avec 2 halos décoratifs `blur-[120px]` (bleu + violet).

**Header :**
- Badge `Zap` icône + label "Real-time Activity" en bleu
- Titre : **"Flux Lab"** — `font-['Paris2024'] text-6xl`, "Lab" en `text-[#0075FF]`
- Sous-titre : `font-['Baskerville'] italic text-zinc-500`

**Grille de cartes (4 éléments, `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) :**
HeroUI `Card isPressable`, `h-[280px]`, `bg-white/40 backdrop-blur-md border border-white/40 rounded-[2.5rem]`.

Par carte :
- Accent line top : gradient `blue→purple` 1px, `opacity 20% → 100%` au hover
- Badge module + date
- Titre `text-xl font-bold`, hover `text-blue-600`
- Tags tech (3 max + "+N"), visibles uniquement au hover (translate-y-2→0, opacity 0→1)
- "Voir le rapport →" + chevron

**Modal :** Même système HeroUI, design `bg-white rounded-[3rem] shadow-xl` avec bouton "Terminer la lecture".

---

## 14. Dépendances Techniques Clés

| Lib | Usage |
|-----|-------|
| Framer Motion | Animations scroll, hover, apparition, AnimatePresence |
| Lucide React | Icônes (Activity, Banknote, Layers, Target, Code, ChevronRight...) |
| React Router DOM | Navigation, Link |
| HeroUI (`@heroui/react`) | Modal, Card, Button (FieldNotes, FluxLabSection) |
| Vite / BASE_URL | Résolution des assets images et JSON |

**Polices :**
- `Paris2024` — Titres, labels, branding (custom)
- `Baskerville` — Citations, italiques narratifs
- `NeutrafaceText` — Logo Bérangère (italic, poids 300)
- `NeutrafaceTextDemiSC` — Logo Bérangère (Demi)
- `Montserrat Alternates` — Labels minor nodes

---

## 15. Points Ouverts / À Finaliser

| # | Élément | Statut | Action suggérée |
|---|---------|--------|-----------------|
| 1 | `NeuralNetworkBackground` | Non monté dans `/test` | Intégrer dans le Hero ou section dédiée |
| 2 | `TheFoundation` | Non monté | À placer après LogicAsCanvas ou avant FinalCTA |
| 3 | `FieldNotes` | Non monté | À placer dans le monde dark, après TheFoundation |
| 4 | `FluxLabSection` | Non monté | Version light à placer dans la zone blanche (§2-3) ou dark |
| 5 | `CompetencesBUT` | Dépendance TheFoundation | Vérifier le contenu du composant |
| 6 | Nav links | Tous → `/test` | À câbler sur les vraies routes |
| 7 | Specs Synapseo/Heryze | Longs, card 320px | Revoir la lisibilité des specs dans les cartes |

---

*Généré à partir de l'analyse complète du code source — 22 avril 2026*
