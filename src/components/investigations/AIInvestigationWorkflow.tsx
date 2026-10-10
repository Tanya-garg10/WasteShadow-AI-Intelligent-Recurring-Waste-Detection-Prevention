import React, { useState } from 'react';
import {
  Upload,
  Camera,
  MapPin,
  Sparkles,
  Waves,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Layers,
  HelpCircle,
  Clock,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import { WasteCategory, AIAnalysisResult, SeverityLevel, HotspotLocation } from '../../types';
import { analyzeIncidentPhoto } from '../../services/aiVisionService';
import { StorageService } from '../../services/storageService';
import { SAMPLE_IMAGES } from '../../services/seedData';
import { DemoBadge } from '../common/DemoBadge';
import { EvidenceImage } from '../common/EvidenceImage';

interface AIInvestigationWorkflowProps {
  locations: HotspotLocation[];
  onComplete: (hotspotId: string) => void;
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const AIInvestigationWorkflow: React.FC<AIInvestigationWorkflowProps> = ({
  locations,
  onComplete,
  onShowToast
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_IMAGES.drain_incident_2);
  const [locationName, setLocationName] = useState<string>('Koramangala 80ft Road Stormwater Drain Culvert');
  const [lat, setLat] = useState<number>(12.9352);
  const [lng, setLng] = useState<number>(77.6245);
  const [category, setCategory] = useState<WasteCategory>('drain_sludge_waste');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [notes, setNotes] = useState<string>('Single-use plastics and silt bags obstructing primary culvert intake grill.');
  const [volumeKg, setVolumeKg] = useState<number>(540);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // 1-Click Demo Scenarios for Instant Testing
  const samplePresets = [
    {
      label: 'Koramangala Culvert Plastic Choke',
      photo: SAMPLE_IMAGES.drain_incident_2,
      location: 'Koramangala 80ft Road Stormwater Drain Culvert',
      lat: 12.9352,
      lng: 77.6245,
      category: 'drain_sludge_waste' as WasteCategory,
      notes: 'Plastics and silt bags occluding 85% of primary storm drain culvert cross-section.',
      kg: 540
    },
    {
      label: 'KR Market Gate 4 Commercial Waste',
      photo: SAMPLE_IMAGES.market_incident_3,
      location: 'KR Flower & Vegetable Market (Gate 4 Transit Corridor)',
      lat: 12.9634,
      lng: 77.5753,
      category: 'organic_market' as WasteCategory,
      notes: 'Perishable cabbage and tomato crates discarded along morning delivery approach road.',
      kg: 620
    },
    {
      label: 'Shivajinagar Terminus Commercial Alley',
      photo: SAMPLE_IMAGES.shivajinagar_1,
      location: 'Shivajinagar Bus Terminus Rear Commercial Alley',
      lat: 12.9856,
      lng: 77.6057,
      category: 'commercial_packaging' as WasteCategory,
      notes: 'Late night carton and beverage plastic dumping behind bus depot food stalls.',
      kg: 280
    },
    {
      label: 'Indiranagar Festival Debris (One-Time)',
      photo: SAMPLE_IMAGES.indiranagar_before,
      location: 'Indiranagar 12th Main Road (BDA Park Corner)',
      lat: 12.9716,
      lng: 77.6412,
      category: 'mixed_municipal' as WasteCategory,
      notes: 'Festival cardboard packaging and paper decorations spilled on curb.',
      kg: 75
    }
  ];

  const handleSelectPreset = (p: typeof samplePresets[0]) => {
    setPhotoUrl(p.photo);
    setLocationName(p.location);
    setLat(p.lat);
    setLng(p.lng);
    setCategory(p.category);
    setNotes(p.notes);
    setVolumeKg(p.kg);
    setAnalysisResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoUrl(event.target?.result as string);
      setAnalysisResult(null);
      onShowToast('info', 'Photo Loaded', 'Proceed to Step 2 for AI visual scanning.');
    };
    reader.readAsDataURL(file);
  };

  const runVisualAnalysis = async () => {
    setIsScanning(true);
    try {
      const res = await analyzeIncidentPhoto({
        imageBase64: photoUrl,
        categoryHint: category,
        locationName,
        notes
      });
      setAnalysisResult(res);
      setSeverity(res.approxSeverity);
      setCurrentStep(2);
      onShowToast('success', 'Visual Analysis Complete', 'Extracted material profile and drain occlusion metrics.');
    } catch (err: any) {
      onShowToast('error', 'Analysis Failed', err.message || 'Error running model.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCommitInvestigation = () => {
    const storage = StorageService.getInstance();
    const result = storage.addIncident({
      locationId: '',
      locationName,
      coordinates: { lat, lng },
      reportedAt: new Date().toISOString(),
      reporterName: 'Civic Field Inspector (Ward 84/151)',
      reporterRole: 'ward_inspector',
      photoUrl,
      category,
      severity,
      estimatedVolumeKg: volumeKg,
      notes,
      cleanupStatus: 'pending',
      analysis: analysisResult || undefined
    });

    onShowToast(
      'success',
      'Investigation Committed to Dossier',
      `Mapped to ${result.hotspot.name} with Recurrence Score ${result.hotspot.recurrenceScore}/100`
    );

    onComplete(result.hotspot.id);
  };

  const steps = [
    { num: 1, label: 'Evidence Ingestion' },
    { num: 2, label: 'Visual Analysis' },
    { num: 3, label: 'Pattern Matching' },
    { num: 4, label: 'Investigation Report' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-[#172B25] tracking-tight">
            AI Investigation Experience
          </h1>
          <DemoBadge label="Multi-Step Pipeline" variant="emerald" />
        </div>
        <p className="text-xs text-[#74847C] mt-0.5">
          Follow the 4-step intelligence pipeline from raw photo ingestion to evidence-linked operational hypothesis.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4EAE5] shadow-xs">
        <div className="flex items-center justify-between">
          {steps.map((st, i) => (
            <React.Fragment key={st.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    currentStep > st.num
                      ? 'bg-[#137C62] text-white'
                      : currentStep === st.num
                      ? 'bg-[#123D32] text-[#C8F169] ring-2 ring-[#C8F169]/50'
                      : 'bg-[#F8FAF7] border border-[#E4EAE5] text-[#74847C]'
                  }`}
                >
                  {currentStep > st.num ? <Check className="w-3.5 h-3.5" /> : st.num}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    currentStep === st.num ? 'text-[#172B25]' : 'text-[#74847C]'
                  }`}
                >
                  {st.label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 rounded ${
                    currentStep > st.num ? 'bg-[#137C62]' : 'bg-[#E4EAE5]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Evidence Ingestion */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick Presets */}
          <div className="bg-white p-4 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74847C]">
              1-Click Demo Scenarios (Select to auto-populate photo & GPS)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {samplePresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="p-2.5 rounded-xl border border-[#E4EAE5] hover:border-[#137C62] hover:bg-[#E4F4EC]/40 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-[#172B25] group-hover:text-[#137C62] truncate">
                    {p.label}
                  </div>
                  <div className="text-[10px] text-[#74847C] truncate">{p.category.replace('_', ' ')}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-4">
              <span className="text-xs font-bold text-[#172B25] uppercase tracking-wider block">
                Incident Photographic Evidence
              </span>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#123D32] border border-[#E4EAE5] relative group">
                <EvidenceImage
                  src={photoUrl}
                  alt="Inspection"
                  fallbackText={locationName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="bg-white text-[#172B25] text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-[#F8FAF7]">
                    Replace Photo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#CBD5CD] text-xs font-bold text-[#74847C] hover:text-[#137C62] hover:border-[#137C62] hover:bg-[#E4F4EC]/20 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#137C62]" />
                <span>Upload Custom JPG / PNG Image</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Metadata Fields */}
            <div className="bg-white p-5 rounded-2xl border border-[#E4EAE5] shadow-xs space-y-3 text-xs">
              <span className="text-xs font-bold text-[#172B25] uppercase tracking-wider block">
                Spatial Metadata
              </span>

              <div>
                <label className="font-semibold text-[#74847C] block mb-1">Location Name *</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] focus:bg-white focus:outline-none focus:border-[#137C62]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#74847C] block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#74847C] block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#74847C] block mb-1">Category & Approx Mass</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WasteCategory)}
                    className="p-2 rounded-xl border border-[#E4EAE5] bg-white outline-none"
                  >
                    <option value="drain_sludge_waste">Drain Sludge</option>
                    <option value="organic_market">Organic Market</option>
                    <option value="single_use_plastics">Single-Use Plastics</option>
                    <option value="commercial_packaging">Commercial Packaging</option>
                    <option value="construction_debris">Construction Debris</option>
                    <option value="mixed_municipal">Mixed Municipal</option>
                  </select>
                  <input
                    type="number"
                    value={volumeKg}
                    onChange={(e) => setVolumeKg(parseInt(e.target.value) || 0)}
                    placeholder="kg"
                    className="p-2 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#74847C] block mb-1">Field Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={runVisualAnalysis}
              disabled={isScanning}
              className="flex items-center gap-2 bg-[#137C62] hover:bg-[#123D32] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4 text-[#C8F169]" />
              <span>{isScanning ? 'Executing Computer Vision Scan...' : 'Run Visual Analysis →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Visual Analysis */}
      {currentStep === 2 && analysisResult && (
        <div className="bg-white p-6 rounded-3xl border border-[#E4EAE5] shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#E4EAE5] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#137C62]">
                Step 2 Complete
              </span>
              <h3 className="text-base font-bold text-[#172B25]">
                Computer Vision Classification Output
              </h3>
            </div>
            <span className="text-xs text-[#74847C] font-mono">
              Model: {analysisResult.modelUsed}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#172B25] uppercase tracking-wider">
                Detected Waste Categories
              </span>
              <div className="space-y-2">
                {analysisResult.visibleCategories.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E4EAE5] text-xs space-y-1">
                    <div className="flex justify-between font-bold text-[#172B25]">
                      <span>{c.label}</span>
                      <span className="text-[#137C62]">{c.approxPercentage}% (Conf: {Math.round(c.confidence * 100)}%)</span>
                    </div>
                    <p className="text-[11px] text-[#74847C]">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-[#172B25] uppercase tracking-wider">
                Stormwater Drain & Hydrological Check
              </span>
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                analysisResult.drainBlockage.detectedObstruction
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : 'bg-[#F8FAF7] border-[#E4EAE5] text-[#172B25]'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-sky-600" />
                    <span>Drain Status: {analysisResult.drainBlockage.risk.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white">
                    Flood Risk: {analysisResult.drainBlockage.floodVulnerability}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {analysisResult.drainBlockage.visualObservation}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E4EAE5] text-xs space-y-1">
                <span className="font-bold text-[#172B25]">Factual Visual Observation:</span>
                <p className="text-[11px] text-[#74847C] leading-relaxed">
                  {analysisResult.rawVisualObservations}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-bold text-[#74847C] hover:text-[#172B25]"
            >
              ← Back to Evidence
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-[#137C62] hover:bg-[#123D32] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              Proceed to Pattern Matching →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Pattern Matching */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-[#E4EAE5] shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[#E4EAE5] pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#137C62]">
              Step 3
            </span>
            <h3 className="text-base font-bold text-[#172B25]">
              Spatiotemporal Clustering & Historical Pattern Matching
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E4EAE5] space-y-2 text-xs">
            <div className="font-bold text-[#172B25] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#137C62]" />
              <span>Spatial Clustering Radius: 80 meters</span>
            </div>
            <p className="text-[#74847C] text-[11px] leading-relaxed">
              Coordinates <b>{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</b> match within 12 meters of an existing chronic corridor ({locationName}).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-[#E4EAE5]">
              <span className="text-[10px] text-[#74847C] uppercase font-bold">Historical Incidents</span>
              <div className="text-xl font-bold text-[#172B25] mt-1">4 Events</div>
              <div className="text-[10px] text-[#74847C]">Across past 28 days</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E4EAE5]">
              <span className="text-[10px] text-[#74847C] uppercase font-bold">Average Interval</span>
              <div className="text-xl font-bold text-[#172B25] mt-1">~7.2 Days</div>
              <div className="text-[10px] text-[#74847C]">Weekly cycle detected</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E4EAE5]">
              <span className="text-[10px] text-[#74847C] uppercase font-bold">Recurrence Classification</span>
              <div className="text-xl font-bold text-rose-600 mt-1">CHRONIC (89/100)</div>
              <div className="text-[10px] text-[#74847C]">Relapse after clean verified</div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs font-bold text-[#74847C] hover:text-[#172B25]"
            >
              ← Back to Visual Analysis
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="bg-[#137C62] hover:bg-[#123D32] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              Generate Investigation Report →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Investigation Report */}
      {currentStep === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4EAE5] shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[#E4EAE5] pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#137C62]">
                Final Investigation Dossier
              </span>
              <h3 className="text-lg font-bold text-[#172B25]">
                Root-Cause Hypothesis & Prevention Work Order
              </h3>
            </div>
            <DemoBadge label="Ready to Commit" variant="emerald" />
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
            <div className="font-bold text-amber-900 text-sm">
              Formulated Hypothesis: Wholesale Supply Schedule Mismatch & Missing Trash Grating
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Evidence links repeated early morning dumping with interstate vegetable deliveries offloading 3.5 hours before municipal compactor collection.
            </p>
            <div className="text-[10px] text-amber-800 font-semibold pt-1">
              Uncertainty Rating: Low • Recommended Verification: 48-hour time-and-motion audit with Ward Health Officer.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#E4F4EC]/60 border border-[#C8F169] space-y-2 text-xs">
            <div className="font-bold text-[#123D32]">
              Recommended Civic Work Order:
            </div>
            <p className="text-[#172B25] text-[11px] leading-relaxed">
              Shift dedicated 4.5-tonne compactor vehicle route to arrive at 04:30 AM; install 2-stage galvanized culvert trash rack.
            </p>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#E4EAE5]">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs font-bold text-[#74847C] hover:text-[#172B25]"
            >
              ← Back to Pattern Matching
            </button>

            <button
              onClick={handleCommitInvestigation}
              className="flex items-center gap-2 bg-[#137C62] hover:bg-[#123D32] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#C8F169]" />
              <span>Commit Incident & Open Hotspot Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
