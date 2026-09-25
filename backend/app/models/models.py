from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean
from sqlalchemy.sql import func

from app.database import Base


# =========================================================
# Location Model
# =========================================================

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)


# =========================================================
# Sensor Data Model
# =========================================================

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)

    location_id = Column(Integer, nullable=False)

    rainfall = Column(Float, default=0.0)
    soil_moisture = Column(Float, default=0.0)
    temperature = Column(Float, default=0.0)
    humidity = Column(Float, default=0.0)
    slope = Column(Float, default=0.0)

    recorded_at = Column(
        DateTime,
        server_default=func.now()
    )


# =========================================================
# Risk Prediction Model
# =========================================================

class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(Integer, primary_key=True, index=True)

    location_id = Column(Integer, nullable=False)

    risk_level = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)

    predicted_at = Column(
        DateTime,
        server_default=func.now()
    )


# =========================================================
# Alert Model
# =========================================================

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    location_id = Column(Integer, nullable=False)

    message = Column(String, nullable=False)
    severity = Column(String, nullable=False)

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )