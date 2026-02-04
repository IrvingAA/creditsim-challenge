"""Edge cases and coverage tests."""
from fastapi.testclient import TestClient

from app.main import app


def test_simulate_with_all_borrower_fields():
    client = TestClient(app)
    
    payload = {
        "name": "Carlos Alberto",
        "last_name": "Rodriguez Martinez",
        "document_id": "CURP1234567890ABC",
        "principal": "250000.00",
        "annual_rate": "9.75",
        "term_months": 48,
    }
    
    resp = client.post("/simulate", json=payload)
    
    assert resp.status_code == 200
    data = resp.json()
    
    assert data["name"] == "Carlos Alberto"
    assert data["last_name"] == "Rodriguez Martinez"
    assert data["document_id"].endswith("0ABC")
    assert "*" in data["document_id"]
    assert len(data["schedule"]) == 48


def test_simulate_minimum_valid_values():
    client = TestClient(app)
    
    payload = {
        "principal": "100.00",
        "annual_rate": "0.01",
        "term_months": 1,
    }
    
    resp = client.post("/simulate", json=payload)
    
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["schedule"]) == 1
    assert float(data["principal"]) == 100.00


def test_simulate_very_long_term():
    client = TestClient(app)
    
    payload = {
        "principal": "1000000.00",
        "annual_rate": "7.5",
        "term_months": 360,
    }
    
    resp = client.post("/simulate", json=payload)
    
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["schedule"]) == 360
    
    last_period = data["schedule"][-1]
    assert float(last_period["balance"]) == 0.00


def test_verify_simulation_case_insensitive_all_fields():
    client = TestClient(app)
    
    create_payload = {
        "name": "Maria",
        "last_name": "Gonzalez",
        "document_id": "INE123456",
        "principal": "75000.00",
        "annual_rate": "11.0",
        "term_months": 24,
    }
    create_resp = client.post("/simulate", json=create_payload)
    assert create_resp.status_code == 200
    created = create_resp.json()
    
    verify_payload = {
        "name": "MARIA",
        "last_name": "gonzalez",
        "document_id": "ine123456",
        "folio": created["folio"].upper(),
    }
    
    verify_resp = client.post(
        f"/simulations/{created['simulation_id']}/verify",
        json=verify_payload,
    )
    
    assert verify_resp.status_code == 200
    result = verify_resp.json()
    assert result["simulation_id"] == created["simulation_id"]


def test_list_simulations_with_many_records():
    client = TestClient(app)
    
    for i in range(7):
        payload = {
            "principal": f"{(i + 1) * 5000}.00",
            "annual_rate": f"{8 + i}.0",
            "term_months": 6 + (i * 2),
        }
        resp = client.post("/simulate", json=payload)
        assert resp.status_code == 200
    
    resp = client.get("/simulations?limit=5&offset=0")
    assert resp.status_code == 200
    data = resp.json()
    assert data["limit"] == 5
    assert data["total"] >= 7
    
    resp2 = client.get("/simulations?limit=5&offset=5")
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["offset"] == 5


def test_simulate_decimal_precision():
    client = TestClient(app)
    
    payload = {
        "principal": "123456.78",
        "annual_rate": "13.33",
        "term_months": 15,
    }
    
    resp = client.post("/simulate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    
    assert data["principal"] == "123456.78"
    assert "." in data["payment"]
    assert "." in data["total_interest"]
    
    for period in data["schedule"]:
        assert "." in period["payment"]
        assert "." in period["interest"]
        assert "." in period["principal"]
        assert "." in period["balance"]
