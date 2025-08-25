import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import setAuthToken from '../utils/setAuthToken';
import TopMenu from './TopMenu.tsx';
import SideMenu from './SideMenu.tsx';
import { User } from '../types';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      try {
        const res = await api.get<User>('/api/users/me');
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handlePurchase = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Error loading user data. Please try logging in again.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopMenu user={user} onPurchase={handlePurchase} />
      <div className="flex">
        <SideMenu userType={user.userType} />
        <main className="flex-grow p-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700">Your Metrics</h2>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Published Services</dt>
                        <dd className="text-3xl font-semibold text-gray-900">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Service Views</dt>
                        <dd className="text-3xl font-semibold text-gray-900">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Purchases</dt>
                        <dd className="text-3xl font-semibold text-gray-900">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
