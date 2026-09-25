from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import SensorData
from app.schemas.sensor import SensorDataCreate, SensorDataResponse


router = APIRouter(
    prefix="/sensors",
    tags=["Sensor Data"]
)


@router.post("/", response_model=SensorDataResponse)
def create_sensor_data(
    sensor: SensorDataCreate,
    db: Session = Depends(get_db)
):
    new_sensor = SensorData(
        location_id=sensor.location_id,
        rainfall=sensor.rainfall,
        soil_moisture=sensor.soil_moisture,
        temperature=sensor.temperature,
        humidity=sensor.humidity,
        slope=sensor.slope
    )

    db.add(new_sensor)
    db.commit()
    db.refresh(new_sensor)

    return new_sensor


@router.get("/", response_model=list[SensorDataResponse])
def get_sensor_data(db: Session = Depends(get_db)):
    return db.query(SensorData).all()