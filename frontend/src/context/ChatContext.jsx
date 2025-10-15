import React, { createContext, useContext, useState, useMemo } from 'react';

// Create context
const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(
    JSON.parse(localStorage.getItem('isSoundEnabled')) === true
  );

  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('isSoundEnabled', newValue);
      return newValue;
    });
  };

  const value = useMemo(
    () => ({
      activeTab,
      selectedUser,
      isSoundEnabled,
      toggleSound,
      setActiveTab,
      setSelectedUser,
    }),
    [activeTab, selectedUser, isSoundEnabled]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Hook for using chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
