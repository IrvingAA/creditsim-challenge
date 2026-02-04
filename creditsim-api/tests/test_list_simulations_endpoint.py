from fastapi.testclient import TestClient

from app.main import app


def test_list_simulations_empty():
    client = TestClient(app)
    
    resp = client.get("/simulations")
    
    assert resp.status_code == 200
    data = resp.json()
    assert "total" in data
    assert "items" in data
    assert "limit" in data
    assert "offset" in data
    assert data["limit"] == 20
    assert data["offset"] == 0
    assert isinstance(data["items"], list)


def test_list_simulations_with_data():
    client = TestClient(app)
    
    for i in range(3):
        payload = {
            "principal": f"{10000 * (i + 1)}.00",
            "annual_rate": "10.0",
            "term_months": 12,
            "name": f"User{i}",
            "last_name": "Test",
            "document_id": f"DOC{i:03d}",
        }
        create_resp = client.post("/simulate", json=payload)
        assert create_resp.status_code == 200
    
    resp = client.get("/simulations")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 3
    assert len(data["items"]) >= 3


def test_list_simulations_with_pagination():
    client = TestClient(app)
    
    for i in range(5):
        payload = {
            "principal": "5000.00",
            "annual_rate": "8.0",
            "term_months": 6,
        }
        client.post("/simulate", json=payload)
    
    resp1 = client.get("/simulations?limit=2&offset=0")
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["limit"] == 2
    assert data1["offset"] == 0
    
    resp2 = client.get("/simulations?limit=2&offset=2")
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["limit"] == 2
    assert data2["offset"] == 2


def test_list_simulations_response_structure():
    client = TestClient(app)
    
    payload = {
        "principal": "15000.00",
        "annual_rate": "11.5",
        "term_months": 18,
        "name": "Maria",
        "last_name": "Garcia",
        "document_id": "DNI987654",
    }
    client.post("/simulate", json=payload)
    
    resp = client.get("/simulations?limit=1")
    assert resp.status_code == 200
    data = resp.json()
    
    assert len(data["items"]) >= 1
    sim = data["items"][0]
    
    assert "simulation_id" in sim
    assert "folio" in sim
    assert "principal" in sim
    assert "annual_rate" in sim
    assert "term_months" in sim
    assert "payment" in sim
    assert "total_payment" in sim
