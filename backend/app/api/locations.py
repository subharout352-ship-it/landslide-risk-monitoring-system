from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Location
from app.schemas.location import LocationCreate, LocationResponse


router = APIRouter(
    prefix="/locations",
    tags=["Locations"]
)


# Create a new location
@router.post("/", response_model=LocationResponse)
def create_location(
    location: LocationCreate,
    db: Session = Depends(get_db)
):
    new_location = Location(
        name=location.name,
        latitude=location.latitude,
        longitude=location.longitude
    )

    db.add(new_location)
    db.commit()
    db.refresh(new_location)

    return new_location


# Get all locations
@router.get("/", response_model=list[LocationResponse])
def get_locations(
    db: Session = Depends(get_db)
):
    return db.query(Location).all()