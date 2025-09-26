import React, { useState } from 'react';
import axios from 'axios';

const PurchasePointsDialog = ({ user, onClose, onPurchase }) => {
  const [pointsToBuy, setPointsToBuy] = useState(0);

  const handlePurchase = async () => {
    try {
      const res = await axios.post('/api/artipoints/purchase', { points: pointsToBuy });
      onPurchase(res.data);
      onClose();
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>Purchase Artipoints</h2>
        <p>1 point = 10 naira</p>
        <div>
          <h3>Client Options</h3>
          <button onClick={() => setPointsToBuy(300)}>300 points (3000 naira)</button>
        </div>
        <div>
          <h3>Freelancer Options</h3>
          <button onClick={() => setPointsToBuy(200)}>200 points (2000 naira)</button>
        </div>
        {pointsToBuy > 0 && (
          <div>
            <p>You are about to buy {pointsToBuy} points.</p>
            <button onClick={handlePurchase}>Buy Now</button>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PurchasePointsDialog;
