import os

from dotenv import load_dotenv
from pymongo import MongoClient

# we read the .env file and load the MONGO_URL and DB_NAME
load_dotenv()

# we connect to the cluster we have created on mongo db
client = MongoClient(os.getenv("MONGODB_URL"))

# we select the databse we have created
db = client[os.getenv("DB_NAME")]

# reference to the routes collection
routes_collection = db["routes"]

# reference to the users collection
users_collection = db["users"]

# reference to the audit collection
audit_collection = db["audit"]
