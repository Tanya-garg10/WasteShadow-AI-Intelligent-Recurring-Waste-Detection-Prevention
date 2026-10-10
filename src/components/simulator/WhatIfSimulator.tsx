import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  HelpCircle
} from 'lucide-react';
import { HotspotLocation } from '../../types';
import {
  simulateInterventionScenario,
  SIMULATION_PRESETS,
  WhatIfScenarioInput,
  SimulationResult
} from '../../services/simulatorEngine';
import { DemoBadge } from '../common/DemoBadge';

interface WhatIfSimulatorProps {
  locations: HotspotLocation[];
  selectedLocationId: string;
  onApplyTask?: (scenarioTitle: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  locations,
  selectedLocationId,
  onApplyTask
}) => {
  const [activeLocId, setActiveLocId] = useState<string>(selectedLocationId || locations[0]?.id);
  const activeLoc = locations.find((l) => l.id === activeLocId) || locations[0];

  // Simulator Inputs State
  const [frequency, setFrequency] = useState<number>(2);
  const [extraBins, setExtraBins] = useState<number>(2);
  const [grating, setGrating] = useState<boolean>(true);
  const [cctv, setCctv] = useState<boolean>(false);
  const [vendorAgreement, setVendorAgreement] = useState<boolean>(true);

  const currentInputs: WhatIfScenarioInput = {
    collectionFrequencyMultiplier: frequency,
    additionalRollOnBins: extraBins,
    mechanicalGratingInstalled: grating,
    cctvEnforcementActive: cctv,
    commercialSourceSegregationMandate: vendorAgreement
  };

  const simulation: SimulationResult = simulateInterventionScenario(
    activeLoc.id,
    activeLoc.recurrenceScore,
    currentInputs
  );

  const handleApplyPreset = (presetInputs: WhatIfScenarioInput) => {
    setFrequency(presetInputs.collectionFrequencyMultiplier);
    setExtraBins(presetInputs.additionalRollOnBins);
    setGrating(presetInputs.mechanicalGratingInstalled);
    setCctv(presetInputs.cctvEnforcementActive);
    setVendorAgreement(presetInputs.commercialSourceSegregationMandate);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E4EAE5] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-[#E4EAE5] bg-linear-to-r from-[#F8FAF7] via-white to-[#F0FDF4]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#E4F4EC] text-[#137C62]">
                <Sliders className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#137C62]">
                Feature 2: Decision Intelligence Simulator
              </span>
              <DemoBadge label="What-If Model" variant="green" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B25] tracking-tight">
              What-If Waste Simulator
            </h2>
            <p className="text-xs sm:text-sm text-[#74847C] max-w-2xl leading-relaxed">
              Simulate operational strategies side-by-side: evaluate collection frequency shifts, roll-on bin capacity, and mechanical culvert trash racks before committing municipal capital.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#74847C]">Hotspot:</span>
            <select
              value={activeLocId}
              onChange={(e) => setActiveLocId(e.target.value)}
              className="text-xs font-bold text-[#172B25] bg-white border border-[#E4EAE5] rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 1-Click Strategy Preset Quick Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
          {SIMULATION_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.inputs)}
              className="p-3.5 rounded-2xl border border-[#E4EAE5] bg-white hover:border-[#137C62] hover:bg-[#F8FAF7] text-left transition-all cursor-pointer group space-y-1.5 shadow-2xs"
            >
              <div className="text-xs font-bold text-[#172B25] group-hover:text-[#137C62] flex items-center justify-between">
                <span>{p.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#74847C] group-hover:text-[#137C62] transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-[#74847C] line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Scenario Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E4EAE5] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B25] flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#137C62]" />
              <span>Simulated Intervention Knobs</span>
            </h3>
            <button
              onClick={() => handleApplyPreset(SIMULATION_PRESETS[0].inputs)}
              className="text-[10px] font-bold text-[#74847C] hover:text-[#137C62] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Baseline
            </button>
          </div>

          {/* 1. Compactor Sweep Frequency */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5]">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-[#172B25]">Compactor Sweep Frequency</label>
              <span className="font-bold text-[#137C62] bg-[#E4F4EC] px-2 py-0.5 rounded">
                {frequency}x Daily Round
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full accent-[#137C62] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#74847C]">
              <span>1x (Baseline Morning)</span>
              <span>2x (Dawn + Afternoon)</span>
              <span>3x (Continuous Shift)</span>
            </div>
          </div>

          {/* 2. Extra Roll-On Bins */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5]">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-[#172B25]">Dedicated Heavy-Duty Bins (2.5m³)</label>
              <span className="font-bold text-[#137C62] bg-[#E4F4EC] px-2 py-0.5 rounded">
                +{extraBins} Roll-On Bins
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={extraBins}
              onChange={(e) => setExtraBins(Number(e.target.value))}
              className="w-full accent-[#137C62] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#74847C]">
              <span>0 (None)</span>
              <span>2 (+5.0m³ capacity)</span>
              <span>4 (+10m³ capacity)</span>
            </div>
          </div>

          {/* 3. Toggles: Mechanical Grating & CCTV & Vendor Mandate */}
          <div className="space-y-3">
            {/* Grating */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] cursor-pointer hover:bg-white transition-all">
              <input
                type="checkbox"
                checked={grating}
                onChange={(e) => setGrating(e.target.checked)}
                className="mt-0.5 rounded text-[#137C62] focus:ring-[#137C62] cursor-pointer"
              />
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-[#172B25]">Dual-Stage Culvert Trash Rack</div>
                <div className="text-[11px] text-[#74847C]">
                  Fabricate mechanical steel grill to arrest plastic ingress before subterranean canal entry.
                </div>
              </div>
            </label>

            {/* Vendor Agreement */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] cursor-pointer hover:bg-white transition-all">
              <input
                type="checkbox"
                checked={vendorAgreement}
                onChange={(e) => setVendorAgreement(e.target.checked)}
                className="mt-0.5 rounded text-[#137C62] focus:ring-[#137C62] cursor-pointer"
              />
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-[#172B25]">Commercial Wholesale Source Compaction Mandate</div>
                <div className="text-[11px] text-[#74847C]">
                  Binding trade association protocol requiring internal cardboard baling & dawn collection handoff.
                </div>
              </div>
            </label>

            {/* CCTV */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] cursor-pointer hover:bg-white transition-all">
              <input
                type="checkbox"
                checked={cctv}
                onChange={(e) => setCctv(e.target.checked)}
                className="mt-0.5 rounded text-[#137C62] focus:ring-[#137C62] cursor-pointer"
              />
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-[#172B25]">AI Night Surveillance & Ward Marshalling</div>
                <div className="text-[11px] text-[#74847C]">
                  Camera telemetry to deter commercial midnight offloading.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Projected Impact Outcomes (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-b border-[#E4EAE5] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B25]">
              Projected Simulation Outcomes
            </h3>
          </div>

          {/* 3 Outcome Metric Hero Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Projected Recurrence Drop */}
            <div className="p-4 rounded-2xl bg-[#E4F4EC] border border-[#C8F169] space-y-1 text-center">
              <span className="text-[11px] font-bold uppercase text-[#123D32]">
                Projected Recurrence Drop
              </span>
              <div className="text-3xl font-black text-[#137C62]">
                -{simulation.projectedRecurrenceDropPercent}%
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#137C62] inline-block">
                {simulation.riskReductionGrade} Impact
              </span>
            </div>

            {/* Relapse Window Extended */}
            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-1 text-center">
              <span className="text-[11px] font-bold uppercase text-[#74847C]">
                Relapse Window Extended
              </span>
              <div className="text-3xl font-black text-[#172B25]">
                ~{simulation.projectedRelapseDaysExtended} days
              </div>
              <span className="text-[10px] text-[#74847C] inline-block">
                Up from baseline ~5 days
              </span>
            </div>

            {/* Monthly Prevented Waste */}
            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-1 text-center">
              <span className="text-[11px] font-bold uppercase text-[#74847C]">
                Estimated Cost / Mo
              </span>
              <div className="text-2xl font-black text-[#172B25]">
                ₹{simulation.estimatedMonthlyCostInr.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#137C62] font-semibold inline-block">
                ~{simulation.monthlyPreventedWasteTons} tons waste halted
              </span>
            </div>
          </div>

          {/* Comparative Verdict Box */}
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#172B25]">
              <Sparkles className="w-4 h-4 text-[#137C62]" />
              <span>Comparative Strategy Verdict</span>
            </div>
            <p className="text-xs text-[#74847C] leading-relaxed">
              {simulation.comparativeVerdict}
            </p>
          </div>

          {/* Intervention Marginal Impact Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#172B25] uppercase tracking-wider">
              Marginal Contribution Breakdown
            </h4>
            <div className="space-y-2">
              {simulation.breakdown.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#F8FAF7] text-xs text-[#74847C] text-center italic">
                  Status Quo selected. Enable one or more intervention knobs to view marginal benefits.
                </div>
              ) : (
                simulation.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#E4EAE5] flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#172B25]">{item.intervention}</div>
                      <div className="text-[10px] text-[#74847C]">
                        Feasibility: <b>{item.operationalFeasibility}</b> • Cost: ₹{item.monthlyCostInr.toLocaleString('en-IN')}/mo
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#137C62] bg-[#E4F4EC] px-2.5 py-1 rounded-lg">
                      +{item.marginalImpactPercent}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
