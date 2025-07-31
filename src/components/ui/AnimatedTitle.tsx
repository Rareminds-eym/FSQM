import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  text: string;
  className?: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text, className = '' }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      className={`relative ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-center space-x-1">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={child}
            className="text-4xl font-bold inline-block"
          >
            <span className="bg-black/70
              bg-clip-text text-transparent">
              {letter === " " ? "\u00A0" : letter}
            </span>
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0 blur-xl bg-gradient-to-r 
        from-blue-400/30 via-emerald-300/30 to-blue-400/30 
        animate-pulse -z-10" />
    </motion.div>
  );
};

export default AnimatedTitle;