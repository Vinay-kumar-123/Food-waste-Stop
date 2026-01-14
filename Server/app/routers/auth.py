from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserLogin
from app.services.auth_service import create_user, authenticate_user
from app.core.security import create_token
from app.db.mongodb import db

router = APIRouter(prefix="/auth", tags=["Auth"])

organizations = db.organizations

@router.post("/signup")
def signup(user: UserCreate):

    # 🔒 USER ID UNIQUE CHECK
    if db.users.find_one({"userId": user.userId}):
        raise HTTPException(400, "User ID already exists")

    # 🎓 STUDENT → ORGANIZATION VALIDATION
    if user.type == "student":
        if not user.organizationId:
            raise HTTPException(400, "Organization ID required")

        org = organizations.find_one({
            "organizationId": user.organizationId,
            "active": True
        })
        if not org:
            raise HTTPException(400, "Invalid Organization ID")

    new_user = create_user(user.dict())

    token = create_token({
        "userId": new_user["userId"],
        "type": new_user["type"],
        "organizationId": new_user.get("organizationId"),
    })

    return {
        "token": token,
        "user": {
            "name": new_user["name"],
            "userId": new_user["userId"],
            "type": new_user["type"],
            "organizationId": new_user.get("organizationId"),
        }
    }



@router.post("/login")
def login(data: UserLogin):
    user = authenticate_user(data.userId, data.password)

    if not user or not user.get("active"):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({
        "userId": user["userId"],
        "type": user["type"],
        "organizationId": user.get("organizationId"),
    })

    return {
        "token": token,
        "user": {
            "name": user["name"],
            "userId": user["userId"],
            "type": user["type"],
            "organizationId": user.get("organizationId"),
        }
    }

