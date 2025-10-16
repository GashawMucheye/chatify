// useChatStore.js

import { create } from 'zustand';
import { useAuthStore } from './useAuthStore'; // Import needed for socket access

export const useChatStore = create((set, get) => ({
  // --- Server State (Now managed by React Query) ---
  // allContacts, chats, and messages are now managed by React Query cache.
  // We only keep the client-side/UI state here.

  // --- Client State ---
  activeTab: 'chats',
  selectedUser: null,
  isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) === true,

  // --- Actions ---

  toggleSound: () => {
    // Note: React Query does NOT handle this local storage persistence.
    // This action remains in the store as it's purely client-side state logic.
    const newState = !get().isSoundEnabled;
    localStorage.setItem('isSoundEnabled', newState);
    set({ isSoundEnabled: newState });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // You will use React Query's cache to directly manage messages now,
  // but we'll add a simple setter/updater for real-time socket updates.
  // The initial fetch is done by a React Query hook.
  addMessage: (newMessage) => {
    // This is designed to be called by the socket listener
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  // --- Socket Logic (Remains here as it interacts with global state) ---

  // Note: The logic below should be called when the selected user changes,
  // perhaps within a `useEffect` inside a React component.
  // Since it relies on the React Query state, it's cleaner to handle
  // the subscription in a React component/hook. However, for a direct
  // port of the logic, it stays in the store but relies on the socket
  // from useAuthStore.

  // NOTE: You'll want to **move this socket logic to a custom React Hook**
  // (e.g., `useSocketMessages`) that can easily react to `selectedUser` changes
  // and clean up the subscription (`unsubscribeFromMessages`) using `useEffect`.
  // I'll keep the functions here for now but recommend the move.

  subscribeToMessages: (messagesUpdater) => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on('newMessage', (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      // Instead of relying on a `messages` array in Zustand,
      // we rely on the updater provided by the React Query component
      // to directly update the cache.
      messagesUpdater(newMessage);

      if (isSoundEnabled) {
        const notificationSound = new Audio('/sounds/notification.mp3');
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log('Audio play failed:', e));
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
