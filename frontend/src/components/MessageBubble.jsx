import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

function MessageBubble({ message }) {
  if (!message) {
    return null;
  }

  const authUser = useAuthStore((state) => state.authUser);
  const fromMe = message.senderId === authUser?._id;

  const bubbleClass = fromMe
    ? 'chat-end bg-cyan-600 text-white'
    : 'chat-start bg-slate-700 text-slate-200';

  return (
    <div className={`chat ${fromMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`chat-bubble max-w-xs ${bubbleClass}`}>
        {message.text && <div>{message.text}</div>}
        {message.image && (
          <img
            src={message.image}
            alt='Image'
            className='max-w-full rounded-lg mt-2 cursor-pointer'
          />
        )}
        {message.isOptimistic && (
          <span className='text-xs text-yellow-300 block mt-1'>Sending...</span>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
