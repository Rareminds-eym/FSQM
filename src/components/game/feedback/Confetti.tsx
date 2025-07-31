import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  count?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ count = 50 }) => {
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    rotation: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const colors = ['#60A5FA', '#34D399', '#FBBF24', '#EC4899'];
    const newParticles = Array.from({ length: count }, () => ({
      x: 50 + (Math.random() - 0.5) * 60, // Center horizontally with spread
      y: 50 + (Math.random() - 0.5) * 60, // Center vertically with spread
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            rotate: particle.rotation,
            scale: 0
          }}
          animate={{
            y: '120%',
            scale: 1,
            rotate: particle.rotation + Math.random() * 720
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="absolute w-3 h-3"
          style={{
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;