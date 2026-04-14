from app.db.mongodb import db
from pymongo.errors import OperationFailure


def create_indexes():
    try:
        # ================= USERS =================
        db.users.create_index("userId", unique=True)
        db.users.create_index("organizationId")

        # ================= ORGANIZATIONS =================
        db.organizations.create_index("organizationId", unique=True)

        # ================= MENUS =================
        db.menus.create_index([
            ("organizationId", 1),
            ("date", 1)
        ])

        # ================= ORDERS (MOST IMPORTANT) =================
        db.orders.create_index([
            ("organizationId", 1),
            ("menuId", 1),
            ("studentId", 1)
        ])

        # 🔥 Dashboard / aggregation boost
        db.orders.create_index([
            ("organizationId", 1),
            ("menuId", 1),
            ("items.status", 1)
        ])

        # 🔥 Fast lookup by student
        db.orders.create_index("studentId")

        print("✅ All indexes created successfully")

    except OperationFailure as e:
        print("⚠️ Index error:", e)