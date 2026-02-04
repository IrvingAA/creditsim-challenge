from uuid import UUID
from fastapi import APIRouter, Depends, Query

from app.api.schemas.simulate import (
    SimulateResponse,
    SimulationVerifyRequest,
    SimulationListItem,
    SimulationListResponse,
)
from app.api.utils import to_simulate_response
from app.api.deps import get_simulation_repo
from app.application.use_cases.get_simulation import get_simulation
from app.application.ports import SimulationRepository

router = APIRouter(prefix="/simulations", tags=["simulations"])

@router.get("", response_model=SimulationListResponse)
def list_simulations(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    repo: SimulationRepository = Depends(get_simulation_repo),
):
    simulations = repo.get_all_simulations(limit=limit, offset=offset)
    total = repo.count_simulations()
    
    items = [
        SimulationListItem(
            simulation_id=str(sim.simulation_id),
            folio=sim.folio,
            name=sim.name,
            last_name=sim.last_name,
            principal=str(sim.principal),
            annual_rate=str(sim.annual_rate),
            term_months=sim.term_months,
            payment=str(sim.payment),
            total_interest=str(sim.total_interest),
            total_payment=str(sim.total_payment),
        )
        for sim in simulations
    ]
    
    return SimulationListResponse(
        total=total,
        limit=limit,
        offset=offset,
        items=items,
    )

@router.post("/{simulation_id}/verify", response_model=SimulateResponse)
def verify_simulation(
    simulation_id: UUID,
    payload: SimulationVerifyRequest,
    repo: SimulationRepository = Depends(get_simulation_repo),
):
    result = get_simulation(
        simulation_id=simulation_id,
        folio=payload.folio,
        last_name=payload.last_name,
        document_id=payload.document_id,
        name=payload.name,
        repo=repo,
    )
    return to_simulate_response(result)
