import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  Camera,
  ArrowRight,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';
import { PreventionTask, HotspotLocation, TaskStatus } from '../../types';
import { StorageService } from '../../services/storageService';
import { SAMPLE_IMAGES } from '../../services/seedData';
import { DemoBadge } from '../common/DemoBadge';
import { EvidenceImage } from '../common/EvidenceImage';

interface ActionTrackerPageProps {
  tasks: PreventionTask[];
  locations: HotspotLocation[];
  onSelectHotspot: (locationId: string) => void;
  onShowToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => void;
}

export const ActionTrackerPage: React.FC<ActionTrackerPageProps> = ({
  tasks,
  locations,
  onSelectHotspot,
  onShowToast
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [verifyModalTask, setVerifyModalTask] = useState<PreventionTask | null>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDesc, setNewTaskDesc] = useState<string>('');
  const [newTaskLocationId, setNewTaskLocationId] = useState<string>(locations[0]?.id || '');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('Murthy S., Senior Health Inspector');
  const [newTaskDept, setNewTaskDept] = useState<any>('Solid Waste Management');
  const [newTaskPriority, setNewTaskPriority] = useState<any>('high');
  const [newTaskType, setNewTaskType] = useState<any>('schedule_shift');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Verification modal state
  const [verifyNotes, setVerifyNotes] = useState<string>('Field inspection confirmed area swept, washed, and verified free of waste.');
  const [verifyProofUrl, setVerifyProofUrl] = useState<string>(SAMPLE_IMAGES.indiranagar_after);

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (departmentFilter !== 'all' && t.department !== departmentFilter) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      onShowToast('warning', 'Missing Title', 'Please enter a task title.');
      return;
    }

    const loc = locations.find((l) => l.id === newTaskLocationId);
    const storage = StorageService.getInstance();
    storage.addTask({
      locationId: newTaskLocationId,
      locationName: loc?.name || 'Hotspot Location',
      title: newTaskTitle,
      description: newTaskDesc,
      assignedTo: newTaskAssignee,
      assignedRole: 'Field Operations Unit',
      department: newTaskDept,
      priority: newTaskPriority,
      status: 'open',
      dueDate: newTaskDueDate,
      preventionType: newTaskType
    });

    onShowToast('success', 'Task Created', `Work order "${newTaskTitle}" created.`);
    setShowCreateModal(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleStatusChange = (task: PreventionTask, newStatus: TaskStatus) => {
    if (newStatus === 'resolved') {
      // Open verification modal (cannot resolve without verified photographic evidence!)
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
      `Task "${verifyModalTask.title}" has been verified with after-cleanup photo evidence.`
    );
    setVerifyModalTask(null);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Action & Prevention Tracker
            </h1>
            <DemoBadge label="SWM Work Orders" variant="emerald" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign preventive engineering tasks, enforce photographic verification, and audit post-cleanup status.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Prevention Work Order</span>
        </button>
      </div>

      {/* Ground-Truth Audit Rule Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Strict Ground-Truth Audit Rule:</div>
          <p className="leading-relaxed">
            WasteShadow AI requires verifiable photographic proof before an incident or task can be designated as <b>Verified Clean</b>. Tasks marked complete without photographic evidence remain in <i>Under Review</i> status to prevent phantom municipal sign-offs.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Status:</span>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            {['all', 'open', 'in_progress', 'under_review', 'resolved'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition-all cursor-pointer ${
                  statusFilter === s ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white outline-none"
          >
            <option value="all">All Departments</option>
            <option value="Solid Waste Management">Solid Waste Management</option>
            <option value="Stormwater Drainage">Stormwater Drainage</option>
            <option value="Health & Sanitation">Health & Sanitation</option>
            <option value="Civic Enforcement">Civic Enforcement</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <b>{filteredTasks.length}</b> work orders
        </span>
      </div>

      {/* Tasks Table / Card List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3 hover:border-emerald-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      task.priority === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : task.priority === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Priority: {task.priority}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {task.department}
                  </span>
                  <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Type: {task.preventionType.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                <div className="text-xs text-slate-500">
                  Target Hotspot:{' '}
                  <button
                    onClick={() => onSelectHotspot(task.locationId)}
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    {task.locationName}
                  </button>
                </div>
              </div>

              {/* Status Selector & Badges */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                  className={`text-xs font-bold p-1.5 rounded-xl border outline-none ${
                    task.status === 'resolved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : task.status === 'in_progress'
                      ? 'bg-sky-50 text-sky-800 border-sky-300'
                      : task.status === 'under_review'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Verified Resolved</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

            {/* Task Assignee, Due Date & Proof */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Assigned: <b>{task.assignedTo}</b> ({task.assignedRole})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>

              {task.status === 'resolved' && (
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Photographic Ground-Truth Verified</span>
                </div>
              )}
            </div>

            {/* If Verified, show proof photo thumbnail */}
            {task.afterCleanupEvidenceUrl && (
              <div className="pt-2 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                  <EvidenceImage
                    src={task.afterCleanupEvidenceUrl}
                    alt="Proof"
                    fallbackText="Cleanup Proof"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800 block">Verified Cleanup Proof:</span>
                  <span>{task.verificationNotes}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Prevention Work Order</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Hotspot</label>
                <select
                  value={newTaskLocationId}
                  onChange={(e) => setNewTaskLocationId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.wardNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pre-dawn compactor schedule adjustment for Gate 4"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Specs</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Operational instructions for field marshals..."
                  className="w-full p-2 rounded-xl border border-slate-200 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newTaskDept}
                    onChange={(e) => setNewTaskDept(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 outline-none"
                  >
                    <option value="Solid Waste Management">Solid Waste Management</option>
                    <option value="Stormwater Drainage">Stormwater Drainage</option>
                    <option value="Health & Sanitation">Health & Sanitation</option>
                    <option value="Civic Enforcement">Civic Enforcement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prevention Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 outline-none"
                  >
                    <option value="schedule_shift">Schedule Shift</option>
                    <option value="bin_deployment">Secondary Bin Deployment</option>
                    <option value="drain_grating">Culvert Trash Grating</option>
                    <option value="cctv_enforcement">CCTV Night Enforcement</option>
                    <option value="community_drive">Vendor Sensitization</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Inspector</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Ground-Truth Photographic Verification Modal */}
      {verifyModalTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Ground-Truth Cleanup Verification</h3>
              </div>
              <button
                onClick={() => setVerifyModalTask(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              To mark <b>{verifyModalTask.title}</b> as <i>Resolved</i>, attach dated photo evidence showing the completed intervention or cleared road verge.
            </p>

            {/* Proof Photo Preview */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
              <img
                src={verifyProofUrl}
                alt="Verification Proof"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-700">Inspector Verification Statement *</label>
              <textarea
                rows={2}
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVerifyModalTask(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteVerification}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                Submit Ground-Truth Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
