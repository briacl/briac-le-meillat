# Structure actuelle de la Landing Page
> Fichier de référence pour travail de restructuration storytelling

---

## Contexte général

Portfolio de **Briac Le Meillat**, étudiant en BUT Réseaux & Télécommunications, 1ère année.  
Profil : dev web, réseaux, IA.  
Fond noir sur la majorité de la page, hero blanc.  
Typo principale : `Paris2024` (display), `Baskerville` (serif/italique).

---

## Structure en 4 Mouvements (telle que codée)

### MOUVEMENT I — L'ÉMOTION (fond blanc)

**1. Hero**
- Fond : blanc
- Headline : `"Build Harmony."` (font Baskerville, ~8rem, noir)
- Sous-contenu : flèche de scroll vers Manifesto
- Effet : fade + blur au scroll

**2. ManifestoSection**
- Eyebrow : `"Manifeste"` (bleu clair, uppercase, letterspaced)
- Headline animée mot par mot : `"Pour certains, un clavier n'est qu'un outil de saisie. Pour moi, c'est un instrument."`
- Sous-texte italique Baskerville : `"Chaque ligne de code est une note, chaque projet une partition."`
- Flèche vers FluxLab

**3. FluxLabSection** (`isLight={true}`)
- Section de travaux / documents (données dynamiques depuis `registry.json` + `tps.json`)
- Liste de "preuves" (documents, TPs, travaux) filtrables
- Composant générique avec variante claire

---

### MOUVEMENT II — LA RÉVÉLATION (pivot blanc → noir)

**4. BlueprintTransition**
- Texte affiché : `"Blueprint."`
- Transition visuelle white-to-dark, effet de pivot

**5. PureStructure** ⚠️ *COMMENTÉ — à repositionner*
- Fond : `#0d0d0d`
- Headline : `"Pure Structure."`
- Copy : `"L'invisible au service de l'invincible."` + `"Je bâtis des architectures capables d'absorber la charge sans jamais fléchir. Parce qu'un beau design sans une structure robuste n'est qu'une façade."`

**6. TheFoundation**
- Section académique, 3 domaines :
  - `"L'Architecture Invisible"` (réseaux/infra)
  - `"L'Art de l'Interaction"` (web/UX)
  - `"La Garde Numérique"` (sécurité/systèmes)
- CTA : `"Explorer les Fondations Académiques"` → lien vers section toolset

---

### MOUVEMENT III — THE TOOLSET (fond noir)

**7. TheToolset**
- 3 piliers de projets personnels :
  - **Pilier I** — `"Automation & Workflow"` (willkommen_v2, readme-generator, own-cli-template)
  - **Pilier II** — `"Intelligence & Data"`
  - **Pilier III** — `"Shared Infrastructure"`
- Cards avec shimmer animé (cyan, violet, magenta)

---

### MOUVEMENT IV — L'EXPLORATION (fond noir)

**8. Showcases projets** — 3 sections plein écran alternées (texte ↔ code cards)

| # | Nom | Accroche | Stack | Badge |
|---|-----|----------|-------|-------|
| 1 | `willkommen_v2` | *"Un projet, une commande."* Génère le squelette d'un projet en 30s via CLI guidée | Python, Rich, Questionary, CLI | Perso |
| 2 | `visualisation réseau` | *"L'encapsulation, rendue visible."* Sim. paquets Ethernet/IP/ICMP + visualiseur HTML | Python, HTML/CSS, Gemini Pro, Scapy | IUT + Perso |
| 3 | `lyrae-shared` | *"La mémoire externe de tous les projets."* Dépôt centralisé règles/patterns/prompts IA, partagé via CLI + VSCode | Node.js, VSCode API, Markdown, JSON | Perso |

Chaque showcase : terminal animé + bloc de code à droite ou gauche (alternés), inclinaison 3D (rotateY ±14°), texte qui se translate vers les cards.

**9. CodePoetics**
- Titre : `"Code Poetics."`
- Copy : `"Je n'agence pas seulement des lignes, je compose. Comme un instrument parfaitement accordé, l'interface réagit à l'instinct, sans friction, avec une justesse mathématique."`
- Effet : SoundWave animée au scroll

**10. LogicAsCanvas**
- Copy : `"Où la donnée devient émotion."`
- Effet : grille de cellules animées au scroll

**11. TheCoreHeader**
- Titre : `"The Ecosystem."`
- Sous-titre : `"La vue macro de la galaxie de micro-outils et de recherches."`
- Micro-copy : `"↓ cliquez sur un nœud pour explorer"`

**12. NeuralNetworkBackground**
- Visualisation plein écran (réseau de neurones interactif)
- `opacity-60`

**13. FieldNotes**
- Archive finale des travaux (même data que FluxLab)
- Composant liste avec pagination

**14. FinalCTA**
- Titre : `"Prêt à composer ?"`
- Bouton : `"Lancer un projet"`
- Fond : grille blueprint

**15. UnifiedFooter**

---

## Comment les projets sont présentés et accessibles

### Types de contenu "projets"

Il existe **3 types distincts** de contenu projet, avec des sources et des comportements d'ouverture différents :

| Type | Source | Identification | Comportement au clic |
|------|--------|---------------|----------------------|
| **Projets perso** | `projects.json` | `origin: ["perso"]` | Modale inline (titre, description, stack, lien GitHub) |
| **Travaux IUT** | `projects.json` | `origin: ["iut"]` | Ouvre le document Markdown dans une modale via `ExPage` |
| **TPs / PDFs académiques** | `tps.json` | `isPDF: true` | Ouvre le document Markdown ou PDF dans une modale via `ExPage` |

### Sources de données

- **`/data/projects.json`** — projets perso et SAE IUT, champs : `title`, `description`, `languages`, `link` (GitHub), `domain`, `origin[]`, `isBest`, `isRecent`, `id`
- **`/data/registry.json`** — documents markdown indexés (TPs, comptes-rendus), champs : `proofs[]`
- **`/data/tps.json`** — TPs académiques supplémentaires, champs : `titre`, `ressource`, `date`, `fichier` (chemin fichier)

Les deux derniers sont mergés et triés par date décroissante au chargement.

### Chemins d'accès aux projets depuis la landing

```
Landing Page
├── [Navbar] → ancres internes :
│   ├── #manifesto-section
│   ├── #the-toolset      → TheToolset (3 piliers, cards shimmer)
│   ├── #the-ecosystem    → Showcases + FieldNotes
│   ├── #field-notes      → FieldNotes (liste paginée)
│   └── /contact          → page contact (route React)
│
├── [Section 3 — FluxLab] → 4 derniers travaux en aperçu
│   ├── Clic projet perso → modale "fiche projet" (description + GitHub)
│   └── Clic IUT/TP/PDF  → modale ExPage (rendu Markdown in-app)
│
├── [Section 7 — TheToolset] → 3 piliers, cards cliquables
│   └── (navigation vers les showcases ou GitHub externe)
│
├── [Sections 8 — Showcases] → 3 projets mis en avant (cards code + terminal)
│   └── Lien GitHub externe (icône GitHub en bas du textSlot)
│
└── [Section 13 — FieldNotes] → liste complète paginée (+5 par clic)
    ├── Clic projet perso → modale fiche projet
    └── Clic IUT/TP/PDF  → modale ExPage (rendu Markdown in-app)
```

### Pages dédiées (hors landing)

| Route | Contenu |
|-------|---------|
| `/blog` | Moteur de recherche IA sur tous les documents + liste complète |
| `/ex?file=...` | Lecteur de document Markdown standalone (ExPage en plein écran) |
| `/cv` | CV page |
| `/devop` | Page DevOps |
| `/recherches` | Page recherches |
| `/recherches/optimisation-neurones` | Article recherche spécifique |
| `/projects-visualisation` | Visualisation graphique des projets |

### Comportement d'ExPage (le lecteur de documents)

- Supporte **Markdown** (rendu complet avec métadonnées frontmatter) et **PDF**
- Utilisable en mode **embedded** (dans une modale) ou **standalone** (pleine page via `/ex?file=`)
- Bouton de téléchargement PDF intégré
- Le fichier est fetchté depuis `BASE_URL + path` au runtime

### Navbar (liens permanents)

La navbar est fixe (`z-100`) et contient uniquement des ancres vers des sections de la landing + lien `/contact`. Pas de lien direct vers `/blog` depuis la navbar.

---

## Problèmes identifiés (à travailler)

- Le passage **Manifesto → FluxLab → Blueprint → Foundation** est décousu : on passe du poétique à une liste de docs, puis à un pivot, puis au fond académique — la progression narrative n'est pas fluide
- **PureStructure** est une section standalone générique qui n'apporte pas de valeur narrative claire, elle a été commentée
- **FluxLab** (liste de travaux) apparaît très tôt (section 3) avant qu'on sache vraiment qui est Briac — peut-être à déplacer plus tard
- **CodePoetics** et **LogicAsCanvas** sont deux sections quasi-vides (animations + copy minimale) qui n'apportent pas grand chose après les 3 showcases
- **TheCoreHeader → NeuralNetwork** est la seule vraie montée en puissance visuelle, mais elle arrive après trop de sections
- Le **double** emploi de la liste de travaux (FluxLab tôt + FieldNotes tard) crée une redondance
- La promesse du hero `"Build Harmony."` n'est jamais résolue explicitement dans le parcours

---

## Composants disponibles (non utilisés sur la landing actuelle)

- `NexusCollection` — commenté dans le code, vitrine de produits finis (Caisse Nexus, etc.)
- `LandingPageOriginal`, `LandingPageV2` — versions alternatives du layout
- `CodePoetics`, `LogicAsCanvas` — pourraient être fusionnés ou supprimés
- `PureStructure` — commenté, à repositionner ou supprimer
