# SIH26011 Project Landscape

## Overview of SIH26011

Smart India Hackathon 2026 Problem Statement SIH26011 focuses on **3D ULPIN Generation and Vertical Property Mapping**. The goal is to develop a system that creates unique spatial identities for surface land parcels, multi-storey apartments, and underground infrastructure, moving beyond inadequate 2D land record systems.

## Existing Projects and Repositories

### 1. BoundaryLens
- **GitHub**: https://github.com/NeelakshSaxena/BoundaryLens
- **Description**: A 3D multi-storey vertical parcel delineation pipeline and interactive Web UI built for SIH 2024 (similar problem statement).
- **Technologies**:
  - Python 3.10+ with geopandas, shapely, rasterio, scikit-learn
  - MapLibre GL JS for 3D rendering
  - Vanilla HTML/CSS/JS (glassmorphic UI)
  - Data sources: OpenCity cadastral (CC-BY), OpenStreetMap (ODbL), Copernicus GLO-30 DEM, Google Open Buildings 2.5D
- **Key Features**:
  - Deterministic evidence ledger fusing GIS, DEM, satellite height, and Isolation Forest anomaly detection
  - Generates "Proposed 3D Vertical ULPINs" (e.g., `IN‑KA‑BLR‑P78‑B12‑F3`)
  - Interactive 3D Web UI with property cards and reviewer gates (APPROVE, CORRECT, REJECT)
  - Floor-count estimation using a calibrated HistGradientBoosting/RandomForest model trained on OSM `building:levels`
  - Full audit trail and provenance for every output field
- **Live Demo**: Runs locally at `http://localhost:8000` after executing `run_pipeline.py` (no public demo link provided).

### 2. 3D ULPIN Generation and vertical Property Mapping System (Xarjun Patil)
- **GitHub**: https://github.com/xarjunpatil/SIH26011-3D-ULPIN-Generation-and-vertical-Property-Mapping-SYstem
- **Description**: Solution for creating unique spatial identities for surface parcels, multi-storey apartments, and underground infrastructure.
- **Technologies**:
  - FastAPI, Pydantic v2, Chart.js, Python, Docker, Docker-compose
  - PostgreSQL + PostGIS, AI/ML, drone imagery, LiDAR/3D point-cloud data, GIS parcel layers, building floor plans, GNSS/CORS-based coordinates, DEM/DSM
- **Key Features**:
  - Glassmorphic dark-mode web application (interactive dashboard)
  - Real-time Chart.js telemetry and interactive parameter tuning
  - Automated simulation triggers and exportable audit logs
  - FastAPI REST API with Pydantic v2 validation, cryptographic audit logs, OpenAPI Swagger docs
  - Automated test suite (pytest)
  - Turnkey containerization (Dockerfile & docker-compose)
- **Live Demo**: Can be run locally by opening `project/index.html` or starting the FastAPI service (no public demo link provided).

### 3. SIH26011 - 3D ULPIN Generation and vertical Property Mapping (Abhinav Prabhakar)
- **Source**: https://github.com/Abhinav-Prabhakar/SIH2026/blob/main/SIH26011-3D-ULPIN-Generation-and-vertical-Property-Mapping-SYstem/SIH26011.md
- **Description**: Advanced 3D ULPIN system capable of creating unique spatial identities for surface land parcels, multi-storey apartments, underground infrastructure.
- **Technologies**:
  - Drone imagery, LiDAR/3D point cloud data, GIS parcel layers, building floor plans, GNSS/CORS-based coordinates, DEM/DSM
  - AI/ML for automated building extraction, floor segmentation, vertical parcel delineation, intelligent topology validation
- **Key Features**:
  - Generates standardized 3D ULPINs
  - Maps vertical and underground ownership rights
  - Supports volumetric cadastre
  - Enables accurate urban property governance
  - Reduces ownership conflicts
  - Improves infrastructure planning and utility management
- **Live Demo**: Not mentioned.

### 4. GeoLayer 3D - ULPIN Generator
- **URL**: https://anurag-26112007.github.io/GeoLayer-SIH-Prototype/
- **Description**: Provides a "3D Parcel Inspector" that lets users select any building geometry to calculate volumetric data and generate a 14-digit ULPIN.
- **Features**:
  - Spatial Data (X, Y, Z) display
  - "Land Records Assistant" for analyzing ULPIN or property details
- **Created by**: TEAM : THE-DEBUGGERS | Updated: 17 Sep 2026
- **Live Demo**: The GitHub Pages site itself is a live demo.

## Related Research and Standards

### 3D Cadastres and Land Administration
- **FIG Publication**: "Best Practices 3D Cadastres" (https://www.fig.net/resources/publications/figpub/pub72/Figpub72.pdf) provides guidelines for 3D cadastral systems.
- **Nature Index**: "3D Land Administration and Cadastral Systems" (https://www.nature.com/nature-index/topics/l4/3d-land-administration-and-cadastral-systems) highlights global advancements.
- **LADM 3D**: The Land Administration Domain Model (LADM) extension for 3D supports volumetric property representation (standard ISO 19152).
- **Academic Works**:
  - "3D crowdsourced parametric cadastral mapping: Pathways integrating BIM ..." (https://www.sciencedirect.com/science/article/pii/S0264837723001795)
  - "3D Modeling of the Cadastre and the Spatial Representation of Property ..." (https://link.springer.com/chapter/10.1007/978-981-15-8983-6_33)
  - "BIM and GIS Data Fusion for Next-Generation 3D Cadastre" (https://link.springer.com/chapter/10.1007/978-3-032-12070-0_13)

## Deployed Systems and Prototypes

### Bhuvan (ISRO) 3D
- **URL**: https://bhuvan-app1.nrsc.gov.in/globe/3d.php
- **Description**: ISRO's Bhuvan platform offers 3D visualization of Indian terrain, including building models and terrain data, which can be leveraged for 3D cadastral applications.
- **Related**: Bhuvan 2D 2.0 (https://bhuvan-app1.nrsc.gov.in/bhuvan2d2.0/) and Indian Geo Platform (https://bhuvan.nrsc.gov.in/home/index.php) provide foundational geospatial data.

## Conclusion

The landscape for SIH26011 includes several active open-source prototypes (BoundaryLens, GeoLayer 3D, and two GitHub-hosted SIH26011 solutions) that demonstrate varying approaches to 3D ULPIN generation and vertical property mapping. Common technologies involve Python backend stacks (FastAPI/geopentas), PostGIS for spatial data, and web-based 3D visualization (MapLibre, CesiumJS/Three.js placeholders). Research emphasizes integrating BIM, LiDAR, drone imagery, and AI/ML for automated feature extraction. While no large-scale deployed 3D cadastral system exists in India yet, platforms like Bhuvan provide foundational 3D geospatial data. The SIH26011 solutions collectively address the need for standardized 3D ULPINs, volumetric cadastres, and vertical property rights mapping, aligning with global trends in 3D land administration (FIG, LADM 3D).

## Sources Consulted (from WebSearch)

- https://www.fig.net/resources/publications/figpub/pub72/Figpub72.pdf
- https://www.sciencedirect.com/science/article/pii/S0264837723001795
- https://bhuvan-app1.nrsc.gov.in/bhuvan2d2.0/
- https://bhuvan.nrsc.gov.in/home/index.php
- https://gdmc.nl/3DCadastres/
- https://bhuvan-app1.nrsc.gov.in/globe/3d.php
- https://link.springer.com/chapter/10.1007/978-981-15-8983-6_33
- https://www.nature.com/nature-index/topics/l4/3d-land-administration-and-cadastral-systems
- https://link.springer.com/chapter/10.1007/978-3-032-12070-0_13
- https://cadmapper.com/
- https://sih2026.vuce.in/ps/SIH26011
- https://github.com/Abhinav-Prabhakar/SIH2026/blob/main/SIH26011-3D-ULPIN-Generation-and-vertical-Property-Mapping-SYstem/SIH26011.md
- https://github.com/xarjunpatil/SIH26011-3D-ULPIN-Generation-and-vertical-Property-Mapping-SYSTEM
- https://sih-2026-explorer-pearl.vercel.app/problems/SIH26011/
- https://www.sihbuddy.in/ps/SIH26011
- https://sih.iqubekct.ac.in/problems/SIH26011/
- https://sih-fit.vercel.app/problem/SIH26011
- https://zaidsayyed.in/tools/sih-problem-statements/sih26011
- https://ciphercore-alpha.vercel.app/generate
- https://anurag-26112007.github.io/GeoLayer-SIH-Prototype/
- https://github.com/NeelakshSaxena/BoundaryLens
- https://github.com/Raghavfw/BoundaryLens/blob/main/AGENTS.md
- https://www.sihbuddy.in/ps/SIH26011
- https://sih-2026-explorer-pearl.vercel.app/problems/SIH26011/
- https://sih2026-ps-viewer.vercel.app/ps/SIH26011
- https://ciphercore-alpha.vercel.app/generate
- https://www.sihbuddy.in/roast/SIH26011
- https://gist.github.com/codsilentops-stack/bb2fb7668625e964b7d01965d7b5c886
- https://anurag-26112007.github.io/GeoLayer-SIH-Prototype/
- https://sidxa.github.io/BoundaryLens/appendix.html