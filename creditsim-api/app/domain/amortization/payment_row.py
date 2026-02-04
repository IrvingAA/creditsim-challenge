from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class PaymentRow:
    period: int
    payment: Decimal
    interest: Decimal
    principal: Decimal
    balance: Decimal
