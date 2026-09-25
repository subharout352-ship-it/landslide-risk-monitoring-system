from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SensorDataBase(BaseModel):
    location_id: int
    rainfall: float = 0.0
    soil_moisture: float = 0.0
    temperature: float = 0.0
    humidity: float = 0.0
    slope: float = 0.0


class SensorDataCreate(SensorDataBase):
    pass


class SensorDataResponse(SensorDataBase):
    id: int
    recorded_at: Optional[datetime] = None

    class Config:
        from_attributes = True