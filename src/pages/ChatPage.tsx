import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatComponent from '../components/ChatComponent';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../utils/chatManager';
import { mockUsers } from '../data/mockUsers';
import type { User } from '../types';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const { getChat } = useChat();
  const [otherUser, setOtherUser] = useState<User | null>(null);

  useEffect(() => {
    if (chatId && user) {
      const chatData = getChat(chatId);
      if (chatData) {
        const otherUserId = chatData.participants.find(id => id !== user.userId);
        if (otherUserId) {
          const userData = mockUsers.find(u => u.userId === otherUserId);
          setOtherUser(userData || null);
        }
      }
    }
  }, [chatId, user, getChat]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to access chat.</p>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chat not found or you don't have permission to access it.</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ChatComponent chat={{
        chatId: chatId!,
        participants: [user.userId, otherUser.userId],
        type: 'match',
        createdAt: new Date().toISOString(),
        isActive: true,
      }} currentUser={user} otherUser={otherUser} />
    </div>
  );
}
