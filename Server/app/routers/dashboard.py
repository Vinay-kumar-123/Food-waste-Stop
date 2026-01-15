from fastapi import APIRouter
from app.services.order_service import get_today_orders
from bson import ObjectId

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/org/today/{org_id}/{menu_id}")
def today_summary(org_id: str, menu_id: str):
    orders = get_today_orders(org_id, menu_id)

    eaten = 0
    skipped = 0
    safe_orders = []

    for o in orders:
        for i in o["items"]:
            if i["status"] == "Eat":
                eaten += 1
            else:
                skipped += 1

        safe_orders.append({
            "orderId": str(o["_id"]),        
            "studentId": o["studentId"],
            "studentName": o["studentName"],
            "items": o["items"]
        })

    total = eaten + skipped

    return {
        "foodEaten": eaten,
        "foodSkipped": skipped,
        "responses": len(orders),
        "efficiency": round((eaten / total) * 100, 2) if total else 0,
        "orders": safe_orders              
    }
