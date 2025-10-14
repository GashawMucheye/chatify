// src/api/auth.ts

import { axiosInstance } from '../lib/axios';

export const checkAuth = async () => {
  const res = await axiosInstance.get('/auth/check');
  return res.data;
};

export const signup = async (data) => {
  const res = await axiosInstance.post('/auth/signup', data);
  return res.data;
};

export const login = async (data) => {
  const res = await axiosInstance.post('/auth/login', data);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post('/auth/logout');
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await axiosInstance.put('/auth/update-profile', data);
  return res.data;
};
