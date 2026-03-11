
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, organization ,  menu, orders, dashboard,subscription 
from app.routers import webhook
from app.routers import admin
app = FastAPI(title="Food Not Waste API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://serviq-platform.vercel.app"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(auth.router)
app.include_router(organization.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
app.include_router(subscription.router)
app.include_router(webhook.router)
app.include_router(admin.router)
@app.get("/")
def root():
    return {"status": "Backend running"}

