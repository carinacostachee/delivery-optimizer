import os

import firebase_admin
from database import users_collection
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials

# initialize the firebase admin sdk to interact with firebase services.
# we read the .env file and load the FIREBASE CREDENTIALS PATH
load_dotenv()
cred = credentials.Certificate(os.getenv("FIREBASE_CREDENTIALS_PATH"))
delivery_optimizer = firebase_admin.initialize_app(cred)


# now we create the fastAPI dependency to get the current user
def get_current_user(request: Request) -> dict:
    header = request.headers.get("authorization")
    print("AUTH HEADER:", header)
    # now we check to see if the header exists or if it starts with the type "Bearer"
    if not header or not header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    # we can extract the token now that we know that the header exists and we split the
    # Bearer from the token and extract the token with pop
    firebase_id_token = header.split(" ").pop()
    try:
        decoded_token = firebase_auth.verify_id_token(firebase_id_token)
        # now we have the uid we need to match it to an user in the database
        uid = decoded_token["uid"]
        print("DECODED UID:", uid)
        user = users_collection.find_one({"firebase_uid": uid})
        print("FOUND USER:", user)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception as e:
        print("AUTH ERROR:", e)
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_role(allowed_roles: list[str]):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Not allowed")
        return current_user

    return role_checker
