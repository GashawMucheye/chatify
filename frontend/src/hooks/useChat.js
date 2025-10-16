// useChat.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore'; // To get authUser data for optimistic UI

const CHATS_QUERY_KEY = 'chatPartners';
const CONTACTS_QUERY_KEY = 'allContacts';
const MESSAGES_QUERY_KEY = 'messages';

/**
 * Hook to fetch all user contacts (people who can be chatted with).
 * Uses useQuery.
 */
export const useAllContacts = () => {
  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY],
    queryFn: async () => {
      const res = await axiosInstance.get('/messages/contacts');
      return res.data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to fetch contacts.';
      toast.error(message);
    },
  });
};

/**
 * Hook to fetch the user's active chat partners (people they have chatted with).
 * Uses useQuery.
 */
export const useMyChatPartners = () => {
  return useQuery({
    queryKey: [CHATS_QUERY_KEY],
    queryFn: async () => {
      const res = await axiosInstance.get('/messages/chats');
      return res.data;
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to fetch chats.';
      toast.error(message);
    },
  });
};

/**
 * Hook to fetch messages for a specific chat.
 * Uses useQuery.
 */
export const useMessagesByUserId = (userId) => {
  // Only enable the query if a userId is provided
  const enabled = !!userId;

  return useQuery({
    queryKey: [MESSAGES_QUERY_KEY, userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/messages/${userId}`);
      return res.data;
    },
    enabled,
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to fetch messages.';
      toast.error(message);
    },
  });
};

/**
 * Hook to send a message, featuring optimistic UI updates.
 * Uses useMutation.
 */
export const useSendMessage = (receiverId) => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthStore.getState();

  return useMutation({
    mutationFn: async (messageData) => {
      // messageData should contain { text, image }
      const res = await axiosInstance.post(
        `/messages/send/${receiverId}`,
        messageData
      );
      return res.data; // The final, saved message object
    },

    // 1. Optimistic Update (runs *before* the API call)
    onMutate: async (messageData) => {
      // Stop any background refetches of messages for this chat
      await queryClient.cancelQueries({
        queryKey: [MESSAGES_QUERY_KEY, receiverId],
      });

      // Snapshot the previous messages list
      const previousMessages = queryClient.getQueryData([
        MESSAGES_QUERY_KEY,
        receiverId,
      ]);

      const tempId = `temp-${Date.now()}`;

      // Create the optimistic message object
      const optimisticMessage = {
        _id: tempId,
        senderId: authUser._id,
        receiverId: receiverId,
        text: messageData.text,
        image: messageData.image,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      // Optimistically update the cache
      if (previousMessages) {
        queryClient.setQueryData([MESSAGES_QUERY_KEY, receiverId], (old) => [
          ...old,
          optimisticMessage,
        ]);
      }

      // Return a context object with the snapshot value
      return { previousMessages, tempId };
    },

    // 2. Rollback on Failure
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || 'Message failed to send.');
      // Rollback to the previous messages list on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          [MESSAGES_QUERY_KEY, receiverId],
          context.previousMessages
        );
      }
    },

    // 3. Final Success Update
    onSuccess: (newMessage, variables, context) => {
      // Invalidate messages to ensure the cache is clean,
      // though we'll update it directly below for immediate accuracy.
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, receiverId],
      });

      // Update the cache to replace the optimistic message with the real one
      queryClient.setQueryData([MESSAGES_QUERY_KEY, receiverId], (old) => {
        if (!old) return [newMessage];

        // Find and replace the optimistic message (using the tempId)
        // Note: The logic from your original code simply concatenated the new message:
        // `set({ messages: messages.concat(res.data) })`.
        // This means the old code left both the optimistic and the real message.
        // **The fix here is to remove the optimistic one and add the real one.**

        return old
          .map((msg) => (msg._id === context.tempId ? newMessage : msg))
          .filter((msg) => !msg.isOptimistic || msg._id !== context.tempId); // Filter out the optimistic message if it wasn't replaced (shouldn't happen)
      });

      // Also invalidate the chats list to bring the latest message/timestamp to the UI
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });
    },
  });
};
