import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { resetMockData } from '../../services/caseService';
import { Shield, RefreshCw, UserCheck, ChevronDown, Check, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header = () => {
  const { currentUser, switchRole, demoUsers } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    switchRole(role);
    setDropdownOpen(false);
    if (role === 'aicte') navigate('/aicte');
    else if (role === 'student') navigate('/student');
    else if (role === 'faculty') navigate('/faculty');
    else if (role === 'college') navigate('/college');
  };

  const handleReset = () => {
    if (window.confirm("Reset mock complaints and overlap state to original demo baseline?")) {
      resetMockData();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top AICTE Gov Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Government of India • All India Council for Technical Education (AICTE)</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span className="text-amber-400 font-medium">Smart Automation Hackathon 2026</span>
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 hover:text-white transition-colors text-slate-400"
            title="Reset data to initial state"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-aicte-700 to-aicte-500 flex items-center justify-center text-white shadow-md shadow-aicte-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl text-slate-900 tracking-tight">NyayaSetu</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    AI 2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">AICTE Cross-Bureau Overlap & Grievance Grid</p>
              </div>
            </Link>
          </div>

          {/* Quick Role Switcher Pill (The Judge Demo Switcher) */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg p-1 shadow-inner">
                <span className="text-[11px] font-bold text-slate-600 uppercase px-2 hidden md:inline">
                  Demo Role:
                </span>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <UserCheck className="w-4 h-4 text-aicte-600" />
                  <span className="max-w-[140px] truncate">{currentUser.roleLabel}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Switch Interactive Perspective</p>
                    <p className="text-[11px] text-slate-500">Test the same case across each stakeholder:</p>
                  </div>
                  {demoUsers.map((user) => (
                    <button
                      key={user.role}
                      onClick={() => handleRoleChange(user.role)}
                      className={`w-full text-left px-3 py-2.5 flex items-start space-x-3 hover:bg-slate-50 transition-colors ${
                        currentUser.role === user.role ? 'bg-aicte-50/70 border-l-4 border-aicte-600' : ''
                      }`}
                    >
                      <img src={user.avatar} alt="" className="w-7 h-7 rounded-full mt-0.5 object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">{user.roleLabel}</p>
                          {currentUser.role === user.role && <Check className="w-3.5 h-3.5 text-aicte-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.institution}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center gap-1"
            >
              <span>Public Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
