"""
Mock GeoPandas equivalent.
Provides functionality for working with geospatial vector data.
"""

import json
import uuid
from typing import Dict, Any, List, Optional, Union, Tuple
from dataclasses import dataclass, field
from enum import Enum
import numpy as np


class GeometryType(Enum):
    """Geometry types."""
    POINT = "Point"
    LINESTRING = "LineString"
    POLYGON = "Polygon"
    MULTIPOINT = "MultiPoint"
    MULTILINESTRING = "MultiLineString"
    MULTIPOLYGON = "MultiPolygon"
    GEOMETRYCOLLECTION = "GeometryCollection"


@dataclass
class Point:
    """Point geometry."""
    x: float
    y: float
    z: Optional[float] = None

    def __geo_interface__(self):
        if self.z is not None:
            return {"type": "Point", "coordinates": [self.x, self.y, self.z]}
        else:
            return {"type": "Point", "coordinates": [self.x, self.y]}


@dataclass
class LineString:
    """LineString geometry."""
    coordinates: List[Tuple[float, float]]

    def __geo_interface__(self):
        return {"type": "LineString", "coordinates": self.coordinates}


@dataclass
class Polygon:
    """Polygon geometry."""
    exterior: List[Tuple[float, float]]
    interiors: List[List[Tuple[float, float]]] = field(default_factory=list)

    def __geo_interface__(self):
        return {
            "type": "Polygon",
            "coordinates": [self.exterior] + self.interiors
        }


@dataclass
class Geometry:
    """Geometry container."""
    geom_type: GeometryType
    coordinates: Any
    z: Optional[float] = None

    def __geo_interface__(self):
        # Simplified implementation
        if self.geom_type == GeometryType.POINT:
            if isinstance(self.coordinates, (list, tuple)) and len(self.coordinates) >= 2:
                coords = self.coordinates[:2] + ([self.coordinates[2]] if len(self.coordinates) > 2 and self.z is not None else [])
                return {"type": "Point", "coordinates": coords}
        elif self.geom_type == GeometryType.LINESTRING:
            return {"type": "LineString", "coordinates": self.coordinates}
        elif self.geom_type == GeometryType.POLYGON:
            if isinstance(self.coordinates, list) and len(self.coordinates) > 0:
                return {"type": "Polygon", "coordinates": self.coordinates}
        return {"type": "GeometryCollection", "geometries": []}


@dataclass
class GeoSeries:
    """GeoPandas GeoSeries equivalent."""
    _geometry: List[Any] = field(default_factory=list)
    _crS: Optional[str] = None  # Coordinate Reference System

    def __post_init__(self):
        if self._crS is None:
            self._crS = "EPSG:4326"  # Default to WGS84

    @property
    def geometry(self):
        return self._geometry

    @geometry.setter
    def geometry(self, value):
        self._geometry = value

    @property
    def crs(self):
        return self._crS

    @crs.setter
    def crs(self, value):
        self._crS = value

    def __len__(self):
        return len(self._geometry)

    def __getitem__(self, idx):
        return self._geometry[idx]

    def __iter__(self):
        return iter(self._geometry)

    def to_json(self) -> str:
        """Convert to GeoJSON."""
        features = []
        for i, geom in enumerate(self._geometry):
            feature = {
                "type": "Feature",
                "properties": {"id": i},
                "geometry": geom.__geo_interface__() if hasattr(geom, '__geo_interface__') else None
            }
            features.append(feature)

        geojson = {
            "type": "FeatureCollection",
            "features": features,
            "crs": {
                "type": "name",
                "properties": {
                    "name": self._crS
                }
            }
        }
        return json.dumps(geojson, indent=2)

    def to_file(self, filename: str, driver: str = "GeoJSON"):
        """Save to file."""
        if driver.upper() == "GEOJSON":
            with open(filename, 'w') as f:
                f.write(self.to_json())
        else:
            # For other formats, just save as GeoJSON for mock
            with open(filename, 'w') as f:
                f.write(self.to_json())

    @staticmethod
    def from_file(filename: str) -> 'GeoSeries':
        """Load from file."""
        # Mock implementation - returns dummy data
        gs = GeoSeries()
        # Add some dummy geometries
        gs._geometry = [
            Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
            Polygon([(2, 2), (2, 3), (3, 3), (3, 2), (2, 2)])
        ]
        return gs

    @staticmethod
    def from_postgis(sql: str, con: Any, geom_col: str = 'geom') -> 'GeoSeries':
        """Load from PostGIS database."""
        # Mock implementation
        return GeoSeries.from_file("dummy")

    def buffer(self, distance: float, resolution: int = 16) -> 'GeoSeries':
        """Buffer geometries."""
        # Mock implementation - just return self
        return self

    def intersect(self, other) -> 'GeoSeries':
        """Intersection with another GeoSeries."""
        # Mock implementation
        return GeoSeries()

    def union(self, other) -> 'GeoSeries':
        """Union with another GeoSeries."""
        # Mock implementation
        return GeoSeries()

    def area(self) -> List[float]:
        """Get area of each geometry."""
        # Mock implementation - return random areas
        return [np.random.uniform(100, 10000) for _ in self._geometry]

    def length(self) -> List[float]:
        """Get length of each geometry."""
        # Mock implementation - return random lengths
        return [np.random.uniform(10, 1000) for _ in self._geometry]

    def centroid(self) -> 'GeoSeries':
        """Get centroid of each geometry."""
        # Mock implementation
        centroids = GeoSeries()
        for geom in self._geometry:
            if hasattr(geom, 'exterior'):  # Polygon-like
                # Simple centroid calculation for mock
                xs = [p[0] for p in geom.exterior]
                ys = [p[1] for p in geom.exterior]
                centroid_x = sum(xs) / len(xs)
                centroid_y = sum(ys) / len(ys)
                centroids._geometry.append(Point(centroid_x, centroid_y))
            else:
                centroids._geometry.append(Point(0, 0))
        return centroids


class GeoDataFrame:
    """GeoPandas GeoDataFrame equivalent."""

    def __init__(self, data: Dict[str, Any] = None, geometry: GeoSeries = None, crs: str = None):
        self._data = data or {}
        self._geometry = geometry or GeoSeries()
        if crs:
            self._geometry.crs = crs
        self._initialize_columns()

    def _initialize_columns(self):
        """Initialize columns from data dict."""
        for key, value in self._data.items():
            setattr(self, key, value)

    @property
    def geometry(self):
        return self._geometry

    @geometry.setter
    def geometry(self, value):
        self._geometry = value

    @property
    def crs(self):
        return self._geometry.crs

    @crs.setter
    def crs(self, value):
        self._geometry.crs = value

    def __len__(self):
        return len(self._geometry)

    def __getitem__(self, key):
        if key in self._data:
            return self._data[key]
        elif hasattr(self, key):
            return getattr(self, key)
        else:
            raise KeyError(key)

    def __setitem__(self, key, value):
        if key in self._data:
            self._data[key] = value
        else:
            setattr(self, key, value)

    def columns(self):
        """Get column names."""
        cols = list(self._data.keys())
        if hasattr(self, '_geometry') and '_geometry' not in cols:
            cols.append('geometry')
        return cols

    def to_json(self) -> str:
        """Convert to GeoJSON."""
        features = []
        for i in range(len(self)):
            props = {}
            for col in self._data.keys():
                props[col] = self._data[col][i] if i < len(self._data[col]) else None

            geom = self._geometry[i] if i < len(self._geometry) else None
            feature = {
                "type": "Feature",
                "properties": props,
                "geometry": geom.__geo_interface__() if geom and hasattr(geom, '__geo_interface__') else None
            }
            features.append(feature)

        geojson = {
            "type": "FeatureCollection",
            "features": features,
            "crs": {
                "type": "name",
                "properties": {
                    "name": self.crs
                }
            }
        }
        return json.dumps(geojson, indent=2)

    def to_file(self, filename: str, driver: str = "GeoJSON"):
        """Save to file."""
        if driver.upper() == "GEOJSON":
            with open(filename, 'w') as f:
                f.write(self.to_json())
        else:
            # For other formats, just save as GeoJSON for mock
            with open(filename, 'w') as f:
                f.write(self.to_json())

    @staticmethod
    def from_file(filename: str) -> 'GeoDataFrame':
        """Load from file."""
        # Mock implementation - returns dummy data
        gdf = GeoDataFrame(
            data={
                'id': [1, 2],
                'name': ['Feature A', 'Feature B'],
                'value': [100, 200]
            }
        )
        gdf.geometry = GeoSeries.from_file(filename)
        return gdf

    @staticmethod
    def from_postgis(sql: str, con: Any, geom_col: str = 'geom') -> 'GeoDataFrame':
        """Load from PostGIS database."""
        # Mock implementation
        return GeoDataFrame.from_file("dummy")

    def merge(self, right, on: str = None, how: str = 'inner', suffixes: Tuple[str, str] = ('_x', '_y')):
        """Merge with another GeoDataFrame."""
        # Mock implementation - just return self
        return self

    def groupby(self, by: str):
        """Group by column."""
        # Mock implementation
        class MockGroupBy:
            def __init__(self, df):
                self.df = df

            def __getitem__(self, key):
                return self.df[key]

            def apply(self, func):
                # Mock implementation
                return self.df

            def agg(self, func):
                # Mock implementation
                return self.df

            def sum(self):
                # Mock implementation
                return self.df

            def mean(self):
                # Mock implementation
                return self.df

            def count(self):
                # Mock implementation
                return self.df

        return MockGroupBy(self)

    def plot(self, **kwargs):
        """Plot the GeoDataFrame."""
        # Mock implementation - just print info
        print(f"Plotting GeoDataFrame with {len(self)} features")
        print(f"CRS: {self.crs}")
        return None


# Convenience functions
def read_file(filename: str) -> GeoDataFrame:
    """Read a vector file into a GeoDataFrame."""
    return GeoDataFrame.from_file(filename)

def read_postgis(sql: str, con: Any, geom_col: str = 'geom') -> GeoDataFrame:
    """Read from PostGIS database."""
    return GeoDataFrame.from_postgis(sql, con, geom_col)

def points_from_xy(x: List[float], y: List[float], crs: str = None) -> GeoSeries:
    """Create Point geometries from x and y coordinate arrays."""
    if len(x) != len(y):
        raise ValueError("x and y arrays must have the same length")

    points = [Point(x[i], y[i]) for i in range(len(x))]
    gs = GeoSeries()
    gs._geometry = points
    if crs:
        gs.crs = crs
    return gs


# For compatibility
GeoSeries = GeoSeries
GeoDataFrame = GeoDataFrame