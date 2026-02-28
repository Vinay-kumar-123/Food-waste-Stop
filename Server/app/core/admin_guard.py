from fastapi import Depends, HTTPException
from app.core.auth_dependency import get_current_user

def super_admin_guard(user=Depends(get_current_user)):
    if user["type"] != "super_admin":
        raise HTTPException(status_code=403, detail="Access denied")
    return user