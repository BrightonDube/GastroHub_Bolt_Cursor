import React from 'react';
import { useAuthContext } from '../App';
import MessagingPage from '../components/messaging/MessagingPage';

const Messaging: React.FC = () => {
  const { user, loading: authLoading } = useAuthContext();
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }
  
  return <MessagingPage />;
};

export default Messaging;
