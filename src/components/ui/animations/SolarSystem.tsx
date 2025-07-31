import React from 'react';

interface SolarSystemProps {
  className?: string;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Sun */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-emerald-400 
          rounded-full animate-pulse shadow-lg shadow-blue-500/50">
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-blue-500/20 
            rounded-full animate-pulse" />
        </div>
      </div>

      {/* Orbits */}
      {[1, 2, 3].map((orbit) => (
        <div
          key={orbit}
          className="absolute inset-0 animate-spin"
          style={{
            animation: `spin ${orbit * 8}s linear infinite`,
            transformOrigin: 'center center',
          }}
        >
          {/* Orbit Path */}
          <div 
            className="absolute rounded-full border border-blue-500/20"
            style={{
              width: `${orbit * 100}%`,
              height: `${orbit * 100}%`,
              left: `${50 - (orbit * 50)}%`,
              top: `${50 - (orbit * 50)}%`,
            }}
          />
          
          {/* Planet */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-blue-500
              shadow-lg shadow-blue-500/30"
            style={{
              width: `${20 - orbit * 4}px`,
              height: `${20 - orbit * 4}px`,
              left: `calc(50% - ${(20 - orbit * 4) / 2}px)`,
              top: `${orbit * 50}%`,
              transform: 'translateY(-50%)',
            }}
          >
            {/* Planet Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-blue-400/30 
              rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SolarSystem;