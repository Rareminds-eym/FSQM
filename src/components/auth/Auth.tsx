import React, { useState } from "react";
import { useAuth } from "../../components/home/AuthContext";
import { FormData } from "../../types/auth";
import { createTeam, joinTeam } from "../../services/teamsService";
import { supabase } from "../../lib/supabase";
import { toast } from "react-toastify";
import CircuitLines from "../ui/animations/CircuitLines";
import AuthForm from "./AuthForm";
import AuthHeader from "./AuthHeader";
import AuthToggle from "./AuthToggle";
import { testSupabaseConnection, testTeamInsertion, checkDatabaseSetup, testAuthSettings, debugFormSubmission } from "../../utils/debugSupabase";
import { runDatabaseTests, quickTeamCreationTest } from "../../utils/testDatabaseFix";
import { signupRateLimiter } from "../../utils/rateLimiter";
import RateLimitMessage from "../ui/RateLimitMessage";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ blocked: boolean; remainingTime: number } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    phone: "",
    teamName: "",
    collegeCode: "",
    isTeamLeader: null,
    joinCode: "",
  });
  const { signIn, signUp, resetPassword, updatePassword, loading } = useAuth();

  const handleRateLimitExpired = () => {
    setRateLimitInfo(null);
  };

  const handleTestRateLimit = () => {
    // Simulate rate limiting for testing
    setRateLimitInfo({
      blocked: true,
      remainingTime: 30000 // 30 seconds for testing
    });
    toast.error("Rate limiting test activated - 30 second countdown");
  };

  const handleCheckDatabase = async () => {
    console.log('Checking database setup...');
    const result = await checkDatabaseSetup();
    console.log('Database setup results:', result);

    const missingTables = Object.entries(result.tablesExist)
      .filter(([_, exists]) => !exists)
      .map(([table, _]) => table);

    if (missingTables.length === 0) {
      toast.success('All database tables exist and are accessible!');
    } else {
      toast.error(`Missing tables: ${missingTables.join(', ')}. Please run the SQL setup script.`);
    }
  };

  const handleTestAuth = async () => {
    console.log('Testing auth settings...');
    const result = await testAuthSettings();
    console.log('Auth settings results:', result);

    if (result.apiConnectivity && result.authEndpoint) {
      toast.success('Supabase auth is properly configured!');
    } else {
      toast.error('Supabase auth configuration issues detected. Check console for details.');
    }
  };

  const handleDebugTest = async () => {
    console.log('Running Supabase debug tests...');
    const result = await testSupabaseConnection();
    console.log('Debug test results:', result);

    if (result.user) {
      // Test a sample team insertion
      const testData = {
        user_id: result.user,
        email: 'test@example.com',
        phone: '+1234567890',
        full_name: 'Test User',
        team_name: 'Test Team',
        college_code: 'TEST123',
        is_team_leader: true,
        join_code: 'TEST01',
        session_id: 'test_session_123',
        created_at: new Date().toISOString(),
      };

      const insertResult = await testTeamInsertion(testData);
      console.log('Insert test result:', insertResult);

      if (insertResult.success) {
        toast.success('Debug test passed! Database is working.');
      } else {
        toast.error(`Debug test failed: ${(insertResult.error as any)?.message || 'Unknown error'}`);
      }
    } else {
      toast.error('No authenticated user for testing');
    }
  };

  const handleDebugFormSubmission = async () => {
    console.log('Starting comprehensive form submission debug...');
    toast.info('Running debug tests... Check console for details');
    const result = await debugFormSubmission(formData);

    if (result.step4_team_insertion) {
      toast.success('✅ All debug tests passed! Form submission should work.');
    } else {
      const failedStep = result.step1_connection ?
        (result.step2_auth ?
          (result.step3_user_creation ? 'Team Insertion' : 'User Creation')
          : 'Authentication')
        : 'Connection';
      toast.error(`❌ Debug failed at: ${failedStep}. Check console for details.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (isResetPassword) {
        // Handle password reset
        if (!formData.email) {
          toast.error("Please enter your email address");
          return;
        }
        
        const { error } = await resetPassword(formData.email);
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Password reset email sent! Check your inbox.");
        setIsResetPassword(false);
        setIsLogin(true);
      } else if (isLogin) {
        // Handle login
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Login successful!");
      } else {
        // Handle signup validation
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        if (!formData.fullName || !formData.email || !formData.phone) {
          toast.error("Please fill in all required fields");
          return;
        }

        if (formData.isTeamLeader === null) {
          toast.error("Please specify if you are a team leader");
          return;
        }

        if (formData.isTeamLeader && (!formData.teamName || !formData.collegeCode)) {
          toast.error("Team leaders must provide team name and college code");
          return;
        }

        if (!formData.isTeamLeader && !formData.joinCode) {
          toast.error("Team members must provide a join code");
          return;
        }

        // Add rate limiting protection
        const rateLimitCheck = signupRateLimiter.canAttempt(formData.email);
        if (!rateLimitCheck.allowed) {
          setRateLimitInfo({
            blocked: true,
            remainingTime: rateLimitCheck.remainingTime || 120000 // fallback to 2 minutes
          });
          toast.error(rateLimitCheck.message || "Too many signup attempts. Please wait before trying again.");
          return;
        }

        // Record this attempt
        signupRateLimiter.recordAttempt(formData.email);

        // Create the user account with additional metadata
        const { error: signUpError, user: signUpUser } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          {
            phone: formData.phone,
            teamName: formData.teamName,
            collegeCode: formData.collegeCode,
            teamLead: formData.isTeamLeader ? formData.fullName : '',
            teamMembers: [],
          }
        );

        if (signUpError) {
          // Handle specific rate limiting error
          if (signUpError.message.includes('429') || signUpError.message.includes('Too Many Requests') ||
              (signUpError as any).status === 429) {
            toast.error("Too many signup attempts. Please wait a few minutes before trying again.", {
              autoClose: 8000,
            });
          } else {
            toast.error(signUpError.message);
          }
          return;
        }

        // Clear rate limiter on successful signup
        signupRateLimiter.reset(formData.email);
        setRateLimitInfo(null);

        // Get user information with improved error handling
        let user = signUpUser;
        let retries = 0;
        const maxRetries = 5;

        console.log('Attempting to get user after signup...');
        console.log('User from signup response:', signUpUser?.id);

        // Enhanced user retrieval with better session handling
        if (!user) {
          while (!user && retries < maxRetries) {
            const waitTime = Math.min(1000 * Math.pow(1.5, retries), 3000);
            console.log(`Waiting ${waitTime}ms before retry ${retries + 1}...`);
            
            await new Promise(resolve => setTimeout(resolve, waitTime));

            try {
              // Try to get user from current session
              const { data: { user: sessionUser }, error: sessionError } = await supabase.auth.getUser();
              
              if (sessionUser && !sessionError) {
                user = sessionUser;
                console.log('Got user from session:', user.id);
                break;
              }

              // If session method fails, try getting session directly
              const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
              if (session?.user && !getSessionError) {
                user = session.user;
                console.log('Got user from direct session:', user.id);
                break;
              }

              console.log(`Retry ${retries + 1} failed:`, { sessionError, getSessionError });
            } catch (error) {
              console.error('Error in user retrieval:', error);
            }

            retries++;
          }
        }

        if (!user) {
          console.error('Failed to get user after', maxRetries, 'attempts');
          toast.error(
            "Account created successfully! Please log in with your credentials to complete the team setup.",
            { autoClose: 8000 }
          );
          
          // Switch to login mode and pre-fill email
          setIsLogin(true);
          setFormData(prev => ({
            ...prev,
            password: "",
            confirmPassword: "",
            fullName: "",
            phone: "",
            teamName: "",
            collegeCode: "",
            isTeamLeader: null,
            joinCode: "",
          }));
          return;
        }

        console.log('Successfully got user:', user.id);

        // Verify database connectivity and user permissions
        try {
          // Test if we can read from teams table
          const { data: testRead, error: readError } = await supabase
            .from('teams')
            .select('id')
            .limit(1);

          if (readError) {
            console.error('Database read test failed:', readError);
            throw new Error(`Database access issue: ${readError.message}`);
          }

          // Test if we can perform an insert operation (dry run)
          console.log('Database connectivity verified');
        } catch (dbError: any) {
          console.error('Database test error:', dbError);
          toast.error(`Database issue: ${dbError.message}. Please contact support.`);
          return;
        }

        // Then handle team creation or joining
        if (formData.isTeamLeader) {
          // Create new team
          try {
            console.log('Creating team for user:', user.id);

            const teamData = {
              email: formData.email,
              phone: formData.phone,
              fullName: formData.fullName,
              teamName: formData.teamName,
              collegeCode: formData.collegeCode,
              isTeamLeader: true,
              userId: user.id,
            };

            console.log('Team data to create:', teamData);

            const { joinCode } = await createTeam(teamData);

            console.log('Team created successfully with join code:', joinCode);

            // Show join code prominently
            toast.success(
              `Team created successfully!\n\nYour Join Code: ${joinCode}\n\nShare this code with your team members!`,
              {
                autoClose: false, // Don't auto-close
                closeOnClick: false,
                draggable: false,
              }
            );
          } catch (teamError: any) {
            console.error('Team creation error:', teamError);

            // Provide more specific error messages
            if (teamError.message?.includes('not authenticated')) {
              toast.error("Authentication issue detected. Please try logging in with your credentials to complete team setup.");
            } else if (teamError.message?.includes('already belongs to a team')) {
              toast.error("You already belong to a team. Please contact support if this is incorrect.");
            } else if (teamError.message?.includes('permission denied')) {
              toast.error("Database permission error. Please contact support.");
            } else {
              toast.error(`Team creation failed: ${teamError.message}`);
            }
          }
        } else if (formData.joinCode) {
          // Join existing team
          try {
            const teamData = {
              email: formData.email,
              phone: formData.phone,
              fullName: formData.fullName,
              teamName: '', // Will be filled from existing team
              collegeCode: '', // Will be filled from existing team
              isTeamLeader: false,
              userId: user.id,
            };

            await joinTeam(teamData, formData.joinCode);
            toast.success("Successfully joined the team!");
          } catch (teamError: any) {
            console.error('Team join error:', teamError);
            toast.error(`Failed to join team: ${teamError.message}`);
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex-1 bg-yelloww
      flex flex-col items-center justify-center p-4 relative overflow-visible"
    >
      <CircuitLines />
    
      {/* <div className="flex justify-center items-center gap-4">
        <img
          src="images/naan-mudhalvan.png"
          alt="Rareminds"
          className="w-24 mt-0 md:w-64 md:mt-10"
        />
        <div className="flex items-center justify-center self-center mt-0 md:mt-10">
          <span className="text-2xl md:text-6xl font-bold text-black mx-4 ">×</span>
        </div>
        <img
          src="images/RareMinds-Logo.png"
          alt="RareMinds Logo"
          className="w-24 md:w-64 md:mt-10"
        />
      </div> */}

      <div
        className={`bg-gradient-to-b from-yellow-200/85 to-yellow-300 rounded-[2rem] shadow-lg
        border-4 border-yellow-200 p-6 relative mt-0 md:mt-10 w-full ${
          isLogin ? 'max-w-md' : 'max-w-5xl'
        }`}
      >
        <AuthHeader isLogin={isLogin} isResetPassword={isResetPassword} />
        <AuthForm
          isLogin={isLogin}
          isResetPassword={isResetPassword}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          loading={loading || isSubmitting}
          onShowResetPassword={() => setIsResetPassword(true)}
          onBackToLogin={() => {
            setIsResetPassword(false);
            setIsLogin(true);
          }}
        />

        {/* Rate Limit Message */}
        {rateLimitInfo?.blocked && (
          <RateLimitMessage
            remainingTime={rateLimitInfo.remainingTime}
            onExpired={handleRateLimitExpired}
          />
        )}

        <div className="mt-6 text-center">
          {!isResetPassword && (
            <AuthToggle isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
          )}

          {/* Debug buttons - remove these in production */}
          {/* <div className="flex gap-1 justify-center flex-wrap">
            <button
              type="button"
              onClick={handleDebugTest}
              className="mt-4 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            >
              Debug Connection
            </button>
            <button
              type="button"
              onClick={handleCheckDatabase}
              className="mt-4 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
            >
              Check Database
            </button>
            <button
              type="button"
              onClick={handleTestAuth}
              className="mt-4 px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
            >
              Test Auth
            </button>
            <button
              type="button"
              onClick={handleTestRateLimit}
              className="mt-4 px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-xs"
            >
              Test Rate Limiting
            </button>
            <button
              type="button"
              onClick={handleDebugFormSubmission}
              className="mt-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
            >
              Debug Form Submit
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Auth;
