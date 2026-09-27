# Real-Data Architecture & Processing Pipeline

**Project**: VertiMap — 3D ULPIN Generation & Vertical Property Mapping System  
**System Architecture**: Spatial ETL $\rightarrow$ Topological Engine $\rightarrow$ Persistence Layer $\rightarrow$ 3D Geospatial Workbench  

---

## 1. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL DATA SOURCES                           │
│  • OpenStreetMap Overpass (Vector Footprints, Levels, Addresses)       │
│  • Karnataka SSLR Cadastral Reference (Revenue Parcels)               │
│  • OpenDEM / SRTM (30m Elevation Grid)                                │
│  • Microsoft GlobalML Building Footprints                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 DATA INGESTION & NORMALIZATION PIPELINE                 │
│                 (backend/scripts/ingest_real_data.py)                  │
│  1. Checksum & Raw Data Caching (`data/raw/`)                          │
│  2. CRS Transformation: EPSG:4326 (WGS84) → EPSG:32643 (UTM 43N)       │
│  3. Geographic Coordinate to Metric Local Origin Normalization         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SPATIAL & VERTICAL DERIVATION ENGINE                 │
│  • Parcel-Building Association: Shapely Polygon Intersection & Ratio   │
│  • Metric Computation: Shoelace Area (m²), Elevation Datum, Volumes   │
│  • Vertical Stratification: Direct Attributes vs Height-Derived Bands │
│  • VPID Generation: Deterministic Hierarchical Identifier Scheme       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   10-RULE TOPOLOGY VALIDATION ENGINE                   │
│  RULE-01: Geometry Validity        RULE-06: Positive Volume            │
│  RULE-02: Parcel Association       RULE-07: Disjoint Spatial Units     │
│  RULE-03: Boundary Overhang        RULE-08: Source Conflict Detection  │
│  RULE-04: Level Ordering           RULE-09: Missing Evidence Check     │
│  RULE-05: Vertical Overlap         RULE-10: VPID Uniqueness            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                PERSISTENCE & PROVENANCE REGISTRY                       │
│  • Processed Spatial Data (`data/processed/real_pilot_data.json`)      │
│  • Machine-Readable Provenance Manifest (`REAL_DATA_MANIFEST.json`)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 VERTIMAP 3D CADASTRE WORKBENCH (UI)                    │
│  • Three.js Procedural Extruder (Real Polygon Coordinates)             │
│  • 4 Visual Modes: 3D View, Vertical Slice, Subsurface, Validation    │
│  • Interactive Property Explorer, Inspector, Evidence Trace, Review   │
│  • Application-Driven Real-Time Audit Trail (Zero Pre-seeded Mockery) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Coordinate Transformation Pipeline

1. **Source Coordinate System**: All raw ingestion is performed in WGS 84 (`EPSG:4326` Longitude/Latitude).
2. **Projected Coordinate System**: Data is transformed to UTM Zone 43N (`EPSG:32643`) for metric calculations:
   $$x_{\text{metric}}, y_{\text{metric}} = \text{Project}_{\text{EPSG:32643}}(\text{lon}, \text{lat})$$
3. **Local Viewer Origin**: To avoid 32-bit floating point precision jitter in WebGL/Three.js, coordinates are centered around the pilot centroid $(\bar{x}, \bar{y})$:
   $$X_{\text{local}} = x_{\text{metric}} - \bar{x}, \quad Z_{\text{local}} = -(y_{\text{metric}} - \bar{y})$$
4. **Volume Extrusion**: Polygon footprints in local meters are extruded along the $Y$-axis according to each floor's elevation range $[Z_{\min}, Z_{\max}]$.

---

## 3. Data Flow & Adapter Pattern

* The frontend loads processed datasets through a unified `SpatialDataProvider` interface.
* In the real-data prototype, `RealDataProvider` reads directly from verified JSON/GeoJSON files produced by the Python ingestion pipeline, with complete provenance metadata attached to every entity.
* When transitioning to Track B (Production), this same interface connects to backend REST APIs (`/api/v1/parcels`, `/api/v1/spatial-units`) without altering UI component contracts.
