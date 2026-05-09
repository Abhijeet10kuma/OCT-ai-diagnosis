from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import UserResponse
from app.models.prediction import PredictionHistoryResponse, DBPrediction
from app.core.database import get_db
from collections import defaultdict
from datetime import datetime

router = APIRouter()

@router.get("", response_model=List[PredictionHistoryResponse])
def get_history(
    current_user: UserResponse = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    predictions = db.query(DBPrediction).filter(DBPrediction.user_id == current_user.id)\
                    .order_by(DBPrediction.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        PredictionHistoryResponse.model_validate({
            "prediction_id": p.id,
            "predicted_class": p.predicted_class,
            "confidence": p.confidence,
            "probabilities": p.probabilities,
            "inference_time_ms": p.inference_time_ms,
            "timestamp": p.created_at,
            "original_filename": p.original_filename,
            "report_generated": p.report_generated,
            "doctor_notes": p.doctor_notes
        }) for p in predictions
    ]

@router.get("/analytics")
def get_analytics(
    current_user: UserResponse = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    predictions = db.query(DBPrediction).filter(DBPrediction.user_id == current_user.id).all()
    
    # Disease Distribution
    dist_map = defaultdict(int)
    for p in predictions:
        dist_map[p.predicted_class] += 1
    disease_distribution = [{"name": k, "value": v} for k, v in dist_map.items()]
    
    # Monthly Volume
    vol_map = defaultdict(int)
    for p in predictions:
        month_str = p.created_at.strftime("%Y-%m")
        vol_map[month_str] += 1
    monthly_volume = [{"month": k, "count": v} for k, v in sorted(vol_map.items())]
    
    # Confidence Trend
    conf_map = defaultdict(list)
    for p in predictions:
        date_str = p.created_at.strftime("%Y-%m-%d")
        conf_map[date_str].append(p.confidence)
        
    confidence_trend = [
        {"date": k, "avg_confidence": sum(v) / len(v)}
        for k, v in sorted(conf_map.items())
    ]
    
    return {
        "disease_distribution": disease_distribution,
        "monthly_volume": monthly_volume,
        "confidence_trend": confidence_trend
    }

@router.get("/{prediction_id}", response_model=PredictionHistoryResponse)
def get_prediction_detail(
    prediction_id: str,
    current_user: UserResponse = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    prediction = db.query(DBPrediction).filter(
        DBPrediction.id == prediction_id,
        DBPrediction.user_id == current_user.id
    ).first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
        
    return PredictionHistoryResponse.model_validate({
        "prediction_id": prediction.id,
        "predicted_class": prediction.predicted_class,
        "confidence": prediction.confidence,
        "probabilities": prediction.probabilities,
        "inference_time_ms": prediction.inference_time_ms,
        "timestamp": prediction.created_at,
        "original_filename": prediction.original_filename,
        "report_generated": prediction.report_generated,
        "doctor_notes": prediction.doctor_notes
    })
