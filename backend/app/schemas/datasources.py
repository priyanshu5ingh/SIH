"""
Pydantic models for DataSource API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DataSourceBase(BaseModel):
    name: str = Field(..., max_length=255, example="Drone Survey - Karnataka Region")
    source_type: str = Field(..., example="drone")  # drone, lidar, satellite, survey, etc.
    description: Optional[str] = None
    file_path: Optional[str] = Field(None, max_length=500)
    metadata: Optional[str] = None  # JSON metadata
    is_processed: bool = False


class DataSourceCreate(DataSourceBase):
    pass


class DataSourceUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    source_type: Optional[str] = None
    description: Optional[str] = None
    file_path: Optional[str] = Field(None, max_length=500)
    metadata: Optional[str] = None
    is_processed: Optional[bool] = None


class DataSource(DataSourceBase):
    id: int
    is_processed: bool
    processed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True