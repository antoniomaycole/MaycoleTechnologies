import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { StillBrandLogo, BrandIcon } from './StillBrandLogo';

/**
 * MT Merchandise with Brand Logo Display
 * Showcases how the still logo looks on actual merchandise
 */

export function MerchandiseBrandDisplay() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-slate-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Official MT Brand
          </h2>
          <p className="text-xl text-slate-400">Iconic logo on premium merchandise</p>
        </motion.div>

        {/* Logo Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Large Logo */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 w-full flex justify-center">
              <StillBrandLogo size="lg" variant="dark" withText={false} />
            </Card>
            <p className="mt-4 text-slate-400 text-sm">Full Logo (Branding)</p>
          </motion.div>

          {/* Medium Logo */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 w-full flex justify-center">
              <StillBrandLogo size="md" variant="dark" withText={false} />
            </Card>
            <p className="mt-4 text-slate-400 text-sm">Hat Logo</p>
          </motion.div>

          {/* Icon */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 w-full flex justify-center">
              <BrandIcon size="lg" />
            </Card>
            <p className="mt-4 text-slate-400 text-sm">Icon (Website)</p>
          </motion.div>
        </div>

        {/* Merchandise Display */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">Logo on Products</h3>
          <p className="text-slate-400">See the MT brand logo on your merchandise</p>
        </motion.div>

        {/* Product Mockups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cap with Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-blue-500/50 transition-colors">
              <CardContent className="p-8">
                {/* Cap mockup */}
                <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg p-8 mb-6 flex justify-center items-center h-64">
                  <div className="relative">
                    <div className="text-6xl">🧢</div>
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                      <StillBrandLogo size="sm" variant="dark" withText={false} />
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white mb-2">MT Classic Cap</h4>
                <p className="text-slate-400 text-sm mb-4">
                  Premium embroidered MT logo on front. Adjustable snapback closure.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-500">$24.99</span>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    View
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* T-Shirt with Logo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-purple-500/50 transition-colors">
              <CardContent className="p-8">
                {/* T-shirt mockup */}
                <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg p-8 mb-6 flex justify-center items-center h-64">
                  <div className="relative">
                    <div className="text-8xl">👕</div>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                      <StillBrandLogo size="md" variant="dark" withText={false} />
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white mb-2">MT Classic T-Shirt</h4>
                <p className="text-slate-400 text-sm mb-4">
                  Front print with embroidered MT logo. 100% organic cotton.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-500">$22.99</span>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    View
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Logo Variations */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Logo Variations</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dark variant */}
            <Card className="bg-slate-800/50 border-slate-700 p-8">
              <CardContent className="flex flex-col items-center">
                <StillBrandLogo size="md" variant="dark" withText={true} />
                <p className="mt-6 text-slate-400 text-center text-sm">
                  Dark variant for light backgrounds (merchandise, websites)
                </p>
              </CardContent>
            </Card>

            {/* Light variant */}
            <Card className="bg-white/5 border-slate-700 p-8">
              <CardContent className="flex flex-col items-center">
                <StillBrandLogo size="md" variant="light" withText={true} />
                <p className="mt-6 text-slate-400 text-center text-sm">
                  Light variant for dark backgrounds (packaging, print)
                </p>
              </CardContent>
            </Card>

            {/* Gradient variant */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-8">
              <CardContent className="flex flex-col items-center">
                <StillBrandLogo size="md" variant="gradient" withText={true} />
                <p className="mt-6 text-slate-400 text-center text-sm">
                  Gradient variant for digital use (social media, websites)
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Size Reference */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Size Reference</h3>

          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <StillBrandLogo size={s} variant="dark" withText={false} />
                  <p className="mt-4 text-slate-400 text-sm capitalize">{s}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Brand Guidelines */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-blue-600/20 border-blue-500/50 p-8">
            <CardContent>
              <h4 className="text-xl font-bold text-white mb-4">Brand Guidelines</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Use the MT logo on all merchandise and marketing materials</li>
                <li>✓ Minimum size: 12mm for embroidered logos on merchandise</li>
                <li>✓ Always maintain clear space around the logo (at least 10mm)</li>
                <li>✓ Available in dark, light, and gradient variants</li>
                <li>
                  ✓ Color palette: Gold (#ffd700), Green (#22c55e), Cyan (#06b6d4), Red (#ff0000)
                </li>
                <li>✓ Use full logo for main branding, icon version for small applications</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
