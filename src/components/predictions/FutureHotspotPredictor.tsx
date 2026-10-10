import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Calendar,
  CloudRain,
  MapPin,
  ShieldAlert,
  ChevronRight,
  Info,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { HotspotLocation, Incident } from '../../types';
import { generatePredictiveRiskAssessment, PredictiveRiskAssessment } from '../../services/predictiveEngine';
import { DemoBadge } from '../common/DemoBadge';

interface FutureHotspotPredictorProps {
  locations: HotspotLocation[];
  incidents: Incident[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  onOpenSimulator: () => void;
}

export const FutureHotspotPredictor: React.FC<FutureHotspotPredictorProps> = ({
  locations,
  incidents,
  selectedLocationId,
  onSelectLocation,
  onOpenSimulator
}) => {
  const [activeLocId, setActiveLocId] = useState<string>(selectedLocationId || locations[0]?.id);

  const activeLoc = locations.find((l) => l.id === activeLocId) || locations[0];
  const assessment: PredictiveRiskAssessment = generatePredictiveRiskAssessment(activeLoc, incidents);

  return (
    <div className="bg-white rounded-3xl border border-[#E4EAE5] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-[#E4EAE5] bg-linear-to-r from-[#F8FAF7] via-white to-[#F0FDF4]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#E4F4EC] text-[#137C62]">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#137C62]">
                Feature 1: Predictive Decision Intelligence
              </span>
              <DemoBadge label="Historical Trend Engine" variant="green" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B25] tracking-tight">
              Future Hotspot Predictor
            </h2>
            <p className="text-xs sm:text-sm text-[#74847C] max-w-2xl leading-relaxed">
              Calculates recurrence risk probability over the next 1–7 days based on historical cadence, monsoon catchment telemetry, and commercial dumping cycles.
            </p>
          </div>

          {/* Location Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {locations.slice(0, 3).map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setActiveLocId(loc.id);
                  onSelectLocation(loc.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  loc.id === activeLocId
                    ? 'bg-[#123D32] text-white shadow-xs'
                    : 'bg-[#F8FAF7] text-[#74847C] hover:text-[#172B25] hover:bg-[#E4EAE5]'
                }`}
              >
                {loc.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Top 3 High-Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Risk Level Badge */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#74847C] uppercase tracking-wider">
                Recurrence Risk Level
              </span>
              <AlertTriangle className={`w-4 h-4 ${
                assessment.riskLevel === 'Severe Imminent' ? 'text-rose-600' : assessment.riskLevel === 'High' ? 'text-amber-500' : 'text-[#137C62]'
              }`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${
                assessment.riskLevel === 'Severe Imminent' ? 'text-rose-600' : assessment.riskLevel === 'High' ? 'text-amber-600' : 'text-[#137C62]'
              }`}>
                {assessment.riskLevel}
              </span>
              <span className="text-xs font-bold text-[#74847C]">
                ({assessment.recurrenceRiskScore}/100)
              </span>
            </div>
            <p className="text-[11px] text-[#74847C] leading-tight">
              {assessment.primaryDriver}
            </p>
          </div>

          {/* Predicted Recurrence Window */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#74847C] uppercase tracking-wider">
                Forecasted Relapse Window
              </span>
              <Clock className="w-4 h-4 text-[#137C62]" />
            </div>
            <div className="text-xl font-extrabold text-[#172B25]">
              {assessment.predictedRecurrenceWindow}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#137C62] font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Recommended Action: {assessment.recommendedPreventiveWindow}</span>
            </div>
          </div>

          {/* Model Confidence & Telemetry */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#74847C] uppercase tracking-wider">
                Confidence & Telemetry
              </span>
              <CloudRain className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#172B25]">{assessment.confidenceLevel}%</span>
              <span className="text-xs text-[#74847C] font-semibold">Bayesian Fit</span>
            </div>
            <p className="text-[11px] text-[#74847C] leading-tight">
              Historical cadence: ~{assessment.historicalCadenceDays}d • Monsoon runoff multiplier: {assessment.monsoonWeatherMultiplier}x
            </p>
          </div>
        </div>

        {/* 7-Day Cumulative Accumulation Forecast Curve */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4EAE5] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#172B25] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#137C62]" />
                <span>7-Day Predictive Waste Accumulation Curve (Without Intervention)</span>
              </h3>
              <p className="text-xs text-[#74847C]">
                Simulates cumulative kg discarded if routine 1x daily compactor schedule remains unchanged
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#137C62] font-semibold">
                <span className="w-3 h-1.5 rounded-full bg-[#137C62]" />
                Projected Waste (kg)
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <span className="w-3 h-1.5 rounded-full bg-rose-500" />
                Intervention Threshold (350kg)
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={assessment.forecastCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="predictiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={assessment.recurrenceRiskScore >= 70 ? '#E11D48' : '#137C62'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={assessment.recurrenceRiskScore >= 70 ? '#E11D48' : '#137C62'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#74847C' }} />
                <YAxis tick={{ fontSize: 11, fill: '#74847C' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#123D32] text-white p-3 rounded-xl text-xs space-y-1 shadow-md">
                          <div className="font-bold">{data.day}</div>
                          <div>Projected: <b>{data.projectedAccumulationKg} kg</b></div>
                          <div>Threshold: <b>{data.interventionThresholdKg} kg</b></div>
                          <div className={`text-[10px] font-bold ${
                            data.status === 'Critical Relapse' ? 'text-rose-300' : 'text-[#C8F169]'
                          }`}>
                            Status: {data.status}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={350} stroke="#E11D48" strokeDasharray="4 4" />
                <Area
                  type="monotone"
                  dataKey="projectedAccumulationKg"
                  stroke={assessment.recurrenceRiskScore >= 70 ? '#E11D48' : '#137C62'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#predictiveGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Factor Decomposition & Scientific Evidence Basis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Factor Breakdown */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#172B25]">
              Algorithmic Risk Factor Breakdown
            </h4>
            <div className="space-y-2.5">
              {assessment.riskFactorBreakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-[#E4EAE5] space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#172B25]">
                    <span>{item.factor}</span>
                    <span className="text-[10px] text-[#74847C] font-mono">Weight: {item.weight}</span>
                  </div>
                  <div className="text-[11px] text-[#74847C]">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Transparency & Grounding */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#137C62] uppercase tracking-wider">
                <Info className="w-4 h-4 text-[#137C62]" />
                <span>Grounding & Data Transparency</span>
              </div>
              <p className="text-xs text-[#74847C]">
                Predictions are estimated based on verifiable historical observations and do not claim absolute certainty without continuous on-ground sensor verification.
              </p>
              <ul className="space-y-1.5 text-xs text-[#172B25]">
                {assessment.evidenceBasis.map((ev, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#137C62] font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#E4EAE5]">
              <button
                onClick={onOpenSimulator}
                className="w-full py-2.5 px-4 rounded-xl bg-[#137C62] hover:bg-[#123D32] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Test Interventions in What-If Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
