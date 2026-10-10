import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface DemoBadgeProps {
  label?: string;
  tooltip?: string;
  variant?: 'emerald' | 'amber' | 'blue';
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  label = 'Illustrative Demo Data',
  tooltip = 'This metric or record is part of a verified sample dataset for demonstration and evaluation.',
  variant = 'blue'
}) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200'
  };

  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${colors[variant]}`}
    >
      <Sparkles className="w-3 h-3 text-sky-500 animate-pulse" />
      <span>{label}</span>
    </span>
  );
};

export const DisclaimerBanner: React.FC<{ text?: string }> = ({
  text = 'Sample Data Notice: All dates, locations, waste volumes, and statistics shown here are realistic synthetic benchmarks for hackathon demonstration. WasteShadow AI distinguishes visible image observations from speculative root causes.'
}) => (
  <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl px-4 py-2.5 text-xs text-sky-800 flex items-center gap-2.5">
    <Info className="w-4 h-4 text-sky-600 shrink-0" />
    <span className="leading-relaxed">{text}</span>
  </div>
);
