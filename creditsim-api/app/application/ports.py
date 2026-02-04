from __future__ import annotations

from typing import Protocol
from uuid import UUID
from decimal import Decimal

from app.domain.amortization.loan_input import LoanInput
from app.domain.amortization.payment_row import PaymentRow
from app.application.dtos.risk_audit_dto import RiskAuditPayload
from app.application.dtos.borrower_dto import BorrowerInfo
from app.application.dtos.amortization_cache_dto import AmortizationCacheEntry
from app.application.dtos.simulation_dto import SimulationResultDTO


class SimulationRepository(Protocol):
    def create_simulation(
        self,
        *,
        input: LoanInput,
        borrower: BorrowerInfo | None,
        folio: str,
        payment: Decimal,
        total_interest: Decimal,
        total_payment: Decimal,
        schedule: list[PaymentRow],
    ) -> UUID:
        ...
        
    def folio_exists(self, *, folio: str) -> bool:
        ...

    def get_simulation_by_match(
        self,
        *,
        simulation_id: UUID,
        folio: str,
        last_name: str | None = None,
        document_id: str | None = None,
        name: str | None = None,
    ) -> SimulationResultDTO | None:
        ...
        
    def list_simulations(self, *, limit: int = 100, offset: int = 0) -> tuple[list[SimulationResultDTO], int]:
        ...

class RiskAuditPort(Protocol):
    def notify(self, *, payload: RiskAuditPayload) -> None:
        ...

class AmortizationCachePort(Protocol):
    def get(self, *, key: str) -> AmortizationCacheEntry | None:
        ...

    def set(
        self,
        *,
        key: str,
        value: AmortizationCacheEntry,
        ttl_seconds: int | None = None,
    ) -> None:
        ...
