"""
Python SDK for the Luminox API.
"""

from importlib import metadata as _metadata

from .async_client import LuminoxAsyncClient
from .client import LuminoxClient, FileUpload, MessagePart
from .messages import LuminoxMessage
from .resources import (
    AsyncBlocksAPI,
    AsyncDiskArtifactsAPI,
    AsyncDisksAPI,
    AsyncSessionsAPI,
    AsyncSpacesAPI,
    BlocksAPI,
    DiskArtifactsAPI,
    DisksAPI,
    SessionsAPI,
    SpacesAPI,
)
from .types import Task, TaskData

__all__ = [
    "LuminoxClient",
    "LuminoxAsyncClient",
    "FileUpload",
    "MessagePart",
    "LuminoxMessage",
    "DisksAPI",
    "DiskArtifactsAPI",
    "BlocksAPI",
    "SessionsAPI",
    "SpacesAPI",
    "AsyncDisksAPI",
    "AsyncDiskArtifactsAPI",
    "AsyncBlocksAPI",
    "AsyncSessionsAPI",
    "AsyncSpacesAPI",
    "Task",
    "TaskData",
    "__version__",
]

try:
    __version__ = _metadata.version("luminox")
except _metadata.PackageNotFoundError:  # pragma: no cover - local/checkout usage
    __version__ = "0.0.0"
