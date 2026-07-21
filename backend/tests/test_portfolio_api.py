"""Backend API tests for Navya portfolio - focus on /api/chat sanity check."""
import os
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://navya-recruit.preview.emergentagent.com").rstrip("/")


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


# --- Chat endpoint (single call - grounded LLM) ---
class TestChat:
    def test_chat_returns_reply(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/chat",
            json={"message": "Tell me about Navya briefly"},
            timeout=60,
        )
        assert r.status_code == 200, f"got {r.status_code}: {r.text}"
        data = r.json()
        assert isinstance(data.get("reply"), str) and len(data["reply"].strip()) > 0
        assert isinstance(data.get("session_id"), str) and len(data["session_id"]) > 0

    def test_chat_empty_message_rejected(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/chat", json={"message": "   "}, timeout=15)
        assert r.status_code == 400
