import { useMemo, useRef, useEffect, useState } from 'react';
import { Send, Lock, MessageCircle } from 'lucide-react';
import type { ChatMessage, Match, User } from '../types';

interface ChatInterfaceProps {
  match: Match;
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export default function ChatInterface({ match, currentUser, messages, onSendMessage }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLocked = match.matchStatus !== 'Matched'; // Only unlock if status is 'Matched'
  const hasMessages = messages.length > 0;

  const introText = useMemo(
    () => `Start planning your ${match.user.profile.travelStyle.toLowerCase()} trip together.`,
    [match.user.profile.travelStyle],
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  if (isLocked) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center p-6 border border-gray-200">
        <div className="bg-gray-200 p-4 rounded-full mb-4">
          <Lock className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Chat Locked</h3>
        <p className="max-w-xs text-gray-500 mt-2">
          You need to connect with {match.user.name} and have them accept your request to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center">
        <div className="relative">
          <img src={match.user.photoUrl} alt={match.user.name} className="h-10 w-10 rounded-full object-cover" />
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{match.user.name}</p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {!hasMessages ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="bg-white rounded-full p-4 shadow-sm border border-gray-100">
              <MessageCircle className="h-6 w-6 text-teal-600" />
            </div>
            <h4 className="mt-4 font-semibold text-gray-800">No messages yet</h4>
            <p className="text-sm text-gray-500 mt-1">{introText}</p>
          </div>
        ) : messages.map((msg) => {
          const isMe = msg.senderId === currentUser.userId;
          return (
            <div key={msg.messageId} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${isMe ? 'bg-teal-600 text-white' : 'bg-white text-gray-900 shadow-sm'}`}>
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-teal-200' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            placeholder="Type a message..."
          />
          <button type="submit" className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50" disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
