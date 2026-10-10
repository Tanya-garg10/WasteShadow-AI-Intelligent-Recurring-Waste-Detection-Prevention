import math
from typing import List, Dict, Any, Tuple
from datetime import datetime

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates Haversine distance in meters between two coordinates."""
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def calculate_recurrence_score(incidents: List[Any]) -> Dict[str, Any]:
    """
    Computes documented mathematical recurrence metrics:
    Score = Frequency (35%) + Interval Consistency (25%) + Category Persistence (20%) + Relapse After Cleanup (20%)
    """
    count = len(incidents)
    if count <= 1:
        return {
            "total_score": 18 if count == 1 else 0,
            "classification": "one_time",
            "frequency_score": 12 if count == 1 else 0,
            "interval_consistency": 0,
            "category_persistence": 6 if count == 1 else 0,
            "relapse_score": 0,
            "average_interval_days": 0.0,
            "explanation": "Isolated single occurrence recorded. Insufficient historical repetition to classify as recurring."
        }

    # Sort incidents chronologically
    sorted_incidents = sorted(incidents, key=lambda x: getattr(x, "reported_at", datetime.utcnow()))

    # 1. Frequency Score (0 to 35 pts)
    frequency_score = min(35, round(count * 8.5))

    # 2. Interval Consistency (0 to 25 pts)
    intervals = []
    for i in range(1, count):
        t1 = getattr(sorted_incidents[i - 1], "reported_at")
        t2 = getattr(sorted_incidents[i], "reported_at")
        if isinstance(t1, str):
            t1 = datetime.fromisoformat(t1.replace("Z", "+00:00"))
        if isinstance(t2, str):
            t2 = datetime.fromisoformat(t2.replace("Z", "+00:00"))
        diff = max(0.5, (t2 - t1).total_seconds() / 86400.0)
        intervals.append(diff)

    avg_interval = sum(intervals) / len(intervals) if intervals else 0.0

    if avg_interval <= 10.0:
        interval_score = 25
    elif avg_interval <= 20.0:
        interval_score = 18
    else:
        interval_score = 10

    # 3. Category Persistence (0 to 20 pts)
    cat_counts = {}
    for inc in sorted_incidents:
        cat = getattr(inc, "category", "mixed")
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
    max_cat_count = max(cat_counts.values()) if cat_counts else 1
    category_persistence = min(20, round(20 * (max_cat_count / count)))

    # 4. Relapse After Cleanup (0 to 20 pts)
    relapses = 0
    was_cleaned = False
    for inc in sorted_incidents:
        if was_cleaned:
            relapses += 1
        status = getattr(inc, "cleanup_status", "pending")
        if status in ("verified_clean", "cleaned_pending_verification"):
            was_cleaned = True
    relapse_score = min(20, relapses * 10)

    total_score = min(100, max(5, frequency_score + interval_score + category_persistence + relapse_score))

    # Classification
    if count >= 3 or (count == 2 and avg_interval <= 14.0):
        classification = "repeated"
    elif count == 2:
        classification = "emerging"
    else:
        classification = "one_time"

    explanation = (
        f"Multi-factor score evaluated across {count} events: "
        f"Frequency={frequency_score}/35, Cadence={interval_score}/25, "
        f"MaterialPersistence={category_persistence}/20, Relapses={relapse_score}/20."
    )

    return {
        "total_score": total_score,
        "classification": classification,
        "frequency_score": frequency_score,
        "interval_consistency": interval_score,
        "category_persistence": category_persistence,
        "relapse_score": relapse_score,
        "average_interval_days": round(avg_interval, 1),
        "explanation": explanation
    }
