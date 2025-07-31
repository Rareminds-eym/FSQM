import React from 'react';
import Lottie from 'react-lottie-player';  
import winner from './winner.json';
import cracker from './cracker.json';

export const Winner = () => {
  return (
    <div >
      <Lottie 
        loop 
        animationData={winner}  
        play  
        style={{ width: 100, height: 100 }}  
      />
    </div>
  );
};

export const Cracker = () => {
    return (
      <div >
        <Lottie 
          loop 
          animationData={cracker}  
          play  
          className="absolute w-[70%] h-auto top-[50%] left-[15%]  z-[-1] object-cover md:top-[45%] md:left-[0%] md:scale-[300%] md:w-[100%] md:h-[10%] "
        />
      </div>
    );
  };


