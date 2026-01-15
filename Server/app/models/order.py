from pydantic import BaseModel
from typing import List, Literal

class OrderItem(BaseModel):
    name: str
    status: Literal["Eat", "Skip"]

class OrderCreate(BaseModel):
    studentId: str
    studentName: str
    organizationId: str
    menuId: str
    items: List[OrderItem]
