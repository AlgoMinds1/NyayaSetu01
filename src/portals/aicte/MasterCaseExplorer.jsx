import React, { useState, useMemo } from 'react';
import { getStoredCases, updateCaseStatus, transferCaseBureau } from '../../services/caseService';
import { StatusBadge, BureauBadge, OverlapBadge } from '../../components/common/StatusBadge';
import { Timeline } from '../../components/common/Timeline';
import { 
  Search, 
  Filter, 
  ArrowRightLeft, 
  Eye, 
  X, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const MasterCaseExplorer = () => {
  const [cases, setCases] = useState(getStoredCases());
  const [searchTerm, setSearchTerm] = useState('');
  const [bureauFilter, setBureauFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected case for detailed modal
  const [selectedCase, setSelectedCase] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newBureau, setNewBureau] = useState('RB');
  const [transferReason, setTransferReason] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('Show Cause Issued');
  const [statusRemarks, setStatusRemarks] = useState('');

  // Filter logic
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = 
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.aicteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBureau = bureauFilter === 'ALL' || c.currentBureau === bureauFilter;
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

      return matchesSearch && matchesBureau && matchesStatus;
    });
  }, [cases, searchTerm, bureauFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCases.slice(start, start + itemsPerPage);
  }, [filteredCases, currentPage, itemsPerPage]);

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    const targetOfficer = newBureau === 'RB' ? 'Dr. S. K. Mahajan (Director RB)' : 'Shri Rajesh Verma (PGRC)';
    const updated = transferCaseBureau(
      selectedCase.id, 
      newBureau, 
      targetOfficer, 
      transferReason || "Inter-bureau jurisdiction alignment", 
      "AICTE Competent Authority"
    );
    setCases(updated);
    setSelectedCase(updated.find(c => c.id === selectedCase.id));
    setShowTransferModal(false);
    setTransferReason('');
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    const updated = updateCaseStatus(
      selectedCase.id,
      newStatus,
      statusRemarks || `Status updated during committee review`,
      "Dr. S. K. Mahajan",
      selectedCase.currentBureau
    );
    setCases(updated);
    setSelectedCase(updated.find(c => c.id === selectedCase.id));
    setShowStatusModal(false);
    setStatusRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Master Case Explorer</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Consolidated registry of technical institution complaints, inquiries, and regulatory files across AICTE.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
          Total Cases: <strong className="text-slate-900">{filteredCases.length}</strong>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Case ID, College Name, or AICTE Permanent ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-aicte-500 focus:bg-white"
            />
          </div>

          {/* Bureau Filter */}
          <div>
            <select
              value={bureauFilter}
              onChange={(e) => { setBureauFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-aicte-500"
            >
              <option value="ALL">All AICTE Bureaus</option>
              <option value="RB">Regulation Bureau (RB)</option>
              <option value="PGRC">Public Grievance Redressal (PGRC)</option>
              <option value="RO-N">Regional Office - Northern</option>
              <option value="RO-W">Regional Office - Western</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-aicte-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Under Process">Under Process</option>
              <option value="Show Cause Issued">Show Cause Issued</option>
              <option value="Pending Response">Pending Response</option>
              <option value="Escalated">Escalated</option>
              <option value="Disposed">Disposed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Institution & AICTE ID</th>
                <th className="py-3 px-4">Subject / Grievance</th>
                <th className="py-3 px-4">Bureau / Cell</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Overlap Check</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No cases match the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-aicte-700">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 truncate max-w-[220px]">{c.institutionName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {c.aicteId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1 max-w-[240px]">{c.title}</div>
                      <div className="text-[10px] text-slate-500">{c.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <BureauBadge bureau={c.currentBureau} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <OverlapBadge status={c.overlapStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-aicte-600 hover:text-white text-slate-700 font-medium rounded-md text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Style Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-slate-900">
              {Math.min(currentPage * itemsPerPage, filteredCases.length)}
            </strong>{' '}
            of <strong className="text-slate-900">{filteredCases.length}</strong> complaints
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                    {selectedCase.id}
                  </span>
                  <BureauBadge bureau={selectedCase.currentBureau} />
                  <StatusBadge status={selectedCase.status} />
                </div>
                <h3 className="text-lg font-bold mt-2 text-white">{selectedCase.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedCase.institutionName} • AICTE ID: {selectedCase.aicteId}</p>
              </div>
              <button 
                onClick={() => setSelectedCase(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Overlap alert warning inside modal if applicable */}
              {selectedCase.overlapStatus === 'COORDINATION_ALERT' && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start space-x-3 text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Coordination Alert: Parallel Inquiry Active</h4>
                    <p className="mt-0.5 text-amber-800">
                      Another Bureau ({selectedCase.overlapBureau}) is currently processing case{' '}
                      <span className="font-mono font-bold">{selectedCase.overlapWithCaseId}</span> regarding this institution.
                    </p>
                  </div>
                </div>
              )}

              {/* Case Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Category</span>
                  <span className="font-bold text-slate-800">{selectedCase.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Complainant</span>
                  <span className="font-bold text-slate-800">{selectedCase.complainantRole}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Officer In-Charge</span>
                  <span className="font-bold text-slate-800">{selectedCase.assignedOfficer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SLA Remaining</span>
                  <span className={`font-bold ${selectedCase.slaDaysRemaining <= 2 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedCase.slaDaysRemaining} Days
                  </span>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-aicte-600" />
                  Grievance / Subject Statement
                </h4>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                  {selectedCase.description}
                </div>
              </div>

              {/* Chronological Action History Timeline */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-aicte-600" />
                  Chronological Action History & Audit Log
                </h4>
                <Timeline history={selectedCase.history} />
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg shadow-sm"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Transfer Bureau</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Update Status / Action</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bureau Transfer Dialog */}
      {showTransferModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Transfer Case Between AICTE Bureaus</h3>
            <p className="text-xs text-slate-500">
              Reassign <span className="font-mono font-bold text-slate-800">{selectedCase.id}</span> to another Bureau/Cell to consolidate proceedings.
            </p>
            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target AICTE Bureau</label>
                <select
                  value={newBureau}
                  onChange={(e) => setNewBureau(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                >
                  <option value="RB">Regulation Bureau (RB) - Policy & Compliance</option>
                  <option value="PGRC">Public Grievance Redressal Cell (PGRC)</option>
                  <option value="AB">Approval Bureau (AB)</option>
                  <option value="RO-W">Regional Office - Western (Mumbai)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transfer Note / Reason</label>
                <textarea
                  rows="3"
                  required
                  placeholder="E.g., Transferred for joint inquiry with Regulation Bureau inspection team..."
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-aicte-600 text-white font-bold rounded-lg hover:bg-aicte-700"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Dialog */}
      {showStatusModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Record Regulatory Action / Update Status</h3>
            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Case Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                >
                  <option value="Under Process">Under Process</option>
                  <option value="Show Cause Issued">Show Cause Issued</option>
                  <option value="Pending Response">Pending Response</option>
                  <option value="Escalated">Escalated to Chairman/Council</option>
                  <option value="Disposed">Disposed (Action Completed)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Action Remarks / Order Summary</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detail the direction issued or hearing outcome..."
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                >
                  Save Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
