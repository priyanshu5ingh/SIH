"""
Mock SQLAlchemy ORM module.
"""
from .. import sessionmaker, relationship

# Create a Session class alias for compatibility
Session = sessionmaker

# Re-export for compatibility
__all__ = ['sessionmaker', 'relationship', 'Session']
