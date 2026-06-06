"use client";

import { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';
import * as gameApi from '@/lib/gameApi';
import type { CoupleMessage } from '@/types/game';
import { supabase } from '@/lib/supabase';

interface ChatBoxProps {
  coupleId: string;
  currentPlayerName: string;
}

export default function ChatBox({ coupleId, currentPlayerName }: ChatBoxProps) {
  const [messages, setMessages] = useState<CoupleMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
  }, [coupleId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadMessages() {
    const msgs = await gameApi.getRecentMessages(coupleId);
    setMessages(msgs);
    setLoading(false);
  }

  function subscribeToMessages() {
    const channel = supabase.channel(`couple_messages_${coupleId}`);
    
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'couple_messages',
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as CoupleMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSend() {
    if (!newMessage.trim()) return;

    await gameApi.sendMessage(coupleId, currentPlayerName, newMessage.trim());
    setNewMessage('');
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-16rem)]">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
        <h2 className="font-bold text-lg">💬 Chat Kami</h2>
        <p className="text-xs text-blue-100">Ngobrol bareng pasangan</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin text-4xl mb-2">💬</div>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">💭</div>
            <p>Belum ada pesan</p>
            <p className="text-sm">Mulai ngobrol dengan pasangan!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_name === currentPlayerName;
            const isActivity = msg.message_type === 'activity';

            if (isActivity) {
              return (
                <div key={msg.id} className="text-center">
                  <div className="inline-block bg-gray-100 rounded-full px-4 py-1 text-xs text-gray-600">
                    <span className="font-semibold">{msg.sender_name}</span> {msg.message_text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                  {!isMe && (
                    <div className="text-xs text-gray-500 mb-1 px-2">
                      {msg.sender_name}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isMe
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.message_text}
                    </p>
                  </div>
                  <div
                    className={`text-xs text-gray-400 mt-1 px-2 ${
                      isMe ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tulis pesan..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none resize-none"
            rows={1}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
