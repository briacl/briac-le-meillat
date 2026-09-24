# STACK.md — Référence Technique du Portfolio

> Document de référence interne. Base pour les mentions légales, politique de confidentialité et crédits.

---

## 1. Les Deux Faces du Site

Ce site possède deux identités distinctes, cohabitant sous la même URL.

### 🖥️ Face "Dev" — Le Portfolio Technique
- **Route** : `/` (page d'accueil publique)
- **Page** : `LandingPage.tsx`
- **Contenu** : Portfolio IT et développement — compétences académiques (BUT R&T), projets techniques (Heryze, Synapseo), expériences, contact
- **Accès** : **Public** — accessible à tout le monde sans restriction

### 🎬 Face "Production" — L'Œuvre Artistique (Bérangère)
- **Route** : `/berangere` et `/berangere/serie/:id`, `/berangere-edition`
- **Page** : `BerangerePage.tsx`, `BerangerEditionPage.tsx`, `EpisodePage.tsx`
- **Contenu** : Travaux cinématographiques et artistiques (projet Bérangère)
- **Accès** : **Protégé par mot de passe** — seul le propriétaire du site y accède

**Comment fonctionne la protection :**
Le contenu est chiffré en **AES-GCM** (chiffrement militaire) avant d'être mis en ligne. Une modale (`CryptoModal`) demande le mot de passe à l'arrivée sur ces routes. Le mot de passe est transformé en clé cryptographique via SHA-256 et stocké temporairement dans le `sessionStorage` du navigateur (effacé à la fermeture de l'onglet). Sans le bon mot de passe, le contenu reste illisible même si quelqu'un accède aux fichiers bruts.

---

## 2. Stack Technique Complète

### 🏗️ Frontend Framework

| Élément | Version | Rôle | Source officielle |
|---------|---------|------|-------------------|
| **React** | 18.2 | Framework UI, composants, état réactif | [react.dev](https://react.dev) |
| **Vite** | 7 | Bundler / serveur de développement | [vitejs.dev](https://vitejs.dev) |
| **TypeScript** | 5 | Typage statique JavaScript | [typescriptlang.org](https://typescriptlang.org) |
| **React Router DOM** | 6 | Navigation entre pages (Single Page Application) | [reactrouter.com](https://reactrouter.com) |

### 🎨 UI & Composants

| Élément | Version | Rôle | Source officielle |
|---------|---------|------|-------------------|
| **TailwindCSS** | 3 | Système de classes CSS utilitaires | [tailwindcss.com](https://tailwindcss.com) |
| **HeroUI** (ex-NextUI) | 2.8 | Composants UI : Modal, Accordion, Button, Card… | [heroui.com](https://heroui.com) |
| **DaisyUI** | 5 | Composants Tailwind complémentaires | [daisyui.com](https://daisyui.com) |
| **Headless UI** | 2 | Composants accessibles sans style (Radix-like) | [headlessui.com](https://headlessui.com) |
| **Framer Motion** | 12 | Animations et transitions fluides | [framer.com/motion](https://www.framer.com/motion/) |
| **Lucide React** | 0.562 | Bibliothèque d'icônes SVG | [lucide.dev](https://lucide.dev) |

### 🌐 3D & Visualisation

| Élément | Version | Rôle | Source officielle |
|---------|---------|------|-------------------|
| **Three.js** | 0.182 | Moteur 3D WebGL (fond réseau neuronal animé) | [threejs.org](https://threejs.org) |
| **React Three Fiber** | 8 | Intégration React pour Three.js | [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber) |
| **React Three Drei** | 10 | Helpers et abstractions pour React Three Fiber | [github.com/pmndrs/drei](https://github.com/pmndrs/drei) |

### 📝 Rendu de Contenu

| Élément | Version | Rôle | Source officielle |
|---------|---------|------|-------------------|
| **React Markdown** | 10 | Rendu des fichiers `.md` en HTML React | [npmjs/react-markdown](https://www.npmjs.com/package/react-markdown) |
| **Remark GFM** | 4 | Support GitHub Flavored Markdown | [npmjs/remark-gfm](https://www.npmjs.com/package/remark-gfm) |
| **KaTeX** | 0.16 | Rendu d'équations mathématiques (LaTeX → HTML) | [katex.org](https://katex.org) |
| **React LaTeX Next** | 3 | Intégration KaTeX dans les composants React | [npmjs/react-latex-next](https://www.npmjs.com/package/react-latex-next) |

### 🔤 Polices de Caractères

| Police | Utilisation | Licence | Source |
|--------|------------|---------|--------|
| **Paris 2024 Variable** | Titres principaux, headings display | Paris 2024 — usage personnel/éducatif | Officielle Paris 2024 |
| **Baskervville** | Citations, taglines italiques, texte élégant | OFL 1.1 (Open Font License) | [Google Fonts](https://fonts.google.com/specimen/Baskervville) |
| **Monad** | Éléments techniques, terminaux | À vérifier | Auto-hébergée |
| **Montserrat** | Corps de texte général | OFL 1.1 | [Google Fonts](https://fonts.google.com/specimen/Montserrat) |
| **Montserrat Alternates** | Variante design | OFL 1.1 | [Google Fonts](https://fonts.google.com/specimen/Montserrat+Alternates) |
| **Plus Jakarta Sans** | Interface et lisibilité | OFL 1.1 | [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans) |
| **Roboto Mono** | Blocs de code, éléments techniques | OFL 1.1 | [Google Fonts](https://fonts.google.com/specimen/Roboto+Mono) |
| **Neutraface Text** | Sections Bérangère, interface admin | ⚠️ **Commerciale** — H&FJ / House Industries | À licencier |
| **Figtree** | Chargée dans `index.html` | OFL 1.1 | [Bunny Fonts](https://fonts.bunny.net) |

> ⚠️ **Action requise** : La police **Neutraface Text** est une police commerciale de [House Industries](https://houseind.com/). Vérifier la possession d'une licence webfont valide pour un site public.

### ☁️ Hébergement & Infrastructure

| Service | Rôle | URL | Coût |
|---------|------|-----|------|
| **GitHub** | Hébergement du code source | [github.com/briacl](https://github.com/briacl) | Gratuit |
| **GitHub Pages** | Hébergement du site web statique | `briacl.github.io/briac-le-meillat` | Gratuit |
| **Cloudflare Workers** | Backend serverless (upload PDF + sync GitHub) | Plan Workers gratuit | Gratuit |

### 🔌 APIs & Services Externes

| API / Service | Rôle | Données transmises | Politique de confidentialité |
|---------------|------|-------------------|------------------------------|
| **Google Gemini API** (`gemini-2.5-flash`) | Assistant IA contextuel (chatbot flottant) | Messages de l'utilisateur + contexte du site | [policies.google.com/privacy](https://policies.google.com/privacy) |
| **GitHub REST API v3** | Upload de PDF + mise à jour de `tps.json` (admin uniquement) | PDF encodé Base64 + métadonnées TP | [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement) |
| **Bunny Fonts** | Chargement de la police Figtree | Adresse IP + User-Agent | [bunny.net/fonts](https://bunny.net/fonts/) |

### 🔧 Outils de Build & Dev

| Outil | Rôle |
|-------|------|
| PostCSS + Autoprefixer | Compatibilité CSS multi-navigateurs |
| Vite Plugin PWA | Progressive Web App (site installable) |
| Axios | Client HTTP alternatif (usage dev) |
| UUID | Génération d'identifiants uniques (TPs) |
| Concurrently | Lancer plusieurs processus en parallèle |

---

## 3. Gestion des Cookies & Stockage Local

### Explication simple (Politique de Confidentialité)

Ce site **ne pose aucun cookie de tracking, publicité ou analytics**. Il utilise uniquement le **stockage local** de votre navigateur pour deux choses :

1. **Votre choix sur les cookies** : Si vous acceptez ou refusez le bandeau cookies, votre réponse est mémorisée pour ne pas vous redemander à chaque visite.
2. **Votre thème** : Clair ou sombre — mémorisé localement.
3. **Accès Bérangère** : Si vous accédez aux pages protégées et entrez le mot de passe, il est mémorisé pour la durée de votre session (effacé quand vous fermez l'onglet).

**Aucune de ces données n'est transmise à un serveur.** Tout reste sur votre appareil.

### Explication technique précise

**Système de consentement cookies** (`CookieConsentContext.tsx`) :
- **Stockage** : `window.localStorage`
- **Clé** : `cookie-consent-status`
- **Valeurs** : `'pending'` | `'accepted'` | `'rejected'`
- **Persistance** : Indéfinie (jusqu'à suppression cache navigateur)
- **Effet** : Aucun script tiers n'est conditionné par ce consentement actuellement (pas d'analytics actif)

**Thème** (`ThemeProvider.tsx`) :
- **Stockage** : `window.localStorage`
- **Clé** : à vérifier (`theme` ou équivalent)

**Accès Bérangère** (`CryptoContext.tsx`) :
- **Stockage** : `window.sessionStorage` (durée : onglet)
- **Clé** : `berangere_key`
- **Valeur** : mot de passe en clair (hashé en SHA-256 côté navigateur pour dériver la clé AES)
- **Algorithme** : AES-GCM 256 bits via Web Crypto API

**Tableau de synthèse** :

| Donnée | Stockage | Clé | Envoyée à des tiers ? | Effacée quand ? |
|--------|----------|-----|----------------------|----------------|
| Consentement cookies | `localStorage` | `cookie-consent-status` | ❌ Non | Manuellement |
| Préférence thème | `localStorage` | (voir ThemeProvider) | ❌ Non | Manuellement |
| Clé Bérangère | `sessionStorage` | `berangere_key` | ❌ Non | Fermeture onglet |
| Messages IA | Mémoire JS | — | ✅ Google Gemini | Fermeture onglet |
