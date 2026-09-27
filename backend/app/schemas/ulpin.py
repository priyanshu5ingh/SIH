"""
Pydantic models for ULPIN API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ULPINBase(BaseModel):
    ulpin: str = Field(..., max_length=20, example="ULPIN12345678901234")
    parcel_name: str = Field(..., example="Parcel A-101")
    description: Optional[str] = None
    area_sqm: Optional[float] = Field(None, gt=0)
    boundary_wkt: Optional[str] = None
    centroid_lat: Optional[float] = Field(None, ge=-90, le=90)
    centroid_lng: Optional[float] = Field(None, ge=-180, le=180)
    elevation_min: Optional[float] = None
    elevation_max: Optional[float] = None
    is_active: bool = True


class ULPINCreate(ULPINBase):
    pass


class ULPINUpdate(BaseModel):
    parcel_name: Optional[str] = None
    description: Optional[str] = None
    area_sqm: Optional[float] = Field(None, gt=0)
    boundary_wkt: Optional[str] = None
    centroid_lat: Optional[float] = Field(None, ge=-90, le=90)
    centroid_lng: Optional[float] = Field(None, ge=-180, le=180)
    elevation_min: Optional[float] = None
    elevation_max: Optional[float] = None
    is_active: Optional[bool] = None


class ULPIN(ULPINBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True