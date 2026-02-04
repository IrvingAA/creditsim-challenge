from __future__ import annotations

import logging
import random
import time

from app.application.dtos.risk_audit_dto import RiskAuditPayload
from app.application.ports import RiskAuditPort

logger = logging.getLogger(__name__)


class RandomRiskAuditService(RiskAuditPort):
    def __init__(
        self,
        *,
        min_delay_seconds: float = 1.0,
        max_delay_seconds: float = 3.0,
        failure_rate: float = 0.10,
    ) -> None:
        self._min_delay_seconds = min_delay_seconds
        self._max_delay_seconds = max_delay_seconds
        self._failure_rate = failure_rate

    def notify(self, *, payload: RiskAuditPayload) -> None:
        delay = random.uniform(self._min_delay_seconds, self._max_delay_seconds)
        time.sleep(delay)

        if random.random() < self._failure_rate:
            logger.error(
                "Risk audit failed for simulation_id=%s after %.2fs",
                payload.simulation_id,
                delay,
            )
            raise RuntimeError("Risk audit failed")

        logger.info(
            "Risk audit completed for simulation_id=%s in %.2fs",
            payload.simulation_id,
            delay,
        )
