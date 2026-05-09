from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from datetime import datetime
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import UserResponse
from app.models.prediction import PredictionResponse, DBPrediction
from app.services.inference import predict_image
from app.services.gradcam import generate_gradcam_overlay
from app.core.database import get_db
import app.services.inference as inference_module

router = APIRouter()

@router.post("", response_model=PredictionResponse)
def predict(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed.")
    
    contents = file.file.read()
    
    # Model inference
    try:
        results = predict_image(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
        
    # Grad-CAM visualization
    try:
        overlay_b64, orig_b64 = generate_gradcam_overlay(
            inference_module.model, 
            results["input_tensor"], 
            results["raw_img"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Grad-CAM error: {str(e)}")
        
    timestamp = datetime.utcnow()
    
    new_prediction = DBPrediction(
        user_id=current_user.id,
        predicted_class=results["predicted_class"],
        confidence=results["confidence"],
        probabilities=results["probabilities"],
        gradcam_image=overlay_b64,
        original_image=orig_b64,
        original_filename=file.filename,
        inference_time_ms=results["inference_time_ms"],
        created_at=timestamp
    )
    
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    
    response = PredictionResponse(
        prediction_id=new_prediction.id,
        predicted_class=results["predicted_class"],
        confidence=results["confidence"],
        probabilities=results["probabilities"],
        gradcam_overlay=f"data:image/png;base64,{overlay_b64}",
        original_image=f"data:image/png;base64,{orig_b64}",
        inference_time_ms=results["inference_time_ms"],
        timestamp=timestamp
    )
    
    return response
