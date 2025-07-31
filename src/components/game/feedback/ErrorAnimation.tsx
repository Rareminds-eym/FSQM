import React from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const ErrorAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0]
          }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-full bg-red-500/20 backdrop-blur-sm
            border border-red-500/30 shadow-lg shadow-red-500/20"
        >
          <XCircle className="w-16 h-16 text-red-500" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorAnimation;