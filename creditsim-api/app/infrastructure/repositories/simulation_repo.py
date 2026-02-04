from decimal import Decimal
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.application.dtos.borrower_dto import BorrowerInfo
from app.application.dtos.simulation_dto import SimulationResultDTO
from app.application.errors import PersistenceError
from app.domain.amortization.loan_input import LoanInput
from app.domain.amortization.payment_row import PaymentRow
from app.infrastructure.db.models.simulation import Simulation
from app.infrastructure.serializers import to_decimal, schedule_to_json, json_to_schedule

def _normalize(value: str) -> str:
    return value.strip().upper()

class SqlAlchemySimulationRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create_simulation(
        self,
        *,
        input: LoanInput,
        borrower: BorrowerInfo | None,
        folio: str,
        payment: Decimal,
        total_interest: Decimal,
        total_payment: Decimal,
        schedule: list[PaymentRow],
    ) -> UUID:
        schedule_json = schedule_to_json(schedule)

        obj = Simulation(
            folio=folio,
            name=borrower.name if borrower else None,
            last_name=borrower.last_name if borrower else None,
            document_id=borrower.document_id if borrower else None,
            principal=input.principal,
            annual_rate=input.annual_rate,
            term_months=input.term_months,
            payment=payment,
            total_interest=total_interest,
            total_payment=total_payment,
            schedule=schedule_json,
        )

        try:
            self.session.add(obj)
            self.session.commit()
            self.session.refresh(obj)
        except SQLAlchemyError as exc:
            self.session.rollback()
            raise PersistenceError("Failed to persist simulation") from exc
        return obj.id

    def folio_exists(self, *, folio: str) -> bool:
        normalized = _normalize(folio)
        stmt = (
            select(Simulation.id)
            .where(func.upper(func.trim(Simulation.folio)) == normalized)
            .limit(1)
        )
        return self.session.execute(stmt).first() is not None

    def get_simulation_by_match(
        self,
        *,
        simulation_id: UUID,
        folio: str,
        last_name: str | None = None,
        document_id: str | None = None,
        name: str | None = None,
    ) -> SimulationResultDTO | None:
        normalized_folio = _normalize(folio)
        normalized_last = _normalize(last_name) if last_name else None
        normalized_name = _normalize(name) if name else None
        normalized_doc = _normalize(document_id) if document_id else None

        stmt = (
            select(Simulation)
            .where(Simulation.id == simulation_id)
            .where(func.upper(func.trim(Simulation.folio)) == normalized_folio)
        )

        if normalized_last:
            stmt = stmt.where(func.upper(func.trim(Simulation.last_name)) == normalized_last)
        else:
            stmt = stmt.where(Simulation.last_name.is_(None))

        if normalized_name:
            stmt = stmt.where(func.upper(func.trim(Simulation.name)) == normalized_name)

        if normalized_doc:
            stmt = stmt.where(func.upper(func.trim(Simulation.document_id)) == normalized_doc)
        else:
            stmt = stmt.where(Simulation.document_id.is_(None))

        row: Simulation | None = self.session.execute(stmt).scalar_one_or_none()
        if row is None:
            return None

        schedule = json_to_schedule(row.schedule)

        return SimulationResultDTO(
            simulation_id=row.id,
            folio=row.folio,
            name=row.name,
            last_name=row.last_name,
            document_id=row.document_id,
            principal=to_decimal(row.principal),
            annual_rate=to_decimal(row.annual_rate),
            term_months=row.term_months,
            payment=to_decimal(row.payment),
            total_interest=to_decimal(row.total_interest),
            total_payment=to_decimal(row.total_payment),
            schedule=schedule,
        )

    def get_all_simulations(
        self,
        *,
        limit: int = 100,
        offset: int = 0,
    ) -> list[SimulationResultDTO]:
        limit = min(limit, 1000)
        
        stmt = (
            select(Simulation)
            .order_by(Simulation.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        
        rows = self.session.execute(stmt).scalars().all()
        
        results = []
        for row in rows:
            schedule = json_to_schedule(row.schedule)
            results.append(
                SimulationResultDTO(
                    simulation_id=row.id,
                    folio=row.folio,
                    name=row.name,
                    last_name=row.last_name,
                    document_id=row.document_id,
                    principal=to_decimal(row.principal),
                    annual_rate=to_decimal(row.annual_rate),
                    term_months=row.term_months,
                    payment=to_decimal(row.payment),
                    total_interest=to_decimal(row.total_interest),
                    total_payment=to_decimal(row.total_payment),
                    schedule=schedule,
                )
            )
        
        return results
    
    def count_simulations(self) -> int:
        stmt = select(func.count()).select_from(Simulation)
        return self.session.execute(stmt).scalar() or 0
