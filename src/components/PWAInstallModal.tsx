import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Zap, Wifi } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const PWAInstallModal: React.FC = () => {
  const { isInstallable, isInstalled, installApp, canInstall } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled) {
      setShowModal(false);
      return;
    }

    // Check if user has already dismissed the modal
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setHasBeenDismissed(true);
      return;
    }

    // Show modal when app becomes installable
    if (isInstallable && canInstall) {
      // Show modal after a short delay to let the app load
      setTimeout(() => {
        setShowModal(true);
      }, 2000);
    }
  }, [isInstallable, canInstall, isInstalled]);

  const handleInstallClick = async () => {
    const success = await installApp();
    if (success) {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setShowModal(false);
  };

  const handleDismiss = () => {
    setShowModal(false);
    // Remember that user dismissed the modal
    localStorage.setItem('pwa-install-dismissed', 'true');
    setHasBeenDismissed(true);
  };

  const handleNotNow = () => {
    setShowModal(false);
    // Don't set permanent dismissal, allow it to show again later
  };

  if (!showModal || hasBeenDismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Smartphone size={24} />
            </div>
            <h2 className="text-xl font-bold">Install FSQM App</h2>
          </div>
          <p className="text-blue-100 text-sm">
            Get the full experience with our mobile app
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Zap size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Faster Performance</h3>
                <p className="text-sm text-gray-600">Lightning-fast loading and smooth animations</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Download size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Easy Access</h3>
                <p className="text-sm text-gray-600">Launch directly from your home screen</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Install App
            </button>
            <button
              onClick={handleNotNow}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Not Now
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-3">
            Free • No registration required • Works on all devices
          </p>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallModal;