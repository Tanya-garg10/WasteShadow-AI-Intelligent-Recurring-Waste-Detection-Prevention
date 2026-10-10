export interface WhatIfScenarioInput {
  collectionFrequencyMultiplier: number; // 1 = Baseline, 2 = 2x daily, 3 = 3x daily
  additionalRollOnBins: number; // 0 to 4 bins (2.5m³ each)
  mechanicalGratingInstalled: boolean; // For culverts
  cctvEnforcementActive: boolean; // Civic camera monitoring
  commercialSourceSegregationMandate: boolean; // Mandatory vendor bins
}

export interface SimulationResult {
  scenarioName: string;
  projectedRecurrenceDropPercent: number; // e.g. 74%
  projectedRelapseDaysExtended: number; // e.g. from 5 days to 28 days
  estimatedMonthlyCostInr: number;
  monthlyPreventedWasteTons: number;
  riskReductionGrade: 'Slight' | 'Significant' | 'Transformative';
  culvertChokeRiskReductionPercent: number;
  breakdown: {
    intervention: string;
    marginalImpactPercent: number;
    operationalFeasibility: 'High' | 'Medium' | 'Complex';
    monthlyCostInr: number;
  }[];
  comparativeVerdict: string;
}

export function simulateInterventionScenario(
  locationId: string,
  baselineRecurrenceScore: number,
  input: WhatIfScenarioInput
): SimulationResult {
  let impact = 0;
  let cost = 0;
  let preventedTons = 0;
  const breakdown: SimulationResult['breakdown'] = [];

  // 1. Collection Frequency Multiplier
  if (input.collectionFrequencyMultiplier > 1) {
    const extraRounds = input.collectionFrequencyMultiplier - 1;
    const impactVal = extraRounds === 1 ? 28 : 42;
    const roundCost = extraRounds * 18000;
    impact += impactVal;
    cost += roundCost;
    preventedTons += extraRounds * 2.8;
    breakdown.push({
      intervention: `Shift from 1x to ${input.collectionFrequencyMultiplier}x Daily Compactor Sweep`,
      marginalImpactPercent: impactVal,
      operationalFeasibility: 'High',
      monthlyCostInr: roundCost
    });
  }

  // 2. Extra Roll-On Bins
  if (input.additionalRollOnBins > 0) {
    const binImpact = Math.min(32, input.additionalRollOnBins * 11);
    const binCost = input.additionalRollOnBins * 4500; // maintenance/empty
    impact += binImpact;
    cost += binCost;
    preventedTons += input.additionalRollOnBins * 1.5;
    breakdown.push({
      intervention: `Deploy ${input.additionalRollOnBins} Dedicated Heavy-Duty Bins (2.5m³)`,
      marginalImpactPercent: binImpact,
      operationalFeasibility: 'High',
      monthlyCostInr: binCost
    });
  }

  // 3. Mechanical Grating for Culverts
  if (input.mechanicalGratingInstalled) {
    const grateImpact = locationId.includes('koramangala') || locationId.includes('drain') ? 35 : 12;
    const grateCost = 7000; // amortization + monthly clearing
    impact += grateImpact;
    cost += grateCost;
    preventedTons += 3.2;
    breakdown.push({
      intervention: 'Dual-Stage Mechanical Trash Rack at Culvert Mouth',
      marginalImpactPercent: grateImpact,
      operationalFeasibility: 'Medium',
      monthlyCostInr: grateCost
    });
  }

  // 4. CCTV Enforcement & Ward Marshalling
  if (input.cctvEnforcementActive) {
    const cctvImpact = 18;
    const cctvCost = 12000; // Marshall patrolling + camera feed
    impact += cctvImpact;
    cost += cctvCost;
    preventedTons += 1.8;
    breakdown.push({
      intervention: 'AI Surveillance + Night Ward Marshal Patrols',
      marginalImpactPercent: cctvImpact,
      operationalFeasibility: 'Medium',
      monthlyCostInr: cctvCost
    });
  }

  // 5. Commercial Source Segregation Mandate
  if (input.commercialSourceSegregationMandate) {
    const mandateImpact = 24;
    const mandateCost = 5000; // Inspection & trade license compliance
    impact += mandateImpact;
    cost += mandateCost;
    preventedTons += 2.4;
    breakdown.push({
      intervention: 'Trade Association Bulk-Discharge Compact Agreement',
      marginalImpactPercent: mandateImpact,
      operationalFeasibility: 'High',
      monthlyCostInr: mandateCost
    });
  }

  // Cap combined impact realistically at 88%
  const totalImpact = Math.min(88, Math.round(impact));
  const newDays = Math.round(5 * (1 + (totalImpact / 15)));

  let grade: SimulationResult['riskReductionGrade'] = 'Slight';
  if (totalImpact >= 65) grade = 'Transformative';
  else if (totalImpact >= 35) grade = 'Significant';

  let verdict = '';
  if (totalImpact >= 65) {
    verdict = 'High return-on-investment package. Shuts down recurring cycle completely through dual capacity and source prevention.';
  } else if (totalImpact >= 35) {
    verdict = 'Substantial mitigation. Delays relapse window by 3-4x, but minor secondary overflows may persist in peak season.';
  } else {
    verdict = 'Baseline mitigation only. Recurrence cycle will likely reappear within typical weekly timeframe.';
  }

  return {
    scenarioName: 'Custom Preventive Strategy',
    projectedRecurrenceDropPercent: totalImpact,
    projectedRelapseDaysExtended: newDays,
    estimatedMonthlyCostInr: cost,
    monthlyPreventedWasteTons: Number(preventedTons.toFixed(1)),
    riskReductionGrade: grade,
    culvertChokeRiskReductionPercent: input.mechanicalGratingInstalled ? 82 : Math.min(60, Math.round(totalImpact * 0.7)),
    breakdown,
    comparativeVerdict: verdict
  };
}

// Preset Strategies for Instant 1-Click Comparison
export const SIMULATION_PRESETS = [
  {
    id: 'preset_reactive',
    title: 'Baseline (Status Quo)',
    description: 'Current 1x daily morning sweep without additional bins or structural changes.',
    inputs: {
      collectionFrequencyMultiplier: 1,
      additionalRollOnBins: 0,
      mechanicalGratingInstalled: false,
      cctvEnforcementActive: false,
      commercialSourceSegregationMandate: false
    }
  },
  {
    id: 'preset_capacity',
    title: 'Strategy A: Capacity Expansion',
    description: 'Double compactor sweeps (2x daily) + 2 extra roll-on bins.',
    inputs: {
      collectionFrequencyMultiplier: 2,
      additionalRollOnBins: 2,
      mechanicalGratingInstalled: false,
      cctvEnforcementActive: false,
      commercialSourceSegregationMandate: false
    }
  },
  {
    id: 'preset_structural',
    title: 'Strategy B: Structural Engineering & Source Control',
    description: 'Mechanical culvert trash rack + Vendor trade association compaction protocol.',
    inputs: {
      collectionFrequencyMultiplier: 1,
      additionalRollOnBins: 1,
      mechanicalGratingInstalled: true,
      cctvEnforcementActive: false,
      commercialSourceSegregationMandate: true
    }
  },
  {
    id: 'preset_comprehensive',
    title: 'Strategy C: Full Preventive Shield (Recommended)',
    description: 'Dual sweeps + mechanical trash rack + 2 bins + night marshalling.',
    inputs: {
      collectionFrequencyMultiplier: 2,
      additionalRollOnBins: 2,
      mechanicalGratingInstalled: true,
      cctvEnforcementActive: true,
      commercialSourceSegregationMandate: true
    }
  }
];
