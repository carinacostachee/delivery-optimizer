from pymongo import MongoClient
from dotenv import load_dotenv
import os

# we read the .env file and load the MONGO_URL and DB_NAME
load_dotenv()

#we connect to the cluster we have created on mongo db 
client = MongoClient(os.getenv("MONGODB_URL"))

#we select the databse we have created 
db= client[os.getenv("DB_NAME")]

#reference to the routes collection
routes_collection= db["routes"]