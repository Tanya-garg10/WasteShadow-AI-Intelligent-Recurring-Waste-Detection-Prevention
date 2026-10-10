import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Waves,
  Eye,
  X,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Incident, HotspotLocation, WasteCategory, SeverityLevel } from '../../types';
import { DemoBadge } from '../common/DemoBadge';
import { EvidenceImage } from '../common/EvidenceImage';

interface IncidentExplorerProps {
  incidents: Incident[];
  locations: HotspotLocation[];
  onSelectHotspot: (locationId: string) => void;
  onOpenNewIncident: () => void;
}

export const IncidentExplorer: React.FC<IncidentExplorerProps> = ({
  incidents,
  locations,
  onSelectHotspot,
  onOpenNewIncident
}) => {
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filtered = incidents.filter((inc) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchLoc = inc.locationName.toLowerCase().includes(q);
      const matchNotes = inc.notes.toLowerCase().includes(q);
      const matchRep = inc.reporterName.toLowerCase().includes(q);
      if (!matchLoc && !matchNotes && !matchRep) return false;
    }
    if (categoryFilter !== 'all' && inc.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    if (statusFilter !== 'all') {
      if (statusFilter === 'cleaned' && inc.cleanupStatus !== 'verified_clean') return false;
      if (statusFilter === 'active' && inc.cleanupStatus === 'verified_clean') return false;
    }
    return true;
  });

  const getLinkedHotspot = (locId: string) => locations.find((l) => l.id === locId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#172B25] tracking-tight">
              Incident Explorer
            </h1>
            <DemoBadge label={`${incidents.length} Records`} variant="emerald" />
          </div>
          <p className="text-xs text-[#74847C] mt-0.5">
            Searchable repository of geo-tagged photographic reports, AI visual traits, and cleanup audit histories.
          </p>
        </div>

        <button
          onClick={onOpenNewIncident}
          className="flex items-center gap-1.5 bg-[#137C62] hover:bg-[#123D32] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          <span>+ Log Incident</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4EAE5] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74847C]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by street or notes..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:border-[#137C62]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs p-1.5 rounded-xl border border-[#E4EAE5] bg-white text-[#172B25] outline-none"
          >
            <option value="all">All Waste Categories</option>
            <option value="organic_market">Organic Market</option>
            <option value="drain_sludge_waste">Drain Sludge</option>
            <option value="single_use_plastics">Single-Use Plastics</option>
            <option value="commercial_packaging">Commercial Packaging</option>
            <option value="construction_debris">Construction Debris</option>
            <option value="mixed_municipal">Mixed Municipal</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs p-1.5 rounded-xl border border-[#E4EAE5] bg-white text-[#172B25] outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-1.5 rounded-xl border border-[#E4EAE5] bg-white text-[#172B25] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Incident</option>
            <option value="cleaned">Verified Cleaned</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-[#74847C]">
          Showing <b>{filtered.length}</b> of {incidents.length} incidents
        </span>
      </div>

      {/* Main Table + Right-Side Detail Drawer */}
      <div className="relative flex gap-6">
        {/* Table Container */}
        <div className="flex-1 bg-white rounded-3xl border border-[#E4EAE5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#172B25]">
              <thead className="bg-[#F8FAF7] text-[#74847C] font-bold uppercase tracking-wider text-[10px] border-b border-[#E4EAE5]">
                <tr>
                  <th className="py-3 px-4">Photo Preview</th>
                  <th className="py-3 px-4">Location & Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Recurrence Match</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4EAE5]">
                {filtered.map((inc) => {
                  const hotspot = getLinkedHotspot(inc.locationId);
                  const isSelected = selectedIncident?.id === inc.id;

                  return (
                    <tr
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      className={`hover:bg-[#F8FAF7] cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#E4F4EC]/60' : ''
                      }`}
                    >
                      {/* Thumbnail Preview */}
                      <td className="py-3 px-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#123D32] border border-[#E4EAE5] shrink-0">
                          <EvidenceImage
                            src={inc.photoUrl}
                            alt="Incident thumb"
                            fallbackText={inc.category}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Location & Date */}
                      <td className="py-3 px-4 font-semibold text-[#172B25]">
                        <div className="truncate max-w-xs">{inc.locationName}</div>
                        <div className="text-[11px] font-normal text-[#74847C]">
                          {new Date(inc.reportedAt).toLocaleDateString()} • {inc.reporterName}
                        </div>
                      </td>

                      {/* Waste Category */}
                      <td className="py-3 px-4 capitalize">
                        <span className="bg-[#F8FAF7] text-[#172B25] px-2 py-0.5 rounded border border-[#E4EAE5] text-[11px] font-medium">
                          {inc.category.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Severity */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            inc.severity === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : inc.severity === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#E4F4EC] text-[#137C62]'
                          }`}
                        >
                          {inc.severity}
                        </span>
                      </td>

                      {/* Recurrence Match */}
                      <td className="py-3 px-4">
                        {hotspot ? (
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              hotspot.classification === 'repeated'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : hotspot.classification === 'emerging'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-[#E4F4EC] text-[#137C62]'
                            }`}
                          >
                            {hotspot.classification} ({hotspot.recurrenceScore}/100)
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#74847C]">Unassigned</span>
                        )}
                      </td>

                      {/* Cleanup Status */}
                      <td className="py-3 px-4">
                        {inc.cleanupStatus === 'verified_clean' ? (
                          <span className="text-[#137C62] font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Cleaned</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold text-[11px]">Active</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIncident(inc);
                          }}
                          className="text-[#137C62] hover:text-[#123D32] font-bold text-xs"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#74847C]">
                      <p className="text-sm font-semibold">No incidents found matching current filters.</p>
                      <button
                        onClick={() => {
                          setSearch('');
                          setCategoryFilter('all');
                          setSeverityFilter('all');
                          setStatusFilter('all');
                        }}
                        className="mt-2 text-xs text-[#137C62] font-bold underline"
                      >
                        Reset all filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right-Side Sliding Detail Drawer */}
        {selectedIncident && (
          <div className="w-96 bg-white rounded-3xl border border-[#E4EAE5] p-5 shadow-lg flex flex-col justify-between space-y-4 shrink-0 animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4EAE5] pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#74847C]">
                  Incident Dossier • {selectedIncident.id}
                </span>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-1 rounded-lg text-[#74847C] hover:text-[#172B25] hover:bg-[#F8FAF7]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Preview */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#123D32] border border-[#E4EAE5]">
                <EvidenceImage
                  src={selectedIncident.photoUrl}
                  alt="Incident inspection"
                  fallbackText={selectedIncident.locationName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#172B25] leading-snug">
                  {selectedIncident.locationName}
                </h3>
                <div className="text-[11px] text-[#74847C] mt-0.5">
                  Reported on {new Date(selectedIncident.reportedAt).toLocaleString()} by {selectedIncident.reporterName}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#74847C]">Material Class:</span>
                  <b className="capitalize">{selectedIncident.category.replace(/_/g, ' ')}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#74847C]">Severity Level:</span>
                  <b className="uppercase">{selectedIncident.severity}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#74847C]">Estimated Mass:</span>
                  <b>{selectedIncident.estimatedVolumeKg || 0} kg</b>
                </div>
              </div>

              <div className="text-xs text-[#74847C] space-y-1">
                <span className="font-bold text-[#172B25]">Field Observation Notes:</span>
                <p className="leading-relaxed bg-[#F8FAF7] p-2.5 rounded-xl border border-[#E4EAE5] text-[11px]">
                  {selectedIncident.notes}
                </p>
              </div>

              {/* AI Vision Observations */}
              {selectedIncident.analysis && (
                <div className="p-3 rounded-xl bg-[#E4F4EC]/60 border border-[#C8F169] text-xs space-y-1.5">
                  <div className="font-bold text-[#123D32] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#137C62]" />
                    <span>AI Vision Analysis:</span>
                  </div>
                  <p className="text-[11px] text-[#172B25] leading-relaxed">
                    {selectedIncident.analysis.rawVisualObservations}
                  </p>
                  {selectedIncident.analysis.drainBlockage.detectedObstruction && (
                    <div className="text-[10px] text-sky-800 font-bold bg-sky-50 p-1.5 rounded border border-sky-200">
                      💧 Culvert obstruction detected: {selectedIncident.analysis.drainBlockage.floodVulnerability} flood hazard.
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => onSelectHotspot(selectedIncident.locationId)}
              className="w-full flex items-center justify-center gap-1.5 bg-[#137C62] hover:bg-[#123D32] text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Investigate Full Hotspot History</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8F169]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
