from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta, timezone
from app.core.auth_dependency import get_current_user
from app.services.razorpay_service import create_order, verify_signature
from app.db.mongodb import db

router = APIRouter(prefix="/subscription", tags=["Subscription"])



@router.get("/status")
def status(user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)

    if user["type"] == "student":
        return {"allowed": True}

    trial_end = user.get("trialEnd")
    if trial_end and trial_end.tzinfo is None:
        trial_end = trial_end.replace(tzinfo=timezone.utc)

    if trial_end and now <= trial_end:
        return {"allowed": True}

    expiry = user.get("subscriptionExpiry")
    if expiry and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if user.get("isSubscribed") and expiry and now <= expiry:
        return {"allowed": True}

    return {"allowed": False}


@router.post("/create-order")
def create_payment_order(user=Depends(get_current_user)):
    if user["type"] != "organization":
        raise HTTPException(403, "Not required")

    return create_order()

@router.post("/verify-payment")
def verify_payment(data: dict, user=Depends(get_current_user)):
    ok = verify_signature(
        data["razorpay_order_id"],
        data["razorpay_payment_id"],
        data["razorpay_signature"]
    )

    if not ok:
        raise HTTPException(400, "Payment verification failed")

    expiry = datetime.now(timezone.utc) + timedelta(days=30)
    expiry = expiry.astimezone(timezone.utc)

    db.users.update_one(
      {"userId": user["userId"]},
      {"$set": {
         "isSubscribed": True,
         "subscriptionExpiry": expiry
       }}
    )


    return {"message": "Subscription activated"}


@router.get("/info")
def subscription_info(user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)

    if user["type"] == "student":
        return {
            "plan": "FREE",
            "status": "ACTIVE",
            "days_left": None
        }

    # normalize datetimes (important)
    trial_end = user.get("trialEnd")
    if trial_end and trial_end.tzinfo is None:
        trial_end = trial_end.replace(tzinfo=timezone.utc)

    expiry = user.get("subscriptionExpiry")
    if expiry and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    # trial
    if trial_end and now <= trial_end:
        days_left = (trial_end - now).days
        return {
            "plan": "TRIAL",
            "status": "ACTIVE",
            "days_left": max(days_left, 0)
        }

    # paid
    if user.get("isSubscribed") and expiry and now <= expiry:
        days_left = (expiry - now).days
        return {
            "plan": "PREMIUM",
            "status": "ACTIVE",
            "days_left": max(days_left, 0)
        }

    # expired
    return {
        "plan": "NONE",
        "status": "EXPIRED",
        "days_left": 0
    }
