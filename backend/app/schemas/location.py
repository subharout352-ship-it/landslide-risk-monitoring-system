from pydantic import BaseModel


class LocationBase(BaseModel):
    name: str
    latitude: float
    longitude: float


class LocationCreate(LocationBase):
    pass


class LocationResponse(LocationBase):
    id: int

    class Config:
        from_attributes = True