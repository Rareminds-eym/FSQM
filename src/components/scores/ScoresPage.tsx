import { Award, Home, Star, Target, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserStats } from "../../composables/gameProgress";
import { supabase } from "../../lib/supabase";
import { PlayerScore } from "../../types/game";
import CircuitLines from "../ui/animations/CircuitLines";
import { motion } from "framer-motion";
import {Winner,Cracker} from "./LottieAnimation";
import AnimatedTitle from "../ui/AnimatedTitle";

interface PlayerProgressScore {
  user_id: string;  
  username: string;
  totalScore: number;
  completedLevels: number;
  averageScore: number;
  averageAccuracy: number;
  totalAccuracy: number;
}

const ScoresPage: React.FC = () => {
  const navigate = useNavigate();
  const [playerScores, setPlayerScores] = useState<PlayerProgressScore[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      // Fetch scores from player_progress table with all required columns
      const { data: progressData, error } = await supabase
        .from("player_progress")
        .select("user_id, score, accuracy, level_id, completed")
        .eq("completed", true); // Only count completed levels

      if (error) {
        console.error("Error fetching player progress:", error);
        return;
      }

      if (!progressData || progressData.length === 0) {
        console.log("No player progress data found");
        setPlayerScores([]);
        return;
      }

      // Group scores by user_id and calculate totals
      const userScores: { [key: string]: { 
        totalScore: number; 
        completedLevels: number; 
        totalAccuracy: number;
        levels: string[];
      } } = {};
      
      progressData.forEach((progress) => {
        const userId = progress.user_id;
        if (!userScores[userId]) {
          userScores[userId] = { 
            totalScore: 0, 
            completedLevels: 0, 
            totalAccuracy: 0,
            levels: []
          };
        }
        userScores[userId].totalScore += progress.score || 0;
        userScores[userId].totalAccuracy += progress.accuracy || 0;
        userScores[userId].completedLevels += 1;
        userScores[userId].levels.push(progress.level_id);
      });

      // Get user details for usernames
      const userIds = Object.keys(userScores);
      const userPromises = userIds.map(async (userId) => {
        // Try to get username from teams table first
        const { data: teamData } = await supabase
          .from("teams")
          .select("full_name")
          .eq("user_id", userId)
          .single();

        // If no team data, try to get email from auth.users (this might need RLS adjustment)
        let username = teamData?.full_name;
        
        if (!username) {
          // Fallback to a generic username
          username = `Player_${userId.slice(0, 8)}`;
        }

        const userScore = userScores[userId];
        return {
          user_id: userId,
          username,
          totalScore: userScore.totalScore,
          completedLevels: userScore.completedLevels,
          averageScore: userScore.totalScore / userScore.completedLevels,
          totalAccuracy: userScore.totalAccuracy,
          averageAccuracy: userScore.totalAccuracy / userScore.completedLevels
        };
      });

      const usersWithScores = await Promise.all(userPromises);

      // Sort by total score - show ALL users, not just top 10
      const allScores = usersWithScores
        .sort((a, b) => b.totalScore - a.totalScore);

      setPlayerScores(allScores);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const listenToLeaderboard = () => {
    // Set up real-time subscription for player_progress
    const channel = supabase
      .channel("player-progress-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_progress",
        },
        () => {
          // Refetch leaderboard when changes occur
          fetchLeaderboard();
        }
      )
      .subscribe();

    // Initial fetch
    fetchLeaderboard();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    // Start listening to the leaderboard
    const unsubscribe = listenToLeaderboard();

    // Cleanup listener when component unmounts
    if (unsubscribe) {
      return () => unsubscribe();
    } else {
      return;
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchScores = async () => {
      if (!userId) return;

      try {
        const data = await fetchUserStats(userId);

        let totalScore = data?.totalScore;
        let totalAccuracy = data?.totalAccuracy;
        let completedLevels = data?.completedLevels;
        if (
          completedLevels != undefined &&
          totalAccuracy != undefined &&
          totalScore != undefined
        )
          setUserStats({
            totalScore,
            averageAccuracy:
              completedLevels > 0 ? totalAccuracy / completedLevels : 0,
            completedLevels,
          });
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, [userId]);

  let topThree = playerScores.slice(0, 3);
  console.log("Top 3:", topThree);

  return (
    <div className="flex-1 p-4 md:p-8 bg-yelloww relative overflow-hidden">
      <CircuitLines />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Home Button */}
        <div className="absolute left-0 top-0">
          <button
            onClick={() => navigate("/")}
            className="group bg-gradient-to-b from-red-200 to-red-300 rounded-full shadow-lg p-4 text-black font-semibold  hover:scale-105 active:scale-95 
              transform hover:-translate-y-1 hover:translate-x-1 border-2 border-red-100
              transition-all duration-300"
          >
            <Home
              className="w-5 h-5 text-red-700 group-hover:text-blue-400 transition-colors duration-300"
            />
          </button>
        </div>

        <div className=" space-y-12 pt-16">
          <div className="text-center mt-11">
          <AnimatedTitle 
              text="PERFORMANCE SCORES" 
              className="text-center"
            />
            <div className="mt-3 text-black text-sm md:text-base">
              Track your progress and compete globally
            </div>
          </div>

          {userStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              <StatCard
                icon={Trophy}
                title="Total Score"
                value={userStats.totalScore.toFixed(2)}
                color="text-red-400"
              />
              <StatCard
                icon={Target}
                title="Average Accuracy"
                value={`${userStats.averageAccuracy.toFixed(1)}%`}
                color="text-emerald-400"
              />
              <StatCard
                icon={Award}
                title="Completed Levels"
                value={userStats.completedLevels}
                color="text-blue-400"
              />
            </div>
          )}

          <div className="w-full rounded-3xl overflow-hidden ">
            <div className="p-0">
              <div className="flex items-end justify-center gap-1 md:gap-4">
                
                {topThree[1] && (
                  <motion.div
                    key="second-place"
                    className="flex flex-col items-center "
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    
                    <div className="text-center mt-2">
                      <h3 className="font-semibold text-sm md:text-xl text-gray-700">{topThree[1].username}</h3>
                      <div className="flex items-center justify-center gap-1">
                        <svg
                          className="h-4 w-4 text-yellow-50"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 12L11 14L15 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        <span className="text-yellow-50 text-xs md:text-xl font-bold">{topThree[1].totalScore}</span>
                      </div>
                    </div>
                    <div className="h-20 w-24 md:h-40 md:w-32 bg-gradient-to-t from-yelloww to-yellow-300 rounded-t-xl mt-4 flex items-center justify-center">
                      <span className="text-3xl md:text-7xl font-bold text-yellow-100">2</span>
                    </div>
                  </motion.div>
                )}

                {topThree[0] && (
                  <motion.div
                    key="first-place"
                    className="flex flex-col items-center overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Winner />
                    <div className="relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      </div>
                      
                    </div>
                    <div className="text-center mt-2">
                      <h3 className="font-semibold text-sm md:text-xl  text-gray-700">{topThree[0].username}</h3>
                      <div className="flex items-center justify-center gap-1">
                        <svg
                          className="h-4 w-4 text-yellow-50"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 12L11 14L15 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        <span className="text-yellow-50 text-xs md:text-xl font-bold">{topThree[0].totalScore}</span>
                      </div>
                    </div>
                    <div className="h-32 w-24 md:h-60 md:w-32 bg-gradient-to-t from-yelloww to-yellow-300 rounded-t-xl mt-4 flex-col flex items-center justify-center">
                      <span className="text-5xl md:text-8xl font-bold text-yellow-50">1</span>
                      <Cracker/>
                    </div>
                  </motion.div>
                )}

                {topThree[2] && (
                  <motion.div
                    key="third-place"
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    
                    <div className="text-center mt-2">
                      <h3 className="font-semibold text-sm md:text-xl text-gray-700">{topThree[2].username}</h3>
                      <div className="flex items-center justify-center gap-1">
                        <svg
                          className="h-4 w-4 text-yellow-50"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 12L11 14L15 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        <span className="text-yellow-50 text-xs md:text-xl font-bold">{topThree[2].totalScore}</span>
                      </div>
                    </div>
                    <div className="h-14 w-24 md:h-32 md:w-32 bg-gradient-to-t from-yelloww to-yellow-300 rounded-t-xl mt-4 flex items-center justify-center">
                      <span className="text-3xl md:text-7xl font-bold text-yellow-100">3</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div
            className="backdrop-blur-sm bg-gray-50 p-3 md:p-6 rounded-3xl border-4 border-gray-200 shadow-xl "
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className=" text-lg md:text-xl font-semibold text-black/60">
                Global Leaderboard (Top 10)
              </h2>
            </div>

            <div className="space-y-4">
              {playerScores.slice(0, 10).map((score, index) => (
                <div
                  key={score.user_id}
                  className="flex items-center justify-between p-4
                    bg-lime-400/20 hover:bg-lime-300/60  border-2 rounded-3xl border-lime-400/60"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm md:text-lg font-bold ${index === 0
                        ? "text-green-600"
                        : index === 1
                          ? "text-yelloww"
                          : index === 2
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                    >
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-black/60 text-xs md:text-lg font-medium">{score.username}</p>
                      <p className="text-xs md:text-sm text-slate-500">
                        Average Score: {score.averageScore.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 text-xs md:text-lg font-bold">
                      {score.totalScore.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {score.completedLevels} levels completed
                    </p>
                  </div>
                </div>
              ))}
              {playerScores.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No scores available yet. Complete some levels to see the leaderboard!</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.FC<any>;
  title: string;
  value: string | number;
  color: string;
}> = ({ icon: Icon, title, value, color }) => (
  <div
    className="backdrop-blur-sm rounded-xl md:rounded-3xl p-3 md:p-6
    bg-yellow-300 hover:bg-yellow-300  border border-white
    transform hover:-translate-y-1 transition-all duration-300 flex md:block justify-between items-center"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="border-2 border-yellow-100  bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300 rounded-xl p-2">
        <Icon className={`w-5 h-5 md:w-7 md:h-7  ${color}`} />
      </div>
      <h3 className="text-lg font-medium text-black/60">{title}</h3>
    </div>
    <p className={`text-lg md:text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default ScoresPage;
