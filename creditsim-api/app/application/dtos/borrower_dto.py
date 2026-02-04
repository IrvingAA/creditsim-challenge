from dataclasses import dataclass


@dataclass(frozen=True)
class BorrowerInfo:
    name: str | None
    last_name: str | None
    document_id: str | None
