"""
Pydantic models for Building API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BuildingBase(BaseModel):
    parcel_id: int = Field(..., gt=0)
    building_name: str = Field(..., example="Building A-101")
    description: Optional[str] = None
    footprint_wkt: Optional[str] = None
    num_floors_above: int = Field(0, ge=0)
    num_floors_below: int = Field(0, ge=0)
    height_m: Optional[float] = Field(None, gt=0)
    is_active: bool = True


class BuildingCreate(BuildingBase):
    pass


class BuildingUpdate(BaseModel):
    parcel_id: Optional[int] = Field(None, gt=0)
    building_name: Optional[str] = None
    description: Optional[str] = None
    footprint_wkt: Optional[str] = None
    num_floors_above: Optional[int] = Field(None, ge=0)
    num_floors_below: Optional[int] = Field(None, ge=0)
    height_m: Optional[float] = Field(None, gt=0)
    is_active: Optional[bool] = None


class Building(BuildingBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True