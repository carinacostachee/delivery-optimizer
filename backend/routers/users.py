from fastapi import APIRouter, HTTPException, Depends, Request
from database import users_collection
from models import User
from datetime import datetime
from auth import get_current_user
router=APIRouter()

#post request to create a new user doc in MongoDB
@router.post("/users/signup")
def create_user(user_data: User):
    #we first check to see if the user already exists
    existing_user= users_collection.find_one({"firebase_uid": user_data.firebase_uid})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already created!")
    #if not we can convert it into a dict
    user_doc=user_data.model_dump()
    user_doc["created_at"]=datetime.now()

    #now we can insert the document into MongoDB
    result=users_collection.insert_one(user_doc)
    inserted_doc= users_collection.find_one({"_id": result.inserted_id})
    inserted_doc["id"] = str(inserted_doc.pop("_id"))
    return inserted_doc

@router.get("/users/me")
def get_me(current_user: dict = Depends(get_current_user)):
    current_user["id"] = str(current_user.pop("_id"))
    return current_user


