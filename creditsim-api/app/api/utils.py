"""Utilities for API response transformation."""
from app.api.schemas.simulate import PaymentRowOut, SimulateResponse
from app.domain.amortization.payment_row import PaymentRow
from app.infrastructure.serializers import payment_row_to_dict
from app.application.dtos.simulation_dto import SimulationResultDTO


def mask_document_id(document_id: str | None) -> str | None:
    """Mask document ID showing only last 4 characters."""
    if not document_id:
        return None
    clean = document_id.strip()
    if len(clean) <= 4:
        return "***"
    return f"***{clean[-4:]}"


def to_payment_row_out_list(schedule: list[PaymentRow]) -> list[PaymentRowOut]:
    """Convert domain payment rows to API response schema."""
    return [PaymentRowOut(**payment_row_to_dict(row)) for row in schedule]


def to_simulate_response(result: SimulationResultDTO) -> SimulateResponse:
    """Convert simulation DTO to API response with masked document."""
    return SimulateResponse(
        simulation_id=result.simulation_id,
        folio=result.folio,
        name=result.name,
        last_name=result.last_name,
        document_id=mask_document_id(result.document_id),
        principal=result.principal,
        annual_rate=result.annual_rate,
        term_months=result.term_months,
        payment=result.payment,
        total_interest=result.total_interest,
        total_payment=result.total_payment,
        schedule=to_payment_row_out_list(result.schedule),
    )
