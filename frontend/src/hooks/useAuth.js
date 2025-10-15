// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { checkAuth, login, logout, signup, updateProfile } from '../api/auth';
import { useSocket } from '../context/SocketContext';

export function useAuth() {
  const queryClient = useQueryClient();
  const { connectSocket, disconnectSocket } = useSocket();

  // ✅ Check Auth (auto runs on mount)
  const {
    data: authUser,
    isLoading: isCheckingAuth,
    error,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const data = await checkAuth();
      connectSocket();

      return data;
    },
    retry: false,
  });

  // ✅ Signup
  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      toast.success('Account created successfully!');
      queryClient.setQueryData(['authUser'], data);
      connectSocket();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Signup failed'),
  });

  // ✅ Login
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success('Logged in successfully');
      queryClient.setQueryData(['authUser'], data);
      connectSocket();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Login failed'),
  });

  // ✅ Logout
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Logged out successfully');
      queryClient.removeQueries({ queryKey: ['authUser'] });
      disconnectSocket();
    },
    onError: () => toast.error('Error logging out'),
  });

  // ✅ Update profile
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success('Profile updated successfully');
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Update failed'),
  });

  return {
    authUser,
    isCheckingAuth,
    signupMutation,
    loginMutation,
    logoutMutation,
    updateProfileMutation,
  };
}
