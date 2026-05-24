# Plan d'ajustements — v4 (24 mai 2026)

---

## Tâches déjà livrées ✓

- [x] LogicAsCanvas : image Synapseo → animation LogicGrid
- [x] NNB : containment dans zone safe (navbar + bords), hitRadius majeur → 50px
- [x] FieldNotes : lisibilité améliorée + pagination par 5
- [x] "nous" → "je" partout (ArchitectSpecs, TheToolset)
- [x] Navbar : "Démarrer" → "AI Assistance" (Sparkles, ouvre ChatWidget)
- [x] ChatContext : état partagé isOpen entre Navbar et ChatWidget
- [x] ChatWidget : suppression du bouton flottant MessageCircle
- [x] projects.json : champ `origin[]` sur les 22 projets (iut/perso)
- [x] NNB : badges IUT/Perso sur les 3 groupes de cards dans la modale domaine
- [x] TheToolset : noms de projets cliquables → modale glassmorphic (description, origin, stack, GitHub)
- [x] FluxLab : projets perso → modale light-mode au lieu d'ExPage
- [x] Footer : Blog link → `/blog`
- [x] BlogPage : journal light-mode + route `/blog` dans App.tsx

---

## Tâche H — Project Showcases (Landing Page)

**Principe :** Insérer 3 sections "showcase produit" style Apple entre TheToolset et CodePoetics (Mouvement IV). Chaque section = plein écran dark, terminal animé qui tape les outputs réels du projet, puis le code source en-dessous avec syntax highlighting.

**Position dans LandingPage.tsx :**
```
TheToolset → [H1 willkommen_v2] → [H2 reseau] → [H3 lyrae-shared] → CodePoetics → LogicAsCanvas
```

---

### H1 — willkommen_v2

**Source :** `/home/briacl/Development/lockdown-term/R106/.willkommen_20251024222341/willkommen_v2.py`

**Ce que c'est :** Générateur de squelette de projet multi-langages en CLI (Python + Rich + Questionary). UI terminal cyan/magenta, sélections interactives, génère les fichiers.

**Terminal animé (typing effect) :**
```
╭──────────────────────────────────────╮
│        ✨ WILLKOMMEN v2 ✨           │
│  pour créer n'importe quel fichier   │
╰──────────────────────────────────────╯

> Quel langage ?   ❯ Python
> Nom du projet :  mon-api
> Fichier principal : app.py
> Objectif : API REST légère

  ✓ app.py créé
  ✓ requirements.txt créé
  ✓ .gitignore créé
  ✓ README.md généré

  Projet prêt. Bonne création.
```

**Extrait code affiché (sous le terminal) :**
```python
console.print(Panel(
    Text.assemble(title, "\n", subtitle),
    box=box.ROUNDED,
    border_style="cyan",
    padding=(1, 4),
))
```

**Stack badges :** Python · Rich · Questionary · CLI

---

### H2 — reseau

**Source :** `/home/briacl/Development/reseau/` + dépôt GitHub public

**Ce que c'est :** Projet pédagogique de simulation et visualisation de l'encapsulation réseau (Ethernet, IP, ICMP, ARP). Python + HTML/CSS + Gemini Pro AI.

**Terminal animé :**
```
============================================================
         PACKET ADVENTURE : L'Explorateur de Paquets
============================================================

> Protocole sélectionné : IPv4
> Construction du paquet...

  [Ethernet II]  src: aa:bb:cc:dd:ee:ff  dst: ff:ff:ff:ff:ff:ff
  [IPv4]         src: 192.168.1.1         dst: 8.8.8.8
  [ICMP]         type: 8 (echo request)   id: 1337

  Visualisation → ouverte dans le navigateur ✓
```

**Stack badges :** Python · HTML/CSS · Gemini Pro · Scapy

---

### H3 — lyrae-shared

**Source :** `/home/briacl/Development/lyrae-shared/`

**Ce que c'est :** Single Source of Truth pour règles de code, patterns IA, prompts, extension VSCode. Chef d'orchestre de la gouvernance des projets.

**Angle showcase :** Pas un output terminal classique — montrer plutôt la structure du repo comme une arborescence qui apparaît, puis un extrait de règle/pattern comme si on lisait un fichier de config. Effet "infrastructure mentale".

**Affichage animé (arborescence) :**
```
lyrae-shared/
├── rules/        ← lois de nommage, architecture
├── patterns/     ← extraits "Excellence" React, Node
├── prompts/      ← guides conversationnels IA
├── adapters/     ← paramètres par IA (Claude, Gemini)
└── packages/
    ├── cli/           lyrae-pull, lyrae init
    └── vscode-extension/

[lyrae] Règle chargée : "Zéro duplication entre projets"
[lyrae] Pattern actif : fullstack-nextjs.md
[lyrae] Extension VSCode : connectée ✓
```

**Stack badges :** Node.js · VSCode API · Markdown · JSON

---

### Design commun aux 3 sections

- Fond : `#0d0d0d` (cohérent avec le reste du Mouvement IV)
- Layout : texte à gauche (tag + titre + tagline + stack badges), terminal à droite
- Terminal : fond `#111`, texte `#e2e8f0`, accent `#06b6d4` (cyan) pour les `✓` et symboles
- Syntax highlight du code : manuel (spans colorés), pas de librairie externe
- Animation : typing effect via `useEffect` + `setTimeout` ou Framer Motion `variants` avec `staggerChildren`
- Bouton scroll-to-next en bas (même style chevron que PureStructure)

**Effort estimé : ~3h**

---

## Tâche I — BlogPage : Interface de recherche IA

**Remplacement complet de l'UI actuelle** du Blog par une interface de recherche centrale, inspirée de Gemini.

### I1. Page principale — Barre de recherche

**Design :**
- Fond : blanc cassé (`#FAFAF9` ou `#F5F4F2`)
- Centre de l'écran : barre de recherche blanche, bords arrondis 50% (`rounded-full`), large (`max-w-2xl`)
- Effet lumineux derrière/autour la barre : glow radial en dégradé des couleurs Bérangère Development (`#0075FF` → `#f336f0`), `blur-3xl`, opacity ~30%
- Placeholder : `Recherchez parmi les travaux de Briac…`
- Icône loupe à gauche, icône Sparkles à droite (indique IA)
- Navbar flottante existante en haut
- Footer en bas

**Layout avant recherche (état initial) :**
```
┌─────────────────────────────────────────────────┐
│  [Navbar]                                       │
│                                                 │
│                                                 │
│         Explorez les travaux de Briac           │  ← titre Baskerville italic
│    Recherchez un projet, un TP, une techno…     │  ← sous-titre mono zinc-400
│                                                 │
│   🔍 [  Recherchez parmi les travaux…  ] ✨    │  ← barre + glow
│                                                 │
│   Suggestions rapides :                         │
│   [Réseaux]  [Python]  [React]  [IUT]  [Perso] │  ← chips cliquables
│                                                 │
│                                                 │
│  [Footer]                                       │
└─────────────────────────────────────────────────┘
```

### I2. Résultats de recherche — Réponse IA

Quand l'utilisateur soumet une requête, l'affichage bascule vers une vue résultats :

```
┌─────────────────────────────────────────────────┐
│  [Navbar]                                       │
│                                                 │
│  🔍 [quels sont les derniers apprentissages ?] ✨│  ← barre compacte en haut
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  ✨ Résultat                            │   │
│  │                                         │   │
│  │  Briac a récemment travaillé sur :      │   │
│  │                                         │   │
│  │  → TP Apache/Nginx (janv. 2026)         │   │  ← lien cliquable → ExPage
│  │    Bases des services réseaux · IUT     │   │
│  │                                         │   │
│  │  → TP DHCP/TFTP/PXE (fév. 2026)        │   │
│  │    Bases des services réseaux · IUT     │   │
│  │                                         │   │
│  │  → NetGuardian (mars 2026)              │   │
│  │    Projet perso · Python · Réseau       │   │
│  │                                         │   │
│  │  Vous pouvez retrouver tous ces         │   │
│  │  travaux sur le Blog →                  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Footer]                                       │
└─────────────────────────────────────────────────┘
```

### I3. Contexte IA — Ce qu'on donne à Gemini

Le système prompt inclura :
- Contenu complet de `context.md` (déjà utilisé par le ChatWidget)
- Liste de tous les projets (depuis `projects.json`)
- Liste de tous les TPs/documents (depuis `registry.json` + `tps.json`)
- Instructions : répondre en guidant vers les contenus, inclure des liens markdown `[titre](chemin)` que le composant transforme en boutons cliquables vers ExPage ou le blog filtré

**Réutilisation :** La logique `callGeminiAPI` du ChatWidget est extractible dans un hook `useGeminiChat` partagé.

**Effort estimé : ~2h30**

---

## Ordre d'exécution recommandé — v4

| # | Tâche | Fichiers principaux | Effort |
|---|-------|---------------------|--------|
| H | Project Showcases (3 sections) | `ArchitectSpecs.tsx`, `LandingPage.tsx` | ~3h |
| I | BlogPage : interface recherche IA | `BlogPage.tsx`, nouveau hook `useGeminiChat` | ~2h30 |

**Total nouvelles tâches : ~5h30**

---

## Hors scope (décidé ensemble)

- netguardian et readme-generator dans les showcases (retirés)
- Sync Obsidian ↔ OneDrive ↔ VSCode
- Modale Obsidian contextuelle (linked_notes)
- Unification de la langue (anglais/français)
- Section "À propos"
- NNB light mode

---

## Notes techniques

### Projets showcase — sources locales
| Projet | Chemin local |
|--------|-------------|
| willkommen_v2 | `/home/briacl/Development/lockdown-term/R106/.willkommen_20251024222341/willkommen_v2.py` |
| reseau | `/home/briacl/Development/reseau/` (+ GitHub public) |
| lyrae-shared | `/home/briacl/Development/lyrae-shared/` (+ GitHub public) |

### Couleurs Bérangère Development (glow blog)
- Bleu : `#0075FF`
- Rose/violet : `#f336f0`
- Cyan : `#06b6d4`
