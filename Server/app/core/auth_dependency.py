from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from datetime import datetime, timezone
from app.core.config import settings
from app.db.mongodb import db

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
    except Exception as e:
        print("❌ JWT ERROR:", e)
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.users.find_one({"userId": payload["userId"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def subscription_guard(user=Depends(get_current_user)):
    if user["type"] == "student":
        return user

    now = datetime.now(timezone.utc)

    # 🔹 Trial check
    trial_end = user.get("trialEnd")
    if trial_end:
        if trial_end.tzinfo is None:
            trial_end = trial_end.replace(tzinfo=timezone.utc)

        if now <= trial_end:
            return user

    # 🔹 Subscription check
    expiry = user.get("subscriptionExpiry")
    if user.get("isSubscribed") and expiry:
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        if now <= expiry:
            return user

    raise HTTPException(
        status_code=403,
        detail="Upgrade your profile. Monthly subscription ₹1099 only."
    )