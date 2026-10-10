import React, { useState } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Filter,
  Plus,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { RootCauseHypothesis, HotspotLocation, PreventionTask } from '../../types';
import { StorageService } from '../../services/storageService';
import { DemoBadge } from '../common/DemoBadge';

interface HypothesisEnginePageProps {
  locations: HotspotLocation[];
  hypotheses: RootCauseHypothesis[];
  onSelectHotspot: (locationId: string) => void;
  onNavigateToTracker: () => void;
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const HypothesisEnginePage: React.FC<HypothesisEnginePageProps> = ({
  locations,
  hypotheses,
  onSelectHotspot,
  onNavigateToTracker,
  onShowToast
}) => {
  const [selectedLocFilter, setSelectedLocFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredHypotheses = hypotheses.filter((h) => {
    if (selectedLocFilter !== 'all' && h.locationId !== selectedLocFilter) return false;
    if (categoryFilter !== 'all' && h.category !== categoryFilter) return false;
    return true;
  });

  const handleCreateTaskFromHypothesis = (hyp: RootCauseHypothesis) => {
    const storage = StorageService.getInstance();
    const loc = storage.getLocationById(hyp.locationId);

    storage.addTask({
      locationId: hyp.locationId,
      locationName: loc?.name || 'Hotspot Location',
      title: hyp.suggestedPreventionAction,
      description: `Targeted prevention work order generated from AI Root-Cause Hypothesis: ${hyp.title}. Recommended verification: ${hyp.verificationStep}`,
      assignedTo: 'Ward Sanitation Taskforce',
      assignedRole: 'Field Operations Unit',
      department: hyp.category === 'drain_culvert_litter' ? 'Stormwater Drainage' : 'Solid Waste Management',
      priority: hyp.priority === 'urgent' ? 'critical' : hyp.priority,
      status: 'open',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      preventionType: hyp.category === 'drain_culvert_litter' ? 'drain_grating' : 'schedule_shift'
    });

    onShowToast(
      'success',
      'Action Task Created',
      `Preventive task "${hyp.suggestedPreventionAction.slice(0, 45)}..." added to Action Tracker.`
    );
    onNavigateToTracker();
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Root-Cause Hypothesis Engine
          </h1>
          <DemoBadge label="Evidence Correlation" variant="emerald" />
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Photographic evidence highlights visible objects—our intelligence engine correlates historical time intervals, commercial market cycles, and municipal routes to synthesize actionable operational hypotheses.
        </p>
      </div>

      {/* Methodology Disclaimer Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Principle of Honest Civic Intelligence:</div>
          <p className="leading-relaxed">
            WasteShadow AI never asserts factual certainty from an image alone. All entries below are explicitly designated as <b>Hypotheses</b>. Each item includes transparent blind spots (missing information) and an on-ground verification procedure before capital investments are dispatched.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Hotspot:</span>
          </div>
          <select
            value={selectedLocFilter}
            onChange={(e) => setSelectedLocFilter(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white outline-none"
          >
            <option value="all">All Locations ({hypotheses.length})</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white outline-none"
          >
            <option value="all">All Cause Categories</option>
            <option value="collection_frequency">Collection Frequency Mismatch</option>
            <option value="drain_culvert_litter">Storm Drain Culvert Litter</option>
            <option value="infrastructure_gap">Infrastructure Gap</option>
            <option value="commercial_dumping">Commercial Dumping</option>
            <option value="behavioral_segregation">Behavioral / Festival Overflow</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Showing <b>{filteredHypotheses.length}</b> verified hypotheses
        </span>
      </div>

      {/* Hypotheses List */}
      <div className="space-y-5">
        {filteredHypotheses.map((hyp) => {
          const loc = locations.find((l) => l.id === hyp.locationId);

          return (
            <div
              key={hyp.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4 hover:border-emerald-300 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        hyp.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : hyp.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Priority: {hyp.priority}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Category: {hyp.category.replace(/_/g, ' ')}
                    </span>
                    {hyp.isAiGenerated && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        AI-Synthesized Hypothesis
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{hyp.title}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <span>Linked Hotspot:</span>
                    <button
                      onClick={() => onSelectHotspot(hyp.locationId)}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      {loc?.name || hyp.locationId}
                    </button>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-1">
                  <div className="text-xs text-slate-500">Hypothesis Confidence</div>
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-lg">
                    <span>{hyp.confidenceScore}%</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        hyp.uncertaintyLevel === 'low'
                          ? 'bg-emerald-100 text-emerald-800'
                          : hyp.uncertaintyLevel === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {hyp.uncertaintyLevel} Uncertainty
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting Evidence vs Missing Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Supporting Evidence */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Supporting Civic Evidence</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {hyp.supportingEvidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-600 font-bold shrink-0">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Information / Blind Spots */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Missing Data & Blind Spots</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-900">
                    {hyp.missingInformation.map((mi, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-amber-600 font-bold shrink-0">•</span>
                        <span>{mi}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Field Verification & Suggested Prevention Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 text-xs space-y-1 text-sky-950">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-sky-800 block">
                    Recommended Ground Verification Step:
                  </span>
                  <p className="leading-relaxed">{hyp.verificationStep}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1 text-emerald-950">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-800 block">
                    Suggested Preventive Civic Measure:
                  </span>
                  <p className="leading-relaxed">{hyp.suggestedPreventionAction}</p>
                </div>
              </div>

              {/* Action Button to Convert to Task */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] text-slate-400">
                  Reviewed by SWM Municipal Intelligence Cell
                </span>
                <button
                  onClick={() => handleCreateTaskFromHypothesis(hyp)}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Convert into Action Tracker Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
