import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Waves,
  ArrowRight,
  Filter,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  ChevronRight,
  List,
  Map as MapIcon,
  ShieldAlert,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { HotspotLocation, Incident, WasteCategory } from '../../types';
import { HotspotMap } from '../map/HotspotMap';
import { DemoBadge } from '../common/DemoBadge';

interface DashboardHeroProps {
  locations: HotspotLocation[];
  incidents: Incident[];
  onSelectHotspot: (locationId: string) => void;
  onOpenAnalysis: () => void;
  onNavigateToHotspots: () => void;
  onNavigateToPredictions?: () => void;
  onNavigateToSimulator?: () => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  locations,
  incidents,
  onSelectHotspot,
  onOpenAnalysis,
  onNavigateToHotspots,
  onNavigateToPredictions,
  onNavigateToSimulator
}) => {
  const [mapViewMode, setMapViewMode] = useState<'map' | 'list'>('map');
  const [filterClassification, setFilterClassification] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(locations[1]?.id || locations[0]?.id);

  // Compute metrics
  const totalLocations = locations.length;
  const recurringHotspots = locations.filter((l) => l.classification === 'repeated').length;
  const highPriorityRisks = locations.filter(
    (l) => l.recurrenceScore >= 75 || l.drainRisk === 'critical_flood_hazard'
  ).length;
  const resolvedHotspots = locations.filter((l) => l.investigationStatus === 'verified_clean').length;

  // Filtered hotspots for map & list
  const filteredHotspots = locations.filter((spot) => {
    if (filterClassification !== 'all' && spot.classification !== filterClassification) return false;
    if (filterCategory !== 'all' && spot.primaryCategory !== filterCategory) return false;
    return true;
  });

  const activeHotspot = locations.find((l) => l.id === selectedHotspotId) || locations[0];

  return (
    <div className="space-y-8">
      {/* 1. Welcome Header (Command Center Experience) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#137C62] bg-[#E4F4EC] px-2.5 py-0.5 rounded-md border border-[#C8F169]/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#137C62] animate-pulse"></span>
              Live Spatial Intelligence
            </span>
            <DemoBadge label="Benchmark Demo" variant="blue" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172B25] leading-tight">
            Waste doesn't disappear.{' '}
            <span className="text-[#137C62] underline decoration-[#C8F169] decoration-wavy underline-offset-8">
              Patterns reveal why.
            </span>
          </h1>

          <p className="text-sm text-[#74847C] max-w-2xl leading-relaxed">
            Investigate recurring waste. Find the cause. Prevent the next occurrence across Bengaluru Urban wards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAnalysis}
            className="flex items-center gap-2 bg-[#137C62] hover:bg-[#123D32] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all hover:shadow cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-[#C8F169]" />
            <span>Analyse Incident</span>
          </button>
        </div>
      </div>

      {/* 2. Intelligence Summary — 4 Metric Modules */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Module 1: Tracked Locations */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#74847C]">
            <span className="text-xs font-semibold uppercase tracking-wider">Tracked Locations</span>
            <MapPin className="w-4 h-4 text-[#74847C]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#172B25]">{totalLocations}</span>
            <span className="text-xs font-semibold text-[#137C62] bg-[#E4F4EC] px-1.5 py-0.5 rounded">
              Active Monitored
            </span>
          </div>
          <p className="text-[11px] text-[#74847C] flex items-center gap-1">
            Across 5 municipal ward corridors
          </p>
        </div>

        {/* Module 2: Recurring Hotspots */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#74847C]">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">Recurring Hotspots</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#172B25]">{recurringHotspots}</span>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              {Math.round((recurringHotspots / (totalLocations || 1)) * 100)}% of sites
            </span>
          </div>
          <p className="text-[11px] text-[#74847C]">
            Repeated accumulation &gt; 3 occurrences
          </p>
        </div>

        {/* Module 3: High-Priority Risks */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#74847C]">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">High-Priority Risks</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#172B25]">{highPriorityRisks}</span>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <Waves className="w-3 h-3 text-sky-600" />
              Drain Hazard
            </span>
          </div>
          <p className="text-[11px] text-[#74847C]">
            Severe culvert constriction or score &gt; 75
          </p>
        </div>

        {/* Module 4: Prevention Actions */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#74847C]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#137C62]">Prevention Actions</span>
            <CheckCircle2 className="w-4 h-4 text-[#137C62]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#172B25]">{resolvedHotspots}</span>
            <span className="text-xs font-semibold text-[#137C62] bg-[#E4F4EC] px-1.5 py-0.5 rounded">
              Verified Clean
            </span>
          </div>
          <p className="text-[11px] text-[#74847C]">
            Ground-truth dual photo verified
          </p>
        </div>
      </div>

      {/* 2.5 Strategic Decision Intelligence Suite (The 4 Distinctive Features) */}
      <div className="bg-linear-to-r from-[#123D32] to-[#137C62] rounded-3xl p-6 sm:p-7 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#C8F169] text-[#123D32] px-2 py-0.5 rounded">
                AI Waste Prevention Platform
              </span>
              <span className="text-xs text-white/80">From Detection to Decision Intelligence</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              Detect recurring waste → Predict risk → Simulate interventions → Measure results
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            {onNavigateToPredictions && (
              <button
                onClick={onNavigateToPredictions}
                className="px-4 py-2 rounded-xl bg-white text-[#123D32] hover:bg-[#F8FAF7] text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#137C62]" />
                <span>Hotspot Predictor</span>
              </button>
            )}
            {onNavigateToSimulator && (
              <button
                onClick={onNavigateToSimulator}
                className="px-4 py-2 rounded-xl bg-[#C8F169] text-[#123D32] hover:bg-[#b8e358] text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>What-If Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs space-y-1">
            <div className="font-bold text-[#C8F169] text-[11px]">1. Future Hotspot Predictor</div>
            <p className="text-[10px] text-white/80 leading-tight">Forecasts 1–7 day recurrence risk from historical trends.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs space-y-1">
            <div className="font-bold text-[#C8F169] text-[11px]">2. What-If Waste Simulator</div>
            <p className="text-[10px] text-white/80 leading-tight">Simulate schedule shifts and bin capacity side-by-side.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs space-y-1">
            <div className="font-bold text-[#C8F169] text-[11px]">3. Explainable AI Investigator</div>
            <p className="text-[10px] text-white/80 leading-tight">Evidence-backed reasons, data gaps & field verify steps.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs space-y-1">
            <div className="font-bold text-[#C8F169] text-[11px]">4. Prevention Impact Tracker</div>
            <p className="text-[10px] text-white/80 leading-tight">Quantifies before/after reduction with uncertainty bands.</p>
          </div>
        </div>
      </div>

      {/* 3. Main Visualisation: Hotspot Intelligence Map */}
      <div className="bg-white rounded-3xl border border-[#E4EAE5] p-6 shadow-xs space-y-4">
        {/* Map Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#172B25]">
                Hotspot Intelligence Map
              </h2>
              <span className="text-xs font-semibold text-[#74847C]">
                ({filteredHotspots.length} locations)
              </span>
            </div>
            <p className="text-xs text-[#74847C] mt-0.5">
              Spatiotemporal clustering showing recurrence scores and stormwater culvert hazard levels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Classification Filter Tabs */}
            <div className="flex items-center bg-[#F8FAF7] p-1 rounded-xl border border-[#E4EAE5] text-xs">
              <button
                onClick={() => setFilterClassification('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterClassification === 'all'
                    ? 'bg-white text-[#172B25] font-bold shadow-2xs'
                    : 'text-[#74847C]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterClassification('repeated')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterClassification === 'repeated'
                    ? 'bg-[#137C62] text-white font-bold shadow-2xs'
                    : 'text-[#74847C]'
                }`}
              >
                Chronic ({recurringHotspots})
              </button>
              <button
                onClick={() => setFilterClassification('emerging')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterClassification === 'emerging'
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'text-[#74847C]'
                }`}
              >
                Emerging
              </button>
            </div>

            {/* Map / List View Toggle */}
            <div className="flex items-center bg-[#F8FAF7] p-1 rounded-xl border border-[#E4EAE5] text-xs">
              <button
                onClick={() => setMapViewMode('map')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  mapViewMode === 'map' ? 'bg-white text-[#137C62] shadow-2xs' : 'text-[#74847C]'
                }`}
                title="Map View"
              >
                <MapIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMapViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  mapViewMode === 'list' ? 'bg-white text-[#137C62] shadow-2xs' : 'text-[#74847C]'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Map Container with Floating Hotspot Detail Panel */}
        <div className="relative">
          {mapViewMode === 'map' ? (
            <div className="relative w-full rounded-2xl overflow-hidden">
              <HotspotMap
                hotspots={filteredHotspots}
                selectedHotspotId={selectedHotspotId}
                onSelectHotspot={(id) => setSelectedHotspotId(id)}
                height="480px"
              />

              {/* Floating Hotspot Detail Card (Over the map on desktop) */}
              {activeHotspot && (
                <div className="hidden lg:block absolute bottom-4 right-4 z-[1000] w-84 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E4EAE5] shadow-lg space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        activeHotspot.classification === 'repeated'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : activeHotspot.classification === 'emerging'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {activeHotspot.classification} Hotspot
                    </span>
                    <span className="text-xs font-extrabold text-[#172B25]">
                      Score: {activeHotspot.recurrenceScore}/100
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#172B25] leading-snug">
                      {activeHotspot.name}
                    </h3>
                    <div className="text-[11px] text-[#74847C] mt-0.5">
                      {activeHotspot.wardNumber} • {activeHotspot.zone}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F8FAF7] p-2.5 rounded-xl border border-[#E4EAE5]">
                    <div>
                      <span className="text-[#74847C] block">Incidents:</span>
                      <b className="text-[#172B25]">{activeHotspot.totalIncidents} reports</b>
                    </div>
                    <div>
                      <span className="text-[#74847C] block">Average Interval:</span>
                      <b className="text-[#172B25]">
                        {activeHotspot.averageIntervalDays > 0 ? `~${activeHotspot.averageIntervalDays}d` : 'Isolated'}
                      </b>
                    </div>
                  </div>

                  {activeHotspot.drainRisk !== 'none' && (
                    <div className="text-[11px] text-sky-800 bg-sky-50 px-2.5 py-1.5 rounded-xl border border-sky-200 flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>
                        <b>Drain Alert:</b> {activeHotspot.drainRisk.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => onSelectHotspot(activeHotspot.id)}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#137C62] hover:bg-[#123D32] text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Inspect Investigation Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* List View Alternative */
            <div className="divide-y divide-[#E4EAE5] border border-[#E4EAE5] rounded-2xl overflow-hidden bg-white">
              {filteredHotspots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => onSelectHotspot(spot.id)}
                  className="p-4 flex items-center justify-between hover:bg-[#F8FAF7] transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#172B25]">{spot.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          spot.classification === 'repeated'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {spot.classification}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#74847C]">
                      {spot.wardNumber} • {spot.totalIncidents} incidents • Recurrence Score: {spot.recurrenceScore}/100
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="text-xs font-bold text-[#137C62] hover:underline flex items-center gap-1">
                      <span>Investigate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Grid: Recurring Patterns Ranked List + Distinctive AI Insight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recurring Patterns Panel (Ranked List) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E4EAE5] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#172B25]">
                Recurring Patterns Leaderboard
              </h3>
              <p className="text-xs text-[#74847C]">
                Hotspots ranked by empirical recurrence velocity & environmental choke hazards
              </p>
            </div>
            <button
              onClick={onNavigateToHotspots}
              className="text-xs font-bold text-[#137C62] hover:underline flex items-center gap-1"
            >
              <span>View All Hotspots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {locations
              .sort((a, b) => b.recurrenceScore - a.recurrenceScore)
              .slice(0, 4)
              .map((spot, idx) => (
                <div
                  key={spot.id}
                  onClick={() => onSelectHotspot(spot.id)}
                  className="p-4 rounded-2xl border border-[#E4EAE5] hover:border-[#137C62]/40 hover:bg-[#F8FAF7] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#F8FAF7] border border-[#E4EAE5] text-[#74847C] font-bold text-xs flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#172B25] group-hover:text-[#137C62] transition-colors">
                          {spot.name}
                        </h4>
                        {spot.drainRisk === 'critical_flood_hazard' && (
                          <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded border border-sky-200">
                            Culvert Hazard
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#74847C]">
                        {spot.wardNumber} • {spot.totalIncidents} incidents • Cadence: {spot.averageIntervalDays > 0 ? `~${spot.averageIntervalDays}d` : 'Single'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-[#172B25]">
                        Score: {spot.recurrenceScore}/100
                      </div>
                      <div className="text-[10px] text-[#74847C]">
                        Last: {new Date(spot.lastReportedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#74847C] group-hover:text-[#137C62] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Distinctive, Restrained AI Insight Panel */}
        <div className="bg-[#123D32] rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-[#C8F169] text-[#123D32] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#123D32]" />
                Pattern Detected
              </span>
              <span className="text-[10px] text-[#E4F4EC]/60 font-mono">
                Model: Gemini 3.8 Flash
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white leading-snug">
                KR Market Gate 4 Commercial Waste Cycle
              </h4>
              <p className="text-xs text-[#E4F4EC]/90 leading-relaxed">
                “Repeated waste accumulation has been recorded near this market location. Collection frequency and commercial waste disposal are possible contributing factors.”
              </p>
            </div>

            {/* Supporting evidence chips */}
            <div className="space-y-1.5 pt-1 text-[11px] text-[#E4F4EC]/80">
              <div className="font-semibold text-white">Supporting Evidence:</div>
              <div className="space-y-1 pl-1">
                <div>• 4 recurring events timestamped 05:45 - 06:15 IST</div>
                <div>• Produce packaging matches wholesale truck unloads</div>
                <div>• Compactor truck route reaches market 3.5h later</div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#E4F4EC]/70">
              <span>Uncertainty Level: <b>Low (92% Conf.)</b></span>
              <span className="italic">Illustrative demo finding</span>
            </div>
          </div>

          <button
            onClick={() => onSelectHotspot('loc_b_krmarket')}
            className="w-full flex items-center justify-center gap-2 bg-[#C8F169] hover:bg-white text-[#123D32] py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span>View Complete Investigation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
