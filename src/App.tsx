// src/App.tsx
import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from "recoil";
import { Auth } from "./components/auth";
import NotFoundPage from "./components/error/NotFoundPage";
import GamePage from "./components/game/GamePage";
import LevelsPage from "./components/game/levels/LevelsPage";
import HomePage from "./components/home/HomePage";
import { InstructionsPage } from "./components/instructions";
import { LoaderScreen } from "./components/loader";
import { ScoresPage } from "./components/scores";
import SettingsPage from "./components/settings/SettingsPage";
import ProfileMenu from "./components/ui/ProfileMenu";
import { fetchAllLevels } from "./composables/fetchLevel";
import { AuthProvider, useAuth } from "./components/home/AuthContext";
import { GameProgressProvider } from "./context/GameProgressContext";
import { SettingsProvider } from "./context/SettingsContext";
import { gameScenarios } from "./data/recoilState";
import Offline from "./Oflline";

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [_gameScenarios, _setGameScenarios] = useRecoilState(gameScenarios);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Effect to handle online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scenarios = await fetchAllLevels();
        _setGameScenarios(scenarios);
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoaderScreen onComplete={() => setIsLoading(false)} />;
  }

  if (!isOnline) {
    return <Offline />;
  }

  return (
    <div className="relative bg-white">
      <div className="min-h-screen flex pb-0">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        {isAuthenticated && (
          <div className="fixed top-4 right-4 z-50">
            <ProfileMenu />
          </div>
        )}
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/levels" element={<LevelsPage />} />
            <Route path="/game/:levelId" element={<GamePage />} />
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/scores" element={<ScoresPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        ) : (
          <Auth />
        )}
      </div>
      <div className=" bg-yelloww py-5  text-yellow-100 font-semibold flex justify-center w-full">
        Copyright © 2025 Rareminds.
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <GameProgressProvider>
          <Router>
            <AppContent />
          </Router>
        </GameProgressProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
