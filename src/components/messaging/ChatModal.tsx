import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Message {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

interface Conversation {
  id: string;
  participants: string[];
}

interface ChatModalProps {
  conversationId: string | null;
  onClose: () => void;
  currentUserId: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ conversationId, onClose, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        setLoading(false);
        if (error) return;
        setMessages(data || []);
      });
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId) return;
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      body: newMessage.trim(),
    });
    if (!error) setNewMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-800">
          <h2 className="text-lg font-semibold">Chat</h2>
          <Button size="sm" variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div>Loading...</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender_id === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                  {msg.body}
                  <div className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center border-t dark:border-gray-800 p-2">
          <Input
            className="flex-1 mr-2"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <Button onClick={handleSend} variant="primary">Send</Button>
        </div>
      </div>
    </div>
  );
};
