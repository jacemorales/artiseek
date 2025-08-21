import React from 'react';
import { Link } from 'react-router-dom';

const SideMenu = ({ userType }) => {
  return (
    <aside>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        {userType === 'Freelancer' ? (
          <li><Link to="/my-services">Services and Projects</Link></li>
        ) : (
          <li><Link to="/my-projects">Projects</Link></li>
        )}
        <li><Link to="/companies">Companies</Link></li>
        <li><Link to="/friends">Friends</Link></li>
        <li><Link to="/artipoints">Artipoints</Link></li>
      </ul>
    </aside>
  );
};

export default SideMenu;
