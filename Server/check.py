from app.db.mongodb import db
import json

indexes = list(db.orders.list_indexes())

print(json.dumps(indexes, indent=2, default=str))