from app.db.mongodb import db
from app.core.security import hash_password , verify_password

users = db.users

def create_user(data: dict):
    password = data.pop("password")  
    data["password"] = hash_password(password)
    data["active"] = True
    users.insert_one(data)
    return data

def authenticate_user( userId , password):
    user = users.find_one({"userId":  userId})
    if not user:
        return None
    if not verify_password(password, user["password"]):
        return None
    return user