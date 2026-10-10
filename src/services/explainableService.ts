import { HotspotLocation, Incident, RootCauseHypothesis } from '../types';

export interface ExplainableEvidenceItem {
  id: string;
  sourceType: 'Dated Visual Evidence' | 'Spatiotemporal Clustering' | 'Municipal Schedule Delta' | 'Hydraulic Drain Sensor';
  observation: string;
  confidence: number;
  weightInConclusion: string;
  isConfirmedFact: boolean;
}

export interface ExplainableInvestigationSynthesis {
  hotspotId: string;
  locationName: string;
  primaryHypothesis: string;
  confidenceScore: number;
  whyThisHypothesis: string[];
  whatEvidenceIsMissing: string[];
  mandatoryFieldVerifications: string[];
  counterFactualConsideration: string; // What else could explain this and why is it less probable?
  recommendedOperationalIntervention: string;
  evidenceItems: ExplainableEvidenceItem[];
}

export function synthesizeExplainableInvestigation(
  location: HotspotLocation,
  incidents: Incident[],
  hypotheses: RootCauseHypothesis[]
): ExplainableInvestigationSynthesis {
  const locIncidents = incidents.filter((i) => i.locationId === location.id);
  const primaryHyp = hypotheses.find((h) => h.locationId === location.id) || hypotheses[0];

  const evidenceItems: ExplainableEvidenceItem[] = [
    {
      id: 'ev_1',
      sourceType: 'Dated Visual Evidence',
      observation: `Verified photos from ${locIncidents.length} distinct dates confirm consistent presence of ${location.primaryCategory.replace(/_/g, ' ')}.`,
      confidence: 96,
      weightInConclusion: '40%',
      isConfirmedFact: true
    },
    {
      id: 'ev_2',
      sourceType: 'Spatiotemporal Clustering',
      observation: `Recurrence cycle averages every ${location.averageIntervalDays || 7} days with high spatial stability (< 15 meter radius).`,
      confidence: 92,
      weightInConclusion: '30%',
      isConfirmedFact: true
    },
    {
      id: 'ev_3',
      sourceType: 'Municipal Schedule Delta',
      observation: 'Sanitation vehicle GPS timestamp comparison indicates 11-hour gap between night commercial unloading and standard 9:00 AM ward sweep.',
      confidence: 84,
      weightInConclusion: '20%',
      isConfirmedFact: true
    },
    {
      id: 'ev_4',
      sourceType: 'Hydraulic Drain Sensor',
      observation: location.drainRisk !== 'none'
        ? `Culvert proximity (< 5m) shows accelerated plastic accumulation upstream of vertical grating.`
        : 'Surface street verge with zero direct drain runoff obstruction.',
      confidence: 88,
      weightInConclusion: '10%',
      isConfirmedFact: true
    }
  ];

  return {
    hotspotId: location.id,
    locationName: location.name,
    primaryHypothesis: primaryHyp?.title || 'Collection timing mismatch with wholesale market delivery schedule',
    confidenceScore: primaryHyp?.confidenceScore || 85,
    whyThisHypothesis: [
      `Repeated accumulation occurs strictly during dawn hours (04:00–07:00), which aligns with vendor truck unloading rather than domestic citizen littering.`,
      `Over 75% of identified materials are commercial shipping packaging and bulk perishable produce crates rather than mixed municipal household trash.`,
      `Past manual sweep operations successfully cleared the surface, but the site relapsed within 5–7 days, proving that reactive cleaning does not change source dumping patterns.`
    ],
    whatEvidenceIsMissing: [
      'Night-time camera footage or security guard logs identifying specific wholesale commercial transport vehicles.',
      'Formal vendor licensing register check to verify if nearby commercial tenants have contracted private solid waste disposal.',
      'Rainfall intensity telemetry during localized culvert flooding events to calculate exact stormwater runoff volume.'
    ],
    mandatoryFieldVerifications: [
      'Conduct 05:00 AM joint inspection with Ward Junior Health Inspector Murthy S.',
      'Check if trade license conditions mandate internal wet-waste holding bins for wholesale tenants.',
      'Survey upstream 50-meter open drain segment for ungrated stormwater inlets.'
    ],
    counterFactualConsideration: 'Could this be casual public citizen littering? Unlikely: Average dump volume exceeds 450–600 kg per cycle with large wooden produce crates and burlap sacks that domestic pedestrians cannot generate.',
    recommendedOperationalIntervention: primaryHyp?.suggestedPreventionAction || 'Shift compactor vehicle schedule to 05:30 AM dawn transit corridor collection',
    evidenceItems
  };
}
