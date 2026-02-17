
import os
import sys
import argparse
from pathlib import Path

# Paths
BACKEND_DIR = Path(__file__).parent.parent / "backend"
ENV_FILE = BACKEND_DIR / ".env"

def update_env(key, value):
    """Updates or adds a key-value pair in the .env file."""
    lines = []
    if ENV_FILE.exists():
        with open(ENV_FILE, "r") as f:
            lines = f.readlines()

    key_found = False
    new_lines = []
    for line in lines:
        if line.strip().startswith(f"{key}="):
            new_lines.append(f"{key}={value}\n")
            key_found = True
        else:
            new_lines.append(line)
    
    if not key_found:
        if new_lines and not new_lines[-1].endswith("\n"):
            new_lines.append("\n")
        new_lines.append(f"{key}={value}\n")

    with open(ENV_FILE, "w") as f:
        f.writelines(new_lines)

def main():
    parser = argparse.ArgumentParser(description="Toggle Authentication Features")
    parser.add_argument("--email", choices=["on", "off"], help="Enable/Disable Email Verification")
    parser.add_argument("--2fa", dest="two_fa", choices=["on", "off"], help="Enable/Disable 2FA")
    
    args = parser.parse_args()
    
    if not args.email and not args.two_fa:
        # Interactive mode
        print("Interactive Mode:")
        email_input = input("Enable Email Verification? (y/n): ").lower()
        args.email = "on" if email_input in ["y", "yes"] else "off"
        
        two_fa_input = input("Enable 2FA? (y/n): ").lower()
        args.two_fa = "on" if two_fa_input in ["y", "yes"] else "off"

    if args.email:
        val = "true" if args.email == "on" else "false"
        update_env("ENABLE_EMAIL_VERIFICATION", val)
        print(f"Email Verification: {args.email.upper()}")

    if args.two_fa:
        val = "true" if args.two_fa == "on" else "false"
        update_env("ENABLE_2FA", val)
        print(f"2FA: {args.two_fa.upper()}")

    print("\n✅ Configuration updated.")
    print("⚠️  Please RESTART the backend server for changes to take effect:")
    print(f"   cd {BACKEND_DIR} && python3 main.py")

if __name__ == "__main__":
    main()
