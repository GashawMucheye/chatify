import { useMyChatPartners } from '../hooks/useChatQueries'; // React Query hook
import NoChatsFound from './NoChatFound';
// import { onlineUsers } from '../hooks/useAuthStore';
import UsersLoadingSkeleton from './UsersLoadingSkeleton'; // (assuming you have this component)
import { useAuthStore } from '../hooks/useAuthStore';
import { useChatStore } from '../hooks/useChatStore';

function ChatsList() {
  // 1. REACT QUERY HOOK: Fetch chat partners
  const { data: chats, isLoading } = useMyChatPartners();

  // 2. ZUSTAND: Access the setSelectedUser action from the store
  const { onlineUsers } = useAuthStore(); // ✅ FIXED: extract from store instead of importing directly
  const { setSelectedUser } = useChatStore(); // ✅ FIXED: extract from store instead of importing directly

  // 3. Loading state
  if (isLoading) {
    return <UsersLoadingSkeleton />;
  }

  // 4. Empty state
  if (!chats || chats.length === 0) {
    return <NoChatsFound />;
  }

  // 5. Render chat list
  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors'
          onClick={() => setSelectedUser(chat)} // ✅ pass full chat or chat.id depending on your store design
        >
          <div className='flex items-center gap-3'>
            {/* Optional avatar section if you want to restore online status */}
            <div
              className={`avatar ${
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
          </div>
        </div>
      ))}
    </>
  );
}

export default ChatsList;
