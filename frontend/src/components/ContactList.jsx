import React from 'react';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';

// 1. IMPORT FIX: Import specific hooks and store
import { useAllContacts } from '../hooks/useChat'; // TanStack Query hook
import { useChatStore } from '../store/useChatStore'; // Zustand store for setSelectedUser
import { useAuthStore } from '../store/useAuthStore'; // Zustand store for onlineUsers (where socket state lives)

const ContactList = () => {
  // 2. HOOK USAGE FIX: Fetch contacts using the TanStack Query hook
  const { data: contacts, isLoading, isError } = useAllContacts();

  // 3. ZUSTAND STATE ACCESS: Get state and action from the stores
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  // Check loading state from the query hook
  if (isLoading) return <UsersLoadingSkeleton />;

  // Handle error case
  if (isError)
    return <div className='p-4 text-red-400'>Error loading contacts.</div>;

  // Use the data returned by the query
  const contactsToDisplay = contacts || [];

  return (
    <>
      {contactsToDisplay.map((contact) => (
        <div
          key={contact._id}
          className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors'
          onClick={() => setSelectedUser(contact)} // Action from Zustand
        >
          <div className='flex items-center gap-3'>
            <div
              className={`avatar ${
                // Use onlineUsers state from useAuthStore
                onlineUsers.includes(contact._id) ? 'online' : 'offline'
              }`}
            >
              <div className='size-12 rounded-full'>
                <img src={contact.profilePic || '/avatar.png'} alt='avatar' />
              </div>
            </div>
            <h4 className='text-slate-200 font-medium'>{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactList;
