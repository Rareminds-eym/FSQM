import React, { useEffect, useState } from 'react';

const PWADebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState({
    isHTTPS: false,
    hasServiceWorker: false,
    isStandalone: false,
    userAgent: '',
    hasBeforeInstallPrompt: false,
    manifestExists: false
  });

  useEffect(() => {
    const checkPWASupport = async () => {
      const info = {
        isHTTPS: location.protocol === 'https:' || location.hostname === 'localhost',
        hasServiceWorker: 'serviceWorker' in navigator,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent,
        hasBeforeInstallPrompt: false,
        manifestExists: false
      };

      // Check for manifest
      try {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
          const response = await fetch((manifestLink as HTMLLinkElement).href);
          info.manifestExists = response.ok;
        }
      } catch (error) {
        console.error('Error checking manifest:', error);
      }

      setDebugInfo(info);
    };

    checkPWASupport();

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = () => {
      setDebugInfo(prev => ({ ...prev, hasBeforeInstallPrompt: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed top-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">PWA Debug Info</h3>
      <div className="space-y-1">
        <div>HTTPS: {debugInfo.isHTTPS ? '✅' : '❌'}</div>
        <div>Service Worker: {debugInfo.hasServiceWorker ? '✅' : '❌'}</div>
        <div>Standalone: {debugInfo.isStandalone ? '✅' : '❌'}</div>
        <div>Install Event: {debugInfo.hasBeforeInstallPrompt ? '✅' : '❌'}</div>
        <div>Manifest: {debugInfo.manifestExists ? '✅' : '❌'}</div>
        <div className="text-xs text-gray-300 mt-2">
          Browser: {debugInfo.userAgent.includes('Chrome') ? 'Chrome' : 
                   debugInfo.userAgent.includes('Firefox') ? 'Firefox' :
                   debugInfo.userAgent.includes('Safari') ? 'Safari' : 'Other'}
        </div>
      </div>
    </div>
  );
};

export default PWADebug;