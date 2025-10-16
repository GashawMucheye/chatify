import React from 'react';
import ChatMessageHeader from './ChatMessageHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChatStore } from '../store/useChatStore';

function ChatContainer() {
  // Get the selected user (chat partner)
  const selectedUser = useChatStore((state) => state.selectedUser);

  if (!selectedUser) {
    // This should ideally not be reached if the parent component ChatPage is correct
    return (
      <div className='flex items-center justify-center h-full text-slate-400'>
        No chat selected.
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <ChatMessageHeader user={selectedUser} />
      <MessageList chatPartnerId={selectedUser._id} />
      <MessageInput receiverId={selectedUser._id} />
    </div>
  );
}

export default ChatContainer;
