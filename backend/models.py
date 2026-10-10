import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    ward_number = Column(String, index=True)
    zone = Column(String)
    city = Column(String, default="Bengaluru")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text)
    landmark = Column(String)
    classification = Column(String, default="one_time")  # one_time, emerging, repeated
    recurrence_score = Column(Integer, default=0)
    drain_risk = Column(String, default="none")
    investigation_status = Column(String, default="open")  # open, investigating, action_planned, verified_clean
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    incidents = relationship("Incident", back_populates="location")
    hypotheses = relationship("RootCauseHypothesis", back_populates="location")
    tasks = relationship("PreventionTask", back_populates="location")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    location_id = Column(String, ForeignKey("locations.id"), nullable=False)
    reported_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    reporter_name = Column(String, default="Citizen Reporter")
    reporter_role = Column(String, default="citizen")  # citizen, ward_inspector, sanitation_supervisor, ai_camera
    photo_url = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    severity = Column(String, default="moderate")
    estimated_volume_kg = Column(Float, default=0.0)
    notes = Column(Text)
    cleanup_status = Column(String, default="pending")  # pending, cleaned_pending_verification, verified_clean
    cleanup_proof_url = Column(Text, nullable=True)
    cleaned_at = Column(DateTime, nullable=True)
    verified_by = Column(String, nullable=True)

    location = relationship("Location", back_populates="incidents")
    ai_analysis = relationship("AIAnalysis", back_populates="incident", uselist=False)


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False, unique=True)
    analyzed_at = Column(DateTime, default=datetime.datetime.utcnow)
    model_used = Column(String, default="gemini-3.8-flash")
    is_demo_fallback = Column(Boolean, default=False)
    visible_categories = Column(JSON)  # list of objects
    approx_severity = Column(String)
    drain_risk = Column(String)
    detected_obstruction = Column(Boolean, default=False)
    drain_observation = Column(Text)
    flood_vulnerability = Column(String, default="low")
    environmental_context = Column(JSON)
    image_limitations = Column(JSON)
    raw_visual_observations = Column(Text)

    incident = relationship("Incident", back_populates="ai_analysis")


class RootCauseHypothesis(Base):
    __tablename__ = "hypotheses"

    id = Column(String, primary_key=True, index=True)
    location_id = Column(String, ForeignKey("locations.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    confidence_score = Column(Integer, default=70)
    uncertainty_level = Column(String, default="medium")
    supporting_evidence = Column(JSON)
    missing_information = Column(JSON)
    verification_step = Column(Text)
    suggested_prevention_action = Column(Text)
    is_ai_generated = Column(Boolean, default=True)
    priority = Column(String, default="medium")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    location = relationship("Location", back_populates="hypotheses")


class PreventionTask(Base):
    __tablename__ = "prevention_tasks"

    id = Column(String, primary_key=True, index=True)
    location_id = Column(String, ForeignKey("locations.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    assigned_to = Column(String)
    assigned_role = Column(String)
    department = Column(String)
    priority = Column(String, default="medium")
    status = Column(String, default="open")  # open, in_progress, under_review, resolved
    due_date = Column(String)
    prevention_type = Column(String)
    verification_notes = Column(Text, nullable=True)
    after_cleanup_evidence_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)

    location = relationship("Location", back_populates="tasks")
