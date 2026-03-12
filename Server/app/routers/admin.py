from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from app.core.admin_guard import super_admin_guard
from app.db.mongodb import db

router = APIRouter(prefix="/admin", tags=["Super Admin"])

@router.get("/stats")
def get_admin_stats(user=Depends(super_admin_guard)):
    total_orgs = db.users.count_documents({"type": "organization"})
    total_students = db.users.count_documents({"type": "student"})

    active_subs = db.users.count_documents({
        "type": "organization",
        "isSubscribed": True
    })

    revenue = active_subs * 1099

    return {
        "totalOrganizations": total_orgs,
        "totalStudents": total_students,
        "activeSubscriptions": active_subs,
        "totalRevenue": revenue
    }