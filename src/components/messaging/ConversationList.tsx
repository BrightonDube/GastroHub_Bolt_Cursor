import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Conversation {
  id: string;
  participants: string[];
  productId?: string;
  otherUser?: { id: string; full_name: string };
  lastMessage?: { body: string; created_at: string };
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
    const fetchConversations = async () => {
      setLoading(true);
      // 1. Get all conversation IDs for this user
      const { data: parts, error } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);
      if (error) return setLoading(false);
      const ids = (parts || []).map((row: any) => row.conversation_id);
      if (ids.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }
      // 2. Get conversation details
      const { data: convos } = await supabase
        .from('conversations')
        .select('id, created_at, updated_at')
        .in('id', ids)
        .order('updated_at', { ascending: false });
      // 3. For each conversation, get participants, last message, and try to get product context
      const results: Conversation[] = [];
      for (const convo of convos || []) {
        // Get participants
        const { data: participants } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', convo.id);
        const otherUserId = (participants || [])
          .map((p: any) => p.user_id)
          .find((id: string) => id !== currentUserId);
        let otherUser = undefined;
        if (otherUserId) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', otherUserId)
            .single();
          otherUser = userData;
        }
        // Get last message
        const { data: lastMsgArr } = await supabase
          .from('messages')
          .select('body, created_at')
          .eq('conversation_id', convo.id)
          .order('created_at', { ascending: false })
          .limit(1);
        const lastMessage = lastMsgArr && lastMsgArr.length > 0 ? lastMsgArr[0] : undefined;
        // Try to get product context (if messages table or conversation has product info)
        // (If you want to show product name, you could expand schema or use message context in the future)
        results.push({
          id: convo.id,
          participants: (participants || []).map((p: any) => p.user_id),
          otherUser,
          lastMessage,
        });
      }
      setConversations(results);
      setLoading(false);
    };
    fetchConversations();
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
              <div className="font-semibold">
                {conv.otherUser?.full_name ? conv.otherUser.full_name : `User ${conv.otherUser?.id?.substring(0, 8) || ''}`}
              </div>
              {conv.lastMessage && (
                <div className="text-gray-500 text-sm truncate">{conv.lastMessage.body}</div>
              )}
              {conv.lastMessage && (
                <div className="text-xs text-gray-400 mt-1">{new Date(conv.lastMessage.created_at).toLocaleString()}</div>
              )}
            </li>
          ))}
          {conversations.length === 0 && <li className="p-4 text-gray-400">No conversations.</li>}
        </ul>
      )}
    </div>
  );
};
