import React, { useState } from 'react';
import { getStoredCases } from '../../services/caseService';
import { 
  Download, 
  BarChart2, 
  PieChart, 
  Calendar, 
  CheckCircle, 
  FileSpreadsheet, 
  TrendingUp,
  AlertOctagon
} from 'lucide-react';

export const ReportsView = () => {
  const cases = getStoredCases();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Ageing breakdown
  const lessThan7Days = cases.filter(c => c.slaDaysRemaining > 7).length;
  const between7And14 = cases.filter(c => c.slaDaysRemaining >= 3 && c.slaDaysRemaining <= 7).length;
  const criticalAging = cases.filter(c => c.slaDaysRemaining < 3 && c.status !== 'Disposed').length;

  const handleExportCSV = () => {
    // Generate real CSV string from current data
    const headers = ["Case ID", "AICTE ID", "Institution Name", "Bureau", "Category", "Status", "Complainant", "Date Submitted", "Overlap Alert"];
    const rows = cases.map(c => [
      c.id,
      c.aicteId,
      `"${c.institutionName}"`,
      c.currentBureau,
      `"${c.category}"`,
      c.status,
      c.complainantRole,
      c.dateSubmitted,
      c.overlapStatus
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AICTE_Case_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AICTE Statutory Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Bureau workload distribution, ageing analysis, and exportable regulatory audit trails.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{downloadSuccess ? "Exported Successfully!" : "Export AICTE CSV Report"}</span>
        </button>
      </div>

      {/* Analytics Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Disposal Efficiency</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">74.2%</div>
          <p className="text-xs text-slate-500 mt-1">Average resolution time: 11.4 days</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Cross-Bureau Coordinated</span>
            <AlertOctagon className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {cases.filter(c => c.overlapStatus !== 'NONE').length} Cases
          </div>
          <p className="text-xs text-slate-500 mt-1">Prevented redundant inspections</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Beyond SLA</span>
            <Calendar className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">{criticalAging} Cases</div>
          <p className="text-xs text-slate-500 mt-1">Immediate Chairman review required</p>
        </div>
      </div>

      {/* Ageing Analysis Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-aicte-600" />
          Pending Case Ageing & SLA Compliance Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Ageing Bracket</th>
                <th className="py-2.5 px-3">Regulation Bureau</th>
                <th className="py-2.5 px-3">PGRC Cell</th>
                <th className="py-2.5 px-3">Regional Offices</th>
                <th className="py-2.5 px-3">Total Volume</th>
                <th className="py-2.5 px-3">Action Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">&lt; 7 Days (Fresh)</td>
                <td className="py-3 px-3">1</td>
                <td className="py-3 px-3">2</td>
                <td className="py-3 px-3">1</td>
                <td className="py-3 px-3 font-bold">4</td>
                <td className="py-3 px-3 text-emerald-600 font-semibold">Standard Processing</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">7 - 14 Days (Intermediate)</td>
                <td className="py-3 px-3">1</td>
                <td className="py-3 px-3">1</td>
                <td className="py-3 px-3">0</td>
                <td className="py-3 px-3 font-bold">2</td>
                <td className="py-3 px-3 text-amber-600 font-semibold">Reminder Notice</td>
              </tr>
              <tr className="bg-rose-50/40">
                <td className="py-3 px-3 font-bold text-rose-800">&gt; 14 Days (Critical SLA Breached)</td>
                <td className="py-3 px-3 font-bold text-rose-800">1</td>
                <td className="py-3 px-3 font-bold text-rose-800">0</td>
                <td className="py-3 px-3 font-bold text-rose-800">1</td>
                <td className="py-3 px-3 font-bold text-rose-800">2</td>
                <td className="py-3 px-3 text-rose-700 font-bold">Auto-Escalated to Bureau Chief</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
