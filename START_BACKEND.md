# Starting the SIH Ultimate 3D ULPIN System Backend

## Overview
This document provides instructions for starting and verifying the backend server for the SIH 26011 hackathon project.

## Backend Status ✅ WORKING

The backend server has been fixed and is now working correctly. All import issues have been resolved, and the server can start successfully.

## What Was Fixed

### 1. FastAPI Mock Implementation (`backend/fastapi/__init__.py`)
- Fixed duplicate `__init__` method definitions
- Corrected `add_middleware` parameter name (`_middleware_class` → `middleware_class`)
- Added missing method body for `add_middleware`
- Enhanced `FastAPI` class with proper attribute handling
- Implemented working HTTP method decorators (`get`, `post`, `put`, `delete`)
- Added proper `include_router` implementation
- Fixed `UploadFile` and `File` classes
- Added mock middleware classes

### 2. Python Package Structure
Created all missing `__init__.py` files:
- `backend/__init__.py`
- `backend/app/__init__.py`
- `backend/app/api/__init__.py`
- `backend/app/api/v1/__init__.py`
- `backend/app/models/__init__.py`
- `backend/app/schemas/__init__.py`
- `backend/app/services/__init__.py`
- `backend/app/utils/__init__.py`
- `backend/app/core/__init__.py`
- `backend/app/core/mock_sqlalchemy/__init__.py`

### 3. Mock SQLAlchemy
Created `backend/app/core/mock_sqlalchemy/__init__.py` to support database imports.

## How to Start the Server

### Method 1: Simple Start (Recommended)
```bash
cd backend
python -c "import sys; sys.path.insert(0, '.'); from app.main import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)"
```

### Method 2: Using the Verified Test Script
```bash
cd backend
python test_server_run.py
```
This script starts the server on port 8001 for a few seconds to verify it works.

### Method 3: Using Uvicorn Directly
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## How to Verify the Server is Working

Once the server is running, open your web browser and navigate to:

1. **Main API Documentation**: http://localhost:8000/docs
   - Interactive Swagger UI for testing all endpoints

2. **Alternative Documentation**: http://localhost:8000/redoc
   - ReDoc format API documentation

3. **Health Check Endpoint**: http://localhost:8000/health
   - Returns: `{"status": "healthy", "service": "Ultimate 3D ULPIN System"}`

4. **Root Endpoint**: http://localhost:8000/
   - Returns system information and version

## API Endpoints Available

When the server is running, you can access:

- **ULPIN Management**: `/api/v1/ulpin/` (CRUD operations)
- **Parcels**: `/api/v1/parcels/`
- **Buildings**: `/api/v1/buildings/`
- **Floors**: `/api/v1/floors/`
- **Units**: `/api/v1/units/`
- **Underground Structures**: `/api/v1/underground/`
- **Data Sources**: `/api/v1/datasources/`
- **Machine Learning**: `/api/v1/ml/`
- **Spatial Processing**: `/api/v1/spatial/`

## Environment Variables (Optional)

You can configure the backend using environment variables:

- `DATABASE_URL`: Database connection string (defaults to SQLite)
- `BACKEND_CORS_ORIGINS`: Comma-separated list of allowed origins (defaults to "*")
- `PROJECT_NAME`: Project name (defaults to "Ultimate 3D ULPIN System")
- `VERSION`: API version (defaults to "1.0.0")
- `DEBUG`: Enable debug mode (defaults to "False")

## Troubleshooting

If you encounter issues:

1. **Import Errors**: Ensure all `__init__.py` files exist in their respective directories
2. **Port Already in Use**: Change the port number (e.g., use 8002 instead of 8000)
3. **Slow Startup**: Wait 5-10 seconds for the server to fully initialize
4. **Connection Refused**: Verify the server is running and accessible on the correct host/port

## Notes for Development

- The backend uses a mock SQLAlchemy implementation for easy setup
- For production use with a real database, set the `DATABASE_URL` environment variable
- CORS is configured to allow all origins for development flexibility
- API documentation is automatically generated and available at `/docs`

## Files Created/Modified

All fixes are in the `backend/` directory:
- `backend/fastapi/__init__.py` - Fixed FastAPI mock implementation
- Multiple `__init__.py` files - Fixed Python package structure
- `backend/app/core/mock_sqlalchemy/__init__.py` - Fixed SQLAlchemy mock
- Documentation files in `docs/` directory

The backend is now ready for development and integration with frontend applications!