import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Building2, 
  GraduationCap, 
  Scale, 
  FileCheck,
  Zap,
  Lock
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleLaunchRole = (role, path) => {
    switchRole(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Gov Ribbon */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium">All India Council for Technical Education (AICTE) • Ministry of Education, Govt. of India</span>
          </div>
          <div className="flex items-center space-x-4 text-amber-400 text-[11px] font-bold">
            <span>Problem Statement: Integrated Institution-Related Complaint Tracking</span>
          </div>
        </div>
      </div>

      {/* Main Header / Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-aicte-700 to-aicte-500 flex items-center justify-center text-white shadow-md">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">NyayaSetu</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Cross-Bureau Overlap & Grievance Grid</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleLaunchRole('aicte', '/aicte')}
              className="px-4 py-2 bg-aicte-600 hover:bg-aicte-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Launch AICTE Official Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-900 via-aicte-800 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-800/80 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Automation for Regulation Bureau & PGRC</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Integrated Dashboard for Monitoring & Overlap Tracking Across AICTE Bureaus
            </h1>

            <p className="text-base sm:text-lg text-blue-100 max-w-3xl mx-auto font-normal leading-relaxed">
              Eliminating duplicated institutional inquiries and conflicting orders between the <strong className="text-amber-300">Regulation Bureau (RB)</strong> and <strong className="text-amber-300">Public Grievance Redressal Cell (PGRC)</strong> through AICTE ID consolidation and automated cross-bureau overlap detection.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleLaunchRole('aicte', '/aicte')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Open Single-Window Dashboard
              </button>
              <button
                onClick={() => handleLaunchRole('student', '/student/new')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/20 backdrop-blur-sm transition-colors"
              >
                File Student Grievance
              </button>
            </div>
          </div>
        </section>

        {/* 4 Interactive Portal Demo Launch Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: AICTE Official */}
            <div className="bg-white rounded-2xl p-6 border-2 border-aicte-600 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-aicte-100 text-aicte-700 flex items-center justify-center">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-aicte-700">Official Portal</span>
                  <h3 className="text-base font-extrabold text-slate-900">AICTE Headquarters</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Single-window grid with cross-bureau overlap detection, RB vs PGRC coordination, and full case registry.
                </p>
              </div>
              <button
                onClick={() => handleLaunchRole('aicte', '/aicte')}
                className="mt-6 w-full py-2.5 px-4 bg-aicte-600 hover:bg-aicte-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter as AICTE Official</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Student */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-xl hover:border-blue-400 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Stakeholder</span>
                  <h3 className="text-base font-extrabold text-slate-900">Student & Alumnus</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3-step grievance filing wizard, real-time tracking, transparent SLA progress, and institutional redressal.
                </p>
              </div>
              <button
                onClick={() => handleLaunchRole('student', '/student')}
                className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter as Student</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Faculty */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-xl hover:border-purple-400 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Institutional GRC</span>
                  <h3 className="text-base font-extrabold text-slate-900">Faculty Committee</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Review assigned grievances, submit committee hearing findings, record observations, or recuse with audit log.
                </p>
              </div>
              <button
                onClick={() => handleLaunchRole('faculty', '/faculty')}
                className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter as Faculty</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: College Management */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-xl hover:border-emerald-400 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Institution Admin</span>
                  <h3 className="text-base font-extrabold text-slate-900">College Management</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monitor institutional notices from AICTE, assign complaints to internal members, and respond within SLA.
                </p>
              </div>
              <button
                onClick={() => handleLaunchRole('college', '/college')}
                className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter as Management</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900">Key Architectural Innovations</h2>
            <p className="text-xs text-slate-500 mt-1">Built to directly fulfill AICTE Smart Automation requirements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Automated Cross-Bureau Overlap Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When a case is filed or an inquiry initiated, the system maps the AICTE Permanent ID across Regulation Bureau, PGRC, and Approval Bureau files, raising instant alerts for dual proceedings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Centralized Institution 360° Dossier</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A single consolidation point where senior officers can inspect every historical dispute, penalty, show-cause notice, and resolution related to any college in India.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Real-Time SLA & Ageing Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Built-in timers and visual escalations alert directors before statutory limits expire, accompanied by instant one-click CSV statutory report exports.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-slate-300">
            NyayaSetu AI • Integrated Institution-Related Complaint Tracking System
          </p>
          <p className="text-slate-500 text-[11px]">
            Designed for AICTE Smart Automation • Pure React + Vite + JavaScript Architecture
          </p>
        </div>
      </footer>
    </div>
  );
};
