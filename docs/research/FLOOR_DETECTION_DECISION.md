# Floor Detection Decision for SIH26011 Prototype

## Chosen Method: Point-Cloud Clustering

## Justification

After evaluating multiple floor detection methods (building:levels, LiDAR vertical density, point-cloud clustering, facade segmentation, BIM/IFC, architectural floor plans, height-based estimation, photogrammetry, ML, and geometric inference), we select **point-cloud clustering** as the primary method for floor-level evidence in our prototype. This decision balances accuracy, defensibility, and implementation feasibility while avoiding unnecessary reliance on deep learning.

### Why Point-Cloud Clustering?

- **Accuracy Potential**: High when clear horizontal planes (floor slabs) exist in the point cloud. Directly detects floor structures via geometric primitives.
- **Data Requirement**: Uses building point cloud or mesh data (obtainable from LiDAR or photogrammetry), which aligns with available data sources in the system (see `docs/research/REAL_DATA_CATALOG.md` and `backend/spatial/pdal.py`).
- **Computational Cost**: Medium (algorithms like RANSAC, DBSCAN, or region growing are optimizable with spatial indexing).
- **Implementation Difficulty**: Medium; the codebase already includes a mock `FloorSegmenter` (`backend/ml/building_extraction.py`) and PDAL-based point cloud processing, reducing development effort.
- **Failure Modes**: Over-segmentation (detecting non-floor planes) or under-segmentation (missing floors) if parameters are not tuned. Mitigible through preprocessing (noise removal) and parameter optimization based on floor height expectations.
- **Defensibility**: Technically defensible as a geometric method. The system validates point-cloud processing via PDAL (`backend/spatial/pdal.py`) and includes uncertainty tracking (see `docs/research/REAL_NOVELTY_MATRIX.md`). No ML is required for core geometric inference.

### Comparison with Alternatives

- **building:levels (OSM)**: Depends on crowd-sourced tags that may be missing or inaccurate. While easy to implement, accuracy is medium and relies on external data quality. Not ideal as sole evidence.
- **LiDAR vertical density**: Effective but struggles with closely spaced floors (< point resolution) and vegetation interference. More sensitive to data quality than geometric clustering.
- **Height-based estimation**: Very low cost but accuracy hinges on uniform floor height assumptions, which often fail in real buildings (e.g., tall ground floors, mezzanines). Better as a supplementary method.
- **Geometric inference**: Similar to point-cloud clustering but less specific; clustering directly groups points into floor layers.
- **Facade segmentation**: Primarily yields vertical element data; low to medium accuracy for direct floor detection.
- **BIM/IFC/architectural floor plans**: High accuracy when available but often inaccessible for existing buildings; high implementation difficulty and dependency on proprietary data.
- **ML/photogrammetry**: Higher computational cost and implementation depth; photogrammetry is useful for point cloud generation but not floor detection directly.
- **Deep learning**: Avoided per requirement; deterministic geometric methods are more transparent and defensible for a prototype.

### Implementation Approach

1. **Data Acquisition**: Use LiDAR scans or photogrammetry-derived point clouds (already supported via `backend/spatial/pdal.py`).
2. **Preprocessing**: Filter noise and ground points to focus on building vertical surfaces.
3. **Clustering**: Apply a geometric clustering algorithm (e.g., RANSAC for plane detection followed by horizontal plane grouping) to identify floor slabs.
4. **Validation**: Cross-check with height-based estimation and OSM `building:levels` (where available) to refine estimates and flag inconsistencies.
5. **Uncertainty Tracking**: Output confidence scores based on point density, plane flatness, and agreement with auxiliary data.

### Fallback and Supplementary Methods

- If point-cloud data is unavailable, fall back to **height-based estimation** using LiDAR/photogrammetry-derived building heights.
- Use **OSM `building:levels`** as a sanity check where tags exist and are verified.
- Incorporate **BIM/IFC** data when accessible for high-accuracy validation.

This approach ensures our prototype relies on defensible, deterministic geometric evidence while remaining adaptable to varying data availability and quality.