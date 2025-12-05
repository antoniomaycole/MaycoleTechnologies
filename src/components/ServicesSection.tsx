import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AtomicLogo } from './AtomicLogo';

export function ServicesSection() {
  const services = [
    {
      title: 'Custom Software Development',
      description: 'Tailored solutions built with modern technologies and best practices.',
      technologies: ['React', 'Spring Boot', 'Node.js', 'TypeScript'],
    },
    {
      title: 'Mobile Applications',
      description:
        'Native and cross-platform mobile apps that deliver exceptional user experiences.',
      technologies: ['React Native', 'Flutter', 'iOS', 'Android'],
    },
    {
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and migration services for modern businesses.',
      technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
    },
    {
      title: 'AI & Machine Learning',
      description: 'Intelligent systems that learn, adapt, and provide valuable insights.',
      technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'NLP'],
    },
    {
      title: 'Data Engineering',
      description: 'Robust data pipelines and analytics solutions for data-driven decisions.',
      technologies: ['PostgreSQL', 'MongoDB', 'Apache Kafka', 'Spark'],
    },
    {
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your digital assets.',
      technologies: ['OAuth', 'JWT', 'SSL/TLS', 'Penetration Testing'],
    },
  ];

  const agileTeam = [
    {
      role: 'Software Engineer',
      description: 'Builds and iterates on features in sprints',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      role: 'Product Manager',
      description: 'Defines backlog, prioritizes features, interfaces with users',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
    },
    {
      role: 'Scrum Master',
      description: 'Facilitates Agile ceremonies, removes blockers',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      role: 'Agile Coach',
      description: 'Trains teams in Agile principles and practices',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
    },
    {
      role: 'UI/UX Designer',
      description: 'Designs user flows and interfaces for iterative testing',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      role: 'QA Engineer',
      description: 'Tests features rapidly and continuously',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
    },
    {
      role: 'DevOps Engineer',
      description: 'Automates deployment and supports continuous integration',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">Our Services</h2>

          {/* Legacy Vision Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <div className="bg-black rounded-2xl p-8 border border-green-500/30 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-center mb-4">
                <AtomicLogo size="xs" />
                <div className="ml-3 h-px flex-1 bg-gradient-to-r from-green-300 to-yellow-300"></div>
                <AtomicLogo size="xs" />
              </div>
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed bg-gradient-to-r from-green-700 via-green-600 to-yellow-600 bg-clip-text text-transparent">
                "<span className="maycole-gradient-text">MaycoleTechnologies</span>
                <sup className="maycole-trademark">™</sup> isn't just a tech brand—it's a legacy in
                motion. We're architecting systems that belong on the public stage, powered by
                founder-grade logic and IP-aware execution."
              </blockquote>
              <div className="mt-4 flex items-center justify-center">
                <div className="h-px flex-1 bg-gradient-to-r from-green-300 to-yellow-300"></div>
                <div className="mx-4 w-2 h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"></div>
                <div className="h-px flex-1 bg-gradient-to-r from-yellow-300 to-green-300"></div>
              </div>
            </div>
          </motion.div>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            From concept to deployment, we provide comprehensive technology solutions that drive
            innovation and deliver measurable results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-yellow-100 rounded-xl flex items-center justify-center mb-4">
                      <AtomicLogo size="xs" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Agile Services & Expert Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
                Agile Services & Expert Team
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full mx-auto mb-6"></div>
            </div>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">
              Our dedicated team of Agile professionals brings together expertise, innovation, and
              proven methodologies to deliver exceptional results. Meet the specialists who make
              your vision a reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agileTeam.map((member, index) => {
              return (
                <motion.div
                  key={member.role}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <Card className="h-full relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${member.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    ></div>

                    <CardHeader className="relative z-10 pb-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <AtomicLogo size="sm" />
                      </div>
                      <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-yellow-600 transition-all duration-300">
                        {member.role}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {member.description}
                      </p>

                      {/* Decorative elements */}
                      <div
                        className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br ${member.color} opacity-10 rounded-full group-hover:scale-150 group-hover:opacity-20 transition-all duration-500`}
                      ></div>
                      <div
                        className={`absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-br ${member.color} opacity-5 rounded-full group-hover:scale-125 transition-all duration-500`}
                      ></div>
                    </CardContent>

                    {/* Premium border effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-[1px] rounded-lg bg-white/90 group-hover:bg-white/95 transition-colors Duration-300"></div>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-transparent to-gray-100/30"></div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Call to Action for Agile Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-3xl p-8 max-w-4xl mx-auto border border-green-100/50 shadow-xl">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                Ready to Transform Your Development Process?
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Our expert Agile team is ready to accelerate your project delivery, improve quality,
                and enhance collaboration across your organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Your Agile Journey
                </motion.button>
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule Consultation
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
