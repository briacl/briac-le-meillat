from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
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

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "users.json")
VERIFICATION_FILE = os.path.join(os.path.dirname(__file__), "data", "verification_codes.json")

# Configuration
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
ENABLE_EMAIL_VERIFICATION = os.getenv("ENABLE_EMAIL_VERIFICATION", "true").lower() == "true"
ENABLE_2FA = os.getenv("ENABLE_2FA", "true").lower() == "true"


# Pydantic models
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
        text = msg.as_string()
        server.sendmail(SMTP_EMAIL, to_email, text)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
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
        if u["email"] == user.email and u["password"] == user.password:
            return {
                "name": u["name"],
                "email": u["email"],
                "subscription": u.get("subscription", "free")
            }
    raise HTTPException(status_code=401, detail="Invalid email or password")

@app.post("/api/auth/signup")
def signup(user: UserSignup):
    users = load_users()
    if any(u.get("email") == user.email for u in users):
        raise HTTPException(status_code=400, detail="Email already registered")
    

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": user.password, # Note: In production, hash this!
        "subscription": "free",
        "subscription": "free",
        "is_email_verified": not ENABLE_EMAIL_VERIFICATION, # Auto-verify if disabled
        "is_2fa_enabled": False,
        "totp_secret": None
    }
    users.append(new_user)
    save_users(users)
    
    # Handle Email Verification
    verification_code = secrets.token_hex(3).upper() # 6 chars
    codes = load_verification_codes()
    codes[user.email] = {
        "code": verification_code,
        "expires_at": (datetime.now() + timedelta(minutes=10)).isoformat()
    }
    save_verification_codes(codes)
    
    save_verification_codes(codes)
    
    email_sent = False
    if ENABLE_EMAIL_VERIFICATION:
        email_sent = send_verification_email(user.email, verification_code)
    
    return {
        "name": new_user["name"],
        "email": new_user["email"],
        "subscription": new_user["subscription"],
        "message": "User created. Please verify your email.",
        "email_sent": email_sent
    }

@app.post("/api/auth/verify-email")
def verify_email(req: VerifyCodeRequest):
    codes = load_verification_codes()
    if req.email not in codes:
        raise HTTPException(status_code=400, detail="No verification code found")
        
    stored_data = codes[req.email]
    if stored_data["code"] != req.code:
        raise HTTPException(status_code=400, detail="Invalid code")
        
    if datetime.fromisoformat(stored_data["expires_at"]) < datetime.now():
        del codes[req.email]
        save_verification_codes(codes)
        raise HTTPException(status_code=400, detail="Code expired")
        
    # Mark user as verified
    users = load_users()
    for u in users:
        if u["email"] == req.email:
            u["is_email_verified"] = True
            save_users(users)
            break
            
    # Clean up code
    del codes[req.email]
    save_verification_codes(codes)
    
    return {"message": "Email verified successfully"}

@app.post("/api/auth/setup-2fa")
def setup_2fa(req: Setup2FARequest):
    users = load_users()
    user = next((u for u in users if u["email"] == req.email), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not user.get("totp_secret"):
        user["totp_secret"] = generate_totp_secret()
        save_users(users)
        
    qr_code_base64 = generate_qr_code(user["totp_secret"], user["email"])
    return {
        "qr_code": qr_code_base64,
        "secret": user["totp_secret"] # Optional: strictly for manual entry if QR fails
    }

@app.post("/api/auth/verify-2fa")
def verify_2fa(req: Verify2FARequest):
    users = load_users()
    user = next((u for u in users if u["email"] == req.email), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not user.get("totp_secret"):
        raise HTTPException(status_code=400, detail="2FA not set up")
        
    totp = pyotp.TOTP(user["totp_secret"])
    if totp.verify(req.code):
        user["is_2fa_enabled"] = True
        save_users(users)
        return {"message": "2FA verified and enabled"}
    else:
        raise HTTPException(status_code=400, detail="Invalid 2FA code")


@app.post("/api/subscribe")
def subscribe(req: SubscribeRequest):
    users = load_users()
    user_found = False
    updated_user = None
    
    for u in users:
        if u["email"] == req.email:
            u["subscription"] = "reserved"
            user_found = True
            updated_user = u
            break
            
    if not user_found:
        raise HTTPException(status_code=404, detail="User not found")
        
    save_users(users)
    return {
        "name": updated_user["name"],
        "email": updated_user["email"],
        "subscription": updated_user["subscription"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
