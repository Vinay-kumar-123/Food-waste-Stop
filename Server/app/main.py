from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.rate_limiter import limiter
from app.routers import auth, organization, menu, orders, dashboard, subscription
from app.routers import webhook, admin
from app.db.create_indexes import create_indexes


# 🔥 Lifespan (Modern replacement of on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Server starting...")

    # ✅ Create indexes at startup
    create_indexes()

    yield

    print("🛑 Server shutting down...")


# ✅ Initialize app with lifespan
app = FastAPI(
    title="Food Not Waste API",
    lifespan=lifespan
)


# 🔥 Rate Limiter setup
app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    lambda request, exc: JSONResponse(
        status_code=429,
        content={"error": "Too many requests"}
    ),
)

app.add_middleware(SlowAPIMiddleware)


# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://serviq-platform.vercel.app"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🔥 Global middleware (future use)
@app.middleware("http")
async def global_middleware(request: Request, call_next):
    response = await call_next(request)
    return response


# ✅ Routers
app.include_router(auth.router)
app.include_router(organization.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
app.include_router(subscription.router)
app.include_router(webhook.router)
app.include_router(admin.router)


# ✅ Health check
@app.get("/health")
def health():
    return {"status": "ok"}


# ✅ Root
@app.get("/")
def root():
    return {"status": "Backend running"}