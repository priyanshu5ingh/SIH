"""
ULPIN API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import ulpin as models
from app.schemas import ulpin as schemas

router = APIRouter()


@router.post("/", response_model=schemas.ULPIN, status_code=status.HTTP_201_CREATED)
def create_ulpin(
    ulpin_in: schemas.ULPINCreate,
    db: Session = Depends(get_db)
):
    """
    Create new ULPIN.
    """
    # Check if ULPIN already exists
    db_ulpin = db.query(models.Parcel).filter(models.Parcel.ulpin == ulpin_in.ulpin).first()
    if db_ulpin:
        raise HTTPException(
            status_code=400,
            detail="ULPIN already exists in the system"
        )

    # Create new parcel
    db_parcel = models.Parcel(**ulpin_in.dict())
    db.add(db_parcel)
    db.commit()
    db.refresh(db_parcel)
    return db_parcel


@router.get("/{ulpin}", response_model=schemas.ULPIN)
def get_ulpin(
    ulpin: str,
    db: Session = Depends(get_db)
):
    """
    Get ULPIN by ID.
    """
    db_ulpin = db.query(models.Parcel).filter(models.Parcel.ulpin == ulpin).first()
    if db_ulpin is None:
        raise HTTPException(
            status_code=404,
            detail="ULPIN not found"
        )
    return db_ulpin


@router.put("/{ulpin}", response_model=schemas.ULPIN)
def update_ulpin(
    ulpin: str,
    ulpin_in: schemas.ULPINUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing ULPIN parcel.
    """
    db_ulpin = db.query(models.Parcel).filter(models.Parcel.ulpin == ulpin).first()
    if db_ulpin is None:
        raise HTTPException(
            status_code=404,
            detail="ULPIN not found"
        )
    update_data = ulpin_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_ulpin, field, value)
    db.commit()
    db.refresh(db_ulpin)
    return db_ulpin


@router.delete("/{ulpin}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ulpin(
    ulpin: str,
    db: Session = Depends(get_db)
):
    """
    Delete a ULPIN parcel.
    """
    db_ulpin = db.query(models.Parcel).filter(models.Parcel.ulpin == ulpin).first()
    if db_ulpin is None:
        raise HTTPException(
            status_code=404,
            detail="ULPIN not found"
        )
    db.delete(db_ulpin)
    db.commit()
    return None


@router.get("/", response_model=List[schemas.ULPIN])
def get_ulpins(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get multiple ULPINs.
    """
    ulpins = db.query(models.Parcel).offset(skip).limit(limit).all()
    return ulpins