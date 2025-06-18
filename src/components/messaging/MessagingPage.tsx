import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ConversationList } from './ConversationList';
import { ChatModal } from './ChatModal';
import { useAuthContext } from '../../App';
import { supabase } from '../../lib/supabase';

export const MessagingPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { supplierId, productId } = router.query as { supplierId?: string; productId?: string };

  useEffect(() => {
    const findOrCreateConversation = async () => {
      if (!user || !supplierId || !productId) return;
      // 1. Check for existing conversation between user and supplier for this product
      const { data: convParts } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
      if (!convParts || convParts.length === 0) {
        // No conversations at all, create
        const { data: newConv, error: convErr } = await supabase
          .from('conversations')
          .insert({})
          .select('*')
          .single();
        if (newConv) {
          await supabase.from('conversation_participants').insert([
            { conversation_id: newConv.id, user_id: user.id },
            { conversation_id: newConv.id, user_id: supplierId }
          ]);
          setSelectedConversationId(newConv.id);
          setShowChat(true);
        }
        return;
      }
      // Check if any of the user's conversations also include the supplier
      const convIds = convParts.map((row: any) => row.conversation_id);
      const { data: supplierParts } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', supplierId);
      const supplierConvIds = (supplierParts || []).map((row: any) => row.conversation_id);
      const sharedConvId = convIds.find((id: string) => supplierConvIds.includes(id));
      if (sharedConvId) {
        setSelectedConversationId(sharedConvId);
        setShowChat(true);
        return;
      }
      // Otherwise, create a new conversation
      const { data: newConv, error: convErr } = await supabase
        .from('conversations')
        .insert({})
        .select('*')
        .single();
      if (newConv) {
        await supabase.from('conversation_participants').insert([
          { conversation_id: newConv.id, user_id: user.id },
          { conversation_id: newConv.id, user_id: supplierId }
        ]);
        setSelectedConversationId(newConv.id);
        setShowChat(true);
      }
    };
    findOrCreateConversation();
    // Only run on mount or when supplierId/productId/user changes
    // eslint-disable-next-line
  }, [supplierId, productId, user]);

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

export default MessagingPage;
