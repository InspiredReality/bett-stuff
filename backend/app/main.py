from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.settings import settings
from app.db import engine, Base
from app.routers import auth_router, bets_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")

    yield

    # Shutdown: cleanup if needed
    pass


def create_app() -> FastAPI:
    app = FastAPI(
        title="Bett Stuff API",
        description="API for Scratch Bets betting application",
        version="1.0.0",
        lifespan=lifespan
    )

    # Configure CORS
    origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(bets_router, prefix="/api/bets", tags=["bets"])

    @app.get("/")
    def root():
        return {"message": "Bett Stuff API", "status": "running"}

    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app


app = create_app()
