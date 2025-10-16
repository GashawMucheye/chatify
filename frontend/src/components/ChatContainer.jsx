import { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';

// 1. IMPORT FIX: Import specific hooks and stores
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useMessagesByUserId } from '../hooks/useChat'; // TanStack Query fetch hook
import { useRealTimeMessages } from '../hooks/useRealTimeMessages'; // New socket hook

function ChatContainer() {
  // 2. ZUSTAND STATE ACCESS: Get necessary state from stores
  const selectedUser = useChatStore((state) => state.selectedUser);
  const authUser = useAuthStore((state) => state.authUser);

  // Determine the user ID to fetch messages for
  const chatPartnerId = selectedUser?._id;

  // 3. TANSTACK QUERY USAGE: Fetch messages for the selected user
  const {
    data: messages,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = useMessagesByUserId(chatPartnerId);

  // 4. SOCKET USAGE: Subscribe to real-time messages for the current chat
  useRealTimeMessages(chatPartnerId);

  // FIX: Updated ref type annotation style for standard JSX/React
  const messageEndRef = useRef(null);

  // ✅ Auto-scroll when messages change (messages array is from TanStack Query)
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle "no chat selected" safely
  if (!selectedUser) {
    return (
      <div className='flex-1 flex items-center justify-center text-slate-400'>
        Select a user to start chatting 💬
      </div>
    );
  }

  // Handle error state
  if (isMessagesError) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center p-4 text-red-400'>
        <ChatHeader />
        <div className='flex-1 flex items-center justify-center'>
          Error loading chat history.
        </div>
      </div>
    );
  }

  const messagesToDisplay = messages || [];

  return (
    <div className='flex flex-col flex-1 h-full'>
      {' '}
      {/* Added flex-col and h-full */}
      <ChatHeader />
      <div className='flex-1 px-6 overflow-y-auto py-8'>
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messagesToDisplay.length > 0 ? (
          <div className='max-w-3xl mx-auto space-y-6'>
            {messagesToDisplay.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  // Use authUser from Zustand store
                  msg.senderId === authUser?._id ? 'chat-end' : 'chat-start'
                }`}
              >
                <div
                  // FIX: Removed trailing space from the template literal for className
                  className={`chat-bubble relative ${
                    msg.senderId === authUser?._id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  } ${msg.isOptimistic ? 'opacity-60' : ''}`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt='Shared'
                      className='rounded-lg h-48 object-cover'
                    />
                  )}
                  {msg.text && <p className='mt-2'>{msg.text}</p>}

                  <p className='text-xs mt-1 opacity-75 flex items-center gap-1'>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
