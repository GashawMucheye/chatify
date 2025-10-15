// src/context/SocketContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/';

const SocketContext = createContext({
  socket: null,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;
    socket.on('getOnlineUsers', (userIds) => {
      setOnlineUsers(userIds);
    });
    return () => {
      socket.off('getOnlineUsers');
    };
  }, [socket]);

  const connectSocket = () => {
    const s = io(BASE_URL, { withCredentials: true });
    s.connect();
    setSocket(s);
  };

  const disconnectSocket = () => {
    socket?.disconnect();
    setSocket(null);
  };

  return (
    <SocketContext.Provider
      value={{ socket, onlineUsers, connectSocket, disconnectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
