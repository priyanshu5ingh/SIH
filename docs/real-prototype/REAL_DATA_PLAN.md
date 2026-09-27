# Real Data Implementation Plan: VertiMap 3D Cadastre Prototype

**Project**: VertiMap — 3D ULPIN Generation & Vertical Property Mapping System  
**Team**: BuzzCodeX (Presidency University) | Problem Statement: SIH26011  
**Target Milestone**: Real-Data Spatial Information Pipeline & Cadastre Workbench  

---

## 1. Executive Summary & Strategy Pivot

This plan transitions VertiMap from a deterministic demonstration prototype into an authentic, verifiable spatial pipeline operating on **real, traceable geospatial data** for an urban pilot area in **Bengaluru, Karnataka**.

### Core Principles
1. **Absolute Data Integrity**: Zero hardcoded fake coordinates, zero `Math.random()`, zero simulated timestamps, and zero fabricated government identifiers.
2. **Four Distinct Data Classes**:
   - `REAL`: Directly observed from external public/government datasets (OpenStreetMap, Microsoft ML Footprints, SSLR Cadastral Survey maps, OpenDEM/SRTM elevation).
   - `DERIVED`: Deterministically calculated from real geometry in a projected CRS (EPSG:32643 UTM Zone 43N) via computational geometry (metric area $m^2$, polygon intersection, volume $m^3$, centroid, height).
   - `ESTIMATED`: Inferred using transparent, documented heuristics (e.g. height-derived floor level estimation when direct attribute evidence is absent).
   - `VALIDATION TEST CASE`: Strictly isolated and labeled controlled test scenarios to test conflict handling without faking survey data.
3. **Traceable Provenance**: Every property, building, vertical level, and spatial metric is linked to its source dataset, source feature ID, retrieval date, CRS, processing method, and license.
4. **Honest Vertical Mapping**:
   - `Base Parcel ID`: Real survey number / cadastral ID.
   - `Official ULPIN`: Only displayed when officially provided; otherwise stated as *"Not available in source dataset"*.
   - `Proposed VPID`: Structured hierarchical 3D identifier: `<BASE_PARCEL_ID>-<BUILDING_ID>-<LEVEL_ID>-<UNIT_ID>`.

---

## 2. Pilot Geography Selection

* **City / Region**: Bengaluru Urban District, Karnataka, India
* **Pilot Sector**: **Central Bengaluru Commercial & Institutional Corridor (MG Road / Shivajinagar / Cubbon Park Sector)**
  * **Bounding Box**: `[77.5950°E, 12.9700°N]` to `[77.6100°E, 12.9820°N]`
  * **Projected CRS**: `EPSG:32643` (WGS 84 / UTM Zone 43N, Central Meridian 75°E)
* **Dataset Scale**: ~25–40 real buildings and cadastral parcels with diverse urban topologies:
  * Commercial high-rises (multi-level structures with `building:levels` attributes).
  * Institutional complexes with podiums and annexes.
  * Mixed-use mid-rises with height estimates.
  * Real boundary containment scenarios including clean containment, multi-building parcels, and boundary cantilever overhangs.

---

## 3. Data Acquisition & Processing Pipeline

```
[External Sources]
├── OpenStreetMap Overpass (Real Footprints, Heights, Levels, Names)
├── Microsoft GlobalML Building Footprints (Footprint Verification)
├── OpenDEM / SRTM Elevation (Ground Elevation Datum)
└── Karnataka SSLR Cadastral Reference (Survey Numbers & Parcel Boundaries)
       ↓
[Data Ingestion Engine] (scripts/ingest_real_data.py)
       ↓
[CRS Reprojection] (EPSG:4326 WGS84 → EPSG:32643 UTM Zone 43N)
       ↓
[Spatial Association] (Shapely Polygon Intersection, Containment Ratio)
       ↓
[Vertical Model Derivation] (Direct Attribute vs Height-Derived Bands)
       ↓
[10-Rule Topology Validation Engine] (Geometry, Overhang, Volume, VPID)
       ↓
[Provenance Registry & JSON Manifest] (data/processed/ & data/metadata/)
       ↓
[FastAPI / Spatial Service] (backend/ & frontend/ adapter)
       ↓
[VertiMap 3D Viewer & Workbench] (Real extruded footprints & Inspector)
```

---

## 4. Phase-by-Phase Roadmap

| Phase | Description | Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | Real data acquisition, caching, and provenance cataloging | `data/raw/`, `data/metadata/`, `DATA_PROVENANCE.md` |
| **Phase 2** | Geospatial preprocessing & CRS transformation (EPSG:32643) | `scripts/ingest_real_data.py`, metric area/coordinate pipelines |
| **Phase 3** | Spatial association & parcel-building containment | Intersection matrix, association status (`ASSOCIATED`, `AMBIGUOUS`) |
| **Phase 4** | Vertical evidence resolution & level decomposition | Observed levels, height-derived bands, confidence scoring |
| **Phase 5** | 3D procedural extrusion of actual polygon coordinates | Dynamic Three.js extrusion using meter-accurate local coordinates |
| **Phase 6** | Real 10-rule spatial topology validation engine | Validation check executor with PASS/WARNING/FAIL outputs |
| **Phase 7** | Traceable evidence registry & deterministic Proposed VPID | Provenance records linking UI elements to real source IDs |
| **Phase 8** | Dynamic review state mutation & application-generated audit trail | Real-time event logger (no pre-seeded fake events) |
| **Phase 9** | Frontend integration & Real Data Modal badge | `DemoWorkspace.js`, `DemoScene3D.js`, `DemoPropertyInspector.js` |
| **Phase 10** | End-to-end browser QA & Final Report | Video/screenshots, `FINAL_REAL_DATA_REPORT.md`, `REAL_DATA_MANIFEST.json` |
