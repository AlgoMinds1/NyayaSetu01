import React, { useState } from 'react';
import { getStoredCases } from '../../services/caseService';
import { StatusBadge, BureauBadge } from '../../components/common/StatusBadge';
import { Timeline } from '../../components/common/Timeline';
import { Shield, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const StudentCaseDetail = () => {
  const cases = getStoredCases();
  // Select first student complaint
  const activeCase = cases.find(c => c.complainantRole === 'Student') || cases[0];
  const [selectedCase] = useState(activeCase);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Live Grievance Tracking & Timeline
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Transparent chronological audit trail of actions taken by College GRC and AICTE Bureaus.
            </p>
          </div>
        </div>
      </div>

      {/* Case Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                {selectedCase.id}
              </span>
              <StatusBadge status={selectedCase.status} />
              <BureauBadge bureau={selectedCase.currentBureau} />
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-2">{selectedCase.title}</h2>
            <p className="text-xs text-slate-500">{selectedCase.institutionName}</p>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-400 block">SLA Commitment:</span>
            <span className="font-bold text-emerald-600">Disposal target in {selectedCase.slaDaysRemaining} days</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Original Grievance Text:</h4>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {selectedCase.description}
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Official Action History & Redressal Steps
          </h4>
          <Timeline history={selectedCase.history} />
        </div>
      </div>
    </div>
  );
};
