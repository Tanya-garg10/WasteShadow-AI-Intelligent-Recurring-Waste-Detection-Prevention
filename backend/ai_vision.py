import os
import json
import base64
from typing import Dict, Any, Optional

def analyze_photo_with_vision(
    image_base64: str,
    location_name: str = "Urban Corridor",
    notes: Optional[str] = "",
    category_hint: Optional[str] = None
) -> Dict[str, Any]:
    """
    Performs AI Vision Analysis using Featherless API (OpenAI-compatible),
    or transparent demo fallback if no API key is set.
    """
    api_key = os.getenv("FEATHERLESS_API_KEY")

    if api_key and api_key != "YOUR_FEATHERLESS_API_KEY" and len(api_key) > 10:
        try:
            from openai import OpenAI

            client = OpenAI(
                api_key=api_key,
                base_url="https://api.featherless.ai/v1"
            )

            # Strip data URI prefix if present
            clean_base64 = image_base64.split(",")[-1]

            prompt = f"""You are the computer vision core of WasteShadow AI, analyzing urban waste in India.
Location: {location_name}
User Notes: {notes}
Category: {category_hint}

Report only factual visual observations in pure JSON:
{{
  "visible_categories": [
    {{ "category": "drain_sludge_waste", "label": "Culvert Sludge & Plastics", "confidence": 0.95, "approx_percentage": 70, "description": "Plastic film choking culvert" }}
  ],
  "approx_severity": "high",
  "drain_risk": "critical_flood_hazard",
  "detected_obstruction": true,
  "drain_observation": "Culvert entrance 85% obstructed",
  "flood_vulnerability": "imminent",
  "environmental_context": {{
    "surrounding_type": "stormwater_drain",
    "traffic_condition": "vehicular_corridor",
    "night_dumping_indicator": true
  }},
  "image_limitations": ["Ambient light check"],
  "raw_visual_observations": "Visible plastic pile on storm drain."
}}"""

            response = client.chat.completions.create(
                model=os.getenv("FEATHERLESS_MODEL", "google/gemma-3-27b-it"),
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{clean_base64}"
                                }
                            }
                        ]
                    }
                ]
            )

            text = response.choices[0].message.content or ""
            start = text.find("{")
            end = text.rfind("}") + 1
            if start >= 0 and end > start:
                parsed = json.loads(text[start:end])
                parsed["model_used"] = os.getenv("FEATHERLESS_MODEL", "google/gemma-3-27b-it") + " (via Featherless)"
                parsed["is_demo_fallback"] = False
                parsed["distinction_disclaimer"] = (
                    "Visual observation identifies visible material characteristics. "
                    "Ground-truth causes require historical municipal correlation."
                )
                return parsed
        except Exception as e:
            print(f"Featherless API invocation failed, falling back to demo engine: {e}")

    # Return transparent synthetic demo fallback
    return generate_demo_fallback(location_name, notes, category_hint)

def generate_demo_fallback(
    location_name: str,
    notes: Optional[str] = "",
    category_hint: Optional[str] = None
) -> Dict[str, Any]:
    is_drain = (category_hint == "drain_sludge_waste" or
                "drain" in (notes or "").lower() or
                "drain" in location_name.lower() or
                "culvert" in location_name.lower())

    is_market = (category_hint == "organic_market" or
                 "market" in (notes or "").lower() or
                 "market" in location_name.lower())

    if is_drain:
        return {
            "model_used": "Demo Fallback Engine (Transparent Synthetic Simulation)",
            "is_demo_fallback": True,
            "visible_categories": [
                {
                    "category": "drain_sludge_waste",
                    "label": "Culvert Sludge & Plastic Film",
                    "confidence": 0.96,
                    "approx_percentage": 70,
                    "description": "Compacted polymers and black silt choking stormwater culvert aperture."
                },
                {
                    "category": "single_use_plastics",
                    "label": "Floating Packaging Debris",
                    "confidence": 0.92,
                    "approx_percentage": 30,
                    "description": "Consumer takeaway containers trapped against intake screen."
                }
            ],
            "approx_severity": "critical",
            "drain_risk": "critical_flood_hazard",
            "detected_obstruction": True,
            "drain_observation": "Direct physical occlusion of stormwater culvert grill (> 75% restricted).",
            "flood_vulnerability": "imminent",
            "environmental_context": {
                "surrounding_type": "stormwater_drain",
                "traffic_condition": "vehicular_corridor",
                "night_dumping_indicator": True
            },
            "image_limitations": ["Simulated optical benchmark: Clear daylight inspection."],
            "raw_visual_observations": "Primary storm runoff culvert blocked with non-biodegradable debris and silt.",
            "distinction_disclaimer": "VISUAL OBSERVATION vs CAUSE: Visible surface waste only. Recurrence is determined via spatial timestamps."
        }
    elif is_market:
        return {
            "model_used": "Demo Fallback Engine (Transparent Synthetic Simulation)",
            "is_demo_fallback": True,
            "visible_categories": [
                {
                    "category": "organic_market",
                    "label": "Perishable Vegetable Biomass",
                    "confidence": 0.97,
                    "approx_percentage": 80,
                    "description": "Rotting produce and discarded crates from early morning unloading."
                },
                {
                    "category": "commercial_packaging",
                    "label": "Broken Wooden Crates & Sacks",
                    "confidence": 0.88,
                    "approx_percentage": 20,
                    "description": "Woven packaging residue along roadside shoulder."
                }
            ],
            "approx_severity": "high",
            "drain_risk": "partial",
            "detected_obstruction": True,
            "drain_observation": "Roadside gutter partially covered by organic leafy sludge.",
            "flood_vulnerability": "medium",
            "environmental_context": {
                "surrounding_type": "market_corridor",
                "traffic_condition": "vehicular_corridor",
                "night_dumping_indicator": True
            },
            "image_limitations": ["Simulated benchmark: High confidence organic texture match."],
            "raw_visual_observations": "Large pile of decomposing wholesale greens spilled across delivery lane.",
            "distinction_disclaimer": "VISUAL OBSERVATION vs CAUSE: Commercial produce detected. Schedule audit required."
        }
    else:
        return {
            "model_used": "Demo Fallback Engine (Transparent Synthetic Simulation)",
            "is_demo_fallback": True,
            "visible_categories": [
                {
                    "category": "mixed_municipal",
                    "label": "Domestic Paper & Plastics",
                    "confidence": 0.91,
                    "approx_percentage": 65,
                    "description": "Dry recyclable household packaging."
                },
                {
                    "category": "single_use_plastics",
                    "label": "Polythene Wrappers",
                    "confidence": 0.87,
                    "approx_percentage": 35,
                    "description": "Scattered carrier bags on sidewalk."
                }
            ],
            "approx_severity": "low",
            "drain_risk": "none",
            "detected_obstruction": False,
            "drain_observation": "No stormwater drainage inlet within 30 meters of deposit.",
            "flood_vulnerability": "low",
            "environmental_context": {
                "surrounding_type": "residential_corner",
                "traffic_condition": "pedestrian_heavy",
                "night_dumping_indicator": False
            },
            "image_limitations": ["Simulated benchmark: Footpath paving clearly visible."],
            "raw_visual_observations": "Isolated festive dry waste mound beside boundary curb.",
            "distinction_disclaimer": "Non-recurring domestic overflow verified."
        }
