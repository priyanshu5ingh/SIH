# Baseline Audit Report: VertiMap Application

**Date**: 2026-09-25  
**URL Tested**: `http://localhost:3000`  
**Execution Command**: `npm start` in `frontend/`  
**Browser**: Headless Chromium / Automated Browser Subagent  

---

## 1. Technical Stack & Entry Point

* **Frontend Stack**: React 18 (`react`, `react-dom`), Three.js (`three`), `@react-three/fiber`, `@react-three/drei`, `react-router-dom`, `axios`.
* **Current Entry Point**: `frontend/src/index.js` rendering `App.js` which loads `DemoWorkspace.js`.
* **Current Running URL/Port**: `http://localhost:3000` (React Dev Server active via `npm start`).

---

## 2. Live Browser Inspection Findings

### Visible UI Layout
* **TopBar Header**: Displays `VERTIMAP 3D PROPERTY INTELLIGENCE`, system status `SYSTEM: ONLINE`, dataset indicator `DEMO DATASET`, and camera reset button (`⟲ RESET CAMERA`). Includes 4 mode switcher toggles: `3D VIEW`, `VERTICAL SLICE`, `SUBSURFACE`, and `VALIDATION MODE`.
* **Property Explorer (Left Panel)**: 
  * Real-time property search filter box.
  * Parcel Cards (`P01 REVIEW`, `P02 VERIFIED`, `P03 CONFLICT`).
  * Building & Floor hierarchy dropdown tree.
  * Pending Action Queue (displays count of items requiring review/validation).
* **3D Viewport (Center Canvas)**:
  * Full WebGL interactive canvas with OrbitControls camera navigation.
  * Dark grid backdrop, cadastral parcel boundary lines, 3D stacked building blocks, and contextual surrounding urban blocks.
* **Property Inspector (Right Panel)**:
  * Base Parcel ULPIN (`KA-DEMO-P01`), Building Name (`Apex Tower B01`), Active Floor (`F03`), and Proposed VPID (`KA-DEMO-P01-B01-F03-U00`).
  * Spatial Attributes: Height ($12.6\text{m}$), Unit Footprint ($285\text{m}^2$), Volume ($1,197\text{m}^3$), $Z$-Range ($9.0\text{m}$ to $12.6\text{m}$).
  * Tabs: `EVIDENCE TRACE (6)` and `VALIDATION LAB (5)`.
  * Action Button: `REVIEW PROPERTY WORKFLOW`.
* **Audit Trail Timeline (Bottom Panel)**:
  * Collapsible spatial processing pipeline displaying timestamped, immutable audit events.

---

## 3. 3D Scene Status & View Modes

| Mode | Visual & Functional Behavior | Status |
| :--- | :--- | :--- |
| **3D View** | Renders 3D volumetric building geometry, cadastral ground grid, floor slabs, and surrounding contextual urban blocks. | **Functional** |
| **Vertical Slice** | Explodes floor levels vertically with $Z$-elevation annotations (e.g. `Z: 0m to 4.2m`). | **Functional** |
| **Subsurface** | Renders ground plane translucent to reveal underground basement levels (`B01 Basement Storage`). | **Functional** |
| **Validation Mode** | Highlights volumetric boundary envelope violations in extruded red meshes (`P03` overhang). | **Functional** |

---

## 4. Console & Runtime Error Status

* **Console Errors**: Zero (`0`) unhandled runtime errors or fatal exceptions logged during page load or interaction workflow.
* **Console Warnings**: Clean console without warnings.
* **Runtime Exceptions**: None detected. WebGL context runs cleanly at 60 FPS.

---

## 5. Interaction Verification & State Sync

* **Parcel Selection**: Clicking `P01`, `P02`, or `P03` in Property Explorer updates camera focus, selection highlights in 3D, and populates Property Inspector data.
* **Evidence Trace Expansion**: Clicking evidence trace entries expands source details (Point Cloud Estimator, Cadastral Boundary Match, Confidence Score).
* **Validation Lab Checks**: Displays 5 deterministic spatial validation checks (Parcel Containment, Z-Elevation Continuity, Envelope Overhang, Unit Disjointness, Bylaw Compliance).
* **Review Workflow Modal**: Clicking `REVIEW PROPERTY WORKFLOW` opens drawer modal. Clicking `APPROVE RECORD` updates parcel status to `VERIFIED` (green badge), updates pending Action Queue count, and appends a revision event (`REVISION 01 — REVIEW APPROVED`) to the Audit Trail timeline.
* **Spatial Conflict Demo (`P03`)**: Selecting `P03` highlights spatial envelope overhang in red extrusion in Validation Mode.

---

## 6. Reusable Component Inventory

1. `DemoWorkspace.js`: Master layout grid container connecting topbar, explorer, inspector, 3D viewport, review drawer, and timeline.
2. `DemoScene3D.js`: Three.js canvas component with procedural geometry, OrbitControls, lighting, wireframes, and mode shaders.
3. `DemoPropertyExplorer.js`: Searchable hierarchical parcel/building tree with status badges.
4. `DemoPropertyInspector.js`: Comprehensive spatial metric cards, proposed VPID generator, and tab container.
5. `DemoValidationPanel.js`: Topological rule matrix and check badges.
6. `DemoEvidencePanel.js`: Evidence confidence gauge and trace drawer.
7. `DemoReviewPanel.js`: Modal drawer for human-in-the-loop approval workflow.
8. `DemoAuditTimeline.js`: Pipeline event log with live revision appending.
9. `demoData.js`: Centralized data store and data adapter pattern for spatial records.

---

## 7. Immediate Blockers & Recommended Next Steps

* **Current Blockers**: Zero runtime or rendering blockers in the demo workspace.
* **Track B Transition Requirements (Real Backend & GIS Data Integration)**:
  1. Connecting `demoData.js` adapter to real GeoJSON/CityJSON API endpoints in `backend/`.
  2. Integrating real PostgreSQL/PostGIS spatial query pipeline.
  3. Generating real-world 3D ULPIN codes based on official BhuNaksha / Land Records geospatial standards.
