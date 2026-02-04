from fastapi import APIRouter, Depends

from app.api.schemas.simulate import SimulateRequest, SimulateResponse
from app.api.utils import to_simulate_response
from app.application.dtos.borrower_dto import BorrowerInfo
from app.api.deps import get_risk_audit_port, get_amortization_cache_port, get_simulation_repo
from app.application.use_cases.simulate_credit import simulate_credit
from app.application.ports import RiskAuditPort, AmortizationCachePort, SimulationRepository
from app.domain.amortization.loan_input import LoanInput

router = APIRouter(prefix="/simulate", tags=["simulate"])

@router.post("", response_model=SimulateResponse)
def simulate_endpoint(
    payload: SimulateRequest,
    repo: SimulationRepository = Depends(get_simulation_repo),
    audit_port: RiskAuditPort = Depends(get_risk_audit_port),
    cache_port: AmortizationCachePort = Depends(get_amortization_cache_port),
):
    loan = LoanInput(
        principal=payload.principal,
        annual_rate=payload.annual_rate,
        term_months=payload.term_months,
    )

    borrower = None
    if payload.name:
        borrower = BorrowerInfo(
            name=payload.name,
            last_name=payload.last_name,
            document_id=payload.document_id,
        )

    result = simulate_credit(
        payload=loan,
        borrower=borrower,
        repo=repo,
        audit_port=audit_port,
        cache_port=cache_port,
    )

    return to_simulate_response(result)
