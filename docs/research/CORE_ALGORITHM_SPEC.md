# Core Algorithm Specification for SIH26011: 3D ULPIN System

## Overview
This document defines the core algorithm for the SIH26011 prototype, which aims to create a 3D Unique Land Parcel Identification Number (ULPIN) system. The algorithm processes geospatial data to associate parcels with buildings, validate footprints, establish terrain elevation, obtain building heights, generate floor candidates, represent boundaries, handle underground structures, represent units, construct 3D volumes, detect overlaps, handle contradictory sources, represent uncertainty, generate final identifiers, and attach provenance.

## 1. Parcel Identification
Parcels are identified from cadastral data (e.g., shapefiles, GeoJSON) containing polygon geometries and unique parcel IDs.

**Data Structure:**
```python
class Parcel:
    id: str                    # Original parcel ID (e.g., from local land records)
    geometry: Polygon          # 2D footprint (in projected CRS, e.g., UTM)
    attributes: dict           # Additional parcel attributes (area, owner, etc.)
    crs: str                   # Coordinate Reference System (e.g., "EPSG:32643")
```

**Process:**
- Load parcel layer from authoritative source (e.g., municipal GIS).
- Validate geometries (fix invalid polygons, ensure they are simple and valid).
- Assign a temporary internal UUID for tracking during processing.

## 2. Building Association
Buildings are associated with parcels via spatial intersection and attribution.

**Data Sources:**
- Building footprints (from satellite imagery, LiDAR, or municipal datasets).
- Building attributes (height, usage, number of floors) from surveys or imagery.

**Association Algorithm:**
For each building footprint `B`:
1. Find all parcels `P` where `B.geometry.intersects(P.geometry)`.
2. If exactly one parcel intersects, assign `B` to that parcel.
3. If multiple parcels intersect, use the parcel with the largest intersection area.
4. If no parcel intersects within a threshold (e.g., 1m buffer), mark as unassigned (potential error or needs manual review).

**Pseudocode:**
```
for each building B:
    candidates = []
    for each parcel P:
        if B.geometry.intersects(P.geometry):
            intersection_area = B.geometry.intersection(P.geometry).area
            candidates.append((P, intersection_area))
    if candidates.length == 0:
        B.assigned_parcel = null
    else if candidates.length == 1:
        B.assigned_parcel = candidates[0].parcel
    else:
        # Sort by intersection area descending
        candidates.sort(key=lambda x: x[1], reverse=True)
        B.assigned_parcel = candidates[0].parcel
```

## 3. Building Footprint Validation
Validate that the building footprint is reasonable within its assigned parcel.

**Validation Checks:**
- The building footprint should be mostly within the parcel (e.g., >90% area intersection).
- The building should not extend excessively beyond the parcel boundary (e.g., <10% of building area outside parcel).
- The building footprint should be a valid polygon (no self-intersections).

**Equation:**
Let `A_intersection = area(B.geometry ∩ P.geometry)`
Let `A_building = area(B.geometry)`
Validation passes if: `A_intersection / A_building >= 0.9`

## 4. Terrain Elevation Establishment
Establish the ground elevation (terrain) at the building site.

**Data Source:**
- Digital Elevation Model (DEM) or Digital Terrain Model (DTM) (e.g., from LiDAR, SRTM, or ASTER).

**Method:**
For each building footprint, sample the DEM at the footprint vertices and/or centroid.
Use the minimum elevation within the footprint as the ground level (to avoid building on mounds).
Alternatively, use the median elevation to be robust to outliers.

**Pseudocode:**
```
def get_ground_elevation(building_footprint, dem_raster):
    points = building_footprint.exterior.coords  # Get vertices
    elevations = []
    for point in points:
        elev = dem_raster.sample(point.x, point.y)
        if elev is not None:
            elevations.append(elev)
    # Also sample centroid
    centroid = building_footprint.centroid
    elev_centroid = dem_raster.sample(centroid.x, centroid.y)
    if elev_centroid is not None:
        elevations.append(elev_centroid)
    # Use minimum elevation as ground level
    return min(elevations) if elevations else None
```

## 5. Roof/Building Height Obtainment
Obtain the height of the building (from ground to roof).

**Data Sources:**
- LiDAR point clouds (direct height measurement).
- Stereo satellite imagery (DSM - DEM).
- Attribute data from municipal records (e.g., number of floors * typical floor height).
- Photogrammetry.

**Method:**
- If LiDAR DSM is available: `Height = DSM value - DTM value` (at each point, then take mode or median over footprint).
- If only DSM available: approximate DTM from DEM (if DEM is bare earth) then subtract.
- If attribute data: `Height = (number_of_floors * floor_height) + roof_height` (with assumptions).

**Data Structure:**
```python
class BuildingHeight:
    value: float          # Height in meters
    source: str           # e.g., "LiDAR", "Stereo Imagery", "Attribute"
    confidence: float     # 0-1, based on source quality and validation
```

## 6. Floor Candidates Generation
Generate candidate floor levels based on building height and typical floor heights.

**Assumptions:**
- Typical floor height: 3.0m for residential, 3.5m for commercial, 4.0m for industrial (configurable).
- Ground floor may have different height (e.g., 4.0m for retail).
- Underground floors (basements) possible.

**Algorithm:**
1. Determine building usage type (from attributes or classification).
2. Set typical floor height `h_floor` and ground floor height `h_ground`.
3. Calculate number of above-ground floors: `N_above = floor((H - h_ground) / h_floor)`.
4. Generate floor heights from ground up:
   - Floor 0 (ground): from `z_ground` to `z_ground + h_ground`
   - Floor i (i>=1): from `z_ground + h_ground + (i-1)*h_floor` to `z_ground + h_ground + i*h_floor`
5. For basements: if basement depth known, generate negative floors similarly.

**Pseudocode:**
```
def generate_floor_candidates(building_height, ground_elevation, usage_type):
    h_ground, h_floor = get_typical_heights(usage_type)
    N_above = max(0, floor((building_height.value - h_ground) / h_floor))
    floors = []
    z_current = ground_elevation
    # Ground floor
    floors.append({
        'level': 0,
        'min_z': z_current,
        'max_z': z_current + h_ground,
        'usage': usage_type
    })
    z_current += h_ground
    # Upper floors
    for i in range(1, N_above+1):
        floors.append({
            'level': i,
            'min_z': z_current,
            'max_z': z_current + h_floor,
            'usage': usage_type
        })
        z_current += h_floor
    return floors
```

## 7. Floor Boundaries Representation
Floor boundaries are represented as 2D polygons (same as building footprint) with associated vertical extent (min_z, max_z).

**Data Structure:**
```python
class Floor:
    id: str                   # Unique floor ID (e.g., parcel_id_building_floor_level)
    footprint: Polygon        # 2D polygon (same as building footprint)
    min_z: float              # Absolute elevation (meters above sea level)
    max_z: float              # Absolute elevation
    usage: str                # e.g., "residential", "commercial"
    level: int                # Floor number (0=ground, positive=above, negative=basement)
```

## 8. Underground Structures Representation
Underground structures (basements, parking, utilities) are represented as negative-level floors.

**Data Source:**
- Building attributes (number of basements).
- LiDAR (if penetrates ground, but typically not).
- Municipal records or surveys.

**Method:**
- If basement depth `d_basement` is known, set `min_z = ground_elevation - d_basement`.
- Generate floors from `-1` to `-N_basement` with typical floor height (or specified height per level).
- If no data, assume no underground structures unless indicated by terrain cut-and-fill.

## 9. Units Representation
Units (apartments, offices, shops) are represented within floors.

**Data Source:**
- Cadastre or property records (may have unit IDs and locations).
- Building plans (if available).
- Statistical distribution (if no data, assume uniform distribution based on floor area).

**Method:**
- If unit polygons available: assign each unit to a floor based on vertical position (if units span multiple floors, split or assign to predominant floor).
- If only unit counts known: divide floor area equally (or by typical unit size) and generate representative polygons (e.g., grid partitioning).
- Units are represented as 2D polygons within the floor footprint with a unit ID.

**Data Structure:**
```python
class Unit:
    id: str                   # Unique unit ID (e.g., parcel_id_building_floor_unit_number)
    footprint: Polygon        # 2D polygon within floor footprint
    floor_id: str             # Reference to parent floor
    usage: str                # e.g., "apartment", "office"
    area: float               # Calculated from footprint
```

## 10. 3D Volumes Construction
3D volumes are constructed by extruding the 2D footprint (parcel, building, floor, unit) between min_z and max_z.

**Data Structure:**
```python
class Volume3D:
    id: str                   # Same as the entity it represents (parcel, building, etc.)
    footprint: Polygon        # 2D base polygon
    min_z: float
    max_z: float
    # The volume is the set of points (x,y,z) where (x,y) in footprint and min_z <= z <= max_z
```

**Process:**
- For parcels: volume is the land parcel extruded from terrain to a default height (e.g., 0m above ground? Actually, parcel volume is just the land; we may not extrude parcels vertically unless considering subsurface rights. For ULPIN, we are interested in the space above ground. So parcel volume might be from ground to infinity? But we limit to building volumes. We'll define parcel volume as the land footprint at ground level (2.5D). However, the task says 3D volumes, so we consider the space occupied by buildings.
- For buildings: extrude building footprint from ground_elevation to ground_elevation + building_height.
- For floors: extrude footprint from floor.min_z to floor.max_z.
- For units: extrude unit footprint from floor.min_z to floor.max_z (same as floor height).

## 11. Overlaps Detection
Detect overlaps between volumes (e.g., two buildings occupying the same space).

**Method:**
- Use spatial indexing (e.g., R-tree) on the 2D footprints with z-intervals.
- For each pair of volumes that intersect in 2D, check if their z-intervals overlap.
- If both 2D intersection and z-overlap exist, flag as a conflict.

**Equation for two volumes V1 and V2:**
```
2D Intersection: A = V1.footprint ∩ V2.footprint
if A is not empty:
    z_overlap = max(0, min(V1.max_z, V2.max_z) - max(V1.min_z, V2.min_z))
    if z_overlap > 0:
        conflict = True
```

**Pseudocode:**
```
for each volume V1:
    for each volume V2 in spatial_index.intersect(V1.footprint.bounds):
        if V1.id < V2.id:  # Avoid duplicate checks
            if V1.footprint.intersects(V2.footprint):
                intersection = V1.footprint.intersection(V2.footprint)
                if not intersection.is_empty:
                    z_overlap = min(V1.max_z, V2.max_z) - max(V1.min_z, V2.min_z)
                    if z_overlap > 0:
                        record_conflict(V1, V2, intersection, z_overlap)
```

## 12. Contradictory Sources Handling
Handle contradictory data from different sources (e.g., building height from LiDAR vs. municipal records).

**Method:**
- Assign confidence scores to each source.
- Use weighted average or select the source with highest confidence.
- If confidence is low and disagreement is high, flag for review and use a conservative estimate (e.g., minimum height for safety).

**Algorithm for numeric attribute (e.g., height):**
```
Let sources = [(value_i, confidence_i)] for i in 1..n
If max(confidence) > threshold (e.g., 0.7) and the value with max confidence is within reasonable range of others:
    selected_value = value_argmax(confidence)
else:
    # Weighted average
    sum_weight = sum(confidence_i)
    selected_value = sum(value_i * confidence_i) / sum_weight
```

## 13. Uncertain Results Representation
Represent uncertainty in measurements (e.g., elevation, height) using intervals or probability distributions.

**Method:**
- Store min and max possible values (or standard deviation) alongside the best estimate.
- Propagate uncertainty through calculations (e.g., floor height uncertainty affects number of floors).

**Data Structure Extension:**
```python
class BuildingHeight:
    value: float          # Best estimate
    min_val: float        # Lower bound (e.g., 5th percentile)
    max_val: float        # Upper bound (e.g., 95th percentile)
    source: str
    confidence: float
```

## 14. Final Identifier Generation
Generate the final 3D ULPIN as a hierarchical identifier.

**Format:**
```
ULPIN = <PARCEL_ID>:<BUILDING_ID>:<FLOOR_LEVEL>:<UNIT_ID>
```
Where:
- `<PARCEL_ID>`: The original or normalized parcel ID (e.g., from local land records, possibly with checksum).
- `<BUILDING_ID>`: A unique identifier for the building within the parcel (e.g., sequential or based on centroid).
- `<FLOOR_LEVEL>`: Integer floor level (negative for basement, 0 for ground, positive for above).
- `<UNIT_ID>`: Identifier for the unit within the floor (if applicable; if not unit-level, omit or set to 0).

**Example:**
`ULPIN = "ABC123:B1:5:U10"` means parcel ABC123, building B1, floor 5, unit U10.

**Process:**
1. Normalize parcel ID (remove spaces, uppercase, maybe add check digit).
2. Assign building IDs within a parcel (e.g., B1, B2, ... based on sorting by footprint area or address).
3. Floor level as integer (as generated in floor candidates).
4. Unit ID: if units are defined, use the unit number/ID; otherwise, use 0 or omit the unit part.

**Note:** The identifier should be unique and persistent.

## 15. Provenance Attachment
Attach provenance information to each entity (parcel, building, floor, unit, volume) to track data sources and processing steps.

**Data Structure:**
```python
class Provenance:
    sources: list[str]          # List of data source identifiers (e.g., "LiDAR_2023", "Municipal_Cadastre_2022")
    processing_steps: list[str] # List of processing steps applied (e.g., "footprint_validation", "height_estimation")
    timestamp: datetime         # When the record was created/updated
    version: int                # Version number for updates
    confidence: float           # Overall confidence in the entity
```

**Attribution:**
- Each entity (Parcel, Building, Floor, Unit, Volume3D) includes a `provenance` field.
- When merging data from multiple sources, combine provenance lists.
- When a processing step modifies an entity, append the step to `processing_steps`.

## Summary
This algorithm provides a end-to-end pipeline for generating 3D ULPINs from 2D cadastral and building data. It incorporates data validation, uncertainty handling, conflict detection, and provenance tracking to ensure robustness and traceability.

## References
[To be filled with specific data sources, standards, and algorithms used]