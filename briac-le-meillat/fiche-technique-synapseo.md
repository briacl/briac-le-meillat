# Fiche technique — Synapseo

Résumé : Synapseo est une plateforme de messagerie et coordination pour le secteur de la santé, chiffrée de bout en bout. Hébergement HDS, authentification forte (2FA/TOTP) et stack front React/HeroUI/Tailwind CSS ; roadmap WebSockets temps réel et interopérabilité API.

## Vue d'ensemble
Synapseo relie soignants, patients et aidants via une interface mobile-first et des dashboards interactifs. Priorités : sécurité (données de santé), simplicité d'usage sur le terrain, et interopérabilité avec les logiciels métier.

## Spécifications techniques (extraits des docs projet)
- Chiffrement : architecture « Zero Access » (chiffrement de bout en bout, les développeurs n'ont pas accès aux données médicales).
- Hébergement : visée d'hébergeur certifié HDS (Hébergeur de Données de Santé).
- Authentification : 2FA / TOTP intégré ; ambition d'intégrer Pro Santé Connect (e‑CPS).
- Communication temps réel : WebSockets planifiés pour échanges bidirectionnels.
- Stack front : React, HeroUI, Tailwind CSS (performances et UI responsive).
- Compatibilité mobile : version optimisée `/messagerietel` pour usage à une main.

## Fonctionnalités clés
- Messagerie sécurisée et mobile‑first (expérience « zéro friction »).
- Dashboards pour suivi des constantes et observance patient.
- Profils métier distincts : médecin, pharmacien, infirmier, patient / aidant.
- Mode développeur / commutateur de profil pour tests.

## Intégrations & interopérabilité
- API : objectif d'interopérer avec logiciels de gestion d'officine (LGO) et systèmes territoriaux (CPTS).
- Authentification e‑CPS (Pro Santé Connect) envisagée.

## Sécurité & conformité
- Données chiffrées E2E ; architecture « Zero Access ».
- Hébergement HDS recommandé pour conformité réglementaire.
- Politique d'accès stricte et authentification renforcée.

## Roadmap (extraits projet)
- Déploiement WebSockets pour communication temps réel.
- Synapseo Academy (données anonymisées pédagogiques).
- IA prédictive (long terme) pour anticiper ruptures de soins.
- Déploiement territorial auprès des CPTS.

## Limitations / points à préciser
- Détails du schéma de chiffrement (algorithme, gestion clefs) : non précisé.
- Hébergeur HDS choisi / plan de disponibilité : à définir.
- Durée de rétention des données et procédure de purge : non documentées.

## Sources
- 57-synapseo.md
- manifeste-nexus.md
- strat.md

---
*Fiche générée à partir des fichiers du dépôt (avril 2026)."