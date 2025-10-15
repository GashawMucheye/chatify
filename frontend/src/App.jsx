import React from 'react';

import { Toaster } from 'react-hot-toast';
import MainLayout from './components/MainLayout';

const App = () => {
  return (
    <div>
      <MainLayout />
      <Toaster />
    </div>
  );
};

export default App;
