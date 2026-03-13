

# from fastapi import APIRouter
# from app.services.order_service import (
#     get_today_orders,
#     get_item_wise_demand
# )

# router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# @router.get("/org/today/{org_id}/{menu_id}")
# def today_summary(org_id: str, menu_id: str):
#     orders = get_today_orders(org_id, menu_id)

#     eaten = 0
#     skipped = 0

#     for o in orders:
#         for i in o["items"]:
#             if i["status"] == "Eat":
#                 eaten += 1
#             else:
#                 skipped += 1

#     # ✅ ITEM-WISE DEMAND
#     demand = get_item_wise_demand(org_id, menu_id)

#     return {
#         "responses": len(orders),
#         "itemDemand": demand,   # 👈 NEW
#         "orders": [
#             {
#                 "studentId": o["studentId"],
#                 "studentName": o["studentName"],
#                 "items": o["items"]
#             }
#             for o in orders
#         ]
#     }

from fastapi import APIRouter
from app.services.order_service import (
    get_today_orders,
    get_item_wise_demand
)

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