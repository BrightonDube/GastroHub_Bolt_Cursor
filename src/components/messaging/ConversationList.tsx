import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Conversation {
  id: string;
  participants: string[];
}

interface ConversationListProps {
  currentUserId: string;
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId: string | null;
}

export const ConversationList: React.FC<ConversationListProps> = ({ currentUserId, onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch all conversations where the user is a participant
    supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', currentUserId)
      .then(async ({ data, error }) => {
        if (error) return setLoading(false);
        const ids = (data || []).map((row: any) => row.conversation_id);
        if (ids.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        // Fetch conversation details
        const { data: convos } = await supabase
          .from('conversations')
          .select('*')
          .in('id', ids)
          .order('updated_at', { ascending: false });
        setConversations(convos || []);
        setLoading(false);
      });
  }, [currentUserId]);

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-4 font-bold text-lg border-b dark:border-gray-700">Conversations</div>
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : (
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${selectedConversationId === conv.id ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              Conversation {conv.id.substring(0, 8)}
            </li>
          ))}
          {conversations.length === 0 && <li className="p-4 text-gray-400">No conversations.</li>}
        </ul>
      )}
    </div>
  );
};
