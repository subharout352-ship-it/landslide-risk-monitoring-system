from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Alert
from app.schemas.alert import AlertCreate, AlertResponse


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


@router.get("/")
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).all()


@router.post("/", response_model=AlertResponse)
def create_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db)
):
    new_alert = Alert(
        location_id=alert.location_id,
        message=alert.message,
        severity=alert.severity,
        is_active=alert.is_active
    )

    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    return new_alert