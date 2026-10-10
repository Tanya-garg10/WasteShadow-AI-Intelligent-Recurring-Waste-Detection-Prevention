import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { HotspotLocation, Incident, RootCauseHypothesis, PreventionTask } from './types';
import { AppShell, ActiveView } from './components/layout/AppShell';
import { DashboardHero } from './components/dashboard/DashboardHero';
import { HotspotWorkspace } from './components/investigation/HotspotWorkspace';
import { IncidentExplorer } from './components/explorer/IncidentExplorer';
import { AIInvestigationWorkflow } from './components/investigations/AIInvestigationWorkflow';
import { PreventionPlanner } from './components/planner/PreventionPlanner';
import { ImpactAnalytics } from './components/analytics/ImpactAnalytics';
import { SettingsView } from './components/settings/SettingsView';
import { FutureHotspotPredictor } from './components/predictions/FutureHotspotPredictor';
import { WhatIfSimulator } from './components/simulator/WhatIfSimulator';
import { ToastContainer, ToastMessage } from './components/common/Toast';

export default function App() {
  const storage = StorageService.getInstance();

  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('loc_b_krmarket');
  const [locations, setLocations] = useState<HotspotLocation[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [hypotheses, setHypotheses] = useState<RootCauseHypothesis[]>([]);
  const [tasks, setTasks] = useState<PreventionTask[]>([]);
  const [userRole, setUserRole] = useState<string>('ward_officer');
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize state from storage service
  const refreshState = () => {
    setLocations(storage.getLocations());
    setIncidents(storage.getIncidents());
    setHypotheses(storage.getHypotheses());
    setTasks(storage.getTasks());
    setUserRole(storage.getUserRole());
  };

  useEffect(() => {
    refreshState();
  }, []);

  const addToast = (
    type: 'success' | 'warning' | 'info' | 'error',
    title: string,
    message?: string
  ) => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random()}`,
      type,
      title,
      message
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetData = () => {
    storage.resetToDefaults();
    refreshState();
    setSelectedHotspotId('loc_b_krmarket');
    addToast(
      'success',
      'Seed Data Reset',
      'Restored the 3 official benchmark scenarios (Indiranagar, KR Market, Koramangala Culvert).'
    );
  };

  const handleSelectHotspot = (id: string) => {
    setSelectedHotspotId(id);
    setActiveView('hotspots');
  };

  const activeHotspot = locations.find((l) => l.id === selectedHotspotId) || locations[0];

  return (
    <AppShell
      activeView={activeView}
      onNavigate={setActiveView}
      onOpenNewIncident={() => setActiveView('investigations')}
      onResetData={handleResetData}
      userRole={userRole}
      onChangeRole={(r) => {
        storage.setUserRole(r as any);
        setUserRole(r);
      }}
      dateRange={dateRange}
      onChangeDateRange={setDateRange}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {/* 1. Overview Dashboard (Hero Screen) */}
      {activeView === 'overview' && (
        <DashboardHero
          locations={locations}
          incidents={incidents}
          onSelectHotspot={handleSelectHotspot}
          onOpenAnalysis={() => setActiveView('investigations')}
          onNavigateToHotspots={() => setActiveView('hotspots')}
          onNavigateToPredictions={() => setActiveView('predictions')}
          onNavigateToSimulator={() => setActiveView('simulator')}
        />
      )}

      {/* 1.5 Future Hotspot Predictor (Decision Intelligence Feature 1) */}
      {activeView === 'predictions' && (
        <FutureHotspotPredictor
          locations={locations}
          incidents={incidents}
          selectedLocationId={selectedHotspotId}
          onSelectLocation={(id) => setSelectedHotspotId(id)}
          onOpenSimulator={() => setActiveView('simulator')}
        />
      )}

      {/* 1.6 What-If Waste Simulator (Decision Intelligence Feature 2) */}
      {activeView === 'simulator' && (
        <WhatIfSimulator
          locations={locations}
          selectedLocationId={selectedHotspotId}
          onApplyTask={(title) => {
            setActiveView('prevention');
            addToast('success', 'Scenario Applied', `Configured task: ${title}`);
          }}
        />
      )}

      {/* 2. Hotspot Intelligence Workspace (Signature Feature) */}
      {activeView === 'hotspots' && activeHotspot && (
        <HotspotWorkspace
          hotspot={activeHotspot}
          allHotspots={locations}
          incidents={incidents}
          hypotheses={hypotheses}
          tasks={tasks}
          onBack={() => setActiveView('overview')}
          onSelectHotspot={(id) => setSelectedHotspotId(id)}
          onOpenAnalysis={(locId) => {
            setSelectedHotspotId(locId);
            setActiveView('investigations');
          }}
          onNavigateToTasks={() => setActiveView('prevention')}
          onShowToast={addToast}
        />
      )}

      {/* 3. Incident Explorer */}
      {activeView === 'incidents' && (
        <IncidentExplorer
          incidents={incidents}
          locations={locations}
          onSelectHotspot={handleSelectHotspot}
          onOpenNewIncident={() => setActiveView('investigations')}
        />
      )}

      {/* 4. AI Investigations Workflow (Multi-Step Experience) */}
      {activeView === 'investigations' && (
        <AIInvestigationWorkflow
          locations={locations}
          onComplete={(hotspotId) => {
            refreshState();
            setSelectedHotspotId(hotspotId);
            setActiveView('hotspots');
          }}
          onShowToast={addToast}
        />
      )}

      {/* 5. Prevention Planner (Kanban & List Tasks) */}
      {activeView === 'prevention' && (
        <PreventionPlanner
          tasks={tasks}
          locations={locations}
          onSelectHotspot={handleSelectHotspot}
          onShowToast={addToast}
        />
      )}

      {/* 6. Impact Analytics */}
      {activeView === 'analytics' && (
        <ImpactAnalytics
          locations={locations}
          incidents={incidents}
          tasks={tasks}
          onShowToast={addToast}
        />
      )}

      {/* 7. Settings & Model Config */}
      {activeView === 'settings' && (
        <SettingsView
          userRole={userRole}
          onChangeRole={(r) => {
            storage.setUserRole(r as any);
            setUserRole(r);
          }}
          onResetData={handleResetData}
          onShowToast={addToast}
        />
      )}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </AppShell>
  );
}
