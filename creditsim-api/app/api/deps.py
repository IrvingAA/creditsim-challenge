"""FastAPI dependencies for infrastructure adapters."""
from __future__ import annotations

from fastapi import Depends

from app.application.ports import RiskAuditPort, AmortizationCachePort
from app.core.config import settings
from app.infrastructure.db.deps import get_session
from app.infrastructure.repositories.simulation_repo import SqlAlchemySimulationRepository


def get_simulation_repo(session=Depends(get_session)) -> SqlAlchemySimulationRepository:
    """Provide simulation repository instance."""
    return SqlAlchemySimulationRepository(session)

def get_risk_audit_port() -> RiskAuditPort:
    """Provide risk audit adapter based on environment."""
    if settings.env == "test" or not settings.risk_audit_enabled:
        from app.infrastructure.risk_audit.disabled_adapter import DisabledRiskAuditAdapter

        return DisabledRiskAuditAdapter()

    from app.infrastructure.risk_audit.celery_adapter import CeleryRiskAuditAdapter

    return CeleryRiskAuditAdapter()

def get_amortization_cache_port() -> AmortizationCachePort:
    """Provide cache adapter based on environment and configuration."""
    if settings.env == "test" or not settings.cache_enabled:
        from app.infrastructure.amortization_cache.disabled_adapter import (
            DisabledAmortizationCacheAdapter,
        )

        return DisabledAmortizationCacheAdapter()

    if not settings.cache_redis_url:
        from app.infrastructure.amortization_cache.disabled_adapter import (
            DisabledAmortizationCacheAdapter,
        )

        return DisabledAmortizationCacheAdapter()

    from app.infrastructure.amortization_cache.redis_adapter import (
        RedisAmortizationCacheAdapter,
    )

    return RedisAmortizationCacheAdapter()
