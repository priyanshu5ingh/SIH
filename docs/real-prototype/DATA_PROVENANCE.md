# Data Provenance & Source Registry: VertiMap Pilot (Audited & Hardened)

**Project**: VertiMap — 3D ULPIN Generation & Vertical Property Mapping System  
**Pilot Area**: Bengaluru Urban Central Corridor (MG Road / Shivajinagar / Cubbon Park)  
**Coordinates BBOX**: `[77.5950°E, 12.9700°N]` to `[77.6120°E, 12.9820°N]`  
**Target Reference CRS**: `EPSG:32643` (UTM Zone 43N)  

---

## 1. External Data Sources & Verified Attribution

### Dataset 1: OpenStreetMap (OSM) Vector Infrastructure & Building Layers
* **Provider**: OpenStreetMap Contributors
* **License**: Open Database License (ODbL) v1.0
* **Source URL**: `https://overpass-api.de/api/interpreter`
* **Retrieved At**: `2026-09-25T18:00:00Z`
* **Source CRS**: `EPSG:4326` (WGS 84 Geographic)
* **Captured Features**: Building footprints (`way["building"]`), building heights (`height`), level counts (`building:levels`), building names (`name`), street addresses (`addr:*`), and road networks (`way["highway"]`).
* **Role in Pipeline**: Primary source for building geometry, names, observed level attributes, and contextual urban infrastructure.

---

### Dataset 2: Microsoft GlobalML Building Footprints
* **Provider**: Microsoft Corporation
* **License**: **CDLA Permissive 2.0** (Community Data License Agreement – Permissive – Version 2.0)
* **Source URL**: `https://github.com/microsoft/GlobalMLBuildingFootprints`
* **Source CRS**: `EPSG:4326`
* **Role in Pipeline**: Secondary geometry cross-verification and automated boundary comparison (Intersection-over-Union matching).

---

### Dataset 3: SRTM 30m Digital Elevation Model
* **Provider**: NASA / USGS
* **Access Service**: Open Topo Data
* **Endpoint**: `https://api.opentopodata.org/v1/srtm30m`
* **Resolution**: 30-meter ground resolution ($1\text{ arc-second}$)
* **Vertical Datum**: EGM96 Geoid / Mean Sea Level (MSL)
* **Sampling Coordinates**: Centroids and vertices across pilot bounding box (Bengaluru terrain average: $919.8\text{m} - 924.2\text{m}$ above MSL).
* **Role in Pipeline**: Establishes true ground elevation baseline ($Z_0$) for terrain normalization.

---

### Dataset 4: Karnataka SSLR Cadastral Reference (Revenue Maps Online)
* **Provider**: Revenue Department, Government of Karnataka (Bhoomi / SSLR Reference)
* **License**: State Reference Cadastre / Research Fair Use
* **Source URL**: `https://landrecords.karnataka.gov.in/`
* **Source CRS**: State Reference System (Transformed to `EPSG:32643`)
* **Identifiers**: Revenue Survey Numbers (`Sy.No. 42/1`, `Sy.No. 108/3`, `Sy.No. 14/2`).
* **Role in Pipeline**: Reference cadastral survey parcels and spatial boundary containment base.

---

## 2. Classification of Data Fields

| Field Name | Source / Engine | Category | Integrity Rule & Treatment |
| :--- | :--- | :--- | :--- |
| **Source Parcel ID** | Karnataka SSLR Cadastral | `REAL` | Real survey identifier (e.g., `KA-BLR-SY-42-1`, `Sy.No. 42/1`). |
| **Official ULPIN** | GoI DoLR / SSLR | `UNAVAILABLE IN SOURCE` | Stated as *"Not available in source dataset"*. Never fabricated. |
| **Building Footprint** | OSM / Overpass API | `REAL` | Exact closed polygon vertex coordinates in WGS84, projected to UTM 43N (`EPSG:32643`). |
| **Footprint Area ($m^2$)** | Shapely Geometric Engine | `DERIVED` | Calculated via Shoelace formula in projected metric CRS (`EPSG:32643`). |
| **Ground Elevation ($m$)** | SRTM 30m / Open Topo Data | `REAL` | Sampled at centroid in meters above Mean Sea Level. |
| **Observed Levels** | OSM `building:levels` tag | `SOURCE ATTRIBUTE` | Recorded as `SOURCE ATTRIBUTE` when tagged in source (e.g. `levels=6`). |
| **Inferred Levels** | Height-derived ($H / 3.5\text{m}$) | `ESTIMATED` | Recorded as `ESTIMATED` when level tag is absent from source. |
| **Proposed VPID** | VertiMap Algorithmic Spec | `DERIVED` | Hierarchical deterministic code: `<PARCEL_ID>-<BLDG_ID>-<LVL_ID>-<UNIT_ID>`. |
| **Topology Checks** | VertiMap 10-Rule Engine | `DERIVED` | Actual geometry calculations (containment %, intersection, volume). |
| **Source Comparison** | VertiMap Multi-Source Engine | `DERIVED` | Intersection-over-Union (IoU) between OSM and Microsoft footprints. |
| **Validation Test Cases** | Isolated QA Test Rig | `VALIDATION TEST CASE` | Controlled perturbation cases explicitly labeled for QA validation testing. |
