from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.i18n import parse_accept_language


class LanguageMiddleware(BaseHTTPMiddleware):
    """Middleware to detect and store client language preference."""
    
    async def dispatch(self, request: Request, call_next):
        accept_language = request.headers.get("Accept-Language", "en")
        language = parse_accept_language(accept_language)
        
        request.state.language = language
        
        response = await call_next(request)
        return response
