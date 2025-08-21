import React, { useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import TopMenu from './TopMenu';
import SideMenu from './SideMenu';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      try {
        const res = await axios.get('/api/users/me');
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handlePurchase = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <TopMenu user={user} onPurchase={handlePurchase} />
      <div style={{ display: 'flex' }}>
        <SideMenu userType={user.userType} />
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <h2>Dashboard</h2>
          <div>
            <h3>Metrics</h3>
            <p>Published Services: 0</p>
            <p>Service Views: 0</p>
            <p>Purchases: 0</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
