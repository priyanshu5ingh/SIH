"""
Mock SQLAlchemy module for demonstration purposes.
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func

# For compatibility with code that imports specific items
__all__ = [
    'create_engine', 'Column', 'Integer', 'String', 'Float', 'Boolean',
    'DateTime', 'Text', 'ForeignKey', 'declarative_base', 'sessionmaker',
    'relationship', 'func'
]