from __future__ import annotations

from app.application.dtos.risk_audit_dto import RiskAuditPayload
from app.application.ports import RiskAuditPort

class DisabledRiskAuditAdapter(RiskAuditPort):
    def notify(self, *, payload: RiskAuditPayload) -> None:
        return None
