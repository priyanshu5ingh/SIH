"""
Mock SQLAlchemy module for demonstration purposes.
"""
# Mock classes and functions

class MockColumn:
    def __init__(self, *args, **kwargs):
        pass
    def __call__(self, *args, **kwargs):
        return self

class MockInteger:
    def __call__(self, *args, **kwargs):
        return MockColumn()

class MockString:
    def __init__(self, length=None):
        self.length = length
    def __call__(self, *args, **kwargs):
        return MockColumn()

class MockFloat:
    def __call__(self, *args, **kwargs):
        return MockColumn()

class MockBoolean:
    def __call__(self, *args, **kwargs):
        return MockColumn()

class MockDateTime:
    def __call__(self, *args, **kwargs):
        return MockColumn()

class MockForeignKey:
    def __init__(self, *args, **kwargs):
        pass
    def __call__(self, *args, **kwargs):
        return MockColumn()

class MockText:
    def __call__(self, *args, **kwargs):
        return MockColumn()

class MockFunc:
    def now(self):
        return "NOW()"

# Mock relationship
def relationship(*args, **kwargs):
    return None

# Mock sessionmaker
def sessionmaker(*args, **kwargs):
    def mock_session():
        class MockSession:
            def __init__(self):
                pass
            def add(self, obj):
                pass
            def add_all(self, objs):
                pass
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass
            def query(self, model):
                class MockQuery:
                    def count(self):
                        return 0
                    def filter(self, *args, **kwargs):
                        return self
                    def first(self):
                        return None
                    def offset(self, *args, **kwargs):
                        return self
                    def limit(self, *args, **kwargs):
                        return self
                    def all(self):
                        return []
                return MockQuery()
        return MockSession()
    return mock_session

# Mock declarative base
def declarative_base():
    class MockBase:
        def __init__(self):
            pass
        metadata = type('MockMetadata', (), {})()
    return MockBase

# Mock ORM
class orm:
    Session = sessionmaker
    relationship = relationship
    declarative_base = declarative_base

# Expose the main interfaces
Column = MockColumn
Integer = MockInteger
String = MockString
Float = MockFloat
Boolean = MockBoolean
DateTime = MockDateTime
ForeignKey = MockForeignKey
Text = MockText
func = MockFunc()
orm = orm

# For compatibility
__all__ = ['Column', 'Integer', 'String', 'Float', 'Boolean', 'DateTime', 'ForeignKey', 'Text',
           'func', 'orm', 'sessionmaker', 'declarative_base']
