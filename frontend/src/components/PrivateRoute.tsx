import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const auth = localStorage.getItem('token'); // check if user is authenticated
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
