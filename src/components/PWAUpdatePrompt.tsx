import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const PWAUpdatePrompt: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdatePrompt(true);
    }
  }, [needRefresh]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowUpdatePrompt(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {offlineReady && (
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <p className="text-sm font-medium">App ready to work offline</p>
          <button
            onClick={close}
            className="mt-2 text-xs underline hover:no-underline"
          >
            Close
          </button>
        </div>
      )}
      
      {showUpdatePrompt && (
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-2">New content available!</p>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-white text-blue-500 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100"
            >
              Update
            </button>
            <button
              onClick={close}
              className="text-xs underline hover:no-underline"
            >
              Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAUpdatePrompt;