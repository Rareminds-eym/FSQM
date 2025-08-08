import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../home/AuthContext';
import InputField from '../ui/InputField';
import AuthButton from '../auth/AuthButton';
import CircuitLines from '../ui/animations/CircuitLines';
import AnimatedLogo from '../ui/AnimatedLogo';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updatePassword, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check both hash fragment and query parameters for production compatibility
    const hash = window.location.hash.substring(1);
    const search = window.location.search.substring(1);
    
    // Try hash first (local), then query parameters (production)
    let urlParams = new URLSearchParams(hash);
    if (!urlParams.get('type') && search) {
      urlParams = new URLSearchParams(search);
    }
    
    const type = urlParams.get('type');
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    // Enhanced logging for production debugging
    console.log('Reset password page loaded:', {
      type,
      isAuthenticated,
      hasUser: !!user,
      hash,
      search,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      fullUrl: window.location.href,
      environment: process.env.NODE_ENV || 'development'
    });

    // Give some time for auth state to settle
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
      
      // More robust check for valid reset link
      const isValidResetLink = type === 'recovery' || (accessToken && refreshToken);
      
      // If this is not a valid reset link and user is not authenticated after auth settled
      if (!isValidResetLink && !isAuthenticated) {
        console.warn('Invalid reset link detected:', { type, hasTokens: !!(accessToken && refreshToken), isAuthenticated });
        toast.error('Invalid or expired reset link');
        setTimeout(() => navigate('/'), 3000);
      }
    }, 2000); // Wait 2 seconds for auth state to settle

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigate]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password updated successfully! Please sign in with your new password.');
      
      // Sign out the user and redirect to login page
      await signOut();
      setTimeout(() => navigate('/'), 2000);
      
    } catch (error: any) {
      toast.error('An error occurred while updating your password');
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth state - matching Auth component style
  if (isCheckingAuth) {
    return (
      <div
        className="flex-1 bg-yelloww
        flex flex-col items-center justify-center p-4 relative overflow-visible"
      >
        <CircuitLines />
      
        <div className="flex justify-center items-center">
          <img
            src="images/RareMinds-Logo.png"
            alt="Rareminds"
            className="w-44 mt-0 md:w-64 md:mt-10"
          />
        </div>
        
        <div className="bg-gradient-to-b from-yellow-200/85 to-yellow-300 rounded-[2rem] shadow-lg border-4 border-yellow-200 p-6 relative mt-0 md:mt-10 w-full max-w-md">
          <div className="flex justify-center mb-8">
            <AnimatedLogo className="w-40 md:w-60" />
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-black via-black/60 to-black bg-clip-text text-transparent animate-pulse">
              Verifying Reset Link
            </h2>
            <p className="text-black/60 mb-6">Please wait while we validate your password reset link...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black/60"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if not authenticated or invalid link - matching Auth component style
  if (!isAuthenticated || !user) {
    return (
      <div
        className="flex-1 bg-yelloww
        flex flex-col items-center justify-center p-4 relative overflow-visible"
      >
        <CircuitLines />
        
        <div className="flex justify-center items-center">
          <img
            src="images/RareMinds-Logo.png"
            alt="Rareminds"
            className="w-44 mt-0 md:w-64 md:mt-10"
          />
        </div>
        
        <div className="bg-gradient-to-b from-yellow-200/85 to-yellow-300 rounded-[2rem] shadow-lg border-4 border-yellow-200 p-6 relative mt-0 md:mt-10 w-full max-w-md">
          <div className="flex justify-center mb-8">
            <AnimatedLogo className="w-40 md:w-60" />
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-black via-black/60 to-black bg-clip-text text-transparent animate-pulse">
              Invalid Reset Link
            </h2>
            <p className="text-black/60 mb-4">This password reset link is invalid or has expired.</p>
            <p className="text-black/60">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 bg-yelloww
      flex flex-col items-center justify-center p-4 relative overflow-visible"
    >
      <CircuitLines />
    
      <div className="flex justify-center items-center">
        <img
          src="images/RareMinds-Logo.png"
          alt="Rareminds"
          className="w-44 mt-0 md:w-64 md:mt-10"
        />
      </div>

      <div className="bg-gradient-to-b from-yellow-200/85 to-yellow-300 rounded-[2rem] shadow-lg border-4 border-yellow-200 p-6 relative mt-0 md:mt-10 w-full max-w-md">
        {/* Header with AnimatedLogo - matching AuthHeader */}
        <div className="flex justify-center mb-8">
          <AnimatedLogo className="w-40 md:w-60" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-1 bg-gradient-to-r from-black via-black/60 to-black bg-clip-text text-transparent animate-pulse">
            Reset Password
          </h2>
          <p className="text-black/60">
            Enter your new password for: <strong>{user.email}</strong>
          </p>
        </div>

        {/* Password Reset Form - matching login form structure */}
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <InputField
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <AuthButton type="submit" isLogin={false} disabled={loading}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </AuthButton>
        </form>

        {/* Back to Login link - matching AuthForm style */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
