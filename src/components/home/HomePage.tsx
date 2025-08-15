import { BookOpen, FastForward, Play, Settings, Trophy, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkGameProgress,
  deleteLeaderboardRecord,
  deleteLevelRecords,
} from "../../composables/gameProgress";
import { useGameProgress } from "../../context/GameProgressContext";
import { useAuth } from "./AuthContext";
import { ConfirmationModal, GameLockedModal } from "../game/feedback";
import AnimatedLogo from "../ui/AnimatedLogo";
import CircuitLines from "../ui/animations/CircuitLines";
import GlowingTitle from "../ui/GlowingTitle";
import MenuItem from "./MenuItem";
import SocialMediaIcons from "../ui/SocialMediaIcons";
import { checkGameLockStatus } from "../../lib/supabase";

const HomePage: React.FC = () => {
  // Toggle this to enable/disable navigation for menu items
  const navigationEnabled = true;
  // Toggle this to lock/unlock View Scores separately
  const isViewScoresLocked = true;
  const navigate = useNavigate();
  const [hasProgress, setHasProgress] = useState(false);
  const [menuItems, setMenuItems] = useState<any>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isGameLocked, setIsGameLocked] = useState(false);
  const [showGameLockedModal, setShowGameLockedModal] = useState(false);
  const { resetCompleteLevel } = useGameProgress();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (userId != null) {
      const fetchProgress = async () => {
        try {
          const progressExists = await checkGameProgress(userId);
          setHasProgress(progressExists);
        } catch (error) {
          console.error("Error checking game progress:", error);
        }
      };
      fetchProgress();
    }
  }, [userId]);

  useEffect(() => {
    setMenuItems([
      {
        icon: isGameLocked ? Lock : Play,
        title: "Start Hackathon",
        onClick: () => {
          if (!navigationEnabled) return;
          if (isGameLocked) {
            setShowGameLockedModal(true);
            return;
          }
          if (hasProgress) {
            setShowConfirmation(true);
          } else {
            navigate("/levels");
          }
        },
        disabled: false, // Remove disabled state so users can click to see the modal
      },
      hasProgress
        ? {
            icon: isGameLocked ? Lock : FastForward,
            title: "Continue Hackathon",
            onClick: () => {
              if (!navigationEnabled) return;
              if (isGameLocked) {
                setShowGameLockedModal(true);
                return;
              }
              navigate("/levels");
            },
          }
        : null,
      {
        icon: isViewScoresLocked ? Lock : Trophy,
        title: "View Scores",
        onClick: () => {
          if (!navigationEnabled) return;
          if (isViewScoresLocked) {
            setShowGameLockedModal(true);
            return;
          }
          navigate("/scores");
        },
      },
      {
        icon: isGameLocked ? Lock : BookOpen,
        title: "Instructions",
        onClick: () => {
          if (!navigationEnabled) return;
          if (isGameLocked) {
            setShowGameLockedModal(true);
            return;
          }
          navigate("/instructions");
        },
      },
      {
        icon: Settings,
        title: "Settings",
        onClick: () => {
          if (!navigationEnabled) return;
          navigate("/settings");
        },
      },
    ]);
  }, [hasProgress, userId, isGameLocked]);

  useEffect(() => {
    const fetchGameLockStatus = async () => {
      const isLocked = await checkGameLockStatus();
      console.log('🔒 Game lock status:', isLocked);
      setIsGameLocked(isLocked);
    };

    fetchGameLockStatus();
  }, []);

  const handleConfirmResolution = () => {
    deleteLeaderboardRecord(userId || "")
      .then(() => {
        deleteLevelRecords(userId || "")
          .then(() => {
            resetCompleteLevel();
            navigate("/levels");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex-1 p-8 relative overflow-hidden bg-yelloww flex items-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("/images/background-4.png")'}}>
      <CircuitLines />
      <SocialMediaIcons />

      {/* Right side fixed profile and icons (desktop only) */}
    <div className="flex flex-col items-center fixed right-2 top-4 z-50 space-y-3 mt-8 p-2  rounded-xl 
      lg:right-4 lg:top-10 lg:space-y-6 lg:mt-20 lg:p-4 lg:rounded-2xl lg:shadow-2xl">
        {/* ProfileMenu at top right */}
        <div>
          {/* Import and use ProfileMenu if not already in TopBar */}
          {/* <ProfileMenu /> */}
        </div>
        {/* Two icons below profile, aligned and spaced from profile */}
        <div className="flex flex-col items-center w-full">
          <a
            href="https://us06web.zoom.us/j/86412214284?pwd=I8U47ItobcPBHvKgzmwsDAckIPBFYY.1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/80 rounded-xl p-2 shadow-lg border-2 border-yellow-400 hover:scale-105 transition-all mt-6
            lg:rounded-2xl lg:p-4 lg:shadow-xl lg:hover:scale-110 lg:mt-8"
          >
            <img src="/icons/helpdesk.png" alt="Help Desk" className="w-10 h-10 object-contain lg:w-16 lg:h-12" />
          </a>
          <a
            href="https://naanmudhalvan.tn.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/80 rounded-xl p-2 shadow-lg border-2 border-yellow-400 hover:scale-105 transition-all mt-3
            lg:rounded-2xl lg:p-4 lg:shadow-xl lg:hover:scale-110 lg:mt-5"
          >
            <img src="/icons/nmlogo.png" alt="Info" className="w-10 h-10 object-contain lg:w-16 lg:h-12" />
          </a>
        </div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row  items-center space-x-2 -mt-20 md:mb-[10%]">
          {/* Show AnimatedLogo only on desktop */}
          <span className="hidden lg:block">
            <AnimatedLogo className="" />
          </span>
          <GlowingTitle>
            <span
              className="text-yellow-400 font-black text-3xl md:text-5xl text-center mt-8 md:mt-8 lg:mt-16 block"
              style={{
                textShadow:
                  '0 2px 4px #000, 0 6px 20px rgba(0,0,0,0.19), 2px 2px 0 #e11d48, 4px 4px 0 #fbbf24',
              }}
            >
              {/* Single line for all screens */}
              <span className="block">Safe Bite 2.0</span>
              {/* Show Hackathon only on desktop (md and up) */}
              <span className="hidden md:block text-2xl md:text-3xl mt-1">Hackathon</span>
              {/* <span className="md:hidden">Food Safety and Quality Management</span> */}
            </span>
          </GlowingTitle>
        </div>

{/* Logo above menu items */}
{/* <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 pt-2 sm:pt-4">
          <img 
            src="/images/logo_home.png" 
            alt="Home Logo" 
            className="w-20 h-auto sm:w-24 md:w-28 lg:w-32 xl:w-36 max-w-full object-contain opacity-90 hover:opacity-100 transition-all duration-300 ease-in-out transform hover:scale-105"
          />
        </div>         */}

        <div className="md:space-y-8 space-y-5">
          {menuItems
            .filter((item: any) => item !== null)
            .map((item: any, index: number) => (
              <MenuItem
                key={index}
                index={index}
                icon={item.icon}
                title={item.title}
                onClick={item.onClick}
                disabled={item.disabled}
                bg={index === 0 && 'bg-gradient-to-b  from-red-300 via-red-400 to-red-500 z-0  shadow-lg shadow-red-300 rounded-[1.3rem] border-2 border-red-600' }
                text = {index === 0 && 'text-white text-xl font-semibold mt-1 animate-pulse '}
                iconColor = {index === 0 && ' bg-red-100 rounded-full  animate-pulse'}
                border = {index === 0 && 'absolute border-red-100 border-[0.4rem] '}
                animate={index === 0 && ''}
              />
            ))}
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmResolution}
        onCancel={() => {
          setShowConfirmation(false);
        }}
        text={"This will delete all your progress."}
      />
      <GameLockedModal
        isOpen={showGameLockedModal}
        onClose={() => setShowGameLockedModal(false)}
      />
    </div>
  );
};

export default HomePage;
