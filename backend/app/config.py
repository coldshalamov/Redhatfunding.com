from functools import lru_cache
from pydantic import AnyUrl, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', env_prefix='')

    database_url: str = 'sqlite+aiosqlite:///./dev.db'
    api_key: str = 'change-me'
    sales_inbox: EmailStr = 'sales@redhatfunding.com'
    slack_webhook: str | None = None
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    allowed_origins: list[AnyUrl] | None = None

    rate_limit_requests: int = 30
    rate_limit_window_seconds: int = 300


@lru_cache
def get_settings() -> Settings:
    return Settings()
