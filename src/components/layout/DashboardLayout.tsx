import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--background)',
        color: 'var(--foreground)'
      }}
      data-theme={typeof window !== 'undefined' ? (localStorage.getItem('gastrohub-theme') || 'light') : 'light'}
    >
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}