import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Filter,
  Layers,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  Waves,
  ArrowRight
} from 'lucide-react';
import { HotspotLocation, Incident, WasteCategory, SeverityLevel } from '../../types';
import { DemoBadge, DisclaimerBanner } from '../common/DemoBadge';

interface ReportsPageProps {
  locations: HotspotLocation[];
  incidents: Incident[];
  onSelectHotspot: (locationId: string) => void;
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  locations,
  incidents,
  onSelectHotspot,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');

  const filteredIncidents = incidents.filter((inc) => {
    if (selectedCategory !== 'all' && inc.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
    if (selectedClassification !== 'all') {
      const loc = locations.find((l) => l.id === inc.locationId);
      if (loc && loc.classification !== selectedClassification) return false;
    }
    return true;
  });

  const oneTimeHotspots = locations.filter((l) => l.classification === 'one_time');
  const recurringHotspots = locations.filter((l) => l.classification === 'repeated');

  const handleExportFullJson = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      platform: 'WasteShadow AI Municipal SWM Analytics',
      summary: {
        totalHotspots: locations.length,
        recurringHotspots: recurringHotspots.length,
        totalIncidents: incidents.length
      },
      locations,
      incidents
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'WasteShadow_Municipal_Full_Export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onShowToast('success', 'Full Dataset Exported', 'Downloaded complete database as JSON.');
  };

  const handleExportIncidentsCsv = () => {
    const headers = ['IncidentID', 'LocationName', 'ReportedAt', 'Category', 'Severity', 'VolumeKg', 'CleanupStatus'];
    const rows = filteredIncidents.map((i) => [
      i.id,
      `"${i.locationName.replace(/"/g, '""')}"`,
      i.reportedAt,
      i.category,
      i.severity,
      i.estimatedVolumeKg || 0,
      i.cleanupStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'WasteShadow_Filtered_Incidents.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();

    onShowToast('success', 'CSV Exported', `Exported ${filteredIncidents.length} records.`);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reports & Civic Analytics
            </h1>
            <DemoBadge label="Compliance Reporting" variant="emerald" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate municipal SWM audit reports, comparative recurrence studies, and compliance datasets.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportIncidentsCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportFullJson}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Full Dataset (JSON)</span>
          </button>
        </div>
      </div>

      <DisclaimerBanner text="Regulatory Audit Notice: Generated reports reflect operational logs and AI-assisted spatiotemporal clustering. Ground-truth inspections are audited by designated Ward SWM marshals under Swachh Bharat Urban Guidelines." />

      {/* Comparative Matrix: One-Time vs Recurring Hotspots */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Comparative Analysis: One-Time vs Chronic Recurring Hotspots</h3>
          <p className="text-xs text-slate-500">
            Evaluating structural operational factors that differentiate isolated dumps from recurring dump sites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* One-Time Characteristics */}
          <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                One-Time / Isolated Events ({oneTimeHotspots.length} sites)
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Score &lt; 30/100
              </span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Primary Causes:</b> Periodic holiday festivals, domestic move-outs, or temporary home renovation.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Collection Alignment:</b> Normal morning door-to-door auto-tipper frequency is adequate.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Post-Clean Relapse:</b> Zero relapses within 30-60 day monitoring window.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Civic Action:</b> Single compactor clearing run and routine street sweeping.</span>
              </li>
            </ul>
          </div>

          {/* Chronic Recurring Characteristics */}
          <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Chronic Recurring Hotspots ({recurringHotspots.length} sites)
              </span>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                Score &gt; 70/100
              </span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><b>Primary Causes:</b> Commercial wholesale vendor schedule mismatch, night-time tipping, or drain choking.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><b>Collection Alignment:</b> Vehicles arrive 3-4 hours after wholesale unloading occurs, creating an unserviced window.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><b>Post-Clean Relapse:</b> Relapses occur within 36-72 hours after every manual clearing.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><b>Civic Action:</b> Structural interventions (04:30 AM schedule shift, culvert safety grates, roll-on bins).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Multi-Filter Incident Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Incident Query & Filter Explorer</h3>
            <p className="text-xs text-slate-500">Query {filteredIncidents.length} incidents matching criteria</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="organic_market">Organic Market</option>
              <option value="drain_sludge_waste">Drain Sludge</option>
              <option value="single_use_plastics">Single-Use Plastics</option>
              <option value="commercial_packaging">Commercial Packaging</option>
              <option value="construction_debris">Construction Debris</option>
              <option value="mixed_municipal">Mixed Municipal</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>

            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="all">All Hotspot Types</option>
              <option value="repeated">Repeated Only</option>
              <option value="emerging">Emerging Only</option>
              <option value="one_time">One-Time Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Volume</th>
                <th className="py-2.5 px-3">Reporter</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {new Date(inc.reportedAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    {inc.locationName}
                  </td>
                  <td className="py-2.5 px-3 capitalize">
                    {inc.category.replace(/_/g, ' ')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        inc.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : inc.severity === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{inc.estimatedVolumeKg || 0} kg</td>
                  <td className="py-2.5 px-3 capitalize">{inc.reporterRole.replace('_', ' ')}</td>
                  <td className="py-2.5 px-3">
                    {inc.cleanupStatus === 'verified_clean' ? (
                      <span className="text-emerald-700 font-semibold">✓ Clean</span>
                    ) : (
                      <span className="text-rose-600 font-medium">Pending</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectHotspot(inc.locationId)}
                      className="text-emerald-600 hover:text-emerald-800 font-semibold"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
