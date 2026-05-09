from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import UserResponse
from app.models.report import ReportRequest
from app.models.prediction import DBPrediction
from app.core.database import get_db
from app.services.pdf_generator import create_pdf_report
from datetime import datetime

router = APIRouter()

@router.post("/generate")
def generate_report(
    req: ReportRequest,
    current_user: UserResponse = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    prediction = db.query(DBPrediction).filter(
        DBPrediction.id == req.prediction_id,
        DBPrediction.user_id == current_user.id
    ).first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    # Update doctor notes
    prediction.doctor_notes = req.doctor_notes
    prediction.report_generated = True
    db.commit()
    
    # Convert prediction SQLAlchemy model to dictionary for PDF generator
    prediction_dict = {
        "predicted_class": prediction.predicted_class,
        "confidence": prediction.confidence,
        "probabilities": prediction.probabilities,
        "gradcam_image": prediction.gradcam_image,
        "original_image": prediction.original_image,
        "original_filename": prediction.original_filename,
        "inference_time_ms": prediction.inference_time_ms,
        "created_at": prediction.created_at
    }
    
    # Generate PDF
    pdf_bytes = create_pdf_report(prediction_dict, current_user.model_dump(), req.doctor_notes)
    
    return Response(
        content=pdf_bytes, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=OCT_Report_{current_user.id}_{datetime.utcnow().strftime('%Y%m%d')}.pdf"}
    )
