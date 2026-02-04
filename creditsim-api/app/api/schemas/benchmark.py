from pydantic import BaseModel

class BenchmarkResult(BaseModel):
    test_name: str
    elapsed_ms: float
    complies_requirement: bool
    requirement_threshold_ms: float
    message: str
    details: dict | None = None


class ConfigResult(BaseModel):
    config_name: str
    cache_enabled: bool
    async_audit_enabled: bool
    elapsed_ms: float
    speedup_vs_minimal: float | None = None


class CompareResult(BaseModel):
    full_stack: ConfigResult
    cache_only: ConfigResult
    minimal: ConfigResult
    winner: str
    insights: list[str]
