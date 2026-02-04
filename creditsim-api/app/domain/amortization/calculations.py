from __future__ import annotations

from decimal import Decimal

from app.domain.amortization.payment_row import PaymentRow

def calculate_totals(schedule: list[PaymentRow]) -> tuple[Decimal, Decimal, Decimal]:
    if not schedule:
        return Decimal("0.00"), Decimal("0.00"), Decimal("0.00")
    
    payment = schedule[0].payment
    total_interest = sum(row.interest for row in schedule)
    total_payment = sum(row.payment for row in schedule)
    
    return payment, total_interest, total_payment
