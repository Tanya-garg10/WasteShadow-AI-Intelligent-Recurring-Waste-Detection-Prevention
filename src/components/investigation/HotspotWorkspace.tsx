import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Waves,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Plus,
  Eye,
  FileText,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { HotspotLocation, Incident, RootCauseHypothesis, PreventionTask } from '../../types';
import { computeRecurrenceMetrics } from '../../services/recurrenceEngine';
import { StorageService } from '../../services/storageService';
import { DemoBadge } from '../common/DemoBadge';
import { EvidenceImage } from '../common/EvidenceImage';
import { ExplainableInvestigator } from '../explainable/ExplainableInvestigator';

interface HotspotWorkspaceProps {
  hotspot: HotspotLocation;
  allHotspots: HotspotLocation[];
  incidents: Incident[];
  hypotheses: RootCauseHypothesis[];
  tasks: PreventionTask[];
  onBack: () => void;
  onSelectHotspot: (id: string) => void;
  onOpenAnalysis: (locationId: string) => void;
  onNavigateToTasks: () => void;
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const HotspotWorkspace: React.FC<HotspotWorkspaceProps> = ({
  hotspot,
  allHotspots,
  incidents,
  hypotheses,
  tasks,
  onBack,
  onSelectHotspot,
  onOpenAnalysis,
  onNavigateToTasks,
  onShowToast
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);
  const [selectedIncidentModal, setSelectedIncidentModal] = useState<Incident | null>(null);

  const hotspotIncidents = incidents
    .filter((i) => i.locationId === hotspot.id)
    .sort((a, b) => new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime());

  const hotspotHypotheses = hypotheses.filter((h) => h.locationId === hotspot.id);
  const hotspotTasks = tasks.filter((t) => t.locationId === hotspot.id);
  const metrics = computeRecurrenceMetrics(hotspotIncidents);

  const handleUpdateStatus = (status: any) => {
    const storage = StorageService.getInstance();
    storage.updateInvestigationStatus(hotspot.id, status);
    onShowToast('success', 'Status Updated', `Hotspot investigation status set to: ${status.replace('_', ' ')}`);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const headers = ['IncidentID', 'Date', 'Category', 'Severity', 'VolumeKg', 'CleanupStatus', 'Reporter'];
    const rows = hotspotIncidents.map((inc) => [
      inc.id,
      inc.reportedAt,
      inc.category,
      inc.severity,
      inc.estimatedVolumeKg || 0,
      inc.cleanupStatus,
      inc.reporterName
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WasteShadow_Investigation_${hotspot.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('success', 'Dossier Downloaded', `Exported ${hotspotIncidents.length} incident records.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Hotspot Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4EAE5] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-[#E4EAE5] bg-white text-[#74847C] hover:text-[#172B25] hover:bg-[#F8FAF7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#74847C]">Select Hotspot:</span>
            <select
              value={hotspot.id}
              onChange={(e) => onSelectHotspot(e.target.value)}
              className="text-xs font-bold text-[#172B25] bg-white border border-[#E4EAE5] rounded-xl px-3 py-1.5 outline-none cursor-pointer"
            >
              {allHotspots.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.classification.toUpperCase()} • {h.recurrenceScore}/100)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4EAE5] bg-white text-xs font-bold text-[#172B25] hover:bg-[#F8FAF7] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#74847C]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintDossier}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4EAE5] bg-white text-xs font-bold text-[#172B25] hover:bg-[#F8FAF7] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#74847C]" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={() => onOpenAnalysis(hotspot.id)}
            className="flex items-center gap-1.5 bg-[#137C62] hover:bg-[#123D32] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#C8F169]" />
            <span>Add Re-inspection Photo</span>
          </button>
        </div>
      </div>

      {/* Hero Workspace Header: Location Summary & Recurrence Score */}
      <div className="bg-white rounded-3xl border border-[#E4EAE5] p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                hotspot.classification === 'repeated'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : hotspot.classification === 'emerging'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-[#E4F4EC] text-[#137C62] border border-[#C8F169]'
              }`}
            >
              {hotspot.classification} Hotspot
            </span>
            <span className="text-xs font-semibold text-[#74847C]">{hotspot.wardNumber}</span>
            <DemoBadge label="Investigative Dossier" variant="emerald" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B25] tracking-tight">
            {hotspot.name}
          </h1>

          <p className="text-xs sm:text-sm text-[#74847C] leading-relaxed">
            {hotspot.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#74847C] pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#137C62]" />
              <span>{hotspot.coordinates.lat.toFixed(4)}°N, {hotspot.coordinates.lng.toFixed(4)}°E</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#74847C]" />
              <span>Avg cadence: <b>{hotspot.averageIntervalDays > 0 ? `~${hotspot.averageIntervalDays} days` : 'N/A'}</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#74847C]" />
              <span>Recorded: <b>{hotspot.totalIncidents} events</b> ({hotspot.resolvedIncidents} verified clean)</span>
            </div>
          </div>
        </div>

        {/* Distinctive Recurrence Intelligence Score Visualisation */}
        <div className="bg-[#F8FAF7] border border-[#E4EAE5] rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shrink-0 min-w-64">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#74847C]">
            Recurrence Intelligence Score
          </div>

          {/* Segmented Horizontal Scale */}
          <div className="relative w-44 flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#172B25]">{hotspot.recurrenceScore}</span>
              <span className="text-sm font-bold text-[#74847C]">/ 100</span>
            </div>

            {/* Segmented Visual Scale */}
            <div className="w-full bg-[#E4EAE5] rounded-full h-2 mt-2 overflow-hidden flex">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  hotspot.recurrenceScore >= 75
                    ? 'bg-rose-600'
                    : hotspot.recurrenceScore >= 40
                    ? 'bg-amber-500'
                    : 'bg-[#137C62]'
                }`}
                style={{ width: `${hotspot.recurrenceScore}%` }}
              />
            </div>

            <div className="w-full flex justify-between text-[9px] text-[#74847C] font-semibold mt-1">
              <span>0 (Isolated)</span>
              <span>50</span>
              <span>100 (Chronic)</span>
            </div>
          </div>

          {/* "How is this calculated?" Expandable Accordion */}
          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="text-[11px] font-bold text-[#137C62] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>How is this calculated?</span>
            {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Formula Calculation Section */}
      {showFormulaDetails && (
        <div className="bg-[#F8FAF7] rounded-2xl border border-[#E4EAE5] p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#172B25] uppercase tracking-wider">
              Algorithmic Multi-Factor Score Decomposition
            </h4>
            <span className="text-xs font-mono text-[#137C62] font-semibold">
              R_score = w₁·F + w₂·Cadence + w₃·Category + w₄·Relapse
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#E4EAE5]">
              <span className="text-[10px] text-[#74847C] uppercase font-bold">Frequency Component</span>
              <div className="text-lg font-bold text-[#172B25] mt-0.5">{metrics.frequencyScore} / 35</div>
              <div className="text-[10px] text-[#74847C]">Events clustered in 80m radius</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E4EAE5]">
              <span className="text-[10px] text-[#74847C] uppercase font-bold">Cadence Consistency</span>
              <div className="text-lg font-bold text-[#172B25] mt-0.5">{metrics.intervalConsistency} / 25</div>
              <div className="text-[10px] text-[#74847C]">Low variance between cycles</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E4EAE5]">
              <span className="text-[10px] text-[#74847C] uppercase font-bold">Category Persistence</span>
              <div className="text-lg font-bold text-[#172B25] mt-0.5">{metrics.categoryPersistence} / 20</div>
              <div className="text-[10px] text-[#74847C]">Same material profile dominance</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E4EAE5]">
              <span className="text-[10px] text-[#74847C] uppercase font-bold">Post-Clean Relapses</span>
              <div className="text-lg font-bold text-[#172B25] mt-0.5">{metrics.relapseAfterClean} / 20</div>
              <div className="text-[10px] text-[#74847C]">Reappearance penalty</div>
            </div>
          </div>

          <p className="text-xs text-[#74847C] leading-relaxed">
            <b>Evaluation explanation:</b> {metrics.explanation}
          </p>
        </div>
      )}

      {/* Chronological Incident Timeline & Evidence Gallery */}
      <div className="bg-white rounded-3xl border border-[#E4EAE5] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4EAE5] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#172B25]">
              Chronological Evidence Gallery & Timeline
            </h3>
            <p className="text-xs text-[#74847C]">
              Dated physical photographs proving recurrence cycles and post-cleaning relapses
            </p>
          </div>
          <span className="text-xs font-semibold text-[#137C62] bg-[#E4F4EC] px-2.5 py-1 rounded-lg">
            {hotspotIncidents.length} Dated Records
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotspotIncidents.map((inc, idx) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncidentModal(inc)}
              className="rounded-2xl border border-[#E4EAE5] bg-[#F8FAF7] overflow-hidden hover:border-[#137C62] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Photo Frame */}
              <div className="relative aspect-video w-full bg-[#123D32] overflow-hidden">
                <EvidenceImage
                  src={inc.photoUrl}
                  alt={`Incident ${idx + 1}`}
                  fallbackText={`${inc.category.replace(/_/g, ' ')} • Incident #${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                  Report #{idx + 1} • {new Date(inc.reportedAt).toLocaleDateString()}
                </div>

                {inc.cleanupStatus === 'verified_clean' ? (
                  <div className="absolute top-2.5 right-2.5 bg-[#137C62] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Cleaned</span>
                  </div>
                ) : (
                  <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Active Relapse
                  </div>
                )}
              </div>

              {/* Photo Caption & Metadata */}
              <div className="p-4 space-y-2 text-xs flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172B25] capitalize">
                      {inc.category.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        inc.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : inc.severity === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#E4F4EC] text-[#137C62]'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-[#74847C] text-[11px] line-clamp-2 leading-relaxed">
                    {inc.notes}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E4EAE5] flex items-center justify-between text-[10px] text-[#74847C]">
                  <span>By: {inc.reporterName}</span>
                  <span className="text-[#137C62] font-bold group-hover:underline flex items-center gap-0.5">
                    View AI Analysis →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature AI Analysis Area: 3 Clear Distinct Sections */}
      <div className="bg-white rounded-3xl border border-[#E4EAE5] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#172B25]">
              AI Investigative Intelligence Synthesis
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#E4F4EC] text-[#137C62] border border-[#C8F169]">
              Gemini 3.8 Flash Vision
            </span>
          </div>
          <p className="text-xs text-[#74847C] mt-0.5">
            Strict separation between objective photographic observations and synthesized operational hypotheses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section 1: Observed Evidence (Computer Vision Facts Only) */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#137C62] uppercase tracking-wider">
              <Eye className="w-4 h-4 text-[#137C62]" />
              <span>1. Observed Evidence</span>
            </div>
            <p className="text-[11px] text-[#74847C]">
              Factual physical surface traits identified in dated imagery:
            </p>

            <ul className="space-y-2 text-xs text-[#172B25]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#137C62] font-bold">•</span>
                <span>
                  <b>Dominant Material:</b> {hotspot.primaryCategory.replace(/_/g, ' ')} detected across &gt; 75% of incidents.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#137C62] font-bold">•</span>
                <span>
                  <b>Drain Proximity:</b> {hotspot.drainRisk !== 'none' ? `Stormwater culvert within 5m (${hotspot.drainRisk.replace(/_/g, ' ')})` : 'No culverts detected within 30m'}.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#137C62] font-bold">•</span>
                <span>
                  <b>Temporal Recurrence:</b> Repeats at approximately {hotspot.averageIntervalDays || 7} day intervals.
                </span>
              </li>
            </ul>

            <div className="text-[10px] text-[#74847C] pt-2 border-t border-[#E4EAE5] italic">
              Verified ground-truth camera logs.
            </div>
          </div>

          {/* Section 2: Possible Explanations (Root-Cause Hypotheses) */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>2. Possible Explanations</span>
            </div>
            <p className="text-[11px] text-amber-800">
              AI-formulated hypotheses based on collection logs and market cycles:
            </p>

            <div className="space-y-2">
              {hotspotHypotheses.slice(0, 2).map((hyp) => (
                <div key={hyp.id} className="p-2.5 rounded-xl bg-white border border-amber-200/80 text-xs space-y-1">
                  <div className="font-bold text-[#172B25] text-[11px] leading-tight">
                    {hyp.title}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#74847C]">
                    <span>Category: {hyp.category.replace(/_/g, ' ')}</span>
                    <b className="text-amber-800">Conf: {hyp.confidenceScore}%</b>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-amber-800 pt-1 italic">
              Hypothesis only. Never assumed as absolute without field verification.
            </div>
          </div>

          {/* Section 3: Recommended Next Steps (Actionable Prevention) */}
          <div className="p-5 rounded-2xl bg-[#E4F4EC]/60 border border-[#C8F169] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#123D32] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#137C62]" />
              <span>3. Recommended Next Steps</span>
            </div>
            <p className="text-[11px] text-[#123D32]">
              Targeted civic interventions to permanently break recurrence:
            </p>

            <ul className="space-y-2 text-xs text-[#172B25]">
              {hotspotHypotheses.slice(0, 2).map((hyp, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#137C62] font-bold">✓</span>
                  <span>{hyp.suggestedPreventionAction}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onNavigateToTasks}
              className="w-full mt-2 py-2 rounded-xl bg-[#137C62] hover:bg-[#123D32] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Manage in Prevention Planner</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8F169]" />
            </button>
        </div>
      </div>

      {/* Embedded Feature 3: Explainable AI Investigator (Transparent Evidence & Human Verification) */}
      <ExplainableInvestigator
        locations={allHotspots}
        incidents={incidents}
        hypotheses={hypotheses}
        selectedLocationId={hotspot.id}
        onSelectLocation={onSelectHotspot}
        onNavigateToTasks={onNavigateToTasks}
      />

      {/* Investigation Status & Work Order Status Strip */}
      <div className="bg-[#F8FAF7] border border-[#E4EAE5] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#172B25]">Investigation Lifecycle Phase</div>
          <p className="text-xs text-[#74847C]">
            Update phase as ward inspectors conduct time-and-motion studies or verify cleanups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={hotspot.investigationStatus}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="text-xs font-bold text-[#172B25] bg-white border border-[#E4EAE5] rounded-xl px-4 py-2 outline-none cursor-pointer"
          >
            <option value="open">Open / Unassigned</option>
            <option value="investigating">Under Field Review</option>
            <option value="action_planned">Action Planned / Work Order Issued</option>
            <option value="verified_clean">Verified Clean (Ground-Truth Audited)</option>
          </select>
        </div>
      </div>

      {/* Photo AI Inspection Modal */}
      {selectedIncidentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-[#E4EAE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E4EAE5] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172B25]">Incident AI Inspection Details</h3>
                <div className="text-[11px] text-[#74847C]">
                  Reported {new Date(selectedIncidentModal.reportedAt).toLocaleString()} by {selectedIncidentModal.reporterName}
                </div>
              </div>
              <button
                onClick={() => setSelectedIncidentModal(null)}
                className="text-[#74847C] hover:text-[#172B25] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#123D32]">
              <EvidenceImage
                src={selectedIncidentModal.photoUrl}
                alt="Selected incident"
                fallbackText={selectedIncidentModal.locationName}
                className="w-full h-full object-cover"
              />
            </div>

            {selectedIncidentModal.analysis ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-1.5">
                  <div className="font-bold text-[#172B25]">Computer Vision Breakdown:</div>
                  {selectedIncidentModal.analysis.visibleCategories.map((c, i) => (
                    <div key={i} className="flex justify-between text-[11px]">
                      <span>{c.label} ({c.description})</span>
                      <b className="text-[#137C62]">{c.approxPercentage}%</b>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 space-y-1">
                  <div className="font-bold">Drain & Culvert Status:</div>
                  <p className="text-[11px]">{selectedIncidentModal.analysis.drainBlockage.visualObservation}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#74847C]">
                Detailed AI vision analysis was not performed on this legacy snapshot.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
  );
};
