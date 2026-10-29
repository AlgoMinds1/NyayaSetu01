import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Under Process':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Escalated':
        return 'bg-red-50 text-red-700 border-red-200 animate-pulse';
      case 'Disposed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Response':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Show Cause Issued':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};

export const BureauBadge = ({ bureau }) => {
  const getStyle = () => {
    switch (bureau) {
      case 'RB':
      case 'Regulation Bureau (RB)':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PGRC':
      case 'Public Grievance Redressal Cell (PGRC)':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'AB':
      case 'Approval Bureau (AB)':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStyle()}`}>
      {bureau}
    </span>
  );
};

export const OverlapBadge = ({ status }) => {
  if (status === 'COORDINATION_ALERT') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <span className="mr-1">⚠️</span> Overlap Alert: Dual Bureau
      </span>
    );
  }
  if (status === 'POTENTIAL_DUPLICATE') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
        <span className="mr-1">🔗</span> Common Institution Proceeding
      </span>
    );
  }
  if (status === 'LINKED_COORDINATED') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
        ✓ Linked & Coordinated
      </span>
    );
  }
  return (
    <span className="text-xs text-slate-400">Independent</span>
  );
};
