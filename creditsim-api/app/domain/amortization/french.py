from decimal import Decimal, ROUND_HALF_UP

from app.domain.amortization.loan_input import LoanInput
from app.domain.amortization.payment_row import PaymentRow

MONEY = Decimal("0.01")
TWELVE = Decimal("12")


def q2(value: Decimal) -> Decimal:
    return value.quantize(MONEY, rounding=ROUND_HALF_UP)


def monthly_rate(annual_rate: Decimal) -> Decimal:
    """Convert annual rate to monthly rate."""
    return annual_rate / TWELVE


def monthly_payment(principal: Decimal, i: Decimal, n: int) -> Decimal:
    """Return fixed monthly payment (French system)."""
    if n <= 0:
        raise ValueError("term_months must be > 0")

    if i == 0:
        return q2(principal / Decimal(n))

    one = Decimal("1")
    pow_ = (one + i) ** Decimal(n)
    a = principal * (i * pow_) / (pow_ - one)
    return q2(a)


def build_schedule(payload: LoanInput) -> list[PaymentRow]:
    """Return full schedule, adjusting last period to close balance."""
    if payload.principal <= 0:
        raise ValueError("principal must be > 0")
    if payload.term_months <= 0:
        raise ValueError("term_months must be > 0")
    if payload.annual_rate < 0:
        raise ValueError("annual_rate must be >= 0")

    i = monthly_rate(payload.annual_rate)
    payment = monthly_payment(payload.principal, i, payload.term_months)

    balance = q2(payload.principal)
    rows: list[PaymentRow] = []

    for period in range(1, payload.term_months + 1):
        interest = q2(balance * i)

        if period == payload.term_months:
            principal_part = balance
            payment_adj = q2(interest + principal_part)
            new_balance = Decimal("0.00")
        else:
            principal_part = q2(payment - interest)
            payment_adj = payment

            if principal_part > balance:
                principal_part = balance
                payment_adj = q2(interest + principal_part)

            new_balance = q2(balance - principal_part)

        rows.append(
            PaymentRow(
                period=period,
                payment=payment_adj,
                interest=interest,
                principal=principal_part,
                balance=new_balance,
            )
        )

        balance = new_balance

    return rows
