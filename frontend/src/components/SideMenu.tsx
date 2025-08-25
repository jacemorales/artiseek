import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface SideMenuProps {
  userType: User['userType'];
}

const SideMenu: React.FC<SideMenuProps> = ({ userType }) => {
  const linkClass = "block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-500 hover:text-white";

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <nav>
        <ul>
          <li><Link to="/profile" className={linkClass}>Profile</Link></li>
          <li><Link to="/settings" className={linkClass}>Settings</Link></li>
          {userType === 'Freelancer' ? (
            <li><Link to="/my-services" className={linkClass}>Services & Projects</Link></li>
          ) : (
            <li><Link to="/my-projects" className={linkClass}>Projects</Link></li>
          )}
          <li><Link to="/companies" className={linkClass}>Companies</Link></li>
          <li><Link to="/friends" className={linkClass}>Friends</Link></li>
          <li><Link to="/artipoints" className={linkClass}>Artipoints</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;
