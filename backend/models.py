from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class RouteEnum(str, Enum):
    PENDING = "PENDING"
    OPTIMIZED = "OPTIMIZED"


class UserEnum(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class AuditEnum(str, Enum):
    CREATE_ROUTE = "CREATE_ROUTE"
    OPTIMIZE_ROUTE = "OPTIMIZE_ROUTE"
    DELETE_ROUTE = "DELETE_ROUTE"


# this model is for a stop in the route with a name, address, geographical coordinates
# and the a number which we need to see in which order the delivery is done
class Stop(BaseModel):
    name: str = ""
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    order_number: int = 0


# this model is for an user wants to POST a new route and it contains the starting
# position of the warehouse, the name and where the courier needs to stop
class AddRoute(BaseModel):
    name: str
    starting_position: str
    stops: list[Stop]


# this is the full route model
class Route(BaseModel):
    id: Optional[str] = None
    name: str = ""
    starting_position: str
    start_latitude: Optional[float] = None
    start_longitude: Optional[float] = None
    stops: list[Stop] = []
    status: RouteEnum = RouteEnum.PENDING
    total_distance: Optional[float] = None
    estimated_time: Optional[int] = None
    created_at: datetime = None
    created_by: str


def serialize_route(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


class User(BaseModel):
    email: str
    firebase_uid: str
    name: str
    role: UserEnum = UserEnum.USER
    created_at: datetime = None


class AuditLogEntry(BaseModel):
    user_id: str
    email: str
    route_id: str
    ip_address: str
    action: AuditEnum
    created_at: datetime = None
    request_method: str
    request_path: str
    status_code: int = 200
