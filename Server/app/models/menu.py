from pydantic import BaseModel
from typing import List

class MenuItem(BaseModel):
    name: str
    price: int

class MenuCreate(BaseModel):
    organizationId: str
    items: List[MenuItem]
    validMinutes: int = 60   # default 1 hour
