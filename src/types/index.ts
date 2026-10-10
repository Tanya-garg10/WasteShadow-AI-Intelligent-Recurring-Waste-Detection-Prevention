export type RecurrenceClassification = 'one_time' | 'emerging' | 'repeated';

export type WasteCategory =
  | 'organic_market'
  | 'single_use_plastics'
  | 'construction_debris'
  | 'drain_sludge_waste'
  | 'mixed_municipal'
  | 'commercial_packaging';

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export type DrainBlockageRisk = 'none' | 'partial' | 'severe' | 'critical_flood_hazard';

export type InvestigationStatus = 'open' | 'investigating' | 'action_planned' | 'verified_clean';

export type TaskStatus = 'open' | 'in_progress' | 'under_review' | 'resolved';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface HotspotLocation {
  id: string;
  name: string;
  wardNumber: string;
  zone: string;
  city: string;
  coordinates: LocationCoordinates;
  address: string;
  landmark: string;
  classification: RecurrenceClassification;
  recurrenceScore: number; // 0 - 100
  firstReportedAt: string;
  lastReportedAt: string;
  totalIncidents: number;
  resolvedIncidents: number;
  averageIntervalDays: number;
  primaryCategory: WasteCategory;
  drainRisk: DrainBlockageRisk;
  investigationStatus: InvestigationStatus;
  description: string;
  imageUrl?: string;
}

export interface WasteDetection {
  category: WasteCategory;
  label: string;
  confidence: number; // 0 - 1
  approxPercentage: number;
  description: string;
}

export interface AIAnalysisResult {
  id: string;
  incidentId: string;
  analyzedAt: string;
  modelUsed: string;
  isDemoFallback: boolean;
  visibleCategories: WasteDetection[];
  approxSeverity: SeverityLevel;
  drainBlockage: {
    risk: DrainBlockageRisk;
    detectedObstruction: boolean;
    drainProximityMeters?: number;
    visualObservation: string;
    floodVulnerability: 'low' | 'medium' | 'high' | 'imminent';
  };
  environmentalContext: {
    surroundingType: 'market_corridor' | 'stormwater_drain' | 'residential_corner' | 'construction_verge' | 'commercial_alley';
    trafficCondition: 'pedestrian_heavy' | 'vehicular_corridor' | 'quiet_cul_de_sac';
    visibleBinsNearby: boolean;
    nightDumpingIndicator: boolean;
  };
  imageLimitations: string[];
  rawVisualObservations: string;
  distinctionDisclaimer: string;
}

export interface Incident {
  id: string;
  locationId: string;
  locationName: string;
  coordinates: LocationCoordinates;
  reportedAt: string;
  reporterName: string;
  reporterRole: 'citizen' | 'ward_inspector' | 'sanitation_supervisor' | 'ai_camera';
  photoUrl: string;
  category: WasteCategory;
  severity: SeverityLevel;
  estimatedVolumeKg?: number;
  notes: string;
  cleanupStatus: 'pending' | 'cleaned_pending_verification' | 'verified_clean';
  cleanupProofUrl?: string;
  cleanedAt?: string;
  verifiedBy?: string;
  analysis?: AIAnalysisResult;
}

export interface RootCauseHypothesis {
  id: string;
  locationId: string;
  title: string;
  category: 'collection_frequency' | 'commercial_dumping' | 'infrastructure_gap' | 'drain_culvert_litter' | 'behavioral_segregation';
  confidenceScore: number; // 0 - 100
  uncertaintyLevel: 'low' | 'medium' | 'high';
  supportingEvidence: string[];
  missingInformation: string[];
  verificationStep: string;
  suggestedPreventionAction: string;
  isAiGenerated: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface PreventionTask {
  id: string;
  locationId: string;
  locationName: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedRole: string;
  department: 'Solid Waste Management' | 'Stormwater Drainage' | 'Health & Sanitation' | 'Civic Enforcement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  preventionType: 'bin_deployment' | 'schedule_shift' | 'drain_grating' | 'cctv_enforcement' | 'vendor_compacting' | 'community_drive';
  verificationNotes?: string;
  afterCleanupEvidenceUrl?: string;
  verifiedAt?: string;
}

export interface RecurrenceMetricBreakdown {
  frequencyScore: number;      // 0-35
  intervalConsistency: number; // 0-25
  categoryPersistence: number; // 0-20
  relapseAfterClean: number;   // 0-20
  totalScore: number;          // 0-100
  formulaText: string;
  explanation: string;
}
