import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PurchasePointsDialog from './PurchasePointsDialog.tsx';
import { User } from '../types';

interface TopMenuProps {
  user: User;
  onPurchase: (updatedUser: User) => void;
}

const TopMenu: React.FC<TopMenuProps> = ({ user, onPurchase }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600">Artiseek</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Home</Link>
                <Link to="/services" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Services</Link>
                <Link to="/about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">About</Link>
                <Link to="/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Contact</Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-sm font-medium text-gray-700 mr-2">Welcome, {user ? user.firstName : 'User'}</span>
                <button onClick={handleOpenDialog} className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700">
                  <span>Artipoints: {user ? user.artipoints : 0}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {isDialogOpen && (
        <PurchasePointsDialog
          user={user}
          onClose={handleCloseDialog}
          onPurchase={onPurchase}
        />
      )}
    </>
  );
};

export default TopMenu;
