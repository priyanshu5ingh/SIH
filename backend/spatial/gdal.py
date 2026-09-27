"""
Mock GDAL (Geospatial Data Abstraction Library) equivalent.
Provides functionality for reading/writing geospatial raster and vector data.
"""

import json
import numpy as np
from typing import Dict, Any, Optional, List, Tuple
from enum import Enum
from dataclasses import dataclass


class GDALDataType(Enum):
    """GDAL data types."""
    Unknown = 0
    Byte = 1
    UInt16 = 2
    Int16 = 3
    UInt32 = 4
    Int32 = 5
    Float32 = 6
    Float64 = 7
    CInt16 = 8
    CInt32 = 9
    CFloat32 = 10
    CFloat64 = 11


class GDALAccess(Enum):
    """GDAL file access modes."""
    ReadOnly = 0
    Update = 1
    Create = 2
    CreateCopy = 3


@dataclass
class GDALRasterBand:
    """Mock GDAL raster band."""
    band: int
    datatype: GDALDataType
    width: int
    height: int
    offset: Tuple[int, int] = (0, 0)
    size: Tuple[int, int] = (0, 0)

    def ReadAsArray(self,
                    xoff: int = 0,
                    yoff: int = 0,
                    win_xsize: Optional[int] = None,
                    win_ysize: Optional[int] = None,
                    buf_xsize: Optional[int] = None,
                    buf_ysize: Optional[int] = None,
                    buf_type: GDALDataType = None) -> np.ndarray:
        """Read raster data as numpy array."""
        # Mock implementation - returns random data
        if win_xsize is None:
            win_xsize = self.width
        if win_ysize is None:
            win_ysize = self.height
        if buf_xsize is None:
            buf_xsize = win_xsize
        if buf_ysize is None:
            buf_ysize = win_ysize

        # Generate mock data based on data type
        if self.datatype == GDALDataType.Byte:
            return np.random.randint(0, 255, (buf_ysize, buf_xsize), dtype=np.uint8)
        elif self.datatype == GDALDataType.Uint16:
            return np.random.randint(0, 65535, (buf_ysize, buf_xsize), dtype=np.uint16)
        elif self.datatype == GDALDataType.Int16:
            return np.random.randint(-32768, 32767, (buf_ysize, buf_xsize), dtype=np.int16)
        elif self.datatype == GDALDataType.Uint32:
            return np.random.randint(0, 2**32-1, (buf_ysize, buf_xsize), dtype=np.uint32)
        elif self.datatype == GDALDataType.Int32:
            return np.random.randint(-2**31, 2**31-1, (buf_ysize, buf_xsize), dtype=np.int32)
        elif self.datatype == GDALDataType.Float32:
            return np.random.uniform(0, 1000, (buf_ysize, buf_xsize)).astype(np.float32)
        elif self.datatype == GDALDataType.Float64:
            return np.random.uniform(0, 1000, (buf_ysize, buf_xsize)).astype(np.float64)
        else:
            # Default to float64
            return np.random.uniform(0, 1000, (buf_ysize, buf_xsize)).astype(np.float64)


@dataclass
class GDALRasterDataset:
    """Mock GDAL raster dataset."""
    width: int
    height: int
    count: int = 1  # Number of bands
    datatype: GDALDataType = GDALDataType.Float64
    projection: Optional[str] = None
    geotransform: Optional[Tuple[float, float, float, float, float, float]] = None
    metadata: Dict[str, str] = None
    bands: List[GDALRasterBand] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}
        if self.bands is None:
            self.bands = [
                GDALRasterBand(
                    band=i+1,
                    datatype=self.datatype,
                    width=self.width,
                    height=self.height
                )
                for i in range(self.count)
            ]
        if self.geotransform is None:
            # Default geotransform (upper left x, w-e pixel size, rotation,
            # upper left y, rotation, n-s pixel size)
            self.geotransform = (0.0, 1.0, 0.0, 0.0, 0.0, -1.0)

    def GetRasterBand(self, band: int) -> GDALRasterBand:
        """Get a raster band by index (1-based)."""
        if 1 <= band <= self.count:
            return self.bands[band-1]
        else:
            raise IndexError(f"Band index {band} out of range (1-{self.count})")

    def GetProjection(self) -> Optional[str]:
        """Get map projection/ref system."""
        return self.projection

    def GetGeoTransform(self) -> Optional[Tuple[float, float, float, float, float, float]]:
        """Get geotransform coefficients."""
        return self.geotransform

    def GetMetadata(self, domain: str = "") -> Dict[str, str]:
        """Get metadata."""
        return self.metadata

    def FlushCache(self):
        """Flush cached data to disk."""
        pass


class GDAL:
    """Mock GDAL module."""

    @staticmethod
    def Open(filename: str, access: GDALAccess = GDALAccess.ReadOnly,
             shared: bool = False, driver_options: List[str] = None) -> Optional[GDALRasterDataset]:
        """
        Open a raster dataset.

        Args:
            filename: Path to the raster file
            access: Access mode (ReadOnly, Update, Create, CreateCopy)
            shared: Whether to open shared
            driver_options: Driver-specific options

        Returns:
            GDALRasterDataset or None if failed
        """
        # Mock implementation - returns a dummy dataset
        # In reality, would open the actual file
        return GDALRasterDataset(
            width=1024,
            height=1024,
            count=3,  # RGB
            datatype=GDALDataType.Byte,
            projection='EPSG:4326',
            geotransform=(77.0, 0.0001, 0.0, 28.0, 0.0, -0.0001)
        )

    @staticmethod
    def GetDriverByName(name: str) -> Any:
        """Get GDAL driver by name."""
        class MockDriver:
            def Create(self, filename: str, xsize: int, ysize: int,
                       bands: int = 1, eType: GDALDataType = GDALDataType.Byte,
                       options: List[str] = None) -> GDALRasterDataset:
                return GDALRasterDataset(
                    width=xsize,
                    height=ysize,
                    count=bands,
                    datatype=eType
                )
        return MockDriver()

    @staticmethod
    def GetLastErrorMsg() -> str:
        """Get last error message."""
        return ""  # No error in mock

    @staticmethod
    def ErrorReset():
        """Reset error state."""
        pass


# Convenience functions
def open_raster(filename: str) -> Optional[GDALRasterDataset]:
    """Open a raster dataset."""
    return GDAL.Open(filename)

def get_raster_info(dataset: GDALRasterDataset) -> Dict[str, Any]:
    """Get information about a raster dataset."""
    if dataset is None:
        return {}

    return {
        'width': dataset.width,
        'height': dataset.height,
        'count': dataset.count,
        'datatype': dataset.datatype.name,
        'projection': dataset.GetProjection(),
        'geotransform': dataset.GetGeoTransform(),
        'metadata': dataset.GetMetadata()
    }