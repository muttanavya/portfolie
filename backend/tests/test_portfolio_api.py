"""Backend API tests for Navya portfolio (chat + health)."""
import os
import pytest
import requests

BASE_URL = os.environ.get(
    "EXPO_PUBLIC_BACKEND_URL",
    "https://navya-recruit.preview.emergentagent.com",
).rstrip("/")


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


# --- Health / root ---
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200
        assert r.json().get("message") == "Hello World"


# --- Chat: email + 3 projects, no Smart Door ---
class TestChatEmailProjects:
    def test_email_and_project_count(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/chat",
            json={"message": "What is Navya email and how many projects does she have?"},
            timeout=90,
        )
        assert r.status_code == 200, f"got {r.status_code}: {r.text}"
        reply = r.json().get("reply", "")
        assert isinstance(reply, str) and len(reply.strip()) > 0
        low = reply.lower()
        assert "muttanavya@gmail.com" in low, f"missing new email in reply: {reply}"
        assert "muttanavyna" not in low, f"old typo email still present: {reply}"
        assert "smart door" not in low, f"Smart Door still referenced: {reply}"
        # Must mention 3 projects (either as digit or word)
        assert ("3" in reply) or ("three" in low), f"3 projects not mentioned: {reply}"


# --- Chat: fraud detection project details ---
class TestChatFraudProject:
    def test_fraud_project_details(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/chat",
            json={"message": "Tell me about the Credit Card Fraud Detection project"},
            timeout=90,
        )
        assert r.status_code == 200, f"got {r.status_code}: {r.text}"
        reply = r.json().get("reply", "")
        low = reply.lower()
        assert "xgboost" in low, f"XGBoost missing: {reply}"
        assert "99.95" in reply, f"accuracy 99.95% missing: {reply}"


# --- Chat: validation ---
class TestChatValidation:
    def test_empty_message_rejected(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/chat", json={"message": "   "}, timeout=15)
        assert r.status_code == 400
