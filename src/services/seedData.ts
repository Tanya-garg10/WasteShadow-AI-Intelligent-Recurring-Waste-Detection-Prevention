import { HotspotLocation, Incident, RootCauseHypothesis, PreventionTask } from '../types';
import { INCIDENT_VISUALS } from './incidentVisuals';

export function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

// 100% visible, guaranteed non-duplicate evidence images
export const SAMPLE_IMAGES = {
  // Location A: One-time cleared incident
  indiranagar_before: INCIDENT_VISUALS.indiranagar_before,
  indiranagar_after: INCIDENT_VISUALS.indiranagar_after,

  // Location B: Market Recurring Hotspot (Distinct visual for each cycle)
  market_incident_1: INCIDENT_VISUALS.market_incident_1,
  market_incident_2: INCIDENT_VISUALS.market_incident_2,
  market_incident_3: INCIDENT_VISUALS.market_incident_3,
  market_incident_4: INCIDENT_VISUALS.market_incident_4,

  // Location C: Drain Culvert Hotspot (Distinct visual for each cycle)
  drain_incident_1: INCIDENT_VISUALS.drain_incident_1,
  drain_incident_2: INCIDENT_VISUALS.drain_incident_2,
  drain_incident_3: INCIDENT_VISUALS.drain_incident_3,
  drain_incident_4: INCIDENT_VISUALS.drain_incident_4,

  // Location D: Shivajinagar
  shivajinagar_1: INCIDENT_VISUALS.shivajinagar_incident_1,
  shivajinagar_2: INCIDENT_VISUALS.shivajinagar_incident_2,

  // Location E: HSR
  hsr_1: INCIDENT_VISUALS.hsr_incident_1,

  // Generic sample photo for upload preview
  sample_dump: INCIDENT_VISUALS.sample_preview
};


export const INITIAL_LOCATIONS: HotspotLocation[] = [
  {
    id: 'loc_a_indiranagar',
    name: 'Indiranagar 12th Main Road (BDA Park Corner)',
    wardNumber: 'Ward 84 (HAL Airport)',
    zone: 'East Zone',
    city: 'Bengaluru',
    coordinates: { lat: 12.9716, lng: 77.6412 },
    address: 'Corner of 12th Main & 4th Cross, Opposite BDA Park, Indiranagar',
    landmark: 'Opposite BDA Park Gate 2',
    classification: 'one_time',
    recurrenceScore: 18,
    firstReportedAt: '2026-10-02T08:30:00Z',
    lastReportedAt: '2026-10-02T08:30:00Z',
    totalIncidents: 1,
    resolvedIncidents: 1,
    averageIntervalDays: 0,
    primaryCategory: 'mixed_municipal',
    drainRisk: 'none',
    investigationStatus: 'verified_clean',
    description: 'Isolated household mixed waste dumped on footpath following weekend festival. Promptly collected by ward compactors and verified clean with no subsequent relapse.',
      imageUrl: INCIDENT_VISUALS.indiranagar_after
  },
  {
    id: 'loc_b_krmarket',
    name: 'KR Flower & Vegetable Market (Gate 4 Transit Corridor)',
    wardNumber: 'Ward 109 (Chickpet)',
    zone: 'South Zone',
    city: 'Bengaluru',
    coordinates: { lat: 12.9634, lng: 77.5753 },
    address: 'Wholesale Lorry Offloading Lane, Gate 4, KR Market Complex',
    landmark: 'Adjacent to Wholesale Onion & Flower Sheds',
    classification: 'repeated',
    recurrenceScore: 89,
    firstReportedAt: '2026-09-14T05:45:00Z',
    lastReportedAt: '2026-10-06T06:10:00Z',
    totalIncidents: 4,
    resolvedIncidents: 1,
    averageIntervalDays: 7.3,
    primaryCategory: 'organic_market',
    drainRisk: 'partial',
    investigationStatus: 'action_planned',
    description: 'Chronic recurring accumulation of perishable organic produce crates and packaging. Waste reappears within 36-48 hours after every manual municipal clearing cycle due to vendor unloading schedule.',
    imageUrl: INCIDENT_VISUALS.market_incident_4
  },
  {
    id: 'loc_c_koramangala',
    name: 'Koramangala 80ft Road Stormwater Drain Culvert',
    wardNumber: 'Ward 151 (Koramangala)',
    zone: 'South-East Zone',
    city: 'Bengaluru',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    address: 'Major Stormwater Drain Outfall at 80ft Road intersection',
    landmark: 'Near Sony World Signal Junction',
    classification: 'repeated',
    recurrenceScore: 95,
    firstReportedAt: '2026-09-18T10:15:00Z',
    lastReportedAt: '2026-10-09T09:40:00Z',
    totalIncidents: 4,
    resolvedIncidents: 0,
    averageIntervalDays: 7.0,
    primaryCategory: 'drain_sludge_waste',
    drainRisk: 'critical_flood_hazard',
    investigationStatus: 'investigating',
    description: 'High-hazard chronic hotspot where dumped single-use plastics and packaging constrict the primary stormwater culvert grate. Poses direct monsoon waterlogging and backflow risk.',
    imageUrl: INCIDENT_VISUALS.drain_incident_4
  },
  {
    id: 'loc_d_shivajinagar',
    name: 'Shivajinagar Bus Terminus Rear Commercial Alley',
    wardNumber: 'Ward 92 (Shivajinagar)',
    zone: 'Central Zone',
    city: 'Bengaluru',
    coordinates: { lat: 12.9856, lng: 77.6057 },
    address: 'Rear access road behind BMTC bus bays and fast food stalls',
    landmark: 'Behind Bus Bay 4 & 5',
    classification: 'emerging',
    recurrenceScore: 62,
    firstReportedAt: '2026-09-24T22:10:00Z',
    lastReportedAt: '2026-10-07T21:45:00Z',
    totalIncidents: 2,
    resolvedIncidents: 0,
    averageIntervalDays: 13.0,
    primaryCategory: 'commercial_packaging',
    drainRisk: 'partial',
    investigationStatus: 'investigating',
    description: 'Emerging pattern of night-time commercial packaging disposal by fast-food kiosks after terminal closing hours.',
    imageUrl: INCIDENT_VISUALS.shivajinagar_incident_2
  },
  {
    id: 'loc_e_hsr_layout',
    name: 'HSR Layout Sector 3 (Vacant Plot Road Verge)',
    wardNumber: 'Ward 174 (HSR Layout)',
    zone: 'Bommanahalli Zone',
    city: 'Bengaluru',
    coordinates: { lat: 12.9116, lng: 77.6388 },
    address: '14th Main, Sector 3, Perimeter road along empty boundary wall',
    landmark: 'Plot 418 perimeter wall',
    classification: 'one_time',
    recurrenceScore: 22,
    firstReportedAt: '2026-09-28T14:20:00Z',
    lastReportedAt: '2026-09-28T14:20:00Z',
    totalIncidents: 1,
    resolvedIncidents: 1,
    averageIntervalDays: 0,
    primaryCategory: 'construction_debris',
    drainRisk: 'none',
    investigationStatus: 'verified_clean',
    description: 'One-time unauthorized unloading of tile fragments and plaster sacks. Property owner served notice and site cleared within 48 hours.',
    imageUrl: INCIDENT_VISUALS.hsr_incident_1
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  // Location A: One-time cleaned
  {
    id: 'inc_a_001',
    locationId: 'loc_a_indiranagar',
    locationName: 'Indiranagar 12th Main Road (BDA Park Corner)',
    coordinates: { lat: 12.9716, lng: 77.6412 },
    reportedAt: '2026-10-02T08:30:00Z',
    reporterName: 'Aditi Sharma',
    reporterRole: 'citizen',
    photoUrl: SAMPLE_IMAGES.indiranagar_before,
    category: 'mixed_municipal',
    severity: 'low',
    estimatedVolumeKg: 65,
    notes: 'Festival weekend debris and cartons dumped by roadside near park corner.',
    cleanupStatus: 'verified_clean',
    cleanupProofUrl: SAMPLE_IMAGES.indiranagar_after,
    cleanedAt: '2026-10-03T11:15:00Z',
    verifiedBy: 'SWM Health Inspector Ward 84',
    analysis: {
      id: 'ai_ana_001',
      incidentId: 'inc_a_001',
      analyzedAt: '2026-10-02T08:31:12Z',
      modelUsed: 'gemini-3.8-flash',
      isDemoFallback: false,
      visibleCategories: [
        { category: 'mixed_municipal', label: 'Paper & Cardboard Packaging', confidence: 0.94, approxPercentage: 70, description: 'Dry corrugated boxes and paper decorative wrapping.' },
        { category: 'single_use_plastics', label: 'Carry Bags & Wrappers', confidence: 0.88, approxPercentage: 30, description: 'Scattered lightweight polymer packaging.' }
      ],
      approxSeverity: 'low',
      drainBlockage: {
        risk: 'none',
        detectedObstruction: false,
        drainProximityMeters: 45,
        visualObservation: 'No stormwater drain inlets or culverts visible within immediate 30-meter radius of deposit.',
        floodVulnerability: 'low'
      },
      environmentalContext: {
        surroundingType: 'residential_corner',
        trafficCondition: 'pedestrian_heavy',
        visibleBinsNearby: false,
        nightDumpingIndicator: false
      },
      imageLimitations: ['Direct daylight with mild street tree shadow; clear unobstructed camera angle.'],
      rawVisualObservations: 'Single mound of dry festive waste on clean footpath curb. Footpath paving is intact.',
      distinctionDisclaimer: 'Visual observation identifies dry festive cardboard. Does not imply chronic dumping history.'
    }
  },

  // Location B: Market Repeated Incidents
  {
    id: 'inc_b_001',
    locationId: 'loc_b_krmarket',
    locationName: 'KR Flower & Vegetable Market (Gate 4 Transit Corridor)',
    coordinates: { lat: 12.9634, lng: 77.5753 },
    reportedAt: '2026-09-14T05:45:00Z',
    reporterName: 'K. Ramesh',
    reporterRole: 'sanitation_supervisor',
    photoUrl: SAMPLE_IMAGES.market_incident_1,
    category: 'organic_market',
    severity: 'high',
    estimatedVolumeKg: 450,
    notes: 'Wholesale vegetable discards spilled across asphalt approach lane during 4am delivery.',
    cleanupStatus: 'cleaned_pending_verification',
    cleanedAt: '2026-09-14T14:00:00Z',
    analysis: {
      id: 'ai_ana_b01',
      incidentId: 'inc_b_001',
      analyzedAt: '2026-09-14T05:46:00Z',
      modelUsed: 'gemini-3.8-flash',
      isDemoFallback: false,
      visibleCategories: [
        { category: 'organic_market', label: 'Rotting Produce & Leaves', confidence: 0.97, approxPercentage: 75, description: 'Green leafy discards, squashed tomatoes, and cabbage leaves.' },
        { category: 'commercial_packaging', label: 'Broken Wooden Crates & Gunny Bags', confidence: 0.91, approxPercentage: 25, description: 'Woven synthetic gunny sacks and wooden splinters.' }
      ],
      approxSeverity: 'high',
      drainBlockage: {
        risk: 'partial',
        detectedObstruction: true,
        drainProximityMeters: 4,
        visualObservation: 'Side roadside drain inlet partially blanketed by decaying leafy biomass.',
        floodVulnerability: 'medium'
      },
      environmentalContext: {
        surroundingType: 'market_corridor',
        trafficCondition: 'vehicular_corridor',
        visibleBinsNearby: false,
        nightDumpingIndicator: true
      },
      imageLimitations: ['Low early-morning ambient lighting; mobile camera flash active.'],
      rawVisualObservations: 'Dense organic sprawl across commercial lane. Wet residue visible on pavement.',
      distinctionDisclaimer: 'Visual observation notes commercial organic produce. Root cause requires vendor log audit.'
    }
  },
  {
    id: 'inc_b_002',
    locationId: 'loc_b_krmarket',
    locationName: 'KR Flower & Vegetable Market (Gate 4 Transit Corridor)',
    coordinates: { lat: 12.9634, lng: 77.5753 },
    reportedAt: '2026-09-22T06:15:00Z',
    reporterName: 'Civic Sensor Ward 109',
    reporterRole: 'ai_camera',
    photoUrl: SAMPLE_IMAGES.market_incident_2,
    category: 'organic_market',
    severity: 'high',
    estimatedVolumeKg: 510,
    notes: 'Re-accumulation observed 8 days after cleanup. Identical produce discard pattern.',
    cleanupStatus: 'pending',
    analysis: {
      id: 'ai_ana_b02',
      incidentId: 'inc_b_002',
      analyzedAt: '2026-09-22T06:16:00Z',
      modelUsed: 'gemini-3.8-flash',
      isDemoFallback: false,
      visibleCategories: [
        { category: 'organic_market', label: 'Decomposing Plant Matter', confidence: 0.96, approxPercentage: 80, description: 'Dense cluster of agricultural crop residue.' },
        { category: 'single_use_plastics', label: 'Polythene Packaging Bundles', confidence: 0.89, approxPercentage: 20, description: 'Thin film bags used for bundling produce.' }
      ],
      approxSeverity: 'high',
      drainBlockage: {
        risk: 'partial',
        detectedObstruction: true,
        drainProximityMeters: 3,
        visualObservation: 'Vegetable sludge spilling directly into road gutter.',
        floodVulnerability: 'medium'
      },
      environmentalContext: {
        surroundingType: 'market_corridor',
        trafficCondition: 'vehicular_corridor',
        visibleBinsNearby: false,
        nightDumpingIndicator: true
      },
      imageLimitations: ['Partial shadow from market canopy roof.'],
      rawVisualObservations: 'Persistent repeated deposit at same geographic boundary.',
      distinctionDisclaimer: 'High recurrence pattern detected. Probable offloading infrastructure deficiency.'
    }
  },
  {
    id: 'inc_b_003',
    locationId: 'loc_b_krmarket',
    locationName: 'KR Flower & Vegetable Market (Gate 4 Transit Corridor)',
    coordinates: { lat: 12.9634, lng: 77.5753 },
    reportedAt: '2026-09-29T06:00:00Z',
    reporterName: 'K. Ramesh',
    reporterRole: 'sanitation_supervisor',
    photoUrl: INCIDENT_VISUALS.market_incident_3,
    category: 'organic_market',
    severity: 'high',
    estimatedVolumeKg: 490,
    notes: '3rd consecutive recurrence. Tipper vehicle arrival at 8:30am arrives 3 hours after vendors unload.',
    cleanupStatus: 'pending',
    analysis: {
      id: 'ai_ana_b03',
      incidentId: 'inc_b_003',
      analyzedAt: '2026-09-29T06:01:00Z',
      modelUsed: 'gemini-3.8-flash',
      isDemoFallback: false,
      visibleCategories: [
        { category: 'organic_market', label: 'Organic Wet Waste', confidence: 0.98, approxPercentage: 85, description: 'Rotting vegetable bulk.' }
      ],
      approxSeverity: 'high',
      drainBlockage: {
        risk: 'partial',
        detectedObstruction: true,
        drainProximityMeters: 3,
        visualObservation: 'Runoff liquid pooling along curb curbstone.',
        floodVulnerability: 'medium'
      },
      environmentalContext: {
        surroundingType: 'market_corridor',
        trafficCondition: 'vehicular_corridor',
        visibleBinsNearby: false,
        nightDumpingIndicator: true
      },
      imageLimitations: ['Clear daylight shot.'],
      rawVisualObservations: 'Exact spatial match with incidents from Sept 14 and Sept 22.',
      distinctionDisclaimer: 'Statistical certainty of chronic operational mismatch.'
    }
  },
  {
    id: 'inc_b_004',
    locationId: 'loc_b_krmarket',
    locationName: 'KR Flower & Vegetable Market (Gate 4 Transit Corridor)',
    coordinates: { lat: 12.9634, lng: 77.5753 },
    reportedAt: '2026-10-06T06:10:00Z',
    reporterName: 'SWM Surveillance Drone',
    reporterRole: 'ai_camera',
    photoUrl: INCIDENT_VISUALS.market_incident_4,
    category: 'organic_market',
    severity: 'critical',
    estimatedVolumeKg: 620,
    notes: 'Peak Sunday unload volume. Overflow spills 15 meters along roadway.',
    cleanupStatus: 'pending',
    analysis: {
      id: 'ai_ana_b04',
      incidentId: 'inc_b_004',
      analyzedAt: '2026-10-06T06:11:00Z',
      modelUsed: 'gemini-3.8-flash',
      isDemoFallback: false,
      visibleCategories: [
        { category: 'organic_market', label: 'Perishable Discards', confidence: 0.99, approxPercentage: 80, description: 'Vegetable mass and flower stalks.' },
        { category: 'commercial_packaging', label: 'Styrofoam Crates', confidence: 0.93, approxPercentage: 20, description: 'Broken polystyrene thermal transport containers.' }
      ],
      approxSeverity: 'critical',
      drainBlockage: {
        risk: 'partial',
        detectedObstruction: true,
        drainProximityMeters: 2,
        visualObservation: 'Organic slime impeding curb runoff.',
        floodVulnerability: 'high'
      },
      environmentalContext: {
        surroundingType: 'market_corridor',
        trafficCondition: 'vehicular_corridor',
        visibleBinsNearby: false,
        nightDumpingIndicator: true
      },
      imageLimitations: ['Overhead oblique perspective.'],
      rawVisualObservations: 'Massive organic deposit obstructing pedestrian traffic.',
      distinctionDisclaimer: 'Classified as Repeated Chronic Hotspot by Recurrence Engine.'
    }
  },

  // Location C: Drain Blockage Chronic Hotspot
  {
    id: 'inc_c_001',
    locationId: 'loc_c_koramangala',
    locationName: 'Koramangala 80ft Road Stormwater Drain Culvert',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    reportedAt: '2026-09-18T10:15:00Z',
    reporterName: 'Vikas Nambiar',
    reporterRole: 'citizen',
    photoUrl: SAMPLE_IMAGES.drain_incident_1,
    category: 'single_use_plastics',
    severity: 'high',
    estimatedVolumeKg: 380,
    notes: 'Plastics jammed against vertical grill of 80ft Road stormwater main culvert.',
    cleanupStatus: 'pending',
    analysis: {
      id: 'ai_ana_c01',
      incidentId: 'inc_c_001',
      analyzedAt: '2026-09-18T10:16:30Z',
      modelUsed: 'gemini-3.8-flash',
      isDemoFallback: false,
      visibleCategories: [
        { category: 'single_use_plastics', label: 'PET Bottles & Food Containers', confidence: 0.98, approxPercentage: 65, description: 'Non-biodegradable consumer packaging jammed in grating.' },
        { category: 'drain_sludge_waste', label: 'Trapped Silt & Organic Sludge', confidence: 0.92, approxPercentage: 35, description: 'Anaerobic black silt binding the plastic barrier.' }
      ],
      approxSeverity: 'high',
      drainBlockage: {
        risk: 'severe',
        detectedObstruction: true,
        drainProximityMeters: 0,
        visualObservation: 'Grating aperture obstructed by approximately 60% with impervious plastic layer.',
        floodVulnerability: 'high'
      },
      environmentalContext: {
        surroundingType: 'stormwater_drain',
        trafficCondition: 'vehicular_corridor',
        visibleBinsNearby: false,
        nightDumpingIndicator: true
      },
      imageLimitations: ['Deep culvert aperture; shadow in canal bed compensated by dynamic range.'],
      rawVisualObservations: 'Direct vertical constriction of primary municipal flood drain.',
      distinctionDisclaimer: 'Imminent waterlogging risk detected for adjacent low-lying roads during precipitation.'
    }
  },
  {
    id: 'inc_c_002',
    locationId: 'loc_c_koramangala',
    locationName: 'Koramangala 80ft Road Stormwater Drain Culvert',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    reportedAt: '2026-09-26T11:00:00Z',
    reporterName: 'SWD Engineer Ward 151',
    reporterRole: 'ward_inspector',
    photoUrl: INCIDENT_VISUALS.drain_incident_2,
    category: 'drain_sludge_waste',
    severity: 'high',
    estimatedVolumeKg: 420,
    notes: 'Silt bag dumping reported after midnight. Grating flow reduced by over 70%.',
    cleanupStatus: 'pending',
    analysis: {
      id: 'ai_ana_c02',
      incidentId: 'inc_c_002',
      analyzedAt: '2026-09-26T11:01:00Z',
      modelUsed: 'gemini-3.8-flash',
      isDemoFallback: false,
      visibleCategories: [
        { category: 'drain_sludge_waste', label: 'Excavated Silt Bags', confidence: 0.94, approxPercentage: 55, description: 'Plastic sacks filled with road mud discarded on culvert headwall.' },
        { category: 'single_use_plastics', label: 'Trapped Debris', confidence: 0.93, approxPercentage: 45, description: 'Multi-layer packaging mat.' }
      ],
      approxSeverity: 'high',
      drainBlockage: {
        risk: 'severe',
        detectedObstruction: true,
        drainProximityMeters: 0,
        visualObservation: 'Severe cross-sectional constriction of storm drain entrance.',
        floodVulnerability: 'high'
      },
      environmentalContext: {
        surroundingType: 'stormwater_drain',
        trafficCondition: 'vehicular_corridor',
        visibleBinsNearby: false,
        nightDumpingIndicator: true
      },
      imageLimitations: ['Clear mid-day sunlight.'],
      rawVisualObservations: 'Direct blockage of primary runoff channel.',
      distinctionDisclaimer: 'Direct physical hazard verified.'
    }
  },
  {
    id: 'inc_c_003',
    locationId: 'loc_c_koramangala',
    locationName: 'Koramangala 80ft Road Stormwater Drain Culvert',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    reportedAt: '2026-10-04T16:20:00Z',
    reporterName: 'SWM Patrol Squad',
    reporterRole: 'sanitation_supervisor',
    photoUrl: INCIDENT_VISUALS.drain_incident_3,
    category: 'drain_sludge_waste',
    severity: 'critical',
    estimatedVolumeKg: 530,
    notes: 'Upstream restaurant grease traps and packaging washed into grill. Water stagnating.',
    cleanupStatus: 'pending',
    analysis: {
      id: 'ai_ana_c03',
      incidentId: 'inc_c_004',
      analyzedAt: '2026-10-04T16:22:00Z',
      modelUsed: 'gemini-3.8-flash',
      isDemoFallback: false,
      visibleCategories: [
        { category: 'single_use_plastics', label: 'Commercial Food Packaging', confidence: 0.96, approxPercentage: 60, description: 'Plastic pouches and foil takeaway containers.' },
        { category: 'organic_market', label: 'Kitchen Oil Grease Sludge', confidence: 0.91, approxPercentage: 40, description: 'Hardened grease layer choking waterflow.' }
      ],
      approxSeverity: 'critical',
      drainBlockage: {
        risk: 'critical_flood_hazard',
        detectedObstruction: true,
        drainProximityMeters: 0,
        visualObservation: 'Water stagnant behind 85% occluded trash rack. Overflow into road shoulder beginning.',
        floodVulnerability: 'imminent'
      },
      environmentalContext: {
        surroundingType: 'stormwater_drain',
        trafficCondition: 'vehicular_corridor',
        visibleBinsNearby: false,
        nightDumpingIndicator: true
      },
      imageLimitations: ['Overcast sky before rain.'],
      rawVisualObservations: 'Extreme constriction with standing stagnant water.',
      distinctionDisclaimer: 'Emergency de-silting and automated mechanical trash rack recommended.'
    }
  },
  {
    id: 'inc_c_004',
    locationId: 'loc_c_koramangala',
    locationName: 'Koramangala 80ft Road Stormwater Drain Culvert',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    reportedAt: '2026-10-09T09:40:00Z',
    reporterName: 'Citizen Action Group (CAF)',
    reporterRole: 'citizen',
    photoUrl: INCIDENT_VISUALS.drain_incident_4,
    category: 'drain_sludge_waste',
    severity: 'critical',
    estimatedVolumeKg: 580,
    notes: '4th recurrence in 21 days. Rain forecast today requires immediate mechanized clearing.',
    cleanupStatus: 'pending',
    analysis: {
      id: 'ai_ana_c04',
      incidentId: 'inc_c_004',
      analyzedAt: '2026-10-09T09:41:00Z',
      modelUsed: 'gemini-3.8-flash',
      isDemoFallback: false,
      visibleCategories: [
        { category: 'drain_sludge_waste', label: 'Culvert Trash Barrier', confidence: 0.99, approxPercentage: 70, description: 'Complete choke of culvert cross-section.' },
        { category: 'single_use_plastics', label: 'Bottles & Packaging', confidence: 0.95, approxPercentage: 30, description: 'Floating plastics.' }
      ],
      approxSeverity: 'critical',
      drainBlockage: {
        risk: 'critical_flood_hazard',
        detectedObstruction: true,
        drainProximityMeters: 0,
        visualObservation: 'Complete hydrological damming detected. High flood threat.',
        floodVulnerability: 'imminent'
      },
      environmentalContext: {
        surroundingType: 'stormwater_drain',
        trafficCondition: 'vehicular_corridor',
        visibleBinsNearby: false,
        nightDumpingIndicator: true
      },
      imageLimitations: ['Clear high-resolution inspection photograph.'],
      rawVisualObservations: 'Hydrological choke point identified.',
      distinctionDisclaimer: 'Hypothesis links to upstream commercial food establishments dumping into open feeder storm drains.'
    }
  },

  // Location D: Shivajinagar
  {
    id: 'inc_d_001',
    locationId: 'loc_d_shivajinagar',
    locationName: 'Shivajinagar Bus Terminus Rear Commercial Alley',
    coordinates: { lat: 12.9856, lng: 77.6057 },
    reportedAt: '2026-09-24T22:10:00Z',
    reporterName: 'Depot Guard',
    reporterRole: 'citizen',
    photoUrl: INCIDENT_VISUALS.shivajinagar_incident_1,
    category: 'commercial_packaging',
    severity: 'moderate',
    estimatedVolumeKg: 210,
    notes: 'Stall owners discarding boxes after 10 PM.',
    cleanupStatus: 'pending'
  },
  {
    id: 'inc_d_002',
    locationId: 'loc_d_shivajinagar',
    locationName: 'Shivajinagar Bus Terminus Rear Commercial Alley',
    coordinates: { lat: 12.9856, lng: 77.6057 },
    reportedAt: '2026-10-07T21:45:00Z',
    reporterName: 'SWM Night Squad',
    reporterRole: 'sanitation_supervisor',
    photoUrl: INCIDENT_VISUALS.shivajinagar_incident_2,
    category: 'commercial_packaging',
    severity: 'high',
    estimatedVolumeKg: 310,
    notes: '2nd occurrence in 13 days. Food packaging and pet bottles.',
    cleanupStatus: 'pending'
  },

  // Location E: HSR
  {
    id: 'inc_e_001',
    locationId: 'loc_e_hsr_layout',
    locationName: 'HSR Layout Sector 3 (Vacant Plot Road Verge)',
    coordinates: { lat: 12.9116, lng: 77.6388 },
    reportedAt: '2026-09-28T14:20:00Z',
    reporterName: 'RWA Secretary',
    reporterRole: 'citizen',
    photoUrl: INCIDENT_VISUALS.hsr_incident_1,
    category: 'construction_debris',
    severity: 'low',
    estimatedVolumeKg: 180,
    notes: 'Debris cleared and penalty levied.',
    cleanupStatus: 'verified_clean',
    cleanedAt: '2026-09-30T10:00:00Z',
    verifiedBy: 'Ward 174 SWM Marshal'
  }
];

export const INITIAL_HYPOTHESES: RootCauseHypothesis[] = [
  // Location B: Market
  {
    id: 'hyp_b_01',
    locationId: 'loc_b_krmarket',
    title: 'Mismatch Between Wholesale Delivery Hours (03:00 - 05:00) and Municipal Tipper Arrival (08:30)',
    category: 'collection_frequency',
    confidenceScore: 92,
    uncertaintyLevel: 'low',
    supportingEvidence: [
      'Incidents timestamped consistently between 05:45 and 06:15 IST immediately after interstate supply trucks depart.',
      'Waste composition is 80%+ wholesale-grade fresh perishable produce and bulk packaging (gunny bags, polystyrene), not residential refuse.',
      'SWM GPS vehicle logs confirm first compactor reaches Gate 4 at 08:45 AM, creating a 3.5-hour unserviced accumulation window.',
      'Zero secondary bulk bins exist within 250 meters of Gate 4 unloading dock.'
    ],
    missingInformation: [
      'Exact registry of private transport lorries offloading without contracted private waste clearance.',
      'Weighbridge records of daily green-leaf generation per stall.'
    ],
    verificationStep: 'Conduct a 48-hour continuous time-and-motion survey during 03:00 - 09:00 IST with Ward Health Inspector and Market Committee.',
    suggestedPreventionAction: 'Reschedule a dedicated 4.5-tonne compactor vehicle to arrive at 04:30 AM; position 4 heavy-duty roll-on bins at Gate 4 with mandatory vendor tipping.',
    isAiGenerated: true,
    priority: 'urgent'
  },
  {
    id: 'hyp_b_02',
    locationId: 'loc_b_krmarket',
    title: 'Lack of On-Site Organic Bio-Digester or Organic Composting Facility',
    category: 'infrastructure_gap',
    confidenceScore: 84,
    uncertaintyLevel: 'medium',
    supportingEvidence: [
      'Over 75% of dumped biomass is non-segregated wet organic plant matter that generates foul leachate within 6 hours.',
      'Long-distance transit to remote landfill (Mitaganahalli) causes municipal delays.'
    ],
    missingInformation: [
      'Available ground footprint area inside market perimeter for a 2-tonne decentralized bio-methanation unit.'
    ],
    verificationStep: 'Feasibility check with Solid Waste Management Engineering Cell for installing a decentralized biogas processing digester at Gate 7 yard.',
    suggestedPreventionAction: 'Establish a 2-tonne wet waste decentralized shredder & composter unit within market perimeter, eliminating external transit.',
    isAiGenerated: true,
    priority: 'high'
  },

  // Location C: Drain Blockage
  {
    id: 'hyp_c_01',
    locationId: 'loc_c_koramangala',
    title: 'Upstream Night-Time Commercial Dumping & Missing Heavy Silt-Trap Grating',
    category: 'drain_culvert_litter',
    confidenceScore: 95,
    uncertaintyLevel: 'low',
    supportingEvidence: [
      'Recurrence pattern exhibits plastic packaging accumulation directly at the culvert headwall every 7 days.',
      'Analysis reveals commercial food takeaway containers, beverage bottles, and grease sludge from upstream eatery corridors.',
      'Culvert lacks multi-stage debris screens, allowing full volume to slam against the final culvert opening.',
      'During rain, immediate backflow triggers 40cm waterlogging on adjacent road within 20 minutes.'
    ],
    missingInformation: [
      'CCTV footage of night vehicular movement along upstream storm drain road between 01:00 and 04:00 AM.',
      'Grease-trap compliance records of restaurants on 80ft Road.'
    ],
    verificationStep: 'Deploy night mobile surveillance marshals and inspect trade license grease-trap compliance for restaurants within 500m upstream radius.',
    suggestedPreventionAction: 'Install a 2-stage galvanized trash rack with automated mechanical rake, plus high-definition ANPR CCTV camera to penalize illegal nocturnal dumping.',
    isAiGenerated: true,
    priority: 'urgent'
  },
  {
    id: 'hyp_c_02',
    locationId: 'loc_c_koramangala',
    title: 'Unattended Road Repair Silt Bags Dumped Along Canal Verge by Contractors',
    category: 'commercial_dumping',
    confidenceScore: 78,
    uncertaintyLevel: 'medium',
    supportingEvidence: [
      'Two incident photos depict commercial woven poly bags containing excavated drain silt discarded directly onto the canal shoulder.',
      'Recent telecommunication fiber trenching active on 80ft road corridor.'
    ],
    missingInformation: [
      'Work order contractor registry for underground cabling utility trenching in Ward 151.'
    ],
    verificationStep: 'Issue inquiry to BBMP Road Infrastructure division to identify utility trenching agencies active in September-October 2026.',
    suggestedPreventionAction: 'Enforce mandatory GPS-tracked debris transit permits for utility contractors, with forfeiture of security deposit for roadside dumping.',
    isAiGenerated: true,
    priority: 'high'
  },

  // Location A: One-time
  {
    id: 'hyp_a_01',
    locationId: 'loc_a_indiranagar',
    title: 'Isolated Post-Festival Domestic Overflow (Non-Recurring)',
    category: 'behavioral_segregation',
    confidenceScore: 90,
    uncertaintyLevel: 'low',
    supportingEvidence: [
      'Single incident coinciding with annual community festival weekend.',
      'Cleaned within 27 hours; zero recurrence over 14 consecutive observation days.',
      'Normal morning door-to-door auto-tipper collection operates regularly at 07:15 AM.'
    ],
    missingInformation: ['None; verified clean and stabilized.'],
    verificationStep: 'Periodic sensor check; no active intervention required.',
    suggestedPreventionAction: 'Provide designated temporary festival collection bins during scheduled civic holiday weekends.',
    isAiGenerated: true,
    priority: 'low'
  }
];

export const INITIAL_PREVENTION_TASKS: PreventionTask[] = [
  {
    id: 'task_001',
    locationId: 'loc_c_koramangala',
    locationName: 'Koramangala 80ft Road Stormwater Drain Culvert',
    title: 'Emergency Mechanized Trash Rack & De-silting Operation',
    description: 'Deploy hydraulic excavator to clear 85% occluded plastic barrier before forecast monsoon precipitation. Install 2-stage galvanized safety screen.',
    assignedTo: 'Rajesh G., Executive Engineer',
    assignedRole: 'Stormwater Drain Division',
    department: 'Stormwater Drainage',
    priority: 'critical',
    status: 'in_progress',
    dueDate: '2026-10-12',
    createdAt: '2026-10-09',
    preventionType: 'drain_grating',
    verificationNotes: 'Excavation team dispatched; night surveillance vehicle scheduled.'
  },
  {
    id: 'task_002',
    locationId: 'loc_b_krmarket',
    locationName: 'KR Flower & Vegetable Market (Gate 4 Transit Corridor)',
    title: 'Pre-Dawn 04:30 AM Tipper Schedule Shift & 4 Roll-On Bins',
    description: 'Adjust SWM collection route to station 2 hydraulic compactor tippers at Gate 4 between 04:30 AM and 07:30 AM to capture vegetable stall offloadings.',
    assignedTo: 'Murthy S., Senior Health Inspector',
    assignedRole: 'Ward 109 Sanitation Unit',
    department: 'Solid Waste Management',
    priority: 'high',
    status: 'open',
    dueDate: '2026-10-15',
    createdAt: '2026-10-06',
    preventionType: 'schedule_shift'
  },
  {
    id: 'task_003',
    locationId: 'loc_c_koramangala',
    locationName: 'Koramangala 80ft Road Stormwater Drain Culvert',
    title: 'Upstream Restaurant Grease-Trap & Waste Audit',
    description: 'Inspect 24 commercial dining establishments along 80ft road for oil/sludge separator compliance and contracted dry waste disposal.',
    assignedTo: 'Ananya Rao, Health Officer',
    assignedRole: 'Civic Enforcement Squad',
    department: 'Health & Sanitation',
    priority: 'high',
    status: 'open',
    dueDate: '2026-10-18',
    createdAt: '2026-10-09',
    preventionType: 'cctv_enforcement'
  },
  {
    id: 'task_004',
    locationId: 'loc_a_indiranagar',
    locationName: 'Indiranagar 12th Main Road (BDA Park Corner)',
    title: 'Post-Festival Footpath Debris Clearing & Disinfection',
    description: 'Clear festive waste mound and wash footpath with bleaching powder. Complete photo verification.',
    assignedTo: 'Venkatesh P., Ward Supervisor',
    assignedRole: 'Ward 84 Sanitation Unit',
    department: 'Solid Waste Management',
    priority: 'low',
    status: 'resolved',
    dueDate: '2026-10-03',
    createdAt: '2026-10-02',
    preventionType: 'community_drive',
    verificationNotes: 'Footpath swept clean and sprayed with lime disinfectant. Verified by Health Inspector with timestamped geo-photo.',
    afterCleanupEvidenceUrl: SAMPLE_IMAGES.indiranagar_after,
    verifiedAt: '2026-10-03T11:15:00Z'
  }
];
