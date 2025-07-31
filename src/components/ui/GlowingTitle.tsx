import React from 'react';

interface GlowingTitleProps {
  children: React.ReactNode;
  className?: string;
}

const GlowingTitle: React.FC<GlowingTitleProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <h1 className="text-2xl md:text-3xl mb-[15%] md:mb-0 font-bold text-transparent bg-clip-text 
        bg-gradient-to-r from-black via-black to-black
        relative z-10">
        {children}
      </h1>
      
    </div>
  );
};

export default GlowingTitle;