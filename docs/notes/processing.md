# Journal de Bord - briac-le-meillat

## Initialisation
- **Date**: 07 Janvier 2026
- **Objectif**: Mise en place architecture Laravel + React + HeroUI + MariaDB.
- **Environment**: Node.js v22 (via NVM) pour support Vite.

## Actions et Résultats

### 1. Analyse Initiale
- [x] Vérification des fichiers existants (MedConnect.pdf, briac-le-meillat_landing.html).
- [x] Constat: `mysql` non installé, `dbngin` non installé.
- [x] Décision: Utiliser Homebrew pour installer MariaDB.

### 2. Base de Données
- [x] **Solution Alternative**: Passage temporaire à **SQLite** pour débloquer l'accès.
- [x] Configuration `.env` (SQLite).
- [x] Migrations (`php artisan migrate:fresh`) effectuées.

### 3. Frontend (Laravel Breeze + React)
- [x] Build Frontend (`npm run build`).
    - *Succès*: Le build a réussi.

### 4. Landing Page
- [x] Intégration `LandingPage.tsx`.
- [x] **Correction Assets**: Copie des fonts manquantes.
- [x] **Refactoring CSS**: Remplacement des styles raw par des classes Tailwind pour garantir la visibilité.

### 5. Documentation
- [x] `README.md` créé.
- [x] `explications.md` créé (Guide pédagogique).

### 6. Accès Local
- [x] `php artisan serve` validé (Port 8000).
- [x] `npm run dev` activé (Node v22).

### 7. UI Fixes
- [x] **Visibilité Landing Page**: Refactoring du layout (`h-screen`, `flexbox`) pour corriger l'affichage du titre "briac-le-meillat" et de la tagline qui étaient masqués.
- [x] **Contenu**: Mise à jour titre page ("App Sécurisée") et ajout "INFIRMIERS/PHARMACIENS".
