"""
Ultimate 3D ULPIN Generation and Vertical Property Mapping System
FastAPI Backend Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title="Ultimate 3D ULPIN System",
    description="Advanced 3D Cadastral System for Smart India Hackathon 2026",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Ultimate 3D ULPIN System"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Ultimate 3D ULPIN Generation and Vertical Property Mapping System",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)