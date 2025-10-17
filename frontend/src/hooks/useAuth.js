// src/hooks/useAuth.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios'; // Adjust path as needed
import { useAuthStore } from './useAuthStore';
import toast from 'react-hot-toast';

// --- API Functions ---
const checkAuthFn = async () => {
  const res = await axiosInstance.get('/auth/check');
  return res.data; // Return the user data
};

const signupFn = async (data) => {
  const res = await axiosInstance.post('/auth/signup', data);
  return res.data;
};

const loginFn = async (data) => {
  const res = await axiosInstance.post('/auth/login', data);
  return res.data;
};

const logoutFn = async () => {
  await axiosInstance.post('/auth/logout');
  return null; // Indicate successful logout
};

const updateProfileFn = async (data) => {
  const res = await axiosInstance.put('/auth/update-profile', data);
  return res.data;
};

// --- React Query Hooks ---

/**
 * 1. Auth Check Query
 * Replaces the checkAuth action. Fetches the authenticated user.
 */
export const useCheckAuth = () => {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  return useQuery({
    queryKey: ['authUser'],
    queryFn: checkAuthFn,
    retry: false, // Don't retry on error, as it likely means no auth
    initialData: null, // Start with null until query runs
    onSuccess: (data) => {
      setAuthUser(data); // Update Zustand store on success
    },
    onError: (error) => {
      console.log('Error in authCheck:', error);
      setAuthUser(null); // Clear user on error
    }, // `isCheckingAuth` is now replaced by `isLoading` or `isPending`
  });
};

/**
 * 2. Signup Mutation
 * Replaces the signup action.
 */
export const useSignup = () => {
  const queryClient = useQueryClient();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  return useMutation({
    mutationFn: signupFn,
    onSuccess: (newUserData) => {
      // Invalidate the 'authUser' query to refetch or update its cache
      queryClient.setQueryData(['authUser'], newUserData);
      setAuthUser(newUserData);
      toast.success('Account created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Signup failed');
    }, // `isSigningUp` is now replaced by `isPending` or `isMutating`
  });
};

/**
 * 3. Login Mutation
 * Replaces the login action.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (newUserData) => {
      queryClient.setQueryData(['authUser'], newUserData);
      setAuthUser(newUserData);
      toast.success('Logged in successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    }, // `isLoggingIn` is now replaced by `isPending` or `isMutating`
  });
};

/**
 * 4. Logout Mutation
 * Replaces the logout action.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      // Clear the 'authUser' cache and update Zustand
      queryClient.setQueryData(['authUser'], null);
      setAuthUser(null);
      toast.success('Logged out successfully');
    },
    onError: (error) => {
      toast.error('Error logging out');
      console.log('Logout error:', error);
    },
  });
};

/**
 * 5. Update Profile Mutation
 * Replaces the updateProfile action.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  return useMutation({
    mutationFn: updateProfileFn,
    onSuccess: (updatedUserData) => {
      // Update the cached 'authUser' data directly
      queryClient.setQueryData(['authUser'], updatedUserData);
      setAuthUser(updatedUserData);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      console.log('Error in update profile:', error);
      toast.error(error.response?.data?.message || 'Profile update failed');
    },
  });
};
