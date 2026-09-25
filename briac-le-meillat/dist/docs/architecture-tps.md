# Architecture du Système de Documentation (TPs)

Ce document explique le fonctionnement interne du système de documentation du portfolio, qui permet d'afficher dynamiquement des dizaines de comptes-rendus de TP au format Markdown sans nécessiter de backend ou de base de données complexe.

## 1. Philosophie et Choix Techniques

Le portfolio est une Single Page Application (SPA) React propulsée par Vite. Les données des TPs ne proviennent pas d'une API externe, mais sont **compilées statiquement** au moment du build (ou servies en direct par le serveur de dev).
Les TPs sont écrits en **Markdown** avec un en-tête **YAML (Frontmatter)** qui contient les métadonnées (titre, date, compétences, technologies, image associée).

## 2. Le cœur du système : `tpsProvider.ts`

Le fichier `src/utils/tpsProvider.ts` est le cerveau du système de récupération des TPs.

### 2.1. Glob Imports de Vite
Le système repose sur la fonctionnalité `import.meta.glob` de Vite :
```typescript
const rawFiles = import.meta.glob('/src/content/**/*.md', { query: '?raw', eager: true });
const urlFiles = import.meta.glob('/src/content/**/*.md', { query: '?url', eager: true });
```
- **`?raw`** : Demande à Vite de charger le contenu texte brut du fichier `.md`. C'est utilisé pour extraire les métadonnées (Frontmatter) et le contenu du TP.
- **`?url`** : Demande à Vite de fournir l'URL publique générée (hashée) du fichier `.md`. C'est utile pour pouvoir donner un lien vers le fichier.
- **`eager: true`** : Force Vite à résoudre et inclure ces fichiers directement au moment de l'import, plutôt que de faire du lazy-loading asynchrone.

### 2.2. Parsing du Frontmatter
La fonction `parseFrontmatter` parcourt le contenu brut (`rawContent`) du Markdown, extrait le bloc situé entre les balises `---` au début du fichier, et le convertit en objet JavaScript. Elle gère notamment les tableaux inline (`techs: ["Linux", "Docker"]`) et les listes YAML classiques.

### 2.3. Résolution Dynamique des Images
Les TPs référencent leurs images dans le frontmatter (ex: `image: /assets/rt/tp-qos-visu.jpg`).
Pour que ces images fonctionnent après le build (où Vite ajoute des hashs aux noms de fichiers), le système récupère toutes les images via :
```typescript
const projectImages = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,svg,webp,gif}', { query: '?url', eager: true });
```
La fonction `resolveImageUrl` fait ensuite correspondre le nom de fichier de l'image demandée avec le chemin hashé par Vite.

La fonction exportée `getAllTps()` assemble tout cela : elle retourne un tableau trié de tous les TPs trouvés avec leurs contenus, leurs métadonnées et leurs URLs d'images résolues.

## 3. Affichage dans les Composants

Des composants comme `StudentShowcaseSection.tsx`, `FavoriteProjects.tsx` ou `LastTpSpotlight.tsx` font appel à `getAllTps()`.

- **StudentShowcaseSection** : Utilise les TPs retournés pour les filtrer dynamiquement en fonction de la compétence (Apprentissage Critique - AC) sélectionnée par l'utilisateur.
- **LastTpSpotlight** : Récupère les TPs, les filtre pour ne garder que ceux qui ont une image valide, et affiche les 5 premiers dans un carrousel stylisé.

Ces composants passent ensuite les données du TP cliqué au composant de lecture finale : `ExPage`.

## 4. Lecture du Markdown : `ExPage.tsx`

`ExPage` est le composant chargé du rendu visuel final du TP.

### 4.1. Récupération des Données
Initialement, `ExPage` faisait un `fetch()` réseau vers l'URL du fichier `.md` pour en récupérer le contenu.
Cependant, à cause du comportement du routeur SPA de Vite, faire un fetch sur un fichier importé dynamiquement risquait de retourner le fichier `index.html` (fallback) au lieu du Markdown.
Le système a donc été optimisé : les composants parents qui utilisent déjà `getAllTps()` passent **directement le contenu brut (`rawContent`)** à `ExPage` en tant que *prop*, évitant ainsi un appel réseau superflu.

### 4.2. Rendu Visuel
`ExPage` utilise `react-markdown` pour convertir le texte Markdown en éléments HTML (React).
Il est enrichi par des plugins :
- **`remarkGfm`** : Support des tables, listes de tâches, barrés.
- **`remarkMath` & `rehypeKatex`** : Rendu des formules mathématiques de style LaTeX.

Le composant redéfinit le rendu des balises (via le prop `components` de `react-markdown`) pour appliquer les styles personnalisés du portfolio (polices Paris2024, bordures, etc.) et pour styliser spécifiquement les blocs de code (avec le bouton de copie) et les alertes (notes, avertissements).

## Résumé du Flux

1. **Build / Dev** : Vite scanne `src/content/` et `src/assets/`.
2. **`tpsProvider`** : Parse le Markdown, extrait les métadonnées, fait le lien avec les images.
3. **Composants d'UI** : Filtrent et affichent les TPs sous forme de cartes.
4. **`ExPage`** : Reçoit le contenu du TP sélectionné et génère l'affichage stylisé de l'article avec `react-markdown`.
