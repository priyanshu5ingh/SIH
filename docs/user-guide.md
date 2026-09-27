# User Guide

## Overview
This guide provides instructions for using the Ultimate 3D ULPIN Generation and Vertical Property Mapping System. It covers common tasks for administrators, data managers, and end-users.

## Getting Started

### Accessing the System
1. Open your web browser
2. Navigate to the frontend URL (typically http://localhost:3000 for local development)
3. You should see the login page (authentication planned for future versions)
4. For now, you can access the system directly without login

### System Navigation
The system consists of several main sections accessible from the navigation bar:
- **Home**: Dashboard with system overview and quick actions
- **Parcels**: View, search, and manage land parcels
- **Buildings**: View, search, and manage buildings and structures
- **Map**: Interactive 3D visualization of cadastral data
- **Data Sources**: Manage external data imports and processing

## Working with Parcels

### Viewing Parcels
1. Click on "Parcels" in the navigation bar
2. You'll see a list of all parcels in the system
3. Each row shows:
   - ULPIN (Unique Land Parcel Identification Number)
   - Parcel Name
   - Area (sqm)
   - Creation Date
4. Use the search box to filter parcels by ULPIN or name
5. Click on a parcel ULPIN to view detailed information

### Creating a New Parcel
1. Click "Parcels" in the navigation bar
2. Click the "Add New Parcel" button
3. Fill in the form:
   - **ULPIN**: Unique identifier (e.g., ULPIN12345678901234)
   - **Parcel Name**: Descriptive name for the parcel
   - **Description**: Detailed description (optional)
   - **Area**: Area in square meters (must be positive)
   - **Boundary**: WKT format of parcel boundary (optional)
   - **Centroid**: Latitude and Longitude (optional)
   - **Elevation**: Min and Max elevation in meters (optional)
   - **Status**: Active or Inactive
4. Click "Create Parcel" to save

### Editing a Parcel
1. Navigate to the parcel list
2. Find the parcel you want to edit
3. Click on the parcel ULPIN to open the detail view
4. Click the "Edit" button (planned for future version)
5. Modify the fields as needed
6. Click "Save Changes"

### Deleting a Parcel
*Note: Deletion functionality is planned for future versions with appropriate safeguards.*

## Working with Buildings

### Viewing Buildings
1. Click on "Buildings" in the navigation bar
2. You'll see a list of all buildings in the system
3. Each row shows:
   - Building Name
   - Associated Parcel
   - Number of Floors (Above/Below)
   - Height
   - Creation Date
4. Use filters to narrow down by parcel or building characteristics

### Creating a New Building
1. Click "Buildings" in the navigation bar
2. Click the "Add New Building" button
3. Select the parent parcel from the dropdown
4. Fill in the building details:
   - **Building Name**: Identifier for the building
   - **Description**: Detailed description (optional)
   - **Footprint**: WKT format of building footprint (optional)
   - **Floors Above**: Number of floors above ground level
   - **Floors Below**: Number of basement levels
   - **Height**: Total building height in meters
   - **Status**: Active or Inactive
5. Click "Create Building" to save

## Working with the 3D Map

### Accessing the Map View
1. Click on "Map" in the navigation bar
2. The 3D map view will load (may take a moment to initialize)

### Map Controls
The 3D map interface includes:
- **Navigation Controls**:
  - Click and drag to rotate the view
  - Scroll to zoom in/out
  - Right-click and drag to pan
  - Mouse wheel or pinch to zoom
- **Layer Controls** (top-right):
  - Toggle different data layers on/off
  - Base map imagery
  - Parcel boundaries
  - Building footprints
  - Building heights
  - Underground structures
  - Contour lines
- **Measurement Tools**:
  - Distance measurement
  - Area measurement
  - Height/elevation measurement
- **Navigation Tools**:
  - Reset view to default
  - Fullscreen toggle
  - Search for specific ULPIN or location

### Interacting with Map Features
1. Click on a parcel boundary to select it
2. A popup will show parcel information (ULPIN, name, area)
3. Click on a building to see building details
4. Use the measurement tools to calculate distances, areas, or heights
5. Use the slice tool to view vertical cross-sections (planned for future version)

### Vertical Property Visualization
The system supports vertical property mapping:
1. Select a building in the 3D view
2. Use the vertical slicing tool to cut through the building at any elevation
3. See individual floors, units, and structural details
4. Toggle between different floors to see floor plans
5. View unit layouts and room configurations

## Managing Data Sources

### Viewing Data Sources
1. Click on "Data Sources" in the navigation bar
2. See a list of all registered data sources
3. Each source shows:
   - Name
   - Type (drone, LiDAR, satellite, survey, etc.)
   - Description
   - Processing status
   - Date added

### Adding a New Data Source
1. Click "Data Sources" in the navigation bar
2. Click the "Add New Data Source" button
3. Fill in the form:
   - **Name**: Descriptive name for the data source
   - **Type**: Select from dropdown (drone, lidar, satellite, survey, etc.)
   - **Description**: Detailed description (optional)
   - **File Path**: Path to the data file (if applicable)
   - **Metadata**: JSON metadata about the data (optional)
   - **Processing Status**: Whether the data has been processed
4. Click "Create Data Source" to save

### Processing Data Sources
1. In the data sources list, find the source you want to process
2. Click on the source name to view details
3. Click the "Process Data" button (planned for future version)
4. The system will:
   - Validate the data format
   - Extract features (parcels, buildings, etc.)
   - Generate ULPINs for new features
   - Update the cadastral database
   - Mark the source as processed

## Generating ULPINs

### Automatic ULPIN Generation
When processing data sources or creating new parcels:
1. The system validates that the ULPIN is unique
2. If no ULPIN is provided, one can be generated automatically
3. ULPINs follow the format: [Country Code][State Code][District Code][Unique Number]
4. Example: IN-KA-BNG-ULPIN1234567890

### Manual ULPIN Assignment
1. When creating a new parcel, enter a ULPIN in the ULPIN field
2. The system will check if it's already in use
3. If unique, the parcel will be saved with that ULPIN
4. If duplicate, you'll be prompted to enter a different ULPIN

## Reporting and Export

### Generating Reports
*Note: Reporting features are planned for future versions.*

### Data Export
1. Navigate to the parcels or buildings list
2. Use the export button (planned for future version)
3. Choose export format:
   - CSV for tabular data
   - GeoJSON for spatial data
   - Shapefile for GIS applications
   - PDF for printable reports
4. Select fields to include in export
5. Click "Export" to download the file

## System Administration

### User Management
*Note: User management features are planned for future versions with role-based access control.*

### System Settings
Access system settings via the admin panel (planned for future version):
- **General Settings**: System name, contact information, etc.
- **Database Settings**: Connection parameters, backup schedules
- **Storage Settings**: File upload locations, retention policies
- **Notification Settings**: Email templates, alert thresholds
- **Integration Settings**: API keys for external services

### Monitoring and Maintenance
1. **System Health**: Check the health endpoint at /health
2. **Database Performance**: Monitor query performance and connection usage
3. **Storage Usage**: Monitor disk space for uploads and backups
4. **Log Files**: Review application logs for errors and warnings
5. **Backups**: Verify regular backups are completed successfully

## Best Practices

### Data Quality
1. Always verify ULPIN uniqueness before creating new parcels
2. Ensure spatial data is in the correct coordinate system (WGS84)
3. Validate that elevation values are realistic for the geographic area
4. Check that building footprints are within parcel boundaries
5. Confirm that underground structures are at appropriate depths

### Performance Tips
1. Use spatial filters when searching for parcels in specific areas
2. Limit export sizes for large datasets
3. Use appropriate levels of detail in 3D view for performance
4. Regularly vacuum and analyze the database for optimal performance
5. Keep browser cache cleared when experiencing display issues

### Security Guidelines
1. Use strong, unique passwords for system access
2. Regularly update system dependencies
3. Monitor access logs for suspicious activity
4. Implement network firewalls and intrusion detection
5. Regularly backup data and test restore procedures

## Troubleshooting

### Common Issues

#### 1. Cannot Access the System
- Check if frontend and backend services are running
- Verify network connectivity to the server
- Check browser console for error messages
- Try accessing the backend API directly at /health endpoint

#### 2. Map Not Loading Properly
- Check internet connection (for tile layers)
- Ensure WebGL is enabled in your browser
- Try clearing browser cache and reloading
- Check if 3D visualization libraries loaded correctly

#### 3. Data Not Saving
- Check form validation errors (red highlights)
- Verify you have necessary permissions (when auth is implemented)
- Check backend logs for error messages
- Ensure database connection is working

#### 4. Poor Performance
- Check if you're trying to load too much data at once
- Consider using filters to reduce dataset size
- Check server resources (CPU, memory, disk I/O)
- Optimize browser extensions that might interfere

### Getting Help
1. Check the system logs for error messages
2. Refer to the troubleshooting section in the deployment guide
3. Check the FAQ in the project wiki
4. Contact support or post in the community forums
5. For critical issues, create a detailed bug report including:
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Screenshots or error logs
   - System information (browser version, OS, etc.)

## FAQ

### Q: What is ULPIN?
A: ULPIN stands for Unique Land Parcel Identification Number. It's a 14-digit alphanumeric code assigned to every land parcel for unique identification, similar to Aadhaar for land parcels.

### Q: Can I use this system for official land records?
A: This system is designed as a prototype for the Smart India Hackathon. For official use, it would need to comply with local government standards and undergo proper certification.

### Q: What file formats are supported for data import?
A: The system is designed to support common GIS formats including Shapefile, GeoJSON, CSV, KML, and LiDAR point clouds (LAS/LAZ). Specific implementations may vary.

### Q: How does the 3D visualization work?
A: The 3D visualization uses Three.js or CesiumJS to render spatial data in three dimensions, allowing users to view parcels, buildings, and underground infrastructure from any angle.

### Q: Is my data secure?
A: The system includes security features such as input validation, prepared statements to prevent SQL injection, and planned authentication and authorization mechanisms. For production use, additional security measures should be implemented.

### Q: Can I integrate this with existing government systems?
A: Yes, the system provides RESTful APIs that can be integrated with existing cadastral systems, land record management systems, and GIS platforms.

### Q: How does vertical property mapping work?
A: Vertical property mapping represents multi-storey buildings and underground infrastructure in 3D space, assigning unique identifiers to different levels and units within a structure.

### Q: What coordinate system does the system use?
A: The system primarily uses WGS 84 (EPSG:4326) for latitude/longitude coordinates, with elevation measured in meters above mean sea level.

### Q: Can I work offline?
A: Offline capabilities are planned for future versions using service workers and local storage synchronization.

## Contact Support
For questions, issues, or feature requests:
- Email: support@sihulpin.example.com
- Documentation: https://docs.sihulpin.example.com
- Issue Tracker: https://github.com/your-org/sih-ulpin-system/issues
- Community Forum: https://forum.sihulpin.example.com