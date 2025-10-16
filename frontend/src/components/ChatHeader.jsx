import { XIcon } from 'lucide-react';
import { useEffect } from 'react';

// 1. IMPORT FIX: Import Zustand stores for state and actions
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

function ChatHeader() {
  // 2. ZUSTAND STATE ACCESS: Get state and actions directly from the stores
  const { selectedUser, setSelectedUser } = useChatStore((state) => ({
    selectedUser: state.selectedUser,
    setSelectedUser: state.setSelectedUser,
  }));

  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  // Safety check: This component should only render if selectedUser exists.
  if (!selectedUser) return null;

  // Determine online status
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      // Check if the user is currently selected before attempting to clear
      if (event.key === 'Escape' && selectedUser) {
        setSelectedUser(null);
      }
    };

    window.addEventListener('keydown', handleEscKey);

    // cleanup function
    return () => window.removeEventListener('keydown', handleEscKey);

    // Depend on setSelectedUser (Zustand action, stable) and selectedUser (state)
  }, [setSelectedUser, selectedUser]);

  return (
    <div
      className='flex justify-between items-center bg-slate-800/50 border-b
                border-slate-700/50 max-h-[84px] px-6 flex-1'
    >
      <div className='flex items-center space-x-3'>
        <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
          <div className='w-12 rounded-full'>
            <img
              src={selectedUser.profilePic || '/avatar.png'}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        <div>
          <h3 className='text-slate-200 font-medium'>
            {selectedUser.fullName}
          </h3>
          <p className='text-slate-400 text-sm'>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className='w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer' />
      </button>
    </div>
  );
}
export default ChatHeader;
