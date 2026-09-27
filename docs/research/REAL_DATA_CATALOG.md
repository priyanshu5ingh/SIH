# Real Data Catalog for SIH26011 Prototype

This catalog lists potential real-world datasets for the SIH26011 prototype (3D ULPIN & Vertical Property Mapping System). Each entry includes source, URL, coverage, license, CRS, vertical reference, resolution, attributes, download method, API availability, usability in prototype, floor-level mapping capability, and presence of real property identifiers.

## 1. ULPIN (Bhu-Aadhaar)

- **Source**: Department of Land Resources, Government of India
- **URL**: https://dolr.gov.in/en/ulpin/
- **Coverage**: India (rolled out in 29 states, pilot in 4 states/UTs)
- **License**: Government of India data (likely open for use, but check specific terms)
- **CRS**: Based on longitude and latitude (WGS84 assumed)
- **Vertical Reference**: Not applicable (2D parcel identifier)
- **Resolution**: Parcel-level (based on geo-referenced cadastral maps)
- **Attributes**: 14-digit unique ID derived from latitude/longitude; may include ownership details, plot size, longitudinal and latitudinal details
- **Download Method**: Not directly available for bulk download; likely accessible via state land records portals or through ULPIN dashboard (requires authentication)
- **API Availability**: Not explicitly mentioned; possible through state-specific APIs
- **Usability in Prototype**: High for linking property records to spatial data; provides unique property identifier
- **Floor-Level Mapping Capability**: No (only parcel-level)
- **Real Property Identifiers**: Yes (ULPIN is the property identifier)

## 2. Bhu-Naksha (Indian Cadastral Mapping Solution)

- **Source**: National Informatics Centre (NIC), Government of India
- **URL**: https://bhunaksha.nic.in/
- **Coverage**: Varies by state (digitized parcel maps for participating states)
- **License**: Government data (likely restricted to authorized officials; check for open data policies)
- **CRS**: Not specified in public sources; likely uses state-specific or Everest/WGS84
- **Vertical Reference**: Not applicable (2D cadastral maps)
- **Resolution**: Parcel-level (cadastral maps)
- **Attributes**: Parcel boundaries, survey numbers, mutation details
- **Download Method**: Available via Download link on portal (login required for officials); some states may offer public access
- **API Availability**: Not mentioned in public sources
- **Usability in Prototype**: Medium to high if parcel boundaries can be obtained; provides cadastral polygons
- **Floor-Level Mapping Capability**: No (2D parcels)
- **Real Property Identifiers**: Yes (linked to survey numbers and ownership records)

## 3. NAKSHA

- **Source**: Survey of India / Department of Land Resources
- **URL**: https://naksha.dolr.gov.in/NakshaPortal/
- **Coverage**: India (National Spatial Framework initiative)
- **License**: Government of India data
- **CRS**: Likely WGS84 or Everest (to be confirmed)
- **Vertical Reference**: Not specified
- **Resolution**: Aims for high-resolution spatial data
- **Attributes**: Intended to integrate land records, geospatial data, and property details
- **Download Method**: Portal under development; check for data download options
- **API Availability**: Not specified
- **Usability in Prototype**: Potentially high as it aims to be a unified platform for land parcel data
- **Floor-Level Mapping Capability**: Unknown
- **Real Property Identifiers**: Expected to link with ULPIN and other IDs

## 4. Bhuvan (ISRO Geoportal)

- **Source**: Indian Space Research Organisation (ISRO)
- **URL**: https://bhuvan.nrsc.gov.in/
- **Coverage**: India (various themes: land use, land cover, water bodies, etc.)
- **License**: ISRO's data policy (some data free, some restricted)
- **CRS**: Various (WGS84, UTM, etc. depending on product)
- **Vertical Reference**: Ellipsoidal height or MSL for some products
- **Resolution**: Varies from meters to kilometers (e.g., LISS-III: 23.5m, Resourcesat-2: 5.5m)
- **Attributes**: Depends on theme (e.g., land use/land cover classes, vegetation indices, water extent)
- **Download Method**: Via Bhuvan portals (e.g., https://bhuvan-app3.nrsc.gov.in/data/download/index.php) or Bhoonidhi
- **API Available**: Yes (Bhuvan provides APIs for data access and visualization)
- **Usability in Prototype**: Medium for base layers (land use, terrain); low for parcel-level data
- **Floor-Level Mapping Capability**: No (unless using specific products like Cartosat DEM)
- **Real Property Identifiers**: No (unless linked via other datasets)

### 4a. Bhoonidhi (ISRO EO Data Hub)

- **Source**: ISRO
- **URL**: https://bhoonidhi.nrsc.gov.in/
- **Coverage**: India (remote sensing data from multiple satellites)
- **License**: ISRO data policy (requires registration for access)
- **CRS**: Standard geographic/projected
- **Vertical Reference**: Not applicable for most optical data; SAR data may have elevation information
- **Resolution**: Varies by satellite (e.g., Sentinel-1: 10m, Sentinel-2: 10-20m, Landsat: 30m)
- **Attributes**: Spectral bands, radar backscatter, derived products (NDVI, etc.)
- **Download Method**: Browse & order platform (requires user registration)
- **API Availability**: Yes (API access available upon request)
- **Usability in Prototype**: Low for direct building/parcel mapping; useful for change detection, land use classification
- **Floor-Level Mapping Capability**: No
- **Real Property Identifiers**: No

## 5. OpenStreetMap (OSM)

- **Source**: OpenStreetMap contributors
- **URL**: https://www.openstreetmap.org/
- **Coverage**: Global (including India)
- **License**: Open Database License (ODbL)
- **CRS**: WGS84 (EPSG:4326)
- **Vertical Reference**: Not inherent; height can be tagged (e.g., `building:levels`, `height`)
- **Resolution**: Vector data (nodes, ways, relations)
- **Attributes**: Rich tagging system (building=*, highway=*, landuse=*, addr:*, etc.)
- **Download Method**: 
  - Direct download via https://download.geofabrik.de/asia.html (country/region extracts)
  - Overpass API for custom queries
  - Third-party extractors (e.g., BBBike)
- **API Availability**: Yes (Overpass API, Nominatim, etc.)
- **Usability in Prototype**: High for building footprints, road networks, points of interest
- **Floor-Level Mapping Capability**: Limited (building height and levels can be inferred from tags, but not detailed floor plans)
- **Real Property Identifiers**: No (OSM does not typically include formal property IDs; may have addr:* tags)

### 5a. OpenBuildingMap

- **Source**: OpenBuildingMap project (derived from OSM, Google Open Buildings, Microsoft ML Building Footprints)
- **URL**: https://www.openbuildingmap.org/
- **Coverage**: Global (per-country GeoPackage files)
- **License**: Open Database License (ODbL) v1.0
- **CRS**: Varies by tile (likely Web Mercator or geographic)
- **Vertical Reference**: Includes building height and floorspace
- **Resolution**: Building footprint level
- **Attributes**: Geometry, occupancy type, height, floorspace
- **Download Method**: Per-country GeoPackage files (e.g., India) organized by level-6 Quadkey tiles
- **API Availability**: Not specified; data is in static files
- **Usability in Prototype**: High for 3D building models with height and footprint
- **Floor-Level Mapping Capability**: Indirect (via floorspace and height attributes; not actual floor plans)
- **Real Property Identifiers**: No

## 6. Microsoft Open Buildings

- **Source**: Microsoft (Global ML Building Footprints)
- **URL**: https://planetarycomputer.microsoft.com/dataset/ms-buildings
- **Coverage**: Global (including India)
- **License**: Open Database License (ODbL)
- **CRS**: WGS84 (EPSG:4326)
- **Vertical Reference**: Not provided (2D footprints)
- **Resolution**: Building footprint (derived from satellite imagery)
- **Attributes: Building footprint geometry; confidence score
- **Download Method**: 
  - Via Microsoft Planetary Computer (STAC API)
  - Available in India Geodata repository (GeoJSONL, Parquet, PMTiles)
- **API Availability**: Yes (via Planetary Computer STAC API)
- **Usability in Prototype**: High for building footprint coverage across India
- **Floor-Level Mapping Capability**: No (only 2D footprints)
- **Real Property Identifiers**: No

## 7. Sentinel Hub / Copernicus

- **Source**: European Space Agency (ESA) / European Commission
- **URL**: https://www.sentinel-hub.com/
- **Coverage**: Global (Sentinel-1, Sentinel-2, Sentinel-3, etc.)
- **License**: Free and open access (Copernicus Open Access Hub)
- **CRS**: Varies by product (UTS/WGS84)
- **Vertical Reference**: 
  - Sentinel-1: Radar elevation (not terrain height)
  - Sentinel-2: Surface reflectance (no elevation)
  - Sentinel-3: Includes elevation products (e.g., DEM)
- **Resolution**: 
  - Sentinel-1: 5m x 20m (depending on mode)
  - Sentinel-2: 10m, 20m, 60m bands
  - Sentinel-3: 300m (OLCI), 1km (SLSTR)
- **Attributes**: Spectral bands, radar backscatter, vegetation indices, etc.
- **Download Method**: 
  - Copernicus Data Space Ecosystem (https://dataspace.copernicus.eu/)
  - Sentinel Hub API
  - Third-party services (Amazon AWS, Google Cloud)
- **API Availability**: Yes (Sentinel Hub API, ONDA DIAS)
- **Usability in Prototype**: Medium for land use/land cover change detection; low for parcel-level mapping
- **Floor-Level Mapping Capability**: No (unless using interferometry for DEM generation, which is complex)
- **Real Property Identifiers**: No

## 8. Karnataka SSLR (Revenue Maps Online)

- **Source**: Revenue Department, Government of Karnataka
- **URL**: https://landrecords.karnataka.gov.in/service3/
- **Coverage**: Karnataka state
- **License**: Government of Karnataka data
- **CRS**: Likely Everest/WGS84 (to be confirmed)
- **Vertical Reference**: Not applicable (2D revenue maps)
- **Resolution**: Cadastral parcel level
- **Attributes**: Survey numbers, boundary details, ownership, land use
- **Download Method**: Online viewing; download options may require login or visit to taluk office
- **API Availability**: Not mentioned
- **Usability in Prototype**: Medium for Karnataka-specific cadastral data
- **Floor-Level Mapping Capability**: No
- **Real Property Identifiers**: Yes (survey numbers linked to ownership records)

## 9. Maharashtra Bhumi Abhilekh

- **Source**: Department of Land Records, Government of Maharashtra
- **URL**: https://bhumiabhilekh.maharashtra.gov.in/
- **Coverage**: Maharashtra state
- **License**: Government of Maharashtra data
- **CRS**: Not specified
- **Vertical Reference**: Not applicable
- **Resolution**: Parcel level (property cards, 7/12 extracts)
- **Attributes**: Property card details (ownership, area, assessment, etc.)
- **Download Method**: Online viewing/download of property cards (requires credentials for some services)
- **API Availability**: Not mentioned
- **Usability in Prototype**: Medium for Maharashtra-specific property records
- **Floor-Level Mapping Capability**: No
- **Real Property Identifiers**: Yes (property numbers, survey numbers, ULPIN where available)

## 10. India Geodata (GitHub Repository)

- **Source**: Community project (yashveeeeeeer)
- **URL**: https://github.com/yashveeeeeeer/india-geodata
- **Coverage**: India (multiple themes)
- **License**: CC BY 4.0 (repository); individual datasets retain their own licenses (check metadata.json)
- **CRS**: Varies by dataset (many in WGS84)
- **Vertical Reference**: Varies (some datasets include elevation)
- **Resolution**: Varies by dataset (from 1m satellite imagery to km-scale boundaries)
- **Attributes**: Varies (administrative boundaries, building footprints, infrastructure, etc.)
- **Download Method**: Direct download from GitHub or via provided links (Parquet, PMTiles, GeoJSONL, Shapefile, etc.)
- **API Availability**: Not specified; data is in static files
- **Usability in Prototype**: High for ready-to-use open geospatial data (e.g., building footprints from Microsoft, administrative boundaries)
- **Floor-Level Mapping Capability**: Depends on dataset (building footprints lack floor plans)
- **Real Property Identifiers**: No (unless linked via ULPIN in future versions)

## 11. LiDAR, DEM, DSM Data Sources

### 11a. Carto DEM (NRSC)
- **Source**: National Remote Sensing Centre (ISRO)
- **URL**: https://www.nrsc.gov.in/nrscnew/Dataproducts_Thematic_cartodem.php
- **Coverage**: India
- **License**: ISRO data policy
- **CRS**: Geographic (WGS84) or Projected (UTM)
- **Vertical Reference**: Mean Sea Level (MSL)
- **Resolution**: 30 arc-seconds (~900m) or 1 arc-second (~30m) depending on product
- **Attributes**: Elevation values
- **Download Method**: NRSC data request portal
- **API Availability**: Not specified
- **Usability in Prototype**: High for terrain elevation; essential for 3D modeling
- **Floor-Level Mapping Capability**: No (terrain only)
- **Real Property Identifiers**: No

### 11b. Survey of India DEM
- **Source**: Survey of India
- **URL**: https://surveyofindia.gov.in/pages/availability-of-ori-and-dem
- **Coverage**: India
- **License**: Government of India data
- **CRS**: Everest 1830 or WGS84
- **Vertical Reference**: Mean Sea Level (MSL)
- **Resolution**: Varies (e.g., 30m, 90m)
- **Attributes**: Elevation
- **Download Method: Through SOI data access portal
- **API Availability**: Not specified
- **Usability in Prototype**: High for accurate terrain
- **Floor-Level Mapping Capability**: No
- **Real Property Identifiers**: No

### 11c. OpenDEM
- **Source**: OpenTopography / Community
- **URL**: https://www.opendem.info/
- **Coverage**: Global (including India)
- **License**: Varies by source (often open)
- **CRS**: Geographic/WGS84
- **Vertical Reference**: MSL or ellipsoidal
- **Resolution**: Varies (SRTM: 30m, ASTER: 30m, etc.)
- **Attributes**: Elevation
- **Download Method**: Direct download from website
- **API Availability**: Yes (OpenTopography API)
- **Usability in Prototype**: Medium (coarser resolution than Carto DEM)
- **Floor-Level Mapping Capability**: No
- **Real Property Identifiers**: No

## 12. Building Floor Plans / BIM/IFC

- **Source**: Various (municipal corporations, private developers, BIM repositories)
- **URL**: Not centralized; check local sources (e.g., BBMP for Bengaluru)
- **Coverage**: Limited (specific buildings or projects)
- **License**: Varies (often proprietary)
- **CRS**: Project-specific
- **Vertical Reference**: Project datum
- **Resolution**: Room-level
- **Attributes**: Walls, doors, windows, spaces, furniture, etc.
- **Download Method: Direct from source (often requires permission)
- **API Availability**: Rarely
- **Usability in Prototype**: Low for city-wide prototype; high for specific landmark buildings
- **Floor-Level Mapping Capability**: Yes (detailed floor plans)
- **Real Property Identifiers**: Sometimes (linked to property ID)

## Assessment: Strongest Real Dataset Combination for Demo

Based on the above catalog, the strongest combination of real, obtainable, and processable datasets for the SIH26011 prototype (3D ULPIN & Vertical Property Mapping System) would be:

1. **ULPIN** (from state land records portals or via integration with Bhu-Naksha/NAKSHA) - provides the unique property identifier linking ownership to spatial data.
2. **Bhu-Naksha** or **Karnataka SSLR** / **Maharashtra Bhumi Abhilekh** - provides cadastral parcel boundaries (2D polygons) for the selected state/district.
3. **Microsoft Open Buildings** (via India Geodata or Planetary Computer) - provides building footprints across India to augment or validate cadastral data.
4. **OpenBuildingMap** - provides building heights and floorspace to enable basic 3D extrusion.
5. **Carto DEM** or **SRTM/ASTER DEM** (via OpenDEM or NRSC) - provides ground elevation for terrain normalization.
6. **Sentinel-2** (via Sentinel Hub or Copernicus) - for land use/land cover classification and change detection (optional context).

This combination provides:
- Real property identifiers (ULPIN)
- Parcel-level spatial data (cadastral maps)
- Building footprints (global coverage)
- Building height attributes (for 3D modeling)
- Terrain elevation (for accurate 3D placement)
- All datasets are either openly licensed or accessible via government portals with permissible use for prototyping.

For a Bengaluru/Karnataka-specific demo, prioritize:
- Karnataka SSLR for cadastral data
- Bhumi Abhilekh for property records (if available)
- ULPIN integration (as per state rollout)
- Microsoft Building Footprints for Karnataka
- Carto DEM for terrain

Note: Actual acquisition of cadastral data (Bhu-Naksha/SSLR) may require government permissions or direct contact with revenue departments. For a prototype, sample data from a small area (e.g., a few wards) could be requested for demonstration purposes.