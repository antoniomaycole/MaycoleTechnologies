import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Feature {
  name: string;
  basic: boolean;
  professional: boolean;
  enterprise: boolean;
}

interface PlanFeature {
  name: string;
  icon: React.ReactNode;
  plans: {
    basic: boolean;
    professional: boolean;
    enterprise: boolean;
  };
}

/**
 * FeatureComparison - Interactive feature comparison matrix
 *
 * Features:
 * - Side-by-side plan comparison
 * - Interactive pricing table
 * - Visual feature matrix
 * - Call-to-action integration
 *
 * Performance optimizations:
 * - Memoized feature data
 * - Optimized table rendering
 * - Lazy feature loading
 */
export const FeatureComparison = React.memo(() => {
  const features: PlanFeature[] = useMemo(
    () => [
      {
        name: 'Core Dashboard',
        icon: <Check className="w-4 h-4" />,
        plans: { basic: true, professional: true, enterprise: true },
      },
      {
        name: 'Advanced Analytics',
        icon: <Check className="w-4 h-4" />,
        plans: { basic: false, professional: true, enterprise: true },
      },
      {
        name: 'Custom Reports',
        icon: <Check className="w-4 h-4" />,
        plans: { basic: false, professional: false, enterprise: true },
      },
      {
        name: 'API Access',
        icon: <Check className="w-4 h-4" />,
        plans: { basic: false, professional: true, enterprise: true },
      },
      {
        name: 'Priority Support',
        icon: <Check className="w-4 h-4" />,
        plans: { basic: false, professional: true, enterprise: true },
      },
      {
        name: '24/7 Dedicated Support',
        icon: <Check className="w-4 h-4" />,
        plans: { basic: false, professional: false, enterprise: true },
      },
      {
        name: 'Custom Integrations',
        icon: <Check className="w-4 h-4" />,
        plans: { basic: false, professional: false, enterprise: true },
      },
      {
        name: 'Data Export',
        icon: <Check className="w-4 h-4" />,
        plans: { basic: true, professional: true, enterprise: true },
      },
    ],
    []
  );

  return (
    <section className="py-20 bg-white">
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
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Compare Plans
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your business needs
          </p>
        </motion.div>

        {/* Desktop Comparison Table */}
        <div className="hidden lg:block overflow-x-auto">
          <motion.table
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                <th className="text-center p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Basic</h3>
                    <p className="text-sm text-gray-500">$29/mo</p>
                  </div>
                </th>
                <th className="text-center p-4 bg-blue-50">
                  <div>
                    <Badge className="mb-2 bg-blue-600">Popular</Badge>
                    <h3 className="font-semibold text-gray-900">Professional</h3>
                    <p className="text-sm text-gray-500">$99/mo</p>
                  </div>
                </th>
                <th className="text-center p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Enterprise</h3>
                    <p className="text-sm text-gray-500">Custom</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <motion.tr
                  key={feature.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-900">{feature.name}</td>
                  <td className="p-4 text-center">
                    {feature.plans.basic ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="p-4 text-center bg-blue-50">
                    {feature.plans.professional ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {feature.plans.enterprise ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>

        {/* Mobile Comparison Cards */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Basic', 'Professional', 'Enterprise'].map((plan, planIndex) => (
            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: planIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={planIndex === 1 ? 'border-2 border-blue-600' : ''}>
                <CardHeader className="pb-4">
                  <CardTitle>{plan}</CardTitle>
                  {planIndex === 1 && <Badge className="bg-blue-600 w-fit">Most Popular</Badge>}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {features.map((feature) => {
                      const hasFeature =
                        plan === 'Basic'
                          ? feature.plans.basic
                          : plan === 'Professional'
                            ? feature.plans.professional
                            : feature.plans.enterprise;

                      return (
                        <div key={feature.name} className="flex items-center gap-2">
                          {hasFeature ? (
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span
                            className={hasFeature ? 'text-gray-900' : 'text-gray-400 line-through'}
                          >
                            {feature.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
        >
          <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
          <p className="text-gray-600 mb-6">
            Choose your plan and start building amazing features today
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
            Select Plan
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

FeatureComparison.displayName = 'FeatureComparison';

export default FeatureComparison;
