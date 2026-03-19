

from datetime import datetime, timedelta, timezone
from app.db.mongodb import db
from app.core.security import hash_password, verify_password

users = db.users

def create_user(data: dict):
    password = data.pop("password")
    data["password"] = hash_password(password)
    data["active"] = True

    # 🔑 SUBSCRIPTION FIELDS (AUTO)
    if data["type"] == "organization":
        now = datetime.now(timezone.utc)

        data["trialStart"] = now
        data["trialEnd"] = now + timedelta(days=7)

       # 🔑 ENSURE UTC (VERY IMPORTANT)
        data["trialStart"] = data["trialStart"].astimezone(timezone.utc)
        data["trialEnd"] = data["trialEnd"].astimezone(timezone.utc)

        data["isSubscribed"] = False
        data["subscriptionExpiry"] = None
    else:
        # student → free forever
        data["trialStart"] = None
        data["trialEnd"] = None
        data["isSubscribed"] = True
        data["subscriptionExpiry"] = None

    users.insert_one(data)
    return data
def authenticate_user(userId, password):
    user = users.find_one({"userId": userId})

    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    if not user.get("active", True):   # 🔥 safe check
        return None

    return user