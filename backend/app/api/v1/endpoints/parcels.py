"""
Parcel API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import ulpin as models
from app.schemas import parcels as schemas

router = APIRouter()


@router.post("/", response_model=schemas.Parcel, status_code=status.HTTP_201_CREATED)
def create_parcel(
    parcel_in: schemas.ParcelCreate,
    db: Session = Depends(get_db)
):
    """
    Create new parcel.
    """
    # Check if ULPIN already exists
    db_parcel = db.query(models.Parcel).filter(models.Parcel.ulpin == parcel_in.ulpin).first()
    if db_parcel:
        raise HTTPException(
            status_code=400,
            detail="ULPIN already exists in the system"
        )

    # Create new parcel
    db_parcel = models.Parcel(**parcel_in.dict())
    db.add(db_parcel)
    db.commit()
    db.refresh(db_parcel)
    return db_parcel


from app.core.pilot_adapter import get_all_parcels, get_parcel_by_id

@router.get("/")
def get_parcels(
    skip: int = 0,
    limit: int = 100,
    ulpin: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get multiple parcels backed by real pilot dataset.
    """
    parcels = get_all_parcels()
    if ulpin:
        parcels = [p for p in parcels if p.get("source_parcel_id") == ulpin or p.get("id") == ulpin]
    return parcels[skip:skip+limit]


@router.get("/{parcel_id}")
def get_parcel(
    parcel_id: str,
    db: Session = Depends(get_db)
):
    """
    Get parcel by ID or source parcel ID.
    """
    db_parcel = get_parcel_by_id(parcel_id)
    if db_parcel is None:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found in pilot dataset"
        )
    return db_parcel