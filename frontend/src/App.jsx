import React from 'react';
import SignUpPage from './pages/signUpPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div>
      <SignUpPage />
      {/* <LoginPage /> */}
      <Toaster />
    </div>
  );
};

export default App;
