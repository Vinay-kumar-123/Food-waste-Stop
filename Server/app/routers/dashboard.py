

from fastapi import APIRouter, Depends, Query, HTTPException
from app.services.order_service import (
    get_today_orders,
    get_item_wise_demand
)
from app.services.ledger_service import get_organization_monthly_ledger
from app.core.auth_dependency import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/org/today/{org_id}/{menu_id}")
def today_summary(org_id: str, menu_id: str):

    orders = get_today_orders(org_id, menu_id)

    # ================= GROUP STUDENTS =================
    students = {}

    for o in orders:

        sid = o["studentId"]

        if sid not in students:
            students[sid] = {
                "studentId": sid,
                "studentName": o["studentName"],
                "items": []
            }

        for item in o["items"]:

            # 👇 Skip hide
            if item["status"] == "Eat":
                students[sid]["items"].append(item["name"])

    student_summary = list(students.values())

    # ================= DEMAND =================
    demand = get_item_wise_demand(org_id, menu_id)

    return {
        "responses": len(student_summary),

        # section wise demand
        "itemDemand": demand,

        # grouped student summary
        "students": student_summary
    }


@router.get("/org/ledger/{org_id}")
def monthly_ledger(
    org_id: str,
    month: str = Query("July", description="Month name e.g. July"),
    year: str = Query("2026", description="Year e.g. 2026"),
    search: str = Query("", description="Student name or ID search"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    user=Depends(get_current_user)
):
    # Security: Verify organization ownership
    user_org = user.get("organizationId") or user.get("userId")
    if user.get("type") != "super_admin" and user_org != org_id:
        raise HTTPException(status_code=403, detail="Unauthorized access to organization ledger")

    return get_organization_monthly_ledger(
        org_id=org_id,
        month=month,
        year=year,
        search=search,
        page=page,
        limit=limit
    )