from datetime import datetime
from pydantic import BaseModel, Field

class ReportRequest(BaseModel):
    prediction_id: str
    doctor_notes: str

class ReportInDB(BaseModel):
    id: str = Field(alias="_id")
    prediction_id: str
    user_id: str
    pdf_data: bytes
    created_at: datetime
