from fastapi.testclient import TestClient

from app.main import app


def test_simulate_endpoint_success():
    client = TestClient(app)
    payload = {
        "name": "Juan",
        "last_name": "Perez",
        "document_id": "ABC123456",
        "principal": "100000.00",
        "annual_rate": "0.12",
        "term_months": 12,
    }

    resp = client.post("/simulate", json=payload)
    assert resp.status_code == 200

    data = resp.json()
    assert "simulation_id" in data
    assert "folio" in data
    assert "payment" in data
    assert data["document_id"].startswith("***")
    assert "total_interest" in data
    assert "total_payment" in data

    schedule = data.get("schedule")
    assert isinstance(schedule, list)
    assert len(schedule) == 12

    first = schedule[0]
    assert set(first.keys()) == {"period", "payment", "interest", "principal", "balance"}


def test_simulate_endpoint_without_borrower():
    client = TestClient(app)
    payload = {
        "principal": "25000.00",
        "annual_rate": "0.08",
        "term_months": 18,
    }

    resp = client.post("/simulate", json=payload)
    assert resp.status_code == 200

    data = resp.json()
    assert data["name"] is None
    assert data["last_name"] is None
    assert data["document_id"] is None


def test_simulate_endpoint_invalid_payload():
    client = TestClient(app)
    payload = {
        "name": "Juan",
        "principal": "0.00",
        "annual_rate": "-0.01",
        "term_months": 0,
    }

    resp = client.post("/simulate", json=payload)
    assert resp.status_code == 422


def test_simulate_endpoint_partial_borrower_rejected():
    client = TestClient(app)
    payload = {
        "name": "Juan",
        "principal": "1000.00",
        "annual_rate": "0.05",
        "term_months": 6,
    }

    resp = client.post("/simulate", json=payload)
    assert resp.status_code == 422
