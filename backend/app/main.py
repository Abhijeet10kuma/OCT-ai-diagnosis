from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.user import DBUser
from app.core.security import get_password_hash
from app.api.routes import auth, predict, history, report
import app.services.inference as inference_module

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create SQLite tables
    Base.metadata.create_all(bind=engine)
    
    # Seed admin user
    db = SessionLocal()
    try:
        admin_username = settings.ADMIN_USERNAME
        admin_email = f"{admin_username}@system.com"
        admin_user = db.query(DBUser).filter(DBUser.name == admin_username).first()
        if not admin_user:
            new_admin = DBUser(
                name=admin_username,
                email=admin_email,
                role="admin",
                password_hash=get_password_hash(settings.ADMIN_PASSWORD)
            )
            db.add(new_admin)
            db.commit()
            print(f"Seeded admin user: {admin_username}")
    finally:
        db.close()

    # Load the global PyTorch model
    print("Loading PyTorch model globally...")
    try:
        inference_module.model = inference_module.load_model()
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Warning: Model could not be loaded: {e}")
        inference_module.model = None

    yield
    print("Shutting down FastAPI application.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Production-ready FastAPI backend for OCT AI Diagnosis.",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(predict.router, prefix="/api/predict", tags=["Inference"])
app.include_router(history.router, prefix="/api/history", tags=["History & Analytics"])
app.include_router(report.router, prefix="/api/report", tags=["Reports"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "model_loaded": inference_module.model is not None}
