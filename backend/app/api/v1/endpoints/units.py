"""
Unit API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import ulpin as models
from app.schemas import units as schemas

router = APIRouter()


@router.post("/", response_model=schemas.Unit, status_code=status.HTTP_201_CREATED)
def create_unit(
    unit_in: schemas.UnitCreate,
    db: Session = Depends(get_db)
):
    """
    Create new unit.
    """
    # Check if unit already exists
    db_unit = db.query(models.Unit).filter(models.Unit.id == unit_in.id).first()
    if db_unit:
        raise HTTPException(
            status_code=400,
            detail="Unit already exists"
        )

    # Create new unit
    db_unit = db.query(models.Unit)(**unit_in.dict())
    db.add(db_unit)
    db.commit()
    db.refresh(db_unit)
    return db_unit


@router.get("/{unit_id}", response_model=schemas.Unit)
def get_unit(
    unit_id: int,
    db: Session = Depends(get_db)
):
    """
    Get unit by ID.
    """
    db_unit = db.query(models.Unit).filter(models.Unit.id == unit_id).first()
    if db_unit is None:
        raise HTTPException(
            status_code=404,
            detail="Unit not found"
        )
    return db_unit


@router.put("/{unit_id}", response_model=schemas.Unit)
def update_unit(
    unit_id: int,
    unit_in: schemas.UnitUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing unit.
    """
    db_unit = db.query(models.Unit).filter(models.Unit.id == unit_id).first()
    if db_unit is None:
        raise HTTPException(
            status_code=404,
            detail="Unit not found"
        )
    # Update fields
    update_data = unit_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_unit, field, value)
    db.commit()
    db.refresh(db_unit)
    return db_unit


@router.delete("/{unit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_unit(
    unit_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a unit.
    """
    db_unit = db.query(models.Unit).filter(models.Unit.id == unit_id).first()
    if db_unit is None:
        raise HTTPException(
            status_code=404,
            detail="Unit not found"
        )
    db.delete(db_unit)
    db.commit()
    return None


@router.get("/", response_model=List[schemas.Unit])
def get_units(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get multiple units.
    """
    units = db.query(models.Unit).offset(skip).limit(limit).all()
    return units
