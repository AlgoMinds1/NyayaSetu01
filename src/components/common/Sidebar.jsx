import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FolderKanban, 
  Building2, 
  BarChart3, 
  PlusCircle, 
  FileCheck2, 
  Users, 
  Inbox, 
  ShieldAlert
} from 'lucide-react';
import { getStoredCases } from '../../services/caseService';

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const cases = getStoredCases();
  const overlapCount = cases.filter(c => c.overlapStatus === 'COORDINATION_ALERT').length;

  const aicteNav = [
    { name: 'Executive Overview', path: '/aicte', icon: LayoutDashboard },
    { name: 'Overlap Alert Centre', path: '/aicte/overlaps', icon: AlertTriangle, badge: overlapCount },
    { name: 'Master Case Explorer', path: '/aicte/cases', icon: FolderKanban },
    { name: 'Institution 360° Profiles', path: '/aicte/institutions', icon: Building2 },
    { name: 'Reports & SLA Analytics', path: '/aicte/reports', icon: BarChart3 },
  ];

  const studentNav = [
    { name: 'My Grievances', path: '/student', icon: LayoutDashboard },
    { name: 'File New Grievance', path: '/student/new', icon: PlusCircle },
    { name: 'Case Timeline Tracking', path: '/student/track', icon: FileCheck2 },
  ];

  const facultyNav = [
    { name: 'GRC Committee Inbox', path: '/faculty', icon: Inbox },
    { name: 'Hearing & Compliance', path: '/faculty/hearings', icon: FileCheck2 },
  ];

  const collegeNav = [
    { name: 'College Overview', path: '/college', icon: LayoutDashboard },
    { name: 'AICTE Requisitions', path: '/college/cases', icon: ShieldAlert },
    { name: 'Assign Committee Member', path: '/college/assign', icon: Users },
  ];

  let activeNav = aicteNav;
  if (currentUser.role === 'student') activeNav = studentNav;
  else if (currentUser.role === 'faculty') activeNav = facultyNav;
  else if (currentUser.role === 'college') activeNav = collegeNav;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Current User Context Card */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-amber-400 font-medium truncate">{currentUser.roleLabel}</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.institution}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {currentUser.role.toUpperCase()} PORTAL
        </div>
        {activeNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/aicte' || item.path === '/student' || item.path === '/faculty' || item.path === '/college'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-aicte-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>Engine Status:</span>
          <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>Overlap Sync:</span>
          <span className="text-slate-400 font-mono">RB ↔ PGRC ↔ AB</span>
        </div>
      </div>
    </aside>
  );
};
