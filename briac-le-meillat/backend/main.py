from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from typing import List, Optional

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

@app.get("/")
def read_root():
    return {"message": "Briac Le Meillat API is running"}

@app.post("/api/login")
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

@app.post("/api/signup")
def signup(user: UserSignup):
    users = load_users()
    if any(u["email"] == user.email for u in users):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": user.password, # Note: In production, hash this!
        "subscription": "free"
    }
    users.append(new_user)
    save_users(users)
    
    return {
        "name": new_user["name"],
        "email": new_user["email"],
        "subscription": new_user["subscription"]
    }

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
    uvicorn.run(app, host="0.0.0.0", port=8000)
