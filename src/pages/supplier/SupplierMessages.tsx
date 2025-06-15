import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ConversationList } from '../../components/messaging/ConversationList';
import { ChatModal } from '../../components/messaging/ChatModal';

const SupplierMessages: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  if (!user) return null;

  return (
    <div className="flex h-[80vh] w-full max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <ConversationList
        currentUserId={user.id}
        onSelectConversation={(id) => {
          setSelectedConversationId(id);
          setShowChat(true);
        }}
        selectedConversationId={selectedConversationId}
      />
      <div className="flex-1 relative">
        {showChat && selectedConversationId && (
          <ChatModal
            conversationId={selectedConversationId}
            onClose={() => setShowChat(false)}
            currentUserId={user.id}
          />
        )}
        {!showChat && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierMessages;
