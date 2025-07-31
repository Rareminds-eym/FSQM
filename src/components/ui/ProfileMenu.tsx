import { LogOut, User } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../home/AuthContext';

const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;
  console.log(user);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)} // Toggle the state on button click
        className="flex items-center gap-2 px-3 py-2 
        bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 z-0 rounded-2xl
         font-semibold  hover:scale-105 active:scale-95 
        border-yellow-300 shadow-xl shadow-yellow-600/30 border-2
          transition-all duration-300 group min-w-[120px]"
      >
        <User className="w-5 h-5 text-fuchsia-500 group-hover:text-black
          transition-colors duration-300" />
        <span className="text-yellow-900/70 text-lg font-medium group-hover:text-white
          transition-colors duration-300">
          {user.username}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2
          bg-gradient-to-b from-red-300 via-red-400 to-red-500  
          backdrop-blur-sm rounded-2xl border-2 border-red-200
          shadow-xl overflow-hidden z-50  w-[150%]">
          <button
            onClick={() => {
              setIsOpen(false); // Close the menu after logging out
              logout();
            }}
            className="w-full flex items-center gap-2 px-4 py-3
              text-white hover:text-black  hover:bg-red-400/60
              transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
