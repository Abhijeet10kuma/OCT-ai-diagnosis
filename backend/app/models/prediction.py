from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel
from sqlalchemy import Column, String, Float, DateTime, Boolean, JSON, ForeignKey
from app.core.database import Base
import uuid

# SQLAlchemy Model
class DBPrediction(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    predicted_class = Column(String)
    confidence = Column(Float)
    probabilities = Column(JSON)
    gradcam_image = Column(String) # Base64
    original_image = Column(String) # Base64
    original_filename = Column(String)
    inference_time_ms = Column(Float)
    report_generated = Column(Boolean, default=False)
    doctor_notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Schemas
class PredictionRequest(BaseModel):
    # This is handled via multipart form data for the image
    pass

class PredictionResponse(BaseModel):
    prediction_id: str
    predicted_class: str
    confidence: float
    probabilities: Dict[str, float]
    gradcam_overlay: str
    original_image: str
    inference_time_ms: float
    timestamp: datetime

    class Config:
        from_attributes = True

class PredictionHistoryResponse(BaseModel):
    prediction_id: str
    predicted_class: str
    confidence: float
    probabilities: Dict[str, float]
    inference_time_ms: float
    timestamp: datetime
    original_filename: str
    report_generated: bool
    doctor_notes: Optional[str] = None

    class Config:
        from_attributes = True
