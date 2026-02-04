"""Tests for RandomRiskAuditService."""

import time
from unittest.mock import patch
from uuid import uuid4
import pytest

from app.infrastructure.risk_audit.random_audit import RandomRiskAuditService
from app.application.dtos.risk_audit_dto import RiskAuditPayload
from app.domain.amortization.loan_input import LoanInput
from decimal import Decimal


def test_random_audit_initialization():
    service = RandomRiskAuditService()
    
    assert service._min_delay_seconds == 1.0
    assert service._max_delay_seconds == 3.0
    assert service._failure_rate == 0.10


def test_random_audit_custom_initialization():
    service = RandomRiskAuditService(
        min_delay_seconds=0.5,
        max_delay_seconds=1.5,
        failure_rate=0.2,
    )
    
    assert service._min_delay_seconds == 0.5
    assert service._max_delay_seconds == 1.5
    assert service._failure_rate == 0.2


def test_random_audit_success_case():
    service = RandomRiskAuditService(
        min_delay_seconds=0.1,
        max_delay_seconds=0.2,
        failure_rate=0.0,
    )
    
    payload = RiskAuditPayload(
        simulation_id=uuid4(),
        loan_input=LoanInput(
            principal=Decimal("100000.00"),
            annual_rate=Decimal("12.0"),
            term_months=24,
        ),
        payment=Decimal("4707.35"),
        total_interest=Decimal("12976.40"),
        total_payment=Decimal("112976.40"),
    )
    
    start = time.time()
    service.notify(payload=payload)
    elapsed = time.time() - start
    
    assert 0.1 <= elapsed <= 0.3


def test_random_audit_failure_case():
    service = RandomRiskAuditService(
        min_delay_seconds=0.1,
        max_delay_seconds=0.2,
        failure_rate=1.0,
    )
    
    payload = RiskAuditPayload(
        simulation_id=uuid4(),
        loan_input=LoanInput(
            principal=Decimal("200000.00"),
            annual_rate=Decimal("15.0"),
            term_months=36,
        ),
        payment=Decimal("6927.01"),
        total_interest=Decimal("49372.36"),
        total_payment=Decimal("249372.36"),
    )
    
    with pytest.raises(RuntimeError, match="Risk audit failed"):
        service.notify(payload=payload)


@patch("app.infrastructure.risk_audit.random_audit.random.random")
@patch("app.infrastructure.risk_audit.random_audit.random.uniform")
def test_random_audit_mocked_success(mock_uniform, mock_random):
    mock_uniform.return_value = 0.1
    mock_random.return_value = 0.15
    
    service = RandomRiskAuditService(
        min_delay_seconds=0.1,
        max_delay_seconds=0.2,
        failure_rate=0.10,
    )
    
    payload = RiskAuditPayload(
        simulation_id=uuid4(),
        loan_input=LoanInput(
            principal=Decimal("50000.00"),
            annual_rate=Decimal("10.0"),
            term_months=12,
        ),
        payment=Decimal("4397.94"),
        total_interest=Decimal("2775.28"),
        total_payment=Decimal("52775.28"),
    )
    
    service.notify(payload=payload)
    
    mock_uniform.assert_called_once_with(0.1, 0.2)


@patch("app.infrastructure.risk_audit.random_audit.random.random")
@patch("app.infrastructure.risk_audit.random_audit.random.uniform")
def test_random_audit_mocked_failure(mock_uniform, mock_random):
    mock_uniform.return_value = 0.15
    mock_random.return_value = 0.05
    
    service = RandomRiskAuditService(
        min_delay_seconds=0.1,
        max_delay_seconds=0.2,
        failure_rate=0.10,
    )
    
    payload = RiskAuditPayload(
        simulation_id=uuid4(),
        loan_input=LoanInput(
            principal=Decimal("150000.00"),
            annual_rate=Decimal("18.0"),
            term_months=48,
        ),
        payment=Decimal("4451.56"),
        total_interest=Decimal("63674.88"),
        total_payment=Decimal("213674.88"),
    )
    
    with pytest.raises(RuntimeError, match="Risk audit failed"):
        service.notify(payload=payload)


def test_random_audit_delay_range():
    service = RandomRiskAuditService(
        min_delay_seconds=0.05,
        max_delay_seconds=0.1,
        failure_rate=0.0,
    )
    
    payload = RiskAuditPayload(
        simulation_id=uuid4(),
        loan_input=LoanInput(
            principal=Decimal("75000.00"),
            annual_rate=Decimal("11.0"),
            term_months=18,
        ),
        payment=Decimal("4484.27"),
        total_interest=Decimal("5717.86"),
        total_payment=Decimal("80717.86"),
    )
    
    for _ in range(5):
        start = time.time()
        service.notify(payload=payload)
        elapsed = time.time() - start
        
        assert 0.04 <= elapsed <= 0.15


def test_random_audit_statistical_failure_rate():
    service = RandomRiskAuditService(
        min_delay_seconds=0.01,
        max_delay_seconds=0.02,
        failure_rate=0.3,
    )
    
    payload = RiskAuditPayload(
        simulation_id=uuid4(),
        loan_input=LoanInput(
            principal=Decimal("100000.00"),
            annual_rate=Decimal("12.0"),
            term_months=24,
        ),
        payment=Decimal("4707.35"),
        total_interest=Decimal("12976.40"),
        total_payment=Decimal("112976.40"),
    )
    
    failures = 0
    total = 100
    
    for _ in range(total):
        try:
            service.notify(payload=payload)
        except RuntimeError:
            failures += 1
    
    assert 20 <= failures <= 40, f"Expected ~30 failures, got {failures}"
