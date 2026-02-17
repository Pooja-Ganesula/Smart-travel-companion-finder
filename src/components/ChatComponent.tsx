import { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  MapPin,
  Smile,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
} from 'lucide-react';
import type { Chat, ChatMessage, User } from '../types';
import { useChat } from '../utils/chatManager';

interface ChatComponentProps {
  chat: Chat;
  currentUser: User;
  otherUser: User;
}

export default function ChatComponent({ chat, currentUser, otherUser }: ChatComponentProps) {
  const {
    sendMessage,
    editMessage,
    markAsRead,
    addReaction,
    sendLocation,
  } = useChat();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '😢', '😡', '🎉', '🤝', '✅'];

  useEffect(() => {
    // Load messages for this chat
    const chatMessages = useChat().getMessages(chat.chatId, 50);
    setMessages(chatMessages);
    
    // Mark messages as read
    markAsRead(chat.chatId, currentUser.userId);
  }, [chat.chatId, currentUser.userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (editingMessageId) {
        await editMessage(chat.chatId, editingMessageId, currentUser.userId, editText);
        setEditingMessageId(null);
        setEditText('');
      } else {
        await sendMessage(chat.chatId, currentUser.userId, newMessage);
      }
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditMessage = (message: ChatMessage) => {
    setEditingMessageId(message.messageId);
    setEditText(message.text);
    setNewMessage(message.text);
    inputRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText('');
    setNewMessage('');
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(chat.chatId, messageId, currentUser.userId, emoji);
      // Reload messages to show the reaction
      const updatedMessages = useChat().getMessages(chat.chatId, 50);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleSendLocation = async () => {
    try {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await sendLocation(
            chat.chatId,
            currentUser.userId,
            position.coords.latitude,
            position.coords.longitude
          );
          // Reload messages
          const updatedMessages = useChat().getMessages(chat.chatId, 50);
          setMessages(updatedMessages);
        },
        (error) => {
          alert('Failed to get location: ' + error.message);
        }
      );
    } catch (error) {
      console.error('Failed to send location:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isMessageRead = (message: ChatMessage) => {
    return message.readBy.includes(otherUser.userId);
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [date: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={otherUser.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
            <p className="text-xs text-gray-500">
              {otherUser.verificationStatus === 'Verified' ? '✓ Verified' : 'Unverified'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Info className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex items-center justify-center my-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {formatDate(dateMessages[0].timestamp)}
              </span>
            </div>
            
            {dateMessages.map((message) => (
              <div
                key={message.messageId}
                className={`flex ${message.senderId === currentUser.userId ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.senderId === currentUser.userId ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.senderId === currentUser.userId
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {editingMessageId === message.messageId ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleCancelEdit}
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSendMessage}
                            className="text-xs px-2 py-1 bg-teal-600 text-white rounded"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm">{message.text}</p>
                        {message.isEdited && (
                          <p className="text-xs opacity-70 mt-1">(edited)</p>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Message Reactions */}
                  {message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {message.reactions.map((reaction, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                        >
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Message Status */}
                  <div className="flex items-center justify-between mt-1 px-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                    
                    {message.senderId === currentUser.userId && (
                      <div className="flex items-center space-x-1">
                        {isMessageRead(message) ? (
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        ) : (
                          <Check className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  {message.senderId === currentUser.userId && !editingMessageId && (
                    <div className="flex items-center space-x-2 mt-2 px-2">
                      <button
                        onClick={() => handleEditMessage(message)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        React
                      </button>
                    </div>
                  )}
                  
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="flex space-x-1 mt-2 px-2">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            handleAddReaction(message.messageId, emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="text-lg hover:bg-gray-100 rounded p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={handleSendLocation}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MapPin className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:border-teal-500"
              rows={1}
            />
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Smile className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-teal-600 hover:bg-teal-700 rounded-full disabled:opacity-50"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
