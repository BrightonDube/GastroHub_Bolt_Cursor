import React from 'react';
import { useAuthContext } from '../context/AuthProvider';
import { ModernMessagingPage } from './ModernMessagingPage';

const Messaging: React.FC = () => {
  const { user, loading: authLoading } = useAuthContext();
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }
  
  return <ModernMessagingPage />;
};

export default Messaging;
