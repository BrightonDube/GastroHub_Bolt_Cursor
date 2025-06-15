import React from 'react';

const InvoiceDetailPage: React.FC = () => {
  // Placeholder for invoice detail UI
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Invoice Details</h1>
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius, 0.75rem)',
          boxShadow: 'var(--shadow, 0 1px 2px 0 rgba(0,0,0,0.05))',
          padding: '1rem',
          border: '1px solid var(--stroke)'
        }}
      >
        {/* TODO: Implement invoice details, PDF download, and email actions here */}
        <p style={{ color: 'var(--muted-foreground, #6b7280)' }}>Invoice details coming soon.</p>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
