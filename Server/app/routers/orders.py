from fastapi import APIRouter, HTTPException
from app.models.order import OrderCreate
from app.services.order_service import (
    submit_order,
    get_student_orders
)

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/submit")
def submit(order: OrderCreate):
    print("ORDER PAYLOAD RECEIVED:", order.model_dump())
    saved = submit_order(order.model_dump())

    if not saved:
        raise HTTPException(
            status_code=400,
            detail="Order already submitted or menu expired"
        )

    return {"message": "Order submitted successfully"}


@router.get("/student/{student_id}")
def student_orders(student_id: str):
    data = get_student_orders(student_id)

    for d in data:
        d["_id"] = str(d["_id"])

    return data

