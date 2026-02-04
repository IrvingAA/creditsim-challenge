import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.infrastructure.db.base import Base


class Simulation(Base):
    __tablename__ = "simulations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    folio: Mapped[str] = mapped_column(String(12), nullable=False, unique=True)

    name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    document_id: Mapped[str | None] = mapped_column(String(64), nullable=True)

    principal: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    annual_rate: Mapped[Decimal] = mapped_column(Numeric(6, 4), nullable=False)
    term_months: Mapped[int] = mapped_column(Integer, nullable=False)

    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="MXN")

    payment: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_interest: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    total_payment: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)

    schedule: Mapped[list] = mapped_column(JSONB, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
