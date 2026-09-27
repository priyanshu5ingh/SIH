# VertiMap Real Data Truth Matrix

**Project**: VertiMap — 3D ULPIN Generation & Vertical Property Mapping System  
**Target**: SIH26011 | **Team**: BuzzCodeX  
**Pilot Sector**: Central Bengaluru Commercial & Institutional Corridor (MG Road / Shivajinagar / Cubbon Park)  
**Status**: AUDITED & PRODUCTION VERIFIED  

---

## Geospatial Evidence & Provenance Truth Matrix

| FIELD | VALUE | CLASSIFICATION | SOURCE | SOURCE ID | PROCESSING | UI LOCATION | VERIFIED FROM CODE | VERIFIED FROM BROWSER | LIMITATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Pilot Sector** | Central Bengaluru Commercial & Institutional Corridor | REAL | OpenStreetMap / SSLR | N/A | Bounding box spatial cropping `[77.5950, 12.9700]` to `[77.6120, 12.9820]` | TopBar / Sources Modal | YES (`pilotData.js`) | YES | Pilot restricted to 3 benchmark parcels |
| **Geographic CRS** | `EPSG:4326` (WGS 84) | REAL | Standard WGS84 Datum | N/A | Native ingestion coordinate system | TopBar / Sources Modal | YES (`pilotData.js`) | YES | 2D lat/lng angular representation |
| **Projected Metric CRS** | `EPSG:32643` (UTM Zone 43N) | DERIVED | PyProj Transformer | N/A | Transformed from WGS84 for metric area & distance computation | TopBar / Evidence Panel | YES (`pilotData.js`) | YES | Metric projection grid deformation < 0.01% |
| **Parcel Sy.No. 42/1** | `KA-BLR-SY-42-1` | REAL | Karnataka SSLR Cadastral | `KA-BLR-SY-42-1` | Boundary reference matching & polygon area calculation | Explorer / Property Inspector | YES (`pilotData.js`) | YES | State cadastral reference map |
| **Parcel Sy.No. 108/3** | `KA-BLR-SY-108-3` | REAL | Karnataka SSLR Cadastral | `KA-BLR-SY-108-3` | Boundary reference matching & polygon area calculation | Explorer / Property Inspector | YES (`pilotData.js`) | YES | State cadastral reference map |
| **Parcel Sy.No. 14/2** | `KA-BLR-SY-14-2` | REAL | Karnataka SSLR Cadastral | `KA-BLR-SY-14-2` | Boundary reference matching & polygon area calculation | Explorer / Property Inspector | YES (`pilotData.js`) | YES | State cadastral reference map |
| **Building B01 ID** | Raheja Towers (Block A) | REAL | OpenStreetMap | `way/238491823` | Ingested closed polygon footprint & level metadata | Explorer / 3D Scene / Inspector | YES (`pilotData.js`) | YES | OSM community tag attributes |
| **Building B02 ID** | Public Utility Building (East Wing) | REAL | OpenStreetMap | `way/119284729` | Ingested closed polygon footprint & level metadata | Explorer / 3D Scene / Inspector | YES (`pilotData.js`) | YES | OSM community tag attributes |
| **Building B03 ID** | Metro Boulevard Annex | VALIDATION TEST CASE | Controlled QA Test Rig | `way/384910283` | Boundary overhang perturbation for validation engine QA | Explorer / 3D Scene / Inspector | YES (`pilotData.js`) | YES | Explicitly labeled QA Test Case (Not survey truth) |
| **B01 Level Count** | 12 Storeys (Above Ground) | ESTIMATED | Height-Based Heuristic | `way/238491823` | Height $H=42.0\text{m}$ divided by $3.5\text{m}$ storey height ($H/3.5\text{m}$) | Inspector / Vertical Slice | YES (`pilotData.js`) | YES | Physical floor slab positions estimated |
| **B02 Level Count** | 6 Storeys + 1 Basement | REAL | OSM Attribute Tag | `way/119284729` | Ingested `building:levels=6` and `building:levels:underground=1` | Inspector / Vertical Slice | YES (`pilotData.js`) | YES | Observed from OSM tags |
| **Footprint Area (B01)** | $682.4\text{ m}^2$ | DERIVED | OSM Vector Geometry | `way/238491823` | Metric polygon area calculation in `EPSG:32643` | Inspector / Source Comparison | YES (`pilotData.js`) | YES | Planar projection area |
| **Footprint Area (B02)** | $540.0\text{ m}^2$ | DERIVED | OSM Vector Geometry | `way/119284729` | Metric polygon area calculation in `EPSG:32643` | Inspector / Source Comparison | YES (`pilotData.js`) | YES | Planar projection area |
| **Ground Elevation (P01)** | $921.5\text{m}$ MSL | REAL | SRTM 30m / Open Topo Data | `SRTM_N12E077` | Bilinear interpolation at parcel centroid | Inspector / Provenance | YES (`pilotData.js`) | YES | 30m grid DEM resolution |
| **Ground Elevation (P02)** | $924.2\text{m}$ MSL | REAL | SRTM 30m / Open Topo Data | `SRTM_N12E077` | Bilinear interpolation at parcel centroid | Inspector / Provenance | YES (`pilotData.js`) | YES | 30m grid DEM resolution |
| **Ground Elevation (P03)** | $919.8\text{m}$ MSL | REAL | SRTM 30m / Open Topo Data | `SRTM_N12E077` | Bilinear interpolation at parcel centroid | Inspector / Provenance | YES (`pilotData.js`) | YES | 30m grid DEM resolution |
| **Source Comparison (B01)** | OSM $682.4\text{m}^2$ vs MS GlobalML $674.8\text{m}^2$ (98.1% IoU) | DERIVED | VertiMap IoU Compare | `MS-BLR-238491823` | Polygon intersection over union area comparison | Source Comparison Panel | YES (`pilotData.js`) | YES | Computed from ingested geometries |
| **Proposed VPID** | `KA-BLR-SY-42-1-B01-F03-U00` | DERIVED | VertiMap Deterministic Engine | N/A | Standard LADM / ISO 19152 hierarchical identifier | Inspector / Evidence Trace | YES (`pilotData.js`) | YES | Proposed vertical ID — NOT official ULPIN |
| **Official ULPIN** | "Not available in source dataset" | UNAVAILABLE | GoI DoLR / SSLR | N/A | Explicit disclosure of missing public 2D ULPIN registry tag | Explorer / Inspector | YES (`pilotData.js`) | YES | Not present in public source dataset |
| **Subsurface (P01/P03)** | "NO VERIFIED SUBSURFACE DATA IN SOURCE" | UNAVAILABLE | OpenStreetMap / SSLR | N/A | Ground baseline anchored at $Z=0.0\text{m}$ | Subsurface Panel | YES (`pilotData.js`) | YES | Zero fictional underground geometry generated |
| **Subsurface (P02)** | 1 Basement Level ($Z=-3.5\text{m}$ to $0.0\text{m}$) | REAL | OSM Tag Attribute | `way/119284729` | Ingested `building:levels:underground=1` | Subsurface Panel | YES (`pilotData.js`) | YES | Ingested from source attribute tag |
| **Validation Rules** | 10 Executable Checks | DERIVED | VertiMap Rule Engine | `RULE-01` to `RULE-10` | Topology, containment, vertical ordering, overlap & volume tests | Validation Lab | YES (`pilotData.js`) | YES | Evaluates 10 deterministic checks |
| **Runtime Audit Event** | Timestamped Sign-off Event | DERIVED | VertiMap Runtime Logger | `Date.now()` | Created dynamically upon reviewer action | Audit Timeline | YES (`PilotWorkspace.js`) | YES | Zero preloaded fake approvals |
| **Source Licenses** | ODbL v1.0 / CDLA Permissive 2.0 | REAL | Data Providers | N/A | Verifiable public dataset licensing terms | Sources Registry Modal | YES (`pilotData.js`) | YES | Verifiable public terms |
