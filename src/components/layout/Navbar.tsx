import React from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  MapPin,
  Lightbulb,
  CheckSquare,
  FileBarChart,
  PlusCircle,
  RotateCcw,
  UserCheck,
  Home
} from 'lucide-react';
import { StorageService } from '../../services/storageService';

export type NavTab =
  | 'landing'
  | 'dashboard'
  | 'upload'
  | 'recurrence'
  | 'hypotheses'
  | 'investigation'
  | 'tracker'
  | 'reports';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenUpload: () => void;
  onResetData: () => void;
  userRole: string;
  onChangeRole: (role: any) => void;
  activeHotspotId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUpload,
  onResetData,
  userRole,
  onChangeRole
}) => {
  const storage = StorageService.getInstance();
  const recurringCount = storage.getLocations().filter((l) => l.classification === 'repeated').length;
  const criticalDrainCount = storage.getLocations().filter((l) => l.drainRisk === 'critical_flood_hazard').length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Banner Alert for Civic High Priority Hazards */}
      {criticalDrainCount > 0 && (
        <div className="bg-rose-50 border-b border-rose-200/80 px-4 py-1.5 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            <span>
              <b>Civic Priority Alert:</b> {criticalDrainCount} stormwater culvert hotspot identified with critical flood choking hazard (Ward 151).
            </span>
          </div>
          <button
            onClick={() => onSelectTab('investigation')}
            className="text-xs font-semibold text-rose-700 underline hover:text-rose-900 cursor-pointer"
          >
            Review Culvert Hotspot →
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-900">
                    Waste<span className="text-emerald-600">Shadow</span> AI
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    SaaS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  “Don't just clean the waste. Stop it from coming back.”
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentTab === 'landing'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
              {recurringCount > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {recurringCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('recurrence')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentTab === 'recurrence'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Recurrence Engine</span>
            </button>

            <button
              onClick={() => onSelectTab('hypotheses')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentTab === 'hypotheses'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Root-Cause Hypotheses</span>
            </button>

            <button
              onClick={() => onSelectTab('tracker')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentTab === 'tracker'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Action Tracker</span>
            </button>

            <button
              onClick={() => onSelectTab('reports')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                currentTab === 'reports'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileBarChart className="w-4 h-4" />
              <span>Reports</span>
            </button>
          </nav>

          {/* Role switcher & Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Demo Reset Button for Judges */}
            <button
              onClick={onResetData}
              title="Reset to initial 3 benchmark demo scenarios"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Reset Seed Data</span>
            </button>

            {/* Role Switcher */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                <select
                  value={userRole}
                  onChange={(e) => onChangeRole(e.target.value)}
                  className="bg-transparent text-slate-700 font-medium text-xs border-none focus:outline-none cursor-pointer pr-1"
                >
                  <option value="ward_officer">Ward Officer (Admin)</option>
                  <option value="swm_inspector">SWM Inspector</option>
                  <option value="citizen">Citizen Reporter</option>
                </select>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-600/20 hover:shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log & Analyze Waste</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-2">
          <button
            onClick={() => onSelectTab('landing')}
            className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${
              currentTab === 'landing' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${
              currentTab === 'dashboard' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('recurrence')}
            className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${
              currentTab === 'recurrence' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Recurrence
          </button>
          <button
            onClick={() => onSelectTab('hypotheses')}
            className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${
              currentTab === 'hypotheses' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Hypotheses
          </button>
          <button
            onClick={() => onSelectTab('tracker')}
            className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${
              currentTab === 'tracker' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${
              currentTab === 'reports' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Reports
          </button>
        </div>
      </div>
    </header>
  );
};
