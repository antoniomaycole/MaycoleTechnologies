import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Award, Trophy, Star, Shield, TrendingUp, Users } from 'lucide-react';

const awards = [
  {
    icon: Trophy,
    title: 'Best SaaS Product 2024',
    organization: 'Tech Innovation Awards',
    year: '2024',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    icon: Star,
    title: 'Top Rated Inventory Management',
    organization: 'G2 Software Reviews',
    year: '2024',
    color: 'from-maycole-green to-green-600',
  },
  {
    icon: Award,
    title: 'Excellence in AI Innovation',
    organization: 'Enterprise Tech Summit',
    year: '2024',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: Shield,
    title: 'SOC 2 Type II Certified',
    organization: 'Security Compliance',
    year: '2024',
    color: 'from-purple-400 to-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Fastest Growing Startup',
    organization: 'Business Excellence Awards',
    year: '2023',
    color: 'from-red-400 to-red-600',
  },
  {
    icon: Users,
    title: 'Customer Choice Award',
    organization: 'Capterra Reviews',
    year: '2024',
    color: 'from-maycole-gold to-orange-600',
  },
];

const certifications = [
  'SOC 2 Type II',
  'ISO 27001',
  'GDPR Compliant',
  'WCAG 2.1 AA',
  'PCI DSS Level 1',
  'HIPAA Ready',
];

export function AwardsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-maycole-gold/10 px-4 py-2 rounded-full mb-6">
            <Trophy className="w-5 h-5 text-maycole-gold" />
            <span className="text-sm font-semibold text-gray-900">Awards & Recognition</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="maycole-gradient-text inline-block leading-tight pb-1">
              Industry Recognition
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Trusted and recognized by leading industry organizations worldwide
          </p>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="maycole-card h-full hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6 text-center">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${award.color} rounded-2xl flex items-center justify-center`}
                  >
                    <award.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-bold text-gray-900 mb-2">{award.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{award.organization}</p>
                  <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {award.year}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Certifications Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-maycole-green" />
                <h3 className="text-xl font-bold text-gray-900">
                  Security & Compliance Certifications
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white border-2 border-maycole-green/20 rounded-lg p-4 text-center hover:border-maycole-green hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-maycole-green/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-maycole-green" />
                    </div>
                    <div className="font-semibold text-xs text-gray-900">{cert}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '15+', label: 'Industry Awards' },
              { value: '6', label: 'Certifications' },
              { value: '4.9/5', label: 'Average Rating' },
              { value: '500+', label: 'Enterprise Clients' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold maycole-gradient-text mb-2 inline-block leading-tight pb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
