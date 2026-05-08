# Politique de Confidentialité & Gestion des Cookies

> Brouillon — contenu à valider avant intégration sur le site.  
> Dernière mise à jour : mai 2026  
> Site concerné : briacl.github.io/briac-le-meillat

---

## Résumé (version courte)

Ce site **ne collecte aucune donnée personnelle**. Il n'utilise pas d'outils de tracking, de publicité ou de statistiques. Le seul stockage local utilisé concerne vos préférences de navigation (thème, consentement) et reste **uniquement sur votre appareil**.

---

## 1. Données collectées

### Données personnelles
Ce site **ne collecte aucune donnée personnelle** identifiable (nom, email, adresse IP, etc.) directement.

Il n'existe pas de formulaire d'inscription, de compte utilisateur ou de base de données d'utilisateurs.

> Le formulaire de contact présent sur le site (page `/contact`) redirige via un lien `mailto:` directement vers votre client email. Aucune donnée n'est interceptée ou stockée par le site.

### Données techniques (logs serveur)
GitHub Pages, en tant qu'hébergeur, peut collecter des données de connexion standard (adresse IP, user-agent, pages visitées) conformément à leur propre politique de confidentialité. Ces données ne sont pas accessibles à l'auteur du site.

→ [Politique de confidentialité GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)

---

## 2. Cookies & Stockage Local

Ce site n'utilise **aucun cookie** au sens strict (aucun `Set-Cookie` HTTP). Il utilise en revanche le **stockage navigateur** (`localStorage` et `sessionStorage`) pour les fonctionnalités suivantes :

### 2.1 `localStorage` — Stockage persistant

| Donnée | Clé localStorage | Valeurs | Durée | Partagée ? |
|--------|-----------------|---------|-------|-----------|
| Consentement cookies | `cookie-consent-status` | `pending`, `accepted`, `rejected` | Indéfinie | ❌ Non |
| Préférence de thème | *(voir ThemeProvider)* | `light`, `dark` | Indéfinie | ❌ Non |

**Fonctionnement** : Ces données sont lues au chargement du site pour rétablir vos préférences. Elles ne sont jamais transmises à un serveur.

**Comment les supprimer** : Ouvrez les outils développeur de votre navigateur (F12) → Application → Local Storage → Supprimer les entrées concernées.

### 2.2 `sessionStorage` — Stockage de session

| Donnée | Clé sessionStorage | Valeurs | Durée | Partagée ? |
|--------|-------------------|---------|-------|-----------|
| Clé d'accès Bérangère | `berangere_key` | Mot de passe saisi | Onglet ouvert | ❌ Non |

**Fonctionnement** : Lorsque vous accédez aux pages protégées du projet Bérangère et saisissez le mot de passe, celui-ci est temporairement mémorisé pour éviter de le ressaisir à chaque navigation. Cette donnée est automatiquement effacée à la fermeture de l'onglet.

---

## 3. Services Tiers & Données Partagées

### 3.1 Google Gemini (Assistant IA)

**Quand** : Uniquement si vous utilisez le chatbot IA intégré au site.  
**Ce qui est transmis** : Vos messages + un contexte textuel fixe décrivant le site (`context.md`).  
**Par qui** : API Google Generative Language (`generativelanguage.googleapis.com`).  
**Conservation** : Selon les conditions Google — les données peuvent être utilisées pour améliorer leurs modèles sauf opt-out.  
→ [Politique de confidentialité Google](https://policies.google.com/privacy)  
→ [Conditions d'utilisation Gemini API](https://ai.google.dev/terms)

### 3.2 Bunny Fonts

**Quand** : À chaque chargement du site (police Figtree).  
**Ce qui est transmis** : Votre adresse IP et User-Agent (pour servir le fichier de police).  
**Par qui** : Bunny.net (BunnyCDN).  
**Objectif** : Uniquement technique — servir le fichier de police.  
→ [Politique de confidentialité Bunny.net](https://bunny.net/privacy)

> **Note** : Les autres polices du site (Paris 2024, Baskervville, Montserrat, Monad, Neutraface Text, Plus Jakarta Sans, Roboto Mono) sont **auto-hébergées** sur GitHub Pages et ne sollicitent aucun serveur tiers.

### 3.3 GitHub (hébergeur)

**Ce qui est transmis** : Données de connexion standard (IP, user-agent) à chaque visite du site.  
**Par qui** : GitHub, Inc.  
→ [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)

---

## 4. Le Bandeau Cookies

Le site affiche un bandeau de consentement aux cookies à la première visite. Techniquement, **aucun cookie de tracking n'est actif** sur ce site — le bandeau est présent à des fins de conformité et d'information.

- **Accepter** : Enregistre `'accepted'` dans `localStorage`. Permet l'activation future de scripts analytiques si ajoutés.
- **Refuser** : Enregistre `'rejected'` dans `localStorage`. Aucun script tiers ne sera activé.
- **Réinitialiser** : Possible en supprimant la clé `cookie-consent-status` dans le stockage du navigateur.

---

## 5. Droits des Utilisateurs (RGPD)

Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679), vous disposez des droits suivants :

- **Droit d'accès** : Aucune donnée personnelle n'étant collectée par ce site, il n'y a rien à communiquer.
- **Droit d'effacement** : Supprimez le stockage local via les outils de votre navigateur.
- **Droit d'opposition** : Ne pas utiliser l'assistant IA pour éviter toute transmission à Google.
- **Réclamation** : Vous pouvez introduire une réclamation auprès de la CNIL — [cnil.fr](https://www.cnil.fr)

**Contact** : [Email à compléter — celui de la page /contact]

---

## 6. Sécurité

Le contenu du projet Bérangère est protégé par chiffrement **AES-GCM 256 bits** (Web Crypto API navigateur). La clé est dérivée de votre mot de passe via SHA-256. Ce mécanisme garantit qu'aucune donnée sensible n'est accessible sans authentification, même si les fichiers bruts étaient consultés.
