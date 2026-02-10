import requests
import sys
import time

BASE_URL = "http://localhost:8000/api"

def test_flow():
    # Wait for server to start
    print("Waiting for server...")
    for _ in range(5):
        try:
            requests.get("http://localhost:8000/")
            break
        except requests.ConnectionError:
            time.sleep(1)
    
    email = "test_user@example.com"
    password = "password123"
    name = "Test User"
    
    # 1. Signup
    print("Testing Signup...")
    try:
        resp = requests.post(f"{BASE_URL}/signup", json={
            "name": name,
            "email": email,
            "password": password
        })
    except requests.ConnectionError:
        print("Could not connect to backend.")
        sys.exit(1)

    if resp.status_code == 400 and "Email already registered" in resp.text:
        print("User already exists, proceeding to login.")
    elif resp.status_code != 200:
        print(f"Signup failed: {resp.text}")
        sys.exit(1)
        
    # 2. Login
    print("Testing Login...")
    resp = requests.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": password
    })
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        sys.exit(1)
    user = resp.json()
    print(f"Logged in as: {user['email']}, Subscription: {user['subscription']}")
    
    # 3. Subscribe
    print("Testing Subscribe...")
    resp = requests.post(f"{BASE_URL}/subscribe", json={
        "email": email
    })
    if resp.status_code != 200:
        print(f"Subscribe failed: {resp.text}")
        sys.exit(1)
        
    updated_user = resp.json()
    if updated_user['subscription'] != 'reserved':
        print("Subscription update failed")
        sys.exit(1)
        
    print("Flow verified successfully!")

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"Test failed: {e}")
        sys.exit(1)
