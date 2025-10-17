import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../hooks/useAuthStore';
import { useChatStore } from '../hooks/useChatStore';
import { useMessagesByUserId } from '../hooks/useChatQueries';

import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';

function ChatContainer() {
  const queryClient = useQueryClient();
  const { selectedUser, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null); // Guard Clause: Do not render or attempt to fetch if no user is selected

  if (!selectedUser) {
    return null;
  } // REACT QUERY HOOK: Fetch messages for the currently selected user

  const { data: messages, isLoading: isMessagesLoading } = useMessagesByUserId(
    selectedUser._id
  ); // SOCKET EFFECT: Subscribe and unsubscribe logic

  useEffect(() => {
    // Pass the queryClient to the Zustand store function so it can update the cache
    subscribeToMessages(queryClient); // Cleanup (unsubscribe)

    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages, selectedUser, queryClient]); // SCROLL EFFECT: Scroll to the bottom whenever messages change

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // LOADING STATE RENDERING

  if (isMessagesLoading) {
    return (
      <>
        <ChatHeader />
        <MessagesLoadingSkeleton />
        <MessageInput />
      </>
    );
  }

  const hasMessages = messages && messages.length > 0;

  return (
    <>
      <ChatHeader />
      <div className='flex-1 px-6 overflow-y-auto py-8'>
        {hasMessages ? (
          <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? 'chat-end' : 'chat-start'
                } ${msg.isOptimistic ? 'opacity-50' : ''}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt='Shared'
                      className='rounded-lg h-48 object-cover'
                    />
                  )}
                  {msg.text && <p className='mt-2'>{msg.text}</p>}
                  {msg.text && <p className='mt-2'>{msg.text}</p>}             
                  <p className='text-xs mt-1 opacity-75 flex items-center gap-1'>
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {/* Scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput />
    </>
  );
}

export default ChatContainer;
