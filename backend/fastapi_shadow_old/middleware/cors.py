"""
Mock CORS middleware.
"""
class CORSMiddleware:
    def __init__(self, app, *args, **kwargs):
        pass

# For compatibility
__all__ = ['CORSMiddleware']
