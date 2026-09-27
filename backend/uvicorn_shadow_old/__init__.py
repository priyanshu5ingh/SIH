"""
Mock Uvicorn module for demonstration purposes.
"""
def run(app, host="0.0.0.0", port=8000, reload=False, **kwargs):
    print(f"Starting mock server on {host}:{port}")
    print("Application would be running here...")
    print("To see the application, start the frontend server and visit http://localhost:3000")
    # In a real implementation, this would start the server
    # For demonstration, we'll just indicate that the application has started
    import time
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down mock server...")

# For compatibility
__all__ = ['run']
