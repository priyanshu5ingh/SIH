#!/usr/bin/env python3
"""
Verification script for SIH Ultimate 3D ULPIN System backend.
This script tests that the server can be imported and started correctly.
"""

import sys
import os
import subprocess
import time
import requests

def test_imports():
    """Test that all necessary imports work."""
    print("Testing imports...")

    # Add backend to path
    sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

    try:
        # Test FastAPI app import
        from app.main import app
        print("+ Main app import successful")

        # Test that app has expected attributes
        assert hasattr(app, 'title')
        assert hasattr(app, 'version')
        print("+ App attributes verified")

        # Test API router import
        from app.api.v1.router import api_router
        print("+ API router import successful")

        # Test database imports
        from app.core.database import Base, engine, SessionLocal
        print("+ Database imports successful")

        # Test mock SQLAlchemy
        from app.core.mock_sqlalchemy import declarative_base, sessionmaker
        print("+ Mock SQLAlchemy imports successful")

        return True

    except Exception as e:
        print(f"- Import test failed: {e}")
        return False

def start_server():
    """Start the server in a subprocess."""
    print("Starting server...")

    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__))
    os.chdir(backend_dir)

    # Start server process - matching the working test_server_run.py
    cmd = [
        sys.executable,
        "-c",
        "import sys; sys.path.insert(0, '.'); from app.main import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8001, reload=False, log_level='warning')"
    ]

    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Wait a moment for server to start
        time.sleep(3)

        # Check if process is still running
        if process.poll() is None:
            print("+ Server started successfully")
            return process
        else:
            stdout, stderr = process.communicate()
            print("- Server failed to start")
            print(f"STDOUT: {stdout}")
            print(f"STDERR: {stderr}")
            return None

    except Exception as e:
        print(f"- Failed to start server: {e}")
        return None

def test_endpoints():
    """Test that server endpoints are responding."""
    print("Testing endpoints...")

    base_url = "http://127.0.0.1:8001"

    try:
        # Test health endpoint
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("+ Health endpoint working")
        else:
            print(f"- Health endpoint failed: {response.status_code}")
            return False

        # Test root endpoint
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("+ Root endpoint working")
        else:
            print(f"- Root endpoint failed: {response.status_code}")
            return False

        # Test docs endpoint
        response = requests.get(f"{base_url}/docs", timeout=5)
        if response.status_code == 200:
            print("+ Docs endpoint working")
        else:
            print(f"- Docs endpoint failed: {response.status_code}")
            return False

        return True

    except requests.exceptions.RequestException as e:
        print(f"- Endpoint test failed: {e}")
        return False
    except Exception as e:
        print(f"- Unexpected error during endpoint testing: {e}")
        return False

def main():
    """Main verification function."""
    print("=" * 60)
    print("SIH Ultimate 3D ULPIN System - Backend Verification")
    print("=" * 60)

    # Test imports
    if not test_imports():
        print("\nXXX Import tests failed. Please check your installation.")
        return 1

    print()

    # Start server
    server_process = start_server()
    if not server_process:
        print("\nXXX Failed to start server.")
        return 1

    print()

    try:
        # Test endpoints
        if test_endpoints():
            print("\n+++ All tests passed! The backend is working correctly.")
            print("\nServer Information:")
            print("- URL: http://127.0.0.1:8001")
            print("- API Docs: http://127.0.0.1:8001/docs")
            print("- Health Check: http://127.0.0.1:8001/health")
            print("\nNote: Server is running on 0.0.0.0:8001, accessible via localhost:8001")
        else:
            print("\nXXX Endpoint tests failed.")
            return 1

    finally:
        # Clean up server process
        print("\nStopping server...")
        if server_process.poll() is None:  # If still running
            server_process.terminate()
            try:
                server_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server_process.kill()
        print("Server stopped.")

    return 0

if __name__ == "__main__":
    sys.exit(main())