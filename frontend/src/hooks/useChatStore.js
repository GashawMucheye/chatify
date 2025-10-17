// src/hooks/useChatStore.js (Simplified)
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore'; // Assuming this path

export const useChatStore = create((set, get) => ({
  // ⚠️ Server state (allContacts, chats, messages) is now managed by React Query cache.
  // We only keep local/UI state here.
  activeTab: 'chats',
  selectedUser: null,
  isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) === true, // A temporary state to hold optimistic messages before they are confirmed
  optimisticMessages: [],

  toggleSound: () => {
    localStorage.setItem('isSoundEnabled', !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => {
    set({ selectedUser }); // Optionally clear optimistic messages when switching users
    set({ optimisticMessages: [] });
  }
  /**
   * Local function to add a real message to the list (used by socket listener)
   * ⚠️ This function is for handling real-time socket events, not query data.
   */,

  handleNewRealTimeMessage: (newMessage) => {
    const { selectedUser, isSoundEnabled } = get(); // Only update if the message is from the currently selected user
    const isMessageSentFromSelectedUser =
      newMessage.senderId === selectedUser?._id;
    if (!isMessageSentFromSelectedUser) return; // ⚠️ NOTE: The React Query cache will be responsible for the main messages array. // For simplicity, we'll let React Query handle the main fetch, and this listener // should ideally invalidate the cache to refetch or use the queryClient.setQueryData // However, to mirror the original logic, we'll manage the *immediate* UI update here // and rely on a component to read the full messages list including optimistics.
    if (isSoundEnabled) {
      const notificationSound = new Audio('/sounds/notification.mp3');
      notificationSound.currentTime = 0;
      notificationSound
        .play()
        .catch((e) => console.log('Audio play failed:', e));
    } // To fully integrate with React Query, this should trigger an update // to the query cache, which is best done within the component using the hooks. // We'll keep the socket listener logic centralized here.
    return newMessage; // Return the message to be handled by the component/hook
  }, // --- Socket Management ---

  subscribeToMessages: (queryClient) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on('newMessage', (newMessage) => {
      const { selectedUser, isSoundEnabled } = get();
      const isMessageFromSelectedUser =
        newMessage.senderId === selectedUser?._id;
      if (isMessageFromSelectedUser) {
        // Optimistically update the cache with the new message
        queryClient.setQueryData(
          ['messages', selectedUser._id],
          (oldMessages) => {
            return oldMessages ? [...oldMessages, newMessage] : [newMessage];
          }
        );
        if (isSoundEnabled) {
          const notificationSound = new Audio('/sounds/notification.mp3');
          notificationSound.currentTime = 0;
          notificationSound
            .play()
            .catch((e) => console.log('Audio play failed:', e));
        }
      } else {
        // Optionally invalidate or update the chats list if the new message is from a partner
        // who isn't currently selected, so the chat list gets a badge/update.
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off('newMessage');
    }
  },
}));
