# Technical Notes & Evaluation Brief for Hackathon Judges

**Project**: VertiMap — 3D ULPIN Generation & Vertical Property Mapping System  
**Team**: BuzzCodeX | Institution: Presidency University  
**Problem Statement**: SIH26011  

---

## 1. Where Does the Data Come From?

VertiMap operates strictly on traceable, verifiable public geospatial datasets:
* **Vector Building Footprints & Attributes**: Ingested directly from **OpenStreetMap (OSM)** via Overpass API (`EPSG:4326`) under the **Open Database License (ODbL) v1.0**.
* **Secondary Cross-Verification**: Boundary polygons cross-verified against **Microsoft GlobalML Building Footprints** under the **CDLA Permissive 2.0** license.
* **Cadastral Revenue Parcels**: Referenced against **Karnataka Survey Settlement and Land Records (SSLR / Bhoomi)** revenue survey numbering schema (`Sy.No. 42/1`, `Sy.No. 108/3`, `Sy.No. 14/2`).
* **Digital Elevation Model (DEM)**: 30-meter ground elevation grid sampled from **SRTM 30m** via the **Open Topo Data** service (`api.opentopodata.org/v1/srtm30m`, Public Domain / NASA / USGS).

---

## 2. How Does Parcel-Building Association Work?

1. **Reprojection to Projected Metric CRS**: Both 2D cadastral parcels and 2D building footprints are projected from WGS 84 (`EPSG:4326`) into **UTM Zone 43N (`EPSG:32643`)**, enabling true sub-meter spatial analysis.
2. **Geometric Intersection**: Using computational geometry (Shapely), the exact intersection polygon between the building footprint ($B$) and the cadastral parcel polygon ($P$) is computed:
   $$I = P \cap B, \quad \text{Containment Ratio} = \frac{\text{Area}(I)}{\text{Area}(B)}$$
3. **Association Status Assignment**:
   * $\ge 95\%$ containment $\implies$ **`ASSOCIATED`**
   * $80\% - 95\%$ containment $\implies$ **`PARTIAL / WARNING`**
   * $< 80\%$ containment $\implies$ **`CONFLICT / OVERHANG`**

---

## 3. How Are Vertical Levels Determined & Stratified?

VertiMap strictly avoids fabricating floor detection. It follows a rigorous 3-tier evidence hierarchy:

1. **`OBSERVED (SOURCE ATTRIBUTE)`**:
   - Used when the source explicitly contains vertical metadata (e.g. OSM `building:levels=6` or `building:levels:underground=1`).
   - Example: *Public Utility Building (B02)* has 6 above-ground levels and 1 basement level directly observed.
2. **`ESTIMATED (HEIGHT-DERIVED)`**:
   - When explicit level tags are absent, the system derives level count from physical building height ($H$) using a standard floor height ($3.5\text{m}/\text{storey}$):
     $$N_{\text{levels}} = \left\lfloor \frac{H}{3.5\text{m}} \right\rfloor$$
   - Example: *Raheja Towers (B01)* ($H = 42.0\text{m} \implies 12$ levels). Flagged for human review.
3. **`VALIDATION TEST CASE`**:
   - Upper floor cantilever overhang modeled on *Metro Boulevard Annex (B03)* ($F03-F04$) to demonstrate spatial conflict detection in the 3D viewer. Explicitly labeled to avoid representing test cases as real survey data.

---

## 4. Why Is the Identifier Designated as "Proposed VPID"?

* **Official ULPIN Integrity**: A 14-digit ULPIN (Bhu-Aadhaar) is issued exclusively by state revenue and survey authorities under the Ministry of Rural Development / Department of Land Resources (DoLR). Where an official ULPIN is not yet assigned in public records, VertiMap honestly displays:
  $$\text{Official ULPIN: Not available in source dataset}$$
* **Proposed VPID Format**: VertiMap issues a deterministic 3D cadastral unit code based on ISO 19152 Land Administration Domain Model (LADM) standards:
  $$\text{Proposed VPID} = \langle\text{SOURCE\_PARCEL\_ID}\rangle-\langle\text{BUILDING\_CODE}\rangle-\langle\text{LEVEL\_CODE}\rangle-\langle\text{UNIT\_CODE}\rangle$$
  *Example*: `KA-BLR-SY-42-1-B01-F03-U00`

---

## 5. How Does Source Comparison Work?

VertiMap provides an automated **Source Comparison Engine** (OSM vs Microsoft GlobalML):
* Computes spatial Intersection-over-Union (IoU):
  $$\text{IoU} = \frac{\text{Area}(B_{\text{OSM}} \cap B_{\text{MS}})}{\text{Area}(B_{\text{OSM}} \cup B_{\text{MS}})} \times 100\%$$
* Evaluates Area Delta ($\Delta = |\text{Area}_{\text{OSM}} - \text{Area}_{\text{MS}}|$) and classifies alignment as **`SOURCE AGREEMENT`** ($\ge 90\%$ IoU) or **`CROSS-SOURCE DISCREPANCY`**.

---

## 6. How Does the 10-Rule Topology Validation Engine Work?

All 10 geometric rules are computed dynamically using actual coordinate geometry:
1. `RULE-01`: Polygon 2D closure & manifold validity (OGC Simple Features).
2. `RULE-02`: Parcel-building containment ratio in `EPSG:32643`.
3. `RULE-03`: 3D building envelope vs vertical parcel column extrusion.
4. `RULE-04`: Monotonic $Z$-elevation sequence continuity ($Z_{\min} < Z_{\max}$).
5. `RULE-05`: Inter-floor 1D vertical overlap detection.
6. `RULE-06`: Positive volumetric geometry ($V = \text{Area} \times \text{Height} > 0$).
7. `RULE-07`: Disjoint 3D spatial units (no internal polyhedral collision).
8. `RULE-08`: Cross-source attribute agreement.
9. `RULE-09`: Subsurface underground cadastre tag verification.
10. `RULE-10`: VPID namespace collision and uniqueness check.

---

## 7. Known Limitations & Future SIH Production Roadmap

* **DEM Resolution**: SRTM 30m provides reliable regional elevation datum, but sub-meter urban surface modeling in production will utilize high-resolution drone photogrammetry or airborne LiDAR.
* **Subsurface Geometry**: Open data sources rarely provide underground floor plans; production integration will ingest municipal building sanction blueprints and ground-penetrating radar (GPR) surveys.
* **Official Cadastre Integration**: Production version will integrate directly with Karnataka SSLR Bhu-Naksha APIs and DoLR NAKSHA services via authenticated WFS/WMS spatial streams.
