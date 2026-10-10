import React, { useState } from 'react';
import {
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowDownRight,
  Sparkles,
  Info,
  Scale,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { HotspotLocation, Incident, PreventionTask } from '../../types';
import {
  computePreventionImpactMetrics,
  PreventionImpactMetric
} from '../../services/impactTrackerEngine';
import { DemoBadge } from '../common/DemoBadge';

interface PreventionImpactTrackerProps {
  locations: HotspotLocation[];
  incidents: Incident[];
  tasks: PreventionTask[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  onNavigateToHotspots: () => void;
}

export const PreventionImpactTracker: React.FC<PreventionImpactTrackerProps> = ({
  locations,
  incidents,
  tasks,
  selectedLocationId,
  onSelectLocation,
  onNavigateToHotspots
}) => {
  const [activeLocId, setActiveLocId] = useState<string>(selectedLocationId || locations[0]?.id);
  const activeLoc = locations.find((l) => l.id === activeLocId) || locations[0];

  const impact: PreventionImpactMetric = computePreventionImpactMetrics(
    activeLoc,
    incidents,
    tasks
  );

  return (
    <div className="bg-white rounded-3xl border border-[#E4EAE5] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-[#E4EAE5] bg-linear-to-r from-[#F8FAF7] via-white to-[#F0FDF4]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#E4F4EC] text-[#137C62]">
                <TrendingDown className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#137C62]">
                Feature 4: Outcome Measurement Engine
              </span>
              <DemoBadge label="Prevention Verification" variant="green" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B25] tracking-tight">
              Prevention Impact Tracker
            </h2>
            <p className="text-xs sm:text-sm text-[#74847C] max-w-2xl leading-relaxed">
              Measures whether preventive interventions actually stopped recurrence. Compares pre- vs post-intervention incident frequencies with scientific uncertainty quantification.
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
        {/* Top 4 Performance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recurrence Drop */}
          <div className="p-5 rounded-2xl bg-[#E4F4EC] border border-[#C8F169] space-y-2">
            <div className="flex items-center justify-between text-[#123D32]">
              <span className="text-xs font-bold uppercase tracking-wider">Recurrence Reduction</span>
              <TrendingDown className="w-4 h-4 text-[#137C62]" />
            </div>
            <div className="text-3xl font-black text-[#137C62]">
              -{impact.recurrenceDropPercent}%
            </div>
            <p className="text-[11px] text-[#123D32]">
              From {impact.preInterventionIncidentsPerMonth} events/mo to {impact.postInterventionIncidentsPerMonth}/mo
            </p>
          </div>

          {/* Days Relapse-Free */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-2">
            <div className="flex items-center justify-between text-[#74847C]">
              <span className="text-xs font-bold uppercase tracking-wider">Consecutive Clean Days</span>
              <Calendar className="w-4 h-4 text-[#137C62]" />
            </div>
            <div className="text-3xl font-black text-[#172B25]">
              {impact.daysElapsedSinceLastRelapse} Days
            </div>
            <p className="text-[11px] text-[#74847C]">
              Zero relapse logged since last audit
            </p>
          </div>

          {/* Prevented Waste Tons */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-2">
            <div className="flex items-center justify-between text-[#74847C]">
              <span className="text-xs font-bold uppercase tracking-wider">Prevented Waste Volume</span>
              <Sparkles className="w-4 h-4 text-[#137C62]" />
            </div>
            <div className="text-3xl font-black text-[#172B25]">
              ~{impact.preventedWasteTonsEstimate} Tons
            </div>
            <p className="text-[11px] text-[#74847C]">
              Cumulative waste averted from drains/roads
            </p>
          </div>

          {/* Verification Status */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-2">
            <div className="flex items-center justify-between text-[#74847C]">
              <span className="text-xs font-bold uppercase tracking-wider">Outcome Confidence</span>
              <ShieldCheck className="w-4 h-4 text-[#137C62]" />
            </div>
            <div className="text-xl font-extrabold text-[#172B25]">
              {impact.status}
            </div>
            <p className="text-[11px] text-[#74847C]">
              Audit confidence: {impact.uncertaintyBand.sampleConfidenceScore}%
            </p>
          </div>
        </div>

        {/* Pre- vs Post-Intervention Recharts Comparison */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4EAE5] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#172B25]">
                Monthly Incident Frequency: Pre- vs Post-Intervention Audit
              </h3>
              <p className="text-xs text-[#74847C]">
                Monitors repeat incidents across baseline and active prevention phases
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-3 h-3 rounded bg-rose-500" />
                Pre-Intervention Incidents
              </span>
              <span className="flex items-center gap-1.5 text-[#137C62]">
                <span className="w-3 h-3 rounded bg-[#137C62]" />
                Post-Intervention Incidents
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impact.monthlyAuditLog} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4EAE5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#74847C' }} />
                <YAxis tick={{ fontSize: 11, fill: '#74847C' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#123D32] text-white p-3 rounded-xl text-xs space-y-1 shadow-md">
                          <div className="font-bold">{data.month}</div>
                          <div>Pre-Intervention: <b>{data.beforeCount} events</b></div>
                          <div>Post-Intervention: <b>{data.afterCount} events</b></div>
                          <div className="text-[10px] text-[#C8F169] font-bold">
                            Phase: {data.status}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="beforeCount" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={28} />
                <Bar dataKey="afterCount" fill="#137C62" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scientific Uncertainty Quantification & Caveat Banner */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>Scientific Uncertainty Quantification (Anti-Hype Discipline)</span>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed">
            {impact.uncertaintyBand.caveatText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-white border border-amber-200/80 text-xs space-y-0.5">
              <div className="text-[10px] font-bold text-[#74847C] uppercase">Conservative Estimate</div>
              <div className="text-base font-black text-[#172B25]">-{impact.uncertaintyBand.minDropPercent}%</div>
              <div className="text-[10px] text-[#74847C]">Lower bound confidence interval</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-amber-200/80 text-xs space-y-0.5">
              <div className="text-[10px] font-bold text-[#137C62] uppercase">Observed Median</div>
              <div className="text-base font-black text-[#137C62]">-{impact.uncertaintyBand.expectedDropPercent}%</div>
              <div className="text-[10px] text-[#74847C]">Primary field audit point estimate</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-amber-200/80 text-xs space-y-0.5">
              <div className="text-[10px] font-bold text-[#74847C] uppercase">Peak Mitigation</div>
              <div className="text-base font-black text-[#172B25]">-{impact.uncertaintyBand.maxDropPercent}%</div>
              <div className="text-[10px] text-[#74847C]">Upper bound during dry weather</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
