from __future__ import annotations

import json

from redis import Redis

from app.application.dtos.amortization_cache_dto import AmortizationCacheEntry
from app.application.ports import AmortizationCachePort
from app.core.config import settings
from app.infrastructure.serializers import to_decimal, schedule_to_json, json_to_schedule

def _serialize(entry: AmortizationCacheEntry) -> str:
    payload = {
        "payment": str(entry.payment),
        "total_interest": str(entry.total_interest),
        "total_payment": str(entry.total_payment),
        "schedule": schedule_to_json(entry.schedule),
    }
    return json.dumps(payload, separators=(",", ":"))

def _deserialize(raw: str) -> AmortizationCacheEntry | None:
    try:
        payload = json.loads(raw)
        schedule = json_to_schedule(payload["schedule"])
        return AmortizationCacheEntry(
            schedule=schedule,
            payment=to_decimal(payload["payment"]),
            total_interest=to_decimal(payload["total_interest"]),
            total_payment=to_decimal(payload["total_payment"]),
        )
    except (KeyError, ValueError, TypeError, json.JSONDecodeError):
        return None

class RedisAmortizationCacheAdapter(AmortizationCachePort):
    def __init__(
        self,
        *,
        redis_url: str | None = None,
        ttl_seconds: int | None = None,
    ) -> None:
        url = redis_url or settings.cache_redis_url
        if not url:
            raise ValueError("Redis URL is required for cache adapter")
        self._redis = Redis.from_url(url, decode_responses=True)
        self._ttl_seconds = ttl_seconds if ttl_seconds is not None else settings.cache_ttl_seconds

    def get(self, *, key: str) -> AmortizationCacheEntry | None:
        try:
            raw = self._redis.get(key)
            if raw is None:
                return None
            return _deserialize(raw)
        except Exception:
            return None

    def set(
        self,
        *,
        key: str,
        value: AmortizationCacheEntry,
        ttl_seconds: int | None = None,
    ) -> None:
        try:
            payload = _serialize(value)
            ttl = ttl_seconds if ttl_seconds is not None else self._ttl_seconds
            if ttl and ttl > 0:
                self._redis.setex(key, ttl, payload)
            else:
                self._redis.set(key, payload)
        except Exception:
            return None
