# PLAN.md — Plan d'Action Portfolio

> Document de référence pour la suite du projet.  
> Mis à jour le 08/05/2026.

---

## Ce qui a été accompli (session mai 2026)

### ✅ Fonctionnalités
- Système d'upload de TPs fonctionnel (Admin → Cloudflare Worker → GitHub)
- Résolution des conflits Git post-upload (`tps.json`)
- Composant `CompetencesBUT` refactorisé : affichage par AC (Apprentissages Critiques) avec codes R associés, filtrage intelligent via `AC_MAPPING`
- Mapping exhaustif AC → Ressources (R) basé sur le programme national BUT R&T

### ✅ Architecture & Nettoyage
- Suppression des vestiges Laravel : `src/Pages/Auth/` (6 fichiers), `Login.tsx`, `LoginCustom.tsx`
- Suppression des fichiers de backup : `NexusCollection.tsx.bak`, `CVSection.backup.tsx`
- Déplacement `moodle/` → `briac-le-meillat/scripts/moodle/`
- Routes mortes nettoyées dans `App.tsx` (routes `/custom-login` et `/connexion`)

### ✅ Documentation
- `STACK.md` créé à la racine de `briac-le-meillat/` (stack complète + description des deux faces du site)
- `docs/legal/mentions-legales.md` — brouillon rédigé
- `docs/legal/politique-confidentialite.md` — brouillon rédigé (RGPD, cookies, localStorage)
- `docs/legal/credits.md` — brouillon rédigé (frameworks, polices, services)

---

## Structure actuelle (briac-le-meillat/)

```
briac-le-meillat/               ← Racine réelle du projet (git)
├── briac-le-meillat/           ← Application React (Vite)
│   ├── src/
│   ├── public/
│   ├── workers/admin-worker/
│   ├── backend/                ← Python archivé, conservé
│   ├── scripts/moodle/
│   ├── STACK.md                ← Stack technique complète
│   └── README.md
├── docs/
│   ├── legal/
│   │   ├── mentions-legales.md
│   │   ├── politique-confidentialite.md
│   │   └── credits.md
│   ├── identity-design/        ← Réflexions créatives et stratégie
│   ├── technical/              ← Guides techniques
│   ├── notes/
│   └── content/
└── PLAN.md                     ← Ce fichier
```

---

## Axe 1 — Réorganisation des Sources de Données

### Problème
7 fichiers JSON éparpillés dans 4 emplacements différents.

### Audit des fichiers JSON

| Fichier | Emplacement actuel | Utilisé par | Mode |
|---------|-------------------|------------|------|
| `courses.json` | `public/data/` | `AdminDashboard.tsx` | `fetch()` |
| `tps.json` | `public/data/` | `CompetencesBUT.tsx` | `fetch()` — modifié par Cloudflare Worker |
| `registry.json` | `public/assets/data/` | `FieldNotes.tsx`, `FluxLabSection.tsx` | `fetch()` — généré par `generate-index.js` |
| `data.json` (compétences AC) | `public/assets/documents/apprentissage/` | `CompetencesBUT.tsx` | `fetch()` |
| `articles.json` | `src/data/` | Non utilisé directement (version `.enc` en prod) | Import ES |
| `projects.json` | `src/data/` | `WebProjectContext.tsx` | Import ES direct |
| `skills_analysis.json` | `src/data/` | `SkillsAnalysisSection.tsx` | Import ES direct |

### Cible proposée

```
public/data/              ← Données dynamiques (fetch HTTP)
├── courses.json          ✅ déjà là
├── tps.json              ✅ déjà là
├── registry.json         ← déplacer depuis public/assets/data/
└── competences.json      ← renommer + déplacer depuis public/assets/documents/apprentissage/data.json

src/data/                 ← Données statiques (bundlées à la compilation)
├── projects.json         ✅ déjà là
├── articles.json         ✅ déjà là
└── skills_analysis.json  ✅ déjà là
```

### Fichiers de code à modifier (5 fichiers)

| Fichier | Changement |
|---------|-----------|
| `src/Components/FieldNotes.tsx` L.45 | `assets/data/registry.json` → `data/registry.json` |
| `src/Components/FluxLabSection.tsx` L.47 | `assets/data/registry.json` → `data/registry.json` |
| `src/Components/CompetencesBUT.tsx` L.117 | `assets/documents/apprentissage/data.json` → `data/competences.json` |
| `generate-index.js` | Mettre à jour le chemin de sortie de `registry.json` |

> ⚠️ Ordre : déplacer fichier → modifier code → tester visuellement → committer.

---

## Axe 2 — Documents Légaux (brouillons rédigés)

- [x] `docs/legal/mentions-legales.md`
- [x] `docs/legal/politique-confidentialite.md`
- [x] `docs/legal/credits.md`

**Prochaines étapes légales :**
- [ ] Compléter les infos manquantes : email de contact, vérifier licence Neutraface Text
- [ ] Intégrer les liens dans le footer du site (`UnifiedFooter.tsx`)
- [ ] Créer les routes `/mentions-legales`, `/confidentialite`, `/credits` (ou une modale)

---

## Axe 3 — Éléments à ne pas oublier

- **Neutraface Text** : police commerciale (H&FJ). Vérifier la licence webfont.
- **La page `/original`** : route active pointant vers `LandingPageOriginal.tsx` — à garder ou supprimer ?
- **`img_ref/`** (à la racine du projet) : photos personnelles de référence design exposées publiquement — à archiver hors du dépôt si nécessaire.
