import ChatContainer from '../components/ChatContainer';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import NoConversationPlaceholder from '../components/NoChatHistoryPlaceholder';
import { useChatStore } from '../store/useChatStore';
import MessageBubble from '../components/MessageBubble';
// shallow import REMOVED

function ChatPage() {
  // FIX: Select properties individually.
  // This is the safest way to prevent the infinite re-render loop without using 'shallow'.
  const activeTab = useChatStore((state) => state.activeTab);
  const selectedUser = useChatStore((state) => state.selectedUser);

  return (
    <div className='relative w-full max-w-6xl h-[800px] flex rounded-xl overflow-hidden shadow-lg border border-slate-700/40'>
      {/* LEFT SIDE */}
      <div className='w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col'>
        <MessageBubble />
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
