import { motion } from 'motion/react';

// ESLint disable for required animation styles
/* eslint-disable jsx-a11y/no-static-element-interactions, @stylistic/no-inline-styles */

export function AtomicLogo({ size = "lg" }: { size?: "xs" | "sm" | "lg" }) {
  const isIcon = size === "xs";
  const isSmall = size === "sm";
  const isLarge = size === "lg";
  
  const logoSize = isLarge ? "text-8xl" : isSmall ? "text-lg" : "text-sm";
  const containerSize = isLarge ? "w-48 h-48" : isSmall ? "w-8 h-8" : "w-6 h-6";
  const ballSize = isLarge ? "w-8 h-8" : isSmall ? "w-2 h-2" : "w-1.5 h-1.5";
  const particleSize = isLarge ? "w-1.5 h-1.5" : isSmall ? "w-0.5 h-0.5" : "w-0.5 h-0.5";
  const orbitRadius = isLarge ? 60 : isSmall ? 12 : 8;
  
  return (
    <div className={`atomic-logo-component relative flex items-center justify-center ${logoSize}`}>
      <span 
        className="atomic-bracket-left"
        style={{
          fontFamily: 'ui-monospace, "Cascadia Code", "Roboto Mono", Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace',
          fontWeight: '600',
          color: '#c4b566 !important',
          textShadow: '0 0 15px rgba(196, 181, 102, 0.4), 0 0 30px rgba(196, 181, 102, 0.2)',
          filter: 'drop-shadow(0 3px 6px rgba(196, 181, 102, 0.3))'
        }}
      >
        &lt;
      </span>
      
      {/* Atomic Animation Container */}
      <div className={`relative ${containerSize} mx-1 flex items-center justify-center`}
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Central spinning ball - 3D Enhanced */}
        <motion.div
          className={`${ballSize} rounded-full z-10 relative`}
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ff4500, #ff0000, #dc143c)',
            boxShadow: `
              0 0 25px rgba(255, 69, 0, 1),
              0 0 50px rgba(255, 0, 0, 0.8),
              0 0 75px rgba(220, 20, 60, 0.6),
              inset -3px -3px 10px rgba(0, 0, 0, 0.3)
            `,
            transform: 'translateZ(20px)'
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        
        {/* 3D Enhanced Electron orbit rings */}
        {isLarge && (
          <>
            {/* First orbit ring - Green */}
            <motion.div
              className="absolute border-2 rounded-full"
              style={{ 
                width: orbitRadius * 2, 
                height: orbitRadius * 2,
                borderImage: 'linear-gradient(45deg, #22c55e, #16a34a, #15803d) 1',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.4), inset 0 0 20px rgba(34, 197, 94, 0.1)',
                transform: 'rotateX(60deg) translateZ(10px)'
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Second orbit ring - Gold */}
            <motion.div
              className="absolute border-2 rounded-full"
              style={{ 
                width: orbitRadius * 1.5, 
                height: orbitRadius * 1.5,
                borderImage: 'linear-gradient(45deg, #ffd700, #f59e0b, #d97706) 1',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.1)',
                transform: 'rotateX(-45deg) translateZ(5px)'
              }}
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Third orbit ring - Green with gradient */}
            <motion.div
              className="absolute border-2 rounded-full"
              style={{ 
                width: orbitRadius * 2.5, 
                height: orbitRadius * 2.5,
                borderImage: 'linear-gradient(90deg, #22c55e, #ffd700, #22c55e) 1',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.1)',
                transform: 'rotateX(30deg) translateZ(-5px)'
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
        
        {/* 3D Enhanced Orbiting particles (electrons) */}
        {[...Array(isLarge ? 16 : isIcon ? 12 : 6)].map((_, i) => {
          const angle = (360 / (isLarge ? 16 : isIcon ? 12 : 6)) * i;
          // Keep particles close to center, well within the central container and away from orbit rings
          const radius = isLarge ? [20, 25, 30, 35, 38, 42][i % 6] : isIcon ? [3, 4, 5, 6][i % 4] : 8;
          const duration = isLarge ? [3, 4, 5, 6, 7, 8][i % 6] : isIcon ? [2.5, 3, 3.5, 4][i % 4] : 3;
          // Distribute three colors evenly: Gold, Green, and Cyan
          const particleColorType = i % 3;
          const isGold = particleColorType === 0;
          const isGreen = particleColorType === 1;
          const isCyan = particleColorType === 2;
          // Only a few particles (every 5th) move in opposite direction - most move clockwise
          const rotateDirection = (i % 5 === 0) ? [360, 0] : [0, 360];
          
          return (
            <motion.div
              key={i}
              className={`absolute ${particleSize} rounded-full`}
              style={{
                background: isGold 
                  ? 'radial-gradient(circle at 30% 30%, #ffd700, #f59e0b, #d97706)' 
                  : isGreen
                    ? 'radial-gradient(circle at 30% 30%, #22c55e, #16a34a, #15803d)'
                    : 'radial-gradient(circle at 30% 30%, #06b6d4, #0ea5e9, #0284c7)',
                boxShadow: isGold 
                  ? `0 0 12px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4), inset -1px -1px 2px rgba(0, 0, 0, 0.3), inset 1px 1px 2px rgba(255, 255, 255, 0.3)`
                  : isGreen
                    ? `0 0 12px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.4), inset -1px -1px 2px rgba(0, 0, 0, 0.3), inset 1px 1px 2px rgba(255, 255, 255, 0.3)`
                    : `0 0 12px rgba(6, 182, 212, 0.8), 0 0 20px rgba(6, 182, 212, 0.4), inset -1px -1px 2px rgba(0, 0, 0, 0.3), inset 1px 1px 2px rgba(255, 255, 255, 0.3)`,
                transformOrigin: `${radius}px 0px`,
                left: '50%',
                top: '50%',
                marginLeft: -radius,
                marginTop: -(isLarge ? 3 : 1.5),
                transform: `translateZ(${Math.sin(i * 0.5) * 10}px)`,
              }}
              animate={{
                rotate: rotateDirection,
                scale: [1, 1.15, 1],
              }}
              transition={{
                rotate: { duration: duration, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 },
              }}
            >
              {/* Particle inner glow */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.6), transparent 70%)',
                }}
              />
            </motion.div>
          );
        })}
        
        {/* 3D Enhanced Energy waves */}
        {isLarge && (
          <>
            <motion.div
              className="absolute border-2 rounded-full"
              style={{ 
                width: orbitRadius * 3, 
                height: orbitRadius * 3,
                borderImage: 'radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent) 1',
                boxShadow: '0 0 40px rgba(255, 215, 0, 0.2), inset 0 0 40px rgba(255, 215, 0, 0.1)',
                transform: 'translateZ(-10px)'
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              }}
            />
            
            <motion.div
              className="absolute border-2 rounded-full"
              style={{ 
                width: orbitRadius * 3.5, 
                height: orbitRadius * 3.5,
                borderImage: 'radial-gradient(circle, rgba(34, 197, 94, 0.2), transparent) 1',
                boxShadow: '0 0 50px rgba(34, 197, 94, 0.15), inset 0 0 50px rgba(34, 197, 94, 0.05)',
                transform: 'translateZ(-15px)'
              }}
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
              }}
            />

            {/* Additional energy pulse effect */}
            <motion.div
              className="absolute border rounded-full"
              style={{ 
                width: orbitRadius * 4, 
                height: orbitRadius * 4,
                borderImage: 'conic-gradient(from 0deg, #22c55e, #ffd700, #22c55e, #ffd700, #22c55e) 1',
                transform: 'translateZ(-20px)'
              }}
              animate={{
                scale: [0.8, 1.3, 0.8],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 360],
              }}
              transition={{
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              }}
            />
          </>
        )}
      </div>
      
      <span 
        className="maycole-gradient-text"
        style={{
          fontFamily: 'ui-monospace, "Cascadia Code", "Roboto Mono", Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #1e7f3e 0%, #ffd700 100%)',
          backgroundSize: '200% 100%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradient-shift 3s ease-in-out infinite',
          textShadow: 'none',
          filter: 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4))'
        }}
      >
        &gt;
      </span>
    </div>
  );
}