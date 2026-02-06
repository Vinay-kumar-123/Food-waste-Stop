import razorpay
import hmac
import hashlib
from datetime import datetime, timedelta, timezone
from app.core.config import settings

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET)
)

# 🔹 Create payment order
def create_order():
    return client.order.create({
        "amount": 1500 * 100,
        "currency": "INR",
        "payment_capture": 1
    })

# 🔹 Verify checkout signature (frontend flow)
def verify_signature(order_id, payment_id, signature):
    body = f"{order_id}|{payment_id}"
    expected = hmac.new(
        settings.RAZORPAY_SECRET.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()
    return expected == signature

# 🔹 Verify webhook signature (server-to-server)
def verify_webhook_signature(body: bytes, signature: str):
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
