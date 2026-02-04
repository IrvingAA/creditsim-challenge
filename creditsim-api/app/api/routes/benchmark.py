import time
from decimal import Decimal
from fastapi import APIRouter, Depends, Request

from app.api.schemas.benchmark import BenchmarkResult, CompareResult, ConfigResult
from app.api.deps import get_risk_audit_port, get_amortization_cache_port
from app.application.ports import RiskAuditPort, AmortizationCachePort
from app.application.dtos.risk_audit_dto import RiskAuditPayload
from app.application.folio import generate_folio
from app.domain.amortization.loan_input import LoanInput
from app.domain.amortization.french import build_schedule
from app.domain.amortization.calculations import calculate_totals
from app.infrastructure.db.deps import get_session
from app.infrastructure.repositories.simulation_repo import SqlAlchemySimulationRepository
from app.application.use_cases.simulate_credit import simulate_credit
from app.infrastructure.risk_audit.random_audit import RandomRiskAuditService
from app.infrastructure.risk_audit.disabled_adapter import DisabledRiskAuditAdapter
from app.infrastructure.amortization_cache.disabled_adapter import DisabledAmortizationCacheAdapter
from app.core.i18n import t

router = APIRouter(prefix="/benchmark", tags=["benchmark"])


def create_test_loan():
    return LoanInput(
        principal=Decimal("100000.00"),
        annual_rate=Decimal("0.12"),
        term_months=12,
    )


@router.get("/ping")
def ping(request: Request):
    lang = getattr(request.state, "language", "en")
    return {"status": "ok", "message": t("benchmark_pong", lang)}


@router.get("/domain-only", response_model=BenchmarkResult)
def benchmark_domain(request: Request):
    lang = getattr(request.state, "language", "en")
    start = time.perf_counter()
    schedule = build_schedule(create_test_loan())
    elapsed_ms = (time.perf_counter() - start) * 1000
    
    return BenchmarkResult(
        test_name="Pure amortization calculation",
        elapsed_ms=round(elapsed_ms, 2),
        complies_requirement=elapsed_ms < 100,
        requirement_threshold_ms=100.0,
        message=t("benchmark_fast", lang) if elapsed_ms < 100 else t("benchmark_slow", lang),
        details={
            "periods_calculated": len(schedule),
            "includes_database": False,
            "includes_audit": False,
        }
    )


@router.post("/async-audit", response_model=BenchmarkResult)
def benchmark_async_audit(
    request: Request,
    session=Depends(get_session),
    audit_port: RiskAuditPort = Depends(get_risk_audit_port),
    cache_port: AmortizationCachePort = Depends(get_amortization_cache_port),
):
    lang = getattr(request.state, "language", "en")
    start = time.perf_counter()
    repo = SqlAlchemySimulationRepository(session)
    
    result = simulate_credit(
        payload=create_test_loan(),
        borrower=None,
        repo=repo,
        audit_port=audit_port,
        cache_port=cache_port,
    )
    
    elapsed_ms = (time.perf_counter() - start) * 1000
    complies = elapsed_ms < 500
    
    return BenchmarkResult(
        test_name="Async audit (Celery) - CORRECT",
        elapsed_ms=round(elapsed_ms, 2),
        complies_requirement=complies,
        requirement_threshold_ms=500.0,
        message=t("benchmark_audit_not_blocked", lang) if complies else t("benchmark_too_slow", lang),
        details={
            "simulation_id": str(result.simulation_id),
            "folio": result.folio,
            "includes_database": True,
            "audit_execution": "ASYNC (Celery worker)",
            "audit_blocks_response": False,
        }
    )


@router.post("/sync-audit-wrong", response_model=BenchmarkResult)
def benchmark_sync_audit_wrong(
    request: Request,
    session=Depends(get_session),
    cache_port: AmortizationCachePort = Depends(get_amortization_cache_port),
):
    lang = getattr(request.state, "language", "en")
    start = time.perf_counter()
    repo = SqlAlchemySimulationRepository(session)
    loan = create_test_loan()
    
    schedule = build_schedule(loan)
    payment, total_interest, total_payment = calculate_totals(schedule)
    folio = generate_folio()
    
    simulation_id = repo.create_simulation(
        input=loan,
        borrower=None,
        folio=folio,
        payment=payment,
        total_interest=total_interest,
        total_payment=total_payment,
        schedule=schedule,
    )
    
    audit_service = RandomRiskAuditService()
    audit_payload = RiskAuditPayload(
        simulation_id=simulation_id,
        loan_input=loan,
        payment=payment,
        total_interest=total_interest,
        total_payment=total_payment,
    )
    
    try:
        audit_service.notify(payload=audit_payload)
    except RuntimeError:
        pass
    
    elapsed_ms = (time.perf_counter() - start) * 1000
    
    return BenchmarkResult(
        test_name="Sync audit - WRONG (demo only)",
        elapsed_ms=round(elapsed_ms, 2),
        complies_requirement=elapsed_ms < 500,
        requirement_threshold_ms=500.0,
        message=t("benchmark_audit_blocked", lang) if elapsed_ms >= 500 else t("benchmark_fast_by_chance", lang),
        details={
            "simulation_id": str(simulation_id),
            "folio": folio,
            "includes_database": True,
            "audit_execution": "SYNC (inline)",
            "audit_blocks_response": True,
        }
    )


@router.post("/compare", response_model=CompareResult)
def benchmark_compare(request: Request, session=Depends(get_session)):
    from app.infrastructure.amortization_cache.redis_adapter import RedisAmortizationCacheAdapter
    from app.infrastructure.risk_audit.celery_adapter import CeleryRiskAuditAdapter
    from app.core.config import settings
    
    lang = getattr(request.state, "language", "en")
    repo = SqlAlchemySimulationRepository(session)
    loan = create_test_loan()
    
    redis_cache = RedisAmortizationCacheAdapter() if settings.cache_redis_url else DisabledAmortizationCacheAdapter()
    celery_audit = CeleryRiskAuditAdapter() if settings.celery_broker_url else DisabledRiskAuditAdapter()
    
    start = time.perf_counter()
    simulate_credit(
        payload=loan,
        borrower=None,
        repo=repo,
        audit_port=celery_audit,
        cache_port=redis_cache,
    )
    full_elapsed = (time.perf_counter() - start) * 1000
    
    start = time.perf_counter()
    simulate_credit(
        payload=loan,
        borrower=None,
        repo=repo,
        audit_port=DisabledRiskAuditAdapter(),
        cache_port=redis_cache,
    )
    cache_elapsed = (time.perf_counter() - start) * 1000
    
    start = time.perf_counter()
    simulate_credit(
        payload=loan,
        borrower=None,
        repo=repo,
        audit_port=DisabledRiskAuditAdapter(),
        cache_port=DisabledAmortizationCacheAdapter(),
    )
    minimal_elapsed = (time.perf_counter() - start) * 1000
    
    insights = []
    
    cache_enabled = settings.cache_redis_url is not None
    celery_enabled = settings.celery_broker_url is not None
    
    if cache_enabled and cache_elapsed < minimal_elapsed:
        cache_improvement = ((minimal_elapsed - cache_elapsed) / minimal_elapsed) * 100
        insights.append(t("insight_redis_improvement", lang, percent=f"{cache_improvement:.1f}"))
    elif not cache_enabled:
        insights.append(t("insight_redis_unavailable", lang))
    
    if celery_enabled and cache_enabled and full_elapsed < minimal_elapsed:
        full_improvement = ((minimal_elapsed - full_elapsed) / minimal_elapsed) * 100
        insights.append(t("insight_full_improvement", lang, percent=f"{full_improvement:.1f}"))
    elif not celery_enabled:
        insights.append(t("insight_celery_unavailable", lang))
    
    if full_elapsed < 100:
        insights.append(t("insight_meets_requirement", lang))
    
    winner = "full_stack" if full_elapsed <= cache_elapsed else "cache_only"
    
    return CompareResult(
        full_stack=ConfigResult(
            config_name="Redis Cache + Celery Async Audit",
            cache_enabled=cache_enabled,
            async_audit_enabled=celery_enabled,
            elapsed_ms=round(full_elapsed, 2),
            speedup_vs_minimal=round(minimal_elapsed / full_elapsed, 2) if full_elapsed > 0 else None,
        ),
        cache_only=ConfigResult(
            config_name="Redis Cache + No Audit",
            cache_enabled=cache_enabled,
            async_audit_enabled=False,
            elapsed_ms=round(cache_elapsed, 2),
            speedup_vs_minimal=round(minimal_elapsed / cache_elapsed, 2) if cache_elapsed > 0 else None,
        ),
        minimal=ConfigResult(
            config_name="No Cache + No Audit (baseline)",
            cache_enabled=False,
            async_audit_enabled=False,
            elapsed_ms=round(minimal_elapsed, 2),
            speedup_vs_minimal=1.0,
        ),
        winner=winner,
        insights=insights,
    )
