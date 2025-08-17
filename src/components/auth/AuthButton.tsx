import React, { ButtonHTMLAttributes } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLogin: boolean;
  children?: React.ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isLogin, disabled, children, ...props }) => (
  <button
    {...props}
    disabled={disabled}
    className={`w-full py-3 px-4
      text-sm font-medium text-black/70
      bg-gradient-to-b from-red-300 via-red-400 to-red-500 z-0
      shadow-lg shadow-red-300 rounded-3xl border-2 border-red-600
      focus:outline-none
      transform transition-all duration-300
      ${disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:from-yellow-300 hover:to-yellow-200 hover:border-yellow-200 hover:-translate-y-0.5 hover:shadow-xl'
      }`}
  >
    {disabled ? (
      <span className="flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {children ?? (isLogin ? 'Signing In...' : 'Signing Up...')}
      </span>
    ) : (
      children ?? (isLogin ? 'Sign In' : 'Sign Up')
    )}
  </button>
);

export default AuthButton;