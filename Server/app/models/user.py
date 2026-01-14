from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    userId: str 
    password: str
    type: str
    organizationId: str | None = None
    mobile: str | None = None

class UserLogin(BaseModel):
    userId: str
    password: str
