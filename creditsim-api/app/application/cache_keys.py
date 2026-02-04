"""Cache key generation for amortization calculations."""

from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

from app.domain.amortization.loan_input import LoanInput


def _quantize(value: Decimal, precision: str) -> Decimal:
    return value.quantize(Decimal(precision), rounding=ROUND_HALF_UP)


def amortization_cache_key(payload: LoanInput) -> str:
    principal = _quantize(payload.principal, "0.01")
    annual_rate = _quantize(payload.annual_rate, "0.0001")
    return f"amortization:v1:{principal}:{annual_rate}:{payload.term_months}"
