from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class LoanInput:
    principal: Decimal
    annual_rate: Decimal
    term_months: int
