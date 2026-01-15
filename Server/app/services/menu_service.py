from datetime import datetime, timedelta, timezone
from app.db.mongodb import db

menus = db.menus


def create_menu(data: dict):
    now = datetime.now(timezone.utc)

    print("MENU RECEIVED:", data)  # 🔥 DEBUG (keep for now)

    # 🔴 deactivate old menus
    menus.update_many(
        {"organizationId": data["organizationId"], "active": True},
        {"$set": {"active": False}}
    )

    menu = {
        "organizationId": data["organizationId"],
        "items": data["items"],  # name + price
        "startTime": now,
        "endTime": now + timedelta(minutes=data.get("validMinutes", 60)),
        "active": True
    }

    result = menus.insert_one(menu)
    menu["_id"] = result.inserted_id
    return menu


def get_active_menu(org_id: str):
    now = datetime.now(timezone.utc)

    return menus.find_one({
        "organizationId": org_id,
        "active": True,
        "startTime": {"$lte": now},
        "endTime": {"$gte": now}
    })
