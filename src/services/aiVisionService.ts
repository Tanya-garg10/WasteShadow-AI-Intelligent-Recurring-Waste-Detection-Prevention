import { GoogleGenAI } from '@google/genai';
import { AIAnalysisResult, WasteCategory, SeverityLevel, DrainBlockageRisk } from '../types';

/**
 * AI Vision Analysis Service
 * Uses Gemini 3.8 Flash Vision when an API key is available,
 * or gracefully falls back to a transparent, clearly labelled simulated vision engine.
 */

export async function analyzeIncidentPhoto(params: {
  imageBase64: string;
  categoryHint?: WasteCategory;
  locationName: string;
  notes?: string;
  userApiKey?: string;
}): Promise<AIAnalysisResult> {
  const { imageBase64, categoryHint, locationName, notes, userApiKey } = params;

  // Check for API key (from runtime env or optional user override)
  const apiKey = userApiKey || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
    try {
      return await callGeminiVision(apiKey, imageBase64, locationName, notes, categoryHint);
    } catch (err) {
      console.warn('Gemini API call failed or encountered rate limit. Falling back to transparent demo engine:', err);
      return generateSimulatedAnalysis(categoryHint, locationName, notes, true);
    }
  }

  // Transparent, clearly marked demo fallback mode
  return generateSimulatedAnalysis(categoryHint, locationName, notes, false);
}

async function callGeminiVision(
  apiKey: string,
  imageBase64: string,
  locationName: string,
  notes?: string,
  categoryHint?: WasteCategory
): Promise<AIAnalysisResult> {
  const ai = new GoogleGenAI({ apiKey });

  // Clean base64 string
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const prompt = `You are the specialized computer vision core of WasteShadow AI, an urban civic-tech platform for India.
Analyze this urban waste incident photo taken at: "${locationName}".
User description: "${notes || 'No notes provided'}".
Category hint: "${categoryHint || 'unspecified'}".

Your job is strictly to report factual visual observations (do not make ungrounded assumptions).
Respond in pure JSON matching this exact structure:
{
  "visibleCategories": [
    { "category": "organic_market | single_use_plastics | construction_debris | drain_sludge_waste | mixed_municipal | commercial_packaging", "label": "Short name", "confidence": 0.95, "approxPercentage": 70, "description": "Visual details" }
  ],
  "approxSeverity": "low | moderate | high | critical",
  "drainBlockage": {
    "risk": "none | partial | severe | critical_flood_hazard",
    "detectedObstruction": true,
    "drainProximityMeters": 0,
    "visualObservation": "Exact description of any drain, culvert, grate or water channel visible",
    "floodVulnerability": "low | medium | high | imminent"
  },
  "environmentalContext": {
    "surroundingType": "market_corridor | stormwater_drain | residential_corner | construction_verge | commercial_alley",
    "trafficCondition": "pedestrian_heavy | vehicular_corridor | quiet_cul_de_sac",
    "visibleBinsNearby": false,
    "nightDumpingIndicator": false
  },
  "imageLimitations": ["List lighting, camera angle, occlusion or resolution caveats"],
  "rawVisualObservations": "2-3 sentences of objective physical visual description without speculative conclusions"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg'
            }
          }
        ]
      }
    ]
  });

  const text = response.text || '';
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON response from Gemini Vision');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    id: `ai_live_${Date.now()}`,
    incidentId: `inc_${Date.now()}`,
    analyzedAt: new Date().toISOString(),
    modelUsed: 'gemini-3.8-flash (Live Multimodal)',
    isDemoFallback: false,
    visibleCategories: parsed.visibleCategories || [],
    approxSeverity: parsed.approxSeverity || 'moderate',
    drainBlockage: parsed.drainBlockage || {
      risk: 'none',
      detectedObstruction: false,
      drainProximityMeters: 25,
      visualObservation: 'No stormwater drain inlets detected in frame.',
      floodVulnerability: 'low'
    },
    environmentalContext: parsed.environmentalContext || {
      surroundingType: 'residential_corner',
      trafficCondition: 'pedestrian_heavy',
      visibleBinsNearby: false,
      nightDumpingIndicator: false
    },
    imageLimitations: parsed.imageLimitations || ['Standard smartphone resolution'],
    rawVisualObservations: parsed.rawVisualObservations || 'Visible refuse cluster recorded.',
    distinctionDisclaimer: 'Visual observation identifies visible material characteristics. Ground-truth causes require historical municipal correlation.'
  };
}

/**
 * Transparent, realistic simulated analysis fallback for demonstration and offline scenarios
 */
export function generateSimulatedAnalysis(
  categoryHint?: WasteCategory,
  locationName = 'Urban Location',
  notes = '',
  wasFallbackAfterError = false
): AIAnalysisResult {
  const isDrainRelated =
    categoryHint === 'drain_sludge_waste' ||
    notes.toLowerCase().includes('drain') ||
    locationName.toLowerCase().includes('drain') ||
    locationName.toLowerCase().includes('culvert') ||
    locationName.toLowerCase().includes('koramangala');

  const isMarketRelated =
    categoryHint === 'organic_market' ||
    notes.toLowerCase().includes('market') ||
    locationName.toLowerCase().includes('market') ||
    notes.toLowerCase().includes('vegetable');

  const isConstruction =
    categoryHint === 'construction_debris' ||
    notes.toLowerCase().includes('debris') ||
    notes.toLowerCase().includes('cement');

  let visibleCategories = [];
  let severity: SeverityLevel = 'moderate';
  let drainRisk: DrainBlockageRisk = 'none';
  let drainObservation = 'No active water drain inlet visible within 20m of debris centroid.';
  let floodVuln: 'low' | 'medium' | 'high' | 'imminent' = 'low';
  let surroundingType: any = 'residential_corner';

  if (isDrainRelated) {
    severity = 'critical';
    drainRisk = 'critical_flood_hazard';
    drainObservation = 'Direct obstruction of stormwater culvert grill. Visible plastic bags and silt occluding intake aperture by > 75%.';
    floodVuln = 'imminent';
    surroundingType = 'stormwater_drain';
    visibleCategories = [
      {
        category: 'drain_sludge_waste' as WasteCategory,
        label: 'Culvert Grate Plastic & Sludge Occlusion',
        confidence: 0.96,
        approxPercentage: 65,
        description: 'Compacted single-use plastic film, thermocol packaging, and black organic silt choking culvert aperture.'
      },
      {
        category: 'single_use_plastics' as WasteCategory,
        label: 'Floating PET Bottles & Food Wrappers',
        confidence: 0.92,
        approxPercentage: 35,
        description: 'Lightweight packaging accumulated against intake screen from upstream runoff.'
      }
    ];
  } else if (isMarketRelated) {
    severity = 'high';
    drainRisk = 'partial';
    drainObservation = 'Roadside gutter drain channel adjacent to curb partially covered by discarded vegetable biomass.';
    floodVuln = 'medium';
    surroundingType = 'market_corridor';
    visibleCategories = [
      {
        category: 'organic_market' as WasteCategory,
        label: 'Perishable Produce & Leafy Biomass',
        confidence: 0.97,
        approxPercentage: 75,
        description: 'Discarded vegetable trimmings, crushed produce, and banana stems from market unloading.'
      },
      {
        category: 'commercial_packaging' as WasteCategory,
        label: 'Corrugated Crates & Synthetic Gunny Sacks',
        confidence: 0.89,
        approxPercentage: 25,
        description: 'Torn packaging materials discarded along pavement shoulder.'
      }
    ];
  } else if (isConstruction) {
    severity = 'moderate';
    drainRisk = 'none';
    surroundingType = 'construction_verge';
    visibleCategories = [
      {
        category: 'construction_debris' as WasteCategory,
        label: 'C&D Concrete Rubble & Tile Slabs',
        confidence: 0.94,
        approxPercentage: 80,
        description: 'Aggregates, broken red clay bricks, and plaster residue.'
      },
      {
        category: 'mixed_municipal' as WasteCategory,
        label: 'Polymer Cement Packaging Sacks',
        confidence: 0.88,
        approxPercentage: 20,
        description: 'Woven HDPE empty cement sacks discarded on roadside curb.'
      }
    ];
  } else {
    severity = 'moderate';
    visibleCategories = [
      {
        category: 'single_use_plastics' as WasteCategory,
        label: 'Consumer Plastics & Carrier Bags',
        confidence: 0.91,
        approxPercentage: 60,
        description: 'Low-density polyethylene grocery bags, FMCG multilayer sachets.'
      },
      {
        category: 'mixed_municipal' as WasteCategory,
        label: 'Domestic Paper & Mixed Dry Residue',
        confidence: 0.86,
        approxPercentage: 40,
        description: 'Cardboard shreds and household dry recyclables.'
      }
    ];
  }

  return {
    id: `ai_demo_${Date.now()}`,
    incidentId: `inc_${Date.now()}`,
    analyzedAt: new Date().toISOString(),
    modelUsed: wasFallbackAfterError
      ? 'Demo Fallback Engine (API Timeout/Rate-limit)'
      : 'Demo Fallback Engine (Transparent Synthetic Simulation)',
    isDemoFallback: true,
    visibleCategories,
    approxSeverity: severity,
    drainBlockage: {
      risk: drainRisk,
      detectedObstruction: drainRisk !== 'none',
      drainProximityMeters: isDrainRelated ? 0 : 35,
      visualObservation: drainObservation,
      floodVulnerability: floodVuln
    },
    environmentalContext: {
      surroundingType,
      trafficCondition: isMarketRelated ? 'vehicular_corridor' : 'pedestrian_heavy',
      visibleBinsNearby: false,
      nightDumpingIndicator: isMarketRelated || isDrainRelated
    },
    imageLimitations: [
      'Simulated optical parameters: Ambient urban daylight conditions.',
      'Perspective angle: Ground-level oblique angle (approx. 45 degrees).',
      'Notice: Clearly labelled demo fallback output without live cloud inference costs.'
    ],
    rawVisualObservations: `Surface visual inspection identifies approximately ${visibleCategories[0].approxPercentage}% ${visibleCategories[0].label} clustered in an open public corridor. Pavement shows localized surface staining.`,
    distinctionDisclaimer: 'VISUAL OBSERVATION vs ASSUMPTION: This visual profile reflects visible surface waste only. Recurrence classification and root-cause attribution are calculated separately by combining timestamps, GPS coordinates, and historical municipal schedules.'
  };
}
