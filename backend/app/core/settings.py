from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://localhost/bett_stuff")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    ADMIN_EMAILS: str = os.getenv("ADMIN_EMAILS", "")

    # JWT settings
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def admin_emails_list(self) -> List[str]:
        return [email.strip() for email in self.ADMIN_EMAILS.split(",") if email.strip()]

    class Config:
        env_file = ".env"


settings = Settings()
