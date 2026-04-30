# Documentation Technique : Système d'Envoi d'e-mails (Local)

Ce document détaille le fonctionnement, la configuration et l'implémentation technique du système d'envoi d'e-mails intégré au backend FastAPI du projet.

## 1. Architecture et Stack Technique

Le système utilise la bibliothèque standard Python `smtplib` et `email.mime`. 

### Initialisation et Imports
Voici les dépendances et la configuration de base extraites de `backend/main.py` :

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Chargement des variables d'environnement
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").replace(" ", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "briac.le.meillat@gmail.com")
ENABLE_EMAIL_VERIFICATION = os.getenv("ENABLE_EMAIL_VERIFICATION", "true").lower() == "true"
```

---

## 2. Configuration SMTP (GMail)

Le backend est configuré pour utiliser les serveurs SMTP de GMail sur le port 587 avec TLS.

```python
def send_email_template(to_email, subject, body):
    # Logique simplifiée de connexion
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()  # Sécurisation de la connexion
    server.login(SMTP_EMAIL, SMTP_PASSWORD)
    # ... envoi ...
    server.quit()
```

---

## 3. Implémentation des Fonctions

### A. Vérification de compte (`send_verification_email`)
Cette fonction envoie un code à 6 caractères lors du signup. Elle gère également le mode "développement" où l'envoi est désactivé.

```python
def send_verification_email(to_email, code):
    if not ENABLE_EMAIL_VERIFICATION:
        print(f"Email verification disabled. Code for {to_email}: {code}")
        return True

    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("SMTP credentials not set. Skipping email sending.")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_EMAIL
        msg['To'] = to_email
        msg['Subject'] = "Your Verification Code"

        body = f"Your verification code is: {code}"
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
```

### B. Formulaire de Contact (`send_contact_email`)
Envoie un e-mail à l'administrateur avec un champ `Reply-To` pour faciliter la réponse.

```python
def send_contact_email(name, user_email, message):
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_EMAIL
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"Nouveau message de contact : {name}"
        msg['Reply-To'] = user_email # Permet de répondre directement à l'expéditeur

        body = f"Nom : {name}\nEmail : {user_email}\n\nMessage :\n{message}"
        msg.attach(MIMEText(body, 'plain'))

        # ... connexion SMTP et envoi ...
        return True
    except Exception as e:
        print(f"Failed to send contact email: {e}")
        return False
```

### C. Système de Notifications "Reserved"
Le système notifie l'administrateur lors d'une demande, puis l'utilisateur lors de l'approbation.

**Notification Admin :**
```python
# Extrait de request_reserved_access
msg["Subject"] = "Nouvelle demande d'accès Reserved"
body = f"Nouvelle demande d'accès...\nNom : {user['name']}\nEmail : {user_email}"
# ... envoi à ADMIN_EMAIL ...
```

**Notification Utilisateur (Approbation) :**
```python
# Extrait de approve_access_request
msg["Subject"] = "Votre accès Reserved a été approuvé !"
body = f"Bonjour {user['name']},\n\nExcellente nouvelle ! Votre demande d'accès... a été approuvée."
# ... envoi à l'e-mail de l'utilisateur ...
```

---

## 4. Diagnostics et Sécurité

1. **Nettoyage du mot de passe** : Le code exécute `.replace(" ", "")` sur `SMTP_PASSWORD` pour éviter les erreurs de copier-coller depuis GMail (qui affiche les mots de passe d'application avec des espaces).
2. **Fallback Local** : Si les credentials sont absents, le système ne crash pas mais log l'erreur ou affiche le code dans le terminal.
3. **MIME Multi-part** : Bien que les mails soient actuellement en `plain text`, la structure `MIMEMultipart` permet une future transition facile vers du HTML.
