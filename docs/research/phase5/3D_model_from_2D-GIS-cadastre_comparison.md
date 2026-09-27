# 3D_model_from_2D-GIS-cadastre Project Comparison Table

| Feature | Claimed | Actually Implemented | Runtime Verified | Real Data | Synthetic/Demo |
|---------|---------|----------------------|------------------|-----------|----------------|
| Government cadastral integration | Yes (uses official cadastre data for solar analysis) | Yes (imports 2D GIS cadastral data into AutoCAD as LWPOLYLINE objects) | Yes (script runs in AutoCAD) | Yes (can use real cadastral data) | No |
| Real ULPIN linkage | Yes (ID/ULPIN logic mentioned in tutorial: Process parcels using Unique Land Parcel Identification Numbers (ULPIN) for accurate modeling) | No (the AutoLISP script does not generate or use ULPIN; ULPIN logic occurs during data preparation outside the script) | No (script does not handle ULPIN) | No (ULPIN not used in script) | No |
| Real LiDAR | Not claimed | Not implemented (script works only on 2D polylines in AutoCAD layers) | N/A | N/A | N/A |
| Real DEM/DSM | Not claimed | Not implemented (height must be pre-computed and placed in layer name by user) | N/A | N/A | N/A |
| Real floor detection | Not claimed | Not implemented (script does not create floors; output is single volume per footprint) | N/A | N/A | N/A |
| AI predictions | Not claimed | Not implemented (no AI/ML components) | N/A | N/A | N/A |
| Topology validation | Not claimed | Not implemented (no topology validation; user must ensure clean geometries before and after) | N/A | N/A | N/A |
| Database persistence | Not claimed | Not implemented (data persists in AutoCAD drawing (DWG) file, not a database) | Yes (drawing file stores data) | Yes (real data stored in DWG) | No (but not a spatial database) |
| QR verification | Not claimed | Not implemented | No | No | No |
| Disaster simulation | Not claimed | Not implemented | No | No | No |
| Underground mapping | Not claimed (extrusion only in positive Z direction from polyline plane) | Not implemented (no support for negative Z/extrusion) | N/A | N/A | N/A |
| Unit-level property mapping | Not claimed | Not implemented (script does not create units) | N/A | N/A | N/A |
| Officer review | Yes (Human-in-the-loop: Manual review/intervention points for verifying results or correcting errors) | Yes (user must visually inspect extruded models in AutoCAD for correctness) | Yes (user can review results) | Yes (user reviews real output) | No |
| Audit logs | Not claimed | Not implemented (no automatic logging; corrections made directly in AutoCAD drawing) | No | No | No |

## Notes
- The script is a pure AutoLISP plugin for AutoCAD that extrudes 2D polylines to 3D solids based on layer names (assumed to be numeric height values).
- It does not include any AI/ML, topology validation, database persistence, or advanced GIS processing.
- All data preparation (including assigning height to layer names, potentially using ULPIN for parcel tracking) must be done manually before running the script.
- The script does not validate input geometry; relies on user to provide clean closed polylines.
- Output remains in the AutoCAD drawing; no separate database or API.
- Human review is essential for verifying results and correcting errors.
- QR verification, disaster simulation, underground mapping, and unit-level mapping are not part of the project.