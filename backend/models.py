from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class RouteEnum(str, Enum):
    PENDING="PENDING"
    OPTIMIZED="OPTIMIZED"

# this model is for a stop in the route with a name, address, geographical coordinates 
# and the a number which we need to see in which order the delivery is done 
class Stop(BaseModel):
    name: str = "" 
    address: str 
    latitude: Optional[float] = None
    longitude: Optional[float]= None
    order_number: int = 0


#this model is for an user wants to POST a new route and it contains the starting position of the warehouse, the name and where the courier needs to stop
class AddRoute(BaseModel):
    name: str
    starting_position: str
    stops: list[Stop]


#this is the full route model 
class Route(BaseModel):
    id: Optional[str]= None
    starting_position: str
    start_latitude: Optional[float] = None
    start_longitude: Optional[float] = None
    stops: list[Stop] = []
    status: RouteEnum = RouteEnum.PENDING
    total_distance: Optional[float] = None
    estimated_time: Optional[int] = None
    created_at: datetime = None



def serialize_route(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc