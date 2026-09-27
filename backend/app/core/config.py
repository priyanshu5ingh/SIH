"""
Application configuration module.
"""
import os
import secrets
from typing import List, Union, Any
from urllib.parse import quote_plus


class Settings:
    def __init__(self):
        # Application
        self.PROJECT_NAME = os.getenv("PROJECT_NAME", "Ultimate 3D ULPIN System")
        self.VERSION = os.getenv("VERSION", "1.0.0")
        self.API_V1_STR = os.getenv("API_V1_STR", "/api/v1")
        self.DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

        # Security
        self.SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
        self.ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 8)))  # 8 days
        self.ALGORITHM = os.getenv("ALGORITHM", "HS256")

        # Database - Use SQLite for simplicity (no external dependencies needed)
        # For PostgreSQL, set DATABASE_URL environment variable to:
        # postgresql://user:password@host:port/database
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            self.SQLALCHEMY_DATABASE_URI = database_url
        else:
            # Default to SQLite for ease of setup
            self.SQLALCHEMY_DATABASE_URI = "sqlite:///./sih_ulpin.db"

        # CORS
        cors_origins = os.getenv("BACKEND_CORS_ORIGINS", "")
        if cors_origins:
            self.BACKEND_CORS_ORIGINS = [origin.strip() for origin in cors_origins.split(",")]
        else:
            self.BACKEND_CORS_ORIGINS = ["*"]

    # For compatibility with existing code that expects these attributes
    @property
    def POSTGRES_SERVER(self):
        return "localhost"

    @property
    def POSTGRES_USER(self):
        return "user"

    @property
    def POSTGRES_PASSWORD(self):
        return "password"

    @property
    def POSTGRES_DB(self):
        return "sih_ulpin"

    @property
    def POSTGRES_PORT(self):
        return "5432"


settings = Settings()
