import React, { useEffect, useRef } from 'react';

interface HintPopoverProps {
  hint: string;
  isOpen: boolean;
  onClose: () => void;
}

const HintPopover: React.FC<HintPopoverProps> = ({ hint, isOpen, onClose }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-2 w-64 p-4
        bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20
        rounded-lg text-yellow-300 text-sm
        transform origin-top-right transition-all duration-300
        animate-in fade-in slide-in-from-top-2"
    >
      {hint}
    </div>
  );
};

export default HintPopover;