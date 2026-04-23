# Fiche technique — Heryze

Résumé : Heryze est une PWA point de vente offline-first qui transforme n'importe quel écran en terminal de vente. Résilience réseau (offline-first), scanner smartphone via WebRTC (« Douchette Magique ») et export comptable / Z‑caisse pour conformité. Conçu pour performance UX (fluidité) et intégration paiements (Stripe).

## Vue d'ensemble
Heryze est la solution de caisse du portefeuille Nexus : PWA légère, pensée pour TPE/PME et restauration légère. Objectifs principaux : zéro matériel propriétaire, démarrage rapide, robustesse en cas de coupure réseau, et simplicité administrative (export comptable).

## Spécifications techniques (extraits des docs projet)
- Type d'application : PWA (Progressive Web App), architecture Client-Side Rendering (CSR).
- Mode hors-ligne : offline-first avec stockage local et synchronisation automatique au retour réseau.
- UI / perf : design optimisé pour 60 FPS, micro-interactions (Framer Motion / animations calibrées).
- Scanner : WebRTC-based "Douchette Magique" (smartphone/tablette utilisé comme scanner code-barres temps réel).
- Paiements : intégration Stripe (gestion abonnements, paiement CB sécurisé).
- Export comptable : Z‑caisse automatique, exports normés (FEC / format comptable) pour expert-comptable.
- Impression : support prévu pour imprimantes thermiques via protocole ESC/POS (roadmap).
- Hébergement et architecture : logique CSR / PWA visant à minimiser la charge serveur (docs projet : architecture CSR).

## Fonctionnalités clés
- POS intelligent (grille produits, variantes, panier, multi-modes de paiement).
- Quick POS (encaissements rapides par saisie de montant).
- Gestion inventaire (import CSV, suivi stock, alertes de stock critique).
- Dashboard Nexus (CA, paniers moyens, rapports hebdomadaires).
- Z‑Caisse automatique et export comptable.
- Gestion multi-caisses synchronisées (plan Business/Expert).

## Intégrations & conformité
- Paiement : Stripe (intégration native citée dans le projet).
- Conformité / preuve de confiance : badge « conçu pour la conformité NF525 » (présence sur la landing page), export FEC mentionné.
- Impression thermique : prise en charge ESC/POS prévue.

## Architecture & déploiement
- Approche : PWA + CSR pour réduire coûts serveurs et offrir résilience locale.
- Stockage local : mécanisme de sauvegarde hors-ligne et files d'attente de synchronisation (technique exacte à préciser dans l'implémentation).
- Scalabilité : logique client-heavy pour limiter l'infrastructure serveur.

## Roadmap (extraits projet)
- Tickets dématérialisés (envoi de reçus par email).
- Gestion de salle & module cuisine (bons en cuisine).
- Support imprimantes thermiques ESC/POS.
- Fidélité & marketing (programme de fidélité intégré).

## Limitations / points à préciser
- Liste exacte des modèles d'imprimantes thermiques supportés (ESC/POS) : non précisée.
- Moyens de paiement alternatifs (terminaux physiques, TPE) : à documenter.
- Détails sur le modèle de stockage local (IndexedDB / autre) et stratégie de conflit de synchronisation : non précisé.

## Sources
- 55-heryze-vision-produit-synthese.md
- 59-landing-page-analysis.md
- manifeste-nexus.md
- strat.md

---
*Fiche générée à partir des fichiers du dépôt (avril 2026)."