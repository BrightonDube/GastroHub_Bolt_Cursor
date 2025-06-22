import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function SuperAdminDashboard() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
        <p className="text-neutral-700">Welcome, Super Admin. Here you can manage all users, suppliers, buyers, and platform-wide analytics.</p>
        {/* Add super admin-specific controls and analytics here */}
      </div>
    </DashboardLayout>
  );
}

export default SuperAdminDashboard;
