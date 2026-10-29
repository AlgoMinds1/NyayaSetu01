import React, { useState } from 'react';
import { getStoredCases, updateCaseStatus } from '../../services/caseService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, BureauBadge } from '../../components/common/StatusBadge';
import { 
  Inbox, 
  Send, 
  UserX, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react';

export const FacultyDashboard = () => {
  const { currentUser } = useAuth();
  const [cases, setCases] = useState(getStoredCases());
  const [selectedCase, setSelectedCase] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);

  // Faculty committee member cases
  const assignedCases = cases.filter(c => 
    c.category.includes('Faculty') || 
    c.aicteId === '1-4589211'
  );

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    const updated = updateCaseStatus(
      selectedCase.id,
      "Under Process",
      `Faculty GRC response submitted: ${remarks}`,
      currentUser.name,
      selectedCase.currentBureau
    );
    setCases(updated);
    setActionSuccess("Committee observation recorded and forwarded to Principal.");
    setSelectedCase(null);
    setRemarks('');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleRecuse = (caseItem) => {
    if (window.confirm("Are you sure you want to recuse from this grievance inquiry due to potential conflict of interest?")) {
      const updated = updateCaseStatus(
        caseItem.id,
        "Pending Response",
        `${currentUser.name} formally recused from inquiry due to conflict of interest. Reassignment requested.`,
        currentUser.name,
        caseItem.currentBureau
      );
      setCases(updated);
      setActionSuccess("Recusal registered. Case returned to College Management for re-allocation.");
      setTimeout(() => setActionSuccess(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-emerald-500 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Faculty Grievance Redressal Committee (GRC) Inbox
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded">
              Committee Member
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Institutional grievance hearing hearings, evidence scrutiny, and statutory replies to AICTE.
          </p>
        </div>
        <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          Assigned to Committee: <strong>{assignedCases.length} Cases</strong>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Inbox className="w-4 h-4 text-aicte-600" />
            Assigned Inquiries & Hearings
          </h2>
          <span className="text-xs text-slate-400">Under AICTE GRC Mandate 2019</span>
        </div>

        <div className="divide-y divide-slate-100">
          {assignedCases.map((c) => (
            <div key={c.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-aicte-700">{c.id}</span>
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{c.category}</span>
                </div>
                <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {c.slaDaysRemaining} Days Remaining for Hearing Report
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{c.description}</p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
                <div className="text-slate-500">
                  Complainant: <strong className="text-slate-800">{c.complainantRole} ({c.complainantName})</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRecuse(c)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors font-medium"
                    title="Recuse if you have personal interest or bias"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Recuse from Committee</span>
                  </button>
                  <button
                    onClick={() => setSelectedCase(c)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-aicte-600 hover:bg-aicte-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Hearing Findings</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hearing Findings Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Submit GRC Committee Observation / Defense
            </h3>
            <p className="text-xs text-slate-500">
              Reporting for <span className="font-mono font-bold text-slate-800">{selectedCase.id}</span>
            </p>

            <form onSubmit={handleResponseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hearing Findings & Corrective Action Undertaken
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Record minutes of meeting, examination of student records, or remedial action taken by the college..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-aicte-500"
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
                  Submit Official Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
