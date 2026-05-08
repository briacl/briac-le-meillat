# Architecture Narrative & Design (Apple-Inspired)

Ce document définit la structure narrative et les principes de design du portfolio **Bérangère • Development**.

---

## Mouvement I — L'Activité (Le Monde Blanc)

*   **Hero ("Build Harmony")** : L'accroche émotionnelle et minimaliste.
*   **Manifesto** : L'expression de la philosophie et de la vision.
*   **Flux Lab (Version Light)** : L'activité immédiate, le "mouvement perpétuel" des travaux en cours.

---

## Mouvement II — Le Pivot (La Transition)

*   **Blueprint Transition** : Le passage visuel du blanc au noir, de l'émotion à l'ingénierie.
*   **Pure Structure** : Affirmation de la robustesse architecturale et de la rigueur technique.

---

## Mouvement III — The Toolset

**Rôle** : Transformer la perception de "projets d'étudiant" en "instruments d'ingénierie".
**Design** : Recyclage du composant `NexusCollection` (fond noir, cartes glassmorphiques, auras colorées).

### 1. Accroche Narrative
*   **Titre (H2)** : "The Toolset."
*   **Tagline** : "Voici les instruments que j'ai créés pour bâtir le futur."
*   **Style** : Typographie *Paris2024*, blanc pur, suivi d'un paragraphe bicolore (blanc/zinc-400) expliquant la transition entre la recherche et l'application industrielle.

### 2. Architecture des Cartes (Les Trois Piliers)
Chaque carte utilise le système *Border Beam* et une *Aura* de couleur spécifique.

| Pilier | Projets Inclus | Storytelling (Tagline) | Identité Visuelle |
| :--- | :--- | :--- | :--- |
| **Automation & Workflow** | `willkommen_v2`, `readme-generator`, `own-cli-template` | Standardiser la création. L'art de rendre la mise en place invisible. | Glyphe terminal, Aura Bleue. |
| **Intelligence & Data** | `machine-learning`, `visualisation de réseau` | Rendre la donnée vivante. Transformer des flux complexes en insights. | Onde SoundWave, Aura Violette. |
| **Shared Infrastructure** | `lyrae-shared` | Le noyau universel. Bibliothèques réutilisables pour une cohérence totale. | Cube isométrique, Aura Cyan. |

### 3. Spécifications de Design des "Instruments"
*   **Iconographie** : Pas de captures de code, uniquement de l'abstrait premium.
    *   *Willkommen_v2* : "L'accueil réinventé par le code." (Focus UX)
    *   *Réseau* : "La géométrie des flux." (Focus Architecture)
    *   *Own-cli-template* : "L'architecture de démarrage universelle." (Focus Efficacité)
*   **Animations (Framer Motion)** :
    *   **Apparition** : `y: 40 → 0`, `opacity: 0 → 1` avec un stagger entre les piliers.
    *   **Interaction** : Activation automatique de l'aura et du Border Beam 1.5s après l'entrée dans le champ (`useInView`).
    *   **Cartes** : `rounded-[3rem]`, `bg-zinc-950`, bordure `white/10` → `white/18` au survol.

### 4. Note de Transition (Le Futur de Bérangère)
Un bloc discret lient ces outils aux futurs projets Nexus :
> "Bérangère • Development travaille activement avec Nexus sur des architectures de nouvelle génération (Heryze, Synapseo) qui redéfiniront l'expérience utilisateur dès 2027."

---

## Mouvement IV — L'Exploration (L'Infini)

*   **Code Poetics & Logic as Canvas** : Humanisation des projets GitHub.
*   **Nexus Collection** : Vitrine des produits finis.
*   **The Ecosystem (Neural Network)** : Vue macro de toutes les compétences et micro-projets.
*   **Field Notes** : Registre technique complet, preuve de rigueur académique.
*   **Final CTA** : Ouverture vers la collaboration.

---

## Architecture de Navigation (Navbar)

Pour rester "Apple-like", la navbar évoque des concepts plutôt que des termes techniques.

*   **Philosophy** (Ancre : `#manifesto-section`)
*   **Systems** (Ancre : `#the-toolset`)
*   **Ecosystem** (Ancre : `#the-ecosystem`)
*   **Registry** (Ancre : `#field-notes`)
*   **Contact**

---

## Stratégies de Design

### 1. La "Divulgation Progressive"
*   **Le Haut (Style Homepage)** : Ultra-minimaliste, beaucoup de blanc, typographie forte. Établit l'autorité et l'élégance.
*   **La Descente (Style Product Page)** : On "allume les lumières du labo". Le passage au noir et les cartes complexes marquent l'expertise technique.

### 2. Intégration du "Toolset"
*   **Entrée en matière** : Ne pas lancer les cartes directement. Titre sobre et aéré en amont.
*   **Apparition** : Effet de fondu enchaîné fluide. Le design "fou" des cartes devient une récompense visuelle.
*   **Contraste maîtrisé** : Structure de texte rigoureuse (alignement Apple) pour compenser la complexité visuelle des auras.