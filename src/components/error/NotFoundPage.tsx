import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import CircuitLines from '../ui/animations/CircuitLines';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-950 to-slate-900 p-8 relative overflow-hidden">
      <CircuitLines />
      
      <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="p-6 rounded-full bg-red-500/20 animate-pulse">
            <AlertCircle className="w-16 h-16 text-red-400" />
          </div>
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-400 
          bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="text-2xl text-slate-300 mb-8">
          Oops! The battery seems to be disconnected.
        </p>
        <p className="text-slate-400 mb-12 max-w-md">
          The page you're looking for might have been moved, deleted, 
          or never existed in the first place.
        </p>

        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r 
            from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
            text-white rounded-lg font-medium transform hover:scale-105 
            transition-all duration-300 group"
        >
          <Home className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-300" />
          <span>Return Home</span>
        </button>

        {/* Circuit Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-400 rounded-full animate-ping"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;