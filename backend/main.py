import uuid
import datetime
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from database import engine, get_db, Base
import models
import schemas
from recurrence_engine import haversine_distance_meters, calculate_recurrence_score
from ai_vision import analyze_photo_with_vision

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WasteShadow AI — SWM Municipal Intelligence Backend",
    version="1.0.0",
    description="Recurring waste hotspot detection, drain choke prevention, and root-cause hypothesis API."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "WasteShadow AI",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "gemini_vision_ready": True
    }

# ----------------- AI Vision Analysis Endpoint -----------------
@app.post("/api/ai/analyze-image", response_model=schemas.AIAnalysisResponse)
def analyze_image_endpoint(req: schemas.ImageAnalysisRequest):
    """
    Analyzes an uploaded photo for waste materials, severity, and drain obstruction hazard.
    """
    result = analyze_photo_with_vision(
        image_base64=req.image_base64,
        location_name=req.location_name or "Urban Location",
        notes=req.notes,
        category_hint=req.category_hint
    )

    return schemas.AIAnalysisResponse(
        id=str(uuid.uuid4()),
        model_used=result.get("model_used", "gemini-3.8-flash"),
        is_demo_fallback=result.get("is_demo_fallback", False),
        visible_categories=result.get("visible_categories", []),
        approx_severity=result.get("approx_severity", "moderate"),
        drain_risk=result.get("drain_risk", "none"),
        detected_obstruction=result.get("detected_obstruction", False),
        drain_observation=result.get("drain_observation", "No drain visible"),
        flood_vulnerability=result.get("flood_vulnerability", "low"),
        environmental_context=result.get("environmental_context", {}),
        image_limitations=result.get("image_limitations", []),
        raw_visual_observations=result.get("raw_visual_observations", ""),
        distinction_disclaimer=result.get("distinction_disclaimer", "")
    )

# ----------------- Incidents Endpoints -----------------
@app.post("/api/incidents")
def create_incident(inc_in: schemas.IncidentCreate, db: Session = Depends(get_db)):
    """
    Ingests an incident, clusters to an existing hotspot within 80m or creates a new one,
    and updates the mathematical recurrence score.
    """
    # 1. Check for existing hotspot within 80m
    hotspots = db.query(models.Location).all()
    matching_hotspot = None
    min_dist = float("inf")

    for h in hotspots:
        dist = haversine_distance_meters(inc_in.latitude, inc_in.longitude, h.latitude, h.longitude)
        if dist <= 80.0 and dist < min_dist:
            min_dist = dist
            matching_hotspot = h

    if not matching_hotspot:
        matching_hotspot = models.Location(
            id=f"loc_{uuid.uuid4().hex[:8]}",
            name=inc_in.location_name,
            ward_number="Ward 84 (Auto)",
            zone="Central Zone",
            city="Bengaluru",
            latitude=inc_in.latitude,
            longitude=inc_in.longitude,
            address=inc_in.location_name,
            classification="one_time",
            recurrence_score=15,
            drain_risk="none",
            investigation_status="open",
            description=inc_in.notes or "Newly reported civic waste hotspot."
        )
        db.add(matching_hotspot)
        db.commit()
        db.refresh(matching_hotspot)

    # 2. Add Incident
    incident_id = f"inc_{uuid.uuid4().hex[:8]}"
    db_incident = models.Incident(
        id=incident_id,
        location_id=matching_hotspot.id,
        reporter_name=inc_in.reporter_name,
        reporter_role=inc_in.reporter_role,
        photo_url=inc_in.photo_url,
        category=inc_in.category,
        severity=inc_in.severity,
        estimated_volume_kg=inc_in.estimated_volume_kg,
        notes=inc_in.notes,
        cleanup_status="pending"
    )
    db.add(db_incident)
    db.commit()

    # 3. Recalculate Recurrence Score for Hotspot
    all_loc_incidents = db.query(models.Incident).filter(models.Incident.location_id == matching_hotspot.id).all()
    rec_metrics = calculate_recurrence_score(all_loc_incidents)

    matching_hotspot.recurrence_score = rec_metrics["total_score"]
    matching_hotspot.classification = rec_metrics["classification"]
    db.commit()

    return {
        "status": "success",
        "incident_id": incident_id,
        "hotspot_id": matching_hotspot.id,
        "hotspot_name": matching_hotspot.name,
        "recurrence_score": matching_hotspot.recurrence_score,
        "classification": matching_hotspot.classification,
        "total_incidents": len(all_loc_incidents)
    }

@app.get("/api/incidents")
def list_incidents(
    location_id: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Incident)
    if location_id:
        query = query.filter(models.Incident.location_id == location_id)
    if category:
        query = query.filter(models.Incident.category == category)
    return query.order_by(models.Incident.reported_at.desc()).all()

# ----------------- Hotspots Endpoints -----------------
@app.get("/api/hotspots")
def list_hotspots(
    classification: Optional[str] = None,
    drain_hazard_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(models.Location)
    if classification:
        query = query.filter(models.Location.classification == classification)
    if drain_hazard_only:
        query = query.filter(models.Location.drain_risk != "none")
    return query.order_by(models.Location.recurrence_score.desc()).all()

@app.get("/api/hotspots/{hotspot_id}")
def get_hotspot_details(hotspot_id: str, db: Session = Depends(get_db)):
    hotspot = db.query(models.Location).filter(models.Location.id == hotspot_id).first()
    if not hotspot:
        raise HTTPException(status_code=404, detail="Hotspot not found")

    incidents = db.query(models.Incident).filter(models.Incident.location_id == hotspot_id).all()
    hypotheses = db.query(models.RootCauseHypothesis).filter(models.RootCauseHypothesis.location_id == hotspot_id).all()
    tasks = db.query(models.PreventionTask).filter(models.PreventionTask.location_id == hotspot_id).all()
    rec_metrics = calculate_recurrence_score(incidents)

    return {
        "hotspot": hotspot,
        "incidents": incidents,
        "hypotheses": hypotheses,
        "tasks": tasks,
        "recurrence_metrics": rec_metrics
    }

# ----------------- Prevention Tasks Endpoints -----------------
@app.post("/api/tasks")
def create_prevention_task(task_in: schemas.TaskCreate, db: Session = Depends(get_db)):
    task = models.PreventionTask(
        id=f"task_{uuid.uuid4().hex[:8]}",
        location_id=task_in.location_id,
        title=task_in.title,
        description=task_in.description,
        assigned_to=task_in.assigned_to,
        assigned_role=task_in.assigned_role,
        department=task_in.department,
        priority=task_in.priority,
        status="open",
        due_date=task_in.due_date,
        prevention_type=task_in.prevention_type
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.put("/api/tasks/{task_id}")
def update_task_status(task_id: str, update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.PreventionTask).filter(models.PreventionTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = update.status
    if update.verification_notes:
        task.verification_notes = update.verification_notes
    if update.after_cleanup_evidence_url:
        task.after_cleanup_evidence_url = update.after_cleanup_evidence_url

    if update.status == "resolved":
        task.verified_at = datetime.datetime.utcnow()

    db.commit()
    return task

# ----------------- Reports & Summaries -----------------
@app.get("/api/reports/summary")
def get_reports_summary(db: Session = Depends(get_db)):
    total_locations = db.query(models.Location).count()
    recurring_hotspots = db.query(models.Location).filter(models.Location.classification == "repeated").count()
    emerging_hotspots = db.query(models.Location).filter(models.Location.classification == "emerging").count()
    total_incidents = db.query(models.Incident).count()
    resolved_incidents = db.query(models.Incident).filter(models.Incident.cleanup_status == "verified_clean").count()

    return {
        "total_locations": total_locations,
        "recurring_hotspots": recurring_hotspots,
        "emerging_hotspots": emerging_hotspots,
        "total_incidents": total_incidents,
        "resolved_incidents": resolved_incidents,
        "methodology": "WasteShadow AI Spatiotemporal Clustering & Multimodal Evidence Correlation"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
