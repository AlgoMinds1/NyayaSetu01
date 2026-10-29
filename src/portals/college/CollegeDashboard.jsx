import React, { useState } from 'react';
import { getStoredCases, updateCaseStatus } from '../../services/caseService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, BureauBadge, OverlapBadge } from '../../components/common/StatusBadge';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  UserCheck
} from 'lucide-react';

export const CollegeDashboard = () => {
  const { currentUser } = useAuth();
  const [cases, setCases] = useState(getStoredCases());
  const [selectedCase, setSelectedCase] = useState(null);
  const [assignee, setAssignee] = useState('Prof. Arvind Kulkarni');
  const [assignNote, setAssignNote] = useState('');
  const [successToast, setSuccessToast] = useState(null);

  // Institution cases
  const collegeCases = cases.filter(c => c.aicteId === '1-4589211');

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    const updated = updateCaseStatus(
      selectedCase.id,
      "Under Process",
      `Assigned to internal inquiry committee head ${assignee}. Note: ${assignNote || 'Prompt inquiry directed'}`,
      currentUser.name,
      selectedCase.currentBureau
    );
    setCases(updated);
    setSuccessToast(`Case ${selectedCase.id} successfully assigned to ${assignee}`);
    setSelectedCase(null);
    setAssignNote('');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-emerald-500 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              College Management & Principal Portal
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">
              AICTE ID: 1-4589211
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Maharashtra Institute of Technology & Engineering (MITE Pune) — Compliance Desk
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">AICTE Notices</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{collegeCases.length}</p>
          <span className="text-[11px] text-slate-400">Total institutional files</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Show Cause Notices</span>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {collegeCases.filter(c => c.status === 'Show Cause Issued').length}
          </p>
          <span className="text-[11px] text-slate-400">Regulation Bureau inquiries</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">PGRC Student Cases</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {collegeCases.filter(c => c.currentBureau === 'PGRC').length}
          </p>
          <span className="text-[11px] text-slate-400">Under Grievance Cell</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-300 bg-amber-50/40 shadow-sm">
          <span className="text-xs font-bold text-amber-800 uppercase">Dual-Bureau Alerts</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {collegeCases.filter(c => c.overlapStatus === 'COORDINATION_ALERT').length}
          </p>
          <span className="text-[11px] text-amber-700">RB + PGRC Combined inquiry</span>
        </div>
      </div>

      {/* Requisitions / Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-aicte-600" />
              AICTE Compliance Directives & Student Appeals
            </h2>
          </div>
          <span className="text-xs text-slate-400">Response required within 7 days of notice</span>
        </div>

        <div className="divide-y divide-slate-100">
          {collegeCases.map((c) => (
            <div key={c.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-aicte-700">{c.id}</span>
                  <BureauBadge bureau={c.currentBureau} />
                  <StatusBadge status={c.status} />
                  <OverlapBadge status={c.overlapStatus} />
                </div>
                <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {c.slaDaysRemaining} Days left to submit compliance
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{c.description}</p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
                <div className="text-slate-500">
                  Current Assigned Officer: <strong className="text-slate-800">{c.assignedOfficer}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCase(c)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-aicte-600 hover:bg-aicte-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign to Faculty Committee</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Member Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Assign to Grievance Committee Member
            </h3>
            <p className="text-xs text-slate-500">
              Delegating inquiry for AICTE Notice <span className="font-mono font-bold text-slate-800">{selectedCase.id}</span>
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Faculty / Ombudsman
                </label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Prof. Arvind Kulkarni">Prof. Arvind Kulkarni (GRC Convenor - Mech Dept)</option>
                  <option value="Dr. Rekha Deshpande">Dr. Rekha Deshpande (Ombudsperson - Ex-Judge)</option>
                  <option value="Prof. Ramesh Iyer">Prof. Ramesh Iyer (Student Affairs Dean)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Internal Instructions / Mandate
                </label>
                <textarea
                  rows="3"
                  placeholder="E.g., Convene hearing with complainant by Friday, collect bank transaction records..."
                  value={assignNote}
                  onChange={(e) => setAssignNote(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-aicte-600 hover:bg-aicte-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
