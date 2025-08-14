import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const PWAFloatingInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, installApp, canInstall } = usePWAInstall();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show button only if:
    // 1. App is installable
    // 2. Not already installed
    // 3. User has dismissed the main modal
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    
    if (isInstallable && canInstall && !isInstalled && dismissed) {
      // Show after a delay to avoid being intrusive
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 10000); // Show after 10 seconds

      return () => clearTimeout(timer);
    } else {
      setShowButton(false);
    }
  }, [isInstallable, canInstall, isInstalled]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowButton(false);
    }
  };

  const handleDismiss = () => {
    setShowButton(false);
    // Hide for this session
    sessionStorage.setItem('pwa-floating-dismissed', 'true');
  };

  // Don't show if dismissed in this session
  if (sessionStorage.getItem('pwa-floating-dismissed') || !showButton) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <div className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group">
        <button
          onClick={handleInstall}
          className="flex items-center gap-2"
          title="Install FSQM App"
        >
          <Download size={20} />
          <span className="hidden group-hover:inline-block text-sm font-medium whitespace-nowrap">
            Install App
          </span>
        </button>
        <button
          onClick={handleDismiss}
          className="absolute -top-1 -right-1 bg-gray-600 hover:bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          title="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PWAFloatingInstallButton;