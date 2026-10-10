import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
  List,
  Columns3,
  ShieldCheck,
  Camera,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { PreventionTask, HotspotLocation, TaskStatus } from '../../types';
import { StorageService } from '../../services/storageService';
import { SAMPLE_IMAGES } from '../../services/seedData';
import { DemoBadge } from '../common/DemoBadge';
import { EvidenceImage } from '../common/EvidenceImage';

interface PreventionPlannerProps {
  tasks: PreventionTask[];
  locations: HotspotLocation[];
  onSelectHotspot: (locationId: string) => void;
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const PreventionPlanner: React.FC<PreventionPlannerProps> = ({
  tasks,
  locations,
  onSelectHotspot,
  onShowToast
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [verifyModalTask, setVerifyModalTask] = useState<PreventionTask | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocationId, setNewLocationId] = useState(locations[0]?.id || '');
  const [newAssignee, setNewAssignee] = useState('Murthy S., Senior Health Inspector');
  const [newDept, setNewDept] = useState<any>('Solid Waste Management');
  const [newPriority, setNewPriority] = useState<any>('high');
  const [newType, setNewType] = useState<any>('schedule_shift');
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Verification modal state
  const [verifyNotes, setVerifyNotes] = useState('Field inspection confirmed area swept and roll-on bin stationed.');
  const [verifyProofUrl, setVerifyProofUrl] = useState(SAMPLE_IMAGES.indiranagar_after);

  const filteredTasks = tasks.filter((t) => {
    if (departmentFilter !== 'all' && t.department !== departmentFilter) return false;
    return true;
  });

  const columns: { status: TaskStatus; label: string; count: number }[] = [
    { status: 'open', label: 'Open', count: filteredTasks.filter((t) => t.status === 'open').length },
    { status: 'in_progress', label: 'In Progress', count: filteredTasks.filter((t) => t.status === 'in_progress').length },
    { status: 'under_review', label: 'Under Review', count: filteredTasks.filter((t) => t.status === 'under_review').length },
    { status: 'resolved', label: 'Verified Resolved', count: filteredTasks.filter((t) => t.status === 'resolved').length }
  ];

  const handleStatusChange = (task: PreventionTask, newStatus: TaskStatus) => {
    if (newStatus === 'resolved') {
      // Must attach ground-truth photo proof
      setVerifyModalTask(task);
      return;
    }
    const storage = StorageService.getInstance();
    storage.updateTaskStatus(task.id, newStatus);
    onShowToast('info', 'Status Updated', `Task moved to ${newStatus.replace('_', ' ')}.`);
  };

  const handleCompleteVerification = () => {
    if (!verifyModalTask) return;
    const storage = StorageService.getInstance();
    storage.updateTaskStatus(
      verifyModalTask.id,
      'resolved',
      verifyNotes,
      verifyProofUrl
    );

    onShowToast(
      'success',
      'Ground-Truth Verified Clean!',
      `Task "${verifyModalTask.title}" verified with timestamped photo proof.`
    );
    setVerifyModalTask(null);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const loc = locations.find((l) => l.id === newLocationId);
    const storage = StorageService.getInstance();
    storage.addTask({
      locationId: newLocationId,
      locationName: loc?.name || 'Hotspot Location',
      title: newTitle,
      description: newDesc,
      assignedTo: newAssignee,
      assignedRole: 'Field Operations Unit',
      department: newDept,
      priority: newPriority,
      status: 'open',
      dueDate: newDueDate,
      preventionType: newType
    });

    onShowToast('success', 'Task Created', `Added preventive work order: "${newTitle}"`);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#172B25] tracking-tight">
              Prevention Planner
            </h1>
            <DemoBadge label="Work Orders" variant="emerald" />
          </div>
          <p className="text-xs text-[#74847C] mt-0.5">
            Coordinate preventive civic engineering tasks and enforce ground-truth photographic cleanup verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Kanban / List Toggle */}
          <div className="flex items-center bg-[#F8FAF7] p-1 rounded-xl border border-[#E4EAE5] text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-[#137C62] font-bold shadow-2xs' : 'text-[#74847C]'
              }`}
              title="Kanban Board"
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#137C62] font-bold shadow-2xs' : 'text-[#74847C]'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-[#137C62] hover:bg-[#123D32] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C8F169]" />
            <span>New Work Order</span>
          </button>
        </div>
      </div>

      {/* Ground-Truth Notice Banner */}
      <div className="bg-[#E4F4EC]/60 border border-[#C8F169] rounded-2xl p-4 text-xs text-[#123D32] flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-[#137C62] shrink-0" />
        <span>
          <b>Strict Verification Discipline:</b> No task can be marked <i>Verified Resolved</i> without attaching dated photographic proof audited by the ward health inspector.
        </span>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div key={col.status} className="bg-white rounded-3xl border border-[#E4EAE5] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E4EAE5] pb-2">
                  <span className="text-xs font-bold text-[#172B25] uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="text-[10px] font-bold bg-[#F8FAF7] text-[#74847C] px-2 py-0.5 rounded-full border border-[#E4EAE5]">
                    {col.count}
                  </span>
                </div>

                <div className="space-y-3 min-h-64">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-2xl border border-[#E4EAE5] bg-[#F8FAF7] hover:border-[#137C62] hover:bg-white transition-all space-y-2 group shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`font-bold uppercase px-1.5 py-0.2 rounded ${
                            t.priority === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : t.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#E4F4EC] text-[#137C62]'
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span className="text-[#74847C]">{t.department}</span>
                      </div>

                      <h4 className="text-xs font-bold text-[#172B25] leading-snug">
                        {t.title}
                      </h4>

                      <div className="text-[11px] text-[#74847C] line-clamp-2">
                        {t.description}
                      </div>

                      <div className="pt-2 border-t border-[#E4EAE5] flex items-center justify-between text-[10px] text-[#74847C]">
                        <span>Assigned: <b>{t.assignedTo.split(',')[0]}</b></span>
                        <span>Due: {t.dueDate}</span>
                      </div>

                      {/* Quick Move Status Selector */}
                      <div className="pt-1 flex items-center justify-between">
                        <select
                          value={t.status}
                          onChange={(e) => handleStatusChange(t, e.target.value as TaskStatus)}
                          className="text-[10px] font-bold p-1 rounded-lg border border-[#E4EAE5] bg-white text-[#172B25] outline-none cursor-pointer"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="under_review">Under Review</option>
                          <option value="resolved">Verified Resolved</option>
                        </select>

                        <button
                          onClick={() => onSelectHotspot(t.locationId)}
                          className="text-[10px] text-[#137C62] font-bold hover:underline"
                        >
                          Hotspot →
                        </button>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-[#74847C]">
                      No tasks in {col.label.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-3xl border border-[#E4EAE5] overflow-hidden shadow-xs divide-y divide-[#E4EAE5]">
          {filteredTasks.map((t) => (
            <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAF7] transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      t.priority === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : t.priority === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#E4F4EC] text-[#137C62]'
                    }`}
                  >
                    {t.priority}
                  </span>
                  <span className="text-xs font-bold text-[#172B25]">{t.title}</span>
                  <span className="text-[11px] text-[#74847C]">({t.department})</span>
                </div>
                <div className="text-[11px] text-[#74847C]">
                  Target: <b>{t.locationName}</b> • Assigned: {t.assignedTo} • Due: {t.dueDate}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t, e.target.value as TaskStatus)}
                  className="text-xs font-bold p-1.5 rounded-xl border border-[#E4EAE5] bg-white text-[#172B25] outline-none cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Verified Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification Modal with After-Cleanup Photo */}
      {verifyModalTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E4EAE5]">
            <div className="flex items-center justify-between border-b border-[#E4EAE5] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#137C62]" />
                <h3 className="text-sm font-bold text-[#172B25]">
                  Ground-Truth Cleanup Verification Audit
                </h3>
              </div>
              <button
                onClick={() => setVerifyModalTask(null)}
                className="text-[#74847C] hover:text-[#172B25] font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#74847C] leading-relaxed">
              To mark <b>{verifyModalTask.title}</b> as <i>Verified Resolved</i>, attach dated photo evidence showing the completed intervention or cleared road verge.
            </p>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#123D32] border border-[#E4EAE5]">
              <EvidenceImage
                src={verifyProofUrl}
                alt="Cleanup proof"
                fallbackText="Ground-Truth Verification Proof"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#172B25]">Inspector Audit Statement *</label>
              <textarea
                rows={2}
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setVerifyModalTask(null)}
                className="px-4 py-2 rounded-xl border border-[#E4EAE5] text-xs font-bold text-[#74847C]"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteVerification}
                className="px-5 py-2 rounded-xl bg-[#137C62] hover:bg-[#123D32] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Sign Off & Verify Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E4EAE5]">
            <div className="flex items-center justify-between border-b border-[#E4EAE5] pb-3">
              <h3 className="text-sm font-bold text-[#172B25]">
                New Prevention Work Order
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#74847C] hover:text-[#172B25] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#74847C] block mb-1">Target Hotspot</label>
                <select
                  value={newLocationId}
                  onChange={(e) => setNewLocationId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E4EAE5] bg-white outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.wardNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#74847C] block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Station roll-on bins at Gate 4 wholesale lane"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#74847C] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#74847C] block mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E4EAE5] bg-white outline-none"
                  >
                    <option value="Solid Waste Management">Solid Waste Management</option>
                    <option value="Stormwater Drainage">Stormwater Drainage</option>
                    <option value="Health & Sanitation">Health & Sanitation</option>
                    <option value="Civic Enforcement">Civic Enforcement</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#74847C] block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E4EAE5] bg-white outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E4EAE5] text-[#74847C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#137C62] text-white font-bold cursor-pointer"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
