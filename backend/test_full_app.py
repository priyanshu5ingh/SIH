import sys
sys.path.insert(0, '.')

# Test importing and setting up the full app
try:
    from app.main import app
    print("SUCCESS: App imported successfully")

    # Test that we can access the app's attributes
    print(f"App title: {app.title}")
    print(f"App version: {app.version}")

    # Test that the router is included
    print(f"Number of routes: {len(app.routes)}")

    print("SUCCESS: Full app test passed!")

except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)