import { HotspotLocation, Incident, RootCauseHypothesis, PreventionTask, AIAnalysisResult, TaskStatus } from '../types';
import { INITIAL_LOCATIONS, INITIAL_INCIDENTS, INITIAL_HYPOTHESES, INITIAL_PREVENTION_TASKS } from './seedData';
import { computeRecurrenceMetrics, classifyRecurrence, findMatchingHotspot } from './recurrenceEngine';

const STORAGE_KEYS = {
  LOCATIONS: 'wasteshadow_locations_v6',
  INCIDENTS: 'wasteshadow_incidents_v6',
  HYPOTHESES: 'wasteshadow_hypotheses_v6',
  TASKS: 'wasteshadow_tasks_v6',
  USER_ROLE: 'wasteshadow_user_role_v6'
};

export class StorageService {
  private static instance: StorageService;

  private locations: HotspotLocation[] = [];
  private incidents: Incident[] = [];
  private hypotheses: RootCauseHypothesis[] = [];
  private tasks: PreventionTask[] = [];
  private userRole: 'ward_officer' | 'swm_inspector' | 'citizen' | 'admin' = 'ward_officer';

  private constructor() {
    this.cleanLegacyStorage();
    this.loadFromStorage();
  }

  private cleanLegacyStorage() {
    try {
      // Clear out older cache versions that had external/broken, duplicate, or svg URLs
      const legacyVersions = ['v1', 'v2', 'v3', 'v4', 'v5'];
      legacyVersions.forEach((v) => {
        localStorage.removeItem(`wasteshadow_locations_${v}`);
        localStorage.removeItem(`wasteshadow_incidents_${v}`);
        localStorage.removeItem(`wasteshadow_hypotheses_${v}`);
        localStorage.removeItem(`wasteshadow_tasks_${v}`);
        localStorage.removeItem(`wasteshadow_user_role_${v}`);
      });
    } catch {
      // ignore
    }
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private loadFromStorage() {
    try {
      const locStr = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
      const incStr = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      const hypStr = localStorage.getItem(STORAGE_KEYS.HYPOTHESES);
      const tskStr = localStorage.getItem(STORAGE_KEYS.TASKS);
      const rolStr = localStorage.getItem(STORAGE_KEYS.USER_ROLE);

      this.locations = locStr ? JSON.parse(locStr) : [...INITIAL_LOCATIONS];
      this.incidents = incStr ? JSON.parse(incStr) : [...INITIAL_INCIDENTS];
      this.hypotheses = hypStr ? JSON.parse(hypStr) : [...INITIAL_HYPOTHESES];
      this.tasks = tskStr ? JSON.parse(tskStr) : [...INITIAL_PREVENTION_TASKS];
      this.userRole = (rolStr as any) || 'ward_officer';

      // Ensure all seed incidents & locations have distinct, guaranteed visible photos
      const seedIncidentMap = new Map(INITIAL_INCIDENTS.map((inc) => [inc.id, inc.photoUrl]));
      let modified = false;

      this.incidents = this.incidents.map((inc) => {
        const canonicalPhoto = seedIncidentMap.get(inc.id);
        if (canonicalPhoto && (inc.photoUrl !== canonicalPhoto || inc.photoUrl.includes('unsplash.com'))) {
          modified = true;
          return { ...inc, photoUrl: canonicalPhoto };
        }
        return inc;
      });

      const seedLocationMap = new Map(INITIAL_LOCATIONS.map((loc) => [loc.id, loc.imageUrl]));
      this.locations = this.locations.map((loc) => {
        const canonicalImage = seedLocationMap.get(loc.id);
        if (canonicalImage && (loc.imageUrl !== canonicalImage || loc.imageUrl?.includes('unsplash.com'))) {
          modified = true;
          return { ...loc, imageUrl: canonicalImage };
        }
        return loc;
      });

      if (!locStr || !incStr || modified) {
        this.persist();
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial memory seeds', e);
      this.locations = [...INITIAL_LOCATIONS];
      this.incidents = [...INITIAL_INCIDENTS];
      this.hypotheses = [...INITIAL_HYPOTHESES];
      this.tasks = [...INITIAL_PREVENTION_TASKS];
      this.persist();
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(this.locations));
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(this.incidents));
      localStorage.setItem(STORAGE_KEYS.HYPOTHESES, JSON.stringify(this.hypotheses));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.tasks));
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, this.userRole);
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  public resetToDefaults() {
    this.locations = [...INITIAL_LOCATIONS];
    this.incidents = [...INITIAL_INCIDENTS];
    this.hypotheses = [...INITIAL_HYPOTHESES];
    this.tasks = [...INITIAL_PREVENTION_TASKS];
    this.userRole = 'ward_officer';
    this.persist();
  }

  // Getters
  public getLocations(): HotspotLocation[] {
    return [...this.locations];
  }

  public getLocationById(id: string): HotspotLocation | undefined {
    return this.locations.find((l) => l.id === id);
  }

  public getIncidents(): Incident[] {
    return [...this.incidents];
  }

  public getIncidentsForLocation(locationId: string): Incident[] {
    return this.incidents.filter((i) => i.locationId === locationId);
  }

  public getHypotheses(): RootCauseHypothesis[] {
    return [...this.hypotheses];
  }

  public getHypothesesForLocation(locationId: string): RootCauseHypothesis[] {
    return this.hypotheses.filter((h) => h.locationId === locationId);
  }

  public getTasks(): PreventionTask[] {
    return [...this.tasks];
  }

  public getTasksForLocation(locationId: string): PreventionTask[] {
    return this.tasks.filter((t) => t.locationId === locationId);
  }

  public getUserRole() {
    return this.userRole;
  }

  public setUserRole(role: 'ward_officer' | 'swm_inspector' | 'citizen' | 'admin') {
    this.userRole = role;
    this.persist();
  }

  // Mutators
  public addIncident(newIncident: Omit<Incident, 'id'> & { id?: string }): { incident: Incident; hotspot: HotspotLocation } {
    const id = newIncident.id || `inc_${Date.now()}`;
    const incident: Incident = {
      ...newIncident,
      id
    };

    // Check if matches an existing hotspot nearby
    let matchingHotspot = findMatchingHotspot(
      incident.coordinates.lat,
      incident.coordinates.lng,
      this.locations,
      120 // 120m threshold
    );

    if (matchingHotspot) {
      incident.locationId = matchingHotspot.id;
      incident.locationName = matchingHotspot.name;
    } else {
      // Create new hotspot location
      const newLocId = `loc_${Date.now()}`;
      incident.locationId = newLocId;
      matchingHotspot = {
        id: newLocId,
        name: incident.locationName || `Location near ${incident.coordinates.lat.toFixed(4)}, ${incident.coordinates.lng.toFixed(4)}`,
        wardNumber: 'Ward 84 (Auto-detected)',
        zone: 'Central Zone',
        city: 'Bengaluru',
        coordinates: incident.coordinates,
        address: incident.locationName,
        landmark: 'Near reported GPS coordinate',
        classification: 'one_time',
        recurrenceScore: 15,
        firstReportedAt: incident.reportedAt,
        lastReportedAt: incident.reportedAt,
        totalIncidents: 1,
        resolvedIncidents: 0,
        averageIntervalDays: 0,
        primaryCategory: incident.category,
        drainRisk: incident.analysis?.drainBlockage.risk || 'none',
        investigationStatus: 'open',
        description: incident.notes || 'Newly logged civic waste occurrence awaiting field verification.',
        imageUrl: incident.photoUrl
      };
      this.locations.push(matchingHotspot);
    }

    this.incidents.unshift(incident);

    // Recalculate metrics for this hotspot
    const locationIncidents = this.getIncidentsForLocation(matchingHotspot.id);
    const metrics = computeRecurrenceMetrics(locationIncidents);
    const classification = classifyRecurrence(locationIncidents);

    matchingHotspot.totalIncidents = locationIncidents.length;
    matchingHotspot.recurrenceScore = metrics.totalScore;
    matchingHotspot.classification = classification;
    matchingHotspot.lastReportedAt = incident.reportedAt;
    if (incident.analysis?.drainBlockage.risk && incident.analysis.drainBlockage.risk !== 'none') {
      matchingHotspot.drainRisk = incident.analysis.drainBlockage.risk;
    }

    // Update location in list
    const locIdx = this.locations.findIndex((l) => l.id === matchingHotspot!.id);
    if (locIdx >= 0) {
      this.locations[locIdx] = matchingHotspot;
    }

    // Auto-generate hypothesis if recurring hotspot has no hypothesis yet
    if (classification !== 'one_time' && this.getHypothesesForLocation(matchingHotspot.id).length === 0) {
      this.generateAutomaticHypothesis(matchingHotspot, locationIncidents);
    }

    this.persist();
    return { incident, hotspot: matchingHotspot };
  }

  private generateAutomaticHypothesis(hotspot: HotspotLocation, incidents: Incident[]) {
    const isDrain = hotspot.drainRisk !== 'none';
    const hyp: RootCauseHypothesis = {
      id: `hyp_${Date.now()}`,
      locationId: hotspot.id,
      title: isDrain
        ? 'Repeated Obstruction of Culvert Grill by Packaging Discards'
        : 'Chronic Supply Schedule Mismatch & Missing Secondary Waste Deposit Infrastructure',
      category: isDrain ? 'drain_culvert_litter' : 'collection_frequency',
      confidenceScore: 82,
      uncertaintyLevel: 'medium',
      supportingEvidence: [
        `Detected ${incidents.length} recurring occurrences with average cadence of ${hotspot.averageIntervalDays || 7} days.`,
        `Dominant waste profile: ${hotspot.primaryCategory.replace('_', ' ')}.`,
        'Persistent accumulation at exact geographic coordinates.'
      ],
      missingInformation: [
        'Local commercial trader schedule survey',
        'CCTV night surveillance audit'
      ],
      verificationStep: 'Conduct 48-hour spot inspection with Ward SWM marshal.',
      suggestedPreventionAction: isDrain
        ? 'Deploy 2-stage galvanized trash rack and daily pre-monsoon clearing roster.'
        : 'Position dedicated 1.5-tonne compactor vehicle during early morning transit hours.',
      isAiGenerated: true,
      priority: 'high'
    };
    this.hypotheses.push(hyp);
  }

  public addTask(task: Omit<PreventionTask, 'id' | 'createdAt'>): PreventionTask {
    const newTask: PreventionTask = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.tasks.unshift(newTask);
    this.persist();
    return newTask;
  }

  public updateTaskStatus(taskId: string, status: TaskStatus, verificationNotes?: string, afterProofUrl?: string) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.status = status;
    if (verificationNotes) task.verificationNotes = verificationNotes;
    if (afterProofUrl) task.afterCleanupEvidenceUrl = afterProofUrl;
    if (status === 'resolved') {
      task.verifiedAt = new Date().toISOString();
      // If task resolved, check if hotspot should be updated
      const location = this.getLocationById(task.locationId);
      if (location) {
        location.resolvedIncidents = (location.resolvedIncidents || 0) + 1;
        if (location.resolvedIncidents >= location.totalIncidents) {
          location.investigationStatus = 'verified_clean';
        }
      }
    }
    this.persist();
  }

  public updateInvestigationStatus(locationId: string, status: any) {
    const loc = this.getLocationById(locationId);
    if (loc) {
      loc.investigationStatus = status;
      this.persist();
    }
  }

  public addHypothesis(hyp: Omit<RootCauseHypothesis, 'id'>): RootCauseHypothesis {
    const newHyp: RootCauseHypothesis = {
      ...hyp,
      id: `hyp_${Date.now()}`
    };
    this.hypotheses.unshift(newHyp);
    this.persist();
    return newHyp;
  }
}
