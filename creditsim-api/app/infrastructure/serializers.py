from decimal import Decimal

from app.domain.amortization.payment_row import PaymentRow


def to_decimal(value: object) -> Decimal:
    return Decimal(str(value))

def payment_row_to_dict(row: PaymentRow) -> dict[str, str | int]:
    return {
        "period": row.period,
        "payment": str(row.payment),
        "interest": str(row.interest),
        "principal": str(row.principal),
        "balance": str(row.balance),
    }

def dict_to_payment_row(data: dict) -> PaymentRow:
    return PaymentRow(
        period=int(data["period"]),
        payment=Decimal(str(data["payment"])),
        interest=Decimal(str(data["interest"])),
        principal=Decimal(str(data["principal"])),
        balance=Decimal(str(data["balance"])),
    )

def schedule_to_json(schedule: list[PaymentRow]) -> list[dict]:
    return [payment_row_to_dict(row) for row in schedule]


def json_to_schedule(schedule_json: list[dict]) -> list[PaymentRow]:
    return [dict_to_payment_row(row) for row in schedule_json]
