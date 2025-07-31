import React from "react";
import Lottie from "react-lottie-player";
import router from './router.json';
import { RotateCcw } from "lucide-react";

const Offline: React.FC = () => {
  const handleTryAgain = () => {
    // Reload the page
    window.location.reload();
  };

  return (
    <div className="relative bg-yelloww min-h-screen flex flex-col justify-center items-center text-center">
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'red',
          color: 'white',
          textAlign: 'center',
          padding: '10px',
          fontSize: '16px',
        }}
      >
        Not Connected to Internet
      </div>
      <Lottie
        animationData={router}
        loop
        play
        className="w-56 h-56"
      />
      <div className="text-center flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-white">No Internet!</h1>
        <p className="mt-4 text-xl text-black font-light">
          Please check your internet connection and try again.
        </p>
        <button
          onClick={handleTryAgain}
          className="mt-8 px-6 py-2 shadow-lg  flex items-center bg-yellow-300 text-black/70 border-2 border-yellow-100 text-xl font-semibold rounded-lg hover:bg-yellow-400 transition"
        >
          <RotateCcw className="mr-2" /> Try Again
        </button>
      </div>
    </div>
  );
};

export default Offline;
