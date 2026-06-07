import { useState, useEffect, useRef } from 'react';
import type { LifePlayer, PlayerName, LifeMessage } from '@/types/life';
import * as lifeApi from '@/lib/lifeApi';
import { supabase } from '@/lib/supabase';

interface ChatPanelProps {
  currentPlayer: LifePlayer;
  partner: LifePlayer;
}

export default function ChatPanel({ currentPlayer, partner }: ChatPanelProps) {
  const [messages, setMessages] = useState<LifeMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMessages();
    const cleanup = subscribeToMessages();
    
    // Mark messages as read when opening chat
    markMessagesRead();
    
    return cleanup;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadMessages() {
    const msgs = await lifeApi.getMessages(100);
    setMessages(msgs);
  }

  function subscribeToMessages() {
    const channel = supabase.channel('chat_messages');
    
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'life_messages',
        },
        (payload) => {
          const newMsg = payload.new as LifeMessage;
          setMessages((prev) => [...prev, newMsg]);
          
          // Mark as read if it's for current player
          if (newMsg.to_player === currentPlayer.name) {
            setTimeout(() => {
              lifeApi.markMessagesAsRead(
                currentPlayer.name as PlayerName,
                partner.name as PlayerName
              );
            }, 500);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  async function markMessagesRead() {
    await lifeApi.markMessagesAsRead(
      currentPlayer.name as PlayerName,
      partner.name as PlayerName
    );
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      await lifeApi.sendMessage(
        currentPlayer.name as PlayerName,
        partner.name as PlayerName,
        newMessage.trim(),
        'chat'
      );

      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  }

  function getMessageStyle(message: LifeMessage) {
    const isCurrentPlayer = message.from_player === currentPlayer.name;
    
    if (message.message_type === 'system') {
      return {
        container: 'justify-center',
        bubble: 'bg-gray-100 border border-gray-200 text-gray-600 text-sm max-w-xs text-center',
        align: 'center',
      };
    }

    if (message.message_type === 'care') {
      return {
        container: isCurrentPlayer ? 'justify-end' : 'justify-start',
        bubble: isCurrentPlayer
          ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 text-blue-800 max-w-xs'
          : 'bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 text-pink-800 max-w-xs',
        align: isCurrentPlayer ? 'right' : 'left',
      };
    }

    return {
      container: isCurrentPlayer ? 'justify-end' : 'justify-start',
      bubble: isCurrentPlayer
        ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white max-w-xs'
        : 'bg-white border-2 border-purple-200 text-gray-800 max-w-xs',
      align: isCurrentPlayer ? 'right' : 'left',
    };
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-blue-200 flex flex-col h-[calc(100vh-12rem)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{partner.avatar}</span>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-blue-600">{partner.name}</h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${partner.is_online ? 'bg-green-500' : 'bg-gray-300'} animate-pulse`} />
              <span className="text-xs text-gray-500">
                {partner.is_online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <span className="text-3xl">💬</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-purple-50/30 to-pink-50/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💕</div>
            <p className="text-gray-400 text-sm">
              Belum ada percakapan
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Mulai chat dengan {partner.name}!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const style = getMessageStyle(message);
              const time = new Date(message.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const isCurrentPlayer = message.from_player === currentPlayer.name;

              return (
                <div key={message.id} className={`flex ${style.container}`}>
                  <div>
                    {!isCurrentPlayer && message.message_type === 'chat' && (
                      <div className="text-xs text-gray-500 mb-1 ml-2">
                        {message.from_player}
                      </div>
                    )}
                    <div className={`${style.bubble} rounded-2xl p-3 shadow-sm`}>
                      <p className="text-sm leading-relaxed break-words">
                        {message.message_text}
                      </p>
                      <p className={`text-xs mt-1 ${
                        message.message_type === 'system' 
                          ? 'text-gray-400' 
                          : isCurrentPlayer && message.message_type === 'chat'
                          ? 'text-white/70'
                          : 'text-gray-500'
                      }`}>
                        {time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-blue-200 bg-white rounded-b-3xl">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Kirim pesan ke ${partner.name}...`}
            disabled={isSending}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-purple-50/50 text-gray-800 placeholder-gray-400 disabled:opacity-50"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isSending ? (
              <span className="animate-pulse">⏳</span>
            ) : (
              <span>📤</span>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-2">
          <p className="text-xs text-gray-400">
            {newMessage.length}/500
          </p>
          {!partner.is_online && (
            <p className="text-xs text-yellow-600">
              {partner.name} offline - pesan akan terkirim saat online
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
