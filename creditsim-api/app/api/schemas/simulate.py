from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field, conint, model_validator

class SimulateRequest(BaseModel):
    name: str | None = Field(None, min_length=1, examples=["Juan"])
    last_name: str | None = Field(None, min_length=1, examples=["Pérez"])
    document_id: str | None = Field(None, min_length=3, examples=["ABC123456"])
    principal: Decimal = Field(..., gt=0, examples=["100000.00"])
    annual_rate: Decimal = Field(..., ge=0, examples=["0.12"])
    term_months: conint(gt=0) = Field(..., examples=[12])

    @model_validator(mode="after")
    def validate_borrower_fields(self) -> "SimulateRequest":
        provided = [self.name is not None, self.last_name is not None, self.document_id is not None]
        if any(provided) and not all(provided):
            raise ValueError("name, last_name, and document_id must be provided together")
        return self

class PaymentRowOut(BaseModel):
    period: int
    payment: Decimal
    interest: Decimal
    principal: Decimal
    balance: Decimal

class SimulateResponse(BaseModel):
    simulation_id: UUID
    folio: str
    name: str | None
    last_name: str | None
    document_id: str | None
    principal: Decimal
    annual_rate: Decimal
    term_months: int
    payment: Decimal
    total_interest: Decimal
    total_payment: Decimal
    schedule: list[PaymentRowOut]

class SimulationVerifyRequest(BaseModel):
    folio: str = Field(..., min_length=4, examples=["COT-12CXS99"])
    last_name: str | None = Field(None, min_length=1, examples=["Pérez"])
    document_id: str | None = Field(None, min_length=3, examples=["ABC123456"])
    name: str | None = Field(None, min_length=1, examples=["Juan"])

    @model_validator(mode="after")
    def validate_identity_fields(self) -> "SimulationVerifyRequest":
        if self.document_id is not None and self.last_name is None:
            raise ValueError("last_name is required when document_id is provided")
        if self.name is not None and self.last_name is None:
            raise ValueError("last_name is required when name is provided")
        return self

class SimulationListItem(BaseModel):
    simulation_id: str
    folio: str
    name: str | None
    last_name: str | None
    principal: str
    annual_rate: str
    term_months: int
    payment: str
    total_interest: str
    total_payment: str

class SimulationListResponse(BaseModel):
    total: int
    limit: int
    offset: int
    items: list[SimulationListItem]
