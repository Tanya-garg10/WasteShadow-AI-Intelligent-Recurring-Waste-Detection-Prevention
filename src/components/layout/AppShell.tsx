import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  FileSpreadsheet,
  Cpu,
  CheckSquare,
  BarChart3,
  Settings,
  Plus,
  Search,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Sparkles,
  RotateCcw,
  ExternalLink,
  X
} from 'lucide-react';

export type ActiveView =
  | 'overview'
  | 'hotspots'
  | 'predictions'
  | 'simulator'
  | 'incidents'
  | 'investigations'
  | 'prevention'
  | 'analytics'
  | 'settings';

interface AppShellProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenNewIncident: () => void;
  onResetData: () => void;
  children: React.ReactNode;
  userRole: string;
  onChangeRole: (role: string) => void;
  dateRange: string;
  onChangeDateRange: (range: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeView,
  onNavigate,
  onOpenNewIncident,
  onResetData,
  children,
  userRole,
  onChangeRole,
  dateRange,
  onChangeDateRange,
  searchQuery,
  onSearchChange
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const navItems = [
    { id: 'overview' as ActiveView, label: 'Overview', icon: LayoutDashboard, badge: undefined },
    { id: 'hotspots' as ActiveView, label: 'Hotspot Intelligence', icon: MapPin, badge: '3 Active' },
    { id: 'predictions' as ActiveView, label: 'Hotspot Predictor', icon: Sparkles, badge: 'AI Risk' },
    { id: 'simulator' as ActiveView, label: 'What-If Simulator', icon: Cpu, badge: 'Decision AI' },
    { id: 'incidents' as ActiveView, label: 'Incident Explorer', icon: FileSpreadsheet, badge: undefined },
    { id: 'investigations' as ActiveView, label: 'AI Investigations', icon: ShieldCheck, badge: 'Live AI' },
    { id: 'prevention' as ActiveView, label: 'Prevention Planner', icon: CheckSquare, badge: '4 Tasks' },
    { id: 'analytics' as ActiveView, label: 'Impact Analytics', icon: BarChart3, badge: undefined },
    { id: 'settings' as ActiveView, label: 'Settings', icon: Settings, badge: undefined }
  ];

  const getPageTitle = () => {
    switch (activeView) {
      case 'overview':
        return { section: 'Platform', title: 'Command Center & Recurrence Overview' };
      case 'hotspots':
        return { section: 'Intelligence', title: 'Hotspot Dossiers & Spatial Clustering' };
      case 'predictions':
        return { section: 'Forecasting', title: 'Future Hotspot Predictor & Relapse Forecasts' };
      case 'simulator':
        return { section: 'Decision AI', title: 'What-If Waste Simulator & Strategy Sandbox' };
      case 'incidents':
        return { section: 'Records', title: 'Incident Explorer & Photo Repository' };
      case 'investigations':
        return { section: 'AI Engine', title: 'Multimodal Vision & Pattern Matching' };
      case 'prevention':
        return { section: 'Operations', title: 'Prevention Work Orders & Ground-Truth Verification' };
      case 'analytics':
        return { section: 'Insights', title: 'Civic Impact Analytics & Outcome Measurement' };
      case 'settings':
        return { section: 'System', title: 'Ward Configuration & Model Settings' };
    }
  };

  const { section, title } = getPageTitle();

  return (
    <div className="min-h-screen flex bg-[#F8FAF7] text-[#172B25]">
      {/* 1. Left Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 bg-[#FFFFFF] border-r border-[#E4EAE5] flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo & Abstract Symbol */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E4EAE5]">
          <div
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Minimal abstract leaf/shadow symbol */}
            <div className="relative w-8 h-8 rounded-xl bg-[#123D32] flex items-center justify-center shrink-0 shadow-xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Abstract leaf shape */}
                <path
                  d="M19.5 4.5C19.5 4.5 11.5 6.5 7.5 10.5C3.5 14.5 4.5 19.5 4.5 19.5C4.5 19.5 9.5 20.5 13.5 16.5C17.5 12.5 19.5 4.5 19.5 4.5Z"
                  fill="#137C62"
                />
                {/* Cast shadow accent in vibrant lime */}
                <path
                  d="M13.5 16.5L4.5 19.5C7.5 19.5 12 17.5 15.5 14"
                  stroke="#C8F169"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-[#172B25] flex items-center gap-1.5">
                  WasteShadow <span className="text-[#137C62]">AI</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#74847C]">
                  Civic Intelligence
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#74847C]">
              Workspace
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#E4F4EC] text-[#137C62]'
                    : 'text-[#74847C] hover:text-[#172B25] hover:bg-[#F8FAF7]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#137C62]' : 'text-[#74847C] group-hover:text-[#172B25]'
                  }`}
                />

                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-[#137C62] text-white'
                        : 'bg-[#F1F5F2] text-[#74847C]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Demo Benchmarks Banner */}
        {!collapsed && (
          <div className="p-3 mx-3 mb-3 rounded-xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#137C62] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#137C62]" />
                Demo Sandbox
              </span>
              <button
                onClick={onResetData}
                title="Reset benchmark data"
                className="text-[10px] text-[#74847C] hover:text-[#137C62] flex items-center gap-0.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
            <p className="text-[11px] text-[#74847C] leading-tight">
              Preloaded with 3 Bengaluru benchmark scenarios: Market, Culvert, & Cleaned.
            </p>
          </div>
        )}

        {/* User Profile & Sidebar Collapse toggle */}
        <div className="p-3 border-t border-[#E4EAE5] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#E4F4EC] border border-[#C8F169] flex items-center justify-center text-[#137C62] font-bold text-xs shrink-0">
              WO
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[#172B25] truncate">Ward Officer 84</div>
                <div className="text-[10px] text-[#74847C] truncate">BBMP East Zone</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-[#74847C] hover:text-[#172B25] hover:bg-[#F8FAF7] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E4EAE5] px-6 sm:px-8 flex items-center justify-between gap-4">
          {/* Breadcrumbs & Contextual Page Title */}
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-xs font-medium text-[#74847C] hidden sm:inline">
              {section}
            </span>
            <span className="text-xs text-[#CBD5CD] hidden sm:inline">/</span>
            <h1 className="text-sm sm:text-base font-bold text-[#172B25] truncate">
              {title}
            </h1>
          </div>

          {/* Search, Date Filter, Notifications & CTA */}
          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <div className="relative hidden md:block w-52 lg:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74847C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search hotspots, wards, tags..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] text-[#172B25] placeholder-[#74847C] focus:bg-white focus:outline-none focus:border-[#137C62] transition-colors"
              />
            </div>

            {/* Date-Range Filter Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-[#E4EAE5] bg-white text-[#172B25] hover:bg-[#F8FAF7] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#74847C]" />
                <span className="hidden sm:inline">{dateRange}</span>
              </button>

              {showDateDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-[#E4EAE5] rounded-xl shadow-lg p-1.5 z-40 text-xs">
                  {['Last 30 Days', 'Past 90 Days', 'Year to Date', 'All Recorded'].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        onChangeDateRange(range);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                        dateRange === range
                          ? 'bg-[#E4F4EC] text-[#137C62] font-bold'
                          : 'text-[#172B25] hover:bg-[#F8FAF7]'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-[#74847C] hover:text-[#172B25] hover:bg-[#F8FAF7] border border-[#E4EAE5] transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E4EAE5] rounded-2xl shadow-xl p-4 z-40 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E4EAE5] pb-2">
                    <span className="font-bold text-[#172B25]">Civic Alerts (2)</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[#74847C] hover:text-[#172B25]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div
                      onClick={() => {
                        onNavigate('hotspots');
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 cursor-pointer hover:bg-rose-100/60 transition-colors"
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>Critical Culvert Risk</span>
                        <span className="text-[10px] text-rose-700">10m ago</span>
                      </div>
                      <p className="text-[11px] text-rose-800 mt-0.5">
                        Koramangala 80ft culvert grill blocked with silt & plastic. Imminent backflow risk.
                      </p>
                    </div>

                    <div
                      onClick={() => {
                        onNavigate('investigations');
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 cursor-pointer hover:bg-amber-100/60 transition-colors"
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>Pattern Detected</span>
                        <span className="text-[10px] text-amber-700">2h ago</span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        KR Market 4th recurrence identified. Supply schedule mismatch hypothesized.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* "+ New Incident" Primary Button */}
            <button
              onClick={onOpenNewIncident}
              className="flex items-center gap-1.5 bg-[#137C62] hover:bg-[#123D32] text-white px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C8F169]" />
              <span className="font-bold">+ New Incident</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
