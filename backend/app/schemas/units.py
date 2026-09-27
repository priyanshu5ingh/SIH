"""
Pydantic models for Unit API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UnitBase(BaseModel):
    id: int = Field(..., example=1)
    floor_id: int = Field(..., example=1)
    unit_number: str = Field(..., example="101")
    unit_type: str = Field(..., example="residential")
    area_sqm: Optional[float] = Field(None, example=50.0)
    is_active: bool = True


class UnitCreate(UnitBase):
    pass


class UnitUpdate(BaseModel):
    unit_number: Optional[str] = None
    unit_type: Optional[str] = None
    area_sqm: Optional[float] = None
    is_active: Optional[bool] = None


class Unit(UnitBase):
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
