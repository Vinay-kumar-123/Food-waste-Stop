from app.db.mongodb import db
from pymongo.errors import OperationFailure

def create_indexes():
    try:
        # 🔥 USER ID UNIQUE
        db.users.create_index("userId", unique=True)

        # 🔥 ORGANIZATION ID (fast lookup)
        db.users.create_index("organizationId")

        # 🔥 ORGANIZATION COLLECTION
        db.organizations.create_index("organizationId", unique=True)

        print("✅ Indexes created")

    except OperationFailure as e:
        print("⚠️ Index error:", e)