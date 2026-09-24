# Explication du Système de Données du Portfolio

Ce document explique comment les différentes données (TPs, Projets, Compétences) sont stockées, gérées et affichées sur le site. Le portfolio utilise une architecture hybride : certaines données sont extraites dynamiquement depuis des fichiers texte (Markdown), tandis que d'autres sont listées en dur dans des fichiers de configuration (JSON/TS).

---

## 1. Les TPs et Cours (Le système `tpsProvider`)

**Fichier central :** `src/utils/tpsProvider.ts`
**Source des données :** Fichiers Markdown (`.md`) dans le dossier des documents d'apprentissage.

### À quoi ça sert ?
C'est le moteur du "Blog" et des sections "Derniers TPs". Il gère tout ce qui relève de l'apprentissage académique, des travaux pratiques, des cheat sheets et des notes de cours. 

### Comment ça marche ?
1. **Extraction (Globbing) :** Le script `tpsProvider.ts` scanne automatiquement tous les fichiers `.md` de ton dossier d'apprentissage via la fonction Vite `import.meta.glob`.
2. **Analyse (Parsing) :** Il lit l'en-tête (le *Frontmatter* YAML, délimité par des `---`) de chaque fichier pour extraire :
   - Le titre (`title`)
   - Le module académique (`module`)
   - Les compétences (`competence`, `ac_lies`)
   - Les technologies (`techs`)
   - L'image de couverture (`image`)
3. **Restitution :** Il renvoie un grand tableau (Array) trié par date. Les composants comme `BlogPage.tsx` ou `LastTpSpotlight.tsx` l'appellent pour afficher la liste sans que tu aies besoin d'ajouter manuellement tes TPs dans un fichier central. Dès que tu ajoutes un `.md`, il apparaît sur le site.

---

## 2. Les Grands Projets (Le fichier `projects.json`)

**Fichier central :** `src/data/projects.json`

### À quoi ça sert ?
Ce fichier liste tes réalisations majeures en développement et infrastructure (ex: *NotGoogle*, *Minigpt*, *Lyrae-shared*, *Site de portfolio*). Contrairement aux TPs (qui sont des comptes rendus académiques textuels), ce sont souvent des applications concrètes, des sites web ou des scripts avec un dépôt GitHub associé.

### Comment ça marche ?
C'est une base de données statique au format JSON. Chaque projet y est défini par un bloc contenant son nom, sa description, son image (`imageUrl`), les langages utilisés, et des tags comme `isBest` ou `isRecent`. 
Ces données sont consommées principalement par la page `/projects` (`ProjectsVisualisation.tsx`) pour générer les grosses cartes de présentation des projets.

---

## 3. Les Performances et Notes (Le fichier `skills_analysis.json`)

**Fichier central :** `src/data/skills_analysis.json`

### À quoi ça sert ?
Ce fichier contient tes résultats académiques (Top domaines, Top modules, et Performances détaillées avec les notes sur 20). 

### Comment ça marche ?
C'est une extraction structurée de tes bulletins (probablement générée via un script ou une analyse). Il alimente la section "Student Showcase" (la vitrine étudiante) ou le Dashboard d'administration pour mettre en avant ta réussite dans les modules comme *Mathématiques des transmissions* ou *Anglais*.

---

## 4. Le Parcours / CV (Le fichier `journey.ts`)

**Fichier central :** `src/data/journey.ts`

### À quoi ça sert ?
Il centralise la chronologie de ton parcours professionnel et académique (Diplômes, stages, expériences). 

### Comment ça marche ?
C'est un fichier TypeScript qui exporte un tableau d'événements. Il permet de générer la timeline (frise chronologique) visible sur la page d'accueil ou la page "À propos", en séparant les expériences pro des diplômes.

---

## 5. Le Référentiel des Compétences (AC et TPs)

**Fichiers centraux :** 
- `public/data/competences.json` (Référentiel officiel)
- `src/Components/CompetencesBUT.tsx` (Logique de liaison)
- `public/data/tps.json` (Liste manuelle des TPs associés)

### À quoi ça sert ?
C'est le système qui permet d'afficher la page du référentiel du BUT R&T, en liant chaque "Apprentissage Critique" (AC) aux Ressources (cours) correspondantes et aux TPs que tu as réalisés.

### Comment ça marche ?
1. Le fichier `competences.json` contient les textes officiels du programme (ex: *AC11.01*, *Administrer des réseaux...*).
2. Dans le composant `CompetencesBUT.tsx`, un dictionnaire codé en dur appelé `AC_MAPPING` fait la correspondance exacte. Par exemple, il indique que l'AC11.01 est acquise via les ressources *R101, R103 et SAE102*.
3. Lorsqu'un TP (issu de `tps.json` ou de tes Markdown) indique qu'il appartient à la ressource *R101*, le composant va croiser cette information avec le `AC_MAPPING` et listera automatiquement ce TP sous l'AC11.01. C'est ce mécanisme qui fait le pont entre la théorie (le référentiel) et la pratique (tes TPs).

---

## Résumé : Pourquoi cette séparation ?

- **Le contenu riche (TPs/Cours)** a besoin de texte long et de mise en forme. Utiliser le Markdown + `tpsProvider` est idéal car chaque fichier contient à la fois ses "métadonnées" (titre, date) et son "contenu" (les commandes terminaux, les explications).
- **Les catalogues (Projets, Parcours, Notes)** n'ont pas de texte long. Un fichier `JSON` ou `.ts` est beaucoup plus rapide et simple à lire pour l'interface React qui n'a qu'à boucler dessus pour créer des cartes graphiques.
