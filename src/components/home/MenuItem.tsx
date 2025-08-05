import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import Lottie from 'react-lottie-player';
import play from './play.json';

interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  index: number;  // Added index prop to determine if it's the first item
  disabled?: boolean;
  bg?: false | string;
  text?: false | string;
  border?: false | string;
  animate?: false | string;
  iconColor?: false | string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  onClick,
  index,  
  bg,
  animate,
  border,
  text,
  iconColor,
  icon:Icon,
  disabled = false ,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      className={`relative flex w-full py-4 px-6 rounded-3xl backdrop-blur-sm group
        transform transition-all duration-300    
        ${border || `border-yellow-300 shadow-xl shadow-yellow-600/30 border-2`}
        ${animate}  
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1 hover:translate-x-2'}
        ${isPressed && !disabled ? 'scale-85' : ''}
        ${isHovered && !disabled ? 'animate-smokeRise' : ''}  
      `}
    >
      {/* Show Lottie animation only for the first item */}
      
        {/* Icon */}
        <div
          className={`transform group-hover:scale-110 transition-all duration-300 group-hover:text-black ${iconColor || 'text-fuchsia-500' } z-10`}
        >
        { 
          index === 0 && !disabled ?
          (
            <div className="transform group-hover:scale-110 transition-all duration-300 z-10">
              <Lottie loop animationData={play} play className="w-8 h-8" />
            </div>
          )
          :
          <Icon className="w-6 h-6" />  
        }
      </div>
      {/* Text */}
      <span
        className={`transition-colors duration-300 ${text || `text-yellow-900/70 text-lg font-medium`}
        group-hover:text-white
        z-10 ml-3`}
      >
        {title}
      </span>

      {/* Main button body with gradient */}
      <div
        className={`absolute inset-0 ${bg || `bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 z-0 rounded-3xl`}`}
      ></div>
    </button>
  );
};

export default MenuItem;
