"""Tests for folio generation logic."""

from decimal import Decimal
from uuid import UUID, uuid4

from app.application.use_cases.simulate_credit import simulate_credit
from app.application.dtos.borrower_dto import BorrowerInfo
from app.domain.amortization.loan_input import LoanInput


class FakeRepo:
    def __init__(self) -> None:
        self.exists_calls: list[str] = []

    def folio_exists(self, *, folio: str) -> bool:
        self.exists_calls.append(folio)
        return folio == "COT-AAAAAAA"

    def create_simulation(self, **kwargs) -> UUID:
        return uuid4()

class FakeAuditPort:
    def notify(self, **kwargs) -> None:
        return None


class FakeCachePort:
    def get(self, *, key: str):
        return None

    def set(self, *, key: str, value, ttl_seconds: int | None = None) -> None:
        return None


def test_folio_collision_retries_next_value():
    repo = FakeRepo()
    payload = LoanInput(
        principal=Decimal("1000.00"),
        annual_rate=Decimal("0.10"),
        term_months=12,
    )
    borrower = BorrowerInfo(
        name="Ana",
        last_name="Lopez",
        document_id="DOC123",
    )

    folios = iter(["COT-AAAAAAA", "COT-BBBBBBB"])

    def fake_generator():
        return next(folios)

    result = simulate_credit(
        payload=payload,
        borrower=borrower,
        repo=repo,
        audit_port=FakeAuditPort(),
        cache_port=FakeCachePort(),
        folio_generator=fake_generator,
    )

    assert result.folio == "COT-BBBBBBB"
    assert repo.exists_calls == ["COT-AAAAAAA", "COT-BBBBBBB"]
