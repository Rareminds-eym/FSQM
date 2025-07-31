import React from 'react';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="group flex items-center space-x-4 p-6 bg-white rounded-lg shadow-lg 
    hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300
    hover:bg-gradient-to-r hover:from-blue-50 hover:to-white"
  >
    <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
      {title}
    </span>
  </button>
);

export default MenuItem;