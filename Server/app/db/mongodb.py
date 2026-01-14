from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(settings.MONGO_URI)
db = client[settings.DB_NAME]

def check_db_connection():
    try:
        client.admin.command("ping")
        print("✅ MongoDB connected successfully")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)