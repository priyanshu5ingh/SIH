"""
Mock Pydantic module for demonstration purposes.
"""
class BaseModel:
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

class Field:
    def __init__(self, default=..., *, max_length=None, example=None, Optional=None, gt=None, ge=None, le=None):
        self.default = default
        self.max_length = max_length
        self.example = example
        self.Optional = Optional
        self.gt = gt
        self.ge = ge
        self.le = le

# For compatibility
__all__ = ['BaseModel', 'Field']
