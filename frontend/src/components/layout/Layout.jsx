import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { InstallBanner } from '../ui/InstallBanner';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Navbar />
      <InstallBanner />
      
      {/* 
        Main content wrapper: 
        - pt-20 for desktop (Navbar is fixed)
        - pb-20 for mobile (BottomNav is fixed)
      */}
      <main className="flex-grow pt-4 md:pt-20 pb-20 md:pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};
