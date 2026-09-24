# Architecture du Système de Contact (Serverless)

Ce document décrit le fonctionnement complet du système de formulaire de contact mis en place sur le portfolio, permettant la réception sécurisée des messages.

Le système repose sur une architecture **100% Serverless (sans serveur)**, très moderne et performante, séparant le frontend (React), le micro-backend (Cloudflare Workers) et le service transactionnel d'envoi d'e-mail (MailerSend).

## 1. Le Frontend (React / Vite)
C'est ici que l'utilisateur saisit son message. L'interface et la logique côté client se trouvent dans :
📄 **`src/Pages/Contact.tsx`**

- **L'interface :** Un formulaire avec des champs gérés par des états locaux React (`useState`) pour le Nom complet, l'Email et le Message.
- **La logique d'envoi :** Lors du clic sur "Envoyer le message", la fonction `handleSubmit` est déclenchée.
  
Voici les lignes clés de cette fonction :
```typescript
// L'URL absolue du backend serverless
const API_URL = 'https://api-contact-berangere-development.briac-le-meillat.workers.dev';

// L'appel réseau vers cette URL
const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        type: 'contact',
        ...formData // contient name, email, message
    }),
});
```
*Note : Un deuxième formulaire similaire dans `src/Pages/LandingPageOriginal.tsx` pointe vers la même URL.*

## 2. Le Backend (Plateforme : Cloudflare Workers)
Le point de chute de la requête de l'utilisateur est une fonction Serverless hautement disponible.

- **Plateforme :** Cloudflare Workers
- **Nom du service :** `api-contact-berangere-development`
- **Rôle :** Il intercepte la requête HTTP `POST` du frontend, vérifie potentiellement le format des données (CORS, payload), et sert d'intermédiaire sécurisé pour ne pas exposer les clés d'API secrètes côté client.
- **Localisation du code :** Le code source de ce Worker spécifique n'est **pas** présent dans le dépôt Git de l'application frontend. Il a été codé et déployé soit depuis le dashboard Cloudflare, soit depuis un autre dépôt.

## 3. Le Service d'Envoi Final (Plateforme : MailerSend)
C'est le dernier maillon de la chaîne, celui qui garantit que le message arrive bien dans la boîte de réception.

- **Plateforme :** MailerSend
- **Mécanique :** Le code du Cloudflare Worker exécute une requête vers l'API sécurisée de MailerSend en lui transmettant le contenu du formulaire. 
- **Rôle :** MailerSend s'occupe de la délivrabilité finale (SMTP transactionnel de haute qualité) pour s'assurer que le mail atterrisse bien sur `briac.le.meillat@gmail.com` et ne soit pas bloqué par les filtres anti-spam. C'est ce qui explique la mention finale *"Delivered by MailerSend"* dans les emails reçus.

---

## Informations additionnelles / "Faux-amis" documentés
Certaines parties du code ou de la documentation pointent vers d'autres systèmes qui ne sont **pas** utilisés en production pour ce formulaire :
- **Le faux formulaire (Mock) :** Dans `src/Pages/Referentiel/Components/ContactForm.tsx`, il y a un appel à `supabase.functions.invoke('send-contact')`. Cependant, le fichier `Mocks/SupabaseMock.ts` montre qu'il s'agit d'une simulation (un simple `console.log`) qui ne fait rien de réel.
- **La documentation obsolète :** Le fichier `ARCHITECTURE_GLOBALE.md` mentionne une API backend en "Python FastAPI" utilisant le protocole "SMTP" traditionnel. L'architecture actuelle (Cloudflare Worker + MailerSend) prouve que cette approche a été abandonnée au profit d'une stack serverless, beaucoup plus facile à maintenir.
