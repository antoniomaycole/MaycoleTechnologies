import { motion } from 'motion/react';
import { AtomicLogo } from './AtomicLogo';

export function TickerTape() {
  const products = [
    { name: "MaycoleCheckBook", status: "🚀 LIVE" },
    { name: "MaycoleTracker", status: "📊 ENTERPRISE" },
    { name: "MaycoleRobotics", status: "🔧 IN DEVELOPMENT" },
    { name: "Gabriel App", status: "⚡ BETA" },
    { name: "MaycoleAI", status: "🧠 COMING SOON" },
    { name: "MaycoleSuite", status: "📊 ENTERPRISE" },
    { name: "MaycoleCloud", status: "☁️ LAUNCHING Q2" },
    { name: "MaycoleFlow", status: "🌊 PREVIEW" },
    { name: "MaycoleVision", status: "👁️ R&D" },
    { name: "MaycoleMind", status: "🤖 AI POWERED" },
    { name: "MaycoleEdge", status: "⚡ NEXT-GEN" },
    { name: "MaycoleCore", status: "🔋 FOUNDATION" },
    { name: "MaycoleFusion", status: "🔥 REVOLUTIONARY" }
  ];

  // Duplicate the products array to create seamless loop
  const allProducts = [...products, ...products];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-yellow-600 text-white py-3 shadow-lg border-y border-green-500/30">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:20px_20px] animate-pulse opacity-20"></div>
      
      {/* Ticker content */}
      <div className="relative flex items-center">
        {/* Ticker label */}
        <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-1 rounded-r-full mr-4 flex-shrink-0">
          <AtomicLogo size="xs" />
          <span className="ml-2 font-bold text-sm tracking-wide">MAYCOLE PRODUCTS</span>
        </div>

        {/* Scrolling content container */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex items-center space-x-8 whitespace-nowrap"
            animate={{
              x: [0, -50 * allProducts.length]
            }}
            transition={{
              duration: 60,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {allProducts.map((product, index) => (
              <div key={`${product.name}-${index}`} className="flex items-center space-x-2 flex-shrink-0">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="font-bold text-sm tracking-wide">{product.name}</span>
                  <span className="text-xs opacity-90 bg-white/20 px-2 py-1 rounded-full">
                    {product.status}
                  </span>
                </div>
                
                {/* Separator */}
                <div className="text-yellow-400 text-xl font-bold mx-4">•</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Market info */}
        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm px-4 py-1 rounded-l-full ml-4 flex-shrink-0">
          <div className="text-xs">
            <span className="text-yellow-400 font-bold">INNOVATION INDEX</span>
            <span className="ml-2 text-green-200">↗ +∞</span>
          </div>
        </div>
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-green-600 to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-yellow-600 to-transparent pointer-events-none z-10"></div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-yellow-400/20 animate-pulse"></div>
    </div>
  );
}