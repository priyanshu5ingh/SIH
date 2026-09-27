# BoundaryLens Comparison Table

| Feature | Claimed | Actually Implemented | Runtime Verified | Real Data | Synthetic/Demo |
|---------|---------|----------------------|------------------|-----------|----------------|
| Government cadastral integration | Yes (uses Bengaluru Urban Cadastral Maps from opencity.in) | Yes (ingests cadastral parcels) | Yes (runs with local data) | Yes (authoritative government cadastral) | No |
| Real ULPIN linkage | Yes (proposes hierarchical ULPIN linkage) | Yes (generates deterministic 3D Spatial Identity: [cadastral_parcel_id]/[bldg_id]/[Z-elevation]) | Yes (ID generation component) | Yes (based on actual parcel IDs) | No (descriptive, not official ULPIN) |
| Real LiDAR | Not explicitly claimed (uses DEM/DSM) | No LiDAR mentioned in data sources | N/A | N/A | N/A |
| Real DEM/DSM | Yes (uses Bhuvan/CartoDEM or Copernicus DEM for DEM; Copernicus DEM GLO-30 for DSM) | Yes (DEM/DMS processor) | Yes (height calculation) | Yes (real satellite DEM/DSM) | No |
| Real floor detection | Yes (uses OSM `building:levels` tags and ML model for floor count prediction) | Yes (attribute prediction model: XGBoost/Random Forest for floor count) | Yes (model inference) | Yes (OSM tags are real crowd-sourced data) | No |
| AI predictions | Yes (building segmentation U-Net/Mask R-CNN, floor count prediction XGBoost/Random Forest, anomaly detection Isolation Forest) | Yes (all three ML components are real, not simulated) | Yes (models generate predictions) | Yes (trained on real datasets) | No |
| Topology validation | Yes (explicitly validates hierarchy, mesh validity, etc.) | Yes (topology validator service) | Yes (validation runs) | Yes (operates on real geometries) | No |
| Database persistence | Yes (storage in PostgreSQL/PostGIS) | Yes (PostGIS with spatial indexing) | Yes (database stores features) | Yes (real spatial data stored) | No |
| QR verification | Not claimed | Not implemented | No | No | No |
| Disaster simulation | Not claimed | Not implemented | No | No | No |
| Underground mapping | Claimed (handles negative Z values for underground) | Yes (supports underground structures with negative Z) | Yes (if data provided) | Yes (can process underground data) | No |
| Unit-level property mapping | Implied (hierarchy includes unit level) | Not explicitly implemented (documents mention unit as future work) | No | No | No |
| Officer review | Yes (human review gate for conflicts) | Yes (review workflow: APPROVE/CORRECT/REJECT/MARK_UNRESOLVED) | Yes (review panel in UI) | Yes (human reviewers validate outputs) | No |
| Audit logs | Yes (comprehensive provenance tracking and verification logs) | Yes (evidence table tracks source, timestamps, processing steps; verification logs from reviewers) | Yes (logs generated) | Yes (real provenance data) | No |

## Notes
- BoundaryLens does not use LiDAR; it uses DEM/DSM for elevation.
- The ULPIN generated is a proposed descriptive format, not the official 12-digit ULPIN.
- Unit-level mapping is not detailed in the documents; likely future work.
- QR verification and disaster simulation are not part of the project.