import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface VolumeControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

const Volume: React.FC<VolumeControlProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(value);

  useEffect(() => {
    animate(progress, value, { duration: 0.5 });
  }, [value]);

  const angle = useTransform(progress, [0, 1], [-135, 235]);
  const handleX = useTransform(angle, (value) => Math.cos(value * Math.PI / 180) * 100);
  const handleY = useTransform(angle, (value) => Math.sin(value * Math.PI / 180) * 100);

  const circumference = 2 * Math.PI * 100;
  const dashOffset = useTransform(progress, (value) => circumference * (1 - value));

  const VolumeIcon = value === 0 ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
      <motion.path
        d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: value === 0 ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </svg>
  ) : (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-gray-700">
      <path
        d="M11 5L6 9H2V15H6L11 19V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </svg>
  );

  return (
    <div className="flex items-center justify-center">
      <motion.div
        ref={containerRef}
        className="relative w-56 h-56 flex items-center justify-center "
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-white shadow-xl flex items-center justify-center"
          initial={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
          animate={{ boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.15)" }}
          transition={{ duration: 1 }}
        >
          <svg className="absolute w-full h-full" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r="100"
              fill="none"
              stroke="#e6e9ed"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-135 150 150)"
            />
            <motion.circle
              cx="150"
              cy="150"
              r="100"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-135 150 150)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4a90e2" />
                <stop offset="50%" stopColor="#8e44ad" />
                <stop offset="100%" stopColor="#e74c3c" />
              </linearGradient>
            </defs>
          </svg>

          <motion.div
            className="absolute w-6 h-6 rounded-full bg-white shadow-md z-20"
            style={{
              translateX: handleX,
              translateY: handleY,
              top: "50%",
              left: "50%",
              marginLeft: "-12px", 
              marginTop: "-12px",  
            }}
          />
          
          <div className="flex flex-col items-center justify-center z-10">
            <div className="flex items-center mb-2">{VolumeIcon}</div>
            <motion.div className="text-xl font-light text-gray-700">
              <motion.span>{Math.round(value * 100)} </motion.span>%
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Volume;
