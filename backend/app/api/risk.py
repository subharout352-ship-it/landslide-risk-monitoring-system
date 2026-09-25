from fastapi import APIRouter
from pydantic import BaseModel

from app.ml.predict import predict_risk # type: ignore


router = APIRouter(
    prefix="/risk",
    tags=["Risk Prediction"]
)


class RiskRequest(BaseModel):
    rainfall: float
    soil_moisture: float
    temperature: float
    humidity: float
    slope: float


class RiskResponse(BaseModel):
    risk_level: str


@router.post("/predict", response_model=RiskResponse)
def predict_landslide_risk(data: RiskRequest):

    risk = predict_risk(
        rainfall=data.rainfall,
        soil_moisture=data.soil_moisture,
        temperature=data.temperature,
        humidity=data.humidity,
        slope=data.slope
    )

    return {
        "risk_level": risk
    }
