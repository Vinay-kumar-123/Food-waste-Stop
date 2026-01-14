from fastapi import APIRouter
from app.services.organization_service import create_organization_id

router = APIRouter(prefix="/organization", tags=["Organization"])

@router.get("/generate-id")
def generate_organization_id():
    org_id = create_organization_id()
    print("org is ", org_id)
    return {
        "organizationId": org_id
    }


