# Competitor Code Evidence Analysis

This document analyzes the implementation of various SIH26011 projects to determine what is genuinely implemented versus mocked, hardcoded, or synthetic.

| Project | Feature | Claimed | Actual implementation | Evidence file/function | Real/Synthetic/Mock | Gap |
|---------|---------|---------|----------------------|------------------------|---------------------|-----|
| SIH-Ultimate-3D-ULPIN-System | 3D ULPIN Generation | System generates standardized 3D ULPINs for parcels, buildings, floors, units | Backend provides CRUD operations for ULPINs tied to parcels; ULPIN must be provided by user (not auto-generated) | backend/app/models/ulpin.py (Parcel class), backend/app/api/v1/endpoints/ulpin.py, backend/app/schemas/ulpin.py | Real | ULPINs are not auto-generated from spatial data; user must supply them |
| SIH-Ultimate-3D-ULPIN-System | Vertical Property Mapping | System maps vertical and underground ownership rights | Backend has models for Buildings, Floors, Units, Underground Structures; API endpoints exist; frontend visualizes building height | backend/app/models/ulpin.py (Building, BuildingFloor, BuildingUnit, UndergroundStructure classes), backend/app/api/v1/endpoints/buildings.py, floors.py, units.py, underground.py, frontend/src/pages/MapView.js (Building component) | Real | No automatic assignment of ULPINs to vertical subdivisions (floors/units); ULPIN remains at parcel level |
| SIH-Ultimate-3D-ULPIN-System | Data Integration (Drone/LiDAR/GIS) | System integrates drone imagery, LiDAR/3D point cloud data, GIS parcel layers, building floor plans, GNSS/CORS coordinates, DEM/DSM | Backend has DataSource model and API endpoints; spatial processing endpoints exist but are backed by mock implementations (GDAL, GeoPandas, PDAL) that return random/fixed data | backend/app/models/ulpin.py (DataSource class), backend/app/api/v1/endpoints/datasources.py, backend/app/api/v1/endpoints/spatial.py, backend/spatial/gdal.py, backend/spatial/geopandas.py, backend/spatial/pdal.py | Mock | No actual processing of real geospatial data; all spatial data processing is simulated |
| SIH-Ultimate-3D-ULPIN-System | AI/ML: Automated Building Extraction | AI/ML capabilities for automated building extraction from imagery | Backend has ML endpoint for building extraction but backed by mock implementation that generates random detections | backend/app/api/v1/endpoints/ml.py, backend/ml/building_extraction.py | Mock | No actual AI/ML model; building extraction results are randomly generated |
| SIH-Ultimate-3D-ULPIN-System | AI/ML: Floor Segmentation | AI/ML capabilities for floor segmentation | Backend has ML endpoint for floor segmentation but backed by mock implementation | backend/app/api/v1/endpoints/ml.py, backend/ml/building_extraction.py (FloorSegmenter class) | Mock | No actual AI/ML model; floor segmentation results are randomly generated |
| SIH-Ultimate-3D-ULPIN-System | AI/ML: Topology Validation | AI/ML capabilities for intelligent topology validation | Backend has ML endpoint for topology validation but backed by mock implementation | backend/app/api/v1/endpoints/ml.py, backend/ml/building_extraction.py (TopologyValidator class) | Mock | No actual AI/ML model; validation results are randomly generated |
| SIH-Ultimate-3D-ULPIN-System | 3D Visualization | Advanced 3D mapping with slicing, measurement, and analysis tools | Frontend provides 3D visualization of parcels and buildings using Three.js; includes measurement and slice tools (basic implementations) | frontend/src/pages/MapView.js | Real | Visualization is basic; measurement tool only supports distance; slice tool is placeholder; no actual analysis integration |

## Note on Other Repositories

The following repositories mentioned in the task were not found in the local filesystem and therefore could not be analyzed:
- BoundaryLens
- GeoVISTA/SIH26011-3D-ULPIN
- COSMOPLOT/3D-ULPIN-Vertical-Property-Mapping
- GeoLayer 3D
- Xarjun Patil SIH26011 project
- Abhinav Prabhakar SIH26011 project
- Other SIH26011 repositories

Searches were conducted in the Downloads directory and its subdirectories for directories matching these names, and no matches were found.

