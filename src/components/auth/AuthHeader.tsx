import React from 'react';
import AnimatedLogo from '../ui/AnimatedLogo';

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isLogin }) => (
  <>
    <div className="flex justify-center mb-8">
      <AnimatedLogo className="w-40 md:w-60" />
    </div>
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-1
        bg-gradient-to-r from-black via-black/60 to-black
        bg-clip-text text-transparent animate-pulse">
        {isLogin ? 'Welcome Back' : 'Join FSQM'}
      </h2>
      {!isLogin && (
        <p className="text-black/60">
          Start your manufacturing excellence adventure
        </p>
      )}
    </div>
  </>
);

export default AuthHeader;