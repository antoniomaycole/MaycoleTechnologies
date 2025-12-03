import { motion } from 'motion/react';

interface CheckbookIconProps {
  className?: string;
  animated?: boolean;
}

export function CheckbookIcon({ className = "w-12 h-12", animated = true }: CheckbookIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Checkbook Cover - Outer */}
      <motion.rect
        x="10"
        y="20"
        width="80"
        height="60"
        rx="4"
        fill="url(#checkbookGradient)"
        stroke="#22c55e"
        strokeWidth="2"
        initial={animated ? { scale: 0.9, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      />
      
      {/* Checkbook Inner Shadow */}
      <rect
        x="14"
        y="24"
        width="72"
        height="52"
        rx="2"
        fill="rgba(0, 0, 0, 0.1)"
      />
      
      {/* Check Page - White Background */}
      <motion.rect
        x="16"
        y="26"
        width="68"
        height="48"
        rx="2"
        fill="white"
        stroke="#ffd700"
        strokeWidth="1.5"
        initial={animated ? { x: 10, opacity: 0 } : {}}
        animate={animated ? { x: 16, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      
      {/* Check Lines - Top decorative line */}
      <motion.line
        x1="20"
        y1="32"
        x2="80"
        y2="32"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
      />
      
      {/* Date Line */}
      <motion.line
        x1="58"
        y1="38"
        x2="78"
        y2="38"
        stroke="#94a3b8"
        strokeWidth="0.8"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
        animate={animated ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
      
      {/* Pay to the Order of Line */}
      <motion.line
        x1="20"
        y1="44"
        x2="70"
        y2="44"
        stroke="#94a3b8"
        strokeWidth="0.8"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
        animate={animated ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ duration: 0.4, delay: 0.6 }}
      />
      
      {/* Amount Box */}
      <motion.rect
        x="72"
        y="40"
        width="10"
        height="6"
        rx="1"
        stroke="#ffd700"
        strokeWidth="0.8"
        fill="rgba(255, 215, 0, 0.1)"
        initial={animated ? { scale: 0, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.7 }}
      />
      
      {/* Memo Line */}
      <motion.line
        x1="20"
        y1="52"
        x2="55"
        y2="52"
        stroke="#94a3b8"
        strokeWidth="0.8"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
        animate={animated ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ duration: 0.4, delay: 0.7 }}
      />
      
      {/* Signature Line */}
      <motion.line
        x1="58"
        y1="60"
        x2="78"
        y2="60"
        stroke="#94a3b8"
        strokeWidth="0.8"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
        animate={animated ? { pathLength: 1, opacity: 0.5 } : {}}
        transition={{ duration: 0.4, delay: 0.8 }}
      />
      
      {/* Routing Numbers - Bottom of Check */}
      <motion.text
        x="20"
        y="68"
        fontSize="5"
        fill="#1e7f3e"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="0.5"
        initial={animated ? { opacity: 0, y: 5 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        ⑆021000021⑆
      </motion.text>
      
      {/* Account Number */}
      <motion.text
        x="50"
        y="68"
        fontSize="5"
        fill="#1e7f3e"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="0.3"
        initial={animated ? { opacity: 0, y: 5 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 1.0 }}
      >
        1234567
      </motion.text>
      
      {/* Check Number */}
      <motion.text
        x="72"
        y="68"
        fontSize="5"
        fill="#1e7f3e"
        fontFamily="monospace"
        fontWeight="bold"
        initial={animated ? { opacity: 0, y: 5 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 1.1 }}
      >
        001⑈
      </motion.text>
      
      {/* Checkbook Spine/Binding */}
      <motion.rect
        x="10"
        y="20"
        width="4"
        height="60"
        rx="2"
        fill="url(#spineGradient)"
        initial={animated ? { opacity: 0 } : {}}
        animate={animated ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      
      {/* Binding Rings */}
      {[30, 45, 60].map((y, index) => (
        <motion.circle
          key={y}
          cx="12"
          cy={y}
          r="1.5"
          fill="#ffd700"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="0.5"
          initial={animated ? { scale: 0 } : {}}
          animate={animated ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
        />
      ))}
      
      {/* Perforated Edge */}
      <motion.line
        x1="15"
        y1="26"
        x2="15"
        y2="74"
        stroke="#94a3b8"
        strokeWidth="0.5"
        strokeDasharray="2,2"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
        animate={animated ? { pathLength: 1, opacity: 0.4 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="checkbookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e7f3e" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="spineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="50%" stopColor="#1e7f3e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
    </svg>
  );
}