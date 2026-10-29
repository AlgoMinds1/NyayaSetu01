import React, { useState } from 'react';
import { getStoredCases } from '../../services/caseService';
import { KPITile } from '../../components/common/KPITile';
import { StatusBadge, BureauBadge, OverlapBadge } from '../../components/common/StatusBadge';
import { 
  FolderKanban, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Building, 
  Layers,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AicteDashboard = () => {
  const [cases] = useState(getStoredCases());

  const totalCases = cases.length;
  const inProcess = cases.filter(c => c.status === 'Under Process').length;
  const disposed = cases.filter(c => c.status === 'Disposed').length;
  const overlapAlerts = cases.filter(c => c.overlapStatus === 'COORDINATION_ALERT').length;
  const overdueSla = cases.filter(c => c.slaDaysRemaining <= 2 && c.status !== 'Disposed').length;

  // Bureau breakdown calculation
  const rbCount = cases.filter(c => c.currentBureau === 'RB').length;
  const pgrcCount = cases.filter(c => c.currentBureau === 'PGRC').length;
  const roCount = cases.filter(c => c.currentBureau.startsWith('RO')).length;
  const otherCount = totalCases - rbCount - pgrcCount - roCount;

  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AICTE Integrated Case Dashboard</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
              Single-Window Grid
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time monitoring, cross-bureau coordination, and institution tracking across RB, PGRC & Regional Offices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/aicte/overlaps"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Review Overlaps ({overlapAlerts})</span>
          </Link>
          <Link
            to="/aicte/cases"
            className="inline-flex items-center gap-2 px-4 py-2 bg-aicte-600 hover:bg-aicte-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <FolderKanban className="w-4 h-4" />
            <span>Master Case Explorer</span>
          </Link>
        </div>
      </div>

      {/* Prominent Overlap Notice Banner */}
      {overlapAlerts > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Action Required: {overlapAlerts} Potential Cross-Bureau Overlaps Detected
              </h3>
              <p className="text-xs text-amber-800 mt-1">
                Regulation Bureau (RB) and Public Grievance Redressal Cell (PGRC) are simultaneously processing independent actions against the same technical institutions. Coordination is needed to prevent conflicting hearings.
              </p>
            </div>
          </div>
          <Link
            to="/aicte/overlaps"
            className="shrink-0 ml-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded-md transition-colors"
          >
            <span>Resolve Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPITile
          title="Total Complaints"
          value={totalCases}
          subtext="Across all AICTE Bureaus"
          icon={FolderKanban}
          trend={{ label: "+12% this month", positive: false }}
        />
        <KPITile
          title="Under Active Process"
          value={inProcess}
          subtext="Hearings & inquiries ongoing"
          icon={Clock}
        />
        <KPITile
          title="Cases Disposed"
          value={disposed}
          subtext="Redressed or finalized"
          icon={CheckCircle2}
          trend={{ label: "86% satisfaction", positive: true }}
        />
        <KPITile
          title="Bureau Overlaps"
          value={overlapAlerts}
          subtext="Same institute in RB + PGRC"
          icon={AlertTriangle}
          alert={true}
        />
        <KPITile
          title="SLA Escalation Risk"
          value={overdueSla}
          subtext="Expiring in < 48 hours"
          icon={Scale}
        />
      </div>

      {/* Bureau Workload Distribution & Regional Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload breakdown */}
        <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-aicte-600" />
              Bureau / Cell Distribution
            </h2>
            <span className="text-xs text-slate-500 font-mono">Real-time</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Regulation Bureau (RB)</span>
                <span className="font-bold">{rbCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${(rbCount / totalCases) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Public Grievance Cell (PGRC)</span>
                <span className="font-bold">{pgrcCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-sky-500 h-2 rounded-full" 
                  style={{ width: `${(pgrcCount / totalCases) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Regional Offices (RO)</span>
                <span className="font-bold">{roCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${(roCount / totalCases) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Approval Bureau (AB) / Others</span>
                <span className="font-bold">{otherCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-teal-500 h-2 rounded-full" 
                  style={{ width: `${Math.max(5, (otherCount / totalCases) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Single Source of Truth:</strong> Any grievance filed anywhere triggers an immediate check against RB inspections to avoid duplicated college notices.
            </p>
          </div>
        </div>

        {/* Recent Cases Across Bureaus */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Cases Across All Bureaus</h2>
              <p className="text-xs text-slate-500">Live feed of grievances, regulatory audits, and student petitions</p>
            </div>
            <Link to="/aicte/cases" className="text-xs font-semibold text-aicte-600 hover:text-aicte-700 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Institution</th>
                  <th className="py-2.5 px-3">Bureau</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Overlap Detection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-aicte-700">
                      {c.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[220px]">{c.institutionName}</div>
                      <div className="text-[10px] text-slate-500">ID: {c.aicteId} • {c.category}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <BureauBadge bureau={c.currentBureau} />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-2.5 px-3">
                      <OverlapBadge status={c.overlapStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
