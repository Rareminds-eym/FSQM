// src/App.tsx
import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from "recoil";
import { Auth } from "./components/auth";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
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

  // Check if we're on the password reset page
  const isPasswordResetPage = window.location.pathname === '/reset-password';
  
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
        console.log("App.tsx: Fetching scenarios...");
        const scenarios = await fetchAllLevels();
        console.log("App.tsx: Scenarios fetched:", scenarios);
        console.log("App.tsx: Scenarios length:", scenarios?.length);
        _setGameScenarios(scenarios);
        console.log("App.tsx: Scenarios set in global state");
      } catch (error) {
        console.error("App.tsx: Error fetching levels:", error);
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
        
        {/* Routes - Reset password takes priority over authentication status */}
        <Routes>
          {/* Password reset route - always accessible */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Authenticated routes */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={
                <>
                  <div className="fixed top-4 right-4 z-50">
                    <ProfileMenu />
                  </div>
                  <HomePage />
                </>
              } />
              <Route path="/levels" element={
                <>
                  <div className="fixed top-4 right-4 z-50">
                    <ProfileMenu />
                  </div>
                  <LevelsPage />
                </>
              } />
              <Route path="/game/:levelId" element={
                <>
                  <div className="fixed top-4 right-4 z-50">
                    <ProfileMenu />
                  </div>
                  <GamePage />
                </>
              } />
              <Route path="/instructions" element={
                <>
                  <div className="fixed top-4 right-4 z-50">
                    <ProfileMenu />
                  </div>
                  <InstructionsPage />
                </>
              } />
              <Route path="/settings" element={
                <>
                  <div className="fixed top-4 right-4 z-50">
                    <ProfileMenu />
                  </div>
                  <SettingsPage />
                </>
              } />
              <Route path="/scores" element={
                <>
                  <div className="fixed top-4 right-4 z-50">
                    <ProfileMenu />
                  </div>
                  <ScoresPage />
                </>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </>
          ) : (
            /* Unauthenticated routes */
            <Route path="*" element={<Auth />} />
          )}
        </Routes>
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
