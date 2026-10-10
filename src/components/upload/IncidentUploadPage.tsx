import React, { useState } from 'react';
import {
  Upload,
  Camera,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Waves,
  Eye,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { WasteCategory, AIAnalysisResult, SeverityLevel } from '../../types';
import { analyzeIncidentPhoto } from '../../services/aiVisionService';
import { StorageService } from '../../services/storageService';
import { SAMPLE_IMAGES } from '../../services/seedData';
import { DemoBadge } from '../common/DemoBadge';
import { EvidenceImage } from '../common/EvidenceImage';

interface IncidentUploadPageProps {
  onSuccess: (locationId: string) => void;
  onCancel: () => void;
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const IncidentUploadPage: React.FC<IncidentUploadPageProps> = ({
  onSuccess,
  onCancel,
  onShowToast
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_IMAGES.drain_incident_2);
  const [locationName, setLocationName] = useState<string>('Koramangala 80ft Road Stormwater Drain Culvert');
  const [lat, setLat] = useState<number>(12.9352);
  const [lng, setLng] = useState<number>(77.6245);
  const [category, setCategory] = useState<WasteCategory>('drain_sludge_waste');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [notes, setNotes] = useState<string>('Heavy plastic accumulation choking culvert entrance near Sony World junction.');
  const [estimatedKg, setEstimatedKg] = useState<number>(450);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // Quick preset sample photos for instant testing during demo
  const samplePresets = [
    {
      label: 'Stormwater Culvert Plastic Choke',
      photo: SAMPLE_IMAGES.drain_incident_2,
      location: 'Koramangala 80ft Road Stormwater Drain Culvert',
      lat: 12.9352,
      lng: 77.6245,
      category: 'drain_sludge_waste' as WasteCategory,
      notes: 'Plastics and silt bags occluding 85% of primary storm drain culvert cross-section.',
      kg: 540
    },
    {
      label: 'Wholesale Market Produce Dump',
      photo: SAMPLE_IMAGES.market_incident_3,
      location: 'KR Flower & Vegetable Market (Gate 4 Transit Corridor)',
      lat: 12.9634,
      lng: 77.5753,
      category: 'organic_market' as WasteCategory,
      notes: 'Perishable cabbage and tomato crates discarded along morning delivery approach road.',
      kg: 620
    },
    {
      label: 'Commercial Packaging Alley',
      photo: SAMPLE_IMAGES.sample_dump,
      location: 'Shivajinagar Bus Terminus Rear Commercial Alley',
      lat: 12.9856,
      lng: 77.6057,
      category: 'commercial_packaging' as WasteCategory,
      notes: 'Late night carton and beverage plastic dumping behind bus depot food stalls.',
      kg: 280
    },
    {
      label: 'Post-Festival Footpath Debris',
      photo: SAMPLE_IMAGES.indiranagar_before,
      location: 'Indiranagar 12th Main Road (BDA Park Corner)',
      lat: 12.9716,
      lng: 77.6412,
      category: 'mixed_municipal' as WasteCategory,
      notes: 'Festival cardboard packaging and paper decorations spilled on curb.',
      kg: 75
    }
  ];

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setPhotoUrl(preset.photo);
    setLocationName(preset.location);
    setLat(preset.lat);
    setLng(preset.lng);
    setCategory(preset.category);
    setNotes(preset.notes);
    setEstimatedKg(preset.kg);
    setAnalysisResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      onShowToast('error', 'Unsupported File Type', 'Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      onShowToast('warning', 'File Too Large', 'Maximum file size is 8MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPhotoUrl(base64);
      setAnalysisResult(null);
      onShowToast('info', 'Photo Loaded', 'Click "Run AI Vision Analysis" to inspect visible waste traits.');
    };
    reader.readAsDataURL(file);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeIncidentPhoto({
        imageBase64: photoUrl,
        categoryHint: category,
        locationName,
        notes,
        userApiKey: customApiKey
      });
      setAnalysisResult(result);
      setSeverity(result.approxSeverity);

      if (result.isDemoFallback) {
        onShowToast('info', 'Analysis Complete (Demo Mode)', 'Simulated computer vision evaluated categories and drain risk.');
      } else {
        onShowToast('success', 'Gemini Vision Analysis Complete', 'Extracted visual material categories and environmental context.');
      }
    } catch (err: any) {
      onShowToast('error', 'Analysis Error', err.message || 'Failed to complete vision analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationName.trim()) {
      onShowToast('warning', 'Missing Location', 'Please provide a location name or landmark.');
      return;
    }

    const storage = StorageService.getInstance();
    const result = storage.addIncident({
      locationId: '', // Storage will auto-match by proximity
      locationName,
      coordinates: { lat, lng },
      reportedAt: new Date().toISOString(),
      reporterName: 'Civic Field Inspector (Ward 84/151)',
      reporterRole: 'ward_inspector',
      photoUrl,
      category,
      severity,
      estimatedVolumeKg: estimatedKg,
      notes,
      cleanupStatus: 'pending',
      analysis: analysisResult || undefined
    });

    onShowToast(
      'success',
      'Incident Logged & Recurrence Computed',
      `Mapped to ${result.hotspot.name} with Recurrence Score: ${result.hotspot.recurrenceScore}/100 (${result.hotspot.classification.toUpperCase()})`
    );

    onSuccess(result.hotspot.id);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Log Incident & AI Vision Analysis
            </h1>
            <DemoBadge label="Multimodal Vision" variant="emerald" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload incident photos to detect waste types, assess drain flood hazard, and correlate with historical recurrence.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200"
        >
          Cancel
        </button>
      </div>

      {/* Preset Quick Selectors */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1-Click Demo Scenarios (Select to auto-populate photo & GPS)
          </span>
          <span className="text-[11px] text-slate-400">Useful for quick hackathon review</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="p-2 rounded-xl text-left border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all text-xs group"
            >
              <div className="font-semibold text-slate-800 text-[11px] truncate group-hover:text-emerald-700">
                {preset.label}
              </div>
              <div className="text-[10px] text-slate-500 truncate">{preset.category.replace('_', ' ')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Photo Upload & Preview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Incident Photo Evidence
              </label>
              <span className="text-[10px] text-slate-400">JPG, PNG, WEBP (Max 8MB)</span>
            </div>

            {/* Photo Preview Frame */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group">
              <EvidenceImage
                src={photoUrl}
                alt="Waste preview"
                fallbackText="Incident Photographic Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label className="bg-white text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow cursor-pointer hover:bg-slate-100">
                  <Camera className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                  Replace Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload Custom Image</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs disabled:opacity-60 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
                <span>{isAnalyzing ? 'Analyzing Image...' : 'Run AI Vision'}</span>
              </button>
            </div>

            {/* Optional API key toggle */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-[11px] text-slate-500 hover:text-emerald-700 underline cursor-pointer"
              >
                {showApiKeyInput ? 'Hide Gemini API Key Settings' : 'Configure Live Gemini Vision API Key (Optional)'}
              </button>
              {showApiKeyInput && (
                <div className="mt-2 space-y-1">
                  <input
                    type="password"
                    placeholder="Enter GEMINI_API_KEY (Leave empty to use transparent demo fallback)"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-emerald-500"
                  />
                  <div className="text-[10px] text-slate-400">
                    If not set, our transparent demo engine will simulate realistic computer vision outputs with zero setup required.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Location & Incident Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Location & Spatial Metadata
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location Name / Landmark *
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. KR Market Gate 4 Commercial Transit Lane"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Waste Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WasteCategory)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                >
                  <option value="drain_sludge_waste">Drain Sludge & Occlusions</option>
                  <option value="organic_market">Organic Market Produce</option>
                  <option value="single_use_plastics">Single-Use Plastics</option>
                  <option value="commercial_packaging">Commercial Packaging</option>
                  <option value="construction_debris">Construction & Debris</option>
                  <option value="mixed_municipal">Mixed Municipal Waste</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Approx Volume (kg)</label>
                <input
                  type="number"
                  value={estimatedKg}
                  onChange={(e) => setEstimatedKg(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Field Observation Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observed time of discard, proximity to gutters, presence of commercial trucks..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* AI Analysis Visual Result Card */}
        {analysisResult && (
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-4 animate-in fade-in-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Visual Observation Report</h3>
                  <div className="text-[11px] text-slate-500">
                    Engine: <span className="font-semibold">{analysisResult.modelUsed}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {analysisResult.isDemoFallback ? (
                  <DemoBadge label="Demo Fallback Active" variant="amber" />
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Live Gemini Vision API</span>
                  </span>
                )}
              </div>
            </div>

            {/* Detected Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Visible Waste Composition
                </span>
                <div className="space-y-2">
                  {analysisResult.visibleCategories.map((cat, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{cat.label}</span>
                        <span className="font-semibold text-emerald-700">
                          {cat.approxPercentage}% (conf: {Math.round(cat.confidence * 100)}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drain Blockage & Flood Vulnerability Card */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hydrological & Drain Occlusion Risk
                </span>
                <div
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    analysisResult.drainBlockage.risk === 'critical_flood_hazard' ||
                    analysisResult.drainBlockage.risk === 'severe'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                      : analysisResult.drainBlockage.risk === 'partial'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-1.5">
                      <Waves className="w-4 h-4 text-sky-600" />
                      <span>Drain Status: {analysisResult.drainBlockage.risk.replace(/_/g, ' ').toUpperCase()}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/80">
                      Flood Risk: {analysisResult.drainBlockage.floodVulnerability}
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed">
                    {analysisResult.drainBlockage.visualObservation}
                  </p>

                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                    Proximity to culvert inlet: <b>{analysisResult.drainBlockage.drainProximityMeters} meters</b>
                  </div>
                </div>

                {/* Environmental Context Details */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 text-slate-600">
                  <div>
                    Surrounding environment: <b>{analysisResult.environmentalContext.surroundingType.replace('_', ' ')}</b>
                  </div>
                  <div>
                    Night dumping indicator: <b>{analysisResult.environmentalContext.nightDumpingIndicator ? 'Yes (Detected)' : 'No'}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Factual Visual Observations vs Assumption Disclaimer */}
            <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-3 text-[11px] text-sky-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Visual Observation vs Speculative Assumption</span>
              </div>
              <p className="leading-relaxed text-sky-800">
                <b>Raw Visual Evidence:</b> {analysisResult.rawVisualObservations}
              </p>
              <p className="leading-relaxed text-slate-600 italic">
                {analysisResult.distinctionDisclaimer}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <span>Save Incident & Compute Recurrence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
