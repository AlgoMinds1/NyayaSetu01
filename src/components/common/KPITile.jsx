import React from 'react';

export const KPITile = ({ title, value, subtext, icon: Icon, trend, alert }) => {
  return (
    <div className={`p-5 bg-white rounded-xl border transition-all duration-150 shadow-sm hover:shadow-md ${alert ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${alert ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold ${trend.positive ? 'text-emerald-600' : 'text-slate-500'}`}>
            {trend.label}
          </span>
        )}
      </div>
      {subtext && (
        <p className="mt-1 text-xs text-slate-500 leading-normal">{subtext}</p>
      )}
    </div>
  );
};
