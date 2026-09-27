# Data Model Documentation

## Overview
This document describes the data model for the Ultimate 3D ULPIN Generation and Vertical Property Mapping System. The model is designed to represent cadastral information in 3D space, including surface parcels, multi-storey buildings, underground infrastructure, and related metadata.

## Entity Relationship Diagram (ERD)
```
[Parcel] 1 ──< [Building] 1 ──< [BuildingFloor] 1 ──< [BuildingUnit]
  │
  └──< [UndergroundStructure]
  │
  └──< [DataSource]
```

## Entities

### Parcel
Represents a land parcel or plot of land, which can contain buildings and underground structures.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| ulpin | VARCHAR(20) | UNIQUE, NOT NULL | Unique Land Parcel Identification Number |
| parcel_name | VARCHAR(255) | NOT NULL | Human-readable name for the parcel |
| description | TEXT | NULLABLE | Detailed description of the parcel |
| area_sqm | FLOAT | NULLABLE, CHECK (> 0) | Area in square meters |
| boundary_wkt | TEXT | NULLABLE | Boundary as WKT POLYGON or MULTIPOLYGON |
| centroid_lat | FLOAT | NULLABLE, CHECK (-90 ≤ lat ≤ 90) | Latitude of centroid |
| centroid_lng | FLOAT | NULLABLE, CHECK (-180 ≤ lng ≤ 180) | Longitude of centroid |
| elevation_min | FLOAT | NULLABLE | Minimum elevation (meters above sea level) |
| elevation_max | FLOAT | NULLABLE | Maximum elevation (meters above sea level) |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Whether the parcel is active |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NULLABLE, ON UPDATE NOW() | Last update timestamp |

### Building
Represents a structure built on a parcel, which can have multiple floors above and/or below ground.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| parcel_id | INTEGER | FOREIGN KEY (parcels.id), NOT NULL | Reference to parent parcel |
| building_name | VARCHAR(255) | NOT NULL | Name or identifier of the building |
| description | TEXT | NULLABLE | Detailed description of the building |
| footprint_wkt | TEXT | NULLABLE | 2D footprint as WKT POLYGON |
| num_floors_above | INTEGER | NOT NULL, DEFAULT 0, CHECK (≥ 0) | Number of floors above ground |
| num_floors_below | INTEGER | NOT NULL, DEFAULT 0, CHECK (≥ 0) | Number of floors below ground (basements) |
| height_m | FLOAT | NULLABLE, CHECK (> 0) | Total height of building in meters |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Whether the building is active |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NULLABLE, ON UPDATE NOW() | Last update timestamp |

### BuildingFloor
Represents a single floor within a building, which can be above ground, ground level, or below ground (basement).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| building_id | INTEGER | FOREIGN KEY (buildings.id), NOT NULL | Reference to parent building |
| floor_number | INTEGER | NOT NULL | Floor number (negative for basement, 0 for ground, positive for above) |
| floor_name | VARCHAR(100) | NULLABLE | Human-readable name (e.g., "Ground Floor", "Mezzanine") |
| area_sqm | FLOAT | NULLABLE, CHECK (> 0) | Floor area in square meters |
| height_m | FLOAT | NULLABLE, CHECK (> 0) | Floor-to-ceiling height in meters |
| ceiling_height_m | FLOAT | NULLABLE, CHECK (> 0) | Clear height from floor to ceiling |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Whether the floor is active |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NULLABLE, ON UPDATE NOW() | Last update timestamp |

### BuildingUnit
Represents a distinct unit or space within a floor (e.g., apartment, office, retail space).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| floor_id | INTEGER | FOREIGN KEY (building_floors.id), NOT NULL | Reference to parent floor |
| unit_number | VARCHAR(50) | NOT NULL | Unit identifier (e.g., "101", "A-205") |
| unit_type | VARCHAR(100) | NULLABLE | Type of unit (residential, commercial, industrial, etc.) |
| area_sqm | FLOAT | NULLABLE, CHECK (> 0) | Unit area in square meters |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Whether the unit is active |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NULLABLE, ON UPDATE NOW() | Last update timestamp |

### UndergroundStructure
Represents man-made structures located below the ground surface.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| parcel_id | INTEGER | FOREIGN KEY (parcels.id), NOT NULL | Reference to parent parcel |
| structure_name | VARCHAR(255) | NOT NULL | Name or identifier of the structure |
| structure_type | VARCHAR(100) | NOT NULL | Type (tunnel, pipeline, cable, basement, etc.) |
| description | TEXT | NULLABLE | Detailed description |
| depth_min_m | FLOAT | NULLABLE | Minimum depth below surface (meters) |
| depth_max_m | FLOAT | NULLABLE | Maximum depth below surface (meters) |
| footprint_wkt | TEXT | NULLABLE | 2D footprint as WKT POLYGON or LINESTRING |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Whether the structure is active |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NULLABLE, ON UPDATE NOW() | Last update timestamp |

### DataSource
Represents external data sources used to populate or update the cadastral database.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Human-readable name of the data source |
| source_type | VARCHAR(100) | NOT NULL | Type (drone, lidar, satellite, survey, etc.) |
| description | TEXT | NULLABLE | Detailed description of the data source |
| file_path | VARCHAR(500) | NULLABLE | Path to the data file |
| metadata | TEXT | NULLABLE | JSON metadata about the data source |
| is_processed | BOOLEAN | NOT NULL, DEFAULT false | Whether the data has been processed |
| processed_at | TIMESTAMP | NULLABLE | Timestamp when processing completed |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NULLABLE, ON UPDATE NOW() | Last update timestamp |

## Spatial Data Handling

### Geometry Storage
All spatial data is stored as Well-Known Text (WKT) in TEXT columns:
- `boundary_wkt`: PARCEL boundaries (POLYGON/MULTIPOLYGON)
- `footprint_wkt`: BUILDING footprints (POLYGON)
- Additional WKT columns for other spatial features as needed

### Coordinate System
- Latitude/Longitude: WGS 84 (EPSG:4326)
- Elevation: Meters above mean sea level
- Projected coordinates: Can be stored as additional columns if needed for performance

### Spatial Indexing
While WKT storage is human-readable and portable, for production use with large datasets:
- Consider adding geometry-type columns with PostGIS extension
- Create spatial indexes on geometry columns for performance
- Use ST_Contains, ST_Intersects, etc. for spatial queries

## Data Constraints and Validation

### ULPIN Format
- Alphanumeric string, typically 16-20 characters
- Example: ULPIN12345678901234
- Unique across all parcels in the system

### Elevation Validation
- `elevation_max` must be >= `elevation_min` when both are provided
- Elevation values should be realistic for the geographic location

### Floor Numbering
- Negative numbers: Basement levels (-1 = first basement level)
- Zero: Ground level
- Positive numbers: Above ground floors (1 = first floor above ground)

### Area Calculations
- Area values should be consistent across related entities
- Building footprint area should generally be <= parcel area
- Floor area should be consistent with footprint and number of floors
- Unit areas should sum to approximately floor area

## Relationships and Cascading Rules

### Parcel → Buildings
- One parcel can have many buildings
- Deleting a parcel restricts deletion if buildings exist (to prevent orphaned records)
- Alternative: Cascade delete buildings when parcel is deleted (requires careful consideration)

### Building → Floors
- One building can have many floors
- Similar restriction/cascade options as parcel-buildings

### Floor → Units
- One floor can have many units
- Similar restriction/cascade options as building-floors

### Parcel → Underground Structures
- One parcel can have many underground structures
- Similar restriction/cascade options as parcel-buildings

### Parcel ← Data Sources
- Many data sources can reference one parcel (different surveys over time)
- One data source can reference many parcels (batch survey)
- Many-to-many relationship through junction table (simplified as foreign key for now)

## Indexes (Recommended for Performance)

### Primary Key Indexes
- All `id` columns (automatically created)

### Unique Indexes
- `parcels.ulpin`

### Foreign Key Indexes
- `buildings.parcel_id`
- `building_floors.building_id`
- `building_units.floor_id`
- `underground_structures.parcel_id`
- `data_source.parcel_id` (if implemented as direct FK)

### Additional Performance Indexes
- `parcels.centroid_lat, parcels.centroid_lng` (for location-based queries)
- `parcels.elevation_min, parcels.elevation_max` (for elevation-based queries)
- `buildings.num_floors_above, buildings.num_floors_below` (for building type queries)
- `data_sources.source_type, data_sources.is_processed` (for data source filtering)

## Sample Data

### Parcel Sample
```json
{
  "id": 1,
  "ulpin": "ULPIN12345678901234",
  "parcel_name": "Survey No. 45/2, Bangalore",
  "description": "Rectangular parcel in residential zone",
  "area_sqm": 600.0,
  "boundary_wkt": "POLYGON((77.5946 12.9716,77.5976 12.9716,77.5976 12.9736,77.5946 12.9736,77.5946 12.9716))",
  "centroid_lat": 12.9726,
  "centroid_lng": 77.5961,
  "elevation_min": 855.0,
  "elevation_max": 860.0,
  "is_active": true,
  "created_at": "2026-09-21T10:00:00Z",
  "updated_at": null
}
```

### Building Sample
```json
{
  "id": 1,
  "parcel_id": 1,
  "building_name": "Block A",
  "description": "G+10 residential building",
  "footprint_wkt": "POLYGON((77.5948 12.9718,77.5974 12.9718,77.5974 12.9734,77.5948 12.9734,77.5948 12.9718))",
  "num_floors_above": 10,
  "num_floors_below": 2,
  "height_m": 36.0,
  "is_active": true,
  "created_at": "2026-09-21T10:00:00Z",
  "updated_at": null
}
```

### BuildingFloor Sample
```json
{
  "id": 1,
  "building_id": 1,
  "floor_number": 0,
  "floor_name": "Ground Floor",
  "area_sqm": 150.0,
  "height_m": 3.0,
  "ceiling_height_m": 2.8,
  "is_active": true,
  "created_at": "2026-09-21T10:00:00Z",
  "updated_at": null
}
```

### BuildingUnit Sample
```json
{
  "id": 1,
  "floor_id": 1,
  "unit_number": "G-01",
  "unit_type": "residential",
  "area_sqm": 50.0,
  "is_active": true,
  "created_at": "2026-09-21T10:00:00Z",
  "updated_at": null
}
```

### UndergroundStructure Sample
```json
{
  "id": 1,
  "parcel_id": 1,
  "structure_name": "Storm Water Drain",
  "structure_type": "drain",
  "description": "RCC storm water drain along eastern boundary",
  "depth_min_m": 2.0,
  "depth_max_m": 2.5,
  "footprint_wkt": "LINESTRING(77.5946 12.9716,77.5946 12.9736)",
  "is_active": true,
  "created_at": "2026-09-21T10:00:00Z",
  "updated_at": null
}
```

### DataSource Sample
```json
{
  "id": 1,
  "name": "Drone Survey - Bangalore South",
  "source_type": "drone",
  "description": "High-resolution photogrammetry survey",
  "file_path": "/data/surveys/drone_bangalore_south_2026.zip",
  "metadata": "{\"resolution\": \"3cm\", \"overlap\": \"80%\", \"gsd\": \"0.03m\"}",
  "is_processed": true,
  "processed_at": "2026-09-20T15:30:00Z",
  "created_at": "2026-09-20T10:00:00Z",
  "updated_at": null
}
```

## Migration Considerations

### From Legacy Systems
1. Map existing parcel IDs to ULPINs (generate if missing)
2. Convert 2D parcel data to 3D by adding elevation information
3. Extract building footprints and heights from available data
4. Identify and categorize underground structures from utility maps
5. Import metadata about data sources and processing history

### Schema Evolution
- Add new columns as needed with appropriate defaults
- Consider JSONB columns for flexible metadata storage
- Use database views for complex queries or denormalized data
- Plan for partitioning strategies as data volume grows

## Future Enhancements

### Advanced Spatial Types
- Migrate to native PostGIS geometry types for better performance
- Add support for 3D geometries (where PostGIS version supports)
- Implement spatial reference system transformations

### Temporal Tracking
- Add valid_time columns for historical tracking
- Implement transaction_time for audit trails
- Add versioning for data source updates

### Relationship Enhancements
- Many-to-many between parcels and data sources (survey parcels)
- Condominium/ownership relationships between units
- Utility network models for underground structures

### Data Quality
- Automated validation rules for geometric consistency
- Topological validation (no overlaps, proper connectivity)
- Change detection between data sources