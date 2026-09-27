# API Documentation

## Overview
The Ultimate 3D ULPIN System provides a RESTful API for managing cadastral data, generating ULPINs, and visualizing 3D property information. The API follows REST principles and returns JSON responses.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
*Note: Authentication is planned for future versions. Currently, all endpoints are accessible without authentication.*

## Response Format
All API responses follow this format:
```json
{
  "status": "success",
  "data": {},
  "message": "Optional message"
}
```

Error responses:
```json
{
  "status": "error",
  "message": "Error description",
  "details": {}
}
```

## Pagination
Endpoints that return lists support pagination using `skip` and `limit` query parameters:
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 100, maximum: 1000)

## Rate Limiting
*Note: Rate limiting is planned for future versions.*

## Endpoints

### ULPIN Management
*Base path: `/ulpin`*

#### Create ULPIN
```
POST /ulpin/
```
Create a new ULPIN record.

**Request Body:**
```json
{
  "ulpin": "ULPIN12345678901234",
  "parcel_name": "Parcel A-101",
  "description": "Residential parcel in Bangalore",
  "area_sqm": 500.0,
  "boundary_wkt": "POLYGON((77.5946 12.9716,77.5956 12.9716,77.5956 12.9726,77.5946 12.9726,77.5946 12.9716))",
  "centroid_lat": 12.9721,
  "centroid_lng": 77.5951,
  "elevation_min": 850.0,
  "elevation_max": 860.0,
  "is_active": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "ulpin": "ULPIN12345678901234",
    "parcel_name": "Parcel A-101",
    "description": "Residential parcel in Bangalore",
    "area_sqm": 500.0,
    "boundary_wkt": "POLYGON((77.5946 12.9716,77.5956 12.9716,77.5956 12.9726,77.5946 12.9726,77.5946 12.9716))",
    "centroid_lat": 12.9721,
    "centroid_lng": 77.5951,
    "elevation_min": 850.0,
    "elevation_max": 860.0,
    "is_active": true,
    "created_at": "2026-09-21T10:00:00Z",
    "updated_at": null
  },
  "message": "ULPIN created successfully"
}
```

#### Get ULPIN by ID
```
GET /ulpin/{ulpin}
```
Retrieve a specific ULPIN by its unique identifier.

**Parameters:**
- `ulpin` (path): The ULPIN to retrieve

**Response:** Same structure as create response

#### Get ULPINs List
```
GET /ulpin/
```
Retrieve a list of ULPINs with optional filtering.

**Query Parameters:**
- `skip` (integer): Number of records to skip
- `limit` (integer): Maximum number of records to return
- `ulpin` (string): Filter by specific ULPIN

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "ulpin": "ULPIN12345678901234",
      "parcel_name": "Parcel A-101",
      // ... other fields
    }
  ],
  "message": "Retrieved 1 ULPINs"
}
```

### Parcel Management
*Base path: `/parcels`*

#### Create Parcel
```
POST /parcels/
```
Create a new parcel record.

**Request Body:**
Same as ULPIN creation (parcels and ULPIN are essentially the same entity in this system)

#### Get Parcel by ID
```
GET /parcels/{parcel_id}
```
Retrieve a specific parcel by its database ID.

**Parameters:**
- `parcel_id` (path): The parcel's database ID

#### Get Parcels List
```
GET /parcels/
```
Retrieve a list of parcels with optional filtering.

**Query Parameters:**
- `skip` (integer): Number of records to skip
- `limit` (integer): Maximum number of records to return
- `ulpin` (string): Filter by specific ULPIN

### Building Management
*Base path: `/buildings`*

#### Create Building
```
POST /buildings/
```
Create a new building record associated with a parcel.

**Request Body:**
```json
{
  "parcel_id": 1,
  "building_name": "Building A-101",
  "description": "Residential apartment building",
  "footprint_wkt": "POLYGON((77.5946 12.9716,77.5956 12.9716,77.5956 12.9726,77.5946 12.9726,77.5946 12.9716))",
  "num_floors_above": 10,
  "num_floors_below": 2,
  "height_m": 35.0,
  "is_active": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "parcel_id": 1,
    "building_name": "Building A-101",
    "description": "Residential apartment building",
    "footprint_wkt": "POLYGON((77.5946 12.9716,77.5956 12.9716,77.5956 12.9726,77.5946 12.9726,77.5946 12.9716))",
    "num_floors_above": 10,
    "num_floors_below": 2,
    "height_m": 35.0,
    "is_active": true,
    "created_at": "2026-09-21T10:00:00Z",
    "updated_at": null
  },
  "message": "Building created successfully"
}
```

#### Get Building by ID
```
GET /buildings/{building_id}
```
Retrieve a specific building by its database ID.

#### Get Buildings List
```
GET /buildings/
```
Retrieve a list of buildings with optional filtering.

**Query Parameters:**
- `skip` (integer): Number of records to skip
- `limit` (integer): Maximum number of records to return
- `parcel_id` (integer): Filter by parcel ID

### Data Sources Management
*Base path: `/datasources`*

#### Create Data Source
```
POST /datasources/
```
Register a new data source (drone survey, LiDAR scan, etc.).

**Request Body:**
```json
{
  "name": "Drone Survey - Karnataka Region",
  "source_type": "drone",
  "description": "High-resolution drone survey of Bangalore urban area",
  "file_path": "/data/uploads/drone_survey_karnataka.zip",
  "metadata": "{\"resolution\": \"5cm\", \"date_acquired\": \"2026-09-15\", \"flight_altitude\": \"120m\"}",
  "is_processed": false
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Drone Survey - Karnataka Region",
    "source_type": "drone",
    "description": "High-resolution drone survey of Bangalore urban area",
    "file_path": "/data/uploads/drone_survey_karnataka.zip",
    "metadata": "{\"resolution\": \"5cm\", \"date_acquired\": \"2026-09-15\", \"flight_altitude\": \"120m\"}",
    "is_processed": false,
    "processed_at": null,
    "created_at": "2026-09-21T10:00:00Z",
    "updated_at": null
  },
  "message": "Data source created successfully"
}
```

#### Get Data Source by ID
```
GET /datasources/{source_id}
```
Retrieve a specific data source by its database ID.

#### Get Data Sources List
```
GET /datasources/
```
Retrieve a list of data sources with optional filtering.

**Query Parameters:**
- `skip` (integer): Number of records to skip
- `limit` (integer): Maximum number of records to return

### Health Check
```
GET /health
```
Check the health status of the API.

**Response:**
```json
{
  "status": "success",
  "data": {
    "status": "healthy",
    "service": "Ultimate 3D ULPIN System",
    "version": "1.0.0",
    "timestamp": "2026-09-21T10:00:00Z"
  },
  "message": "API is healthy"
}
```

### Root Endpoint
```
GET /
```
Get basic information about the API.

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Ultimate 3D ULPIN Generation and Vertical Property Mapping System",
    "version": "1.0.0",
    "docs": "/docs"
  },
  "message": "API information retrieved"
}
```

## Interactive Documentation
Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Error Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error, missing parameters, etc.)
- `401`: Unauthorized (when authentication is implemented)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (e.g., ULPIN already exists)
- `422`: Unprocessable Entity (validation error)
- `429`: Too Many Requests (when rate limiting is implemented)
- `500`: Internal Server Error
- `503`: Service Unavailable

## Versioning
The API is versioned in the URL path (`/api/v1/`). Future versions will be incremented as needed.

## Contact
For API-related questions or issues, please contact the development team.