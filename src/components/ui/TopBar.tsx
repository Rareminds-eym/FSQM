import React from 'react';
import ProfileMenu from './ProfileMenu';

const TopBar: React.FC = () => {
  return (
    <div className="fixed top-0 right-0 left-0 z-50
      bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end">
        <ProfileMenu />
      </div>
    </div>
  );
}

export default TopBar;