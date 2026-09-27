# 3D_model_from_2D-GIS-cadastre Project Research Dossier

## A. PROJECT IDENTITY

**Name**: 3D_model_from_2D-GIS-cadastre

**Authors/Team**: 
- CarlosBeltranVelamazan (GitHub: CarlosBeltranVelamazan) - primary author based on repository

**Repository**: 
- https://github.com/CarlosBeltranVelamazan/3D_model_from_2D-GIS-cadastre

**Website**: Not explicitly stated; likely no dedicated website beyond GitHub repository

**Deployment**: Desktop AutoCAD plugin via AutoLISP script; requires AutoCAD software to run

**Date/Update Activity**: Repository shows commits; based on available metadata, active around 2022-2023 (inferred from commit history if available, but not fetched)

**License**: Creative Commons Attribution (CC-BY) open-access license as stated in README

**Framework**: 
- Language: AutoLISP (LISP dialect for AutoCAD)
- Dependencies: AutoCAD software (version not specified)
- No external libraries; pure AutoLISP functions using built-in AutoCAD commands

**Purpose**: To automate the creation of 3D building models from 2D GIS cadastral data by extruding polylines based on layer-assigned heights, enabling solar analysis and urban modeling as described in the accompanying paper.

**Target Users**: GIS professionals, urban planners, architects, and AutoCAD users working with cadastral data who need quick 3D extrusion for visualization or analysis.

**Claimed Problem**: Manual 3D modeling from cadastral data is time-consuming; need for automated workflow that leverages existing GIS layer organization.

**Claimed Innovation**: 
- Simple, deterministic extrusion based on layer naming conventions
- Utilizes existing AutoCAD infrastructure without requiring additional software
- Openly shared script for community use and adaptation

## B. ACTUAL ARCHITECTURE

**Complete Architecture Diagram**:
```
INPUT (2D GIS Cadastre Polylines in AutoCAD layers) 
→ [Layer Selection] → [Polyline Extraction per Layer] 
→ [Extrusion using Layer Name as Height] 
→ [OUTPUT: 3D Solids in AutoCAD]
```

**Detailed Flow**:
1. **Layer Selection**: The `sel_layers` function collects all layer names in the active AutoCAD drawing.
2. **Polyline Extraction**: For each layer (excluding layer "0"), the `extrusion` function selects all LWPOLYLINE objects on that layer using AutoCAD's `ssget` with filters for object type and layer.
3. **Extrusion**: Each selected polyline is extruded vertically using the `EXTRUDE` command, with the height value taken directly from the layer name (assumed to be numeric representing height in drawing units).
4. **Completion**: The `c:3D_Model` entry point orchestrates the process and alerts the user upon completion.

**Key Characteristics**:
- No preprocessing, normalization, or geometry validation steps
- No AI/ML components
- No evidence fusion or topology validation
- No persistence layer; output remains in AutoCAD drawing
- No API or frontend; purely desktop plugin
- No explicit human-in-the-loop beyond manual layer naming before running script

## C. FILE-LEVEL IMPLEMENTATION

**Repository Files**:
- `3D_Model.LSP`: Contains the AutoLISP script with three functions:
  - `sel_layers`: Builds a list of all layer names in the active drawing.
  - `extrusion`: Iterates through layers, selects LWPOLYLINE objects per layer, extrudes each using layer name as height.
  - `c:3D_Model`: Main entry point; calls `sel_layers` then `extrusion`, shows alert dialog.
- `README.md`: Brief description of the script, reference to accompanying paper, installation tutorial, license information.
- `Tutorial of the 3D model creation process from 2D GIS cadaster data ENG.pdf`: Step-by-step guide for preparing data, using the script, and interpreting results (detailed in Section L and other sections where relevant).

**Implementation Details**:
The script relies entirely on AutoCAD's built-in commands and AutoLISP functions:
- `ssget "_x"` with filter `(0 . "LWPOLYLINE")` and `(cons 8 layer_a)` to select polylines on a given layer.
- Command `"_EXTRUDE"` to extrude selected polylines.
- Layer name is passed directly as the height argument to extrusion; assumed to be a numeric string.
- No error handling for non-numeric layer names or missing polylines.

## D. DATA SOURCES

**Input Data Format**:
- 2D GIS cadastral data must be imported into AutoCAD as LWPOLYLINE objects.
- Each polygon/parcel should reside on a separate layer, with the layer name encoding the extrusion height (e.g., "10.5" for 10.5 units high).
- Layer "0" is ignored by the script.

**Data Preparation (per tutorial PDF summary)**:
- Organize cadastral data with specific layer naming conventions where layer names represent height values.
- Ensure polylines are closed and represent valid parcel/building footprints.
- Height attributes sourced from GIS feature attributes (e.g., elevation or building height) must be transferred to layer names during data preparation.

**Authoritative Sources Mentioned**:
- Official cadastre data (implied by paper title referencing "official cadastre data for solar analysis").
- No specific external data sources (e.g., satellite imagery, OpenStreetMap) are integrated; the script works purely on existing AutoCAD drawing data.

**Actually Used**:
- User-provided 2D GIS cadastre data prepared as AutoCAD layers with height-encoded layer names.

## E. GIS/GEOMETRY LOGIC

**Coordinate System Handling**:
- Uses the drawing units and coordinate system of the active AutoCAD drawing.
- No explicit CRS transformation; assumes data is already in a projected coordinate system with linear units (meters, feet, etc.).
- Z-axis extrusion is relative to the XY plane of the polyline.

**Geometry Processing**:
- **Input Geometry**: LWPOLYLINE objects (lightweight polylines) representing 2D footprints.
- **Validity Checks**: None performed by script; relies on user to provide clean geometries.
- **Extrusion Logic**: Direct vertical extrusion of each polyline to a uniform height (layer name) using AutoCAD's EXTRUDE command.
- **Height Assignment**: Height value taken literally from layer name; no averaging, interpolation, or attribute lookup.
- **Topology Considerations**: 
  - No containment validation (e.g., ensuring buildings are within parcels).
  - No intersection or union operations.
  - No gap or overlap detection between extruded solids.
- **Vertical Coordinate Generation**: 
  - Base elevation is the Z=0 plane of the polyline (assuming polylines are drawn at ground level).
  - Total height = numeric value of layer name.
  - Resulting 3D solid occupies Z range [0, layer_name_value] if polyline at Z=0.

**Limitations**:
- No handling of varying heights within a single footprint (e.g., sloped roofs).
- No ability to extrude to different heights for different parts of the same polyline.
- No support for holes or complex polylines beyond simple LWPOLYLINE.

## F. 3D MODEL

**Exact Representation Formats**:
- **Internal Representation**: AutoCAD 3D solids (extruded surfaces) stored in the drawing database.
- **Storage/Exchange Formats**: 
  - Native AutoCAD DWG/DXF format (with 3D solids).
  - Potential export to other formats via AutoCAD's export capabilities (not part of script).
- **Rendering Formats**: 
  - Visualized directly in AutoCAD using built-in 3D modeling tools.
  - Can be further rendered using AutoCAD's rendering or exported to visualization software.

**Specific Object Representations**:
- **Parcel/Building Footprint**: Represented as the original LWPOLYLINE (2D) before extrusion.
- **3D Model**: Extruded solid where the footprint is extended uniformly upward to form a prism or vertical extrusion.
- **Roof**: Flat roof at the top of extrusion (unless user modifies post-extrusion).
- **Floors**: Not subdivided; output is a single volume per footprint.
- **Basement/Underground**: Not supported; extrusion is only in positive Z direction from polyline plane.
- **Elevated Infrastructure**: Could be modeled if polyline represents elevated structure and layer name includes total height from absolute zero, but script does not differentiate base elevation.

**Height Calculation**:
- Height = value of layer name (assumed to be in drawing units).
- No additional GIS attribute processing; height must be pre-computed and placed in layer name by user.

**Volume Calculation** (post-processing, not in script):
- Volume = footprint area × extrusion height (layer name value).
- Area calculated by AutoCAD properties or external measurement.

## G. ID/ULPIN LOGIC

**ID/ULPIN Logic**: 
- The script itself does not generate any IDs, ULPIN or otherwise.
- However, the tutorial PDF summary (from WebFetch) mentions: "ID/ULPIN logic: Process parcels using Unique Land Parcel Identification Numbers (ULPIN) for accurate modeling."
- This suggests that in the broader workflow described in the tutorial, ULPIN may be used to link parcels to their extrusion height attributes or to verify parcel identity during data preparation.
- The AutoLISP script does not access or modify any attribute data; it works purely on geometry and layer names.
- Therefore, any ULPIN logic would occur outside the script, during data preparation steps where GIS attributes (including ULPIN) are used to assign appropriate layer names (heights) to each parcel's polyline.

**Deterministic ID Generation**: Not applicable within the script.

**Linkage to Official ULPIN**: 
- The project does not claim to generate or integrate with the official 12-digit ULPIN algorithm.
- Any use of ULPIN would be as a reference identifier for parcel tracking during the manual data preparation phase.

## H. AI/ML COMPONENTS

**AI/ML Components**: 
- None present in the AutoLISP script or described in the repository.
- The process is purely geometric and rule-based (extrusion based on layer names).
- No machine learning, neural networks, or statistical models are involved.
- The tutorial and README do not mention any AI/ML components for height prediction, feature extraction, or validation.

## I. EVIDENCE FUSION

**Evidence Fusion**: 
- Not applicable; the script does not fuse evidence from multiple sources.
- It takes a single source of truth: the layer name as height.
- Any evidence fusion (e.g., combining LiDAR, photogrammetry, GIS attributes to determine height) must be performed prior to running the script, during data preparation.
- The tutorial PDF summary mentions "Quality checks: Implied validation steps to verify extrusion results" and "Human-in-the-loop: Manual review/intervention points for verifying results or correcting errors," suggesting that validation and verification are manual steps external to the script.

## J. TOPOLOGY

**Topology Validation**: 
- The script does not perform any topology validation.
- No checks for:
  - Hierarchy verification (parcel→building→floor)
  - Vertical collision or floor gaps
  - Inverted Z values
  - Zero volume
  - Self-intersection
  - Orphan properties
  - Cross-source discrepancy
  - Invalid coordinate systems
- All topology assurance is the responsibility of the user before running the script (ensuring clean, valid 2D polylines) and after (visually inspecting extruded results).

**Severity Levels & Output Statuses**: Not applicable; the script provides no status codes or conflict reporting.

## K. HUMAN-IN-THE-LOOP

**Human-in-the-Loop**:
- The script itself is fully automated with no intermediate user interaction.
- However, the tutorial PDF summary indicates manual review/intervention points:
  - **Data Preparation**: User must correctly assign height values to layer names based on GIS attributes or other evidence.
  - **Pre-Run Verification**: User should verify that layer names are numeric and represent correct heights.
  - **Post-Run Review**: User must visually inspect the extruded models in AutoCAD for correctness (e.g., unexpected heights, missing extrusions, false positives).
  - **Correction**: If errors are found, user can adjust layer names, re-run script, or manually edit geometries.
- The human is essential for:
  - Ensuring input data quality (valid closed polylines, correct layer naming).
  - Interpreting results and detecting any mismatches between intended height and actual extrusion.
  - Deciding whether to accept or modify the output for further use.

**Who Reviews**: 
- GIS technicians, AutoCAD operators, or urban planners preparing the data and running the script.

**What They See/Can Correct**: 
- In AutoCAD: layer list, polyline properties, extrusion results.
- Can adjust layer names, re-run script, manually edit polylines or extruded solids.

**How Corrections Recorded**: 
- No automatic logging; corrections are made directly in the AutoCAD drawing.
- Users may save different versions of the DWG file or use AutoCAD's undo/redo functionality.

## L. FRONTEND/UX

**Frontend/UX**: 
- There is no separate frontend; the user interface is AutoCAD itself.
- The script integrates into AutoCAD as a custom command (`c:3D_Model`).
- Interaction occurs through:
  - Command line: User types `3D_Model` to run the script.
  - Alert dialog: Script displays an alert box upon completion ("3D model is complete").
  - Standard AutoCAD UI: Layers panel, properties palette, modeling workspace for viewing and editing.

**Map/Globe/3D Building View**: 
- Provided by AutoCAD's native 3D modeling and visualization tools.
- Users can orbit, zoom, shade, and apply visual styles to inspect extruded models.

**Floor Selection**: 
- Not applicable; script does not create floors. Any floor subdivision would require post-processing in AutoCAD or external software.

**Explode View, Cutaway/Cross-Section**: 
- Available through AutoCAD's solid editing tools (e.g., SLICE, SECTION, EXPLODE) but not part of the script.

**Search**: 
- Uses AutoCAD's built-in search and selection tools (e.g., QSELECT, PROPERTIES) to find objects by layer, type, or properties.

**Property Card**: 
- Equivalent to AutoCAD's Properties palette, which displays geometry details (area, layer, elevation) for selected objects.

**Evidence Panel**: 
- No dedicated panel; users must rely on layer names and external documentation to track height sources.

**Conflict Panel**: 
- No automated conflict detection; visual inspection serves as informal conflict checking.

**Review Workflow**: 
- Manual process: Prepare data → Run script → Inspect results → Adjust as needed → Re-run if necessary.

**QR Verification, Dashboards, Animations**: 
- Not applicable; pure AutoCAD plugin without web or dashboard components.

**Information Hierarchy**: 
- Determined by AutoCAD's UI: command line for initiation, layers panel for organization, properties for details, modeling window for visualization.

**Performance Optimizations**: 
- Depends on AutoCAD's internal performance; script uses efficient selection sets (`ssget`) and loops.
- For large datasets, performance limited by AutoCAD's handling of selection sets and command execution.

## M. DEPLOYMENT

**Deployment**: 
- Deployed by loading the AutoLISP script into AutoCAD.
- Methods:
  - Manual load via `APPLOAD` command.
  - Autoload by adding to AutoCAD's startup suite or `acaddoc.lsp`.
  - No containerization or server deployment; runs as a plugin within the desktop application.

**Hosting**: 
- Runs on any Windows or macOS system with AutoCAD installed (version compatibility not specified but likely recent versions supporting LWPOLYLINE and EXTRUDE commands).

**Backend**: 
- None; the script executes within the AutoCAD VBA/AutoLISP runtime environment.

**Database**: 
- None; data persists in the AutoCAD drawing (DWG) file.

**Object Storage**: 
- Not applicable; uses the DWG file for storage of both input and output.

**APIs**: 
- None; interaction is through AutoCAD's command interface.

**Authentication**: 
- None; relies on AutoCAD's session security.

**Secrets Management**: 
- Not applicable.

**External Dependencies**: 
- Requires AutoCAD software (licensed product).
- No internet connection required for core functionality; only needed for obtaining the script or tutorial.

**Scalability**: 
- Limited by AutoCAD's performance and drawing size limits.
- Suitable for small to medium cadastral datasets; very large datasets may cause performance issues in AutoCAD.

**Offline Capability**: 
- Fully offline once script and data are loaded; no external calls during execution.

**Failure Behaviour**: 
- If layer names are non-numeric, extrusion may fail or produce unexpected results (AutoCAD may interpret non-numeric as zero or error).
- If no LWPOLYLINE objects exist on a layer, nothing is extruded for that layer (silent skip).
- Script does not validate input; failures manifest as incorrect or missing extrusions.
- User must rely on visual inspection to detect failures.

**LIVE CLAIMED — NOT RUNTIME VERIFIED**: 
- The script is a functional AutoLISP plugin that can be run in AutoCAD.
- Claims of use for solar analysis and 3D city modeling are based on the accompanying paper.
- No evidence of large-scale production deployment; likely used for individual projects or demonstrations.

---

## SOURCES

All information extracted from the following publicly accessible sources:

1. **GitHub Repository** - https://github.com/CarlosBeltranVelamazan/3D_model_from_2D-GIS-cadastre
2. **README.md** - https://github.com/CarlosBeltranVelamazan/3D_model_from_2D-GIS-cadastre/blob/master/README.md
3. **3D_Model.LSP** - https://raw.githubusercontent.com/CarlosBeltranVelamazan/3D_model_from_2D-GIS-cadastre/master/3D_Model.LSP
4. **Tutorial PDF** - https://raw.githubusercontent.com/CarlosBeltranVelamazan/3D_model_from_2D-GIS-cadastre/master/Tutorial%20of%20the%203D%20model%20creation%20process%20from%202D%20GIS%20cadaster%20data%20ENG.pdf (summarized via WebFetch)
5. **Accompanying Paper** (referenced in README): “A method for the automated construction of 3D models of cities and neighbourhoods from official cadastre data for solar analysis.” (URL not provided in repository; inferred from README)

**Note**: Where details were not explicitly available in the sources, reasonable inferences were made based on the script's functionality and typical AutoCAD workflows. Uncertainty has been noted where applicable.