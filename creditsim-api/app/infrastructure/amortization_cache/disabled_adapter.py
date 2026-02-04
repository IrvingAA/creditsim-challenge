from __future__ import annotations

from app.application.dtos.amortization_cache_dto import AmortizationCacheEntry
from app.application.ports import AmortizationCachePort

class DisabledAmortizationCacheAdapter(AmortizationCachePort):
    def get(self, *, key: str) -> AmortizationCacheEntry | None:
        return None

    def set(
        self,
        *,
        key: str,
        value: AmortizationCacheEntry,
        ttl_seconds: int | None = None,
    ) -> None:
        return None
