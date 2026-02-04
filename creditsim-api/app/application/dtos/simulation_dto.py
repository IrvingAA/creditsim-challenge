from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from uuid import UUID

from app.domain.amortization.payment_row import PaymentRow


@dataclass(frozen=True)
class SimulationResultDTO:
    simulation_id: UUID
    folio: str
    name: str | None
    last_name: str | None
    document_id: str | None
    principal: Decimal
    annual_rate: Decimal
    term_months: int
    payment: Decimal
    total_interest: Decimal
    total_payment: Decimal
    schedule: list[PaymentRow]
