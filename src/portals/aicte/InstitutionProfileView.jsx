import React, { useState } from 'react';
import { getStoredInstitutions, getStoredCases } from '../../services/caseService';
import { StatusBadge, BureauBadge, OverlapBadge } from '../../components/common/StatusBadge';
import { 
  Building2, 
  MapPin, 
  Award, 
  Layers, 
  AlertTriangle, 
  FileCheck, 
  ShieldAlert,
  Search,
  ExternalLink
} from 'lucide-react';

export const InstitutionProfileView = () => {
  const institutions = getStoredInstitutions();
  const cases = getStoredCases();
  const [selectedInstId, setSelectedInstId] = useState(institutions[0]?.id);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    inst.aicteId.toLowerCase().includes(searchFilter.toLowerCase()) ||
    inst.city.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const currentInst = institutions.find(i => i.id === selectedInstId) || institutions[0];
  const instCases = cases.filter(c => c.aicteId === currentInst?.aicteId);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Centralized Institution 360° Profiles
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Consolidated regulatory and grievance footprint per technical institution across all AICTE Bureaus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Institution Selector List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search institution or AICTE ID..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredInstitutions.map((inst) => {
              const isSelected = inst.id === currentInst?.id;
              const hasAlert = cases.some(c => c.aicteId === inst.aicteId && c.overlapStatus === 'COORDINATION_ALERT');
              return (
                <button
                  key={inst.id}
                  onClick={() => setSelectedInstId(inst.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all flex flex-col gap-1 ${
                    isSelected ? 'bg-aicte-50/80 border-l-4 border-aicte-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500">ID: {inst.aicteId}</span>
                    {hasAlert && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded">
                        Overlap Alert
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{inst.name}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{inst.city}, {inst.state}</span>
                    <span className="font-semibold text-aicte-700">{instCases.length} records</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Consolidated 360 Profile */}
        <div className="lg:col-span-2 space-y-6">
          {currentInst && (
            <>
              {/* Institution Bio Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        AICTE Permanent ID: {currentInst.aicteId}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {currentInst.type}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">{currentInst.name}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {currentInst.address}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs text-slate-400">Accreditation:</div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-end">
                      <Award className="w-4 h-4 text-amber-500" />
                      {currentInst.accreditation}
                    </div>
                  </div>
                </div>

                {/* Key Metrics Bar */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="block text-xl font-extrabold text-slate-900">{instCases.length}</span>
                    <span className="text-[11px] text-slate-500">Total Cases on Record</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="block text-xl font-extrabold text-blue-700">
                      {instCases.filter(c => c.status === 'Under Process').length}
                    </span>
                    <span className="text-[11px] text-blue-700">Under Active Inquiry</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <span className="block text-xl font-extrabold text-amber-700">
                      {instCases.filter(c => c.overlapStatus === 'COORDINATION_ALERT').length}
                    </span>
                    <span className="text-[11px] text-amber-800">Dual-Bureau Alerts</span>
                  </div>
                </div>
              </div>

              {/* Consolidated Complaints History Across All Bureaus */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Cross-Bureau Case Dossier
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unified history combining Regulation Bureau (RB), PGRC, and Regional Cell actions.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {instCases.length} Associated Cases
                  </span>
                </div>

                {instCases.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center italic">
                    No active or historical grievances registered for this institution. Clean record.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {instCases.map((c) => (
                      <div 
                        key={c.id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-aicte-700">{c.id}</span>
                            <BureauBadge bureau={c.currentBureau} />
                            <StatusBadge status={c.status} />
                          </div>
                          <OverlapBadge status={c.overlapStatus} />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{c.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Complainant: <strong className="text-slate-700">{c.complainantRole}</strong></span>
                          <span>Last Action: <strong className="text-slate-700">{c.lastActionDate}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
