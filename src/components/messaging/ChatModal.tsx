import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Message {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at?: string | null;
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

import { RealtimeChannel } from '@supabase/supabase-js';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export const ChatModal: React.FC<ChatModalProps> = ({ conversationId, onClose, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(async ({ data, error }) => {
        setLoading(false);
        if (error) return;
        setMessages(data || []);
        // Mark all unread messages (not sent by current user and read_at is null) as read
        const unreadIds = (data || [])
          .filter((msg: any) => msg.sender_id !== currentUserId && !msg.read_at)
          .map((msg: any) => msg.id);
        if (unreadIds.length > 0) {
          await supabase.from('messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadIds);
        }
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
    // Typing channel setup
    const typingChannel = supabase.channel(`typing:${conversationId}`);
    typingChannel.on('broadcast', { event: 'typing' }, (payload) => {
      if (payload.payload.userId !== currentUserId) {
        setIsOtherTyping(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsOtherTyping(false), 2000);
      }
    });
    typingChannel.subscribe();
    channelRef.current = typingChannel;
    return () => {
      supabase.removeChannel(subscription);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [conversationId, currentUserId]);

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

  // Typing event handler
  const handleTyping = () => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: currentUserId },
      });
    }
  };

  // Helper to check if a string is an image URL
  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;
    setUploading(true);
    try {
      const path = `${currentUserId}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('chat-files').upload(path, file);
      if (error) throw error;
      const { publicUrl } = supabase.storage.from('chat-files').getPublicUrl(data.path).data;
      // Send as message (body contains URL)
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        body: publicUrl,
      });
    } catch (err) {
      alert('File upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-800">
          <h2 className="text-lg font-semibold">Chat</h2>
          <Button size="sm" variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div className="px-4 py-2 border-b dark:border-gray-800 flex items-center gap-2 bg-gray-50 dark:bg-gray-800">
          <Input
            className="w-full"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {messages
                .filter(msg => {
                  if (!searchTerm) return true;
                  const lower = searchTerm.toLowerCase();
                  // If message is file, try to match file name
                  if (msg.body.startsWith('http')) {
                    try {
                      const urlObj = new URL(msg.body);
                      const pathParts = urlObj.pathname.split('/');
                      const fileName = pathParts[pathParts.length - 1];
                      return fileName.toLowerCase().includes(lower);
                    } catch {
                      return msg.body.toLowerCase().includes(lower);
                    }
                  }
                  return msg.body.toLowerCase().includes(lower);
                })
                .map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`relative px-3 py-2 rounded-lg max-w-xs ${msg.sender_id === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                      {/* If message body is a file/image URL, render accordingly */}
                      {msg.body.startsWith('http') ? (
                        isImageUrl(msg.body)
                          ? <img src={msg.body} alt="sent attachment" className="max-w-[200px] max-h-[200px] rounded mb-1" />
                          : <a href={msg.body} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Download file</a>
                      ) : msg.body}
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        {(() => {
  const date = new Date(msg.created_at);
  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'yyyy-MM-dd HH:mm');
  }
})()}
                        {msg.sender_id !== currentUserId && !msg.read_at && (
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full" title="Unread"></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {isOtherTyping && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <span className="animate-pulse">User is typing...</span>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center border-t dark:border-gray-800 p-2">
          <label className="mr-2 cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} />
            <span className="inline-block p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              📎
            </span>
          </label>
          <Input
            className="flex-1 mr-2"
            value={newMessage}
            onChange={e => { setNewMessage(e.target.value); handleTyping(); }}
            placeholder="Type your message..."
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            disabled={uploading}
          />
          <Button onClick={handleSend} variant="primary" disabled={uploading}>Send</Button>
        </div>
      </div>
    </div>
  );
};
