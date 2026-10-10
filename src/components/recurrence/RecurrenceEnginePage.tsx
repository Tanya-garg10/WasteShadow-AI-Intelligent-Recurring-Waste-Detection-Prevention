import React, { useState } from 'react';
import {
  Layers,
  Calculator,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { HotspotLocation, Incident } from '../../types';
import { computeRecurrenceMetrics } from '../../services/recurrenceEngine';
import { DemoBadge } from '../common/DemoBadge';

interface RecurrenceEnginePageProps {
  locations: HotspotLocation[];
  incidents: Incident[];
  onSelectHotspot: (locationId: string) => void;
}

export const RecurrenceEnginePage: React.FC<RecurrenceEnginePageProps> = ({
  locations,
  incidents,
  onSelectHotspot
}) => {
  // Interactive Simulator State
  const [simCount, setSimCount] = useState<number>(4);
  const [simInterval, setSimInterval] = useState<number>(7);
  const [simCategoryMatch, setSimCategoryMatch] = useState<number>(85);
  const [simRelapses, setSimRelapses] = useState<number>(2);

  // Compute simulated recurrence score
  const freqScore = Math.min(35, Math.round(simCount * 8.5));
  let intervalScore = 0;
  if (simInterval <= 10) intervalScore = 24;
  else if (simInterval <= 20) intervalScore = 16;
  else intervalScore = 8;

  const catScore = Math.min(20, Math.round(20 * (simCategoryMatch / 100)));
  const relapseScore = Math.min(20, simRelapses * 10);
  const simTotalScore = Math.min(100, Math.max(5, freqScore + intervalScore + catScore + relapseScore));

  let simClassification: 'one_time' | 'emerging' | 'repeated' = 'one_time';
  if (simCount >= 3 || (simCount === 2 && simInterval <= 14)) {
    simClassification = 'repeated';
  } else if (simCount === 2) {
    simClassification = 'emerging';
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recurrence Intelligence Engine
          </h1>
          <DemoBadge label="Algorithmic Core" variant="emerald" />
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Why traditional apps fail: an identical-looking photo is not proof of recurrence. WasteShadow AI unifies geographic proximity (Haversine &lt; 80m), temporal cadence, material consistency, and post-cleanup relapses.
        </p>
      </div>

      {/* Algorithmic Formula Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Documented Mathematical Logic
            </span>
            <h2 className="text-xl font-bold mt-1">Multi-Factor Recurrence Scoring (0 - 100)</h2>
          </div>
          <div className="px-3 py-1 rounded-xl bg-white/10 text-xs font-mono text-emerald-300 border border-white/10">
            R_score = w₁·F + w₂·C_int + w₃·P_cat + w₄·Relapse
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase">1. Frequency (35 Pts)</div>
            <div className="text-sm font-semibold text-white">Event Count in Spatial Radius</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clusters reports within 80m radius. Scaled non-linearly with total count and time span.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-teal-400 uppercase">2. Cadence (25 Pts)</div>
            <div className="text-sm font-semibold text-white">Interval Regularity & Cadence</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detects weekly or bi-weekly unloading cycles via low standard deviation of inter-event days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase">3. Category (20 Pts)</div>
            <div className="text-sm font-semibold text-white">Material Persistence</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jaccard similarity of waste profiles. Persistent same-category dumps reflect specific commercial origins.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-rose-400 uppercase">4. Relapse (20 Pts)</div>
            <div className="text-sm font-semibold text-white">Post-Cleanup Relapse Penalty</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If garbage reappears after an official cleanup, it definitively indicates an unresolved operational mismatch.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Recurrence Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Interactive Recurrence Score Simulator</h3>
              <p className="text-xs text-slate-500">Test how varying cadence and post-cleanup relapses dynamically alter hotspot classification.</p>
            </div>
          </div>
          <DemoBadge label="Interactive Model" variant="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Total Recorded Incidents in 30 Days</span>
                <span className="text-emerald-700 font-bold">{simCount} incidents</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={simCount}
                onChange={(e) => setSimCount(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Average Interval Between Recurrences</span>
                <span className="text-teal-700 font-bold">{simInterval} days</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={simInterval}
                onChange={(e) => setSimInterval(parseInt(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Waste Category Persistence (%)</span>
                <span className="text-amber-700 font-bold">{simCategoryMatch}% match</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={simCategoryMatch}
                onChange={(e) => setSimCategoryMatch(parseInt(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Post-Cleanup Relapses</span>
                <span className="text-rose-700 font-bold">{simRelapses} relapses</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={simRelapses}
                onChange={(e) => setSimRelapses(parseInt(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>
          </div>

          {/* Real-time Calculation Result Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Calculated Recurrence Score
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  simClassification === 'repeated'
                    ? 'bg-rose-100 text-rose-800'
                    : simClassification === 'emerging'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {simClassification} Hotspot
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900">{simTotalScore}</span>
              <span className="text-base text-slate-400 font-bold">/ 100</span>
            </div>

            {/* Score Breakdown Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-semibold text-slate-600">Metric Contribution:</div>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="bg-emerald-100/80 p-2 rounded-lg text-emerald-900">
                  <div className="font-bold">{freqScore} pts</div>
                  <div>Frequency</div>
                </div>
                <div className="bg-teal-100/80 p-2 rounded-lg text-teal-900">
                  <div className="font-bold">{intervalScore} pts</div>
                  <div>Interval</div>
                </div>
                <div className="bg-amber-100/80 p-2 rounded-lg text-amber-900">
                  <div className="font-bold">{catScore} pts</div>
                  <div>Category</div>
                </div>
                <div className="bg-rose-100/80 p-2 rounded-lg text-rose-900">
                  <div className="font-bold">{relapseScore} pts</div>
                  <div>Relapse</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-200">
              {simTotalScore >= 75
                ? 'High chronic recurrence: Immediate preventive civic work order needed.'
                : simTotalScore >= 45
                ? 'Emerging hotspot: Schedule secondary bin placement to stop consolidation.'
                : 'Isolated occurrence: Standard routine sweeping protocol sufficient.'}
            </p>
          </div>
        </div>
      </div>

      {/* Seeded Hotspots Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Seeded Benchmark Hotspot Comparison</h3>
          <p className="text-xs text-slate-500">Comparative recurrence evaluation of the three hackathon demo scenarios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.slice(0, 3).map((loc) => {
            const locIncidents = incidents.filter((i) => i.locationId === loc.id);
            const metrics = computeRecurrenceMetrics(locIncidents);

            return (
              <div
                key={loc.id}
                onClick={() => onSelectHotspot(loc.id)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group bg-white"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        loc.classification === 'repeated'
                          ? 'bg-rose-100 text-rose-800'
                          : loc.classification === 'emerging'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {loc.classification}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      Score: {loc.recurrenceScore}/100
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    {loc.name}
                  </h4>
                  <div className="text-xs text-slate-500">{loc.wardNumber}</div>

                  <div className="space-y-1 pt-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Total Incidents:</span>
                      <b>{loc.totalIncidents}</b>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Cadence:</span>
                      <b>{loc.averageIntervalDays > 0 ? `${loc.averageIntervalDays} days` : 'N/A (Single)'}</b>
                    </div>
                    <div className="flex justify-between">
                      <span>First Recorded:</span>
                      <span>{new Date(loc.firstReportedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latest Recorded:</span>
                      <span>{new Date(loc.lastReportedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {metrics.explanation}
                  </p>
                  <button className="w-full py-2 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5">
                    <span>Investigate Hotspot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
