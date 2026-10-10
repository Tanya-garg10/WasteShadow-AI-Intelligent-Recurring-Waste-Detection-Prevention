import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Filter,
  ArrowRight,
  ShieldAlert,
  Waves,
  Eye,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { HotspotLocation, Incident, WasteCategory, RecurrenceClassification } from '../../types';
import { HotspotMap } from '../map/HotspotMap';
import { DemoBadge, DisclaimerBanner } from '../common/DemoBadge';
import { EvidenceImage } from '../common/EvidenceImage';

interface DashboardPageProps {
  locations: HotspotLocation[];
  incidents: Incident[];
  onSelectHotspot: (locationId: string) => void;
  onOpenUpload: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  locations,
  incidents,
  onSelectHotspot,
  onOpenUpload
}) => {
  const [filterClassification, setFilterClassification] = useState<string>('all');
  const [filterDrainOnly, setFilterDrainOnly] = useState<boolean>(false);
  const [selectedMapHotspotId, setSelectedMapHotspotId] = useState<string | undefined>(
    locations[0]?.id
  );

  // Compute key summary statistics
  const totalLocations = locations.length;
  const recurringHotspots = locations.filter((l) => l.classification === 'repeated').length;
  const emergingHotspots = locations.filter((l) => l.classification === 'emerging').length;
  const highPriorityCount = locations.filter(
    (l) => l.recurrenceScore >= 75 || l.drainRisk === 'critical_flood_hazard'
  ).length;
  const resolvedCount = locations.filter((l) => l.investigationStatus === 'verified_clean').length;
  const criticalDrainCount = locations.filter((l) => l.drainRisk === 'critical_flood_hazard' || l.drainRisk === 'severe').length;

  // Filtered hotspots for display
  const filteredHotspots = locations.filter((spot) => {
    if (filterClassification !== 'all' && spot.classification !== filterClassification) {
      return false;
    }
    if (filterDrainOnly && spot.drainRisk === 'none') {
      return false;
    }
    return true;
  });

  // Calculate waste category distribution
  const categoryCounts: Record<string, number> = {};
  incidents.forEach((inc) => {
    categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
  });
  const totalIncidentCount = incidents.length || 1;

  const categoryLabels: Record<WasteCategory, string> = {
    organic_market: 'Organic Market Produce',
    single_use_plastics: 'Single-Use Plastics & Bags',
    construction_debris: 'C&D Concrete & Rubble',
    drain_sludge_waste: 'Culvert Sludge & Occlusions',
    mixed_municipal: 'Mixed Domestic Municipal',
    commercial_packaging: 'Commercial Boxes & Polystyrene'
  };

  const categoryColors: Record<WasteCategory, string> = {
    organic_market: 'bg-emerald-500',
    single_use_plastics: 'bg-rose-500',
    construction_debris: 'bg-amber-600',
    drain_sludge_waste: 'bg-sky-600',
    mixed_municipal: 'bg-indigo-500',
    commercial_packaging: 'bg-teal-500'
  };

  // Recent 5 incidents
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 py-4">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Intelligence Dashboard
            </h1>
            <DemoBadge label="Live Ward Data" variant="emerald" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time recurrence monitoring, drain flood choke risk, and predictive civic work orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Submit Incident</span>
          </button>
        </div>
      </div>

      <DisclaimerBanner text="Notice: All metrics, hotspot locations, and historical recurrence logs shown below represent realistic synthetic benchmarks based on urban Bengaluru wards for demonstration." />

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reported Locations</span>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalLocations}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 5 monitored wards</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200/80 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recurring Hotspots</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{recurringHotspots}</div>
          <div className="text-[11px] text-rose-700/80 mt-1 font-medium">Recurrence score &gt; 70</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Emerging Patterns</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{emergingHotspots}</div>
          <div className="text-[11px] text-amber-700/80 mt-1 font-medium">Early relapse window</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-200/80 shadow-xs bg-sky-50/20">
          <div className="flex items-center justify-between text-sky-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Drain Hazard Sites</span>
            <Waves className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-600">{criticalDrainCount}</div>
          <div className="text-[11px] text-sky-700/80 mt-1 font-medium">Culvert occlusion risk</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified Clean</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{resolvedCount}</div>
          <div className="text-[11px] text-emerald-700/80 mt-1 font-medium">Ground-truth audited</div>
        </div>
      </div>

      {/* Main Section: Interactive Map + Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Spatiotemporal Hotspot Map</h2>
              <span className="text-xs text-slate-500">({filteredHotspots.length} matching locations)</span>
            </div>
            <p className="text-xs text-slate-500">
              Pins color-coded by recurrence classification and stormwater drain obstruction severity.
            </p>
          </div>

          {/* Map Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilterClassification('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterClassification === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterClassification('repeated')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterClassification === 'repeated' ? 'bg-rose-500 text-white font-bold' : 'text-slate-600'
                }`}
              >
                Repeated ({recurringHotspots})
              </button>
              <button
                onClick={() => setFilterClassification('emerging')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterClassification === 'emerging' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600'
                }`}
              >
                Emerging ({emergingHotspots})
              </button>
              <button
                onClick={() => setFilterClassification('one_time')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterClassification === 'one_time' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'
                }`}
              >
                One-Time
              </button>
            </div>

            <button
              onClick={() => setFilterDrainOnly(!filterDrainOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filterDrainOnly
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Drain Hazards Only</span>
            </button>
          </div>
        </div>

        {/* Leaflet Map Component */}
        <HotspotMap
          hotspots={filteredHotspots}
          selectedHotspotId={selectedMapHotspotId}
          onSelectHotspot={(id) => {
            setSelectedMapHotspotId(id);
            onSelectHotspot(id);
          }}
          height="440px"
        />
      </div>

      {/* Grid: Recurrence Trends & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recurrence Trends Chart (Interactive SVG) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recurrence Trends Over Time</h3>
              <p className="text-xs text-slate-500">Incident count progression vs repeat relapse alerts (30-day timeline)</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span>Cleared Incidents</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                <span>Recurring Relapses</span>
              </span>
            </div>
          </div>

          {/* SVG Trend Visualization */}
          <div className="h-56 w-full pt-4">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="30" x2="580" y2="30" stroke="#f1f5f9" strokeDasharray="4,4" />
              <line x1="40" y1="80" x2="580" y2="80" stroke="#f1f5f9" strokeDasharray="4,4" />
              <line x1="40" y1="130" x2="580" y2="130" stroke="#f1f5f9" strokeDasharray="4,4" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#e2e8f0" />

              {/* Y Axis labels */}
              <text x="25" y="35" fill="#94a3b8" fontSize="10" textAnchor="end">6</text>
              <text x="25" y="85" fill="#94a3b8" fontSize="10" textAnchor="end">4</text>
              <text x="25" y="135" fill="#94a3b8" fontSize="10" textAnchor="end">2</text>
              <text x="25" y="173" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>

              {/* Data bars (Weeks 1 to 4) */}
              {/* Week 1 */}
              <rect x="80" y="125" width="28" height="45" rx="4" fill="#10b981" opacity="0.85" />
              <rect x="112" y="145" width="28" height="25" rx="4" fill="#ef4444" opacity="0.85" />
              <text x="110" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Sep 10-16</text>

              {/* Week 2 */}
              <rect x="210" y="105" width="28" height="65" rx="4" fill="#10b981" opacity="0.85" />
              <rect x="242" y="95" width="28" height="75" rx="4" fill="#ef4444" opacity="0.85" />
              <text x="240" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Sep 17-23</text>

              {/* Week 3 */}
              <rect x="340" y="85" width="28" height="85" rx="4" fill="#10b981" opacity="0.85" />
              <rect x="372" y="65" width="28" height="105" rx="4" fill="#ef4444" opacity="0.85" />
              <text x="370" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Sep 24-30</text>

              {/* Week 4 (Recent) */}
              <rect x="470" y="65" width="28" height="105" rx="4" fill="#10b981" opacity="0.85" />
              <rect x="502" y="35" width="28" height="135" rx="4" fill="#ef4444" opacity="0.85" />
              <text x="500" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Oct 01-10</text>

              {/* Anomaly Callout */}
              <circle cx="516" cy="35" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <text x="516" y="20" fill="#dc2626" fontSize="10" fontWeight="bold" textAnchor="middle">
                Peak Relapse Surge
              </text>
            </svg>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span>
              <b>Insight:</b> Repeat occurrences surged in Week 4 driven by pre-monsoon culvert clogging and morning market unloads.
            </span>
            <button
              onClick={() => onSelectHotspot('loc_c_koramangala')}
              className="text-emerald-700 font-semibold hover:underline shrink-0"
            >
              Analyze Culvert →
            </button>
          </div>
        </div>

        {/* Waste Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Waste Category Share</h3>
            <p className="text-xs text-slate-500">Distribution across all {incidents.length} logged incidents</p>
          </div>

          <div className="space-y-3 pt-2">
            {(Object.keys(categoryCounts) as WasteCategory[]).map((cat) => {
              const count = categoryCounts[cat] || 0;
              const percent = Math.round((count / totalIncidentCount) * 100);
              const colorClass = categoryColors[cat] || 'bg-slate-500';

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700">{categoryLabels[cat] || cat}</span>
                    <span className="text-slate-500">{percent}% ({count})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorClass}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            <b>Key finding:</b> Organic market debris and stormwater culvert plastics account for &gt; 65% of all chronic recurring deposits.
          </div>
        </div>
      </div>

      {/* Priority-Ranked Hotspots Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Priority-Ranked Hotspots</h3>
            <p className="text-xs text-slate-500">Ranked by spatiotemporal recurrence score and immediate civic flood hazard</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">Click any row to open Deep Investigation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Hotspot & Ward</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Recurrence Score</th>
                <th className="py-3 px-4">Incidents</th>
                <th className="py-3 px-4">Avg Cadence</th>
                <th className="py-3 px-4">Drain Hazard</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {locations
                .sort((a, b) => b.recurrenceScore - a.recurrenceScore)
                .map((spot) => (
                  <tr
                    key={spot.id}
                    onClick={() => onSelectHotspot(spot.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{spot.name}</div>
                      <div className="text-[11px] font-normal text-slate-500">{spot.wardNumber}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          spot.classification === 'repeated'
                            ? 'bg-rose-100 text-rose-700'
                            : spot.classification === 'emerging'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {spot.classification}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-slate-900">{spot.recurrenceScore}/100</div>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              spot.recurrenceScore > 75
                                ? 'bg-rose-500'
                                : spot.recurrenceScore > 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${spot.recurrenceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium">
                      {spot.totalIncidents} ({spot.resolvedIncidents} clean)
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {spot.averageIntervalDays > 0 ? `~${spot.averageIntervalDays} days` : 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      {spot.drainRisk !== 'none' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                          <Waves className="w-3 h-3 text-sky-600" />
                          <span>{spot.drainRisk.replace(/_/g, ' ')}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Clear</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          spot.investigationStatus === 'verified_clean'
                            ? 'bg-emerald-50 text-emerald-700'
                            : spot.investigationStatus === 'action_planned'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {spot.investigationStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHotspot(spot.id);
                        }}
                        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-semibold group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Incident Feed */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Incident Activity</h3>
            <p className="text-xs text-slate-500">Photographic logs captured by civic cameras, marshals, and citizens</p>
          </div>
          <button
            onClick={onOpenUpload}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            + Upload New Photo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectHotspot(inc.locationId)}
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer flex gap-3 group"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <EvidenceImage
                  src={inc.photoUrl}
                  alt={inc.locationName}
                  fallbackText={inc.locationName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-xs font-bold text-slate-900 truncate">{inc.locationName}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(inc.reportedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="capitalize">{inc.reporterRole.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                    {inc.category.replace(/_/g, ' ')}
                  </span>
                  {inc.cleanupStatus === 'verified_clean' ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      ✓ Cleaned
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                      Active Alert
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
