from pydantic import BaseModel


class AlertCreate(BaseModel):
    location_id: int
    message: str
    severity: str
    is_active: bool = True


class AlertResponse(BaseModel):
    id: int
    location_id: int
    message: str
    severity: str
    is_active: bool

    class Config:
        from_attributes = True