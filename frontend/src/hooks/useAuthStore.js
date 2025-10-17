// src/hooks/useAuthStore.js
import { create } from 'zustand';
import { io } from 'socket.io-client';

const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/';

export const useAuthStore = create((set, get) => ({
  // State for local management (React Query handles loading/errors for data)
  authUser: null,
  socket: null,
  onlineUsers: [], // Actions for local state and side effects

  setAuthUser: (user) => {
    set({ authUser: user });
    if (user) {
      get().connectSocket();
    } else {
      get().disconnectSocket();
    }
  },

  connectSocket: () => {
    const { authUser } = get(); // Only connect if authUser exists AND a socket hasn't been connected yet
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();
    set({ socket });

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
