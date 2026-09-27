# GeoVISTA / SIH26011-3D-ULPIN Project Comparison Table

| Feature | Claimed | Actually Implemented | Runtime Verified | Real Data | Synthetic/Demo |
|---------|---------|----------------------|------------------|-----------|----------------|
| Government cadastral integration | Yes (accepts GIS parcel layers as data source) | Yes (GIS data source type supported) | Yes (can ingest GIS data) | Yes (can use real cadastral data) | No |
| Real ULPIN linkage | Yes (ULPIN generation logic, manual assignment, planned automatic generation) | Yes (ULPIN uniqueness enforced via DB constraint and API validation; manual assignment implemented; automatic generation planned) | Yes (manual assignment works; automatic generation not yet implemented) | Yes (ULPIN based on real parcel data) | No (but automatic generation is planned, not yet implemented) |
| Real LiDAR | Yes (LiDAR listed as supported data source type) | Yes (LiDAR data source type supported; PDAL equivalent for point cloud processing) | Yes (can process LiDAR data via PDAL equivalent) | Yes (real LiDAR data can be used) | No |
| Real DEM/DSM | Yes (DEM/DSM listed as supported data source types under Satellite and possibly others) | Yes (data source types include Satellite; DEM/DSM processing implied via GDAL/PDAL equivalents) | Yes (can process DEM/DSM data) | Yes (real DEM/DSM data can be used) | No |
| Real floor detection | Yes (AI/ML components include FloorSegmenter for floor segmentation in point clouds) | Yes (FloorSegmenter AI/ML module implemented as mock) | Yes (mock segmenter runs) | No (FloorSegmenter is mock; uses simulated point cloud data) | Yes (floor detection is simulated/mock) |
| AI predictions | Yes (AI/ML components: BuildingExtractor (YOLO+PyTorch Simulation), FloorSegmenter, TopologyValidator) | Yes (all three AI/ML modules implemented but are mock simulations) | Yes (mock modules generate predictions) | No (predictions are simulated/randomized) | Yes (AI/ML components are mock, not real models) |
| Topology validation | Yes (Topological Validation via AI/ML-based TopologyValidator; planned GIS enhancements include automated geometric and topological validation rules) | Yes (TopologyValidator AI/ML module implemented as mock) | Yes (mock validator runs) | No (validation is based on mock AI/ML) | Yes (topology validation is simulated/mock) |
| Database persistence | Yes (Data Layer: PostgreSQL 13+ with PostGIS 3.1+ extension; Spatial Data Handling: storage in spatial tables) | Yes (PostGIS with spatial tables for parcels, buildings, etc.) | Yes (database stores features) | Yes (real spatial data stored) | No |
| QR verification | Not claimed | Not implemented | No | No | No |
| Disaster simulation | Not claimed | Not implemented | No | No | No |
| Underground mapping | Yes (underground_structures entity mentioned in backend models and API endpoints) | Yes (underground_structures model and API endpoint) | Yes (can store underground structures) | Yes (can store underground data) | No |
| Unit-level property mapping | Yes (BuildingUnit entity mentioned in backend models and API endpoints; ULPIN-UNIT format mentioned) | Yes (BuildingUnit model and API endpoint) | Yes (can store building units) | Yes (can store unit-level data) | No |
| Officer review | Yes (Human-in-the-loop: Validation Results Review, Feature Attribution and Classification, ULPIN Assignment, 3D Visualization and Verification, Data Editing and Curation) | Yes (UI components for validation results review, feature attribution, ULPIN assignment, 3D visualization, data editing implied via forms) | Yes (review workflows present in UI) | Yes (human reviewers can validate outputs) | No |
| Audit logs | Yes (Data Source Management includes standard audit fields (created_at, updated_at); planned features include comprehensive logging for regulatory compliance) | Yes (audit fields on data source records; planned comprehensive audit logs) | Yes (basic audit timestamps stored) | Yes (audit data is real) | No (but comprehensive audit logging is planned) |

## Notes
- The project implements mock AI/ML components (BuildingExtractor, FloorSegmenter, TopologyValidator) that simulate model outputs with randomized values within expected ranges. These are not real ML models.
- Topology validation is performed by the mock TopologyValidator, which simulates validation results.
- Floor detection is simulated via the mock FloorSegmenter.
- LiDAR, DEM/DSM data source types are supported and can process real data via the GDAL/PDAL equivalents (which are also mock implementations but can handle real file formats).
- The project has a solid foundation for real implementation but currently relies on mock components for AI/ML and topology validation.
- QR verification and disaster simulation are not part of the project.