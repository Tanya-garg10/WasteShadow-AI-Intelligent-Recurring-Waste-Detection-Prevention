import { Incident, HotspotLocation, RecurrenceClassification, RecurrenceMetricBreakdown } from '../types';

/**
 * Calculates Haversine distance in meters between two geographical coordinates
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Computes the Recurrence Metric Breakdown and Score for a set of incidents at a location.
 * Implements the documented algorithmic formula:
 * Score = Frequency (35%) + Interval Consistency (25%) + Category Persistence (20%) + Post-Cleanup Relapse (20%)
 */
export function computeRecurrenceMetrics(
  incidents: Incident[]
): RecurrenceMetricBreakdown {
  if (incidents.length <= 1) {
    return {
      frequencyScore: incidents.length === 1 ? 12 : 0,
      intervalConsistency: 0,
      categoryPersistence: incidents.length === 1 ? 5 : 0,
      relapseAfterClean: 0,
      totalScore: incidents.length === 1 ? 17 : 0,
      formulaText: 'Score = (Count=1 × 12) + (Consistency=0) + (Category=5) + (Relapse=0) = 17 / 100',
      explanation: 'Single isolated incident recorded. Insufficient historical repetition to classify as recurring.'
    };
  }

  // Sort by date ascending
  const sorted = [...incidents].sort(
    (a, b) => new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
  );

  // 1. Frequency Score (0 to 35 pts)
  // Higher count within shorter overall span gives higher frequency
  const count = sorted.length;
  let frequencyScore = Math.min(35, Math.round(count * 8.5));

  // 2. Interval Consistency (0 to 25 pts)
  const intervalsDays: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prevTime = new Date(sorted[i - 1].reportedAt).getTime();
    const currTime = new Date(sorted[i].reportedAt).getTime();
    const diffDays = Math.max(0.5, (currTime - prevTime) / (1000 * 60 * 60 * 24));
    intervalsDays.push(diffDays);
  }

  const avgInterval =
    intervalsDays.reduce((sum, val) => sum + val, 0) / (intervalsDays.length || 1);

  // Consistency: calculate standard deviation of intervals
  const variance =
    intervalsDays.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) /
    (intervalsDays.length || 1);
  const stdDev = Math.sqrt(variance);
  const cv = avgInterval > 0 ? stdDev / avgInterval : 1; // coefficient of variation

  // If intervals are short (<= 14 days) and consistent (low cv), high score
  let intervalConsistency = 0;
  if (avgInterval <= 10) {
    intervalConsistency = Math.round(25 * Math.max(0.4, 1 - Math.min(0.6, cv * 0.4)));
  } else if (avgInterval <= 20) {
    intervalConsistency = Math.round(18 * Math.max(0.3, 1 - Math.min(0.6, cv * 0.4)));
  } else {
    intervalConsistency = Math.round(10 * Math.max(0.2, 1 - Math.min(0.6, cv * 0.4)));
  }
  intervalConsistency = Math.min(25, Math.max(0, intervalConsistency));

  // 3. Category Persistence (0 to 20 pts)
  // Check if same category dominates
  const categoryCounts: Record<string, number> = {};
  sorted.forEach((inc) => {
    categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
  });
  const maxCategoryCount = Math.max(...Object.values(categoryCounts));
  const categoryRatio = maxCategoryCount / count;
  const categoryPersistence = Math.round(20 * categoryRatio);

  // 4. Post-Cleanup Relapse Penalty (0 to 20 pts)
  // Count how many incidents happened AFTER an incident that was marked cleaned or cleaned_pending_verification
  let relapses = 0;
  let wasPreviouslyCleaned = false;
  for (const inc of sorted) {
    if (wasPreviouslyCleaned) {
      relapses++;
    }
    if (inc.cleanupStatus === 'verified_clean' || inc.cleanupStatus === 'cleaned_pending_verification') {
      wasPreviouslyCleaned = true;
    }
  }
  const relapseAfterClean = Math.min(20, relapses * 10);

  const totalScore = Math.min(
    100,
    Math.max(1, frequencyScore + intervalConsistency + categoryPersistence + relapseAfterClean)
  );

  const formulaText = `Score = Frequency(${frequencyScore}) + IntervalConsistency(${intervalConsistency}) + CategoryPersistence(${categoryPersistence}) + RelapsesAfterClean(${relapseAfterClean}) = ${totalScore} / 100`;

  let explanation = '';
  if (totalScore >= 75) {
    explanation = `High chronic recurrence. Waste returns with rapid cadence (~${avgInterval.toFixed(1)} days), matching previous waste profiles (${Math.round(categoryRatio * 100)}% same waste class). Indicates a structural, unaddressed root cause.`;
  } else if (totalScore >= 45) {
    explanation = `Emerging pattern detected. Recorded ${count} incidents with an average recurrence cycle of ~${avgInterval.toFixed(1)} days. Preventative intervention recommended before it solidifies into a permanent dump point.`;
  } else {
    explanation = `Low recurrence potential. Minor repetition or isolated incidents without sustained interval synchronization.`;
  }

  return {
    frequencyScore,
    intervalConsistency,
    categoryPersistence,
    relapseAfterClean,
    totalScore,
    formulaText,
    explanation
  };
}

/**
 * Classifies a hotspot based on incident history and metrics
 */
export function classifyRecurrence(
  incidents: Incident[]
): RecurrenceClassification {
  if (incidents.length <= 1) {
    return 'one_time';
  }

  const sorted = [...incidents].sort(
    (a, b) => new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
  );

  const totalCount = sorted.length;
  const firstDate = new Date(sorted[0].reportedAt).getTime();
  const lastDate = new Date(sorted[sorted.length - 1].reportedAt).getTime();
  const spanDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);

  if (totalCount >= 3 || (totalCount === 2 && spanDays <= 14)) {
    return 'repeated';
  } else if (totalCount === 2) {
    return 'emerging';
  }

  return 'one_time';
}

/**
 * Finds or links an incident to an existing hotspot based on proximity (< 80m)
 */
export function findMatchingHotspot(
  lat: number,
  lng: number,
  existingHotspots: HotspotLocation[],
  thresholdMeters = 80
): HotspotLocation | null {
  let closest: HotspotLocation | null = null;
  let minDistance = Infinity;

  for (const hotspot of existingHotspots) {
    const dist = calculateDistanceMeters(
      lat,
      lng,
      hotspot.coordinates.lat,
      hotspot.coordinates.lng
    );
    if (dist <= thresholdMeters && dist < minDistance) {
      minDistance = dist;
      closest = hotspot;
    }
  }

  return closest;
}
