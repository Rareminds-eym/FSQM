import React from 'react';

interface GlowingTitleProps {
  children: React.ReactNode;
  className?: string;
}

const GlowingTitle: React.FC<GlowingTitleProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="text-2xl md:text-3xl mb-[15%] md:mb-0 font-bold text-transparent bg-clip-text 
        bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800
        relative z-10">
        {children}
      </div>
      
    </div>
  );
};

export default GlowingTitle;