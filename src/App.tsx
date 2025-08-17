// src/App.tsx - Simple version without complex PWA logic
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
import GameEngine from "./fsqm-simulation/GmpSimulation";
import HomePage from "./components/home/HomePage";
import { InstructionsPage } from "./components/instructions";
import { LoaderScreen } from "./components/loader";
import { ScoresPage } from "./components/scores";
import SettingsPage from "./components/settings/SettingsPage";
import ProfileMenu from "./components/ui/ProfileMenu";
import { InstallPrompt, OfflineIndicator } from "./PWA";
// Direct service worker registration

import { fetchAllLevels } from "./composables/fetchLevel";
import { supabase, fetchWithFallback } from "./lib/supabaseClient";
import { AuthProvider, useAuth } from "./components/home/AuthContext";
import { GameProgressProvider } from "./context/GameProgressContext";
import { EnhancedGameProgressProvider } from "./context/EnhancedGameProgressContext";
import { SettingsProvider } from "./context/SettingsContext";
import { gameScenarios } from "./data/recoilState";
import Offline from "./Oflline";

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [_gameScenarios, _setGameScenarios] = useRecoilState(gameScenarios);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Example: Fetch scenarios from Supabase with fallback to local data
  useEffect(() => {
    async function loadScenarios() {
      const fetchFromSupabase = async () => {
        const { data, error } = await supabase.from("scenarios").select("*");
        if (error) throw error;
        return data;
      };
      const fetchFromLocal = async () => {
        // Replace with your local fallback logic, e.g., import('./data/localScenarios')
        console.warn(
          "[FSQM] Using local fallback for scenarios (Supabase fetch failed)"
        );
        return [];
      };
      const scenarios = await fetchWithFallback(
        fetchFromSupabase,
        fetchFromLocal
      );
      _setGameScenarios(scenarios);
    }
    loadScenarios();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register service worker directly
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);

            // Debug PWA installability
            console.log("PWA Debug Info:");
            console.log("- Service Worker registered:", !!registration);
            console.log(
              "- Manifest linked:",
              !!document.querySelector('link[rel="manifest"]')
            );
            console.log(
              "- HTTPS or localhost:",
              location.protocol === "https:" ||
                location.hostname === "localhost"
            );
            console.log(
              "- Display mode:",
              window.matchMedia("(display-mode: standalone)").matches
                ? "standalone"
                : "browser"
            );
          })
          .catch((error) => {
            console.error("SW registration failed: ", error);
          });
      });
    } else {
      console.warn("Service Worker not supported");
    }

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
    <div className="relative bg-white min-h-screen flex flex-col">
      {/* PWA Components */}
      <InstallPrompt />
      <OfflineIndicator />

      <div className="flex-1 w-full min-h-0 min-w-0 flex flex-col">
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
          {/* Team registration route - accessible when authenticated */}
          {/* {isAuthenticated && (
            <Route path="/team-registration" element={<TeamRegistration />} />
          )} */}
          {/* Authenticated routes */}
          {isAuthenticated ? (
            <>
              <Route
                path="/"
                element={
                  <>
                    <div className="fixed top-4 right-4 z-50">
                      {/* <ProfileMenu /> */}
                    </div>
                    <HomePage />
                  </>
                }
              />
              <Route
                path="/levels"
                element={
                  <>
                    <div className="fixed top-4 right-4 z-50">
                      <ProfileMenu />
                    </div>
                    <LevelsPage />
                  </>
                }
              />
              <Route
                path="/game/:levelId"
                element={
                  <>
                    {/* <div className="fixed top-4 right-4 z-50">
                    <ProfileMenu />
                  </div> */}
                    <GamePage />
                  </>
                }
              />
              <Route
                path="/fsqm-simulation/:levelId"
                element={
                  <>
                    {/* <div className="fixed top-4 right-4 z-50">
                    <ProfileMenu />
                  </div> */}
                    <GameEngine />
                  </>
                }
              />
              <Route
                path="/instructions"
                element={
                  <>
                    <div className="fixed top-4 right-4 z-50">
                      <ProfileMenu />
                    </div>
                    <InstructionsPage />
                  </>
                }
              />
              <Route
                path="/settings"
                element={
                  <>
                    <div className="fixed top-4 right-4 z-50">
                      <ProfileMenu />
                    </div>
                    <SettingsPage />
                  </>
                }
              />
              <Route
                path="/scores"
                element={
                  <>
                    <div className="fixed top-4 right-4 z-50">
                      <ProfileMenu />
                    </div>
                    <ScoresPage />
                  </>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </>
          ) : (
            /* Unauthenticated routes */
            <Route path="*" element={<Auth />} />
          )}
        </Routes>
      </div>
      <div className="bg-yelloww py-5 text-yellow-100 font-semibold flex justify-center w-full">
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
          <EnhancedGameProgressProvider>
            <Router>
              <AppContent />
            </Router>
          </EnhancedGameProgressProvider>
        </GameProgressProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
