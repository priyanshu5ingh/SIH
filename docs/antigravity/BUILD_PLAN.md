# Build Plan: VertiMap 3D Cadastre Workbench

## Implementation Phases

### Phase 1: Architecture & Data Provider Layer
- Create `frontend/src/demo/DemoData.js` with comprehensive deterministic records for `P01` (Review Required), `P02` (Verified), and `P03` (Envelope Conflict).
- Define standardized schema for parcels, buildings, vertical floors (Basement B01, F01, F02, F03, F04), evidence traces, validation rules, and audit logs.
- Provide a clean data adapter pattern so `DemoDataProvider` can be swapped for `ApiDataProvider` seamlessly in Track B.

### Phase 2: 3D Geospatial Engine Rebuild (`DemoScene3D.jsx`)
- Procedural architectural models with exact metric scale (relative coordinate origin per parcel).
- Multi-tier visual hierarchy:
  - Ground grid, asphalt roads, boundary markers, and 8-12 subdued contextual low-poly urban buildings.
  - Hero building (`B01`) with discrete floor slabs, basement (`B01`), ground/upper floors (`F01-F03`), and roof terrace.
  - Muted, professional materials: cool blues, muted teals, dark slate basement, warm neutral floor highlights.
  - Scene Modes:
    1. **Standard 3D View**: Perspective isometric navigation with OrbitControls.
    2. **Vertical Slice Mode**: Exploded / cutaway vertical stack showing floor elevation tags ($Z$ ranges) and section planes.
    3. **Validation Mode**: Volumetric violation highlighting (red cross-section boundary extrusion for `P03`).
    4. **Subsurface Mode**: Below-ground terrain cutaway exposing basement levels.
- Direct evidence-to-geometry raycasting/selection highlight.

### Phase 3: Workbench UI Components
- **TopBar**: Compact GIS workbench header with system status and demo badges.
- **Property Explorer**: Search filter, parcel list with status chips, hierarchical tree, and active review queue.
- **Property Inspector**:
  - Identity section (Base ULPIN, Building, Floor, Proposed VPID `KA-DEMO-P01-B01-F03-U00`).
  - Spatial metrics (Height, Area, Footprint, Volume).
  - Evidence Confidence Gauge (deterministic percentage, method breakdowns).
  - Interactive Evidence Trace (linking click to 3D mesh highlight).
  - Validation Matrix (Geometry, Boundary Containment, Vertical Regularity, Bylaws).
- **Review Drawer / Modal**:
  - Detailed reason for review (`Vertical level estimated from point cloud`).
  - Interactive actions: `APPROVE`, `EDIT`, `REJECT`.
  - Instant state propagation and reactive audit event emission.
- **Audit / Processing Timeline**:
  - Collapsible timeline tracking data ingestion, spatial linkages, validation checks, and reviewer actions.

### Phase 4: Verification & Polish
- End-to-end browser walkthrough testing.
- Cross-resolution responsiveness (1080p / 1440p).
- Production build validation (`npm run build`).
- Documentation artifacts (`DEMO_WALKTHROUGH.md`, `QA_REPORT.md`, `FINAL_STATUS.md`).
