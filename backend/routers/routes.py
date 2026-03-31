

from fastapi import APIRouter, HTTPException, Depends, Request
from database import routes_collection, audit_collection
from models import AddRoute, serialize_route
from services.geocoding import geocode_route
from services.optimizer import optimize_route
from auth import get_current_user, require_role
from bson import ObjectId
from datetime import datetime

router = APIRouter()

#get request for list of all the routes to display on the page
@router.get("/routes")
def get_all_routes(current_user: dict=Depends(get_current_user)):
    if current_user["role"] == "ADMIN":
        routes = list(routes_collection.find())
    else:
        routes = list(routes_collection.find({"created_by": current_user["firebase_uid"]}))
    return [serialize_route(r) for r in routes]

#post request to add a new route 
@router.post("/routes")
def create_route(route: AddRoute, request: Request, current_user: dict=Depends(get_current_user)):
    
    #convert into a dict 
    route_doc=route.model_dump()
    route_doc["status"]="PENDING"
    route_doc["created_at"] = datetime.now()
    route_doc["created_by"] = current_user["firebase_uid"]

    #call geocode_route to get the latitude and longitude
    document=geocode_route(route_doc)
    #insert the document into MongoDB
    result=routes_collection.insert_one(document)
    inserted_doc=routes_collection.find_one({"_id": result.inserted_id})
    audit_collection.insert_one({
    "user_id": current_user["firebase_uid"],
    "email": current_user["email"],
    "action": "CREATE_ROUTE",
    "route_id": str(result.inserted_id),
    "ip_address": request.client.host,
    "created_at": datetime.now(),
    "request_method": "POST",
    "request_path": "/routes",
    "status_code": 200 })
    return serialize_route(inserted_doc)

    


#get request to get a specific route
@router.get("/routes/{id}")
def get_route(id: str,current_user: dict=Depends(get_current_user)):
    route=routes_collection.find_one({"_id": ObjectId(id)})
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    if current_user["role"] != "ADMIN" and route["created_by"] != current_user["firebase_uid"]:
        raise HTTPException(status_code=403, detail="Access forbidden!")
    return serialize_route(route)


#delete a specific route
@router.delete("/routes/{id}")
def delete_route(id: str, request:Request, current_user: dict=Depends(get_current_user)):
    route=routes_collection.find_one({"_id": ObjectId(id)})
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    if current_user["role"] != "ADMIN" and route["created_by"] != current_user["firebase_uid"]:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this route!")
    routes_collection.delete_one({"_id": ObjectId(id)})
    audit_collection.insert_one({
    "user_id": current_user["firebase_uid"],
    "email": current_user["email"],
    "action": "DELETE_ROUTE",
    "route_id": id,
    "ip_address": request.client.host,
    "created_at": datetime.now(),
    "request_method": "DELETE",
    "request_path": f"/routes/{id}",
    "status_code": 200
})
    
    return {"message": "Route deleted!"}
    


#post request to optimize a specific route
@router.post("/routes/{id}/optimize")
def get_optimized_route(id: str, request:Request, current_user: dict=Depends(get_current_user)):
    route= routes_collection.find_one({"_id":ObjectId(id)})
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    if current_user["role"] != "ADMIN" and route["created_by"] != current_user["firebase_uid"]:
        raise HTTPException(status_code=403, detail="You are not allowed to optimize this route!")
    updated_route= optimize_route(route)
    routes_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "stops": updated_route["stops"],
            "status": updated_route["status"],
            "total_distance": updated_route["total_distance"],
            "estimated_time": updated_route["estimated_time"],
        }}
    )

    final = routes_collection.find_one({"_id": ObjectId(id)})
    audit_collection.insert_one({
    "user_id": current_user["firebase_uid"],
    "email": current_user["email"],
    "action": "OPTIMIZE_ROUTE",
    "route_id": id,
    "ip_address": request.client.host,
    "created_at": datetime.now(),
    "request_method": "POST",
    "request_path": f"/routes/{id}",
    "status_code": 200
})
    return serialize_route(final)