from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import models

from app.api import locations
from app.api import sensors
from app.api import predictions
from app.api import alerts


# =========================================================
# Create Database Tables
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# Create FastAPI Application
# =========================================================

app = FastAPI(
    title="Landslide Risk Monitoring System",
    description="AI-Based Early Warning and Landslide Risk Monitoring System in NER",
    version="1.0.0"
)


# =========================================================
# CORS Configuration
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Register API Routes
# =========================================================

app.include_router(locations.router)
app.include_router(sensors.router)
app.include_router(predictions.router)
app.include_router(alerts.router)


# =========================================================
# Root Endpoint
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Landslide Risk Monitoring System API is running"
    }


# =========================================================
# Health Check Endpoint
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }