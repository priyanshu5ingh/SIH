# Project Context: VertiMap (3D ULPIN & Vertical Property Cadastre)

**Target Problem Statement**: SIH26011 — 3D ULPIN Generation & Vertical Property Mapping System  
**Team**: BuzzCodeX  
**Institution**: Presidency University  
**Focus**: Professional Land-Information Workbench & Vertical Cadastre System  

---

## 1. Problem Definition & Core Architecture

Traditional 2D land cadastres (Bhu-Aadhaar / ULPIN) assign a unique 14-digit identifier based on lateral (surface) parcel geometry. In multi-level urban environments—including high-rises, commercial towers, basements, and underground transit corridors—2D boundaries fail to represent vertically stacked property rights.

VertiMap bridges this gap through a defensible 7-stage architectural pipeline:

```
[ PARCEL IDENTITY ] (Existing 2D ULPIN / Bhu-Aadhaar)
        ↓
[ VERTICAL SPATIAL STRUCTURE ] (Footprints, Levels, Basements, Subsurface)
        ↓
[ EVIDENCE TRACE ] (LiDAR, Point-Cloud Slabs, Attribute Data, Uncertainty)
        ↓
[ DETERMINISTIC VALIDATION ] (Topology, Envelopes, Overlaps, Bylaws)
        ↓
[ PROPOSED VPID ] (Deterministic 3D Extension: Base ULPIN + B# + F# + U#)
        ↓
[ HUMAN-IN-THE-LOOP REVIEW ] (Interactive Workbench, Status Override, Reasoning)
        ↓
[ AUDIT LOG & REVISION ] (Immutable History, Timestamped Traceability)
```

---

## 2. Source-of-Truth & Terminology Strategy

1. **Official / Base ULPIN**:
   The standard 14-character alphanumeric identifier derived from geographic coordinates of the lateral parcel under the Digital India Land Records Modernisation Programme (DILRMP).
2. **Proposed VPID (Vertical Property Identifier)**:
   Our prototype 3D vertical spatial identifier extension (e.g. `KA-DEMO-P01-B01-F03-U00`). This is explicitly presented as a proposed extension for volumetric cadastres, never as an official government decree.
3. **Internal Database ID**:
   Surrogate system keys (`p1`, `b1`, `f3`, UUIDs) used internally by state or platform IT infrastructure.
4. **3D Geometry ID**:
   Volumetric mesh references for spatial indexing, spatial joins, and 3D tile rendering.

---

## 3. Floor Detection Methodology

- **College Demo Baseline**: Deterministic architectural fixtures with explicit status tagging (`VERIFIED` vs `ESTIMATED`).
- **SIH Full Implementation**:
  - **Primary**: Point-cloud clustering / geometric plane extraction (RANSAC / DBSCAN on horizontal slabs).
  - **Fallback**: Height histogram peak detection and building height subdivision.
  - **Auxiliary Verification**: Floor plans, architectural drawings, and OpenStreetMap `building:levels` where available.

---

## 4. Two-Track Development Strategy

- **Track A (Immediate College Demo)**:
  - 100% stable, deterministic local data provider.
  - Zero brittle backend dependencies during live judging.
  - Rich 3D architectural rendering, vertical slice sectioning, subsurface basement inspection, evidence-to-geometry visual linking, envelope conflict visualization, and interactive review workflow.
- **Track B (Long-term SIH Implementation)**:
  - Plug-and-play API data provider swapping in FastAPI + PostGIS backend.
  - Integration with PDAL point-cloud processing, automated building clustering, and GeoJSON/3D-Tiles streaming.
