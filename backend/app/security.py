from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader

from .config import get_settings


api_key_header = APIKeyHeader(name='X-API-Key', auto_error=False)


def get_api_key(api_key: str | None = Security(api_key_header)) -> str:
    settings = get_settings()
    if api_key and api_key == settings.api_key:
        return api_key
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid API key')
