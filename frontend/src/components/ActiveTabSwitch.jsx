import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { useLogout } from '../hooks/useAuth'; // Assuming this hook returns { mutate, isPending }

function ActiveTabSwitch() {
  // 1. Call the hook at the top level
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // ✅ SAFE ZUSTAND ACCESS: Separate selectors
  const activeTab = useChatStore((state) => state.activeTab);
  const setActiveTab = useChatStore((state) => state.setActiveTab);

  return (
    <div className='tabs tabs-boxed bg-transparent p-2 m-2'>
      {/* Chats Button */}
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

      {/* Contacts Button */}
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

      {/* LOGOUT Button: Correctly calling the logout function on click */}
      <button
        onClick={() => logout()} // 2. Call the mutate function inside a wrapper or directly
        disabled={isLoggingOut} // 3. Disable while logging out
        className={`tab text-red-400 ${
          isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500/10'
        }`}
      >
        {isLoggingOut ? 'Logging Out...' : 'Logout'}
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
