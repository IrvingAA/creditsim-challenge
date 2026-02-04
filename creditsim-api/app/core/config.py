from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    app_name: str = "creditsim-api"
    env: str = "dev"
    log_level: str = "INFO"

    # Infra
    database_url: str
    redis_url: str | None = None
    risk_audit_enabled: bool = True
    celery_broker_url: str | None = None
    celery_result_backend: str | None = None
    cache_enabled: bool = False
    cache_redis_url: str | None = None
    cache_ttl_seconds: int = 86400

    def model_post_init(self, __context) -> None:
        if self.celery_broker_url is None:
            self.celery_broker_url = self.redis_url
        if self.celery_result_backend is None:
            self.celery_result_backend = self.redis_url
        if self.cache_redis_url is None:
            self.cache_redis_url = self.redis_url

settings = Settings()
