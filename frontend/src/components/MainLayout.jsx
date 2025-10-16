import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import SignUpPage from '../pages/SignUpPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ChatPage from '../pages/ChatPage.jsx';

// 1. IMPORT FIX: Import the specific TanStack Query hook and the Zustand store
import { useCheckAuth } from '../hooks/useAuth.js';
import { useAuthStore } from '../store/useAuthStore.js';

import PageLoader from './PageLoader.jsx';

const MainLayout = () => {
  // 2. HOOK USAGE FIX: Execute the TanStack Query to check auth status
  const {
    isLoading: isCheckingAuth,
    isError: isAuthError,
    // The data (authUser) is managed and stored in useAuthStore by the hook's onSuccess
  } = useCheckAuth();

  // 3. ZUSTAND STATE ACCESS: Get the authUser state from the store
  const authUser = useAuthStore((state) => state.authUser);

  // The old useEffect was unnecessary and contained an error (calling authUser as a function).
  // TanStack Query's 'useCheckAuth' handles the initial fetch automatically.

  // 4. LOADING STATE FIX: Show the loader while the query is running
  if (isCheckingAuth) {
    return <PageLoader />;
  }

  // Optional: Handle a severe error during the initial check
  if (isAuthError && !authUser) {
    // If there's an error and no cached user, we can decide to let it fall through
    // to the login page or show a dedicated error screen.
    // For now, we'll let it proceed, but the user will be null.
  }

  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
      <Routes>
        {/* Protected Route: Only accessible if authUser exists */}
        <Route
          path='/'
          element={authUser ? <ChatPage /> : <Navigate to={'/login'} />}
        />
        {/* Public Route (Login): Navigate away if authUser exists */}
        <Route
          path='/login'
          element={!authUser ? <LoginPage /> : <Navigate to={'/'} />}
        />
        {/* Public Route (Signup): Navigate away if authUser exists */}
        <Route
          path='/signup'
          element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />}
        />
      </Routes>
    </div>
  );
};

export default MainLayout;
