"""
Underground API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import ulpin as models
from app.schemas import underground as schemas

router = APIRouter()


@router.post("/", response_model=schemas.Underground, status_code=status.HTTP_201_CREATED)
def create_underground(
    underground_in: schemas.UndergroundCreate,
    db: Session = Depends(get_db)
):
    """
    Create new underground structure.
    """
    # Check if underground structure already exists
    db_underground = db.query(models.Underground).filter(models.Underground.id == underground_in.id).first()
    if db_underground:
        raise HTTPException(
            status_code=400,
            detail="Underground structure already exists"
        )

    # Create new underground structure
    db_underground = models.Underground(**underground_in.dict())
    db.add(db_underground)
    db.commit()
    db.refresh(db_underground)
    return db_underground


from app.core.pilot_adapter import get_all_underground

@router.get("/")
def get_undergrounds(
    skip: int = 0,
    limit: int = 100,
    parcel_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get multiple underground structures from real pilot dataset.
    Returns empty list with 'NO VERIFIED SUBSURFACE DATA IN SOURCE' notice if no subsurface source attribute exists.
    """
    undergrounds = get_all_underground()
    if parcel_id:
        undergrounds = [u for u in undergrounds if u.get("parcel_id") == parcel_id]
    return undergrounds[skip:skip+limit]


@router.get("/{underground_id}")
def get_underground(
    underground_id: str,
    db: Session = Depends(get_db)
):
    """
    Get underground structure by ID.
    """
    undergrounds = get_all_underground()
    for u in undergrounds:
        if str(u.get("id")) == str(underground_id):
            return u
    raise HTTPException(
        status_code=404,
        detail="NO VERIFIED SUBSURFACE DATA IN SOURCE for requested ID"
    )

