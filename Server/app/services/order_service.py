from datetime import datetime, timezone, timedelta
from app.db.mongodb import db
from bson import ObjectId
orders = db.orders
menus = db.menus


def submit_order(data: dict):
    now = datetime.now(timezone.utc)

    # menu _id sirf menu check ke liye ObjectId
    try:
        menu_object_id = ObjectId(data["menuId"])
    except:
        return None

    menu = menus.find_one({
        "_id": menu_object_id,
        "active": True
    })

    if not menu:
        return None

    start = menu["startTime"]
    end = menu["endTime"]

    if start.tzinfo is None:
        start = start.replace(tzinfo=timezone.utc)
    if end.tzinfo is None:
        end = end.replace(tzinfo=timezone.utc)

    if not (start <= now <= end):
        return None

    # ✅ correct duplicate check (STRING menuId)
    exists = orders.find_one({
        "studentId": data["studentId"],
        "menuId": data["menuId"]
    })

    if exists:
        return None

    order = {
        "studentId": data["studentId"],
        "studentName": data["studentName"],
        "organizationId": data["organizationId"],
        "menuId": data["menuId"],     # ✅ STRING
        "items": data["items"],
        "createdAt": now,
        "dateOnly": now.date().isoformat()
    }

    orders.insert_one(order)
    return order



def get_student_orders(student_id: str):
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=30)

    data = list(
        orders.find({
            "studentId": student_id,
            "createdAt": {"$gte": seven_days_ago}
        }).sort("createdAt", -1)
    )

    for d in data:
        d["_id"] = str(d["_id"])
        d["createdAt"] = d["createdAt"].isoformat()  # 🔑 VERY IMPORTANT

    return data


def get_today_orders(org_id: str, menu_id: str):
    today = datetime.now(timezone.utc).date().isoformat()

    docs = list(
        orders.find({
            "organizationId": org_id,
            "menuId": menu_id,     # STRING MATCH
            "dateOnly": today
        })
    )

    # 🔑 CRITICAL FIX: ObjectId → string
    for d in docs:
        d["_id"] = str(d["_id"])

    return docs





# def get_item_wise_demand(org_id: str, menu_id: str):
    

#     # 🔑 Fetch only current menu orders
#     order_list = list(
#         orders.find({
#             "organizationId": org_id,
#             "menuId": menu_id
#         })
#     )

#     demand = {}

#     for order in order_list:
#         for item in order.get("items", []):
#             if item.get("status") == "Eat":
#                 name = item.get("name")
#                 if name:
#                     demand[name] = demand.get(name, 0) + 1

#     return demand

def get_item_wise_demand(org_id: str, menu_id: str):

    menu = menus.find_one({"_id": ObjectId(menu_id)})

    if not menu:
        return {}

    sections = menu.get("sections", [])

    # structure create
    demand = {}

    for section in sections:
        section_name = section["name"]
        demand[section_name] = {}

        for item in section["items"]:
            demand[section_name][item["name"]] = 0

    order_list = list(
        orders.find({
            "organizationId": org_id,
            "menuId": menu_id
        })
    )

    for order in order_list:

        for item in order.get("items", []):

            if item["status"] == "Eat":

                for section in sections:

                    for menu_item in section["items"]:

                        if menu_item["name"] == item["name"]:

                            demand[section["name"]][item["name"]] += 1

    return demand