import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  TrendingDown,
  Waves,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { HotspotLocation, Incident, PreventionTask } from '../../types';
import { SAMPLE_IMAGES } from '../../services/seedData';
import { DemoBadge, DisclaimerBanner } from '../common/DemoBadge';
import { EvidenceImage } from '../common/EvidenceImage';
import { PreventionImpactTracker } from '../tracker/PreventionImpactTracker';

interface ImpactAnalyticsProps {
  locations: HotspotLocation[];
  incidents: Incident[];
  tasks: PreventionTask[];
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const ImpactAnalytics: React.FC<ImpactAnalyticsProps> = ({
  locations,
  incidents,
  tasks,
  onShowToast
}) => {
  // Weekly trend data for Recharts
  const trendData = [
    { period: 'Week 1 (Sep 10-16)', oneTime: 1, recurring: 1, cleared: 1 },
    { period: 'Week 2 (Sep 17-23)', oneTime: 0, recurring: 3, cleared: 1 },
    { period: 'Week 3 (Sep 24-30)', oneTime: 2, recurring: 2, cleared: 2 },
    { period: 'Week 4 (Oct 01-10)', oneTime: 1, recurring: 4, cleared: 3 }
  ];

  // Category distribution data for PieChart
  const categoryData = [
    { name: 'Organic Market Produce', value: 4, color: '#137C62' },
    { name: 'Culvert Sludge & Plastics', value: 4, color: '#0284C7' },
    { name: 'Commercial Packaging', value: 2, color: '#D97706' },
    { name: 'C&D Debris Rubble', value: 1, color: '#78716C' },
    { name: 'Mixed Municipal', value: 1, color: '#6366F1' }
  ];

  // Recurrence interval cadence data
  const intervalData = [
    { interval: '1-3 Days', count: 1 },
    { interval: '4-7 Days', count: 5 },
    { interval: '8-14 Days', count: 3 },
    { interval: '15+ Days', count: 1 }
  ];

  const handleExportFullReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      locationsCount: locations.length,
      incidentsCount: incidents.length,
      tasksCount: tasks.length,
      resolvedTasksCount: tasks.filter((t) => t.status === 'resolved').length,
      summary: 'WasteShadow AI Civic Impact & Spatiotemporal Recurrence Audit'
    };

    const str = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(report, null, 2))}`;
    const a = document.createElement('a');
    a.href = str;
    a.download = 'WasteShadow_Impact_Analytics.json';
    a.click();
    a.remove();
    onShowToast('success', 'Analytics Exported', 'Full impact metrics downloaded as JSON.');
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#172B25] tracking-tight">
              Impact Analytics
            </h1>
            <DemoBadge label="Synthetic Benchmarks" variant="blue" />
          </div>
          <p className="text-xs text-[#74847C] mt-0.5">
            Empirical evaluation of recurrence trends, drain clogging prevention, and ground-truth verification progress.
          </p>
        </div>

        <button
          onClick={handleExportFullReport}
          className="flex items-center gap-1.5 bg-[#137C62] hover:bg-[#123D32] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#C8F169]" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      <DisclaimerBanner text="Data Integrity Notice: Charts below illustrate synthetic model estimates benchmarked against urban Bengaluru municipal wards. Ground-truth audited tasks require dual before-and-after photo evidence." />

      {/* Top 4 Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#74847C] text-xs font-bold uppercase">
            <span>Relapse Reduction</span>
            <TrendingDown className="w-4 h-4 text-[#137C62]" />
          </div>
          <div className="text-3xl font-extrabold text-[#172B25]">84%</div>
          <div className="text-[11px] text-[#74847C]">When schedule shifted to 04:30 AM</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#74847C] text-xs font-bold uppercase">
            <span>Culvert De-silting</span>
            <Waves className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#172B25]">3.2 Days</div>
          <div className="text-[11px] text-[#74847C]">Faster intervention before monsoon surge</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#74847C] text-xs font-bold uppercase">
            <span>Ground-Truth Audits</span>
            <CheckCircle2 className="w-4 h-4 text-[#137C62]" />
          </div>
          <div className="text-3xl font-extrabold text-[#172B25]">100%</div>
          <div className="text-[11px] text-[#74847C]">Verified with after-cleanup photo proof</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#74847C] text-xs font-bold uppercase">
            <span>Average Cadence</span>
            <Clock className="w-4 h-4 text-[#74847C]" />
          </div>
          <div className="text-3xl font-extrabold text-[#172B25]">7.2 Days</div>
          <div className="text-[11px] text-[#74847C]">Inter-event recurrence interval</div>
        </div>
      </div>

      {/* Recharts Trend Line + Waste Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recurrence vs One-Time Bar/Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E4EAE5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#172B25]">
                Weekly Recurrence vs Resolution Progression
              </h3>
              <p className="text-xs text-[#74847C]">30-Day observation across monitored wards</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#74847C]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#137C62]"></span>
                <span>Cleared & Verified</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                <span>Recurring Relapses</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F2" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#74847C' }} />
                <YAxis tick={{ fontSize: 11, fill: '#74847C' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E4EAE5',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="cleared" fill="#137C62" radius={[4, 4, 0, 0]} name="Cleared Incidents" />
                <Bar dataKey="recurring" fill="#E11D48" radius={[4, 4, 0, 0]} name="Recurring Relapses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="bg-white p-6 rounded-3xl border border-[#E4EAE5] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#172B25]">
              Waste Category Breakdown
            </h3>
            <p className="text-xs text-[#74847C]">Proportion across all logged incidents</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E4EAE5',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-[11px] text-[#74847C]">
            {categoryData.slice(0, 3).map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>
                  <span>{c.name}</span>
                </span>
                <b className="text-[#172B25]">{c.value} events</b>
              </div>
            ))}
        </div>
      </div>

      {/* Embedded Feature: Prevention Impact Tracker (Outcome Measurement & Uncertainty Quantification) */}
      <PreventionImpactTracker
        locations={locations}
        incidents={incidents}
        tasks={tasks}
        selectedLocationId={locations[0]?.id || 'loc_b_krmarket'}
        onSelectLocation={() => {}}
        onNavigateToHotspots={() => {}}
      />

      {/* Before and After Ground-Truth Photo Comparison Matrix */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4EAE5] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#172B25]">
            Before & After Photographic Verification Matrix
          </h3>
          <p className="text-xs text-[#74847C]">
            Ground-truth audit demonstrating physical resolution of reported blackspots
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Location A: Indiranagar Before / After */}
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#172B25]">
                Indiranagar 12th Main Road (Ward 84)
              </span>
              <span className="text-[10px] font-bold text-[#137C62] bg-[#E4F4EC] px-2 py-0.5 rounded">
                Verified Clean (Zero Relapse)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-rose-700">Before (Oct 02)</div>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#123D32]">
                  <EvidenceImage src={SAMPLE_IMAGES.indiranagar_before} alt="Before" fallbackText="Before Cleanup" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#137C62]">After Cleaned (Oct 03)</div>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#123D32]">
                  <EvidenceImage src={SAMPLE_IMAGES.indiranagar_after} alt="After" fallbackText="Verified Clean" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#74847C]">
              Post-festival dry waste cleared by ward compactor and footpath disinfected. Monitored 14 days with zero relapse.
            </p>
          </div>

          {/* Location C: Koramangala Culvert Relapse Alert */}
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#172B25]">
                Koramangala 80ft Drain Culvert (Ward 151)
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Chronic Culvert Relapse
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#74847C]">Relapse 1 (Sept 26)</div>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#123D32]">
                  <EvidenceImage src={SAMPLE_IMAGES.drain_incident_1} alt="Sept 26" fallbackText="Relapse 1" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-rose-700">Relapse 2 (Oct 09)</div>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#123D32]">
                  <EvidenceImage src={SAMPLE_IMAGES.drain_incident_2} alt="Oct 09" fallbackText="Relapse 2" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#74847C]">
              Structural culvert choking recurrence proved: requires automated mechanical trash rack rather than manual sweeping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
