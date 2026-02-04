from __future__ import annotations

from app.application.dtos.risk_audit_dto import RiskAuditPayload
from app.application.ports import RiskAuditPort
from app.infrastructure.risk_audit.tasks import run_risk_audit

def _serialize_payload(payload: RiskAuditPayload) -> dict:
    return {
        "simulation_id": str(payload.simulation_id),
        "loan_input": {
            "principal": str(payload.loan_input.principal),
            "annual_rate": str(payload.loan_input.annual_rate),
            "term_months": payload.loan_input.term_months,
        },
        "payment": str(payload.payment),
        "total_interest": str(payload.total_interest),
        "total_payment": str(payload.total_payment),
    }


class CeleryRiskAuditAdapter(RiskAuditPort):
    def notify(self, *, payload: RiskAuditPayload) -> None:
        run_risk_audit.delay(_serialize_payload(payload))
