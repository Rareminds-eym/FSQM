import React from 'react';

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, onToggle }) => (
  <button
    onClick={onToggle}
    className="text-sm text-black/60 hover:text-blue-600
      transition-colors duration-300"
  >
    {isLogin ? <p>Don't have an account? <strong> Sign up </strong></p> : <p>Already have an account? <strong>Sign in</strong></p>}
  </button>
);

export default AuthToggle;