from app.db.mongodb import db
from app.utils.org_id import generate_org_id

organizations = db.organizations

def create_organization_id():
    while True:
        org_id = generate_org_id()
        exists = organizations.find_one({"organizationId": org_id})
        if not exists:
            organizations.insert_one({
                "organizationId": org_id,
                "active": True
            })
            return org_id
