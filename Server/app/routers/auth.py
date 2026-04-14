from fastapi import APIRouter, HTTPException, Request
from app.models.user import UserCreate, UserLogin
from app.services.auth_service import create_user, authenticate_user
from app.core.security import create_token
from app.db.mongodb import db
from pymongo.errors import DuplicateKeyError
from app.core.rate_limiter import limiter
from app.core.logger import logger

router = APIRouter(prefix="/auth", tags=["Auth"])

organizations = db.organizations


# 🔥 SIGNUP (RATE LIMITED + LOGGING)
@router.post("/signup")
@limiter.limit("5/minute")
async def signup(request: Request, user: UserCreate):

    try:
        # 🎓 STUDENT VALIDATION
        if user.type == "student":
            if not user.organizationId:
                raise HTTPException(400, "Organization ID required")

            org = organizations.find_one({
                "organizationId": user.organizationId,
                "active": True
            })

            if not org:
                raise HTTPException(400, "Invalid Organization ID")

        # ✅ CREATE USER
        new_user = create_user(user.dict())

        # 🔐 TOKEN
        token = create_token({
            "userId": new_user["userId"],
            "type": new_user["type"],
            "organizationId": new_user.get("organizationId"),
        })

        logger.info(f"Signup success: {new_user['userId']}")

        return {
            "token": token,
            "user": {
                "name": new_user["name"],
                "userId": new_user["userId"],
                "type": new_user["type"],
                "organizationId": new_user.get("organizationId"),
            }
        }

    except DuplicateKeyError:
        logger.warning("Duplicate signup attempt")
        raise HTTPException(400, "User ID already exists")

    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(500, "Internal Server Error")


# 🔥 LOGIN (RATE LIMITED + SAFE)
@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, data: UserLogin):

    try:
        user = authenticate_user(data.userId, data.password)

        if not user or not user.get("active"):
            logger.warning(f"Failed login: {data.userId}")
            raise HTTPException(401, "Invalid credentials")

        token = create_token({
            "userId": user["userId"],
            "type": user["type"],
            "organizationId": user.get("organizationId"),
        })

        logger.info(f"Login success: {user['userId']}")

        return {
            "token": token,
            "user": {
                "name": user["name"],
                "userId": user["userId"],
                "type": user["type"],
                "organizationId": user.get("organizationId"),
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(500, "Internal Server Error")