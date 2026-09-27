import sys
import os
import uvicorn

sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.main import app

if __name__ == '__main__':
    print("Starting VertiMap FastAPI Server on 127.0.0.1:8000...", flush=True)
    uvicorn.run(app, host='127.0.0.1', port=8000, log_level='info')
