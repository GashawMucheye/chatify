import React from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import SignUpPage from '../pages/SignUpPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ChatPage from '../pages/ChatPage.jsx';
import PageLoader from './PageLoader.jsx';
// FIX 1: Update the import path for the Zustand store
import { useAuthStore } from '../hooks/useAuthStore.js';

const MainLayout = () => {
  // FIX 2: Destructure necessary state and actions from the hook
  const { isCheckingAuth, authUser } = useAuthStore(); // Use the cleanup function pattern for useEffect dependencies from Zustand

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
      <Routes>
        <Route
          path='/'
          element={authUser ? <ChatPage /> : <Navigate to={'/login'} />}
        />

        <Route
          path='/login'
          element={!authUser ? <LoginPage /> : <Navigate to={'/'} />}
        />

        <Route
          path='/signup'
          element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />}
        />
      </Routes>
    </div>
  );
};

export default MainLayout;
