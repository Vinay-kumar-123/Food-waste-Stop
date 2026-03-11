from fastapi import APIRouter, Request, Header, HTTPException
from datetime import datetime, timedelta, timezone
from app.services.razorpay_service import verify_webhook_signature
from app.db.mongodb import db
import json

router = APIRouter(prefix="/webhook", tags=["Webhook"])

@router.post("/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None)
): 
  
    body = await request.body()

    if not verify_webhook_signature(body, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = json.loads(body)
    event = payload.get("event")

    # ✅ Payment success
    if event == "payment.captured":
        payment = payload["payload"]["payment"]["entity"]
        user_id = payment["notes"].get("userId")

        if user_id:
            expiry = datetime.now(timezone.utc) + timedelta(days=30)

            db.users.update_one(
                {"userId": user_id},
                {"$set": {
                    "isSubscribed": True,
                    "subscriptionExpiry": expiry
                }}
            )

    return {"status": "ok"}



