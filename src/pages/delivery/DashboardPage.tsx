import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function DeliveryDashboard() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Delivery Partner Dashboard</h1>
        <p className="text-neutral-700">Welcome to your delivery dashboard. Here you will see your assigned deliveries and performance stats.</p>
        {/* Add delivery-specific widgets and stats here */}
      </div>
    </DashboardLayout>
  );
}

export default DeliveryDashboard;
