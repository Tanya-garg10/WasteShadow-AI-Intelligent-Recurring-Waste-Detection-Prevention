import React from 'react';
import { ShieldCheck, Database, Cpu, Map, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-10 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                WS
              </div>
              <span className="font-bold text-sm text-slate-900">WasteShadow AI</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Civic intelligence platform detecting recurring waste accumulation, diagnosing operational mismatches, and preventing urban garbage hotspots.
            </p>
            <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
              “Don't just clean the waste. Stop it from coming back.”
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Core Intelligence Modules
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer">
                <span>• Spatiotemporal Recurrence Engine</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer">
                <span>• Culvert & Drain Occlusion Risk AI</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer">
                <span>• Evidence-Linked Root-Cause Hypotheses</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer">
                <span>• Work-Order Prevention Tracker</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer">
                <span>• Ground-Truth Verification Audits</span>
              </li>
            </ul>
          </div>

          {/* Civic Tech Methodology */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Methodology & Ethics
            </h4>
            <p className="text-slate-500 leading-relaxed mb-2">
              <b>Visual Observation vs Cause:</b> Photographic AI analyzes physical material characteristics only. Hypotheses correlate collection logs, spatial frequency, and vendor hours.
            </p>
            <p className="text-slate-500 leading-relaxed">
              <b>Verified Clean Process:</b> Hotspots are never marked resolved until field inspectors attach timestamped photographic proof.
            </p>
          </div>

          {/* Architecture & Tech Stack */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Full-Stack Architecture
            </h4>
            <div className="space-y-1.5 text-slate-500">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Vision: Gemini 3.8 Flash + Demo Fallback</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mapping: Leaflet & OpenStreetMap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Backend: FastAPI Python + Supabase / Postgres</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ready for Vercel, Render & Docker</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 WasteShadow AI Civic Systems. Built for Indian Municipal Solid Waste Management (SWM).
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Live Hackathon Interactive Preview
            </span>
            <span className="text-slate-300">|</span>
            <span>All demo data labelled transparently</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
