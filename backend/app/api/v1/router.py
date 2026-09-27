"""
API v1 router.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import ulpin, parcels, buildings, floors, units, underground, datasources, ml, spatial

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(ulpin.router, prefix="/ulpin", tags=["ulpin"])
api_router.include_router(parcels.router, prefix="/parcels", tags=["parcels"])
api_router.include_router(buildings.router, prefix="/buildings", tags=["buildings"])
api_router.include_router(floors.router, prefix="/floors", tags=["floors"])
api_router.include_router(units.router, prefix="/units", tags=["units"])
api_router.include_router(underground.router, prefix="/underground", tags=["underground"])
api_router.include_router(datasources.router, prefix="/datasources", tags=["datasources"])
api_router.include_router(ml.router, prefix="/ml", tags=["machine learning"])
api_router.include_router(spatial.router, prefix="/spatial", tags=["spatial processing"])