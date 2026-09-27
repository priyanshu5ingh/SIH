"""
Floor API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import ulpin as models
from app.schemas import floors as schemas

router = APIRouter()


@router.post("/", response_model=schemas.Floor, status_code=status.HTTP_201_CREATED)
def create_floor(
    floor_in: schemas.FloorCreate,
    db: Session = Depends(get_db)
):
    """
    Create new floor.
    """
    # Verify building exists
    building = db.query(models.Building).filter(models.Building.id == floor_in.building_id).first()
    if not building:
        raise HTTPException(
            status_code=404,
            detail="Building not found"
        )

    # Create new floor
    db_floor = models.BuildingFloor(**floor_in.dict())
    db.add(db_floor)
    db.commit()
    db.refresh(db_floor)
    return db_floor


from app.core.pilot_adapter import get_all_floors

@router.get("/")
def get_floors(
    skip: int = 0,
    limit: int = 100,
    building_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get multiple floors backed by real pilot dataset.
    """
    floors = get_all_floors()
    if building_id:
        floors = [f for f in floors if f.get("building_id") == building_id]
    return floors[skip:skip+limit]


@router.get("/{floor_id}")
def get_floor(
    floor_id: str,
    db: Session = Depends(get_db)
):
    """
    Get floor by ID.
    """
    floors = get_all_floors()
    for f in floors:
        if f.get("id") == floor_id or f.get("code") == floor_id:
            return f
    raise HTTPException(
        status_code=404,
        detail="Floor not found in pilot dataset"
    )