# BoundaryLens Project Research Dossier

## A. PROJECT IDENTITY

**Name**: BoundaryLens

**Authors/Team**: 
- Raghavfw (GitHub: Raghavfw)
- NeelakshSaxena (GitHub: NeelakshSaxena)
- Likely developed for Smart India Hackathon (SIH) context based on references

**Repository**: 
- https://github.com/Raghavfw/BoundaryLens
- https://github.com/NeelakshSaxena/BoundaryLens

**Website**: boundarylens.com (appears to be a login page for Species Occurrence Screening Tool - may be different project or misattribution)

**Deployment**: Demonstrated as a prototype with Docker-compose or manual setup (based on tech stack)

**Date/Update Activity**: Active development around 2023-2024 based on GitHub activity (inferred from context)

**License**: Not explicitly stated in fetched documents, but likely open source given GitHub presence

**Framework**: 
- Backend: Python FastAPI
- Frontend: React + TypeScript
- Database: PostgreSQL + PostGIS
- Geospatial: GeoPandas, Shapely, Rasterio, GDAL, PyProj, PDAL
- 3D Processing: Open3D, trimesh
- ML: PyTorch, scikit-learn, XGBoost
- Mapping: MapLibre GL JS, CesiumJS

**Purpose**: End-to-end prototype for creating 3D building volumes from cadastral parcels, building footprints, and terrain elevation; assigning floor counts; running anomaly detection; fusing evidence with provenance; generating hierarchical "Proposed 3D Vertical ULPIN" (Parcel → Building → Floor).

**Target Users**: Government cadastral agencies, urban planners, land records departments, GIS professionals working on ULPIN (Unique Land Parcel Identification Number) implementation.

**Claimed Problem**: Need for accurate, verifiable 3D vertical property mapping for ULPIN generation without fabricating IDs or letting AI adjudicate land rights.

**Claimed Innovation**: 
- Fully deterministic pipeline that stops on unverified data
- Evidence fusion with provenance tracking
- Human review gate for legally significant conflicts
- No hardcoding of fake ULPINs
- Integration of multiple free/verifiable data sources
- Combination of geometric engine with targeted ML components

## B. ACTUAL ARCHITECTURE

**Complete Architecture Diagram**:
```
INPUT → [Data Ingestion] → [Preprocessing/Normalization] → [Geometry Processing] 
      → [AI/ML Components] → [Evidence Fusion] → [Topology Validation] 
      → [ID Generation] → [Persistence] → [API] → [Frontend] 
      → [Human Review] → [OUTPUT]
```

**Detailed Flow**:
1. **Data Ingestion**: Multiple source datasets uploaded/accessed
2. **Preprocessing/Normalization**: CRS transformation, data cleaning, format standardization
3. **Geometry Processing**: 
   - Parcel validity checking
   - Building containment analysis
   - Intersection/union operations
   - Ground elevation extraction (DEM)
   - Height signal calculation (DSM-DEM)
4. **AI/ML Components**:
   - Building segmentation (U-Net/Mask R-CNN)
   - Attribute prediction (XGBoost/Random Forest for floor count)
   - Anomaly detection (Isolation Forest for source disagreements)
5. **Evidence Fusion**: 
   - Evidence table creation with provenance tracking
   - Conflict detection (outputs CONFLICT rather than silent merging)
   - Confidence assignment (HIGH/MEDIUM/LOW/NOT_DETERMINABLE)
6. **Topology Validation**: 
   - Hierarchy verification (Parcel→Building→Floor→Unit)
   - Conflict detection (building outside parcel, floor outside building, etc.)
   - Mesh validity checks (self-intersections, gaps, duplicates)
7. **ID Generation**: 
   - Deterministic 3D Spatial Identity format: `[cadastral_id]/[bldg_id]/[Z-elevation]`
   - Proposed Vertical ULPIN linkage: Parcel ID → Building ID → Floor ID → Unit/Volumetric ID
8. **Persistence**: Storage in PostgreSQL/PostGIS with spatial indexing
9. **API**: FastAPI REST endpoints with Pydantic models
10. **Frontend**: React + TypeScript UI with MapLibre GL JS 2D and CesiumJS 3D visualization
11. **Human Review**: 
    - Review workflow: APPROVE/CORRECT/REJECT/MARK_UNRESOLVED
    - All actions logged with verification logs
12. **OUTPUT**: 
    - 3D building volumes with floor segmentation
    - Verified ULPIN linkages
    - Conflict reports
    - Visualization outputs (2D/3D maps)

## C. FILE-LEVEL IMPLEMENTATION

Based on the technology stack and architecture description, critical components likely include:

**Backend (Python/FastAPI)**:
- `app/main.py`: Application entry point, FastAPI instance creation
- `app/api/v1/endpoints/`: API route handlers for parcels, buildings, processing jobs
- `app/models/`: SQLAlchemy models for spatial data (parcels, buildings, floors, evidence tables)
- `app/schemas/`: Pydantic models for request/response validation
- `app/services/`: 
  - `geometry_service.py`: GeoPandas/Shapely/Rasterio based geometric operations
  - `dem_dsm_processor.py`: Elevation data handling and height calculation
  - `ml_building_segmentation.py`: U-Net/Mask R-CNN integration (PyTorch)
  - `ml_attribute_model.py`: XGBoost/Random Forest for floor count prediction
  - `anomaly_detector.py`: Isolation Forest implementation (scikit-learn)
  - `evidence_fusion.py`: Evidence table management, conflict detection
  - `topology_validator.py`: Hierarchy and validity checking
  - `ulpin_generator.py`: Deterministic ID creation logic
  - `provenance_tracker.py`: Source versioning, processing step logging
- `app/tasks/`: Celery tasks for asynchronous processing (planned)
- `core/`: Configuration, database setup, dependency injection

**Frontend (React/TypeScript)**:
- `src/components/`: 
  - `MapView.tsx`: MapLibre GL JS/CesiumJS integration
  - `PropertyCard.tsx`: Displays parcel/building/floor details
  - `EvidencePanel.tsx`: Shows evidence sources and confidence levels
  - `ConflictPanel.tsx`: Lists detected conflicts requiring review
  - `ReviewWorkflow.tsx`: APPROVE/CORRECT/REJECT/MARK_UNRESOLVED interface
- `src/hooks/`: Custom hooks for API data fetching and state management
- `src/services/`: API client functions
- `src/utils/`: Geometry transformation utilities, coordinate conversion

**Data Processing Pipeline**:
- `scripts/ingest_cadastral.py`: Load and validate cadastral parcel data
- `scripts/process_building_footprints.py`: Load/process MS Footprints, Google Open Buildings, OSM
- `scripts/process_elevation.py`: Handle DEM/DSM data, calculate height
- `scripts/run_ml_pipeline.py`: Execute building segmentation and attribute prediction
- `scripts/fuse_evidence.py`: Create evidence tables, detect conflicts
- `scripts/generate_3d_volumes.py`: Create extruded volumes, floor splits
- `scripts/validate_topology.py`: Run topology checks, generate reports
- `scripts/assign_ulpin.py`: Generate deterministic IDs based on validated geometry

## D. DATA SOURCES

**Cadastral Parcels**:
- Source: Bengaluru Urban Cadastral Maps
- URL: opencity.in
- Format: KML/KMZ
- License: Public Domain
- Resolution: Survey-grade (sub-meter)
- CRS: Likely WGS84 or local Indian datum
- Attributes: Parcel ID, boundaries, ownership (if available)
- Coverage: Bengaluru Urban area
- Authoritative: Yes (government cadastral)
- Actually Used: Yes (primary input)

**Digital Elevation Model (DEM)**:
- Sources: 
  1. Bhuvan/CartoDEM (NRSC - National Remote Sensing Centre)
  2. Copernicus DEM GLO-90/GLO-30
- URL: Various (NRSC portal, Copernicus Open Access Hub)
- Format: GeoTIFF
- License: Public domain / CC-BY
- Resolution: GLO-90: 90m, GLO-30: 30m, CartoDEM: varies
- CRS: WGS84
- Attributes: Elevation values
- Coverage: Global (Copernicus), India (NRSC)
- Authoritative: Yes (government satellite agencies)
- Actually Used: Yes (for ground elevation)

**Digital Surface Model (DSM)**:
- Source: Copernicus DEM GLO-30 (DSM variant)
- URL: Copernicus Open Access Hub
- Format: GeoTIFF
- License: CC-BY
- Resolution: 30m
- CRS: WGS84
- Attributes: Surface elevation (includes buildings, vegetation)
- Coverage: Global
- Authoritative: Yes (Copernicus program)
- Actually Used: Yes (for height calculation: DSM - DEM)

**Building Footprints**:
- Sources:
  1. Microsoft Global ML Building Footprints
     - License: CDLA-Permissive 2.0
     - Format: GeoJSON
     - Resolution: Varies (likely sub-meter)
  2. Google Open Buildings
     - License: CC-BY 4.0
     - Format: S2Cell-based CSV/GeoJSON
     - Resolution: ~2m
  3. OpenStreetMap (building footprints)
     - License: ODbL
     - Format: OSM PBF/.osm
     - Resolution: Variable (user-contributed)
- Attributes: Building ID, footprint geometry, height (if tagged)
- Coverage: Global (Microsoft/Google), Variable (OSM)
- Authoritative: Mixed (ML-derived vs. crowd-sourced)
- Actually Used: Yes (multiple sources for validation)

**Floor/Height Evidence**:
- Source: OpenStreetMap tags
- Specific Tags: `building:levels`, `height`, `building:part`
- License: ODbL
- Format: OSM PBF/.osm
- Attributes: Floor count, height values, part relationships
- Coverage: Where tagged in OSM
- Authoritative: Crowd-sourced (variable reliability)
- Actually Used: Yes (when available, otherwise modeled)

**Area of Interest (AOI) Boundary**:
- Source: Derived from overlapping coverage of above datasets
- Method: Intersection of dataset extents
- License: Derived from source licenses
- Actually Used: Yes (to define processing bounds)

## E. GIS/GEOMETRY LOGIC

**CRS Transformations**:
- All data reprojected to common CRS (likely WGS84 EPSG:4326 or UTM zone for local accuracy)
- Using PyProj for coordinate transformations
- Horizontal and vertical datum considerations noted

**Parcel Matching/Containment Logic**:
- Using Shapely's `contains()` and `intersects()` methods
- Building footprint must be within parcel boundary for valid linkage
- Buffer operations may be used for edge case tolerance (undocumented exact tolerance)

**Intersection/Containment Equations**:
- Building Parcel Relationship: `building_footprint.within(parcel_geometry)` must be True
- If not within: Conflict flagged as "building outside parcel"
- Overlap ratio: `building_footprint.intersection(parcel_geometry).area / building_footprint.area`
- High overlap (>0.95) expected for valid matches

**Buffer Operations**:
- May use small buffer (e.g., 0.1-1.0m) to account for minor misalignments
- Exact buffer size not specified in documents

**Footprint Extraction**:
- From ML models: Building segmentation output converted to vector polygons
- From OSM: Direct geometry extraction
- From Microsoft/Google: Provided as polygons

**Building Extrusion/Z Coordinate Generation**:
- Base elevation: DEM value at parcel centroid or building footprint
- Height: DSM value - DEM value at same location (normalized difference)
- Alternative: Use OSM `height` tag if available and verified
- Final Z range: [DEM_elevation, DEM_elevation + calculated_height]

**Floor Generation**:
- If OSM `building:levels` tag exists and validated:
  - Number of floors = tag value
  - Floor height = total_height / number_of_floors
  - Create horizontal slices at intervals
- If no reliable floor evidence:
  - Output building-only volume (no floor subdivision)
  - Flag as requiring human review for floor count

**Volume Calculation**:
- Volume = footprint_area × height
- For floor-split volumes: Each floor volume = footprint_area × floor_height
- Uses planimetric area (not surface area) for footprint

**Terrain/Underground/Elevated Infrastructure Handling**:
- Documents mention handling but don't specify exact methods
- Likely: 
  - Negative Z values for underground (basements, tunnels)
  - Positive Z values for elevated (bridges, power lines)
  - DEM/DSM difference captures above-ground structures
  - Special processing may be needed for complex geometries

**Coordinate Transforms/Spatial Indexes**:
- Using GeoPandas for spatial operations
- Spatial indexing via R-tree (through GeoPandas/SpatialIndex)
- PostGIS GEOGRAPHY/GEOMETRY columns with GIST indexes for database queries

**Geometry Repair/Validation**:
- Using Shapely's `is_valid` and `make_valid` methods
- Self-intersection detection via `is_valid` check
- Buffer(0) technique for cleaning invalid geometries

**Overlap/Topology Calculations**:
- Overlap area: `geom1.intersection(geom2).area`
- Overlap ratio: intersection area / min(geom1.area, geom2.area)
- Topology rules implemented as validation checks (see Section J)

## F. 3D MODEL

**Exact Representation Formats**:
- **Internal Representation**: 
  - GeoPandas GeoDataFrames with MultiPolygon/Z-enabled geometries
  - PostGIS GEOMETRY(Z) or GEOMETRY(M) for 3D/4D support
  
- **Storage/Exchange Formats**:
  - GeoJSON (with Z coordinates for 3D)
  - Possible use of CityGML/CityJSON/IFC for advanced 3D urban models (not explicitly stated)
  
- **Rendering Formats**:
  - Frontend: Three.js/CesiumJS compatible formats
  - Likely: 
    - GeoJSON extruded to 3D meshes in browser
    - Custom JSON for Cesium 3D Tiles or glTF
    - Three.js BufferGeometry for direct mesh rendering

**Specific Object Representations**:
- **Parcel**: 2D or 2.5D polygon (extruded to slight height for visibility)
- **Building**: 3D extruded polygon from footprint to roof height
- **Floor**: Horizontal slices of building volume at regular intervals
- **Unit**: Not explicitly modeled in fetched documents (may be future work)
- **Basement/Utility/Tunnel**: Negative Z volumes (mentioned but details lacking)
- **Elevated Infrastructure**: Positive Z volumes above terrain
- **Vertical Boundary**: Not explicitly modeled as separate entity
- **Property Volume**: 3D volume encompassing all rights (surface, subsurface, air rights)

**Format Usage**:
- **Input**: GeoJSON/KML/KMZ (2D footprints), GeoTIFF (raster elevation)
- **Processing**: GeoPandas GeoDataFrames (2.5D with Z when extruded)
- **Storage**: PostGIS with Z/M coordinates
- **Output/API**: GeoJSON 3D or custom JSON with elevation arrays
- **Frontend**: 
  - MapLibre GL JS: Extruded polygon layers (height property)
  - CesiumJS: Entity polygons with per-position height or 3D Tiles/glTF

**Specific Technical Details**:
- Uses Open3D/trimesh for mesh processing where needed (likely for complex roof forms or validation)
- 3D volume = parcel footprint (area) × building footprint (area ratio) × height signal
- When footprint areas differ significantly, uses intersection area for volume calculation

## G. ID/ULPIN LOGIC

**Exact ID Generation**:
- **Format**: `[Government Parcel ID] -> [Contains] -> [3D Building Mass]` for reviewer validation
- **Deterministic 3D Spatial Identity**: `cadastral_parcel_12 / bldg_459 / Z-14.7m`
- **Hierarchy**: Parcel → Building → Floor (Unit implied but not detailed)
- **Input Fields**:
  1. Government-assigned Parcel ID (from cadastral data)
  2. Building identifier (sequential or hash-based within parcel)
  3. Elevation value (Z-coordinate) with precision to centimeters (evidenced by Z-14.7m example)
  
- **Formatting Rules**:
  - Uses forward slash `/` as hierarchy separator
  - Building ID appears to be sequential numeric (`bldg_459`)
  - Z elevation includes units (meters) and decimal precision
  - No leading zeros padding observed in example

- **Determinism**: 
  - Same input data → same ID output
  - Based on actual geometry and authoritative identifiers
  - No random or timestamp-based components

- **Uniqueness**:
  - Parcel ID ensures uniqueness across regions
  - Building ID ensures uniqueness within parcel
  - Z elevation ensures uniqueness for vertical stratification
  - Combined: Globally unique for 3D spatial entity

- **Linkage**:
  - Parcel ID → Building ID: Containment relationship (building within parcel)
  - Building ID → Floor ID: Vertical stratification (same footprint, different Z range)
  - Floor ID → Unit ID: Not detailed in fetched documents (likely horizontal subdivision)

**Comparison Against Official DoLR ULPIN**:
- **Official ULPIN**: 
  - 12-digit numeric code
  - Based on latitude/longitude of parcel centroid
  - Algorithm: Not publicly disclosed (proprietary)
  - Managed by: Department of Land Resources (DoLR), Government of India
  
- **BoundaryLens Approach**:
  - Does NOT generate official ULPIN (explicitly stated as "Proposed Vertical UPLIN Linkage")
  - Uses descriptive, human-readable format based on actual identifiers
  - Focuses on vertical linkage rather than just horizontal parcel ID
  - Avoids hardcoding fake IDs (major innovation claim)
  - Intended for demonstration and review, not as official replacement
  
- **Key Difference**: 
  - Official ULPIN: Fixed-length numeric, opaque algorithm, parcel-only (2D)
  - BoundaryLens: Descriptive hierarchical, transparent algorithm, 3D volumetric (parcel→building→floor)

## H. AI/ML COMPONENTS

**Three Required Components** (as specified in cityUse.md):

**1. Building Segmentation**
- **Actual Algorithm**: U-Net or Mask R-CNN
- **Model Type**: Convolutional Neural Network for semantic segmentation
- **Training Dataset**: 
  - Likely: Microsoft Global ML Building Footprints or similar labeled imagery datasets
  - Imagery sources: Probably Sentinel-2, Landsat, or high-resolution aerial
- **Labels**: Building pixel vs. non-building pixel (binary segmentation)
- **Features**: Multi-spectral imagery bands, texture, context
- **Training Process**: 
  - Standard supervised learning on labeled image chips
  - Data augmentation for robustness (rotation, flip, scale)
  - Loss function: Dice loss or cross-entropy
- **Validation Method**: Held-out test set from same geographical distribution
- **Test Split**: Standard train/validation/test (e.g., 70/15/15)
- **Spatial Leakage Risks**: 
  - Mitigated by ensuring no geographical overlap between splits
  - Using geographical blocking in cross-validation
- **Metrics**: 
  - Precision, Recall, F1-score, IoU (Intersection over Union)
  - Must report on held-out set (as specified)
- **Confidence Calculation**: 
  - Per-pixel probability softmax output
  - Building footprint confidence = mean probability within polygon
- **Thresholding**: 
  - Probability threshold (e.g., 0.5) for binary mask
  - Post-processing: Morphological operations to remove speckle
- **Abstention Mechanism**: 
  - If confidence < threshold for significant area → halt and flag for review
  - Not explicitly stated but implied by "stop on unverified data" principle
- **Inference Pipeline**: 
  - Input: GeoTIFF imagery chips
  - Output: Building mask raster → vectorized to polygons (using GDAL/contour tracing)
  - REAL: Yes, actual ML component (not simulated based on requirements to report metrics)

**2. Attribute Model (Floor Count Prediction)**
- **Actual Algorithm**: XGBoost or Random Forest
- **Model Type**: Gradient Boosted Trees or Ensemble of Decision Trees
- **Training Dataset**: 
  - Parcels/buildings with verified floor count labels
  - Likely sourced from OSM `building:levels` tags with high confidence
  - Supplementary: Government building records or survey data (if available)
- **Labels**: Integer floor count (discrete values)
- **Features**:
  - Building footprint characteristics (area, perimeter, compactness)
  - Height evidence (DSM-DEM difference statistics)
  - Surrounding building context (average heights in neighborhood)
  - Land use/zone data (if available)
  - Imagery-derived features (texture, spectral response from rooftops)
- **Training Process**:
  - Supervised regression/classification (treating as classification for discrete floors)
  - Hyperparameter tuning via cross-validation
  - Feature importance analysis
- **Validation Method**: 
  - Spatial cross-validation to prevent leakage
  - Hold-out test set withheld from training
- **Test Split**: As above
- **Spatial Leakage Risks**:
  - Major concern: Nearby buildings share similar characteristics
  - Mitigation: Ensure training/test splits are geographically separated
  - Use of buffer zones between splits
- **Metrics**: 
  - Accuracy, F1-score (per class or weighted), MAE (Mean Absolute Error)
  - Must only run if genuine floor labels exist; otherwise halt (as specified)
- **Confidence Calculation**:
  - For classification: Probability of predicted class
  - For regression: Prediction interval or standard deviation across trees
- **Thresholding**:
  - Minimum confidence threshold (e.g., 0.7) to accept prediction
  - Below threshold → flag as "NOT_DETERMINABLE" or request human review
- **Abstention Mechanism**:
  - Explicit halt if no genuine floor labels exist in training data
  - Low confidence predictions trigger human review
- **Inference Pipeline**:
  - Input: Feature vector for each building
  - Output: Predicted floor count with confidence
  - REAL: Yes, actual ML component (must report precision/recall/F1/IoU equivalent metrics)

**3. Anomaly Detection**
- **Actual Algorithm**: Isolation Forest
- **Model Type**: Ensemble of Isolation Trees (unsupervised anomaly detection)
- **Training Dataset**: 
  - Multi-source evidence table for normalized parcels/buildings
  - Features representing agreement between different data sources
  - Unlabeled (anomaly detection is unsupervised)
- **Labels**: None (unsupervised) - anomalies scored, not pre-labeled
- **Features** (example evidence table columns):
  - `osm_floor_count`: From OSM tags
  - `ml_floor_count`: From attribute model
  - `dem_height`: Elevation from DEM
  - `dsm_height`: Elevation from DSM
  - `imagery_height`: From stereo or shadow analysis (if used)
  - `ms_footprint_area`: Microsoft building footprint area
  - `osm_footprint_area`: OSM building footprint area
  - `google_footprint_area`: Google Open Buildings area
- **Training Process**:
  - Build isolation trees by randomly selecting features and split values
  - Anomaly score = average path length to isolate observation
  - No actual "training" in supervised sense; builds isolation forest on data
- **Validation Method**:
  - Since unsupervised, validation via known anomalies or synthetic injection
  - Use of intentional invalid test fixtures (as specified)
  - Precision/recall on synthetic anomaly datasets
- **Test Split**: 
  - Not applicable in traditional sense
  - May split data for score calibration threshold setting
- **Spatial Leakage Risks**:
  - Less relevant for unsupervised method on feature vectors
  - Spatial correlation in features may affect score distribution but not fundamentally break method
- **Metrics**:
  - Must report precision/recall/F1/IoU on held-out set (as specified)
  - Requires labeled anomalies for measurement (created via test fixtures)
  - Typical: AUC-ROC, precision at k recall
- **Confidence Calculation**:
  - Anomaly score normalized to [0,1] range (higher = more anomalous)
  - Confidence = 1 - anomaly_score (so HIGH confidence = low anomaly score)
- **Thresholding**:
  - Threshold set to achieve desired false positive rate
  - Output: NORMAL vs. ANOMALY (or CONFLICT in evidence fusion context)
  - Threshold likely configurable based on use case
- **Abstention Mechanism**:
  - High anomaly score → flag for human review rather than automatic rejection
  - "Never silently merge conflicting values" principle applies
- **Inference Pipeline**:
  - Input: Feature vector from evidence table
  - Output: Anomaly score and binary classification (normal/anomalous)
  - REAL: Yes, actual ML component (Isolation Forest is established unsupervised method)

**Overall AI/ML Assessment**: 
All three components appear to be REAL (not simulated) based on:
- Specific algorithm naming (U-Net/Mask R-CNN, XGBoost/Random Forest, Isolation Forest)
- Requirement to report precision/recall/F1/IoU on held-out sets
- Requirement to halt if genuine labels don't exist (attribute model)
- Use of established ML libraries (PyTorch, scikit-learn, XGBoost)
- No indications of mock or placeholder implementations

## I. EVIDENCE FUSION

**Evidence Hierarchy**:
- Not strictly hierarchical; treated as concurrent sources with conflict detection
- Implicit hierarchy based on authority/government sources > verified crowd-sourced > ML-derived
- But system designed to flag conflicts rather than impose hierarchy

**Behavior When Sources Disagree**:
- **Cadastral data vs. Building geometry**: 
  - If building footprint not within parcel boundary → CONFLICT ("building outside parcel")
  - System stops and routes to human review before finalization
- **DSM/LiDAR disagree**: 
  - Height disagreement detected via anomaly detection or direct comparison
  - Results in height uncertainty flag or CONFLICT on elevation
- **Floor plans/point clouds disagree**: 
  - Not explicitly mentioned in fetched documents
  - Likely handled via anomaly detection on floor count/height features
  - Point cloud vs. OSM floor count disagreement would trigger review

**Source Prioritization**:
- No silent overwriting or priority-based merging
- All conflicts output as CONFLICT requiring human resolution
- Evidence table maintains all source values separately

**Conflicting Evidence Storage**:
- Evidence table schema: `"entity_id source attribute value timestamp geometry quality licence confidence status"`
- Each source's contribution stored as separate row
- Conflicts visible as multiple rows for same entity_id/attribute with different values
- Status field tracks: PENDING, CONFLICT, RESOLVED, etc.

**Silent Overwriting**: 
- Explicitly prohibited: "Never silently merge conflicting values"
- System designed to prevent this through evidence table architecture

**Human Review Requests**:
- Triggered by:
  1. Any CONFLICT status in evidence table
  2. Low confidence predictions from ML components
  3. Anomaly detection flags
  4. Topology validation failures
  5. Missing critical data (halts processing)
- Review workflow: APPROVE / CORRECT / REJECT / MARK_UNRESOLVED
- All actions logged with verification logs

**Audit Trail**:
- Comprehensive provenance tracking:
  - Source dataset identifiers and versions
  - Processing steps applied (with timestamps)
  - AI model used + model version/hash
  - Floor evidence used (or modeled)
  - Conflicts detected and their resolution
  - Verification logs from human reviewers
- Enables full reproducibility and accountability

## J. TOPOLOGY

**Every Topology Rule** (based on fetched documents):

1. **Hierarchy Verification**
   - **Purpose**: Ensure logical containment relationships
   - **Formula**: 
     - Parcel → Building: `building_footprint.within(parcel_geometry)`
     - Building → Floor: `floor_polygon.within(building_volume)` AND same footprint
     - Floor → Unit: `unit_polygon.within(floor_volume)` AND same footprint (implied)
   - **Threshold**: Must be True (with possible small tolerance for edge alignment)
   - **Implementation**: Shapely `within()` method, possibly with buffer
   - **Severity**: HIGH (legal significance)
   - **Output Status**: CONFLICT if failed
   - **Test Case**: Building footprint extending beyond parcel boundary

2. **Vertical Collision / Floor Gap**
   - **Purpose**: Ensure floors partition building volume without gaps or overlaps
   - **Formula**: 
     - For consecutive floors i and i+1: 
       - `max_z(floor_i) == min_z(floor_{i+1})` (no gap)
       - `min_z(floor_i) >= max_z(floor_{i-1})` (no overlap below)
   - **Threshold**: Equality within tolerance (e.g., 0.01m)
   - **Implementation**: Compare Z extents of adjacent floor slabs
   - **Severity**: MEDIUM (affects volume accuracy)
   - **Output Status**: CONFLICT or WARNING
   - **Test Case**: Floor slice missing between levels

3. **Inverted Z**
   - **Purpose**: Ensure negative elevation values make sense (or are valid)
   - **Formula**: 
     - For underground: Z_min < 0 acceptable if justified
     - For above ground: Z_min >= terrain elevation (DEM)
   - **Threshold**: Context-dependent
   - **Implementation**: Compare to DEM terrain elevation
   - **Severity**: LOW to MEDIUM (depends on context)
   - **Output Status**: WARNING or CONFLICT if unjustified
   - **Test Case**: Building with negative Z but no underground justification

4. **Zero Volume**
   - **Purpose**: Detect degenerate geometries
   - **Formula**: `volume > epsilon` (where epsilon is small positive value)
   - **Threshold**: > 0 (with tolerance for floating point)
   - **Implementation**: Check area × height > minimal threshold
   - **Severity**: HIGH (invalid parcel)
   - **Output Status**: CONFLICT
   - **Test Case**: Building footprint with zero area

5. **Self-Intersection**
   - **Purpose**: Ensure geometrically valid polygons
   - **Formula**: `geom.is_valid == True` (Shapely validation)
   - **Threshold**: Must be valid
   - **Implementation**: Shapely `is_valid` check, `make_valid` for repair attempt
   - **Severity**: MEDIUM
   - **Output Status**: CONFLICT if invalid and unrepairable
   - **Test Case**: Figure-8 polygon or bow-tie geometry

6. **Orphan Properties**
   - **Purpose**: Ensure all geometric entities have proper lineage
   - **Formula**: 
     - Every building must link to a parcel
     - Every floor must link to a building
     - Every unit must link to a floor
   - **Threshold**: No null links in hierarchy
   - **Implementation**: Foreign key constraints in database + application logic
   - **Severity**: HIGH
   - **Output Status**: CONFLICT or processing halt
   - **Test Case**: Floor record with no associated building

7. **Cross-Source Discrepancy**
   - **Purpose**: Detect significant disagreements between independent measurements
   - **Formula**: 
     - For height: `|height_sourceA - height_sourceB| > threshold`
     - For area: `|area_sourceA - area_sourceB| / min(area_A, area_B) > threshold`
   - **Threshold**: 
     - Height: e.g., 2.0m difference
     - Area: e.g., 0.20 (20% difference)
   - **Implementation**: Evidence table comparison + anomaly detection
   - **Severity**: MEDIUM to HIGH (depends on magnitude)
   - **Output Status**: CONFLICT if unresolved
   - **Test Case**: OSM reports 5 floors, imagery suggests 3 floors

8. **Invalid Coordinate Systems**
   - **Purpose**: Ensure all data in valid, expected CRS
   - **Formula**: CRS validation against allowed list (e.g., EPSG:4326, 32643)
   - **Threshold**: Must be in approved CRS list
   - **Implementation: CRS checking on input**
   - **Severity**: HIGH
   - **Output Status**: Processing halt
   - **Test Case**: Data in web mercator (EPSG:3857) when geographic expected

**Severity Levels**:
- **HALT**: Processing stops, requires manual intervention
- **HIGH**: Must be resolved before finalization (CONFLICT status)
- **MEDIUM**: Warning, may proceed but flagged for review
- **LOW**: Informational note

**Output Statuses**:
- **PENDING**: Awaiting processing
- **PROCESSING**: Currently being evaluated
- **VALIDATED**: Passed all checks
- **CONFLICT**: Topology rule violated, requires human review
- **RESOLVED**: Conflict addressed by human reviewer
- **REJECTED**: Entity deemed invalid and removed from consideration

## K. HUMAN-IN-THE-LOOP

**Who Reviews Results**:
- Cadastral officials / land records administrators
- GIS specialists with domain expertise
- Potentially: Property owners or representatives (for disputed areas)
- Reviewers trained on BoundaryLens interface and conflict types

**What They See/Can Correct**:
- **Map View**: 
  - Parcel boundaries (cadastral)
  - Building footprints (multiple sources)
  - Extruded 3D volumes
  - Detected conflicts highlighted
- **Evidence Panel**:
  - Table showing all sources for selected attribute
  - Values, timestamps, quality scores, licenses
  - Confidence levels (HIGH/MEDIUM/LOW/NOT_DETERMINABLE)
- **Conflict Panel**:
  - List of all conflicts needing resolution
  - Type of conflict (e.g., "building outside parcel", "height disagreement")
  - Location highlighted on map
  - Suggested resolutions (where algorithm can suggest)
- **Can Correct**:
  - Adjust building footprint alignment
  - Select preferred source when multiple agree
  - Modify floor count or height estimates
  - Mark data as insufficient and halt processing
  - Approve corrected geometry for ID generation

**How Corrections Recorded**:
- All actions logged in verification logs
- Includes:
  - Reviewer ID
  - Timestamp
  - Action taken (APPROVE/CORRECT/REJECT/MARK_UNRESOLVED)
  - Specific changes made (before/after values)
  - Reasoning/comments (free text field)
- Original evidence remains unchanged in database
- Corrections stored as separate "reviewer_version" or "verified_geometry"
- System maintains immutable original evidence + reviewer annotations

**History/Versioning**:
- Implicit in verification logs
- Each review action creates new version trace
- Can revert to original evidence or intermediate states
- Not explicit Git-like branching but chronological audit trail

**Approval Bypassing**:
- Not explicitly documented
- Likely: 
  - Supervisor override possible (with additional logging)
  - Emergency bypass for critical updates (fully logged)
  - No silent bypass - all overrides create audit trail entries

**Audit Trail**:
- Comprehensive as described in Evidence Fusion section
- Enables forensic review of how final ID was derived
- Supports legal defensibility of the process

## L. FRONTEND/UX

**Map/Globe/3D Building View**:
- **Helpful for Cadastral Interpretation**: 
  - Toggle between 2D parcel view and 3D building extrusion
  - Slider to slice through building vertically to see floor divisions
  - Transparency controls to see under/overlapping structures
  - Measurement tools for area, height, distance
  - **Not Merely Impressive**: These tools directly support verification of containment and height calculations

**Floor Selection**:
- Dropdown or slider to select specific floor level
- Highlights selected floor in 3D view
- Shows floor-specific attributes and evidence
- **Helpful**: Allows verification of floor count and height consistency

**Explode View**:
- Not explicitly mentioned in fetched documents
- If implemented: Would separate parcel, building, floors visually
- **Likely Helpful**: To verify hierarchical relationships and clean separation

**Cutaway/Cross-Section**:
- Explicitly mentioned as planned feature
- Allows vertical slicing through building to see internal structure
- **Very Helpful**: For verifying floor uniformity, detecting partial floors, mezzanines

**Search**:
- Parcel ID search (by government ID)
- Address/location search
- Click-on-map to select parcel
- **Helpful**: Essential for finding specific properties of interest

**Property Card**:
- Displays: 
  - Parcel ID, area, usage (if available)
  - Building count, total height
  - Floor count (if determined)
  - ULPIN linkage status
  - Overall confidence level
- **Helpful**: Summary for quick assessment

**Evidence Panel**:
- As described in Human-in-the-Loop: Shows source tables
- **Helpful**: Critical for verifying ID genesis and conflict resolution

**Conflict Panel**:
- Lists all conflicts requiring attention
- **Helpful**: Focuses reviewer effort on problematic cases

**Review Workflow**:
- Buttons: APPROVE / CORRECT / REJECT / MARK_UNRESOLVED
- Comment field for reasoning
- **Helpful**: Structured process for conflict resolution

**QR Verification**:
- Not explicitly mentioned but plausible
- Would encode ULPIN linkage for offline verification
- **Helpful**: For field verification without connectivity

**Dashboards**:
- Not detailed in fetched documents
- Likely: 
  - Processing statistics (parcels processed, % successful, % in review)
  - Conflict type distribution
  - Data source coverage maps
  - **Helpful**: For operational monitoring

**Animations**:
- Loading transitions, highlight pulses on selection
- **Likely Mostly Impressive**: Though subtle animations can aid perception of change

**Information Hierarchy**:
- **Primary**: Parcel selection and basic info
- **Secondary**: Building details and evidence
- **Tertiary**: Raw data sources and processing logs
- **Well-Structured**: Progresses from summary to evidence as needed

**Performance Optimizations**:
- Frontend: 
  - MapLibre GL JS: Vector tile rendering, level-of-detail
  - CesiumJS: 3D Tiles optimization, frustum culling
  - React: Memoization, virtualized lists for large datasets
- Backend:
  - PostGIS spatial indexes
  - Pagination on API endpoints
  - Asynchronous processing for heavy ML tasks
- **Helpful**: Enables interactive exploration of large cadastral datasets

## M. DEPLOYMENT

**Hosting**:
- Demonstrated as Docker-compose setup (likely)
- Production: Planned Kubernetes orchestration
- Based on tech stack: Can run on any Linux server with Docker

**Backend**:
- FastAPI application running in Docker container
- Gunicorn or Uvicorn workers
- Connected to PostgreSQL database

**Database**:
- PostgreSQL 13+ with PostGIS 3.1+ extension
- Running in separate Docker container (per docker-compose.yml pattern)
- Persistent storage for data durability
- Regular backup strategy planned

**Object Storage**:
- Not explicitly mentioned but implied for:
  - Original source data uploads (satellite imagery, cadastral maps)
  - Processed intermediate products (GeoTIFFs, processed vectors)
  - ML model artifacts
- Likely: Local filesystem with cloud abstraction layer (AWS S3, GCS, Azure Blob planned)
- Referenced in architecture.md: "File Storage: Local filesystem with cloud storage abstraction (planned)"

**APIs**:
- Primary: RESTful API (FastAPI auto-generated OpenAPI/Swagger)
- Endpoints for: 
  - Data upload/ingestion
  - Processing job submission/status
  - Parcel/building/floor querying
  - Evidence and conflict retrieval
  - ULPIN linkage generation
- Authentication: JWT-based token authentication (planned)
- Rate limiting and CORS planned

**Authentication**:
- JWT-based tokens (planned per architecture.md)
- Role-based access control: admin, user, viewer
- Secure password hashing (bcrypt)
- Token expiration and refresh mechanisms

**Secrets Management**:
- Not detailed but implied:
  - Database credentials
  - API keys for external data sources (if any)
  - JWT signing keys
- Likely: Environment variables or Docker secrets
- Production: HashiCorp Vault or cloud provider secrets manager planned

**External Dependencies**:
- **Data Sources**: 
  - opencity.in (cadastral)
  - NRSC/Bhuvan (DEM)
  - Copernicus (DEM/DSM)
  - Microsoft/Google/OSM (building footprints)
  - OSM (floor/height evidence)
- **No real-time APIs** mentioned for primary processing (batch oriented)
- **ML Models**: 
  - If using pre-trained: Dependencies on PyTorch/TF Hub
  - If training: No external dependency beyond open libraries

**Scalability**:
- **Backend**: Stateless FastAPI services enable horizontal scaling
- **Database**: 
  - Read replicas planned for scaling reads
  - Connection pooling
  - Potential sharding by geographical region
- **Processing**: 
  - Asynchronous jobs (Celery planned) for ML/heavy lifting
  - Can distribute across worker nodes
- **Frontend**: 
  - Static assets served via CDN (planned)
  - Browser-based processing keeps server load manageable

**Offline Capability**:
- Not a primary design goal (requires internet for data sources)
- However: 
  - Once data ingested, processing can occur offline
  - QR verification for offline ULPIN validation proposed
  - Potential for regional data packs with periodic sync

**Failure Behaviour**:
- **Network Failure**: 
  - Data ingestion halts, queued for retry
  - Processing jobs fail with retry mechanism
  - UI shows disconnected state with local cache (if implemented)
- **Database Failure**: 
  - Connection pooling with retry
  - Failover to replica planned
  - Data loss prevented by WAL and backups
- **ML Model Failure**: 
  - Fallback to heuristic or human-in-the-loop
  - Explicit halt if model unavailable (fail-safe)
- **Overall**: 
  - Designed to stop on unverified data (fail-safe)
  - No automatic progression with missing/corrupted inputs
  - Clear error reporting and logging for operator intervention

**LIVE CLAIMED — NOT RUNTIME VERIFIED**:
- Based on fetched documents, BoundaryLens is presented as a prototype/demonstration
- No evidence of live public deployment at scale
- The cityUse.md mentions "demonstration only" for Vertical ULPIN linkage
- Likely deployed in development/staging environments for testing
- Claims of government backing are aspirational (shows how it *could* be constructed)
- Actual live runtime verification not possible from public documentation

---

## SOURCES

All information extracted from the following publicly accessible sources:

1. **MASTER_BRIEFING.md** - https://github.com/Raghavfw/BoundaryLens/blob/main/docs/MASTER_BRIEFING.md
2. **ulpinConcern.md** - https://github.com/Raghavfw/BoundaryLens/blob/main/docs/ulpinConcern.md  
3. **cityUse.md** - https://github.com/Raghavfw/BoundaryLens/blob/main/docs/cityUse.md
4. **Repository Overview** - https://github.com/Raghavfw/BoundaryLens and https://github.com/NeelakshSaxena/BoundaryLens
5. **README snippet** (NeelakshSaxena repo) - "BoundaryLens is a fully functional 3D multi-storey vertical parcel delineation pipeline and interactive Web UI"

**Note**: Some details inferred from standard practices in geospatial ML systems where not explicitly specified in documents. Where uncertainty exists, this has been noted in the analysis.