// hooks/useRealTimeMessages.js

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const MESSAGES_QUERY_KEY = 'messages'; // Ensure this matches useChat.js

/**
 * Custom hook to handle real-time socket events for messages.
 * It subscribes to 'newMessage' and updates the TanStack Query cache directly.
 */
export const useRealTimeMessages = (chatPartnerId) => {
  const queryClient = useQueryClient();
  const { socket } = useAuthStore();
  const { isSoundEnabled } = useChatStore();

  useEffect(() => {
    if (!socket || !chatPartnerId) return;

    const handleNewMessage = (newMessage) => {
      // Check if the message is for the currently viewed chat
      const isMessageFromCurrentPartner =
        newMessage.senderId === chatPartnerId ||
        newMessage.receiverId === chatPartnerId;

      if (!isMessageFromCurrentPartner) return;

      // Play notification sound
      if (isSoundEnabled) {
        const notificationSound = new Audio('/sounds/notification.mp3');
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log('Audio play failed:', e));
      }

      // Update the TanStack Query cache with the new message
      queryClient.setQueryData(
        [MESSAGES_QUERY_KEY, chatPartnerId],
        (oldMessages) => {
          // If oldMessages is not available (shouldn't happen if component loads correctly), just return the new one
          if (!oldMessages) return [newMessage];

          // Prevent duplicates (e.g., if message was already optimistically added by sender)
          const isDuplicate = oldMessages.some(
            (msg) =>
              msg._id === newMessage._id ||
              (msg.text === newMessage.text &&
                msg.senderId === newMessage.senderId)
          );
          if (isDuplicate) return oldMessages;

          return [...oldMessages, newMessage];
        }
      );

      // Invalidate the chats list to show the latest message/timestamp update
      queryClient.invalidateQueries({ queryKey: ['chatPartners'] });
    };

    // Subscribe
    socket.on('newMessage', handleNewMessage);

    // Cleanup: unsubscribe when the component unmounts or chatPartnerId changes
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, chatPartnerId, isSoundEnabled, queryClient]);

  // This hook returns nothing, its job is just to manage the subscription/cache updates
};
