import React from 'react';
import Header from './Header';
import AlertToast from './AlertToast';
import { Outlet } from 'react-router-dom';
import { useMarketData } from '../hooks/useMarketData';

const Dashboard: React.FC = () => {
  useMarketData(); // Initialize websocket and data hooks

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden relative transition-colors duration-300">
      <Header />
      
      {/* Application Router / View Controller */}
      <Outlet />

      {/* Price Alert Toast Notifications */}
      <AlertToast />
    </div>
  );
};

export default Dashboard;

