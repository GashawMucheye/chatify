import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js'; // or useAuthStore if that’s your setup
import LoginPage from '../pages/LoginPage.jsx';
import SignUpPage from '../pages/SignUpPage.jsx';
import PageLoader from './PageLoader.jsx';
import ChatPage from '../pages/ChatPage.jsx';

const MainLayout = () => {
  const { authUser, isCheckingAuth } = useAuth();

  useEffect(() => {
    authUser(); // safely call if exists
  }, [authUser]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className='min-h-screen bg-base-100 text-base-content dark:bg-background-dark relative flex items-center justify-center p-4 overflow-hidden'>
      <Routes>
        <Route
          path='/'
          element={authUser ? <ChatPage /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/login'
          element={!authUser ? <LoginPage /> : <Navigate to='/' replace />}
        />
        <Route
          path='/signup'
          element={!authUser ? <SignUpPage /> : <Navigate to='/' replace />}
        />
      </Routes>
    </div>
  );
};

export default MainLayout;
onabort;
