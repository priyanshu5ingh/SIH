import sys
import subprocess
import time
import os

sys.path.insert(0, '.')

# Test that we can start the server and it runs briefly
try:
    # Change to the backend directory
    os.chdir('C:\\Users\\priya\\Downloads\\SIH-Ultimate-3D-ULPIN-System\\backend')

    # Start the server as a subprocess
    # We'll run it for just a few seconds to see if it starts correctly
    cmd = [
        sys.executable,
        "-c",
        "import sys; sys.path.insert(0, '.'); from app.main import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8001, reload=False, log_level='warning')"
    ]

    print("Starting server process...")
    # Start the process
    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Wait for a few seconds to see if it starts
    time.sleep(3)

    # Check if the process is still running
    if process.poll() is None:
        print("SUCCESS: Server started and is running")
        # Terminate the process
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
        print("Server process terminated")
    else:
        # Process has already exited, get the output
        stdout, stderr = process.communicate()
        print(f"Server process exited with code {process.returncode}")
        if stdout:
            print(f"STDOUT: {stdout}")
        if stderr:
            print(f"STDERR: {stderr}")
        if process.returncode != 0:
            raise Exception(f"Server failed to start with exit code {process.returncode}")

    print("SUCCESS: Server test completed")

except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)