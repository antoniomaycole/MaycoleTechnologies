import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Brain, Zap, Target, Users } from 'lucide-react';

export function AboutSection() {
  const features = [
    {
      icon: Brain,
      title: 'Innovative Intelligence',
      description:
        'Leveraging cutting-edge AI and machine learning to create intelligent solutions that adapt and evolve.',
    },
    {
      icon: Zap,
      title: 'Agile Excellence',
      description:
        'Fast, iterative development cycles that deliver value quickly while maintaining the highest quality standards.',
    },
    {
      icon: Target,
      title: 'Spring Logic',
      description:
        'Robust, scalable architectures built on proven frameworks that ensure reliability and performance.',
    },
    {
      icon: Users,
      title: 'Life-Changing Impact',
      description:
        "Every product we create is designed to make a meaningful difference in people's lives and businesses.",
    },
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 maycole-gradient-text">
            Transforming Ideas into Reality
          </h2>
          <p className="text-lg text-white max-w-3xl mx-auto">
            At <span className="maycole-gradient-text">MaycoleTechnologies</span>
            <span className="maycole-trademark">™</span>, we believe in the power of technology to
            transform lives. Our team of innovators combines cutting-edge intelligence with agile
            methodologies to deliver products that don't just meet expectations—they exceed them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = [
              {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                icon: 'text-blue-600',
                title: 'text-gray-900',
                text: 'text-gray-700',
              },
              {
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                icon: 'text-purple-600',
                title: 'text-gray-900',
                text: 'text-gray-700',
              },
              {
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                icon: 'text-emerald-600',
                title: 'text-gray-900',
                text: 'text-gray-700',
              },
              {
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                icon: 'text-amber-600',
                title: 'text-gray-900',
                text: 'text-gray-700',
              },
            ];
            const color = colors[index];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`h-full hover:shadow-2xl hover:scale-105 transition-all ${color.bg} ${color.border} border-2`}
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-12 h-12 bg-white border ${color.border} rounded-lg flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`w-6 h-6 ${color.icon}`} />
                    </div>
                    <CardTitle className={`text-lg ${color.title} font-bold`}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`${color.text} text-center text-sm`}>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Founder Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-black border-maycole-green shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl">
                <span className="maycole-gradient-text">Meet the Founder</span>
              </CardTitle>
              <h3 className="text-xl font-bold text-maycole-gold mt-2">Antonio G. Maycole</h3>
              <p className="text-base text-white mt-1">
                Founder & Architect of{' '}
                <span className="maycole-gradient-text">MaycoleTechnologies</span>
                <span className="maycole-trademark">™</span>
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-white leading-relaxed space-y-4">
                <p className="text-base">
                  Antonio G. Maycole, the founder of{' '}
                  <span className="font-semibold maycole-gradient-text">MaycoleTechnologies</span>,
                  is a builder and architect focused on creating teachable, scalable systems for
                  various sectors, including inventory, robotics, music, and faith-tech. He designs
                  proprietary frameworks and modular sprint logic to make practical wisdom and
                  technology more accessible. His work, documented and built to endure, is guided by
                  the <span className="font-semibold maycole-gradient-text">MAYCOLE Method™</span>.
                </p>
              </div>

              <div className="bg-black/80 rounded-xl p-6 border border-maycole-green">
                <h4 className="text-xl font-bold mb-4 maycole-gradient-text">
                  A Breakthrough into Tech
                </h4>
                <div className="text-white leading-relaxed space-y-4">
                  <p className="text-base">
                    Maycole's path into technology is an unconventional one. He had no prior
                    experience-so he thought-and no interest in the field. He had asked God to
                    direct his life, but what he didn't know was, like King David in the fields
                    trained by God to defeat lions and bears, so was Antonio in the field. He
                    received certificates, trophies and awards in a{' '}
                    <span className="font-semibold text-maycole-green">game called Python</span>. He
                    was immediately captivated and began seeking out similar fun "games," which were
                    actually interactive coding platforms for programming languages like SQL, CSS,
                    JavaScript, TypeScript and JSON.
                  </p>

                  <p className="text-base">
                    What he didn't realize at the time was that he was already being directed by
                    building objects and "breaking codes" through these activities, a testament to
                    his natural affinity for{' '}
                    <span className="font-semibold text-maycole-gold">
                      software architecture and machine learning engineering
                    </span>
                    , which he now considers his passion. Maycole explained that he found these
                    challenges fun and easy. His journey culminated in his decision to study with
                    "Google Coursera" and became a Cybersecurity Analyst, specializing in Digital
                    Forensics and as he puts it,{' '}
                    <span className="italic">"the rest is history."</span>
                  </p>

                  <div className="bg-maycole-green/20 rounded-lg p-4 border-l-4 border-maycole-green">
                    <p className="text-base font-medium text-white">
                      This unique story highlights how Maycole, a{' '}
                      <span className="font-bold text-maycole-gold">
                        "genius who found his true passion,"
                      </span>{' '}
                      was intuitively drawn to technology long before he formally entered the field.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
