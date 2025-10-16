import ChatContainer from '../components/ChatContainer';
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList'; // ✅ Added missing import
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';
import { useChatStore } from '../store/useChatStore';

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className='relative w-full max-w-6xl h-[800px] flex rounded-xl overflow-hidden shadow-lg border border-slate-700/40'>
      {/* LEFT SIDE */}
      <div className='w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col'>
        <ProfileHeader />
        <ActiveTabSwitch />
        <div className='flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700/50'>
          {activeTab === 'chats' ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className='flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm'>
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

export default ChatPage;
