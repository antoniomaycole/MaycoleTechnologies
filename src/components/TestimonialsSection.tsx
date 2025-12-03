import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Star, Quote, Building2, TrendingUp, Shield, Zap } from 'lucide-react';
import { Badge } from './ui/badge';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  industry: string;
  image: string;
  rating: number;
  text: string;
  metric?: string;
  metricValue?: string;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Chief Operations Officer",
    company: "GlobalTech Industries",
    industry: "Manufacturing",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    rating: 5,
    text: "MaycoleTracker™ transformed our inventory management completely. We reduced errors by 94% and saved over $2M annually. The AI predictions are incredibly accurate, and the real-time insights have given us a competitive edge we never had before.",
    metric: "Cost Savings",
    metricValue: "$2M+ annually",
    featured: true
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "VP of Finance",
    company: "Pinnacle Retail Group",
    industry: "Retail",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    rating: 5,
    text: "MaycoleCheckBook™ has revolutionized how we handle financial tracking. The AI-powered insights help us make data-driven decisions in real-time. Implementation was seamless, and ROI was achieved within 3 months.",
    metric: "ROI Timeline",
    metricValue: "3 months",
    featured: true
  },
  {
    id: 3,
    name: "Emily Thompson",
    role: "Director of IT",
    company: "Apex Healthcare Solutions",
    industry: "Healthcare",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    rating: 5,
    text: "The level of professionalism and innovation from MaycoleTechnologies™ is unmatched. Their agile approach and Spring Logic framework delivered exactly what we needed. Support team is outstanding!",
    metric: "Efficiency Gain",
    metricValue: "87% faster"
  },
  {
    id: 4,
    name: "David Park",
    role: "CEO",
    company: "TechForward Solutions",
    industry: "Technology",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    rating: 5,
    text: "Working with Antonio and his team has been phenomenal. The MAYCOLE Method™ is a game-changer. Our operations are now fully optimized, and we're scaling faster than ever imagined.",
    metric: "Growth Rate",
    metricValue: "340% increase"
  },
  {
    id: 5,
    name: "Jennifer Martinez",
    role: "Operations Manager",
    company: "Summit Logistics",
    industry: "Logistics",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
    rating: 5,
    text: "The real-time tracking and AI-powered alerts have eliminated stockouts completely. Our customers are happier, and our bottom line has never looked better. Best investment we've made!",
    metric: "Stockout Reduction",
    metricValue: "100%"
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Financial Controller",
    company: "Meridian Enterprises",
    industry: "Finance",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 5,
    text: "MaycoleTechnologies™ delivers enterprise-grade solutions with a level of care that's rare in the industry. The system integrates perfectly with our existing tools. Couldn't be happier!",
    metric: "Integration Time",
    metricValue: "< 2 weeks"
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Star className="w-6 h-6 text-maycole-gold fill-maycole-gold" />
            <Star className="w-6 h-6 text-maycole-gold fill-maycole-gold" />
            <Star className="w-6 h-6 text-maycole-gold fill-maycole-gold" />
            <Star className="w-6 h-6 text-maycole-gold fill-maycole-gold" />
            <Star className="w-6 h-6 text-maycole-gold fill-maycole-gold" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="maycole-gradient-text inline-block leading-tight pb-1">
              Trusted by Industry Leaders
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of companies transforming their operations with <span className="maycole-gradient-text">MaycoleTechnologies</span><span className="maycole-trademark">™</span>
          </p>
          
          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { icon: Building2, value: '500+', label: 'Enterprise Clients' },
              { icon: TrendingUp, value: '99.9%', label: 'Uptime SLA' },
              { icon: Shield, value: '100%', label: 'Data Security' },
              { icon: Zap, value: '4.9/5', label: 'Customer Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Testimonials - Large Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.filter(t => t.featured).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="maycole-card h-full border-2 border-maycole-green/20 hover:border-maycole-green/40 transition-all duration-300">
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <Quote className="w-12 h-12 text-maycole-green/20 mb-4" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-maycole-gold fill-maycole-gold" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Metric Badge */}
                  {testimonial.metric && (
                    <Badge className="bg-gradient-to-r from-maycole-green to-maycole-gold text-white mb-6 px-4 py-2 text-sm">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {testimonial.metric}: {testimonial.metricValue}
                    </Badge>
                  )}

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-maycole-green/20"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-maycole-green font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Regular Testimonials - Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.filter(t => !t.featured).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="maycole-card h-full hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-maycole-gold fill-maycole-gold" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-4">
                    "{testimonial.text}"
                  </p>

                  {/* Metric */}
                  {testimonial.metric && (
                    <div className="bg-maycole-green/10 rounded-lg p-2 mb-4 text-center">
                      <div className="text-xs text-gray-600">{testimonial.metric}</div>
                      <div className="text-sm font-bold text-maycole-green">{testimonial.metricValue}</div>
                    </div>
                  )}

                  {/* Author Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-maycole-green/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">{testimonial.name}</div>
                      <div className="text-xs text-gray-600 truncate">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">
            Join these successful companies and transform your business today
          </p>
          <a href="#contact" className="maycole-btn-primary inline-block px-8 py-4 text-lg">
            Get Started Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
