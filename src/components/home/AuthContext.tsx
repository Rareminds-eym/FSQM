import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

interface SignupExtraFields {
  phone: string;
  teamName: string;
  collegeCode: string;
  teamLead: string;
  teamMembers: string[];
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (
    email: string,
    password: string,
    fullName: string,
    extraFields?: SignupExtraFields
  ) => Promise<{ error: AuthError | null; user?: any }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Calculate isAuthenticated based on user and session
  const isAuthenticated = !!(user && session)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('🔍 Getting initial session...');
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('❌ Error getting session:', error)
      } else {
        console.log('✅ Initial session:', session ? 'Found' : 'None');
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session ? 'Session present' : 'No session');
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Log authentication state changes for debugging
  useEffect(() => {
    console.log('🔐 Auth state update:', {
      user: user?.id || 'None',
      session: session ? 'Present' : 'None',
      isAuthenticated,
      loading
    });
  }, [user, session, isAuthenticated, loading]);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    extraFields?: SignupExtraFields
  ) => {
    const maxRetries = 3;
    let retryCount = 0;

    const attemptSignUp = async (): Promise<{ error: AuthError | null; user?: any }> => {
      try {
        console.log('🚀 Attempting signup with:', { email, fullName });

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              ...(extraFields ? {
                phone: extraFields.phone,
                team_name: extraFields.teamName,
                college_code: extraFields.collegeCode,
                team_lead: extraFields.teamLead,
                team_members: extraFields.teamMembers,
                join_code: (extraFields as any).joinCode,
              } : {})
            }
          }
        })

        console.log('📝 Signup response:', {
          user: data.user?.id,
          userEmail: data.user?.email,
          session: data.session?.access_token ? 'present' : 'missing',
          error: error ? {
            message: error.message,
            status: (error as any).status,
            code: (error as any).code
          } : null
        });

        if (error) {
          console.error('❌ Signup error details:', error);
        }

        return { error, user: data.user }
      } catch (error: any) {
        // Check if it's a rate limiting error
        if (error.message?.includes('429') || error.message?.includes('Too Many Requests') ||
            error.status === 429) {
          if (retryCount < maxRetries) {
            retryCount++;
            // Exponential backoff: wait 2^retryCount seconds
            const waitTime = Math.pow(2, retryCount) * 1000;
            console.log(`⏳ Rate limited. Retrying in ${waitTime/1000} seconds... (attempt ${retryCount}/${maxRetries})`);

            await new Promise(resolve => setTimeout(resolve, waitTime));
            return attemptSignUp();
          } else {
            // Create a custom error message for rate limiting
            const rateLimitError = {
              message: 'Too many signup attempts. Please wait a few minutes before trying again.',
              status: 429
            } as AuthError;
            return { error: rateLimitError };
          }
        }
        return { error: error as AuthError }
      }
    };

    try {
      setLoading(true)
      return await attemptSignUp();
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log('🔐 Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('📝 Sign in response:', {
        user: data.user?.id,
        userEmail: data.user?.email,
        session: data.session?.access_token ? 'present' : 'missing',
        error: error ? {
          message: error.message,
          status: (error as any).status,
          code: (error as any).code
        } : null
      });

      if (error) {
        console.error('❌ Sign in error:', error);
      } else if (data.user && data.session) {
        console.log('✅ Sign in successful - auth state will update automatically');
      }

      return { error }
    } catch (error) {
      console.error('❌ Sign in exception:', error);
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('🚪 Signing out...');
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ Sign out successful');
      }
      
      return { error }
    } catch (error) {
      console.error('❌ Sign out exception:', error);
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  // Add logout function for UI usage
  const logout = () => {
    console.log('🚪 Logging out...');
    signOut();
    localStorage.removeItem("authToken");
    setUser(null);
    setSession(null);
  }

  const resetPassword = async (email: string) => {
    try {
      console.log('🔄 Requesting password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        console.error('❌ Password reset error:', error);
      } else {
        console.log('✅ Password reset email sent');
      }
      
      return { error }
    } catch (error) {
      console.error('❌ Password reset exception:', error);
      return { error: error as AuthError }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      console.log('🔄 Updating password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        console.error('❌ Password update error:', error);
      } else {
        console.log('✅ Password updated successfully');
      }
      
      return { error }
    } catch (error) {
      console.error('❌ Password update exception:', error);
      return { error: error as AuthError }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}