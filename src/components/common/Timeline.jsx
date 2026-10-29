import React from 'react';
import { Clock, ShieldCheck, ArrowRightLeft, FileText, AlertTriangle } from 'lucide-react';

export const Timeline = ({ history }) => {
  if (!history || history.length === 0) {
    return <p className="text-sm text-slate-400 py-4 italic">No chronological events logged yet.</p>;
  }

  const getIcon = (action, bureau) => {
    if (bureau === 'Cross-Bureau' || action.includes('ALERT') || action.includes('Overlap')) {
      return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
    if (action.includes('transferred') || action.includes('Escalated')) {
      return <ArrowRightLeft className="w-4 h-4 text-blue-600" />;
    }
    if (action.includes('Disposed') || action.includes('admitted')) {
      return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
    return <FileText className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((event, idx) => (
          <li key={idx}>
            <div className="relative pb-8">
              {idx !== history.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${
                    event.bureau === 'Cross-Bureau' ? 'bg-amber-100' : 'bg-slate-100'
                  }`}>
                    {getIcon(event.action, event.bureau)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {event.action}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{event.actor}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
                        {event.bureau}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs whitespace-nowrap text-slate-400 font-mono">
                    {event.date}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
