from __future__ import annotations

from decimal import Decimal
from uuid import UUID

from app.application.dtos.borrower_dto import BorrowerInfo
from app.application.dtos.amortization_cache_dto import AmortizationCacheEntry
from app.application.dtos.risk_audit_dto import RiskAuditPayload
from app.application.cache_keys import amortization_cache_key
from app.application.folio import generate_unique_folio, generate_folio
from app.application.ports import SimulationRepository, RiskAuditPort, AmortizationCachePort
from app.application.dtos.simulation_dto import SimulationResultDTO
from app.domain.amortization.loan_input import LoanInput
from app.domain.amortization.french import build_schedule
from app.domain.amortization.calculations import calculate_totals


def simulate_credit(
    *,
    payload: LoanInput,
    borrower: BorrowerInfo | None,
    repo: SimulationRepository,
    audit_port: RiskAuditPort,
    cache_port: AmortizationCachePort,
    folio_generator=generate_folio,
) -> SimulationResultDTO:
    cache_key = amortization_cache_key(payload)
    cache_entry = cache_port.get(key=cache_key)

    if cache_entry:
        schedule = cache_entry.schedule
        payment = cache_entry.payment
        total_interest = cache_entry.total_interest
        total_payment = cache_entry.total_payment
    else:
        schedule = build_schedule(payload)
        payment, total_interest, total_payment = calculate_totals(schedule)

        cache_port.set(
            key=cache_key,
            value=AmortizationCacheEntry(
                schedule=schedule,
                payment=payment,
                total_interest=total_interest,
                total_payment=total_payment,
            ),
        )

    folio = generate_unique_folio(
        folio_exists=lambda f: repo.folio_exists(folio=f),
        generator=folio_generator,
    )
    simulation_id: UUID = repo.create_simulation(
        input=payload,
        borrower=borrower,
        folio=folio,
        payment=payment,
        total_interest=total_interest,
        total_payment=total_payment,
        schedule=schedule,
    )

    result = SimulationResultDTO(
        simulation_id=simulation_id,
        folio=folio,
        name=borrower.name if borrower else None,
        last_name=borrower.last_name if borrower else None,
        document_id=borrower.document_id if borrower else None,
        principal=payload.principal,
        annual_rate=payload.annual_rate,
        term_months=payload.term_months,
        payment=payment,
        total_interest=total_interest,
        total_payment=total_payment,
        schedule=schedule,
    )

    audit_port.notify(
        payload=RiskAuditPayload(
            simulation_id=simulation_id,
            loan_input=payload,
            payment=payment,
            total_interest=total_interest,
            total_payment=total_payment,
        )
    )

    return result
