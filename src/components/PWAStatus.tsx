import React, { useEffect, useState } from 'react';
import { Smartphone, Wifi, WifiOff, Download } from 'lucide-react';
import { isPWAInstalled, getPWADisplayMode, canInstallPWA, isIOSDevice } from '../utils/pwa';

const PWAStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [displayMode, setDisplayMode] = useState('browser');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setPwaInstalled(isPWAInstalled());
    setDisplayMode(getPWADisplayMode());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Smartphone size={20} />
        App Status
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Connection Status</span>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi size={16} className="text-green-500" />
                <span className="text-sm text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-red-500" />
                <span className="text-sm text-red-600">Offline</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">App Installation</span>
          <div className="flex items-center gap-2">
            {pwaInstalled ? (
              <>
                <Download size={16} className="text-green-500" />
                <span className="text-sm text-green-600">Installed</span>
              </>
            ) : (
              <>
                <Download size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">Browser</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Display Mode</span>
          <span className="text-sm text-gray-800 capitalize">{displayMode}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">PWA Support</span>
          <span className={`text-sm ${canInstallPWA() ? 'text-green-600' : 'text-red-600'}`}>
            {canInstallPWA() ? 'Supported' : 'Not Supported'}
          </span>
        </div>

        {isIOSDevice() && !pwaInstalled && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>iOS Users:</strong> To install this app, tap the Share button in Safari and select "Add to Home Screen".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAStatus;