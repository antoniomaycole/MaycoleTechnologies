import { motion } from 'motion/react';
import { useState, FormEvent } from 'react';
import { Button } from './ui/button';
import { IconButton } from './ui/icon-button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { sendContactEmail, ContactFormData } from '../lib/email';
import { toast } from 'sonner';

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendContactEmail(formData);

      if (result.success) {
        toast.success(result.message);
        setIsSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            company: '',
            message: '',
          });
          setIsSubmitted(false);
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      iconName: 'Globe' as const,
      title: 'Website',
      value: 'maycoletechnologies.com',
      link: 'https://maycoletechnologies.com',
      platform: 'web',
    },
    {
      iconName: 'Mail' as const,
      title: 'Email',
      value: 'help@maycoletechnologies.com',
      link: 'mailto:help@maycoletechnologies.com',
      platform: 'web',
    },
    {
      iconName: 'Phone' as const,
      title: 'Phone',
      value: '(213) 312-7814',
      link: 'tel:+12133127814',
      platform: 'mobile',
    },
    {
      iconName: 'MapPin' as const,
      title: 'Location',
      value: 'Global Remote Team',
      link: '#',
      platform: 'web',
    },
  ];

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Let's Build Something Amazing
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Ready to transform your ideas into reality? Get in touch with our team and let's discuss
            how we can help change lives through technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">First Name</label>
                    <Input
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Last Name</label>
                    <Input
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2">Company</label>
                  <Input
                    placeholder="Your Company"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us about your project..."
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                  />
                </div>
                <Button className="w-full group" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isSubmitted ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  )}
                  {isSubmitting ? 'Sending...' : isSubmitted ? 'Sent!' : 'Send Message'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6">Get in touch</h3>
              <p className="text-gray-300 mb-8">
                We're here to help you succeed. Reach out to us through any of these channels, and
                we'll get back to you within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                return (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors group"
                  >
                    <IconButton
                      iconName={info.iconName}
                      size="lg"
                      variant="default"
                      className="!h-12 !w-12 flex-shrink-0"
                      disabled
                    />
                    <div>
                      <h4 className="font-medium">{info.title}</h4>
                      <p className="text-gray-300">{info.value}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl border">
              <h4 className="font-semibold mb-2">Ready to start your project?</h4>
              <p className="text-gray-300 mb-4">
                Schedule a free consultation to discuss your requirements and get a detailed
                proposal.
              </p>
              <Button variant="outline">Schedule Consultation</Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
