from __future__ import annotations

from decimal import Decimal
from uuid import UUID

from app.infrastructure.celery_app import celery_app
from app.infrastructure.risk_audit.random_audit import RandomRiskAuditService
from app.application.dtos.risk_audit_dto import RiskAuditPayload
from app.domain.amortization.loan_input import LoanInput

@celery_app.task(bind=True, max_retries=3, default_retry_delay=2)
def run_risk_audit(self, payload: dict) -> None:
    try:
        loan_input = LoanInput(
            principal=Decimal(payload["loan_input"]["principal"]),
            annual_rate=Decimal(payload["loan_input"]["annual_rate"]),
            term_months=int(payload["loan_input"]["term_months"]),
        )

        dto = RiskAuditPayload(
            simulation_id=UUID(payload["simulation_id"]),
            loan_input=loan_input,
            payment=Decimal(payload["payment"]),
            total_interest=Decimal(payload["total_interest"]),
            total_payment=Decimal(payload["total_payment"]),
        )

        RandomRiskAuditService().notify(payload=dto)
    except RuntimeError as exc:
        raise self.retry(exc=exc)
