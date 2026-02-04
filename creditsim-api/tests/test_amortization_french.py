"""Tests for French amortization system."""

import pytest
from decimal import Decimal
from app.domain.amortization.loan_input import LoanInput
from app.domain.amortization.french import build_schedule


def test_schedule_length():
    payload = LoanInput(
        principal=Decimal("100000.00"),
        annual_rate=Decimal("0.12"),
        term_months=12,
    )
    rows = build_schedule(payload)
    assert len(rows) == 12

def test_balance_decreases_and_ends_near_zero():
    payload = LoanInput(
        principal=Decimal("100000.00"),
        annual_rate=Decimal("0.12"),
        term_months=12,
    )
    rows = build_schedule(payload)

    balances = [r.balance for r in rows]
    assert all(balances[i] <= balances[i - 1] for i in range(1, len(balances)))

    assert rows[-1].balance == Decimal("0.00")

def test_zero_rate_is_straight_line():
    payload = LoanInput(
        principal=Decimal("1200.00"),
        annual_rate=Decimal("0"),
        term_months=12,
    )
    rows = build_schedule(payload)

    assert all(r.interest == Decimal("0.00") for r in rows)
    assert all(r.payment == Decimal("100.00") for r in rows)
    assert rows[-1].balance == Decimal("0.00")


def test_invalid_principal_raises():
    payload = LoanInput(
        principal=Decimal("0.00"),
        annual_rate=Decimal("0.12"),
        term_months=12,
    )
    with pytest.raises(ValueError):
        build_schedule(payload)

def test_invalid_term_raises():
    payload = LoanInput(
        principal=Decimal("1000.00"),
        annual_rate=Decimal("0.12"),
        term_months=0,
    )
    with pytest.raises(ValueError):
        build_schedule(payload)

def test_negative_rate_raises():
    payload = LoanInput(
        principal=Decimal("1000.00"),
        annual_rate=Decimal("-0.01"),
        term_months=12,
    )
    with pytest.raises(ValueError):
        build_schedule(payload)

def test_invariants_sum_principal_matches_original():
    payload = LoanInput(
        principal=Decimal("9999.99"),
        annual_rate=Decimal("0.199"),
        term_months=17,
    )
    rows = build_schedule(payload)

    total_principal = sum(r.principal for r in rows)

    assert abs(total_principal - payload.principal) <= Decimal("0.01")
    assert rows[-1].balance == Decimal("0.00")
    assert all(r.balance >= Decimal("0.00") for r in rows)