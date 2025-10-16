import React from 'react';
import { MessageSquare } from 'lucide-react';

function NoConversationPlaceholder() {
  return (
    <div className='flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center'>
      <MessageSquare className='size-16 mb-4 text-cyan-500' />
      <h2 className='text-xl font-semibold text-slate-200 mb-2'>
        Welcome to the Chat App
      </h2>
      <p>
        Select a **Chat** partner or **Contact** from the sidebar to begin your
        conversation.
      </p>
    </div>
  );
}
export default NoConversationPlaceholder;
