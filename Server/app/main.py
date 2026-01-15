from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, organization ,  menu, orders, dashboard

app = FastAPI(title="Food Not Waste API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(organization.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
@app.get("/")
def root():
    return {"status": "Backend running"}
