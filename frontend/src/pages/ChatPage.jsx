import { useChatStore } from '../hooks/useChatStore'; // Fixed import path

// Import all necessary components
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';
import ProfileHeader from '../components/ProfileHeader';

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className='relative w-full max-w-6xl h-[800px] bg-red-600'>
      <div className='w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col'>
        <ProfileHeader />
        <ActiveTabSwitch />
        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
          {/* Switch between ChatsList and ContactList based on activeTab state */}
          {activeTab === 'chats' ? <ChatsList /> : <ContactList />} 
        </div>
      </div>
      {/* RIGHT SIDE (Chat Area) */}
      <div className='flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm'>
        {/* Show ChatContainer if a user is selected, otherwise show placeholder */}
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}     
      </div>
    </div>
  );
}
export default ChatPage;
