import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Waves,
  AlertTriangle,
  CheckCircle2,
  Download,
  Share2,
  Plus,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  FileText,
  Printer
} from 'lucide-react';
import { HotspotLocation, Incident, RootCauseHypothesis, PreventionTask } from '../../types';
import { computeRecurrenceMetrics } from '../../services/recurrenceEngine';
import { StorageService } from '../../services/storageService';
import { DemoBadge } from '../common/DemoBadge';
import { EvidenceImage } from '../common/EvidenceImage';

interface HotspotDetailPageProps {
  locationId: string;
  locations: HotspotLocation[];
  incidents: Incident[];
  hypotheses: RootCauseHypothesis[];
  tasks: PreventionTask[];
  onBack: () => void;
  onOpenUploadForLocation: (locationId: string) => void;
  onNavigateToTracker: () => void;
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const HotspotDetailPage: React.FC<HotspotDetailPageProps> = ({
  locationId,
  locations,
  incidents,
  hypotheses,
  tasks,
  onBack,
  onOpenUploadForLocation,
  onNavigateToTracker,
  onShowToast
}) => {
  const [selectedIncidentModal, setSelectedIncidentModal] = useState<Incident | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const hotspot = locations.find((l) => l.id === locationId) || locations[0];
  if (!hotspot) return null;

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

  const handlePrintReport = () => {
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
    link.setAttribute('download', `WasteShadow_Report_${hotspot.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('success', 'Report Downloaded', `Exported ${hotspotIncidents.length} incident records as CSV.`);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  hotspot.classification === 'repeated'
                    ? 'bg-rose-100 text-rose-800'
                    : hotspot.classification === 'emerging'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {hotspot.classification} Hotspot
              </span>
              <span className="text-xs font-semibold text-slate-500">{hotspot.wardNumber}</span>
              <DemoBadge label="Investigative Dossier" variant="emerald" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {hotspot.name}
            </h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => onOpenUploadForLocation(hotspot.id)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Re-inspection Photo</span>
          </button>
        </div>
      </div>

      {/* Primary KPI & Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Recurrence Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{hotspot.recurrenceScore}</span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {metrics.explanation.slice(0, 50)}...
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Recorded Incidents</span>
          <div className="text-3xl font-extrabold text-slate-900">{hotspot.totalIncidents}</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {hotspot.resolvedIncidents} verified cleaned
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Recurrence Cadence</span>
          <div className="text-3xl font-extrabold text-slate-900">
            {hotspot.averageIntervalDays > 0 ? `~${hotspot.averageIntervalDays}d` : 'None'}
          </div>
          <div className="text-[11px] text-slate-500">Average interval between dumps</div>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-xs space-y-1 ${
            hotspot.drainRisk !== 'none'
              ? 'bg-rose-50/50 border-rose-200 text-rose-950'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider">Drain Hazard Level</span>
          <div className="flex items-center gap-1.5 text-xl font-bold">
            <Waves className="w-5 h-5 text-sky-600" />
            <span className="capitalize">{hotspot.drainRisk.replace(/_/g, ' ')}</span>
          </div>
          <div className="text-[11px] opacity-80">
            {hotspot.drainRisk !== 'none' ? 'Stormwater choking alert' : 'No drain within 30m'}
          </div>
        </div>
      </div>

      {/* Investigation Status Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Current Investigation Status:
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
              hotspot.investigationStatus === 'verified_clean'
                ? 'bg-emerald-100 text-emerald-800'
                : hotspot.investigationStatus === 'action_planned'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {hotspot.investigationStatus.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Update Phase:</span>
          <select
            value={hotspot.investigationStatus}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="text-xs font-semibold p-1.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="open">Open / Unassigned</option>
            <option value="investigating">Under Field Investigation</option>
            <option value="action_planned">Action Planned / Work Order Issued</option>
            <option value="verified_clean">Verified Cleaned (Ground-Truth Verified)</option>
          </select>
        </div>
      </div>

      {/* Chronological Incident Timeline & Photographic Evidence */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Chronological Photographic Timeline</h3>
            <p className="text-xs text-slate-500">
              Comparing dated incident evidence across the recurrence cycle (Before, Relapse 1, Relapse 2, After)
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{hotspotIncidents.length} Photos Captured</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotspotIncidents.map((inc, index) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncidentModal(inc)}
              className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group bg-slate-50/50 flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <EvidenceImage
                  src={inc.photoUrl}
                  alt={`Incident ${index + 1}`}
                  fallbackText={inc.locationName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Report #{index + 1} • {new Date(inc.reportedAt).toLocaleDateString()}
                </div>
                {inc.cleanupStatus === 'verified_clean' && (
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cleaned & Verified</span>
                  </div>
                )}
              </div>

              {/* Card Meta */}
              <div className="p-4 space-y-2 text-xs flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 capitalize">
                      {inc.category.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`font-semibold text-[10px] px-1.5 py-0.2 rounded uppercase ${
                        inc.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : inc.severity === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inc.severity} Severity
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                    {inc.notes}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Reporter: {inc.reporterName}</span>
                  <span className="text-emerald-700 font-semibold group-hover:underline">View AI Breakdown →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recurrence Mathematical Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Documented Recurrence Scoring Breakdown</h3>
        <p className="text-xs text-slate-500">
          Formula components calculated by WasteShadow Spatiotemporal Clustering Core
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold">Frequency Component</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{metrics.frequencyScore} / 35</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Event count in 80m radius</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold">Cadence Consistency</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{metrics.intervalConsistency} / 25</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Repeat interval variance</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold">Category Persistence</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{metrics.categoryPersistence} / 20</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Same material profile dominance</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold">Post-Clean Relapses</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{metrics.relapseAfterClean} / 20</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Reappearance penalty</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-medium">
          {metrics.explanation}
        </div>
      </div>

      {/* Evidence-Linked Root Causes for this Hotspot */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Root-Cause Hypotheses</h3>
            <p className="text-xs text-slate-500">Operational mismatches diagnosed for this location</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">{hotspotHypotheses.length} Identified</span>
        </div>

        <div className="space-y-4">
          {hotspotHypotheses.map((hyp) => (
            <div key={hyp.id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/40">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-sm">{hyp.title}</div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {hyp.confidenceScore}% Confidence
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-700">Supporting Evidence:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {hyp.supportingEvidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-500">
                  Recommended action: <b>{hyp.suggestedPreventionAction}</b>
                </span>
                <button
                  onClick={onNavigateToTracker}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  View in Action Tracker →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Export Municipal Hotspot Dossier</span>
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Generate an official civic engineering report for <b>{hotspot.name}</b> including GPS timestamps, recurrence metrics, AI visual detection logs, and suggested prevention work orders.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handlePrintReport}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Dossier / Save PDF</span>
              </button>

              <button
                onClick={handleDownloadCsv}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Download Incident Data (CSV)</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-400 text-center pt-2">
              Compliant with Urban Local Body (ULB) Solid Waste Rules 2026.
            </div>
          </div>
        </div>
      )}

      {/* Incident AI Inspection Modal */}
      {selectedIncidentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Incident AI Vision Breakdown</h3>
                <div className="text-[11px] text-slate-500">
                  Reported on {new Date(selectedIncidentModal.reportedAt).toLocaleString()} by {selectedIncidentModal.reporterName}
                </div>
              </div>
              <button
                onClick={() => setSelectedIncidentModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
              <EvidenceImage
                src={selectedIncidentModal.photoUrl}
                alt="Selected incident"
                fallbackText={selectedIncidentModal.locationName}
                enableZoom={true}
                className="w-full h-full object-cover"
              />
            </div>

            {selectedIncidentModal.analysis ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Visual Categories Detected:</div>
                  {selectedIncidentModal.analysis.visibleCategories.map((c, i) => (
                    <div key={i} className="flex justify-between text-[11px]">
                      <span>{c.label} ({c.description})</span>
                      <b className="text-emerald-700">{c.approxPercentage}%</b>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 space-y-1">
                  <div className="font-bold">Drain & Culvert Inspection:</div>
                  <p className="text-[11px]">{selectedIncidentModal.analysis.drainBlockage.visualObservation}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Detailed AI vision analysis was not performed on this legacy snapshot.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
