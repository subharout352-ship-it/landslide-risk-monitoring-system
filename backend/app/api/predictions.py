from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.ml.predict import predict_risk
from app.models.models import SensorData, RiskPrediction, Alert


router = APIRouter(
    prefix="/predictions",
    tags=["Risk Predictions"]
)


# ---------------------------------------------------------
# GET - Check Prediction API
# ---------------------------------------------------------
@router.get("/")
def get_predictions():
    return {
        "message": "Prediction API is working"
    }


# ---------------------------------------------------------
# POST - Predict Landslide Risk
# ---------------------------------------------------------
@router.post("/predict")
def create_prediction(
    location_id: int,
    rainfall: float,
    soil_moisture: float,
    temperature: float,
    humidity: float,
    slope: float,
    db: Session = Depends(get_db)
):
    try:

        # 1. Run ML prediction
        prediction_result = predict_risk(
            rainfall,
            soil_moisture,
            temperature,
            humidity,
            slope
        )

        # 2. Get prediction result
        if isinstance(prediction_result, dict):

            risk_level = prediction_result.get(
                "risk",
                prediction_result.get(
                    "risk_level",
                    "LOW"
                )
            )

            risk_score = prediction_result.get(
                "probability",
                prediction_result.get(
                    "risk_probability",
                    prediction_result.get(
                        "risk_score",
                        0.0
                    )
                )
            )

        else:
            risk_level = str(prediction_result)
            risk_score = 0.0

        risk_level = str(risk_level).upper()
        risk_score = float(risk_score)

        # 3. Save sensor data
        sensor = SensorData(
            location_id=location_id,
            rainfall=rainfall,
            soil_moisture=soil_moisture,
            temperature=temperature,
            humidity=humidity,
            slope=slope
        )

        db.add(sensor)
        db.commit()
        db.refresh(sensor)

        # 4. Save risk prediction
        prediction = RiskPrediction(
            location_id=location_id,
            risk_level=risk_level,
            risk_score=risk_score
        )

        db.add(prediction)
        db.commit()
        db.refresh(prediction)

        # 5. Create HIGH risk alert
        alert_created = False

        if risk_level == "HIGH":

            alert = Alert(
                location_id=location_id,
                message="High landslide risk detected. Immediate warning recommended.",
                severity="HIGH",
                is_active=True
            )

            db.add(alert)
            db.commit()

            alert_created = True

        # 6. Return result
        return {
            "message": "Landslide risk prediction completed successfully",
            "location_id": location_id,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "alert_created": alert_created,
            "sensor_id": sensor.id,
            "prediction_id": prediction.id
        }

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# ---------------------------------------------------------
# GET - Get Saved Predictions
# ---------------------------------------------------------
@router.get("/history")
def get_prediction_history(
    db: Session = Depends(get_db)
):
    predictions = db.query(RiskPrediction).all()

    return predictions