/* eslint-disable jsx-a11y/no-static-element-interactions */
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Truck, Shield, Award } from 'lucide-react';

export interface MerchandiseProduct {
  id: string;
  name: string;
  category: 'caps' | 'tshirts';
  description: string;
  price: number;
  image: string;
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  badge?: string;
}

interface MerchandiseSectionProps {
  onAddToCart?: (product: MerchandiseProduct) => void;
}

export function MerchandiseSection({ onAddToCart }: MerchandiseSectionProps) {
  const products: MerchandiseProduct[] = [
    // Caps Collection
    {
      id: 'cap-classic-black',
      name: 'MT Classic Cap - Black',
      category: 'caps',
      description:
        'Premium embroidered Maycole Technologies cap. Adjustable snapback closure with breathable mesh panels.',
      price: 24.99,
      image: 'https://via.placeholder.com/400x300?text=MT+Classic+Cap+Black',
      colors: ['Black', 'Navy', 'White'],
      sizes: ['One Size'],
      inStock: true,
      badge: 'BESTSELLER',
    },
    {
      id: 'cap-tech-blue',
      name: 'MT Tech Cap - Electric Blue',
      category: 'caps',
      description:
        'Modern tech-inspired design with 3D embroidered MT logo. Premium curved bill with UV protection.',
      price: 27.99,
      image: 'https://via.placeholder.com/400x300?text=MT+Tech+Cap+Blue',
      colors: ['Electric Blue', 'Charcoal', 'Red'],
      sizes: ['One Size'],
      inStock: true,
      badge: 'NEW',
    },
    {
      id: 'cap-limited-edition',
      name: 'MT Limited Edition Cap',
      category: 'caps',
      description:
        'Exclusive limited edition design with gold embroidery. Only 500 units produced worldwide.',
      price: 34.99,
      image: 'https://via.placeholder.com/400x300?text=MT+Limited+Edition+Cap',
      colors: ['Premium Black'],
      sizes: ['One Size'],
      inStock: true,
      badge: 'EXCLUSIVE',
    },

    // T-Shirt Collection
    {
      id: 'tshirt-classic-white',
      name: 'MT Classic T-Shirt - White',
      category: 'tshirts',
      description:
        '100% organic cotton t-shirt with embroidered MT logo. Premium comfort and durability.',
      price: 22.99,
      image: 'https://via.placeholder.com/400x300?text=MT+T-Shirt+White',
      colors: ['White', 'Black', 'Navy'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      inStock: true,
      badge: 'BESTSELLER',
    },
    {
      id: 'tshirt-tech-black',
      name: 'MT Tech T-Shirt - Black',
      category: 'tshirts',
      description:
        'Modern minimalist design with front print and back MT wordmark. Performance fabric blend.',
      price: 26.99,
      image: 'https://via.placeholder.com/400x300?text=MT+Tech+T-Shirt+Black',
      colors: ['Black', 'Dark Gray', 'Charcoal'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      inStock: true,
      badge: 'NEW',
    },
    {
      id: 'tshirt-ai-powered',
      name: 'AI-Powered T-Shirt',
      category: 'tshirts',
      description:
        'Bold design celebrating AI innovation. Premium print quality with glow-in-the-dark elements.',
      price: 29.99,
      image: 'https://via.placeholder.com/400x300?text=AI+Powered+T-Shirt',
      colors: ['Black', 'Navy', 'Gray'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      inStock: true,
    },
    {
      id: 'tshirt-limited-edition',
      name: 'MT Limited Edition T-Shirt',
      category: 'tshirts',
      description: 'Exclusive limited edition with premium embroidery. Only 200 units worldwide.',
      price: 39.99,
      image: 'https://via.placeholder.com/400x300?text=MT+Limited+Edition+Tee',
      colors: ['Premium Black'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      inStock: true,
      badge: 'EXCLUSIVE',
    },
  ];

  const caps = products.filter((p) => p.category === 'caps');
  const tshirts = products.filter((p) => p.category === 'tshirts');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-slate-900/50 dark:from-background dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Official MT Merchandise
          </h2>
          <p className="text-xl text-slate-400 mb-2">Wear the innovation. Support the community.</p>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Showcase your passion for Maycole Technologies with our premium branded merchandise
            collection.
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { icon: Shield, label: 'Premium Quality', desc: 'High-quality materials' },
            { icon: Truck, label: 'Fast Shipping', desc: '2-5 business days' },
            { icon: Award, label: 'Official Brand', desc: 'Authentic merchandise' },
          ].map((item, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
                <CardContent className="pt-6 text-center">
                  <item.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Caps Collection */}
        <div className="mb-20">
          <motion.h3
            className="text-3xl font-bold text-white mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600" />
            Premium Caps Collection
          </motion.h3>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {caps.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 h-full hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden group">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-slate-900 h-64">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                        {product.badge}
                      </Badge>
                    )}
                    {product.inStock && (
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="bg-green-600/90 text-white border-0">
                          In Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="pt-6">
                    <h4 className="font-bold text-lg text-white mb-2">{product.name}</h4>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Colors */}
                    {product.colors && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-400 mb-2">COLORS</p>
                        <div className="flex gap-2 flex-wrap">
                          {product.colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full border-2 border-slate-600 hover:border-blue-500 cursor-pointer transition-colors"
                              title={color}
                              style={{
                                backgroundColor: color.toLowerCase().includes('black')
                                  ? '#000'
                                  : color.toLowerCase().includes('white')
                                    ? '#fff'
                                    : color.toLowerCase().includes('blue')
                                      ? '#3b82f6'
                                      : color.toLowerCase().includes('navy')
                                        ? '#001f3f'
                                        : color.toLowerCase().includes('red')
                                          ? '#dc2626'
                                          : color.toLowerCase().includes('gray')
                                            ? '#6b7280'
                                            : '#666',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <span className="text-2xl font-bold text-blue-500">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => onAddToCart?.(product)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* T-Shirts Collection */}
        <div>
          <motion.h3
            className="text-3xl font-bold text-white mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600" />
            Premium T-Shirts Collection
          </motion.h3>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tshirts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 h-full hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden group">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-slate-900 h-64">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                        {product.badge}
                      </Badge>
                    )}
                    {product.inStock && (
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="bg-green-600/90 text-white border-0">
                          In Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="pt-6">
                    <h4 className="font-bold text-lg text-white mb-2">{product.name}</h4>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Sizes */}
                    {product.sizes && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-400 mb-2">SIZES</p>
                        <div className="flex gap-2 flex-wrap">
                          {product.sizes.map((size, idx) => (
                            <button
                              key={idx}
                              className="px-3 py-1 rounded border border-slate-600 hover:border-purple-500 text-sm text-slate-300 hover:text-white transition-colors hover:bg-slate-700/50"
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <span className="text-2xl font-bold text-purple-500">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => onAddToCart?.(product)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-400 mb-6">
            ✓ Free shipping on orders over $50 • ✓ 30-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
