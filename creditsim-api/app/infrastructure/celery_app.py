from __future__ import annotations

from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "creditsim",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=[
        "app.infrastructure.risk_audit.tasks",
    ],
)

celery_app.conf.update(
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    broker_connection_retry_on_startup=True,
)
