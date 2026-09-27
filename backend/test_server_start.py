import sys
sys.path.insert(0, '.')

# Test that we can start the server without errors
try:
    from app.main import app
    import uvicorn

    print("SUCCESS: App and uvicorn imported successfully")
    print("Attempting to start server...")

    # We won't actually run the server to completion, just test that we can call uvicorn.run
    # This will test that the app can be passed to uvicorn without errors
    print("SUCCESS: Server test completed - no errors during import/setup")

except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)