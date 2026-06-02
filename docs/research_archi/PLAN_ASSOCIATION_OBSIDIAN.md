# Plan d'Association Virtuelle : Coffre Obsidian, Genèse des Projets & Synchronisation OneDrive

Ce document rassemble l'historique de nos réflexions du **17 mai 2026** (issu de nos échanges dans la conversation `04d566c0-e109-4e92-a885-ca10316a6cc6`) ainsi que le **plan d'implémentation final convenu** pour relier votre coffre théorique Obsidian et vos réalisations pratiques.

---

## 📜 Partages d'Idées & Historique des Demandes (17 Mai 2026)

Lors de la genèse de ce projet, vos retours et directives ont structuré l'évolution du plan d'implémentation à travers plusieurs versions majeures :

### 1. 💼 La stratégie de présentation pour les recruteurs (Landing Page pure)
*   **Votre vision** : Conserver une Landing Page (avec le fond réseau de neurones interactif) extrêmement épurée, axée uniquement sur vos **projets réels** (académiques, personnels ou mixtes). 
*   **Votre choix** : Ne pas afficher de liste brute de vos notes Obsidian sur la page d'accueil pour ne pas surcharger l'attention d'un recruteur (qui ne passe que quelques dizaines de secondes sur le site). 
*   **La solution** : Les notes Obsidian doivent servir de **dictionnaire de connaissances virtuel et contextuel** à l'intérieur des projets ou du blog.

### 2. 🧬 La genèse des projets (Origines et Storytelling)
*   **Votre demande** : Pouvoir raconter l'histoire derrière chaque projet dans le portfolio.
*   **L'implémentation** : Enrichir chaque projet dans `projects.json` avec des attributs de provenance (`origin` : `"iut"`, `"perso"`, `"mixte"`) et un paragraphe explicatif complet (`originDetails`). Cela permet de montrer, par exemple, qu'un projet a débuté comme TP/SAE à l'IUT et a été étendu de manière autonome à la maison.

### 3. 🧠 Les Fiches Obsidian Contextuelles (« Fiches de Connaissances »)
*   **Votre idée** : Lier la théorie de vos notes de cours et la pratique de vos projets de manière élégante.
*   **Le comportement** : Lorsqu'un terme ou concept technique (ex. *PostgreSQL*, *VLAN*, *Sockets*) est mentionné sur une carte projet ou dans le blog, un bouton discret **« 🧠 En savoir plus : Lire ma note Obsidian »** apparaît. Au clic, cela ouvre une modale de lecture fluide, affichant la note correspondante épurée de ses métadonnées YAML.

### 🔄 4. Synchronisation bi-directionnelle sécurisée à coût $0 (WSL ⇆ OneDrive)
*   **Vos contraintes** : Vous travaillez dans un environnement hybride avec votre projet de développement sous **WSL (Linux)** et votre coffre Obsidian actif sous **Windows (OneDrive)**. Vous vouliez une solution 100 % locale et gratuite.
*   **Le chemin exact de votre coffre OneDrive** : 
    `/mnt/c/Users/blemeill/OneDrive - Association High Can Fly/tardisBrain/Réseaux et Télécommunications`
*   **Vos exigences de sécurité (Script Python)** :
    *   **Mise à jour réciproque** : Comparer les dates de modification (`mtime`) et synchroniser dans les deux sens de manière automatique.
    *   **ZÉRO suppression physique** : Pour éviter toute perte accidentelle de vos cours ou codes, le script ne doit **jamais supprimer physiquement** un fichier. Si un fichier est absent d'un côté, il est déplacé dans un dossier de sauvegarde temporaire `.trash_sync`.

---

## 🚀 Plan d'Implémentation Final Convenu

### 📦 1. Stratégie de Présentation des Projets & Coffre Obsidian

#### A. Préservation de l'Épure de la Landing Page
Le background réseau de neurones et la page d'accueil restent concentrés sur vos réalisations concrètes. Aucune référence brute à Obsidian n'y est affichée.

#### B. Enrichissement des Métadonnées des Projets
Chaque projet dans [projects.json](file:///home/briacl/Development/briac-le-meillat/briac-le-meillat/src/data/projects.json) sera structuré comme suit :
```json
{
  "id": "mini-gpt",
  "title": "Mini-GPT Administration",
  "origin": "mixte",
  "originDetails": "Projet mixte : Démarré sous forme de SAE à l'IUT, puis étendu à la maison pour ajouter une interface d'administration complète et une gestion multi-conversations.",
  "linked_notes": ["BIBLE_RESEAUX.md", "PostgreSQL_Setup.md"]
}
```

#### C. Fiches Obsidian Contextuelles
*   Mise en place d'un bouton discret **« 🧠 En savoir plus : Lire ma note Obsidian »** dans les cartes de détails de projet.
*   Développement d'une modale de lecture élégante (design glassmorphic/mode sombre) qui charge dynamiquement la note Markdown et en retire le frontmatter YAML.

---

### 🔄 2. Synchronisation Bi-Directionnelle (WSL ⇆ Windows OneDrive)

#### Le Script de Synchronisation `scripts/sync_obsidian.py`
Un script en Python effectue la liaison entre :
1.  **Dossier Source Git** : `/home/briacl/Development/briac-le-meillat/docs/apprentissage`
2.  **Dossier Live OneDrive Windows** (via le montage WSL `/mnt/c/`) :
    `/mnt/c/Users/blemeill/OneDrive - Association High Can Fly/tardisBrain/Réseaux et Télécommunications`

#### Règles de Synchronisation :
*   **Mise à jour réciproque** : Si une note `.md` ou une image est modifiée dans Obsidian (OneDrive) avec une date de modification plus récente, elle écrase la version correspondante dans Git. Inversement, si la note est modifiée depuis l'IDE, elle est mise à jour sur OneDrive.
*   **Ajouts automatiques** : Tout nouveau fichier créé d'un côté est dupliqué de l'autre.
*   **Sécurisation** : Aucun fichier n'est détruit. En cas de suppression ou de conflit, le fichier est déplacé dans `.trash_sync` et un log est généré.

#### Lancement Automatique :
Modification de [package.json](file:///home/briacl/Development/briac-le-meillat/briac-le-meillat/package.json) pour intégrer la synchro au démarrage local :
```json
"scripts": {
  "sync": "python3 ../scripts/sync_obsidian.py",
  "dev": "npm run sync && vite"
}
```

---

### 🎨 3. Rendu Typographique du Markdown
*   *Note du 23 mai 2026 : Ce problème est désormais **[RÉSOLU / COMPLÉTÉ]**. L'affichage de vos cours/TPs (comme dans [ExPage.tsx](file:///home/briacl/Development/briac-le-meillat/briac-le-meillat/src/Pages/ExPage.tsx)) est propre, le frontmatter YAML est correctement masqué, et le rendu Markdown est totalement opérationnel.*

---

## 🛠️ Plan de Vérification (Une fois implémenté)

1.  **Vérification de la Synchro Bi-Directionnelle** :
    *   Modifier une note dans Obsidian (Windows OneDrive).
    *   Lancer `npm run sync` dans votre terminal WSL sous VS Code.
    *   Constater que la note dans `docs/apprentissage` est mise à jour.
    *   Modifier cette note dans VS Code, relancer la synchro et constater la mise à jour sur Obsidian Windows.
2.  **Vérification de la Sécurité anti-suppression** :
    *   Supprimer temporairement un fichier dans le repo local Git.
    *   Lancer `npm run sync`.
    *   Vérifier que le fichier n'a pas été supprimé de OneDrive, mais a plutôt été restauré dans Git (ou placé dans `.trash_sync` si spécifié).
3.  **Vérification des Fiches Contextuelles** :
    *   Ouvrir un projet avec des notes associées.
    *   Cliquer sur le bouton "En savoir plus".
    *   Vérifier que la modale s'ouvre, affiche la note formatée sans en-tête YAML brut.
