"""Tests for simulate_credit use case."""

from decimal import Decimal
from uuid import UUID, uuid4
from app.application.use_cases.simulate_credit import simulate_credit
from app.application.dtos.borrower_dto import BorrowerInfo
from app.domain.amortization.loan_input import LoanInput


class FakeRepo:
    def __init__(self) -> None:
        self.created_folios: list[str] = []
        self.exists_responses: list[bool] = []

    def folio_exists(self, *, folio: str) -> bool:
        if self.exists_responses:
            return self.exists_responses.pop(0)
        return False

    def create_simulation(self, **kwargs) -> UUID:
        self.created_folios.append(kwargs.get("folio"))
        return uuid4()


class FakeAuditPort:
    def notify(self, **kwargs) -> None:
        return None


class FakeCachePort:
    def __init__(self) -> None:
        self.get_calls: list[str] = []
        self.set_calls: list[str] = []

    def get(self, *, key: str):
        self.get_calls.append(key)
        return None

    def set(self, *, key: str, value, ttl_seconds: int | None = None) -> None:
        self.set_calls.append(key)
        return None


def test_simulate_credit_returns_dto():
    repo = FakeRepo()
    payload = LoanInput(
        principal=Decimal("100000.00"),
        annual_rate=Decimal("0.12"),
        term_months=12,
    )
    borrower = BorrowerInfo(
        name="Juan",
        last_name="Perez",
        document_id="ABC123456",
    )

    audit = FakeAuditPort()
    cache = FakeCachePort()
    result = simulate_credit(
        payload=payload,
        borrower=borrower,
        repo=repo,
        audit_port=audit,
        cache_port=cache,
    )

    assert isinstance(result.simulation_id, UUID)
    assert result.folio.startswith("COT-")
    assert result.name == borrower.name
    assert result.last_name == borrower.last_name
    assert len(result.schedule) == 12
    assert result.total_payment > Decimal("0.00")
