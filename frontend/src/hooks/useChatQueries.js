// src/hooks/useChatQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import toast from 'react-hot-toast';
import { useChatStore } from './useChatStore';

// --- API Functions ---
const getAllContactsFn = async () => {
  const res = await axiosInstance.get('/messages/contacts');
  return res.data;
};

const getMyChatPartnersFn = async () => {
  const res = await axiosInstance.get('/messages/chats');
  return res.data;
};

const getMessagesByUserIdFn = async ({ queryKey }) => {
  // queryKey is ['messages', userId]
  const [_key, userId] = queryKey;
  if (!userId) return [];
  const res = await axiosInstance.get(`/messages/${userId}`);
  return res.data;
};

const sendMessageFn = async ({ receiverId, messageData }) => {
  const res = await axiosInstance.post(
    `/messages/send/${receiverId}`,
    messageData
  );
  return res.data; // The newly created message object
};

// --- React Query Hooks ---

/**
 * 1. Contacts Query (Replaces getAllContacts)
 */
export const useAllContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: getAllContactsFn,
    placeholderData: [], // Provides an empty array while loading // isUsersLoading is now replaced by isLoading or isFetching
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error fetching contacts');
    },
  });
};

/**
 * 2. Chats Partners Query (Replaces getMyChatPartners)
 */
export const useMyChatPartners = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: getMyChatPartnersFn,
    placeholderData: [], // isUsersLoading is now replaced by isLoading or isFetching
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Error fetching chat partners'
      );
    },
  });
};

/**
 * 3. Messages Query (Replaces getMessagesByUserId)
 */
export const useMessagesByUserId = (userId) => {
  return useQuery({
    queryKey: ['messages', userId],
    queryFn: getMessagesByUserIdFn,
    enabled: !!userId, // Only run the query if userId is available
    placeholderData: [], // isMessagesLoading is now replaced by isLoading or isFetching
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error fetching messages');
    },
  });
};

/**
 * 4. Send Message Mutation (Replaces sendMessage)
 * Includes Optimistic Updates, a core strength of React Query
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { selectedUser } = useChatStore.getState();
  const { authUser } = useAuthStore.getState();

  return useMutation({
    mutationFn: sendMessageFn, // --- OPTIMISTIC UPDATE LOGIC ---
    onMutate: async ({ receiverId, messageData }) => {
      // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['messages', receiverId] }); // 2. Snapshot the previous messages list

      const previousMessages = queryClient.getQueryData([
        'messages',
        receiverId,
      ]); // 3. Create the optimistic message

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        _id: tempId,
        senderId: authUser._id,
        receiverId: receiverId,
        text: messageData.text,
        image: messageData.image,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      }; // 4. Optimistically update the cache with the new message

      queryClient.setQueryData(['messages', receiverId], (oldMessages) => {
        return oldMessages
          ? [...oldMessages, optimisticMessage]
          : [optimisticMessage];
      });

      // 5. Invalidate the chats list to reflect the last message in the UI immediately
      queryClient.invalidateQueries({ queryKey: ['chats'] }); // 6. Return context object with the snapshot

      return { previousMessages, receiverId };
    }, // 7. If the mutation succeeds, replace the optimistic message with the real one

    onSuccess: (newMessage, variables, context) => {
      queryClient.setQueryData(['messages', context.receiverId], (messages) => {
        // Find the optimistic message and replace it
        return messages.map((msg) => (msg.isOptimistic ? newMessage : msg));
      });
    }, // 8. If the mutation fails, rollback to the previous cache state

    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || 'Failed to send message'); // Rollback the cache data
      queryClient.setQueryData(
        ['messages', context.receiverId],
        context.previousMessages
      );
    }, // 9. Always refetch to ensure data is in sync (optional, but good for robust chat)

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.receiverId],
      });
    },
  });
};
