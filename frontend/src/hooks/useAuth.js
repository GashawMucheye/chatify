// useAuth.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios'; // Make sure this path is correct
import { useAuthStore } from '../store/useAuthStore';

const USER_QUERY_KEY = 'authUser'; // A consistent key for the authenticated user data

/**
 * Hook to check the user's authentication status.
 * Uses useQuery for fetching.
 */
export const useCheckAuth = () => {
  const { setAuthUser, connectSocket, disconnectSocket } = useAuthStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/check');
      return res.data; // The user object
    },
    // Configuration for the query:
    staleTime: Infinity, // The user data is "fresh" until the user logs out or updates their profile
    refetchOnWindowFocus: false, // Prevents unnecessary checks on tab focus

    // What to do on a successful fetch (when data is returned)
    onSuccess: (user) => {
      setAuthUser(user);
      connectSocket(); // Connect socket only if auth is successful
    },

    // What to do on an error (e.g., user is not authenticated)
    onError: (error) => {
      // Clear the user from the store if the check fails
      setAuthUser(null);
      disconnectSocket();
      // Optionally invalidate the query to ensure it tries again later if needed
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};

/**
 * Hook to handle user sign-up.
 * Uses useMutation for side effects.
 */
export const useSignup = () => {
  const { setAuthUser, connectSocket } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post('/auth/signup', data);
      return res.data; // The new user object
    },
    onSuccess: (user) => {
      setAuthUser(user);
      connectSocket();
      // Update the user query cache so the app knows the user is logged in
      queryClient.setQueryData([USER_QUERY_KEY], user);
      toast.success('Account created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
    },
  });
};

/**
 * Hook to handle user login.
 * Uses useMutation for side effects.
 */
export const useLogin = () => {
  const { setAuthUser, connectSocket } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post('/auth/login', data);
      return res.data; // The logged-in user object
    },
    onSuccess: (user) => {
      setAuthUser(user);
      connectSocket();
      queryClient.setQueryData([USER_QUERY_KEY], user);
      toast.success('Logged in successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });
};

/**
 * Hook to handle user logout.
 * Uses useMutation for side effects.
 */
export const useLogout = () => {
  const { clearAuthUser, disconnectSocket } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/auth/logout');
    },
    onSuccess: () => {
      clearAuthUser();
      disconnectSocket();
      // Remove the user from the cache upon successful logout
      queryClient.setQueryData([USER_QUERY_KEY], null);
      toast.success('Logged out successfully');
    },
    onError: (error) => {
      console.log('Logout error:', error);
      toast.error('Error logging out');
    },
  });
};

/**
 * Hook to update the user's profile.
 * Uses useMutation for side effects.
 */
export const useUpdateProfile = () => {
  const { setAuthUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put('/auth/update-profile', data);
      return res.data; // The updated user object
    },
    onSuccess: (updatedUser) => {
      setAuthUser(updatedUser);
      // Update the user data in the cache to reflect the changes immediately
      queryClient.setQueryData([USER_QUERY_KEY], updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      console.log('Error in update profile:', error);
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
    },
  });
};
