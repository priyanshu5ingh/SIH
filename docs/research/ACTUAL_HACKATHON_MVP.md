# ACTUAL HACKATHON MVP for SIH26011
## Reality-First Minimum Viable Product
### Unique Land Parcel Identification Number (ULPIN) Generation and 3D Vertical Property Mapping

---

## INPUT (Exact Datasets/Files)
- **Primary Dataset**: `sample_parcels.geojson` (GeoJSON format)
  - Contains 5-10 land parcels from a real-world survey (e.g., OpenStreetMap extract or Bhuvan sample data for a small urban area)
  - Each feature includes:
    - `geometry`: Polygon/MultiPolygon in WGS84 coordinates (latitude/longitude)
    - `properties.parcel_name`: String (e.g., "Sector 12, Plot 45")
    - `properties.area_sqm`: Number (ground area in square meters)
    - `properties.elevation_min`: Number (minimum elevation in meters above sea level)
    - `properties.elevation_max`: Number (maximum elevation in meters above sea level)
    - `properties.data_source`: String (e.g., "Drone Survey 2024", "LiDAR Scan")
    - `properties.source_date`: String (ISO date, e.g., "2024-05-15")
- **Secondary Dataset** (optional for vertical dimension): `sample_buildings.geojson`
  - Building footprints within parcels with height attributes
  - Same coordinate system, includes `properties.height_m` (building height in meters)

*Data Source Note*: For hackathon demonstration, we use a 1km² area from Delhi/Mumbai municipal open data. Actual data would come from state survey departments or drone/LiDAR campaigns.

---

## PROCESS (Exact Algorithms)
1. **Data Ingestion**
   - Read GeoJSON files using `geopandas` (Python) or `json` module
   - Validate geometry validity (using `shapely.is_valid`)
   - Reproject to a suitable projected CRS (e.g., UTM zone for the area) for accurate distance/area calculations

2. **ULPIN Generation Algorithm**
   - For each parcel:
     a. Compute precise centroid (in projected coordinates)
     b. Create a unique string: `f"{centroid_x:.3f}_{centroid_y:.3f}_{area_sqm:.1f}_{timestamp}"`
        - `centroid_x/y`: Centroid coordinates in meters (projected)
        - `area_sqm`: Ground area from properties
        - `timestamp`: Data collection date (YYYYMMDD) from `source_date`
     c. Apply SHA-256 hash to the string, take first 16 characters
     d. Format as: `ULPIN-{hash}` (e.g., `ULPIN-a1b2c3d4e5f6g7h8`)
   - *Alternative*: Use a standard-based approach if ULPIN specification exists (e.g., ISO 19112-inspired)

3. **3D Geometry Creation**
   - For each parcel polygon:
     a. Extrude the polygon vertically from `elevation_min` to `elevation_max`
     b. Generate a 3D mesh (using `trimesh` or custom triangulation)
     c. For buildings within parcels: extrude building footprint from ground to `height_m`
   - Store as:
     - PostGIS: `geometry` (2D polygon) + `elevation_min`/`elevation_max` columns
     - Or as 3D WKT: `POLYGON Z ((x y z, x y z, ...))`

4. **Data Storage & API**
   - Save processed parcels to PostgreSQL/PostGIS (via SQLAlchemy)
   - Create REST endpoint: `GET /api/v1/parcels/` returning GeoJSON with:
     ```json
     {
       "type": "Feature",
       "properties": {
         "ulpin": "ULPIN-a1b2c3d4e5f6g7h8",
         "parcel_name": "Sector 12, Plot 45",
         "area_sqm": 1250.5,
         "elevation_min": 210.0,
         "elevation_max": 235.0,
         "data_source": "Drone Survey 2024"
       },
       "geometry": { ... },
       "extrusion_height": 25.0  // (elevation_max - elevation_min)
     }
     ```

---

## OUTPUT (Exact Generated Objects)
- **Database Records**: 
  - Table `parcels` with columns: `id` (PK), `ulpin` (VARCHAR, unique), `parcel_name`, `area_sqm`, `boundary_wkt` (TEXT), `centroid_lat`, `centroid_lng`, `elevation_min`, `elevation_max`, `is_active`
  - Each parcel has a globally unique ULPIN indexable for fast lookup
- **API Response**: 
  - GeoJSON FeatureCollection with ULPIN and extrusion height properties
  - Example: 10 parcels → 10 features, each with distinct ULPIN
- **3D Visualization Data**:
  - Extruded polygons sent to frontend as height-enabled GeoJSON
  - Frontend converts to Three.js meshes for rendering

---

## VISUALIZATION (Exact UI Components)
- **3D MapView** (existing `frontend/src/pages/MapView.js` enhanced):
  - Parcel extrusion height rendered as `elevation_max - elevation_min`
  - Color gradient based on elevation range (green=low, red=high)
  - ULPIN displayed as label when hovering/clicking a parcel
  - Interactive features preserved:
    - Measurement tool (distance between points)
    - Slice tool (cross-sectional view)
    - Layer toggles (parcels, buildings, terrain)
    - Map styles (default, satellite, terrain, night)
- **Parcel Detail Panel** (existing `ParcelDetail` page):
  - Shows full properties including ULPIN, data source, timestamps
  - Mini 3D thumbnail of the parcel extrusion
- **Analytics View** (existing `Analytics` page):
  - Histogram of parcel elevations
  - ULPIN format validation summary

---

## VALIDATION (Exact Tests)
1. **Unit Tests** (`backend/tests/test_ulpin.py`):
   - `test_ulpin_uniqueness`: Ensure no duplicate ULPINs generated for different parcels
   - `test_ulpin_format`: Verify ULPIN matches regex `^ULPIN-[a-z0-9]{16}$`
   - `test_centroid_calculation`: Compare computed centroid against known value for test polygon
   - `test_extrusion_height`: Verify 3D mesh height equals `elevation_max - elevation_min`

2. **Integration Tests** (`backend/tests/test_api.py`):
   - `test_parcels_endpoint`: Validate API returns correct ULPIN and geometry
   - `test_geojson_structure`: Check GeoJSON FeatureCollection schema compliance

3. **Spatial Validity**:
   - Use `shapely` to validate all geometries are valid
   - Check that extruded meshes are manifold and watertight (for 3D printing readiness)

---

## DEMO (Exact Sequence a Judge Will See)
1. **System Start** (30 seconds)
   - Judge runs: `docker-compose up --build` (or manual backend/frontend start)
   - Backend initializes PostgreSQL/PostGIS, runs migrations, loads `sample_parcels.geojson`
   - Console shows: "Loaded 10 parcels. Generated 10 unique ULPINs."

2. **Initial View** (Landing Page)
   - Frontend loads at `http://localhost:3000`
   - Judge sees premium UI with animated background and navbar
   - Navigates to "3D Map" (/map)

3. **3D Map Interaction** (2 minutes)
   - Map loads with terrain base and parcel extrusions visible
   - Judge observes:
     - Color-coded buildings (height-based)
     - ULPIN labels appear on hover (e.g., "ULPIN-a1b2c3d4e5f6g7h8")
     - Clicking a parcel opens sidebar with details:
       ```
       Parcel Name: Sector 12, Plot 45
       ULPIN: ULPIN-a1b2c3d4e5f6g7h8
       Area: 1,250.5 m²
       Elevation Range: 210.0m - 235.0m
       Data Source: Drone Survey 2024 (2024-05-15)
       ```
   - Judge uses measurement tool to click two points → distance displayed
   - Judge activates slice tool → horizontal plane cuts through buildings showing interior layers

4. **Validation Check** (via API)
   - Judge opens API docs at `http://localhost:8000/docs`
   - Executes GET `/api/v1/parcels/` → sees GeoJSON with ULPIN properties
   - Notes unique ULPIN for each feature and extrusion height values

5. **Analytics Verification**
   - Navigates to Analytics page
   - Sees histogram showing elevation distribution of parcels
   - Confirms ULPIN format validation passes for all records

6. **Conclusion**
   - Judge understands the system:
     - Takes real geospatial input
     - Processes it to generate unique identifiers (ULPIN) and 3D models
     - Outputs validated, traceable results viewable in 3D
     - All done with minimal infrastructure (single docker-compose, no Kubernetes/Elasticsearch)

---
*This MVP demonstrates the core technical breakthrough: transforming cadastral data into actionable 3D intelligence with standardized identification, using real algorithms and avoiding unnecessary complexity.*