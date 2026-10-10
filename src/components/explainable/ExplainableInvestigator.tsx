import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';
import { HotspotLocation, Incident, RootCauseHypothesis } from '../../types';
import {
  synthesizeExplainableInvestigation,
  ExplainableInvestigationSynthesis
} from '../../services/explainableService';
import { DemoBadge } from '../common/DemoBadge';

interface ExplainableInvestigatorProps {
  locations: HotspotLocation[];
  incidents: Incident[];
  hypotheses: RootCauseHypothesis[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  onNavigateToTasks: () => void;
}

export const ExplainableInvestigator: React.FC<ExplainableInvestigatorProps> = ({
  locations,
  incidents,
  hypotheses,
  selectedLocationId,
  onSelectLocation,
  onNavigateToTasks
}) => {
  const [activeLocId, setActiveLocId] = useState<string>(selectedLocationId || locations[0]?.id);
  const activeLoc = locations.find((l) => l.id === activeLocId) || locations[0];

  const synthesis: ExplainableInvestigationSynthesis = synthesizeExplainableInvestigation(
    activeLoc,
    incidents,
    hypotheses
  );

  return (
    <div className="bg-white rounded-3xl border border-[#E4EAE5] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-[#E4EAE5] bg-linear-to-r from-[#F8FAF7] via-white to-[#F0FDF4]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#E4F4EC] text-[#137C62]">
                <FileCheck2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#137C62]">
                Feature 3: Trustworthy AI Intelligence
              </span>
              <DemoBadge label="Explainable AI Protocol" variant="green" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B25] tracking-tight">
              Explainable AI Investigator
            </h2>
            <p className="text-xs sm:text-sm text-[#74847C] max-w-2xl leading-relaxed">
              Transparent, defensible reasoning: reveals which photographic and spatial evidence supports each hypothesis, flags missing data points, and details mandatory field verification tests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#74847C]">Select Hotspot:</span>
            <select
              value={activeLocId}
              onChange={(e) => {
                setActiveLocId(e.target.value);
                onSelectLocation(e.target.value);
              }}
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
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Core Hypothesis & Confidence Banner */}
        <div className="p-5 rounded-2xl bg-[#E4F4EC]/70 border border-[#C8F169] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#137C62] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Synthesized Root-Cause Hypothesis</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#172B25]">
              "{synthesis.primaryHypothesis}"
            </div>
            <div className="text-xs text-[#74847C]">
              Hotspot: <b>{synthesis.locationName}</b>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-[#74847C]">Algorithmic Confidence</div>
              <div className="text-2xl font-black text-[#137C62]">{synthesis.confidenceScore}%</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4EAE5] flex items-center justify-center text-xs font-black text-[#137C62] shadow-2xs">
              AI-X
            </div>
          </div>
        </div>

        {/* 3 Structured Explainability Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Supporting Evidence (Why this hypothesis?) */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#137C62] uppercase tracking-wider">
              <Eye className="w-4 h-4 text-[#137C62]" />
              <span>1. Why This Hypothesis? (Grounding)</span>
            </div>
            <p className="text-[11px] text-[#74847C]">
              Concrete empirical observations derived from dated municipal photographs and GPS timestamps:
            </p>
            <ul className="space-y-2.5 text-xs text-[#172B25]">
              {synthesis.whyThisHypothesis.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E4EAE5]">
                  <span className="text-[#137C62] font-bold">✓</span>
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: What Evidence Is Missing? (Gap Analysis) */}
          <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>2. What Evidence Is Missing? (Uncertainty)</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Honest data gaps: The AI explicitly acknowledges parameters not captured by current photos:
            </p>
            <ul className="space-y-2.5 text-xs text-[#172B25]">
              {synthesis.whatEvidenceIsMissing.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-amber-200/60">
                  <span className="text-amber-600 font-bold">?</span>
                  <span className="leading-relaxed text-[#172B25]">{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Mandatory Field Verifications (Human-in-the-loop) */}
          <div className="p-5 rounded-2xl bg-sky-50/40 border border-sky-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>3. Human Ground-Truth Verifications</span>
              </div>
              <p className="text-[11px] text-sky-800">
                Action items required before issuing work orders or spending public capital:
              </p>
              <ul className="space-y-2.5 text-xs text-[#172B25]">
                {synthesis.mandatoryFieldVerifications.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-sky-200/60">
                    <span className="text-sky-600 font-bold font-mono">[{idx + 1}]</span>
                    <span className="leading-relaxed text-[#172B25]">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onNavigateToTasks}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-[#137C62] hover:bg-[#123D32] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Assign Verification Order</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Counterfactual Alternative Consideration Box */}
        <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#172B25]">
            <Scale className="w-4 h-4 text-[#137C62]" />
            <span>Counterfactual Evaluation (Alternative Explanation Testing)</span>
          </div>
          <p className="text-xs text-[#74847C] leading-relaxed">
            {synthesis.counterFactualConsideration}
          </p>
        </div>

        {/* Evidence Trails Decomposition Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#172B25]">
            Evidence Weight Attribution Matrix
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {synthesis.evidenceItems.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-white border border-[#E4EAE5] space-y-2 text-xs shadow-2xs">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-[#137C62]">{item.sourceType}</span>
                  <span className="text-[#74847C]">Weight: {item.weightInConclusion}</span>
                </div>
                <div className="text-[11px] text-[#172B25] leading-relaxed">
                  {item.observation}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#E4EAE5] text-[10px] text-[#74847C]">
                  <span>Confidence: <b>{item.confidence}%</b></span>
                  <span className="text-[#137C62] font-semibold">Fact-Grounded</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
