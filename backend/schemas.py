from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class IncidentCreate(BaseModel):
    location_name: str
    latitude: float
    longitude: float
    photo_url: str
    category: str
    severity: Optional[str] = "moderate"
    estimated_volume_kg: Optional[float] = 0.0
    notes: Optional[str] = ""
    reporter_name: Optional[str] = "Field Inspector"
    reporter_role: Optional[str] = "ward_inspector"

class TaskCreate(BaseModel):
    location_id: str
    title: str
    description: Optional[str] = ""
    assigned_to: str
    assigned_role: Optional[str] = "Field Officer"
    department: str
    priority: Optional[str] = "medium"
    due_date: str
    prevention_type: str

class TaskUpdate(BaseModel):
    status: str
    verification_notes: Optional[str] = None
    after_cleanup_evidence_url: Optional[str] = None

class ImageAnalysisRequest(BaseModel):
    image_base64: str
    location_name: Optional[str] = "Urban Hotspot"
    category_hint: Optional[str] = None
    notes: Optional[str] = None

class AIAnalysisResponse(BaseModel):
    id: str
    model_used: str
    is_demo_fallback: bool
    visible_categories: List[Dict[str, Any]]
    approx_severity: str
    drain_risk: str
    detected_obstruction: bool
    drain_observation: str
    flood_vulnerability: str
    environmental_context: Dict[str, Any]
    image_limitations: List[str]
    raw_visual_observations: str
    distinction_disclaimer: str
