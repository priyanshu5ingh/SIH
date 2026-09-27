"""
Data sources API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import ulpin as models
from app.schemas import datasources as schemas

router = APIRouter()


@router.post("/", response_model=schemas.DataSource, status_code=status.HTTP_201_CREATED)
def create_data_source(
    source_in: schemas.DataSourceCreate,
    db: Session = Depends(get_db)
):
    """
    Create new data source.
    """
    db_source = models.DataSource(**source_in.dict())
    db.add(db_source)
    db.commit()
    db.refresh(db_source)
    return db_source


from app.core.pilot_adapter import get_pilot_metadata

@router.get("/")
def get_data_sources(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get multiple data sources from real pilot dataset metadata.
    """
    meta = get_pilot_metadata()
    sources = meta.get("sources", [])
    return sources[skip:skip+limit]


@router.get("/{source_id}")
def get_data_source(
    source_id: str,
    db: Session = Depends(get_db)
):
    """
    Get data source by index or provider name.
    """
    meta = get_pilot_metadata()
    sources = meta.get("sources", [])
    try:
        idx = int(source_id)
        if 0 <= idx < len(sources):
            return sources[idx]
    except ValueError:
        for s in sources:
            if s.get("name") == source_id or s.get("provider") == source_id:
                return s
    raise HTTPException(
        status_code=404,
        detail="Data source not found in pilot metadata"
    )