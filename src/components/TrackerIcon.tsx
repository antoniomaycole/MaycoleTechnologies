import { motion } from 'motion/react';

interface TrackerIconProps {
  size?: number;
  animated?: boolean;
  interactive?: boolean;
  className?: string;
}

export function TrackerIcon({ 
  size = 48, 
  animated = false,
  interactive = false,
  className = "" 
}: TrackerIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animated ? { opacity: 0, scale: 0.8 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      whileHover={interactive ? { scale: 1.1 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Outer Circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke="url(#trackerGradient)"
        strokeWidth="4"
        fill="none"
        initial={animated ? { pathLength: 0 } : {}}
        animate={animated ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Inner Circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="28"
        stroke="url(#trackerGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
        initial={animated ? { pathLength: 0 } : {}}
        animate={animated ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
      />
      
      {/* Center Dot */}
      <motion.circle
        cx="50"
        cy="50"
        r="8"
        fill="url(#trackerGradient)"
        initial={animated ? { scale: 0 } : {}}
        animate={animated ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      
      {/* Tracking Lines */}
      {[0, 60, 120, 180, 240, 300].map((angle, index) => {
        const radian = (angle * Math.PI) / 180;
        const x1 = 50 + 20 * Math.cos(radian);
        const y1 = 50 + 20 * Math.sin(radian);
        const x2 = 50 + 35 * Math.cos(radian);
        const y2 = 50 + 35 * Math.sin(radian);
        
        return (
          <motion.line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#trackerGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : {}}
            animate={animated ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ 
              duration: 0.4, 
              delay: 0.6 + index * 0.1,
              ease: "easeOut"
            }}
          />
        );
      })}
      
      {/* Barcode-style accent */}
      <motion.g
        initial={animated ? { opacity: 0, y: 5 } : {}}
        animate={animated ? { opacity: 0.7, y: 0 } : { opacity: 0.7 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <rect x="42" y="70" width="2" height="8" fill="#3b82f6" rx="1" />
        <rect x="46" y="70" width="2" height="8" fill="#3b82f6" rx="1" />
        <rect x="50" y="70" width="1.5" height="8" fill="#3b82f6" rx="0.5" />
        <rect x="54" y="70" width="2" height="8" fill="#3b82f6" rx="1" />
      </motion.g>
      
      {/* AI Brain accent */}
      <motion.g
        initial={animated ? { opacity: 0 } : {}}
        animate={animated ? { opacity: 0.8 } : { opacity: 0.8 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <path
          d="M 30 20 Q 35 18, 40 20 T 50 22 T 60 20 Q 65 18, 70 20"
          stroke="#60a5fa"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </motion.g>
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="trackerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
