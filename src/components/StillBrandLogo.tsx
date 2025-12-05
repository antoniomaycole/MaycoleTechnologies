import React from 'react';

/**
 * Still Brand Logo - Static version of the atomic logo
 * For merchandise (caps, t-shirts), website branding, and company identity
 *
 * Features:
 * - No animation - clean, professional static appearance
 * - Available in multiple sizes
 * - Perfect for hats, t-shirts, and branding materials
 * - Same design language as spinning logo (gold, green, cyan particles)
 */

interface StillBrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'gradient';
  withText?: boolean;
}

export function StillBrandLogo({
  size = 'md',
  variant = 'dark',
  withText = true,
}: StillBrandLogoProps) {
  const sizeMap = {
    xs: {
      container: 'w-12 h-12',
      bracket: 'text-sm',
      ball: 'w-1.5 h-1.5',
      particle: 'w-0.5 h-0.5',
      radius: 4,
    },
    sm: {
      container: 'w-16 h-16',
      bracket: 'text-base',
      ball: 'w-2 h-2',
      particle: 'w-0.5 h-0.5',
      radius: 6,
    },
    md: {
      container: 'w-24 h-24',
      bracket: 'text-2xl',
      ball: 'w-3 h-3',
      particle: 'w-1 h-1',
      radius: 10,
    },
    lg: {
      container: 'w-32 h-32',
      bracket: 'text-4xl',
      ball: 'w-4 h-4',
      particle: 'w-1.5 h-1.5',
      radius: 14,
    },
    xl: {
      container: 'w-48 h-48',
      bracket: 'text-6xl',
      ball: 'w-6 h-6',
      particle: 'w-2 h-2',
      radius: 20,
    },
  };

  const dims = sizeMap[size];
  const ballShadowColor = variant === 'light' ? 'rgba(255, 69, 0, 0.6)' : 'rgba(255, 69, 0, 1)';
  const bracketColor = variant === 'light' ? 'text-slate-600' : 'text-amber-600';
  const textGradient =
    variant === 'gradient'
      ? 'bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent'
      : variant === 'light'
        ? 'text-slate-600'
        : 'text-amber-600';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${dims.container} relative flex items-center justify-center`}>
        {/* Left bracket */}
        <span className={`${dims.bracket} ${bracketColor} font-mono font-bold`}>&lt;</span>

        {/* Logo Container */}
        <div className="relative w-full h-full mx-1 flex items-center justify-center">
          {/* Central ball - stopped in position */}
          <div
            className={`${dims.ball} rounded-full z-10 relative`}
            style={{
              background: 'radial-gradient(circle at 30% 30%, #ff4500, #ff0000, #dc143c)',
              boxShadow: `
                0 0 25px ${ballShadowColor},
                0 0 50px rgba(255, 0, 0, 0.8),
                0 0 75px rgba(220, 20, 60, 0.6),
                inset -3px -3px 10px rgba(0, 0, 0, 0.3)
              `,
            }}
          />

          {/* Static orbit rings */}
          {size !== 'xs' && size !== 'sm' && (
            <>
              {/* First orbit ring - Green */}
              <div
                className="absolute border-2 rounded-full"
                style={{
                  width: dims.radius * 2,
                  height: dims.radius * 2,
                  borderImage: 'linear-gradient(45deg, #22c55e, #16a34a, #15803d) 1',
                  boxShadow:
                    '0 0 20px rgba(34, 197, 94, 0.4), inset 0 0 20px rgba(34, 197, 94, 0.1)',
                }}
              />

              {/* Second orbit ring - Gold */}
              <div
                className="absolute border-2 rounded-full"
                style={{
                  width: dims.radius * 1.5,
                  height: dims.radius * 1.5,
                  borderImage: 'linear-gradient(45deg, #ffd700, #f59e0b, #d97706) 1',
                  boxShadow:
                    '0 0 20px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.1)',
                }}
              />

              {/* Third orbit ring - Green gradient */}
              <div
                className="absolute border-2 rounded-full"
                style={{
                  width: dims.radius * 2.5,
                  height: dims.radius * 2.5,
                  borderImage: 'linear-gradient(90deg, #22c55e, #ffd700, #22c55e) 1',
                  boxShadow:
                    '0 0 30px rgba(34, 197, 94, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.1)',
                }}
              />
            </>
          )}

          {/* Static particles (electrons) - frozen in place */}
          {[...Array(size === 'xl' ? 16 : size === 'lg' ? 12 : size === 'md' ? 8 : 4)].map(
            (_, i) => {
              const totalParticles =
                size === 'xl' ? 16 : size === 'lg' ? 12 : size === 'md' ? 8 : 4;
              const angle = (360 / totalParticles) * i * (Math.PI / 180);
              const radius =
                size === 'xl'
                  ? [20, 25, 30, 35][i % 4]
                  : size === 'lg'
                    ? [15, 20, 25][i % 3]
                    : size === 'md'
                      ? [8, 10, 12][i % 3]
                      : 3;

              // Distribute three colors: Gold, Green, Cyan
              const colorType = i % 3;
              const isGold = colorType === 0;
              const isGreen = colorType === 1;
              const isCyan = colorType === 2;

              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={i}
                  className={`${dims.particle} rounded-full absolute`}
                  style={{
                    background: isGold
                      ? 'radial-gradient(circle at 30% 30%, #ffd700, #f59e0b, #d97706)'
                      : isGreen
                        ? 'radial-gradient(circle at 30% 30%, #22c55e, #16a34a, #15803d)'
                        : 'radial-gradient(circle at 30% 30%, #06b6d4, #0ea5e9, #0284c7)',
                    boxShadow: isGold
                      ? '0 0 12px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4)'
                      : isGreen
                        ? '0 0 12px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.4)'
                        : '0 0 12px rgba(6, 182, 212, 0.8), 0 0 20px rgba(6, 182, 212, 0.4)',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Particle inner glow */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.6), transparent 70%)',
                    }}
                  />
                </div>
              );
            }
          )}
        </div>

        {/* Right bracket */}
        <span className={`${dims.bracket} ${bracketColor} font-mono font-bold`}>&gt;</span>
      </div>

      {/* Text - optional */}
      {withText && (
        <div className="text-center">
          <p className={`font-mono font-bold ${textGradient} text-sm`}>MAYCOLE TECH</p>
          <p className="text-xs text-slate-500">Official Brand</p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact Brand Icon
 * Perfect for favicons, small headers, and app icons
 */
export function BrandIcon({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: { container: 'w-8 h-8', ball: 'w-1 h-1', particle: 'w-0.5 h-0.5', radius: 2 },
    md: { container: 'w-12 h-12', ball: 'w-1.5 h-1.5', particle: 'w-0.5 h-0.5', radius: 3 },
    lg: { container: 'w-16 h-16', ball: 'w-2 h-2', particle: 'w-1 h-1', radius: 4 },
  };

  const dims = sizeMap[size];
  const totalParticles = size === 'sm' ? 6 : size === 'md' ? 8 : 12;

  return (
    <div className={`${dims.container} relative flex items-center justify-center`}>
      {/* Central nucleus */}
      <div
        className={`${dims.ball} rounded-full z-10 relative`}
        style={{
          background: 'radial-gradient(circle at 30% 30%, #ff4500, #ff0000, #dc143c)',
          boxShadow: '0 0 15px rgba(255, 69, 0, 0.8), 0 0 25px rgba(255, 0, 0, 0.6)',
        }}
      />

      {/* Orbiting particles */}
      {[...Array(totalParticles)].map((_, i) => {
        const angle = (360 / totalParticles) * i * (Math.PI / 180);
        const radius = dims.radius;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const colorType = i % 3;
        const isGold = colorType === 0;
        const isGreen = colorType === 1;
        const isCyan = colorType === 2;

        return (
          <div
            key={i}
            className={`${dims.particle} rounded-full absolute`}
            style={{
              background: isGold ? '#ffd700' : isGreen ? '#22c55e' : '#06b6d4',
              boxShadow: isGold
                ? '0 0 8px rgba(255, 215, 0, 0.8)'
                : isGreen
                  ? '0 0 8px rgba(34, 197, 94, 0.8)'
                  : '0 0 8px rgba(6, 182, 212, 0.8)',
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
}
