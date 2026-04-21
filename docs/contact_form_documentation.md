# Documentation du Système de Contact et d'Envoi d'Emails

Ce document détaille le fonctionnement complet du formulaire de contact et du système d'envoi d'emails de ce projet, afin de faciliter sa réutilisation dans d'autres applications.

## 1. Architecture Globale

Le système repose sur deux composants principaux :
1.  **Frontend (React)** : Un composant `ContactForm` qui collecte les données et les envoie via une requête HTTP POST.
2.  **Backend (FastAPI)** : Un endpoint API qui reçoit les données et utilise le protocole SMTP pour envoyer l'email à l'administrateur.

---

## 2. Frontend (React + Vite)

### Fichier source : `briac-le-meillat/src/Pages/LandingPage.tsx`

Le formulaire est géré par le composant `ContactForm`.

#### Logique de gestion d'état
Le formulaire utilise `useState` pour suivre les données saisies par l'utilisateur et l'état de l'envoi :
```tsx
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
});
```

#### Envoi des données (`handleSubmit`)
La fonction utilise `fetch` pour envoyer l'objet `formData` au format JSON :
```tsx
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to send message');
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' }); // Reset
        setTimeout(() => setSuccess(false), 5000); // Retour au formulaire après 5s
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        setLoading(false);
    }
};
```

---

## 3. Backend (FastAPI + Python)

### Fichier source : `briac-le-meillat/backend/main.py`

Le backend utilise la bibliothèque standard `smtplib` de Python pour l'envoi d'emails.

#### L'Endpoint API
L'API reçoit la requête POST, appelle la fonction d'aide et renvoie un statut de succès.
```python
@app.post("/api/contact")
def contact_form(req: ContactRequest):
    success = send_contact_email(req.name, req.email, req.message)
    return {"message": "Message reçu", "email_sent": success}
```

#### Logique d'envoi d'email (`send_contact_email`)
Cette fonction configure la session SMTP avec Gmail :
```python
def send_contact_email(name, user_email, message):
    # Charge les variables d'environnement
    SMTP_EMAIL = os.getenv("SMTP_EMAIL")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").replace(" ", "")
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_EMAIL
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"Nouveau message de contact : {name}"
        msg['Reply-To'] = user_email # Permet de répondre directement à l'expéditeur

        body = f"Nom : {name}\nEmail : {user_email}\n\nMessage :\n{message}"
        msg.attach(MIMEText(body, 'plain'))

        # Configuration SMTP Gmail
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls() # Sécurisation de la connexion
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, ADMIN_EMAIL, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Échec de l'envoi de l'email : {e}")
        return False
```

---

## 4. Configuration Requise

### Variables d'environnement (`.env`)
Le projet doit avoir un fichier `.env` contenant les informations suivantes :
```env
SMTP_EMAIL="votre-email@gmail.com"
SMTP_PASSWORD="votre-app-password-gmail"
ADMIN_EMAIL="votre-email-de-reception@gmail.com"
```

> [!IMPORTANT]
> Pour Gmail, le `SMTP_PASSWORD` n'est **PAS** votre mot de passe habituel. Vous devez générer un **"Mot de passe d'application"** (App Password) dans les paramètres de sécurité de votre compte Google après avoir activé la double authentification.

### Dépendances Python (`requirements.txt`)
```text
fastapi
uvicorn
pydantic
python-dotenv
```

---

## 5. Guide de Réutilisation

Pour reprendre ce système dans un autre projet :

1.  **Côté Backend** :
    *   Copiez la fonction `send_contact_email` et l'endpoint `@app.post("/api/contact")`.
    *   Assurez-vous d'avoir configuré les variables d'environnement.
    *   Installez les dépendances (`pip install fastapi uvicorn python-dotenv`).

2.  **Côté Frontend** :
    *   Copiez le composant de formulaire (en adaptant le design si nécessaire).
    *   Utilisez un `fetch` pointant vers l'URL de votre nouvelle API.
    *   Vérifiez que votre backend autorise les requêtes CORS provenant de votre frontend (clé pour le développement local).

3.  **Hébergement** :
    *   Si vous déployez sur Render, Vercel ou Railway, n'oubliez pas de configurer les variables d'environnement dans le panel d'administration.
