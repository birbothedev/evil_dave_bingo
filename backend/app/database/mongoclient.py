import os
from dotenv import load_dotenv
from pymongo import AsyncMongoClient
load_dotenv()

client = AsyncMongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB")]


def team_collection():
    return db[os.getenv("TEAM_COLLECTION")]

def news_collection():
    collection = db[os.getenv("NEWS_COLLECTION")]
    return collection if collection is not None else None

def auth_collection():
    collection = db[os.getenv("AUTH_COLLECTION")]
    return collection if collection is not None else None