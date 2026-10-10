import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Cpu,
  RotateCcw,
  Sparkles,
  Database,
  CheckCircle2,
  Info
} from 'lucide-react';
import { DemoBadge } from '../common/DemoBadge';

interface SettingsViewProps {
  userRole: string;
  onChangeRole: (role: string) => void;
  onResetData: () => void;
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userRole,
  onChangeRole,
  onResetData,
  onShowToast
}) => {
  const [apiKey, setApiKey] = useState('');
  const [wardCity, setWardCity] = useState('Bengaluru (Bruhat Bengaluru Mahanagara Palike)');
  const [spatialThreshold, setSpatialThreshold] = useState(80);

  const handleSaveApi = () => {
    if (apiKey.trim()) {
      localStorage.setItem('wasteshadow_user_api_key', apiKey.trim());
      onShowToast('success', 'Gemini Key Saved', 'Multimodal Vision will use your custom API key.');
    } else {
      localStorage.removeItem('wasteshadow_user_api_key');
      onShowToast('info', 'Demo Fallback Active', 'Using transparent simulated computer vision.');
    }
  };

  return (
    <div className="max-w-3xl space-y-8 py-2">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-[#172B25] tracking-tight">
            Settings & System Configuration
          </h1>
          <DemoBadge label="System Admin" variant="emerald" />
        </div>
        <p className="text-xs text-[#74847C] mt-0.5">
          Configure municipality jurisdiction, AI vision credentials, and spatial recurrence thresholds.
        </p>
      </div>

      {/* Municipality & Persona */}
      <div className="bg-white p-6 rounded-3xl border border-[#E4EAE5] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#172B25] uppercase tracking-wider">
          Municipal Jurisdiction & Persona
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-[#74847C] block mb-1">Urban Local Body (ULB)</label>
            <input
              type="text"
              value={wardCity}
              onChange={(e) => setWardCity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#74847C] block mb-1">Active User Role</label>
            <select
              value={userRole}
              onChange={(e) => {
                onChangeRole(e.target.value);
                onShowToast('info', 'Role Updated', `Switched mode to ${e.target.value}.`);
              }}
              className="w-full p-2.5 rounded-xl border border-[#E4EAE5] bg-white outline-none cursor-pointer"
            >
              <option value="ward_officer">Ward Health Officer (Administrative Sign-Off)</option>
              <option value="swm_inspector">SWM Field Inspector (Execution & Tasks)</option>
              <option value="citizen">Citizen Reporter (Grievance Submissions)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Vision Model Settings */}
      <div className="bg-white p-6 rounded-3xl border border-[#E4EAE5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#172B25] uppercase tracking-wider">
            AI Vision Model Engine
          </h3>
          <span className="text-[10px] font-bold text-[#137C62] bg-[#E4F4EC] px-2 py-0.5 rounded">
            Gemini 3.8 Flash
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-[#74847C] block mb-1">Custom Gemini API Key (Optional)</label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Leave blank to use transparent built-in demo fallback"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] focus:bg-white"
              />
              <button
                onClick={handleSaveApi}
                className="px-4 py-2.5 rounded-xl bg-[#137C62] hover:bg-[#123D32] text-white font-bold cursor-pointer transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-[11px] text-[#74847C] mt-1">
              If left blank, WasteShadow AI transparently generates authentic computer vision observations and drain risk metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Benchmark Sandbox Reset */}
      <div className="bg-white p-6 rounded-3xl border border-[#E4EAE5] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172B25]">
              Benchmark Seed Scenarios
            </h3>
            <p className="text-xs text-[#74847C]">
              Restore the 3 official demo scenarios (Indiranagar, KR Market, Koramangala Culvert).
            </p>
          </div>

          <button
            onClick={() => {
              onResetData();
              onShowToast('success', 'Seed Data Reset', 'Restored 3 initial benchmark scenarios.');
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E4EAE5] text-[#172B25] hover:bg-[#F8FAF7] text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#74847C]" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
