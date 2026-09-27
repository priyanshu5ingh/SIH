"""
Pydantic models for Underground API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UndergroundBase(BaseModel):
    id: int = Field(..., example=1)
    parcel_id: int = Field(..., example=1)
    structure_name: str = Field(..., example="Tunnel A")
    structure_type: str = Field(..., example="tunnel")
    description: Optional[str] = None
    depth_min_m: Optional[float] = Field(None, example=2.0)
    depth_max_m: Optional[float] = Field(None, example=5.0)
    footprint_wkt: Optional[str] = None
    is_active: bool = True


class UndergroundCreate(UndergroundBase):
    pass


class UndergroundUpdate(BaseModel):
    structure_name: Optional[str] = None
    structure_type: Optional[str] = None
    description: Optional[str] = None
    depth_min_m: Optional[float] = None
    depth_max_m: Optional[float] = None
    footprint_wkt: Optional[str] = None
    is_active: Optional[bool] = None


class Underground(UndergroundBase):
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
