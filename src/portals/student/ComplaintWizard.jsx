import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredInstitutions, createComplaint } from '../../services/caseService';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  UploadCloud, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const ComplaintWizard = () => {
  const navigate = useNavigate();
  const institutions = getStoredInstitutions();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    institutionId: institutions[0]?.id || '',
    institutionName: institutions[0]?.name || '',
    aicteId: institutions[0]?.aicteId || '',
    category: 'Fee Cap & Capitation Fee',
    title: '',
    description: '',
    complainantName: 'Aditya Deshmukh',
    complainantRole: 'Student',
    enrollmentNo: 'MIT-EN-2022-849',
    fileUploaded: false
  });

  const [submittedCase, setSubmittedCase] = useState(null);

  const handleInstitutionSelect = (e) => {
    const selected = institutions.find(i => i.id === e.target.value);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        institutionId: selected.id,
        institutionName: selected.name,
        aicteId: selected.aicteId
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = createComplaint({
      institutionName: formData.institutionName,
      aicteId: formData.aicteId,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      complainantName: `${formData.complainantName} (Enrollment: ${formData.enrollmentNo})`,
      complainantRole: 'Student'
    });
    setSubmittedCase(created);
    setStep(4); // Success step
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
          AICTE Grievance Submission Wizard
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          File an Institutional Complaint
        </h1>
        <p className="text-xs text-slate-500">
          Your complaint will be logged with a digital timestamp and verified against AICTE Regulations.
        </p>
      </div>

      {/* Progress Steps Indicator */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`p-2.5 rounded-lg border text-center text-xs font-semibold ${
          step >= 1 ? 'border-aicte-600 bg-aicte-50 text-aicte-700' : 'border-slate-200 text-slate-400'
        }`}>
          1. Technical Institute
        </div>
        <div className={`p-2.5 rounded-lg border text-center text-xs font-semibold ${
          step >= 2 ? 'border-aicte-600 bg-aicte-50 text-aicte-700' : 'border-slate-200 text-slate-400'
        }`}>
          2. Grievance Details
        </div>
        <div className={`p-2.5 rounded-lg border text-center text-xs font-semibold ${
          step >= 3 ? 'border-aicte-600 bg-aicte-50 text-aicte-700' : 'border-slate-200 text-slate-400'
        }`}>
          3. Verification & Submit
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-aicte-600" />
              Select Affiliated Technical Institution
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Choose Recognized College / Polytechnic:
              </label>
              <select
                value={formData.institutionId}
                onChange={handleInstitutionSelect}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-aicte-500"
              >
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.city}, {inst.state}) - AICTE ID: {inst.aicteId}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">AICTE Permanent ID:</span>
                <span className="font-mono font-bold text-slate-900">{formData.aicteId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Your Enrollment / Student ID:</span>
                <input
                  type="text"
                  value={formData.enrollmentNo}
                  onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                  className="w-full p-1 border border-slate-300 rounded text-xs bg-white mt-0.5"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-aicte-600 hover:bg-aicte-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                <span>Continue to Grievance Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-aicte-600" />
              Specify Grievance Category & Facts
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category of Violation / Grievance:
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-aicte-500"
              >
                <option value="Fee Cap & Capitation Fee">Fee Cap & Capitation Fee Violation</option>
                <option value="Certificate Withholding">Withholding Original Certificates</option>
                <option value="Faculty Salary & 7th CPC">Faculty Salary Shortfall & Irregularity</option>
                <option value="Unapproved Course / Infrastructure">Unapproved Course / Sub-standard Labs</option>
                <option value="Anti-Ragging / Harassment">Anti-Ragging & Campus Discipline</option>
                <option value="Hostel & Amenities">Hostel, Mess & Safety Conditions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grievance Title / Short Subject:
              </label>
              <input
                type="text"
                required
                placeholder="E.g., Demanding ₹35,000 extra lab fees under penalty of detention..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-aicte-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Statement of Facts:
              </label>
              <textarea
                rows="4"
                required
                placeholder="State the facts, dates, communications with college grievance cell, and relief sought..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-aicte-500"
              />
            </div>

            {/* Document Upload Mock */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attach Supporting Proof (Fee receipts, notices, email correspondence):
              </label>
              <div 
                onClick={() => setFormData({ ...formData, fileUploaded: true })}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  formData.fileUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:border-aicte-500 bg-slate-50'
                }`}
              >
                <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${formData.fileUploaded ? 'text-emerald-600' : 'text-slate-400'}`} />
                {formData.fileUploaded ? (
                  <p className="text-xs font-bold text-emerald-800">
                    ✓ 2 Documents Attached: fee_receipt.pdf, notice_copy.jpg (Verified)
                  </p>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-700">Click to attach supporting evidence PDF/JPG</p>
                    <p className="text-[11px] text-slate-400 mt-1">Up to 10 MB per file</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!formData.title || !formData.description}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-aicte-600 hover:bg-aicte-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                <span>Preview & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Final Declaration & AICTE Submission
            </h3>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Institution:</span>
                  <span className="font-bold text-slate-900">{formData.institutionName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">AICTE Permanent ID:</span>
                  <span className="font-mono font-bold text-slate-900">{formData.aicteId}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Category:</span>
                <span className="font-semibold text-slate-800">{formData.category}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Subject Title:</span>
                <span className="font-bold text-slate-900">{formData.title}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Grievance Statement:</span>
                <p className="text-slate-700 bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap">
                  {formData.description}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-xs text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <input type="checkbox" required id="declaration" className="mt-0.5 rounded text-aicte-600" />
              <label htmlFor="declaration">
                I hereby declare that the facts stated above are true to my knowledge and submitted for statutory redressal under AICTE Grievance Regulations.
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-lg shadow-md"
              >
                <span>Submit Grievance to AICTE</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Submission Success */}
        {step === 4 && submittedCase && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900">Grievance Registered Successfully</h2>
              <p className="text-xs text-slate-500">
                Your case has been logged into the AICTE National Grievance Grid.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Official Tracking ID:</span>
                <span className="font-mono font-bold text-aicte-700">{submittedCase.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Bureau:</span>
                <span className="font-bold text-slate-800">{submittedCase.currentBureau}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SLA Mandate:</span>
                <span className="font-bold text-emerald-700">14 Working Days</span>
              </div>
              {submittedCase.overlapStatus !== 'NONE' && (
                <div className="mt-2 pt-2 border-t border-amber-200 text-amber-800 text-[11px] font-semibold">
                  ⚠️ AI Overlap Engine: Linked with ongoing Regulation Bureau proceeding for consolidated review.
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => navigate('/student')}
                className="px-5 py-2.5 bg-aicte-600 text-white font-bold text-xs rounded-xl hover:bg-aicte-700"
              >
                Return to My Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
