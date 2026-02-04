from dataclasses import dataclass
from decimal import Decimal
from uuid import UUID

from app.domain.amortization.loan_input import LoanInput


@dataclass(frozen=True)
class RiskAuditPayload:
    simulation_id: UUID
    loan_input: LoanInput
    payment: Decimal
    total_interest: Decimal
    total_payment: Decimal
