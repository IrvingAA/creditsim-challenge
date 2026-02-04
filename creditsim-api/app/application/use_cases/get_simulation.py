from __future__ import annotations

from uuid import UUID

from app.application.errors import SimulationNotFoundError
from app.application.ports import SimulationRepository
from app.application.dtos.simulation_dto import SimulationResultDTO


def get_simulation(
    *,
    simulation_id: UUID,
    folio: str,
    repo: SimulationRepository,
    last_name: str | None = None,
    document_id: str | None = None,
    name: str | None = None,
) -> SimulationResultDTO:
    result = repo.get_simulation_by_match(
        simulation_id=simulation_id,
        folio=folio,
        last_name=last_name,
        document_id=document_id,
        name=name,
    )

    if result is None:
        raise SimulationNotFoundError("Simulation not found")

    return result
