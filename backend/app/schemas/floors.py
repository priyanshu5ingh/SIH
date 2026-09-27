"""
Pydantic models for Floor API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FloorBase(BaseModel):
    id: int = Field(..., example=1)
    building_id: int = Field(..., example=1)
    floor_number: int = Field(..., example=1)
    floor_name: Optional[str] = Field(None, example="Ground Floor")
    area_sqm: Optional[float] = Field(None, example=100.0)
    height_m: Optional[float] = Field(None, example=3.0)
    ceiling_height_m: Optional[float] = Field(None, example=2.8)
    is_active: bool = True


class FloorCreate(FloorBase):
    pass


class FloorUpdate(BaseModel):
    floor_name: Optional[str] = None
    area_sqm: Optional[float] = None
    height_m: Optional[float] = None
    ceiling_height_m: Optional[float] = None
    is_active: Optional[bool] = None


class Floor(FloorBase):
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
