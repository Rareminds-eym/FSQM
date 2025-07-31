import { BookOpen, FastForward, Play, Settings, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkGameProgress,
  deleteLeaderboardRecord,
  deleteLevelRecords,
} from "../../composables/gameProgress";
import { useGameProgress } from "../../context/GameProgressContext";
import { useAuth } from "./AuthContext";
import { ConfirmationModal } from "../game/feedback";
import AnimatedLogo from "../ui/AnimatedLogo";
import CircuitLines from "../ui/animations/CircuitLines";
import GlowingTitle from "../ui/GlowingTitle";
import MenuItem from "./MenuItem";

const HomePage: React.FC = () => {
  // Toggle this to enable/disable navigation for menu items
  const navigationEnabled = false;
  const navigate = useNavigate();
  const [hasProgress, setHasProgress] = useState(false);
  const [menuItems, setMenuItems] = useState<any>([]);
  const [userId, setUserId] = useState<string | null>(null);
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
        icon: Play,
        title: "Start Game",
        onClick: () => {
          if (!navigationEnabled) return;
          if (hasProgress) {
            setShowConfirmation(true);
          } else {
            navigate("/levels");
          }
        },
      },
      hasProgress
        ? {
            icon: FastForward,
            title: "Continue",
            onClick: () => {
              if (!navigationEnabled) return;
              navigate("/levels");
            },
          }
        : null,
      {
        icon: Trophy,
        title: "View Scores",
        onClick: () => {
          if (!navigationEnabled) return;
          navigate("/scores");
        },
      },
      {
        icon: BookOpen,
        title: "Instructions",
        onClick: () => {
          if (!navigationEnabled) return;
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
  }, [hasProgress, userId]);

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
      <div className="max-w-md mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row  items-center space-x-2 -mt-20 md:mb-[30%]">
          {/* Show AnimatedLogo only on desktop */}
          <span className="hidden lg:block">
            <AnimatedLogo className="" />
          </span>
          <GlowingTitle>
            <span
              className="text-yellow-400 font-black text-3xl md:text-5xl text-center mt-4 md:mt-0 "
              style={{
                textShadow:
                  '0 2px 4px #000, 0 6px 20px rgba(0,0,0,0.19), 2px 2px 0 #e11d48, 4px 4px 0 #fbbf24',
              }}
            >
              Food Safety and <br /> Quality Management
            </span>
          </GlowingTitle>
        </div>

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
    </div>
  );
};

export default HomePage;
