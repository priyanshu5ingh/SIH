"""
SQLAlchemy models for ULPIN entities.
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(Integer, primary_key=True, index=True)
    ulpin = Column(String(20), unique=True, index=True, nullable=False)
    parcel_name = Column(String(255), nullable=False)
    description = Column(Text)
    area_sqm = Column(Float)
    boundary_wkt = Column(Text)  # Well-Known Text representation of polygon
    centroid_lat = Column(Float)
    centroid_lng = Column(Float)
    elevation_min = Column(Float)
    elevation_max = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    buildings = relationship("Building", back_populates="parcel")
    underground_structures = relationship("UndergroundStructure", back_populates="parcel")


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id"))
    building_name = Column(String(255), nullable=False)
    description = Column(Text)
    footprint_wkt = Column(Text)  # 2D footprint
    num_floors_above = Column(Integer, default=0)
    num_floors_below = Column(Integer, default=0)
    height_m = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parcel = relationship("Parcel", back_populates="buildings")
    floors = relationship("BuildingFloor", back_populates="building")


class BuildingFloor(Base):
    __tablename__ = "building_floors"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"))
    floor_number = Column(Integer)  # Negative for basement, 0 for ground, positive for above
    floor_name = Column(String(100))
    area_sqm = Column(Float)
    height_m = Column(Float)
    ceiling_height_m = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    building = relationship("Building", back_populates="floors")
    units = relationship("BuildingUnit", back_populates="floor")


class BuildingUnit(Base):
    __tablename__ = "building_units"

    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("building_floors.id"))
    unit_number = Column(String(50))
    unit_type = Column(String(100))  # residential, commercial, industrial, etc.
    area_sqm = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    floor = relationship("BuildingFloor", back_populates="units")


class UndergroundStructure(Base):
    __tablename__ = "underground_structures"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id"))
    structure_name = Column(String(255), nullable=False)
    structure_type = Column(String(100))  # tunnel, pipeline, cable, basement, etc.
    description = Column(Text)
    depth_min_m = Column(Float)
    depth_max_m = Column(Float)
    footprint_wkt = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parcel = relationship("Parcel", back_populates="underground_structures")


class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    source_type = Column(String(100))  # drone, lidar, satellite, survey, etc.
    description = Column(Text)
    file_path = Column(String(500))
    extra_metadata = Column(Text)  # JSON metadata
    is_processed = Column(Boolean, default=False)
    processed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())