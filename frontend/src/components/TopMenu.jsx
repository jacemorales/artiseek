import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PurchasePointsDialog from './PurchasePointsDialog';

const TopMenu = ({ user, onPurchase }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <nav>
        <div>
          <Link to="/">Artiseek</Link>
        </div>
        <div>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <div>
            <span>{user ? user.firstName : 'User'}</span>
            <button onClick={handleOpenDialog}>
              Artipoints: {user ? user.artipoints : 0}
            </button>
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
