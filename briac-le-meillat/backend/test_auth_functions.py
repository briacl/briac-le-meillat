
import os
import sys

# Add the directory to sys.path to import main
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import generate_totp_secret, generate_qr_code, send_verification_email, load_verification_codes, save_verification_codes

def test_totp():
    print("Testing TOTP...")
    secret = generate_totp_secret()
    assert secret is not None
    print(f"Secret generated: {secret}")
    
    qr = generate_qr_code(secret, "test@example.com")
    assert qr is not None
    assert isinstance(qr, str)
    print("QR Code generated successfully (Base64).")

def test_email_mock():
    print("\nTesting Email Mock (No Credentials)...")
    # Should print message and return False or True depending on config, but not crash
    # Force disable for this test to ensure it doesn't try to send
    os.environ["ENABLE_EMAIL_VERIFICATION"] = "false"
    res = send_verification_email("test@example.com", "123456")
    print(f"Result (Should be True because disabled): {res}")

def test_data_persistence():
    print("\nTesting Data Persistence...")
    codes = {"test@example.com": {"code": "123456", "expires_at": "2023-01-01"}}
    save_verification_codes(codes)
    loaded = load_verification_codes()
    assert loaded["test@example.com"]["code"] == "123456"
    print("Data persistence working.")

if __name__ == "__main__":
    test_totp()
    test_email_mock()
    test_data_persistence()
    print("\nAll tests passed!")
