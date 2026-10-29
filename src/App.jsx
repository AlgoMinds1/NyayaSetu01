import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { LandingPage } from './portals/public/LandingPage';

// AICTE Portal
import { AicteDashboard } from './portals/aicte/AicteDashboard';
import { OverlapAlertCenter } from './portals/aicte/OverlapAlertCenter';
import { MasterCaseExplorer } from './portals/aicte/MasterCaseExplorer';
import { InstitutionProfileView } from './portals/aicte/InstitutionProfileView';
import { ReportsView } from './portals/aicte/ReportsView';

// Student Portal
import { StudentDashboard } from './portals/student/StudentDashboard';
import { ComplaintWizard } from './portals/student/ComplaintWizard';
import { StudentCaseDetail } from './portals/student/StudentCaseDetail';

// Faculty Portal
import { FacultyDashboard } from './portals/faculty/FacultyDashboard';

// College Management Portal
import { CollegeDashboard } from './portals/college/CollegeDashboard';

export const App = () => {
  return (
    <Routes>
      {/* Public Landing & Role Selection */}
      <Route path="/" element={<LandingPage />} />

      {/* Shared App Shell with Sidebar & Header */}
      <Route element={<AppShell />}>
        {/* AICTE Bureau / HQ Routes */}
        <Route path="/aicte" element={<AicteDashboard />} />
        <Route path="/aicte/overlaps" element={<OverlapAlertCenter />} />
        <Route path="/aicte/cases" element={<MasterCaseExplorer />} />
        <Route path="/aicte/institutions" element={<InstitutionProfileView />} />
        <Route path="/aicte/reports" element={<ReportsView />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/new" element={<ComplaintWizard />} />
        <Route path="/student/track" element={<StudentCaseDetail />} />

        {/* Faculty Routes */}
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/faculty/hearings" element={<FacultyDashboard />} />

        {/* College Management Routes */}
        <Route path="/college" element={<CollegeDashboard />} />
        <Route path="/college/cases" element={<CollegeDashboard />} />
        <Route path="/college/assign" element={<CollegeDashboard />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
