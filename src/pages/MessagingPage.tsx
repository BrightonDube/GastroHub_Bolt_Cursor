import React from 'react';
import { useAuthContext } from '../App';
import MessagingPage from '../components/messaging/MessagingPage';

const Messaging: React.FC = () => {
  const { user } = useAuthContext();
  return <MessagingPage />;
};

export default Messaging;
