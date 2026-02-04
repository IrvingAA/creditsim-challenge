from __future__ import annotations

import secrets
import string
from typing import Callable

from app.application.errors import PersistenceError

ALPHANUM = string.ascii_uppercase + string.digits


def generate_folio(*, prefix: str = "COT-", length: int = 7) -> str:
    """Generate a random alphanumeric folio with the given prefix."""
    return prefix + "".join(secrets.choice(ALPHANUM) for _ in range(length))

def generate_unique_folio(
    *,
    folio_exists: Callable[[str], bool],
    max_attempts: int = 5,
    generator: Callable[[], str] = generate_folio,
) -> str:
    for _ in range(max_attempts):
        candidate = generator()
        if not folio_exists(candidate):
            return candidate
    
    raise PersistenceError("Unable to generate unique folio")
