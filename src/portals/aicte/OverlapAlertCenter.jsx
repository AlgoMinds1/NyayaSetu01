import React, { useState } from 'react';
import { getStoredCases, resolveOverlap } from '../../services/caseService';
import { StatusBadge, BureauBadge } from '../../components/common/StatusBadge';
import { 
  AlertTriangle, 
  Link2, 
  CheckCircle, 
  Building2, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Info,
  Check,
  X
} from 'lucide-react';

export const OverlapAlertCenter = () => {
  const [cases, setCases] = useState(getStoredCases());
  const [successToast, setSuccessToast] = useState(null);

  // Group cases that have overlaps
  const overlapCases = cases.filter(c => c.overlapStatus === 'COORDINATION_ALERT');

  // Pair up the matching cases
  const pairs = [];
  const processed = new Set();

  overlapCases.forEach(caseA => {
    if (!processed.has(caseA.id)) {
      const match = cases.find(c => c.id === caseA.overlapWithCaseId);
      if (match) {
        pairs.push({ primary: caseA, counterpart: match });
        processed.add(caseA.id);
        processed.add(match.id);
      }
    }
  });

  const handleCoordinate = (primaryId, counterpartId, instituteName) => {
    const updated = resolveOverlap(
      primaryId, 
      counterpartId, 
      "COORDINATE", 
      `AICTE Joint Hearing scheduled. Regulation Bureau and PGRC merged communications for ${instituteName}.`
    );
    setCases(updated);
    setSuccessToast(`Successfully merged coordination for ${instituteName}. Both Bureaus notified.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDismiss = (primaryId, counterpartId) => {
    const updated = resolveOverlap(
      primaryId, 
      counterpartId, 
      "DISMISS", 
      "Marked as distinct non-overlapping proceedings upon officer review."
    );
    setCases(updated);
    setSuccessToast("Overlap alert dismissed.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-emerald-500 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Cross-Bureau Overlap Alert & Coordination Center
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Automated detection of parallel proceedings across Regulation Bureau (RB), PGRC, and Regional Offices.
            </p>
          </div>
        </div>
      </div>

      {/* Explanation Banner for Judges */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-blue-100">
            <p className="font-bold text-white text-sm">How NyayaSetu AI Solves AICTE's Core Problem:</p>
            <p>
              Previously, an institution might face a student complaint in PGRC (e.g. fee overcharging) while simultaneously facing a regulatory inspection in Regulation Bureau (RB) without either bureau knowing. This caused redundant notices, contradictory orders, and wasted resources.
            </p>
            <p className="text-amber-300 font-medium">
              NyayaSetu AI uses AICTE Permanent IDs and entity-matching logic to raise immediate coordination alerts whenever multiple cells act on the same college.
            </p>
          </div>
        </div>
      </div>

      {/* Overlap Pairs Grid */}
      {pairs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">All Overlaps Resolved or Coordinated</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            No pending dual-bureau conflicts detected. All parallel actions between RB and PGRC are synchronized.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Active Dual-Bureau Conflicts ({pairs.length})
            </h2>
            <span className="text-xs text-slate-500">Auto-detected by NyayaSetu Overlap Engine</span>
          </div>

          {pairs.map(({ primary, counterpart }, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {/* Institution Bar */}
              <div className="bg-amber-500/10 border-b border-amber-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-amber-700" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{primary.institutionName}</h3>
                    <p className="text-xs text-slate-500">
                      Permanent AICTE ID: <span className="font-mono font-bold text-slate-700">{primary.aicteId}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 border border-amber-300">
                    Dual Action: {primary.currentBureau} ⇄ {counterpart.currentBureau}
                  </span>
                </div>
              </div>

              {/* Side by side comparison */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                {/* Visual Connector in the middle */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-amber-500 text-white items-center justify-center shadow-lg border-2 border-white font-bold text-xs">
                  VS
                </div>

                {/* Case 1: PGRC or Bureau 1 */}
                <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BureauBadge bureau={primary.currentBureau} />
                      <span className="text-xs font-mono font-bold text-slate-700">{primary.id}</span>
                    </div>
                    <StatusBadge status={primary.status} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{primary.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">{primary.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Officer In-Charge:</span>
                      <span className="font-medium text-slate-700">{primary.assignedOfficer}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Source / Complainant:</span>
                      <span className="font-medium text-slate-700">{primary.complainantRole} ({primary.complainantName})</span>
                    </div>
                  </div>
                </div>

                {/* Case 2: Regulation Bureau or Counterpart */}
                <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BureauBadge bureau={counterpart.currentBureau} />
                      <span className="text-xs font-mono font-bold text-slate-700">{counterpart.id}</span>
                    </div>
                    <StatusBadge status={counterpart.status} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{counterpart.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">{counterpart.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Officer In-Charge:</span>
                      <span className="font-medium text-slate-700">{counterpart.assignedOfficer}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Source / Complainant:</span>
                      <span className="font-medium text-slate-700">{counterpart.complainantRole} ({counterpart.complainantName})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Recommended Action:</span> Merge into a Joint Committee Hearing under AICTE Regulation Bureau to avoid redundant institutional inspection.
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => handleDismiss(primary.id, counterpart.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Dismiss (Independent)
                  </button>
                  <button
                    onClick={() => handleCoordinate(primary.id, counterpart.id, primary.institutionName)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-aicte-600 hover:bg-aicte-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Link & Synchronize Bureaus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
