from fastapi import APIRouter,  Depends
from app.models.menu import MenuCreate
from app.services.menu_service import create_menu, get_active_menu
from app.core.auth_dependency import subscription_guard


router = APIRouter(prefix="/menu", tags=["Menu"])


@router.post("/upload")
def upload_menu(menu: MenuCreate, user=Depends(subscription_guard)):
    # ✅ FIX: model_dump() (Pydantic v2)
    data = menu.model_dump()
    created = create_menu(data)

    return {
        "message": "Menu uploaded successfully",
        "menuId": str(created["_id"]),
        "validForMinutes": menu.validMinutes
    }


# @router.get("/active/{org_id}")
# def active_menu(org_id: str):
#     menu = get_active_menu(org_id)

#     if not menu:
#         return {
#             "active": False,
#             "items": []
#         }

#     menu["_id"] = str(menu["_id"])
#     return menu

@router.get("/active/{org_id}")
def active_menu(org_id: str):
    menu = get_active_menu(org_id)

    if not menu:
        return {"active": False, "sections": []}

    menu["_id"] = str(menu["_id"])
    return menu