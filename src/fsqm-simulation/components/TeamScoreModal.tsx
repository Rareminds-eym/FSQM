import React, { useEffect } from "react";
import { CheckCircle, Download, Home, X } from "lucide-react";

interface TeamScoreModalProps {
  show: boolean;
  onClose?: () => void;
  onDownload?: () => void;
  onHome?: () => void;
  level?: number;
}

export const TeamScoreModal: React.FC<TeamScoreModalProps> = ({
  show,
  onClose,
  onDownload,
  onHome,
  level = 1
}) => {
  if (!show) return null;

  // Auto-close modal after 30 seconds if no action is taken
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && show && onClose) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [show, onClose]);

  const handleDownload = () => {
    // Create a simple text file with attempted scenarios info
    const content = `FSQM Hackathon Level ${level} - Attempted Scenarios\n\nSubmission completed successfully!\n\nThank you for participating in the FSQM Hackathon.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fsqm-level-${level}-scenarios.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onDownload) onDownload();
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      // Default behavior - redirect to home
      window.location.href = '/';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Green Header */}
        <div className="bg-green-500 text-white px-6 py-4 flex items-center gap-3">
          <CheckCircle className="w-8 h-8" />
          <h2 className="text-xl font-bold">
            Level {level} Submission Complete! 🎉
          </h2>
        </div>

        {/* Blue Success Message */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <p className="text-base sm:text-lg font-medium">
            Great work! Your Hackathon Level-{level} has been successfully submitted for evaluation.
          </p>
        </div>

        {/* Teal What's Next Section */}
        <div className="bg-teal-500 text-white px-6 py-4">
          <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            🎯 What's Next?
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>• Results will be announced on 18th August 2025 3PM</li>
            <li>• Check the results at: <span className="underline break-all">https://criteminds.in/hackathons</span></li>
            <li>• While you wait, start thinking of solutions and ideas for any one of your problem statements—you'll need this for Level 2</li>
          </ul>
        </div>

        {/* Orange Tip Section */}
        <div className="bg-orange-500 text-white px-6 py-4">
          <h3 className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
            💡 Tip:
          </h3>
          <p className="text-xs sm:text-sm">
            Focus on practical, innovative solutions that can make your idea stand out in the next round!
          </p>
        </div>

        {/* Buttons */}
        <div className="bg-gray-100 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Click to Download Attempted Scenarios</span>
            <span className="sm:hidden">Download Scenarios</span>
          </button>
          <button
            onClick={handleHome}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};
