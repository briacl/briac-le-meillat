# Système d'Authentification Complet — Documentation Technique

> Fichier de référence pour réutiliser ce système d'authentification dans d'autres projets.  
> Couverture : inscription → vérification email → configuration 2FA (QR Code) → connexion avec 2FA.

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack technique et dépendances](#stack-technique-et-dépendances)
3. [Structure des fichiers](#structure-des-fichiers)
4. [Modèle de données utilisateur](#modèle-de-données-utilisateur)
5. [Variables d'environnement](#variables-denvironnement)
6. [Flux 1 — Inscription (`/api/auth/signup`)](#flux-1--inscription)
7. [Flux 2 — Vérification de l'email (`/api/auth/verify-email`)](#flux-2--vérification-de-lemail)
8. [Flux 3 — Configuration 2FA via QR Code (`/api/auth/setup-2fa`)](#flux-3--configuration-2fa-via-qr-code)
9. [Flux 4 — Validation du code 2FA (`/api/auth/verify-2fa`)](#flux-4--validation-du-code-2fa)
10. [Flux 5 — Connexion (`/api/auth/login`)](#flux-5--connexion)
11. [Flux complet — Reconnexion (utilisateur existant)](#flux-complet--reconnexion)
12. [Gestion des tokens JWT](#gestion-des-tokens-jwt)
13. [Helpers clés — Code Python annoté](#helpers-clés--code-python-annoté)
14. [Côté frontend — AuthContext (React/TypeScript)](#côté-frontend--authcontext-reacttypescript)
15. [Checklist de réutilisation](#checklist-de-réutilisation)

---

## Vue d'ensemble

Le système couvre deux scénarios principaux :

```
INSCRIPTION (nouveau compte)
───────────────────────────
  Formulaire signup
       │
       ▼
  POST /api/auth/signup          → crée le compte (mot de passe hashé bcrypt)
       │                         → génère un code 6 hex et l'envoie par email
       ▼
  Saisie du code reçu par email
       │
       ▼
  POST /api/auth/verify-email    → marque is_email_verified = true
       │
       ▼
  POST /api/auth/setup-2fa       → génère un secret TOTP, retourne un QR Code PNG (base64)
       │
       ▼
  Scan du QR Code avec Google Authenticator (ou compatible)
       │
       ▼
  POST /api/auth/verify-2fa      → confirmation : is_2fa_enabled = true
       │
       ▼
  Compte pleinement opérationnel ✓


CONNEXION (compte existant)
───────────────────────────
  Formulaire login (email + mot de passe)
       │
       ▼
  POST /api/auth/login           → vérifie email/password → retourne JWT si valide
       │
       ▼
  (si is_2fa_enabled = true)
  Saisie du code TOTP depuis l'app d'auth
       │
       ▼
  POST /api/auth/verify-2fa      → vérifie le code TOTP en temps réel
       │
       ▼
  Accès accordé, JWT stocké en localStorage ✓
```

---

## Stack technique et dépendances

### Backend — Python / FastAPI

```
fastapi          → framework API REST
uvicorn          → serveur ASGI
pydantic         → validation des données entrantes
python-dotenv    → chargement du fichier .env
python-jose[cryptography]  → création et vérification des JWT (HS256)
bcrypt           → hachage sécurisé des mots de passe
pyotp            → génération des secrets et codes TOTP (RFC 6238)
qrcode[pil]      → génération des QR Codes en PNG
smtplib          → envoi des emails via SMTP (stdlib Python)
```

Installation :
```bash
pip install fastapi uvicorn pydantic python-dotenv "python-jose[cryptography]" bcrypt pyotp "qrcode[pil]"
```

### Frontend — React / TypeScript (optionnel)

Le système est purement backend. Le frontend utilise `fetch()` standard, aucune lib d'auth spécifique n'est requise.

---

## Structure des fichiers

```
backend/
├── main.py                    ← toute la logique API et d'auth
├── requirements.txt
├── .env                       ← variables secrètes (SMTP, JWT secret, etc.)
└── data/
    ├── users.json             ← base de données utilisateurs (fichier JSON)
    ├── verification_codes.json ← codes email temporaires
    └── reserved_requests.json  ← demandes d'accès réservé (hors auth)
```

> **Note de production :** `users.json` est une base de données fichier (adapté pour un petit projet). Pour une mise à l'échelle, remplacer par PostgreSQL/SQLite avec SQLAlchemy.

---

## Modèle de données utilisateur

Structure JSON d'un utilisateur dans `users.json` :

```json
{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "password": "$2b$12$...",        ← hash bcrypt du mot de passe
    "subscription": "free",          ← "free" | "reserved"
    "is_email_verified": true,       ← false jusqu'à validation du code email
    "is_2fa_enabled": false,         ← false jusqu'à validation du premier code TOTP
    "totp_secret": "JBSWY3DPEHPK3PXP"  ← secret base32, null si 2FA non initiée
}
```

Structure d'un code de vérification dans `verification_codes.json` :

```json
{
    "jean@example.com": {
        "code": "A3F7B2",
        "expires_at": "2024-01-15T10:30:00"  ← expire dans 10 minutes
    }
}
```

---

## Variables d'environnement

Fichier `.env` (backend) :

```env
# Clé secrète pour signer les JWT — CHANGER en production
JWT_SECRET_KEY=une-cle-longue-et-aleatoire-generee-avec-secrets.token_hex(32)

# Compte Gmail pour envoyer les emails
SMTP_EMAIL=ton.email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx   ← "App Password" Google (pas le vrai mdp)

# Email de l'administrateur (reçoit les notifications)
ADMIN_EMAIL=admin@example.com

# Activer/désactiver les features (utile pour le dev)
ENABLE_EMAIL_VERIFICATION=true
ENABLE_2FA=true
```

> **Gmail App Password :** Dans les paramètres Google → Sécurité → Authentification 2 facteurs → Mots de passe des applications.

---

## Flux 1 — Inscription

### Route : `POST /api/auth/signup`

**Payload :**
```json
{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "password": "MonMotDePasseSécurisé"
}
```

**Ce que fait le backend :**

```python
@app.post("/api/auth/signup")
def signup(user: UserSignup):
    users = load_users()

    # 1. Vérifie que l'email n'est pas déjà enregistré
    if any(u.get("email") == user.email for u in users):
        raise HTTPException(status_code=400, detail="Email déjà enregistré")

    # 2. Crée le nouveau compte
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),  # bcrypt hash (voir ci-dessous)
        "subscription": "free",
        "is_email_verified": not ENABLE_EMAIL_VERIFICATION,  # false si vérif activée
        "is_2fa_enabled": False,
        "totp_secret": None
    }
    users.append(new_user)
    save_users(users)

    # 3. Génère un code de vérification à 6 caractères hexadécimaux
    verification_code = secrets.token_hex(3).upper()  # ex: "A3F7B2"

    # 4. Stocke le code avec une expiration de 10 minutes
    codes = load_verification_codes()
    codes[user.email] = {
        "code": verification_code,
        "expires_at": (datetime.now() + timedelta(minutes=10)).isoformat()
    }
    save_verification_codes(codes)

    # 5. Envoie le code par email
    if ENABLE_EMAIL_VERIFICATION:
        send_verification_email(user.email, verification_code)

    return {"message": "Compte créé. Veuillez vérifier votre email."}
```

**Hashage du mot de passe avec bcrypt :**

```python
def hash_password(password: str) -> str:
    # bcrypt génère automatiquement un salt unique, le résultat contient le salt
    # Exemple de sortie : "$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # bcrypt extrait le salt du hash pour recomparer
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
```

**Envoi de l'email de validation :**

```python
def send_verification_email(to_email, code):
    msg = MIMEMultipart()
    msg['From'] = SMTP_EMAIL
    msg['To'] = to_email
    msg['Subject'] = "Your Verification Code"
    msg.attach(MIMEText(f"Your verification code is: {code}", 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()                         # chiffrement TLS
    server.login(SMTP_EMAIL, SMTP_PASSWORD)   # auth SMTP
    server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
    server.quit()
```

**Réponse backend :**
```json
{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "subscription": "free",
    "message": "Compte créé. Veuillez vérifier votre email.",
    "email_sent": true
}
```

---

## Flux 2 — Vérification de l'email

### Route : `POST /api/auth/verify-email`

L'utilisateur saisit le code reçu par email (6 caractères).

**Payload :**
```json
{
    "email": "jean@example.com",
    "code": "A3F7B2"
}
```

**Ce que fait le backend :**

```python
@app.post("/api/auth/verify-email")
def verify_email(req: VerifyCodeRequest):
    codes = load_verification_codes()

    # 1. Vérifie que le code existe pour cet email
    if req.email not in codes:
        raise HTTPException(status_code=400, detail="Aucun code de vérification trouvé")

    stored_data = codes[req.email]

    # 2. Compare les codes
    if stored_data["code"] != req.code:
        raise HTTPException(status_code=400, detail="Code invalide")

    # 3. Vérifie que le code n'a pas expiré (10 minutes)
    if datetime.fromisoformat(stored_data["expires_at"]) < datetime.now():
        del codes[req.email]
        save_verification_codes(codes)
        raise HTTPException(status_code=400, detail="Code expiré")

    # 4. Marque l'utilisateur comme vérifié
    users = load_users()
    for u in users:
        if u["email"] == req.email:
            u["is_email_verified"] = True
            save_users(users)
            break

    # 5. Supprime le code utilisé
    del codes[req.email]
    save_verification_codes(codes)

    return {"message": "Email vérifié avec succès"}
```

---

## Flux 3 — Configuration 2FA via QR Code

### Route : `POST /api/auth/setup-2fa`

Appelée juste après la vérification email. Génère un secret TOTP et un QR Code.

**Payload :**
```json
{
    "email": "jean@example.com"
}
```

**Ce que fait le backend :**

```python
def generate_totp_secret():
    # Génère une clé base32 aléatoire de 160 bits (standard RFC 4648)
    # Exemple : "JBSWY3DPEHPK3PXP"
    return pyotp.random_base32()

def generate_qr_code(secret, email):
    totp = pyotp.TOTP(secret)
    
    # Uri au format otpauth:// → reconnu par Google Authenticator, Authy, etc.
    # Format : otpauth://totp/BriacLeMeillatApp:jean@example.com?secret=XXX&issuer=BriacLeMeillatApp
    uri = totp.provisioning_uri(name=email, issuer_name="BriacLeMeillatApp")
    
    # Génération du QR Code en mémoire (pas de fichier disque)
    img = qrcode.make(uri)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    
    # Encodage en base64 pour transmission JSON
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


@app.post("/api/auth/setup-2fa")
def setup_2fa(req: Setup2FARequest):
    users = load_users()
    user = next((u for u in users if u["email"] == req.email), None)

    # Génère un secret seulement si l'utilisateur n'en a pas déjà un
    # (idempotent : rappeler setup-2fa ne régénère pas un nouveau secret)
    if not user.get("totp_secret"):
        user["totp_secret"] = generate_totp_secret()
        save_users(users)

    qr_code_base64 = generate_qr_code(user["totp_secret"], user["email"])
    
    return {
        "qr_code": qr_code_base64,   ← image PNG encodée en base64
        "secret": user["totp_secret"] ← secret manuel si l'app ne peut pas scanner
    }
```

**Affichage du QR Code côté frontend :**
```tsx
// Le backend retourne qr_code = "iVBORw0KGgoAAAANSUhEUgAA..."
<img src={`data:image/png;base64,${qrCode}`} alt="QR Code 2FA" />
```

**Comment fonctionne le TOTP (RFC 6238) :**

```
Secret partagé (stocké en BDD) ←──────────────────────────── Même secret dans l'app mobile
         │                                                              │
         ▼                                                              ▼
TOTP = HOTP(secret, floor(timestamp_unix / 30))              Même calcul, même moment
         │                                                              │
         ▼                                                              ▼
         "482931"  ══════════ comparaison côté serveur ══════════ "482931" ✓

→ Le code change toutes les 30 secondes
→ Le serveur accepte aussi le code précédent et suivant (window=1) pour les décalages d'horloge
```

---

## Flux 4 — Validation du code 2FA

### Route : `POST /api/auth/verify-2fa`

Utilisée dans deux contextes :
1. **Lors de l'inscription** : activation de la 2FA (premier scan du QR code)
2. **Lors de la connexion** : vérification du code TOTP

**Payload :**
```json
{
    "email": "jean@example.com",
    "code": "482931"
}
```

**Ce que fait le backend :**

```python
@app.post("/api/auth/verify-2fa")
def verify_2fa(req: Verify2FARequest):
    users = load_users()
    user = next((u for u in users if u["email"] == req.email), None)

    if not user.get("totp_secret"):
        raise HTTPException(status_code=400, detail="2FA non configuré")

    totp = pyotp.TOTP(user["totp_secret"])
    
    # totp.verify() accepte le code actuel ± 1 intervalle de 30s (tolérance horloge)
    if totp.verify(req.code):
        user["is_2fa_enabled"] = True  # activée dès la première validation réussie
        save_users(users)
        return {"message": "2FA vérifié et activé"}
    else:
        raise HTTPException(status_code=400, detail="Code 2FA invalide")
```

---

## Flux 5 — Connexion

### Route : `POST /api/auth/login`

**Payload :**
```json
{
    "email": "jean@example.com",
    "password": "MonMotDePasseSécurisé"
}
```

**Ce que fait le backend :**

```python
@app.post("/api/auth/login")
def login(user: UserLogin):
    users = load_users()
    for u in users:
        if u["email"] == user.email:
            password_field = u.get("password", "")
            is_valid = False

            if password_field.startswith("$2b$") or password_field.startswith("$2a$"):
                # Mot de passe haché avec bcrypt → vérification normale
                is_valid = verify_password(user.password, password_field)
            else:
                # Ancien mot de passe en clair (migration) → valide ET rehache
                if password_field == user.password:
                    is_valid = True
                    u["password"] = hash_password(user.password)  # migration transparente
                    save_users(users)

            if is_valid:
                # Construction du payload JWT
                token_data = {
                    "sub": u["email"],                           # sujet standard JWT
                    "name": u["name"],
                    "subscription": u.get("subscription", "free"),
                    "is_email_verified": u.get("is_email_verified", False),
                    "is_2fa_enabled": u.get("is_2fa_enabled", False),
                }
                token = create_access_token(token_data)  # valide 7 jours
                
                return {
                    "token": token,
                    "name": u["name"],
                    "email": u["email"],
                    "subscription": u.get("subscription", "free"),
                    "is_email_verified": u.get("is_email_verified", False),
                    "is_2fa_enabled": u.get("is_2fa_enabled", False),
                }

    raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")
```

**Réponse si tout est valide :**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "subscription": "free",
    "is_email_verified": true,
    "is_2fa_enabled": true
}
```

**Côté frontend — logique de redirection après login :**

```typescript
// AuthContext.tsx
const login = async (email, password) => {
    const data = await fetch(`${API_URL}/auth/login`, {...}).then(r => r.json());
    
    // Stocke le JWT pour persistence entre rechargements
    localStorage.setItem('auth_token', data.token);
    
    setUser({
        name: data.name,
        email: data.email,
        subscription: data.subscription,
        is_email_verified: data.is_email_verified,
        is_2fa_enabled: data.is_2fa_enabled,
    });
    
    // Le composant Login vérifie is_2fa_enabled pour demander le code TOTP
    // Si is_2fa_enabled = true → affiche un input "Code d'authentification"
    // puis appelle verify2FA(email, code)
};
```

---

## Flux complet — Reconnexion

Quand l'utilisateur revient sur le site (rechargement ou re-visite) :

```typescript
// Au montage de AuthProvider (useEffect initial)
const token = localStorage.getItem('auth_token');
if (token) {
    // Valide le token auprès du backend
    fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(userData => setUser(userData))  // session restaurée !
    .catch(() => {
        localStorage.removeItem('auth_token');  // token expiré → déconnexion propre
        setUser(null);
    });
}
```

### Route : `GET /api/auth/me` (route protégée par JWT)

```python
@app.get("/api/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "name": current_user.get("name"),
        "email": current_user.get("sub"),       # "sub" = email dans le JWT
        "subscription": current_user.get("subscription", "free"),
        "is_email_verified": current_user.get("is_email_verified", False),
        "is_2fa_enabled": current_user.get("is_2fa_enabled", False),
    }
```

---

## Gestion des tokens JWT

### Création

```python
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 jours

def create_access_token(data: dict, expires_delta=None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})  # claim d'expiration standard JWT
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

### Vérification (dépendance FastAPI)

```python
security = HTTPBearer()  # extrait le Bearer token du header Authorization

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Token invalide")
    return payload

# Utilisation dans une route protégée :
@app.get("/api/protected-route")
def protected(current_user: dict = Depends(get_current_user)):
    return {"email": current_user["sub"]}
```

**Structure d'un JWT décodé :**
```json
{
    "sub": "jean@example.com",
    "name": "Jean Dupont",
    "subscription": "free",
    "is_email_verified": true,
    "is_2fa_enabled": true,
    "exp": 1737590400
}
```

---

## Helpers clés — Code Python annoté

### Changement de nom de l'issuer TOTP

Pour réutiliser dans un autre projet, changer le `issuer_name` :

```python
def generate_qr_code(secret, email):
    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(
        name=email,
        issuer_name="MonNouveauProjet"  # ← personnaliser ici
    )
    # ...
```

Ce nom apparaît dans l'app Google Authenticator comme label du compte.

### Configuration CORS (à adapter selon ton domaine)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://ton-domaine.fr"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Chargement flexible du .env

```python
backend_env = os.path.join(os.path.dirname(__file__), ".env")
root_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")

if os.path.exists(backend_env):
    load_dotenv(backend_env, override=True)
elif os.path.exists(root_env):
    load_dotenv(root_env, override=True)
else:
    load_dotenv(override=True)
```

---

## Côté frontend — AuthContext (React/TypeScript)

Le contexte React encapsule toutes les interactions API et expose un état global d'authentification.

### Points importants

| Propriété / méthode | Type | Description |
|---|---|---|
| `user` | `User \| null` | Objet utilisateur connecté, `null` si déconnecté |
| `isAuthenticated` | `boolean` | `!!user` |
| `isLoading` | `boolean` | `true` pendant la vérification du JWT au démarrage |
| `hasAccessToReserved` | `boolean` | `user.subscription === 'reserved'` |
| `authConfig.enable_2fa` | `boolean` | Lu depuis `/api/config`, permet de désactiver la 2FA côté backend |
| `login(email, password)` | `Promise<void>` | Login + stockage JWT |
| `signup(name, email, password)` | `Promise<void>` | Inscription |
| `verifyEmail(email, code)` | `Promise<void>` | Validation code email |
| `setup2FA(email)` | `Promise<{qr_code, secret}>` | Obtenir le QR Code |
| `verify2FA(email, code)` | `Promise<void>` | Valider le code TOTP |
| `logout()` | `void` | Supprime token + reset état |

### Utilisation dans un composant

```tsx
import { useAuth } from './Contexts/AuthContext';

function LoginPage() {
    const { login, user, isAuthenticated } = useAuth();
    
    const handleLogin = async () => {
        try {
            await login(email, password);
            // Si is_2fa_enabled, afficher un step de verification TOTP
            if (user?.is_2fa_enabled) {
                setStep('verify-2fa');
            }
        } catch (err) {
            setError(err.message);
        }
    };
}
```

---

## Checklist de réutilisation

Pour adapter ce système à un autre projet :

- [ ] **Copier `main.py`** et adapter les constantes : `ACCESS_TOKEN_EXPIRE_MINUTES`, `issuer_name` du QR code
- [ ] **Créer le `.env`** avec `JWT_SECRET_KEY`, `SMTP_EMAIL`, `SMTP_PASSWORD`, `ADMIN_EMAIL`
- [ ] **Créer `backend/data/`** avec des fichiers JSON vides (`users.json = []`, `verification_codes.json = {}`)
- [ ] **Adapter le CORS** : `allow_origins` avec les domaines autorisés
- [ ] **Adapter l'`issuer_name`** dans `generate_qr_code()` au nom du nouveau projet
- [ ] **Côté frontend** : copier `AuthContext.tsx`, adapter `VITE_API_URL` dans `.env.local`
- [ ] **Sécurité production** :
  - [ ] Utiliser une `JWT_SECRET_KEY` générée avec `secrets.token_hex(32)`
  - [ ] Passer à une vraie BDD (PostgreSQL + SQLAlchemy) à la place des fichiers JSON
  - [ ] Ajouter un rate-limiting sur les routes `/api/auth/*` (ex: `slowapi`)
  - [ ] Protéger les routes admin par un vrai champ `is_admin` vérifié dans le JWT

---

*Documentation générée à partir du code source — `backend/main.py` (632 lignes) et `src/Contexts/AuthContext.tsx` (270 lignes)*
