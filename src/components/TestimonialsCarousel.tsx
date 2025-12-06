import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

/**
 * TestimonialsCarousel - Auto-rotating testimonials showcase
 *
 * Features:
 * - Auto-rotating carousel
 * - Manual navigation controls
 * - Star ratings display
 * - Responsive design
 * - Smooth animations
 *
 * Performance optimizations:
 * - Memoized testimonial data
 * - Optimized animation transitions
 * - Efficient state management
 */
export const TestimonialsCarousel = React.memo(() => {
  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'CEO',
        company: 'TechStart Inc',
        content:
          'MaycoleTechnologies transformed our workflow. The performance improvements were immediate and the support team was incredibly helpful.',
        rating: 5,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
      {
        id: 2,
        name: 'Michael Chen',
        role: 'Product Manager',
        company: 'DataFlow Solutions',
        content:
          'The analytics dashboard gave us insights we never had before. Our conversion rates increased by 45% within the first month.',
        rating: 5,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Operations Lead',
        company: 'CloudNine Systems',
        content:
          'Seamless integration with our existing infrastructure. The team handled everything professionally and on schedule.',
        rating: 4,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      },
      {
        id: 4,
        name: 'David Park',
        role: 'CTO',
        company: 'InnovateLab',
        content:
          'The codebase quality is exceptional. Built on modern best practices with excellent documentation.',
        rating: 5,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      },
      {
        id: 5,
        name: 'Lisa Thompson',
        role: 'Founder',
        company: 'GrowthHub',
        content:
          'Best investment we made for our tech stack. ROI was evident within weeks. Highly recommend!',
        rating: 5,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      },
    ],
    []
  );

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay, testimonials.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const handleDotClick = (index: number) => {
    setCurrent(index);
    setAutoPlay(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              What Our Clients Say
            </span>
          </h2>
          <p className="text-lg text-slate-400">Trusted by leading companies worldwide</p>
        </motion.div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto">
          {/* Testimonial Cards */}
          <div className="relative h-80 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Card className="h-full bg-slate-700 border-slate-600 flex flex-col justify-between p-8">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg italic text-slate-100 flex-grow">
                    "{testimonials[current].content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonials[current].avatar}
                      alt={testimonials[current].name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-white">{testimonials[current].name}</p>
                      <p className="text-sm text-slate-400">
                        {testimonials[current].role} at {testimonials[current].company}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="icon"
              className="border-slate-600 hover:bg-slate-700 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === current ? 'w-8 bg-blue-500' : 'w-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="border-slate-600 hover:bg-slate-700 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Auto-play Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-sm text-slate-400"
          >
            {autoPlay ? (
              <button
                onClick={() => setAutoPlay(false)}
                className="hover:text-slate-300 transition-colors"
              >
                Auto-playing • Pause
              </button>
            ) : (
              <button
                onClick={() => setAutoPlay(true)}
                className="hover:text-slate-300 transition-colors"
              >
                Paused • Resume
              </button>
            )}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-8 mt-16 text-center"
        >
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
            <p className="text-slate-400">Happy Clients</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">4.9★</div>
            <p className="text-slate-400">Average Rating</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
            <p className="text-slate-400">Uptime SLA</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

TestimonialsCarousel.displayName = 'TestimonialsCarousel';

export default TestimonialsCarousel;
