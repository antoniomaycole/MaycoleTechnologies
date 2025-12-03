import { motion } from 'motion/react';
import { Badge } from './ui/badge';

export function TechnologiesSection() {
  const techCategories = [
    {
      category: "Frontend",
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Angular"]
    },
    {
      category: "Backend",
      technologies: ["Spring Boot", "Node.js", "Python", "Java", "C#", ".NET Core"]
    },
    {
      category: "Cloud & DevOps",
      technologies: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Jenkins"]
    },
    {
      category: "Databases",
      technologies: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "MySQL", "Oracle"]
    },
    {
      category: "AI & ML",
      technologies: ["TensorFlow", "PyTorch", "OpenAI", "Hugging Face", "Scikit-learn", "Pandas"]
    },
    {
      category: "Mobile",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin", "Ionic"]
    }
  ];

  return (
    <section id="technologies" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Technology Stack
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We leverage the latest and most reliable technologies to build robust, 
            scalable solutions that stand the test of time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border"
            >
              <h3 className="text-xl font-semibold mb-4 text-green-600">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (techIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <Badge 
                      variant="outline" 
                      className="hover:bg-green-600 hover:text-yellow-100 transition-colors cursor-default border-green-200"
                    >
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}