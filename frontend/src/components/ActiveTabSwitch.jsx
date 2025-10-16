import { useChatStore } from '../store/useChatStore'; // Import the Zustand store

function ActiveTabSwitch() {
  // 1. ZUSTAND STATE ACCESS: Get state and action directly from the store
  const { activeTab, setActiveTab } = useChatStore((state) => ({
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab,
  }));

  return (
    <div className='tabs tabs-boxed bg-transparent p-2 m-2'>
      <button
        onClick={() => setActiveTab('chats')}
        className={`tab ${
          activeTab === 'chats'
            ? 'bg-cyan-500/20 text-cyan-400'
            : 'text-slate-400'
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab('contacts')}
        className={`tab ${
          activeTab === 'contacts'
            ? 'bg-cyan-500/20 text-cyan-400'
            : 'text-slate-400'
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
