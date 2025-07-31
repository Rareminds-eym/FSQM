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
  signUp: (
    email: string,
    password: string,
    fullName: string,
    extraFields?: SignupExtraFields
  ) => Promise<{ error: AuthError | null; user?: any }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting initial session:', error)
        } else {
          console.log('✅ Initial session:', session ? 'Found' : 'None');
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('❌ Exception getting initial session:', error);
      } finally {
        setLoading(false)
      }
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
          emailConfirmed: data.user?.email_confirmed_at ? 'Yes' : 'No',
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
            const waitTime = Math.pow(2, retryCount) * 1000;
            console.log(`⏳ Rate limited. Retrying in ${waitTime/1000} seconds... (attempt ${retryCount}/${maxRetries})`);

            await new Promise(resolve => setTimeout(resolve, waitTime));
            return attemptSignUp();
          } else {
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
        emailConfirmed: data.user?.email_confirmed_at ? 'Yes' : 'No',
        lastSignIn: data.user?.last_sign_in_at,
        session: data.session?.access_token ? 'present' : 'missing',
        error: error ? {
          message: error.message,
          status: (error as any).status,
          code: (error as any).code
        } : null
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: { ...error, message: 'Invalid email or password. Please check your credentials and try again.' } as AuthError };
        } else if (error.message.includes('Email not confirmed')) {
          return { error: { ...error, message: 'Please check your email and click the confirmation link before signing in.' } as AuthError };
        } else if (error.message.includes('Too many requests')) {
          return { error: { ...error, message: 'Too many sign-in attempts. Please wait a few minutes before trying again.' } as AuthError };
        } else if (error.message.includes('signup_disabled')) {
          return { error: { ...error, message: 'Account signup is currently disabled. Please contact support.' } as AuthError };
        }
      } else if (data.user) {
        console.log('✅ Sign in successful for user:', data.user.id);
        
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          console.warn('⚠️ User email not confirmed yet');
          return { error: { message: 'Please check your email and click the confirmation link to complete your account setup.' } as AuthError };
        }
        
        // Additional session verification
        if (data.session) {
          console.log('✅ Session established successfully');
        } else {
          console.warn('⚠️ No session created despite successful authentication');
        }
      }

      return { error }
    } catch (error: any) {
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
        // Clear local state
        setUser(null);
        setSession(null);
        localStorage.removeItem("authToken");
      }
      
      return { error }
    } catch (error) {
      console.error('❌ Sign out exception:', error);
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    console.log('🚪 Logging out (local)...');
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

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}