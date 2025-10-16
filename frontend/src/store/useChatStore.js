// useChatStore.js

import { create } from 'zustand';
import { useAuthStore } from './useAuthStore'; // Import needed for socket access

export const useChatStore = create((set, get) => ({
  // --- Client State ---
  activeTab: 'chats',
  selectedUser: null,
  isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) === true,

  // --- Actions ---

  toggleSound: () => {
    const newState = !get().isSoundEnabled;
    localStorage.setItem('isSoundEnabled', newState);
    set({ isSoundEnabled: newState });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  addMessage: (newMessage) => {
    // This is designed to be called by the socket listener
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  subscribeToMessages: (messagesUpdater) => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on('newMessage', (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

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
