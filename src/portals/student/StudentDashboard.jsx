import React, { useState } from 'react';
import { getStoredCases } from '../../services/caseService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, OverlapBadge } from '../../components/common/StatusBadge';
import { PlusCircle, FileText, Clock, CheckCircle2, ChevronRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const cases = getStoredCases();

  // Filter complaints associated with the student or their institution
  const studentCases = cases.filter(c => 
    c.complainantRole === 'Student' || 
    c.aicteId === '1-4589211'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-aicte-700 to-aicte-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-400 text-slate-900 inline-block mb-2">
            AICTE National Student Redressal Cell
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Track your grievances transparently and submit institutional compliance petitions with guaranteed time-bound SLA.
          </p>
        </div>
        <Link
          to="/student/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-transform hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Lodge New Grievance</span>
        </Link>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">My Active Complaints</p>
            <p className="text-xl font-bold text-slate-900">{studentCases.filter(c => c.status !== 'Disposed').length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Avg. AICTE Resolution</p>
            <p className="text-xl font-bold text-slate-900">14 Days</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Protection Guarantee</p>
            <p className="text-xl font-bold text-emerald-600">AICTE Redressal Norms</p>
          </div>
        </div>
      </div>

      {/* My Cases List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Grievances & Appeals</h2>
            <p className="text-xs text-slate-500">Live progress tracking across institutional and AICTE levels</p>
          </div>
          <Link to="/student/new" className="text-xs font-bold text-aicte-600 hover:text-aicte-700">
            + Lodge Grievance
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {studentCases.map((c) => (
            <div key={c.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-aicte-700">{c.id}</span>
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{c.category}</span>
                </div>
                <span className="text-xs text-slate-400">Filed on: {c.dateSubmitted}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
              </div>

              {/* Progress step bar */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Stage:</span>
                  <span className="font-semibold text-slate-800">
                    {c.history[0]?.action || "Grievance under review"}
                  </span>
                </div>
                <Link
                  to="/student/track"
                  className="inline-flex items-center gap-1 text-xs font-bold text-aicte-600 hover:text-aicte-800"
                >
                  <span>Track Full Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
