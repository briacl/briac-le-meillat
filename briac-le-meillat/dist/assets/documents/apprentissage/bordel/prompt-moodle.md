


## Phase 1 — Extraction du Référentiel National (PDF)

### 1.1 — Identifier le PDF de référence
Le fichier `Annexe_22_RT_BUT_annee_1_1411365.pdf` contient tout le mapping des ressources (Rxxx).
- Plus stable que Moodle (ne change pas tous les jours).
- Source officielle pour les UEs et les compétences.

### 1.2 — Script d'extraction Python
Utilisation de `pdfplumber` pour extraire les données et générer `mapping.json`.
Le script doit récupérer :
- Code de la ressource (ex: R201)
- Titre complet
- UE rattachées (Connecter, Administrer, Programmer, Sécuriser)
- Semestre

### 1.3 — Générer `courses.json`
Le script final exporte un fichier JSON structuré dans `/public/data/courses.json`.
```json
{
  "R201": {
    "titre": "Initiation aux réseaux",
    "ue": ["Connecter", "Administrer"],
    "semestre": 2,
    "competences": ["Configurer des équipements réseau", "..."]
  }
}
```

---

## Phase 2 — Système d'Administration (Upload TPs)

### 2.1 — Cloudflare Worker "Upload & Commit"
Un Worker qui reçoit le fichier PDF + métadonnées et le commit sur GitHub.

### 2.2 — Sécurité Renforcée (Côté Worker)
> [!CAUTION]
> Contrairement au plan initial, la sécurité ne doit PAS être uniquement côté React.
- Le Worker valide un header `X-Admin-Password`.
- Le mot de passe est stored dans les secrets Cloudflare (`ADMIN_PASSWORD`).
- Si le mot de passe est faux, le Worker renvoie une `401 Unauthorized`.

### 2.3 — GitHub Integration
- Utilisation d'un **Fine-grained PAT** pour les commits.
- Mise à jour automatique de `tps.json` lors de chaque upload.

---

## Phase 3 — Interface React & Dashboard

### 3.1 — Page `/briac-admin`
Une interface d'administration ultra-minimaliste :
- Input password (envoyé dans le header).
- Formulaire d'upload (Titre, Ressource, Fichier).
- Liste des TPs déjà en ligne avec option de suppression (via Worker).

### 3.2 — Page `/competences`
- Affichage dynamique des ressources depuis `courses.json`.
- Filtrage par UE (Connecter, Administrer, Programmer, Sécuriser).
- Liens de téléchargement vers les TPs stockés dans `/public/tps/`.

---

## Ordre de réalisation

| Étape | Quoi | Durée estimée |
|-------|------|---------------|
| 1 | Script d'extraction PDF -> `courses.json` | 2h |
| 2 | Configuration Cloudflare Worker + Secrets | 3h |
| 3 | Page Admin React `/briac-admin` (Upload) | 2h |
| 4 | Page Publique `/competences` (Affichage) | 3h |
| 5 | Documentation "Architecture du site" | 1h |

**Total estimé : ~11h de travail effectif**