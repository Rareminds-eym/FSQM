import React from 'react';
import AnimatedLogo from '../ui/AnimatedLogo';

interface AuthHeaderProps {
  isLogin: boolean;
  isResetPassword?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isLogin, isResetPassword = false }) => (
  <>
    <div className="flex justify-center mb-8">
      <AnimatedLogo className="w-40 md:w-60" />
    </div>
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-1
        bg-gradient-to-r from-black via-black/60 to-black
        bg-clip-text text-transparent animate-pulse">
        {isResetPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Join SafeBite 2.0 Hackathon'}
      </h2>
      {!isLogin && !isResetPassword && (
        <p className="text-black/60">
        
        </p>
      )}
      {isResetPassword && (
        <p className="text-black/60">
          Enter your email to receive a password reset link
        </p>
      )}
    </div>
  </>
);

export default AuthHeader;