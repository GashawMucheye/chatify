// useAuthStore.js

import { create } from 'zustand';
import { io } from 'socket.io-client';

// Define the base URL for the socket connection
const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/';

export const useAuthStore = create((set, get) => ({
  // Holds the authenticated user data. Set by a successful checkAuth/login/signup.
  authUser: null,

  // Socket.io instance
  socket: null,

  // Array of user IDs for online users
  onlineUsers: [],

  // --- Actions ---

  // Called after successful login/signup/checkAuth to connect the socket
  connectSocket: () => {
    const { authUser } = get();
    // Only connect if there's an authenticated user AND the socket isn't already connected
    if (!authUser || get().socket?.connected) return;

    // Initialize the socket
    const socket = io(BASE_URL, {
      withCredentials: true, // ensures cookies (for auth) are sent with the connection
    });

    socket.connect();

    set({ socket });

    // Listen for online users event
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // Called on logout
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null, onlineUsers: [] }); // Also clear state related to socket
    }
  },

  // State setters (called by React Query hooks on success)
  setAuthUser: (user) => {
    set({ authUser: user });
  },

  clearAuthUser: () => {
    set({ authUser: null });
  },
}));
