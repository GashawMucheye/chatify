import React from 'react';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';

// 1. IMPORT FIX: Import specific hooks and stores
import { useMyChatPartners } from '../hooks/useChat'; // TanStack Query hook
import { useChatStore } from '../store/useChatStore'; // Zustand store for setSelectedUser
import { useAuthStore } from '../store/useAuthStore'; // Zustand store for onlineUsers
import NoChatsFound from './NoChatFound';

const ChatsList = () => {
  // 2. HOOK USAGE FIX: Fetch chats using the TanStack Query hook
  const { data: chats, isLoading, isError } = useMyChatPartners();

  // 3. ZUSTAND STATE ACCESS: Get state and action from the stores
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  // Check loading state from the query hook
  if (isLoading) return <UsersLoadingSkeleton />;

  // Handle error case
  if (isError)
    return <div className='p-4 text-red-400'>Error loading chats.</div>;

  // Use the data returned by the query, check for empty list
  const chatsToDisplay = chats || [];
  if (chatsToDisplay.length === 0) return <NoChatsFound />;

  return (
    <>
      {chatsToDisplay.map((chat) => (
        <div
          key={chat._id}
          className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors'
          onClick={() => setSelectedUser(chat)} // Action from Zustand
        >
          <div className='flex items-center gap-3'>
            <div
              className={`avatar ${
                // Use onlineUsers state from useAuthStore
                onlineUsers.includes(chat._id) ? 'online' : 'offline'
              }`}
            >
              <div className='size-12 rounded-full'>
                <img
                  src={chat.profilePic || '/avatar.png'}
                  alt={chat.fullName}
                />
              </div>
            </div>
            <h4 className='text-slate-200 font-medium truncate'>
              {chat.fullName}
            </h4>
            {/* Optional: Add latest message preview here if your chat data includes it */}
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatsList;
