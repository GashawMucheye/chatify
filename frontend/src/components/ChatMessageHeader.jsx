import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

function ChatMessageHeader({ user }) {
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const isOnline = onlineUsers.includes(user._id);

  return (
    <div className='p-4 border-b border-slate-700/50 bg-slate-800/80 flex items-center gap-4'>
      <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
        <div className='size-12 rounded-full'>
          <img src={user.profilePic || '/avatar.png'} alt='avatar' />
        </div>
      </div>
      <div>
        <h4 className='text-slate-200 font-medium text-lg'>{user.fullName}</h4>
        <p
          className={`text-sm ${
            isOnline ? 'text-green-400' : 'text-slate-400'
          }`}
        >
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
}
export default ChatMessageHeader;
