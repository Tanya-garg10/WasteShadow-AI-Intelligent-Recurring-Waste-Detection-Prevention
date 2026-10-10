import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Clock,
  Layers,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BarChart3,
  Waves
} from 'lucide-react';
import { DemoBadge } from '../common/DemoBadge';

interface LandingPageProps {
  onExploreDashboard: () => void;
  onAnalyzeHotspot: () => void;
  onSelectHotspot: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDashboard,
  onAnalyzeHotspot,
  onSelectHotspot
}) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 p-8 sm:p-14 border border-emerald-100 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-First Civic Tech for Indian Municipalities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Don't just clean the waste.{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Stop it from coming back.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Standard grievance apps simply dispatch sweepers to clear garbage piles that reappear 48 hours later.
            <b> WasteShadow AI</b> models historical recurrence, detects storm drain flood risks, and uncovers structural root causes to permanently break the relapse loop.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onExploreDashboard}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all text-sm cursor-pointer"
            >
              <span>Explore AI Intelligence Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onAnalyzeHotspot}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-3 rounded-xl border border-slate-300 shadow-sm text-sm transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>Log & Analyze a Hotspot</span>
            </button>
          </div>

          {/* Quick Demo Scenario Jumpers */}
          <div className="pt-6 border-t border-slate-200/80 mt-8">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-center gap-2">
              <span>Inspect Seeded Benchmark Scenarios:</span>
              <DemoBadge label="Curated Demo Scenarios" variant="emerald" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <button
                onClick={() => onSelectHotspot('loc_a_indiranagar')}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                    Location A • One-Time
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate">Indiranagar 12th Main Road</div>
                <div className="text-[11px] text-slate-500">Cleaned & verified; zero recurrence relapse.</div>
              </button>

              <button
                onClick={() => onSelectHotspot('loc_b_krmarket')}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                    Location B • Chronic Market
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-amber-600">→</span>
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate">KR Vegetable Market Gate 4</div>
                <div className="text-[11px] text-slate-500">Recurred 4 times in 22 days; schedule mismatch.</div>
              </button>

              <button
                onClick={() => onSelectHotspot('loc_c_koramangala')}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded">
                    Location C • Drain Hazard
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-rose-600">→</span>
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate">Koramangala 80ft Drain Culvert</div>
                <div className="text-[11px] text-slate-500">85% blocked culvert grill; severe monsoon risk.</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrative Benchmark Impact Metrics */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Municipal Impact Potential</h3>
            <p className="text-xs text-slate-500">Projected metrics based on field trial simulations across Bengaluru Urban wards</p>
          </div>
          <DemoBadge label="Synthetic Benchmark Data" variant="blue" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold mb-1">
              <TrendingDown className="w-4 h-4" />
              <span>Repeat Hotspots</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">84%</div>
            <div className="text-xs text-slate-600 mt-1">Reduction in chronic dumping relapses via root-cause intervention</div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100">
            <div className="flex items-center gap-2 text-sky-700 text-xs font-semibold mb-1">
              <Waves className="w-4 h-4" />
              <span>Storm Drain Protection</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">3.2 Days</div>
            <div className="text-xs text-slate-600 mt-1">Faster pre-monsoon culvert de-silting before flood trigger</div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-1">
              <Clock className="w-4 h-4" />
              <span>Collection Alignment</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">92%</div>
            <div className="text-xs text-slate-600 mt-1">Route synchronization with early-morning wholesale unloading</div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>Ground Truth Audits</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</div>
            <div className="text-xs text-slate-600 mt-1">Verified with dual-photo timestamped evidence logs</div>
          </div>
        </div>
      </section>

      {/* The 4-Step Solution Architecture */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How WasteShadow AI Solves The Recurrence Trap
          </h2>
          <p className="text-sm text-slate-600">
            Moving civic administration from reactive manual sweeping to proactive infrastructure prevention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">Photographic AI Ingestion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens and sanitation marshals capture geo-tagged incident photos. The vision model identifies waste categories, volumetric severity, and proximity to open drains.
            </p>
            <div className="text-[11px] text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg">
              ✓ Detects plastic clogging, market refuse, C&D rubble
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">Recurrence Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clusters incidents within spatial radii (&lt; 80m). Calculates frequency, average interval between cleanups, and category persistence to classify hotspots into One-Time, Emerging, or Repeated.
            </p>
            <div className="text-[11px] text-teal-700 font-medium bg-teal-50 p-2 rounded-lg">
              ✓ Algorithmic mathematical recurrence scoring (0-100)
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">Root-Cause Hypotheses</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Correlates dump timing with municipal truck routes, commercial markets, and infrastructure gaps to generate evidence-backed hypotheses with uncertainty ratings and validation steps.
            </p>
            <div className="text-[11px] text-amber-700 font-medium bg-amber-50 p-2 rounded-lg">
              ✓ Eliminates guesswork; distinguishes facts from assumptions
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base">Targeted Prevention Tasks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Issues actionable civic engineering work orders—such as shifting vehicle arrival times, installing culvert trash grates, or deploying secondary bins—verified only with post-cleanup photos.
            </p>
            <div className="text-[11px] text-purple-700 font-medium bg-purple-50 p-2 rounded-lg">
              ✓ Work order workflow with verified audit logs
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Ready to break the recurring garbage cycle in your ward?
        </h2>
        <p className="text-emerald-100/80 max-w-xl mx-auto text-sm leading-relaxed">
          Explore the live interactive dashboard with pre-loaded Bengaluru ward data, test the recurrence calculation engine, or submit a new incident photograph for instant AI analysis.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onExploreDashboard}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all text-sm cursor-pointer"
          >
            Open Intelligence Dashboard
          </button>
          <button
            onClick={onAnalyzeHotspot}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 transition-all text-sm cursor-pointer"
          >
            Upload Test Photo
          </button>
        </div>
      </section>
    </div>
  );
};
