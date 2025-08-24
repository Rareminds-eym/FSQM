import React, { useEffect, useRef, useState } from 'react';

interface Level2TimerProps {
  initialTime: number;
  isActive: boolean;
  onTimeUp: () => void;
  onTick?: (time: number) => void;
  savedTime?: number; // Allow resuming from a saved time
  autoSave?: boolean; // Whether to periodically save timer state
  onSaveTimer?: (time: number) => void; // Callback to save timer state
  isMobileHorizontal?: boolean; // For mobile responsive styling
}

const Level2Timer: React.FC<Level2TimerProps> = ({ 
  initialTime, 
  isActive, 
  onTimeUp, 
  onTick, 
  savedTime, 
  autoSave = false, 
  onSaveTimer,
  isMobileHorizontal = false
}) => {
  // Initialize with savedTime if available, otherwise use initialTime
  const getInitialTime = () => {
    if (typeof savedTime === 'number' && savedTime > 0) {
      console.log('[Level2Timer] Initializing with savedTime:', savedTime);
      return savedTime;
    }
    console.log('[Level2Timer] Initializing with initialTime:', initialTime);
    return initialTime;
  };
  
  const [timeRemaining, setTimeRemaining] = useState(getInitialTime());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTimeRef = useRef<number>(getInitialTime());

  // Initialize timer with saved time if available
  useEffect(() => {
    if (savedTime !== undefined) {
      console.log('[Level2Timer] Resuming from saved time:', savedTime);
      setTimeRemaining(savedTime);
      lastSavedTimeRef.current = savedTime;
    } else {
      console.log('[Level2Timer] Starting with initial time:', initialTime);
      setTimeRemaining(initialTime);
      lastSavedTimeRef.current = initialTime;
    }
  }, [savedTime, initialTime]);

  // Auto-save timer state periodically if enabled
  useEffect(() => {
    if (autoSave && onSaveTimer && isActive) {
      // Save every 30 seconds if time has changed by at least 30 seconds
      saveIntervalRef.current = setInterval(() => {
        const timeDifference = Math.abs(timeRemaining - lastSavedTimeRef.current);
        if (timeDifference >= 30) {
          console.log('[Level2Timer] Auto-saving timer state:', timeRemaining, `(${timeDifference}s elapsed)`);
          onSaveTimer(timeRemaining);
          lastSavedTimeRef.current = timeRemaining;
        }
      }, 30000); // Check every 30 seconds
      
      return () => {
        if (saveIntervalRef.current) {
          clearInterval(saveIntervalRef.current);
          saveIntervalRef.current = null;
        }
      };
    }
  }, [autoSave, onSaveTimer, isActive, timeRemaining]);

  useEffect(() => {
    if (typeof onTick === 'function') {
      onTick(timeRemaining);
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onTimeUp]);

  // Save timer state when component unmounts to prevent data loss
  useEffect(() => {
    return () => {
      if (autoSave && onSaveTimer && timeRemaining !== lastSavedTimeRef.current) {
        console.log('[Level2Timer] Final save on unmount:', timeRemaining);
        onSaveTimer(timeRemaining);
      }
    };
  }, [autoSave, onSaveTimer, timeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = (timeRemaining / initialTime) * 100;
  const getTextColor = () => {
    if (percentage > 25) return 'text-white';
    return 'text-red-400';
  };

  return (
    <div className={`text-xs font-mono ${getTextColor()}`}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default Level2Timer;
