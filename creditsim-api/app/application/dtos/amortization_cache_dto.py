from dataclasses import dataclass
from decimal import Decimal

from app.domain.amortization.payment_row import PaymentRow


@dataclass(frozen=True)
class AmortizationCacheEntry:
    schedule: list[PaymentRow]
    payment: Decimal
    total_interest: Decimal
    total_payment: Decimal
