"""Quick test to debug the 500 error on admin login"""
import sys
sys.path.insert(0, '.')

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("=== Testing GET / ===")
r = client.get("/")
print(f"Status: {r.status_code}, Body: {r.json()}")

print("\n=== Testing POST /auth/admin/login ===")
try:
    r = client.post("/auth/admin/login", data={"username": "admin@arwaedu.com", "password": "admin123"})
    print(f"Status: {r.status_code}")
    print(f"Body: {r.text}")
except Exception as e:
    print(f"Exception: {e}")
    import traceback
    traceback.print_exc()
