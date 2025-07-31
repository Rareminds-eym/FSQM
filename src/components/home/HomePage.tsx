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
            onClick: () => navigate("/levels"),
          }
        : null,
      {
        icon: Trophy,
        title: "View Scores",
        onClick: () => navigate("/scores"),
      },
      {
        icon: BookOpen,
        title: "Instructions",
        onClick: () => navigate("/instructions"),
      },
      {
        icon: Settings,
        title: "Settings",
        onClick: () => navigate("/settings"),
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
    <div className="flex-1 p-8 relative overflow-hidden bg-yelloww flex items-center">
      <CircuitLines />
      <div className="max-w-md mx-auto relative z-10">
        <div className="flex  items-center space-x-2">
          <AnimatedLogo className="" />
          <GlowingTitle>
             Food Safety and Quality Management
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
