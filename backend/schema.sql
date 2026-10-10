-- ==============================================================================
-- WasteShadow AI — Production PostgreSQL & Supabase Database Schema
-- Intelligent Recurring Waste Detection & Prevention Platform
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Locations / Hotspots Table
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ward_number VARCHAR(100) NOT NULL,
    zone VARCHAR(100),
    city VARCHAR(100) DEFAULT 'Bengaluru',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    landmark VARCHAR(255),
    classification VARCHAR(32) DEFAULT 'one_time' CHECK (classification IN ('one_time', 'emerging', 'repeated')),
    recurrence_score INTEGER DEFAULT 0 CHECK (recurrence_score BETWEEN 0 AND 100),
    drain_risk VARCHAR(64) DEFAULT 'none' CHECK (drain_risk IN ('none', 'partial', 'severe', 'critical_flood_hazard')),
    investigation_status VARCHAR(64) DEFAULT 'open' CHECK (investigation_status IN ('open', 'investigating', 'action_planned', 'verified_clean')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spatial & Filter Indexes
CREATE INDEX IF NOT EXISTS idx_locations_lat_lng ON locations (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_locations_classification ON locations (classification);
CREATE INDEX IF NOT EXISTS idx_locations_recurrence_score ON locations (recurrence_score DESC);
CREATE INDEX IF NOT EXISTS idx_locations_drain_risk ON locations (drain_risk);

-- 3. Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(64) PRIMARY KEY,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE CASCADE,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reporter_name VARCHAR(150) DEFAULT 'Citizen Reporter',
    reporter_role VARCHAR(64) DEFAULT 'citizen' CHECK (reporter_role IN ('citizen', 'ward_inspector', 'sanitation_supervisor', 'ai_camera')),
    photo_url TEXT NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN (
        'organic_market',
        'single_use_plastics',
        'construction_debris',
        'drain_sludge_waste',
        'mixed_municipal',
        'commercial_packaging'
    )),
    severity VARCHAR(32) DEFAULT 'moderate' CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
    estimated_volume_kg DOUBLE PRECISION DEFAULT 0.0,
    notes TEXT,
    cleanup_status VARCHAR(64) DEFAULT 'pending' CHECK (cleanup_status IN ('pending', 'cleaned_pending_verification', 'verified_clean')),
    cleanup_proof_url TEXT,
    cleaned_at TIMESTAMP WITH TIME ZONE,
    verified_by VARCHAR(150)
);

CREATE INDEX IF NOT EXISTS idx_incidents_location_id ON incidents (location_id);
CREATE INDEX IF NOT EXISTS idx_incidents_reported_at ON incidents (reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents (category);

-- 4. AI Image Analysis Logs
CREATE TABLE IF NOT EXISTS ai_analyses (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE CASCADE UNIQUE,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_used VARCHAR(100) DEFAULT 'gemini-3.8-flash',
    is_demo_fallback BOOLEAN DEFAULT FALSE,
    visible_categories JSONB NOT NULL,
    approx_severity VARCHAR(32),
    drain_risk VARCHAR(64),
    detected_obstruction BOOLEAN DEFAULT FALSE,
    drain_observation TEXT,
    flood_vulnerability VARCHAR(32) DEFAULT 'low',
    environmental_context JSONB,
    image_limitations JSONB,
    raw_visual_observations TEXT,
    distinction_disclaimer TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_analyses_incident_id ON ai_analyses (incident_id);

-- 5. Root Cause Hypotheses Table
CREATE TABLE IF NOT EXISTS hypotheses (
    id VARCHAR(64) PRIMARY KEY,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    confidence_score INTEGER DEFAULT 75 CHECK (confidence_score BETWEEN 0 AND 100),
    uncertainty_level VARCHAR(32) DEFAULT 'medium' CHECK (uncertainty_level IN ('low', 'medium', 'high')),
    supporting_evidence JSONB NOT NULL,
    missing_information JSONB NOT NULL,
    verification_step TEXT NOT NULL,
    suggested_prevention_action TEXT NOT NULL,
    is_ai_generated BOOLEAN DEFAULT TRUE,
    priority VARCHAR(32) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hypotheses_location_id ON hypotheses (location_id);
CREATE INDEX IF NOT EXISTS idx_hypotheses_priority ON hypotheses (priority);

-- 6. Prevention Tasks / Work Orders Table
CREATE TABLE IF NOT EXISTS prevention_tasks (
    id VARCHAR(64) PRIMARY KEY,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to VARCHAR(150) NOT NULL,
    assigned_role VARCHAR(100),
    department VARCHAR(100) NOT NULL,
    priority VARCHAR(32) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(64) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'under_review', 'resolved')),
    due_date DATE,
    prevention_type VARCHAR(64) NOT NULL,
    verification_notes TEXT,
    after_cleanup_evidence_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_prevention_tasks_location_id ON prevention_tasks (location_id);
CREATE INDEX IF NOT EXISTS idx_prevention_tasks_status ON prevention_tasks (status);

-- 7. Supabase Row Level Security (RLS) Enablement
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE prevention_tasks ENABLE ROW LEVEL SECURITY;

-- Read policy for public civic transparency
CREATE POLICY "Public Read Access" ON locations FOR SELECT USING (true);
CREATE POLICY "Public Read Incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Public Read Hypotheses" ON hypotheses FOR SELECT USING (true);
CREATE POLICY "Public Read Tasks" ON prevention_tasks FOR SELECT USING (true);

-- Insert policy for authenticated or citizen submissions
CREATE POLICY "Allow Insert Incidents" ON incidents FOR INSERT WITH CHECK (true);
