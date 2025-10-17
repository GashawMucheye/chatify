import { useChatStore } from '../hooks/useChatStore'; // Updated path for simplified store
import { useAuthStore } from '../hooks/useAuthStore'; // Updated path for auth store
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import { useAllContacts } from '../hooks/useChatQueries'; // Import the new React Query hook

function ContactList() {
  // 1. REACT QUERY HOOK: Use the query hook to fetch contacts
  const { data: allContacts, isLoading, isError, error } = useAllContacts(); // 2. ZUSTAND HOOK: Get only the local state and action we still need from Zustand

  const { setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore(); // 3. ERROR HANDLING (useEffect for side effects like toasts)

  if (isLoading) {
    return <UsersLoadingSkeleton />;
  } // Handle case where data might not exist (though placeholderData: [] should prevent this)

  if (!allContacts) {
    return <p className='text-center text-gray-500'>No contacts available.</p>;
  } // 5. RENDER LIST: Use the data returned from the query
  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors' // 6. ACTION: Still use the Zustand action for local selection
          onClick={() => setSelectedUser(contact)}
        >
          <div className='flex items-center gap-3'>
            <div
              className={`avatar ${
                onlineUsers.includes(contact._id) ? 'online' : 'offline'
              }`}
            >
              <div className='size-12 rounded-full'>
                <img
                  src={contact.profilePic || '/avatar.png'}
                  alt={contact.fullName}
                />
              </div>
            </div>
            <h4 className='text-slate-200 font-medium'>{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;
