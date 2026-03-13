# from pydantic import BaseModel
# from typing import List

# class MenuItem(BaseModel):
#     name: str
#     price: int

# class MenuCreate(BaseModel):
#     organizationId: str
#     items: List[MenuItem]
#     validMinutes: int = 60   # default 1 hour

from pydantic import BaseModel
from typing import List


class MenuItem(BaseModel):
    name: str
    price: int


class MenuSection(BaseModel):
    name: str
    items: List[MenuItem]


class MenuCreate(BaseModel):
    organizationId: str
    sections: List[MenuSection]
    validMinutes: int = 200