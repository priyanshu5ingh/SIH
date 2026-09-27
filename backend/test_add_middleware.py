import sys
sys.path.insert(0, '.')

# Test the exact scenario that was failing
from app.main import app
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# This is the exact line that was failing in main.py line 22
try:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("SUCCESS: add_middleware worked correctly!")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    sys.exit(1)