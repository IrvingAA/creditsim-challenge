from fastapi.testclient import TestClient

from app.main import app


def test_verify_simulation_success():
    client = TestClient(app)
    payload = {
        "name": "Ana",
        "last_name": "Lopez",
        "document_id": "DNI12345678",
        "principal": "50000.00",
        "annual_rate": "0.10",
        "term_months": 24,
    }

    create_resp = client.post("/simulate", json=payload)
    assert create_resp.status_code == 200
    created = create_resp.json()

    verify_payload = {
        "last_name": "Lopez",
        "document_id": "DNI12345678",
        "folio": created["folio"],
    }

    verify_resp = client.post(
        f"/simulations/{created['simulation_id']}/verify",
        json=verify_payload,
    )

    assert verify_resp.status_code == 200
    data = verify_resp.json()
    assert data["simulation_id"] == created["simulation_id"]
    assert data["folio"] == created["folio"]
    assert data["document_id"].startswith("***")


def test_verify_simulation_requires_document_id_when_present():
    client = TestClient(app)
    payload = {
        "name": "Ana",
        "last_name": "Lopez",
        "document_id": "DNI12345678",
        "principal": "50000.00",
        "annual_rate": "0.10",
        "term_months": 24,
    }

    create_resp = client.post("/simulate", json=payload)
    assert create_resp.status_code == 200
    created = create_resp.json()

    verify_payload = {
        "last_name": "Lopez",
        "folio": created["folio"],
    }

    verify_resp = client.post(
        f"/simulations/{created['simulation_id']}/verify",
        json=verify_payload,
    )

    assert verify_resp.status_code == 404


def test_verify_simulation_without_borrower():
    client = TestClient(app)
    payload = {
        "principal": "50000.00",
        "annual_rate": "0.10",
        "term_months": 24,
    }

    create_resp = client.post("/simulate", json=payload)
    assert create_resp.status_code == 200
    created = create_resp.json()

    verify_payload = {
        "folio": created["folio"],
    }

    verify_resp = client.post(
        f"/simulations/{created['simulation_id']}/verify",
        json=verify_payload,
    )

    assert verify_resp.status_code == 200
    data = verify_resp.json()
    assert data["simulation_id"] == created["simulation_id"]
    assert data["name"] is None
    assert data["document_id"] is None


def test_verify_simulation_not_found():
    client = TestClient(app)
    verify_payload = {
        "last_name": "Lopez",
        "folio": "COT-XXXXXXX",
    }

    resp = client.post(
        "/simulations/00000000-0000-0000-0000-000000000000/verify",
        json=verify_payload,
    )
    assert resp.status_code == 404


def test_verify_simulation_rejects_document_id_without_last_name():
    client = TestClient(app)
    verify_payload = {
        "folio": "COT-XXXXXXX",
        "document_id": "DNI12345678",
    }

    resp = client.post(
        "/simulations/00000000-0000-0000-0000-000000000000/verify",
        json=verify_payload,
    )
    assert resp.status_code == 422
