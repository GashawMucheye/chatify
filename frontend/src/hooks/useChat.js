// useChat.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore'; // To get authUser data for optimistic UI
import { axiosInstance } from '../lib/axios'; // Assuming axiosInstance is in this path

const CHATS_QUERY_KEY = 'chatPartners';
const CONTACTS_QUERY_KEY = 'allContacts';
const MESSAGES_QUERY_KEY = 'messages';

// -----------------------------------------------------------------------------
// QUERY HOOKS (Fetching Data)
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// MUTATION HOOKS (Sending Data)
// -----------------------------------------------------------------------------

/**
 * Hook to send a message, featuring optimistic UI updates.
 * Uses useMutation.
 */
export const useSendMessage = (receiverId) => {
  const queryClient = useQueryClient();
  // ❌ REMOVED: const { authUser } = useAuthStore.getState();
  // This value would be stale if the user logs in after the component mounts.

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
      // ✅ FIX: Get the fresh authUser state here, just before use.
      const authUser = useAuthStore.getState().authUser;

      if (!authUser) {
        toast.error('You must be logged in to send a message.');
        throw new Error('User not authenticated.');
      }

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

      // Return a context object with the snapshot value and tempId
      return { previousMessages, tempId };
    },

    // 2. Rollback on Failure
    onError: (error, variables, context) => {
      // Only show toast if it's a genuine network/server error
      if (error.message !== 'User not authenticated.') {
        toast.error(error.response?.data?.message || 'Message failed to send.');
      }

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
      // Update the cache to replace the optimistic message with the real one
      queryClient.setQueryData([MESSAGES_QUERY_KEY, receiverId], (old) => {
        if (!old) return [newMessage];

        // Find and replace the optimistic message (using the tempId)
        // Filter out the optimistic message, and add the real one to the end.
        const updatedMessages = old.filter((msg) => msg._id !== context.tempId);

        return [...updatedMessages, newMessage];
      });

      // Invalidate the chats list to update the latest message/timestamp in the sidebar
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });

      // NOTE: The separate message invalidation is not needed here
      // because setQueryData already updates the cache.
    },
  });
};
