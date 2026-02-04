"""Global exception handlers for API layer."""
import logging

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.application.errors import PersistenceError, SimulationNotFoundError
from app.core.i18n import t

def get_lang(request: Request) -> str:
    """Get language from request state (set by LanguageMiddleware)."""
    return getattr(request.state, "language", "en")

logger = logging.getLogger(__name__)

def register_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers for the application."""
    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(
        request: Request,  
        exc: RequestValidationError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "validation_error",
                    "detail": jsonable_encoder(exc.errors()),
                }
            },
        )

    @app.exception_handler(ValueError)
    async def value_error_handler(
        request: Request,  
        exc: ValueError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "invalid_input",
                    "detail": str(exc),
                }
            },
        )

    @app.exception_handler(PersistenceError)
    async def persistence_error_handler(
        request: Request,  
        exc: PersistenceError,
    ) -> JSONResponse:
        logger.exception("Database error", exc_info=exc)
        lang = get_lang(request)
        return JSONResponse(
            status_code=503,
            content={
                "error": {
                    "code": "db_error",
                    "detail": t("db_error_detail", lang),
                }
            },
        )

    @app.exception_handler(SimulationNotFoundError)
    async def simulation_not_found_handler(
        request: Request,  
        exc: SimulationNotFoundError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=404,
            content={
                "error": {
                    "code": "not_found",
                    "detail": str(exc),
                }
            },
        )

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_error_handler(
        request: Request,  
        exc: SQLAlchemyError,
    ) -> JSONResponse:
        logger.exception("Database error", exc_info=exc)
        lang = get_lang(request)
        return JSONResponse(
            status_code=503,
            content={
                "error": {
                    "code": "db_error",
                    "detail": t("db_error_detail", lang),
                }
            },
        )
