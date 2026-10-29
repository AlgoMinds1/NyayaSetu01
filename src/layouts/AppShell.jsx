import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';

export const AppShell = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
