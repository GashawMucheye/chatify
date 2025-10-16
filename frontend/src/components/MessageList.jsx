import React, { useEffect, useRef } from 'react';
import { useMessagesByUserId } from '../hooks/useChat'; // Assuming this exists
import { useRealTimeMessages } from '../hooks/useRealTimeMessages'; // Assuming this exists
import { Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble'; // Assuming a MessageBubble component

function MessageList({ chatPartnerId }) {
  const {
    data: messages,
    isLoading,
    isError,
  } = useMessagesByUserId(chatPartnerId);
  const messagesEndRef = useRef(null);

  // Subscribe to real-time messages for this chat partner
  useRealTimeMessages(chatPartnerId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-cyan-500' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex-1 flex items-center justify-center text-red-400'>
        Error loading messages.
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700/50'>
      {messages.length === 0 ? (
        <div className='text-center text-slate-500 pt-10'>
          Start a conversation! No messages yet.
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            // You'll need to pass current user info here to determine sender/receiver side
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
