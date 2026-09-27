"""
Building API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import ulpin as models
from app.schemas import buildings as schemas

router = APIRouter()


@router.post("/", response_model=schemas.Building, status_code=status.HTTP_201_CREATED)
def create_building(
    building_in: schemas.BuildingCreate,
    db: Session = Depends(get_db)
):
    """
    Create new building.
    """
    # Verify parcel exists
    parcel = db.query(models.Parcel).filter(models.Parcel.id == building_in.parcel_id).first()
    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found"
        )

    # Create new building
    db_building = models.Building(**building_in.dict())
    db.add(db_building)
    db.commit()
    db.refresh(db_building)
    return db_building


from app.core.pilot_adapter import get_all_buildings, get_building_by_id

@router.get("/")
def get_buildings(
    skip: int = 0,
    limit: int = 100,
    parcel_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get multiple buildings backed by real pilot dataset.
    """
    buildings = get_all_buildings()
    if parcel_id:
        buildings = [b for b in buildings if b.get("parcel_id") == parcel_id]
    return buildings[skip:skip+limit]


@router.get("/{building_id}")
def get_building(
    building_id: str,
    db: Session = Depends(get_db)
):
    """
    Get building by ID or building code.
    """
    db_building = get_building_by_id(building_id)
    if db_building is None:
        raise HTTPException(
            status_code=404,
            detail="Building not found in pilot dataset"
        )
    return db_building