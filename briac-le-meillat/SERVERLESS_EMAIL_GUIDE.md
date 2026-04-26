# Guide : Système d'E-mails Serverless (V2)

> [!NOTE]
> Ce document décrit l'évolution majeure du système de messagerie initié dans [EMAIL_SYSTEM_GUIDE.md](file:///Users/blemeill/Development/briac-le-meillat/briac-le-meillat/EMAIL_SYSTEM_GUIDE.md). L'objectif est de passer d'un script local à une architecture "Serverless" pérenne et réaliste, adaptée à un hébergement sur GitHub Pages.

## 1. Pourquoi cette évolution ?

Le système précédent (Python/FastAPI) était une base de travail locale. Cependant, pour une mise en production sur GitHub Pages (qui est statique), il fallait une solution plus robuste :
- **Réalisme** : Un frontend CSR ne peut pas appeler un script Python local une fois en ligne.
- **Pérennité** : Cloudflare Workers offre une disponibilité de 99.9% sans avoir besoin de gérer un serveur 24h/24.
- **Sécurité** : Déportation des secrets (clés API MailerSend) hors du code source.

---

## 2. L'Architecture Cloudflare Workers

Le "Serveur" est désormais un **Worker Cloudflare** situé à l'adresse suivante :
`https://api-contact-berangere-development.briac-le-meillat.workers.dev`

### Fonctionnement du flux :
1. **Frontend** : Envoie une requête POST JSON à l'URL du Worker.
2. **Worker** : Intercepte la requête, injecte la clé API secrète, et communique avec **MailerSend**.
3. **MailerSend** : Se charge de l'acheminement final du mail vers `briac.le.meillat@gmail.com`.

---

## 3. Implémentation Frontend (React)

Voici l'exemple technique utilisé pour migrer la logique d'appel de `localhost` vers le Worker.

```javascript
const API_URL = "https://api-contact-berangere-development.briac-le-meillat.workers.dev";

async function sendContactEmail(name, email, message) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "contact", // Identifiant pour le Worker
                name: name,
                email: email,
                message: message
            }),
        });

        const result = await response.json();
        if (result.success) {
            alert("Email envoyé avec succès !");
        } else {
            alert("Erreur lors de l'envoi.");
        }
    } catch (error) {
        console.error("Erreur technique :", error);
    }
}
```

---

## 4. Avantages pour le Développement

- **Unité** : Le même code fonctionne sur votre PC (dev local) et en ligne sur GitHub Pages.
- **Transparence** : Même en mode `Live Server` sur VS Code, vos tests partent réellement via Cloudflare et vous recevez les mails en temps réel.
- **CORS** : Le Worker gère les autorisations pour permettre les appels depuis `localhost` et votre domaine final.

> [!TIP]
> Pour toute modification de la logique d'envoi (sujet du mail, destinataire), tout se passe désormais dans le code du Worker (via Wrangler ou le dashboard Cloudflare), sans toucher au frontend.
