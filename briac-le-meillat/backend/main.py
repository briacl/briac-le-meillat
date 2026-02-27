from fastapi import FastAPI, HTTPException, Body, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import json
import os
from typing import List, Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
from datetime import datetime, timedelta
import qrcode
import pyotp
import io
import base64
from dotenv import load_dotenv
from jose import JWTError, jwt
import bcrypt

# Flexibly load .env from backend/ or root
backend_env = os.path.join(os.path.dirname(__file__), ".env")
root_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")

if os.path.exists(backend_env):
    load_dotenv(backend_env, override=True)
elif os.path.exists(root_env):
    load_dotenv(root_env, override=True)
else:
    load_dotenv(override=True)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── JWT Configuration ────────────────────────────────────────────────────────
# La SECRET_KEY est utilisée pour signer les tokens JWT.
# En production, remplace-la par une valeur longue et aléatoire stockée en .env
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-this-in-production-use-a-long-random-string")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 jours

# ─── Bearer token extractor ───────────────────────────────────────────────────
security = HTTPBearer()

# ─── Fichiers de données ──────────────────────────────────────────────────────
DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "users.json")
VERIFICATION_FILE = os.path.join(os.path.dirname(__file__), "data", "verification_codes.json")
REQUESTS_FILE = os.path.join(os.path.dirname(__file__), "data", "reserved_requests.json")

# ─── Configuration ────────────────────────────────────────────────────────────
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").replace(" ", "")
ENABLE_EMAIL_VERIFICATION = os.getenv("ENABLE_EMAIL_VERIFICATION", "true").lower() == "true"
ENABLE_2FA = os.getenv("ENABLE_2FA", "true").lower() == "true"
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "briac.le.meillat@gmail.com")


# ─── Pydantic models ──────────────────────────────────────────────────────────
class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    name: str
    email: str
    subscription: str

class SubscribeRequest(BaseModel):
    email: str

class VerificationRequest(BaseModel):
    email: str

class VerifyCodeRequest(BaseModel):
    email: str
    code: str

class Setup2FARequest(BaseModel):
    email: str

class Verify2FARequest(BaseModel):
    email: str
    code: str

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

class ReservedAccessRequest(BaseModel):
    name: str
    email: str
    message: Optional[str] = ""

class AdminRequestAction(BaseModel):
    email: str


# ─── Helpers fichiers ─────────────────────────────────────────────────────────
def load_users():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_users(users):
    with open(DATA_FILE, "w") as f:
        json.dump(users, f, indent=4)
# ─── Helpers demandes d'accès ─────────────────────────────────────────────────
def load_requests():
    if not os.path.exists(REQUESTS_FILE):
        return []
    with open(REQUESTS_FILE, "r") as f:
        return json.load(f)

def save_requests(requests):
    with open(REQUESTS_FILE, "w") as f:
        json.dump(requests, f, indent=2)
def load_verification_codes():
    if not os.path.exists(VERIFICATION_FILE):
        return {}
    with open(VERIFICATION_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

def save_verification_codes(codes):
    with open(VERIFICATION_FILE, "w") as f:
        json.dump(codes, f, indent=4)


# ─── JWT helpers ──────────────────────────────────────────────────────────────
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crée un JWT signé contenant les données utilisateur."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    """Décode et vérifie un JWT. Lève une HTTPException si invalide."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dépendance FastAPI : extrait et valide le Bearer token pour les routes protégées."""
    payload = decode_token(credentials.credentials)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Token invalide")
    return payload


# ─── Password helpers ─────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    """Hash un mot de passe avec bcrypt (compatible 4.x et 5.x)."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie un mot de passe contre son hash bcrypt."""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


# ─── Email helpers ────────────────────────────────────────────────────────────
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

def send_contact_email(name, user_email, message):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("SMTP credentials not set. Skipping contact email.")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_EMAIL
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"Nouveau message de contact : {name}"
        msg['Reply-To'] = user_email

        body = f"""
Nouveau message via le formulaire de contact :

Nom : {name}
Email : {user_email}

Message :
{message}
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, ADMIN_EMAIL, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send contact email: {e}")
        return False


def generate_totp_secret():
    return pyotp.random_base32()

def generate_qr_code(secret, email):
    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(name=email, issuer_name="BriacLeMeillatApp")
    img = qrcode.make(uri)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"message": "Briac Le Meillat API is running"}

@app.get("/api/config")
def get_config():
    return {
        "enable_email_verification": ENABLE_EMAIL_VERIFICATION,
        "enable_2fa": ENABLE_2FA
    }


@app.post("/api/auth/login")
def login(user: UserLogin):
    users = load_users()
    for u in users:
        if u["email"] == user.email:
            # Vérification du mot de passe : supporte les anciens mots de passe en clair
            # et les nouveaux hachés avec bcrypt
            password_field = u.get("password", "")
            is_valid = False

            if password_field.startswith("$2b$") or password_field.startswith("$2a$"):
                # Mot de passe déjà haché avec bcrypt
                is_valid = verify_password(user.password, password_field)
            else:
                # Ancien mot de passe en clair → on valide ET on migre au hash
                if password_field == user.password:
                    is_valid = True
                    u["password"] = hash_password(user.password)
                    save_users(users)

            if is_valid:
                token_data = {
                    "sub": u["email"],
                    "name": u["name"],
                    "subscription": u.get("subscription", "free"),
                    "is_email_verified": u.get("is_email_verified", False),
                    "is_2fa_enabled": u.get("is_2fa_enabled", False),
                }
                token = create_access_token(token_data)
                return {
                    "token": token,
                    "name": u["name"],
                    "email": u["email"],
                    "subscription": u.get("subscription", "free"),
                    "is_email_verified": u.get("is_email_verified", False),
                    "is_2fa_enabled": u.get("is_2fa_enabled", False),
                }

    raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")


@app.get("/api/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """
    Route protégée : retourne les infos de l'utilisateur connecté depuis son JWT.
    Utilisée par le frontend au démarrage pour restaurer la session.
    """
    return {
        "name": current_user.get("name"),
        "email": current_user.get("sub"),
        "subscription": current_user.get("subscription", "free"),
        "is_email_verified": current_user.get("is_email_verified", False),
        "is_2fa_enabled": current_user.get("is_2fa_enabled", False),
    }


@app.post("/api/auth/signup")
def signup(user: UserSignup):
    users = load_users()
    if any(u.get("email") == user.email for u in users):
        raise HTTPException(status_code=400, detail="Email déjà enregistré")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),  # Stockage sécurisé avec bcrypt
        "subscription": "free",
        "is_email_verified": not ENABLE_EMAIL_VERIFICATION,
        "is_2fa_enabled": False,
        "totp_secret": None
    }
    users.append(new_user)
    save_users(users)

    # Gestion vérification email
    verification_code = secrets.token_hex(3).upper()
    codes = load_verification_codes()
    codes[user.email] = {
        "code": verification_code,
        "expires_at": (datetime.now() + timedelta(minutes=10)).isoformat()
    }
    save_verification_codes(codes)

    email_sent = False
    if ENABLE_EMAIL_VERIFICATION:
        email_sent = send_verification_email(user.email, verification_code)

    return {
        "name": new_user["name"],
        "email": new_user["email"],
        "subscription": new_user["subscription"],
        "message": "Compte créé. Veuillez vérifier votre email.",
        "email_sent": email_sent
    }


@app.post("/api/auth/verify-email")
def verify_email(req: VerifyCodeRequest):
    codes = load_verification_codes()
    if req.email not in codes:
        raise HTTPException(status_code=400, detail="Aucun code de vérification trouvé")

    stored_data = codes[req.email]
    if stored_data["code"] != req.code:
        raise HTTPException(status_code=400, detail="Code invalide")

    if datetime.fromisoformat(stored_data["expires_at"]) < datetime.now():
        del codes[req.email]
        save_verification_codes(codes)
        raise HTTPException(status_code=400, detail="Code expiré")

    users = load_users()
    for u in users:
        if u["email"] == req.email:
            u["is_email_verified"] = True
            save_users(users)
            break

    del codes[req.email]
    save_verification_codes(codes)

    return {"message": "Email vérifié avec succès"}


@app.post("/api/auth/setup-2fa")
def setup_2fa(req: Setup2FARequest):
    users = load_users()
    user = next((u for u in users if u["email"] == req.email), None)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    if not user.get("totp_secret"):
        user["totp_secret"] = generate_totp_secret()
        save_users(users)

    qr_code_base64 = generate_qr_code(user["totp_secret"], user["email"])
    return {
        "qr_code": qr_code_base64,
        "secret": user["totp_secret"]
    }


@app.post("/api/auth/verify-2fa")
def verify_2fa(req: Verify2FARequest):
    users = load_users()
    user = next((u for u in users if u["email"] == req.email), None)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    if not user.get("totp_secret"):
        raise HTTPException(status_code=400, detail="2FA non configuré")

    totp = pyotp.TOTP(user["totp_secret"])
    if totp.verify(req.code):
        user["is_2fa_enabled"] = True
        save_users(users)
        return {"message": "2FA vérifié et activé"}
    else:
        raise HTTPException(status_code=400, detail="Code 2FA invalide")


@app.post("/api/subscribe")
def subscribe(req: SubscribeRequest):
    users = load_users()
    for u in users:
        if u["email"] == req.email:
            u["subscription"] = "reserved"
            save_users(users)
            return {
                "name": u["name"],
                "email": u["email"],
                "subscription": u["subscription"]
            }

    raise HTTPException(status_code=404, detail="Utilisateur introuvable")


@app.post("/api/contact")
def contact_form(req: ContactRequest):
    success = send_contact_email(req.name, req.email, req.message)
    if not success:
        print(f"Failed to send email from {req.email}")
    return {"message": "Message reçu", "email_sent": success}


# ─── Reserved Access Endpoints ────────────────────────────────────────────────
@app.post("/api/reserved/request")
def request_reserved_access(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Verify user authentication
    user_data = decode_token(credentials.credentials)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    
    user_email = user_data["sub"]  # JWT standard: email is stored in "sub" field
    users = load_users() 
    user = next((u for u in users if u["email"] == user_email), None)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
        
    # Check if user already has reserved access
    if user.get("subscription") == "reserved":
        raise HTTPException(status_code=400, detail="Vous avez déjà accès au contenu reserved")
    
    # Check if request already exists
    requests = load_requests()
    existing_request = next((r for r in requests if r["email"] == user_email), None)
    if existing_request:
        if existing_request["status"] == "pending":
            raise HTTPException(status_code=400, detail="Demande déjà en attente")
        elif existing_request["status"] == "rejected":
            existing_request["status"] = "pending"
            existing_request["date"] = datetime.now().isoformat()
            save_requests(requests)
        else:
            raise HTTPException(status_code=400, detail="Demande déjà traitée")
    else:
        # Create new request
        new_request = {
            "name": user["name"],
            "email": user_email,
            "date": datetime.now().isoformat(),
            "status": "pending"
        }
        requests.append(new_request)
        save_requests(requests)
    
    # Send admin notification email
    try:
        if SMTP_EMAIL and SMTP_PASSWORD:
            smtp = smtplib.SMTP("smtp.gmail.com", 587)
            smtp.starttls()
            smtp.login(SMTP_EMAIL, SMTP_PASSWORD)
            
            msg = MIMEMultipart()
            msg["From"] = SMTP_EMAIL
            msg["To"] = ADMIN_EMAIL
            msg["Subject"] = "Nouvelle demande d'accès Reserved"
            
            body = f"""
Nouvelle demande d'accès au contenu Reserved :

Nom : {user['name']}
Email : {user_email}
Date : {datetime.now().strftime('%d/%m/%Y à %H:%M')}

Vous pouvez approuver ou rejeter cette demande depuis le panel d'administration.
            """
            
            msg.attach(MIMEText(body, "plain"))
            smtp.sendmail(SMTP_EMAIL, ADMIN_EMAIL, msg.as_string())
            smtp.quit()
            email_sent = True
        else:
            print("SMTP not configured, admin notification not sent")
            email_sent = False
    except Exception as e:
        print(f"Failed to send admin notification: {e}")
        email_sent = False
    
    return {"message": "Demande d'accès envoyée", "email_sent": email_sent}


@app.get("/api/admin/requests")
def get_access_requests():
    # Simple admin check - in production, use proper role-based authentication
    requests = load_requests()
    return requests


@app.post("/api/admin/requests/{email}/approve")
def approve_access_request(email: str):
    # Simple admin check - in production, use proper role-based authentication
    
    # Update user subscription
    users = load_users()
    user = next((u for u in users if u["email"] == email), None)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    
    user["subscription"] = "reserved"
    save_users(users)
    
    # Update request status
    requests = load_requests()
    request = next((r for r in requests if r["email"] == email), None)
    if request:
        request["status"] = "approved"
        request["processed_date"] = datetime.now().isoformat()
        save_requests(requests)
    
    # Send approval notification email to user
    email_sent = False
    try:
        if SMTP_EMAIL and SMTP_PASSWORD:
            smtp = smtplib.SMTP("smtp.gmail.com", 587)
            smtp.starttls()
            smtp.login(SMTP_EMAIL, SMTP_PASSWORD)
            
            msg = MIMEMultipart()
            msg["From"] = SMTP_EMAIL
            msg["To"] = email
            msg["Subject"] = "Votre accès Reserved a été approuvé !"
            
            body = f"""
Bonjour {user['name']},

Excellente nouvelle ! Votre demande d'accès au contenu Reserved a été approuvée.

Vous pouvez maintenant accéder à :
- La section "Textes" 
- La section "Réalisations"
- L'ensemble du contenu exclusif

Connectez-vous sur le site pour découvrir ces nouveaux contenus.

Cordialement,
L'équipe Briac Le Meillat
            """
            
            msg.attach(MIMEText(body, "plain"))
            smtp.sendmail(SMTP_EMAIL, email, msg.as_string())
            smtp.quit()
            email_sent = True
        else:
            print("SMTP not configured, user approval notification not sent")
            email_sent = False
    except Exception as e:
        print(f"Failed to send user approval notification: {e}")
        email_sent = False
    
    return {
        "message": "Demande approuvée", 
        "user": {"name": user["name"], "email": user["email"], "subscription": user["subscription"]},
        "email_sent": email_sent
    }


@app.post("/api/admin/requests/{email}/reject")
def reject_access_request(email: str):
    # Simple admin check - in production, use proper role-based authentication
    
    requests = load_requests()
    request = next((r for r in requests if r["email"] == email), None)
    if not request:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    
    request["status"] = "rejected"
    request["processed_date"] = datetime.now().isoformat()
    save_requests(requests)
    
    return {"message": "Demande rejetée"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
