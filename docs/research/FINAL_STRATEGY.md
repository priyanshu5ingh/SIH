# Final Strategic Decision Document for SIH26011

## 1. Problem we are actually solving
The conventional 2D land record systems (ULPIN/Bhu-Aadhaar) are inadequate for capturing vertical property relations in multi-storey buildings, stacked ownership (flats, basements), and subsurface utilities. The problem is to generate a standardized 3D Unique Land Parcel Identification Number (3D‑ULPIN) that uniquely identifies every volumetric parcel—surface, above‑ground floors, and underground units—enabling a true volumetric cadastre, reducing ownership conflicts, and supporting urban infrastructure planning.

## 2. What already exists
- **2D ULPIN System**: A 14‑digit alphanumeric identifier based on longitude/latitude coordinates, rolled out in 29+ Indian states under the Digital India Land Records Modernisation Programme (DILRMP). Sources: https://dolr.gov.in/en/ulpin/, https://ulpin.in/
- **Prototype 3D ULPIN Projects**: Hackathon prototypes demonstrating 3D visualization with CesiumJS/Three.js, synthetic data processing, and basic floor detection. Examples:
  - https://github.com/madhusudan4321/SIH26--3D-ULPIN-Generation-and-vertical-Property-Mapping-System (React+Vite+Tailwind, CesiumJS, planned FastAPI/PostGIS)
  - https://github.com/Mohitsaini785/3d-cadastral-digital-twin (Python/NumPy+Shapely backend, Three.js frontend, SQLite)
  - Dashboard demos: https://smart-india-hackathon-3-d-ulpin-gen.vercel.app/dashboard.html
  - ULPIN generator: https://smart-india-hackathon-3-d-ulpin-gen.vercel.app/ulpin-generator.html
These prototypes use synthetic LiDAR/point clouds, lack real‑government data integration, have no backend/storage, and do not implement topological validation or legal parcel boundaries.

## 3. What competitors already demonstrate
- Interactive 3D maps of building volumes using CesiumJS or Three.js.
- Automatic building footprint extraction from LiDAR/imagery (via open‑source AI or classical algorithms).
- Height‑based floor slab detection using histogram peak detection or plane clustering.
- Generation of placeholder IDs resembling ULPIN (e.g., numeric codes or simple hashes).
- Simple attribute tables linked to 3D objects (e.g., floor number, area).
- Export of results as CSV/JSON and basic measurement tools.
- Planned use of PostGIS/PostgreSQL for spatial storage (mentioned in READMEs).

## 4. What competitors fail to demonstrate
- End‑to‑end pipeline from raw sensor data (drone imagery, LiDAR, floor plans, GNSS) to validated 3D‑ULPINs.
- Integration with existing 2D ULPIN registries or state land‑record databases.
- Legal framework for vertical property rights (airspace, subsurface) and volumetric cadastre.
- Topology validation ensuring parcels do not illegally overlap, respect building envelopes, and comply with municipal bye‑laws.
- Scalability to city‑ or statewide datasets (memory/compute optimization).
- Multi‑user collaborative editing and version control.
- Standardized 3D‑ULPIN format that guarantees uniqueness and backward compatibility.
- Confidence scoring and human‑in‑the‑loop review workflow for AI‑generated parcels.
- Real‑time update mechanisms for renovations, demolitions, or new constructions.
- Support for complex geometries (cantilevers, overhangs, underground voids).

## 5. Real white space
A complete, interoperable system that:
- Ingests heterogeneous geospatial data (drone orthophotos, LiDAR/point clouds, GIS layers, floor plans, GNSS/CORS, DEM/DSM).
- Applies AI/ML for automated building extraction, floor segmentation, and vertical parcel delineation.
- Generates a standardized, hierarchical 3D‑ULPIN that extends the existing 14‑digit ULPIN with floor and subunit suffixes (e.g., `UP123456789012.F01.U05`).
- Stores volumetric parcels as 3D geometries (polyhedral surfaces/TIN) in a spatially enabled database (PostGIS).
- Provides a web‑based 3D GIS dashboard (CesiumJS) for visualization, querying, editing, and approval.
- Implements a rule‑based validation engine for topological integrity, height/area regulations, and legal setbacks.
- Includes a human‑review workflow where officials can adjust AI‑generated boundaries, approve/reject parcels, and maintain an audit trail.
- Exposes RESTful APIs (FastAPI) for integration with urban planning, infrastructure, and utility management systems.
- Maintains backward compatibility: the 2D ULPIN portion remains valid for lateral parcel identification.

## 6. Exact innovation we will implement
**Modular 3D‑ULPIN Pipeline**
1. **Data Ingestion & Preprocessing** – Convert LiDAR (LAS/LAZ), imagery (GeoTIFF), floor plans (PDF/CAD), and GNSS points to a common CRS (UTM zone). Co‑register using ICP or affine transforms.
2. **Ground Filtering & Building Segmentation** – Apply Progressive Morphological Filter (PMF) to separate ground points; cluster non‑ground points with Euclidean clustering (DBSCAN) to detect individual buildings.
3. **Footprint Extraction & 2D‑ULPIN Assignment** – Compute 2D convex hull of each building cluster; derive centroid and assign a 2D ULPIN using the existing grid‑based algorithm (or generate via Geohash‑like base32 encoding of latitude/longitude).
4. **Floor Slab Detection** – For each building, create a height histogram of clustered points; detect significant peaks (local maxima) using Prominence‑based peak detection; each peak corresponds to a floor slab.
5. **Vertical Parcel Delineation** – Segment points between consecutive floor slabs into floor volumes; optionally further split by interior walls detected via planar RANSAC or aligned floor‑plan images to derive subunits (flats/rooms).
6. **3D‑ULPIN Generation** – Encode as `<2D_ULPIN>.F<floor>.U<unit>` where floor is signed two‑digit (−20 to +20, negative for basements), unit is two‑digit (00‑99). Example: `UP123456789012.F03.U12`. Ensure uniqueness via database lookup; append a checksum if needed.
7. **Topology Validation Engine** – Enforce rules:
   - No volume intersection unless same ownership and aggregated.
   - Each parcel must lie within the building’s convex hull envelope.
   - Floor height between 2.5 m and 4.5 m (configurable).
   - Unit area ≥ local minimum (e.g., 30 m² residential).
   - Compliance with municipal setback and height‑limit rules (loaded from bylaws DB).
   - Confidence score = average AI model probability × manual override factor.
8. **Storage & API** – Save parcels as 3D PolyhedralSurface or TIN in PostGIS; expose via FastAPI endpoints delivering GeoJSON, MVT, or 3D Tiles (Cesium‑compatible).
9. **Human‑Review Workflow** – Web dashboard shows parcels colored by confidence; reviewer can split, merge, extrude, or adjust boundaries using Cesium‑based editing tools; system recalculates 3D‑ULPIN on substantive changes; approval toggles status to “locked” and writes to official registry.
10. **Visualization & Query** – CesiumJS terrain + 3D Tiles layer; sidebar for search/filter by ulpin, owner, floor; measurement tools; day/night toggle; export of reports.

## 7. Exact datasets
- **LiDAR/Point Cloud**: OpenTopography USGS datasets (e.g., NMGC LiDAR), Bhuvan LiDAR portals (if available), or synthetic samples from ISPRS benchmark.
- **Imagery**: Sentinel‑2, Landsat, or drone orthophoto samples from Open Aerial Map.
- **GIS Layers**: OpenStreetMap building footprints, administrative boundaries from data.gov.in.
- **DEM/DSM**: SRTM 30 m, ASTER GDEM, or Cartosat‑1.
- **Floor Plans**: Synthetic CAD layouts generated from SketchUp/Blender for typical Indian apartments; optionally scanned PDFs from municipal archives (sample).
- **GNSS Coordinates**: Simulated RTK‑level corrections (cm‑level) using open‑source GNSS‑SDR libraries or pre‑processed datasets.
- **Building Models**: CityGML LOD2 samples from open‑city‑data portals (e.g., Berlin, New York) for validation.
All datasets will be downloaded, pre‑processed, and stored in a `data/` folder; scripts will be provided to reproduce the pipeline on any city block.

## 8. Exact algorithm
1. **Transform** all inputs to UTM zone WGS84 / EPSG:32644 (India).
2. **Ground Filter**: Apply PMF (max window size 1.5 m, slope 0.2) to LiDAR.
3. **Building Clustering**: DBSCAN (ε=2.0 m, minPoints=50) on non‑ground points.
4. **Footprint**: 2D convex hull of each cluster → simplify (tolerance 0.5 m).
5. **2D‑ULPIN**: Compute centroid; convert lat/lon to integer grid (e.g., 0.0001° ≈ 10 m); encode to base32 → 10‑char; add checksum → 12‑char? We’ll reuse existing 14‑digit algorithm: `ULPIN = base36(latitude_scaled || longitude_scaled)` producing 14 digits. If unavailable, implement per DILRMP spec.
6. **Floor Detection**: Build height histogram (bin 0.1 m); smooth (Gaussian σ=0.5 m); find peaks where derivative changes sign and height > prominence threshold (0.5 m). Store slab heights.
7. **Volume Segmentation**: For each slab pair (lower, upper), extract points with z ∈ [lower, upper]; compute convex hull in XY → extrude to slab height → yields floor volume.
8. **Subunit Partition** (optional): If floor‑plan image available, align to footprint via affine transform; detect walls (Hough lines); extrude wall polygons to create room volumes.
9. **Encode 3D‑ULPIN**: `base36_2DULPIN + "." + fmt(floor, "+03d;-03d") + fmt(unit, "02d")`. Floor signed two‑digit, unit two‑digit.
10. **Validation**:
    - Intersection test: `ST_Intersects(vol1, vol2) AND NOT ST_Equals(vol1, vol2)` → flag.
    - Envelope test: `ST_Contains(envelope_geom, vol)`.
    - Height test: `ST_ZMax(vol) - ST_ZMin(vol) BETWEEN min_h AND max_h`.
    - Area test: `ST_Area(ST_Projection(vol, 'XY')) >= min_area`.
    - Bylaw test: load rule set (setback, max height) → evaluate via PostGIS functions.
11. **Store**: Insert into `parcels_3d` table with columns: `id`, `ulpin`, `geom` (Geometry(PolygonZ, 4326)), `confidence`, `status`, `created_at`, `updated_at`.
12. **API**: `GET /parcels?ulpin=...`, `GET /parcels/{id}` (GeoJSON), `POST /parcels/{id}/approve`.
13. **Cesium**: Generate 3D Tiles using `tippecanoe` or `cesium‑tiler`; serve static tiles.

## 9. Exact 3D data model
We adopt a simplified CityGML‑LOD2 approach:
- **Table `parcels_3d`**:
  - `ulpin` TEXT PRIMARY KEY (e.g., `UP123456789012.F03.U12`)
  - `geom` Geometry(PolygonZ, 4326) – the volumetric parcel (extruded footprint or convex hull)
  - `building_id` FK → `buildings` (optional grouping)
  - `floor_number` INTEGER (signed)
  - `unit_number` INTEGER (0‑99, 0 = whole floor if not subdivided)
  - `occupancy_type` TEXT (residential, commercial, industrial, utility)
  - `confidence` REAL (0‑1)
  - `status` TEXT (`draft`, `reviewed`, `locked`, `rejected`)
  - `source_data` JSONB (timestamps, sensor types)
  - `created_at`, `updated_at` TIMESTAMPTZ
- **Table `ownership_links`** (future):
  - `parcel_ulpin` FK → `parcels_3d.ulpin`
  - `owner_id` FK → `owners`
  - `right_type` TEXT (ownership, lease, easement)
  - `valid_from`, `valid_to` DATE
- **Spatial Index**: GIST on `geom`.
This model supports vertical stacking (same `building_id`, different `floor_number`) and subunit breakdown.

## 10. Exact identifier architecture
**Backward‑Compatible Hierarchical 3D‑ULPIN**
- **Base (2D) ULPIN**: Retains the current 14‑digit alphanumeric code that uniquely identifies the land parcel’s XY footprint (derived from latitude/longitude per DILRMP). This ensures any existing 2D‑ULPIN remains valid for lateral identification.
- **Floor Suffix**: `.F<sign><DD>` where `sign` is `+` for above ground, `-` for below ground (basement), and `DD` is two‑digit floor level (00 = ground, 01 = first above, −1 = first basement). Range −20 to +20 accommodates tall buildings and deep basements.
- **Unit Suffix**: `.U<DD>` where `DD` is two‑digit subunit identifier (00 = entire floor, 01‑99 for individual flats/rooms). If the floor is not subdivided, suffix `.U00` is used.
- **Combined Format**: `<ULPIN>.F<sign><DD>.U<DD>`  
  Example: `UP123456789012.F+02.U05` → 2D ULPIN `UP123456789012`, floor +2 (second above ground), unit 05.
- **Uniqueness**: Enforced by database unique constraint on the full string.
- **Human Readability**: Clearly separates location, vertical level, and subunit.
- **Extensibility**: Additional suffixes (e.g., `.R<DD>` for room) can be added without breaking existing parsers.
- **Checksum**: Optional mod‑37 checksum appended after unit suffix if required for error detection; omitted in MVP for simplicity.

## 11. Exact validation engine
Implemented as a set of PostGIS functions and application‑level checks:
- **Topology Validity**:
  - `SELECT ulpin FROM parcels_3d p1 JOIN parcels_3d p2 ON ST_Intersects(p1.geom, p2.geom) AND p1.ulpin < p2.ulpin AND NOT ST_Equals(p1.geom, p2.geom);` → overlapping volumes flagged.
- **Envelope Validity**:
  - `ST_Contains(building_envelope.geom, parcel.geom)` must be TRUE.
- **Height Constraints**:
  - `ST_ZMax(geom) - ST_ZMin(geom) BETWEEN :min_height AND :max_height` (default 2.5–4.5 m).
- **Area Constraints**:
  - `ST_ASText(ST_Projection(geom, 'XY'))` → compute planar area; must ≥ `min_area_by_occupancy`.
- **Bylaw Compliance**:
  - Load municipal rules (setback distance, max height, FAR) into a `bylaws` table.
  - For each parcel, compute distance to plot boundary (`ST_Distance(geom, plot_boundary)`) and compare to setback.
  - Compute total volume/FAR and compare to limits.
- **Confidence Scoring**:
  - `confidence = AI_probability * (1 - penalty_for_manual_edit)`.
  - AI_probability from floor‑detection peak prominence and building‑segmentation score.
- **Workflow**:
  - Only parcels with `confidence ≥ :threshold` (e.g., 0.7) and passing all validation rules can be auto‑approved; others require manual review.
  - Manual approval overrides confidence but must still satisfy hard constraints (envelope, no illegal overlaps).

## 12. Exact human-review workflow
1. **Login**: Government official logs into the web dashboard (role‑based access).
2. **Load Area**: Choose a city block or search by 2D ULPIN.
3. **View AI Parcels**: Parcels rendered as semi‑transparent volumes; color gradient from red (low confidence) to green (high confidence).
4. **Inspect**: Click a parcel → sidebar shows ulpin, confidence, height, area, source data, and list of validation warnings/errors.
5. **Edit Geometry**:
   - **Split**: Draw a polyline to divide volume into two; new ulpins generated (floor/unit adjusted).
   - **Merge**: Select adjacent volumes → combine; ulpin of larger volume retained or regenerated.
   - **Adjust Height**: Drag floor slab up/down → floor number changes accordingly.
   - **Edit CMOS**: Align footprint to orthophoto using vertex editing.
6. **Recalculate**: After edit, system recomputes ulpin, validation, and confidence.
7. **Approve/Reject**: Click “Approve” → status = `locked`, write to official registry; “Reject” → status = `rejected` with comment.
8. **Audit Log**: Every action logged (user, timestamp, geometry diff, ulpin change) in `parcel_actions` table.
9. **Export**: Approved parcels can be exported as CSV/GeoJSON for integration with state land‑record IT systems.
10. **Baseline Layer**: Toggle to show existing 2D ULPIN parcels (from WFS/WMS) for reference.

## 13. Exact UI/demo
**Technology Stack**
- **Frontend**: React 18, Vite, Tailwind CSS, CesiumJS (@cesium/engine) for 3D Tiles, React‑Query for state management, Zustand for UI state.
- **Backend**: FastAPI (Python 3.11), SQLAlchemy + GeoAlchemy2 for PostGIS, Pydantic for models, Uvicorn ASGI server.
- **Data Processing**: PDAL (point cloud), GDAL/OGR (raster/vector), NumPy, SciPy, scikit‑learn, OpenCV (for floor‑plan alignment), Shapely (2D ops), Trimesh (3D validation).
- **Deployment**: Docker Compose for local dev; optional Helm chart for Kubernetes.

**Demo Scenario**
- Load a 1 km² sample area from the city of Indore (LiDAR from MP Bhuvan portal, Sentinel‑2 imagery, OSM footprints).
- Run pipeline: building extraction → floor detection → 3D‑ULPIN generation.
- Display 3D Tiles of parcels; click to view ulpin (e.g., `UP987654321098.F+01.U03`).
- Show confidence heatmap; allow official to split a floor into two flats, adjust ulpin to `.U01` and `.U02`.
- Approve edited parcels; see status change to locked.
- Measure distances, heights, areas using Cesium tools.
- Switch basemap between satellite and OpenStreetMap.
- Export approved parcels as GeoJSON.

The demo will be packaged as a single Docker compose file (`docker-compose up`) and a pre‑built demo data tarball.

## 14. What will be real
- The data ingestion, preprocessing, AI/ML building extraction, floor segmentation, 3D‑ULPIN generation, validation engine, PostGIS storage, FastAPI endpoints, and CesiumJS 3D visualization are fully functional with open‑source libraries and sample data.
- The human‑review workflow UI (splitting, merging, approval) is implemented and operable on the demo dataset.
- The system demonstrates end‑to‑end processing from raw LiDAR/imagery to verified 3D‑ULPINs for a city block.
- All code will be open‑sourced under MIT license with documentation.

## 15. What will be explicitly labelled as proposed/estimated
- The exact 3D‑ULPIN format (`.F<sign><DD>.U<DD>`) is proposed; alternative encodings (pure base32 Geohash‑style, or variable‑length) are noted as future work.
- Integration with state‑level land‑record IT systems (e.g., tying into NIC’s Bhulekh) is estimated; we will provide API connectors but actual deployment depends on state APIs.
- The legal framework for recognizing vertical property rights (airspace, subsurface) is outside scope; we propose a data model that can be extended once such legislation exists.
- Scalability to nationwide coverage (billions of parcels) is estimated based on benchmarking of PostGIS indexing and 3D Tiles generation; we will provide performance numbers for a 10 km² test area.
- The AI models for building extraction are pretrained on open datasets (ISPRS, Cityscapes) and fine‑tuned on a small set of Indian building images; domain‑specific fine‑tuning is proposed for higher accuracy.
- The validation rule set (bylaws) is proposed as a configurable module; actual rules must be sourced from municipal corporations.

## 16. What we will NOT claim
- We will not claim that our system automatically generates legally binding parcel boundaries without human verification; approval step is mandatory.
- We will not claim that the 3D‑ULPIN will replace the existing 2D‑ULPIN without integration; we explicitly maintain backward compatibility.
- We will not claim to process real‑time drone video streams at city scale without additional edge‑computing infrastructure.
- We will not claim that our AI models achieve 100% accuracy across all Indian architectural styles; we provide confidence scores and rely on human review.
- We will not claim that the system solves land‑titling disputes; it only provides a clear spatial identifier for registered parcels.

## 17. Biggest technical risks
1. **Multi‑Source Registration Error** – Misalignment between LiDAR, imagery, and floor plans could lead to incorrect footprint or height; mitigation: use GNSS tie‑points, ICP refinement, and manual alignment tools in UI.
2. **AI Generalization** – Pretrained models may fail on informal settlements, varied roof materials, or dense vegetation; mitigation: active learning loop with human‑reviewed samples, ensemble of models, and fallback to classical edge‑detection.
3. **Point‑Cloud Processing Scalability** – Full‑city LiDAR (billions of points) may exceed memory; mitigation: process in spatial tiles (e.g., 500m×500m chunks), use PDAL streaming, and implement out‑of‑core algorithms.
4. **Topological Complexity** – Overhangs, cantilevers, and underground voids create non‑manifold geometries; mitigation: restrict to manifold volumes in MVP, use constructive solid geometry (CSG) checks, and flag non‑manifold for review.
5. **Inter‑Agency Data Sharing** – Lack of standardized APIs across state land‑record departments; mitigation: design our REST/FGDC‑compliant services and provide adapters for common formats (WFS, WMS, GeoJSON).

## 18. Fallback plan
- If AI building extraction yields low confidence (<0.5), fallback to manual footprint tracing using orthophoto base layer (editor provides polygon drawing tool).
- If LiDAR unavailable, use stereo photogrammetry from drone images (OpenCV SfM) to generate DSM; ground slope filtering to approximate buildings.
- If floor‑plan images missing, assume uniform floor height (e.g., 3 m) based on building height / detected slab peaks; label as “estimated”.
- If validation engine too strict (e.g., due to inaccurate bylaws), run in advisory mode where violations are warnings not errors; officials can override with justification.
- If PostGIS performance degrades with billions of rows, implement partitioning by spatial grid (e.g., H3 hex IDs) and use parallel query services.

## 19. Final MVP scope
- **Geographic Extent**: One city block (~500 m × 500 m) with available LiDAR and orthophoto.
- **Features**:
  - Building footprint extraction from LiDAR/imagery.
  - Floor slab detection via height histogram.
  - Generation of 3D volumes per floor (no subunit division).
  - Assignment of 3D‑ULPIN using `<ULPIN>.F<sign><DD>.U00`.
  - Topological validation (no overlap, envelope, height/area limits).
  - Storage in PostGIS; API for GeoJSON/3D Tiles retrieval.
  - CesiumJS 3D viewer with parcel selection, attribute popup, and basic measurement.
  - Human‑review UI: approve/reject, confidence display, manual footprint edit (no split/merge in MVP).
  - Export of approved parcels as CSV/GeoJSON.
- **Non‑MVP Features** (post‑MVP):
  - Subunit (flat/room) detection and coding.
  - Advanced editing tools (split, merge, extrusion).
  - Ownership linkage and encumbrance modeling.
  - Integration with state land‑record IT systems.
  - Automated update pipeline for construction/demolition permits.
  - Nationwide tiling and CDN distribution.
- **Success Criteria**:
  - Process the demo area in <30 minutes on a modest workstation (CPU 8‑core, 32 GB RAM).
  - Generate 3D‑ULPINs for >90% of buildings with confidence >0.7.
  - Zero illegal overlaps in validated output.
  - Demo usable by a novice official after 10‑minute tutorial.

## 20. Final build order
1. **Project Setup**
   - Initialize git repo; add `.gitignore`, `README.md`, `LICENSE`.
   - Create `backend/` (FastAPI) and `frontend/` (React Vite) folders.
   - Set up Docker Compose for dev (PostGIS, FastAPI, Vite).
2. **Data Pipeline Foundations**
   - Write scripts to load LiDAR (LAS/LAZ) via PDAL; convert to LAZ for storage.
   - Implement ground filtering (PMF) and building clustering (DBSCAN) in Python.
   - Export building footprints as GeoJSON.
3. **2D‑ULPIN Generation**
   - Implement or integrate existing ULPIN algorithm (based on lat/lon scaling to integers, base36 encode).
   - Assign ULPIN to each footprint centroid; store in PostgreSQL.
4. **Floor Detection & Volumetric Parcels**
   - Implement height histogram peak detection (scipy.signal.find_peaks).
   - Generate extruded volumes per slab; assign 3D‑ULPIN with floor suffix (unit = 00).
   - Write validation functions (envelope, height, area) using PostGIS.
5. **Backend API**
   - Create FastAPI routers: `/parcels` (CRUD), `/parcels/{id}/approve`, `/tiles/{z}/{x}/{y}.pbf` (MVT) or 3D Tiles endpoint.
   - Serve static 3D Tiles (pre‑generated with `cesium‑tiler` or `tippecanoe`).
6. **Frontend Map Viewer**
   - Set up React + CesiumJS base terrain (Cesium World Terrain).
   - Load 3D Tiles layer; style by confidence (color gradient).
   - Implement sidebar: search by ulpin, filter by status, show attributes.
   - Add measurement tool (distance, height, area) using Cesium primitives.
7. **Human‑Review UI**
   - Add editing toolbar: select parcel, approve/reject buttons.
   - Implement footprint editing via Cesium PolygonDrawingHelper (allow vertex moves).
   - On edit, call backend to recompute ulpin and validation; update UI.
   - Log actions to `parcel_actions` table.
8. **Demo Data Preparation**
   - Download sample LiDAR (e.g., from Bhuvan MP portal), Sentinel‑2 tile, OSM footprints.
   - Pre‑process and place in `backend/data/`.
   - Create a seeding script that loads data, runs pipeline, and inserts into DB.
9. **Integration & Testing**
   - Run end‑to‑end pipeline on demo data; verify outputs.
   - Perform unit tests on validation functions.
   - Load test with ~10 k parcels to ensure API responsiveness.
10. **Documentation & Release**
    - Write `docs/` with architecture, API reference, and user manual.
    - Create `docker-compose.yml` and `.env` examples.
    - Tag release `v1.0‑mvp`.
    - Prepare demo video showcasing the workflow.

---
*Sources consulted (for strategic framing):*
- Problem statement: https://raw.githubusercontent.com/vedantchalke36/sih-2026-problem-statements/main/ps_2026/SIH26011.md
- Existing 2D ULPIN: https://dolr.gov.in/en/ulpin/, https://ulpin.in/
- Prototype 3D ULPIN projects: https://github.com/madhusudan4321/SIH26--3D-ULPIN-Generation-and-vertical-Property-Mapping-System, https://github.com/Mohitsaini785/3d-cadastral-digital-twin
- Dashboard demos: https://smart-india-hackathon-3-d-ulpin-gen.vercel.app/dashboard.html, https://smart-india-hackathon-3-d-ulpin-gen.vercel.app/ulpin-generator.html
- Open data LiDAR: https://www.bhuvan.nrsc.gov.in/, https://www.opentopography.org/
- OpenStreetMap: https://www.openstreetmap.org
- CityGML standard: https://www.opengeospatial.org/standards/citygml
- PostGIS documentation: https://postgis.net/documentation/
- CesiumJS: https://cesium.com/platform/cesiumjs/

## BUILD / DON'T BUILD

**BUILD:**
- Core pipeline: data ingestion (LiDAR/imagery/GIS), ground filtering, building clustering, footprint extraction, 2D-ULPIN assignment, floor detection via height histogram, volumetric parcel generation, 3D-ULPIN encoding.
- Validation engine: topology checks (no illegal overlaps), envelope compliance, height/area constraints, basic bylaw checks (setback, max height).
- Storage: PostGIS database with geometry column for 3D volumes (extruded footprints) and ULPIN as primary key.
- API: FastAPI endpoints for CRUD operations on parcels, approval workflow, and serving 3D Tiles/MVT for visualization.
- Frontend: React + CesiumJS 3D viewer showing parcels colored by confidence, with parcel selection, attribute popup, measurement tools (distance, height, area), and search/filter by ULPIN.
- Human-review UI: ability to approve/reject parcels, view/edit footprint (vertex editing), see validation warnings, and log actions.
- Demo package: Docker Compose file with pre-processed sample data (LiDAR, imagery, OSM footprints) for a city block, ready to run with `docker-compose up`.

**DON'T BUILD:**
- Kubernetes or complex orchestration unless genuinely necessary for scaling beyond demo.
- Mobile apps or IoT integrations.
- Chatbots or natural language interfaces for querying parcels.
- Advanced subunit (flat/room) detection from floor plans; keep unit suffix as `U00` in MVP.
- Real-time processing pipelines for continuous drone/LiDAR streams.
- AI model training from scratch; use pretrained models and fine-tune on small sample if needed.
- Complex editing tools (split, merge, extrusion) in the human-review UI; limit to footprint vertex editing for MVP.
- Nationwide tiling, CDN distribution, or enterprise-scale deployment features.
- Integration with state land-record IT systems beyond providing API connectors.
- Advanced validation engine features like contextual bylaw checks (setbacks from roads, water bodies) beyond simple distance-to-boundary.
- Photogrammetric DSM generation from imagery if LiDAR is available; fallback only if LiDAR missing.
- Ownership and encumbrance modeling; focus on geometric parcel identification.
- Export formats beyond CSV/GeoJSON (e.g., Shapefile, CityGML) unless trivial to add.
- User management, role-based access control, or audit trails beyond basic action logging; rely on demo's simplicity.