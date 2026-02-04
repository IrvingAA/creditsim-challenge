from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.logging import configure_logging
from app.api.errors import register_exception_handlers
from app.api.middleware.language import LanguageMiddleware
from app.api.routes.health import router as health_router
from app.api.routes.simulate import router as simulate_router
from app.api.routes.simulations import router as simulations_router
from app.api.routes.benchmark import router as benchmark_router


def create_app() -> FastAPI:
    configure_logging(settings.log_level)

    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        docs_url=None,
        redoc_url=None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(LanguageMiddleware)

    register_exception_handlers(app)

    app.include_router(health_router)
    app.include_router(simulate_router)
    app.include_router(simulations_router)
    app.include_router(benchmark_router)

    static_dir = Path(__file__).resolve().parent / "static"
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

    @app.get("/docs", include_in_schema=False)
    def swagger_docs():
        return get_swagger_ui_html(
            openapi_url=app.openapi_url,
            title=f"{settings.app_name} Docs",
            swagger_css_url="/static/swagger-dark.css",
            swagger_ui_parameters={"syntaxHighlight.theme": "monokai"},
        )

    @app.get("/redoc", include_in_schema=False)
    def redoc_docs():
        return get_redoc_html(
            openapi_url=app.openapi_url,
            title=f"{settings.app_name} ReDoc",
        )

    return app

app = create_app()
