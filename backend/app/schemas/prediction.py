from pydantic import BaseModel


class PredictionResponse(BaseModel):
    id: int
    location_id: int
    risk_level: str
    risk_score: float

    class Config:
        from_attributes = True