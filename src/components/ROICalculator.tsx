import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Calculator, TrendingUp, DollarSign, Clock, Users, Zap, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

export function ROICalculator() {
  const [employees, setEmployees] = useState(50);
  const [avgHourlyRate, setAvgHourlyRate] = useState(25);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [errorRate, setErrorRate] = useState(15);

  // Calculations
  const currentMonthlyCost = (employees * avgHourlyRate * hoursPerWeek * 4.33).toFixed(0);
  const withMaycole = (parseFloat(currentMonthlyCost) * 0.25).toFixed(0); // 75% reduction
  const monthlySavings = (parseFloat(currentMonthlyCost) - parseFloat(withMaycole)).toFixed(0);
  const annualSavings = (parseFloat(monthlySavings) * 12).toFixed(0);
  const errorCostReduction = (parseFloat(currentMonthlyCost) * (errorRate / 100) * 0.94).toFixed(0); // 94% error reduction
  const totalMonthlySavings = (parseFloat(monthlySavings) + parseFloat(errorCostReduction)).toFixed(0);
  const totalAnnualSavings = (parseFloat(totalMonthlySavings) * 12).toFixed(0);
  const subscriptionCost = 99; // Professional plan
  const netMonthlySavings = (parseFloat(totalMonthlySavings) - subscriptionCost).toFixed(0);
  const netAnnualSavings = (parseFloat(netMonthlySavings) * 12).toFixed(0);
  const roiPercentage = ((parseFloat(netAnnualSavings) / (subscriptionCost * 12)) * 100).toFixed(0);
  const paybackPeriod = (subscriptionCost / parseFloat(netMonthlySavings)).toFixed(1);

  return (
    <section id="roi-calculator" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-2xl mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="maycole-gradient-text inline-block leading-tight pb-1">
              Calculate Your ROI
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how much you can save with <span className="maycole-gradient-text">MaycoleTechnologies</span><span className="maycole-trademark">™</span> solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Calculator Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="maycole-card h-full">
              <CardHeader>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-maycole-green" />
                  Your Current Operations
                </h3>
                <p className="text-gray-600 mt-2">Enter your current metrics to calculate potential savings</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Number of Employees */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Number of Employees Managing Inventory/Finance
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="500"
                      value={employees}
                      onChange={(e) => setEmployees(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-maycole-green"
                      aria-label="Number of employees"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">1 employee</span>
                      <span className="text-2xl font-bold text-maycole-green">{employees}</span>
                      <span className="text-sm text-gray-600">500 employees</span>
                    </div>
                  </div>
                </div>

                {/* Average Hourly Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Average Hourly Rate ($)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="15"
                      max="150"
                      value={avgHourlyRate}
                      onChange={(e) => setAvgHourlyRate(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-maycole-green"
                      aria-label="Average hourly rate"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">$15/hr</span>
                      <span className="text-2xl font-bold text-maycole-green">${avgHourlyRate}</span>
                      <span className="text-sm text-gray-600">$150/hr</span>
                    </div>
                  </div>
                </div>

                {/* Hours Per Week */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Hours Spent Per Week on Manual Tasks
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-maycole-green"
                      aria-label="Hours per week on manual tasks"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">1 hr/week</span>
                      <span className="text-2xl font-bold text-maycole-green">{hoursPerWeek}h</span>
                      <span className="text-sm text-gray-600">40 hrs/week</span>
                    </div>
                  </div>
                </div>

                {/* Error Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Current Error Rate (%)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={errorRate}
                      onChange={(e) => setErrorRate(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-maycole-green"
                      aria-label="Current error rate"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">0%</span>
                      <span className="text-2xl font-bold text-maycole-green">{errorRate}%</span>
                      <span className="text-sm text-gray-600">30%</span>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-maycole-green/10 rounded-lg p-4 border border-maycole-green/20">
                  <p className="text-sm text-gray-700">
                    <strong>Industry averages:</strong> Most companies spend 10-15 hours/week on manual tracking, with error rates of 10-20%.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Side - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="maycole-card h-full bg-gradient-to-br from-maycole-green to-maycole-gold text-white">
              <CardHeader>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Your Projected Savings
                </h3>
                <p className="text-white/90 mt-2">With MaycoleTracker™ or MaycoleCheckBook™</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Monthly Savings */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm font-medium">Monthly Savings</span>
                    </div>
                    <div className="text-3xl font-bold">${parseInt(netMonthlySavings).toLocaleString()}</div>
                  </div>

                  {/* Annual Savings */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm font-medium">Annual Savings</span>
                    </div>
                    <div className="text-3xl font-bold">${parseInt(netAnnualSavings).toLocaleString()}</div>
                  </div>

                  {/* ROI Percentage */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm font-medium">ROI</span>
                    </div>
                    <div className="text-3xl font-bold">{roiPercentage}%</div>
                  </div>

                  {/* Payback Period */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm font-medium">Payback Period</span>
                    </div>
                    <div className="text-3xl font-bold">{paybackPeriod} mo</div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                  <h4 className="font-semibold text-lg mb-4">Savings Breakdown</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90">Current Monthly Cost:</span>
                      <span className="font-bold">${parseInt(currentMonthlyCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/90">With MaycoleTechnologies™:</span>
                      <span className="font-bold">${parseInt(withMaycole).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/20">
                      <span className="text-white/90">Time Savings (75%):</span>
                      <span className="font-bold text-green-300">+${parseInt(monthlySavings).toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/90">Error Reduction (94%):</span>
                      <span className="font-bold text-green-300">+${parseInt(errorCostReduction).toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/90">Subscription Cost:</span>
                      <span className="font-bold text-red-300">-${subscriptionCost}/mo</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/20 text-lg">
                      <span className="font-semibold">Net Monthly Savings:</span>
                      <span className="font-bold text-2xl">${parseInt(netMonthlySavings).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  {[
                    'Reduce manual work by 75%',
                    'Eliminate 94% of errors',
                    'Real-time insights & analytics',
                    'Scalable as you grow'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <a href="#free-trial" className="block">
                    <Button className="w-full bg-white text-maycole-green hover:bg-gray-100 py-4 text-lg font-semibold flex items-center justify-center gap-2 group">
                      <span>Start Saving Today - Free Trial</span>
                      <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Button>
                  </a>
                  <p className="text-xs text-center text-white/80 mt-3">
                    14-day free trial • No credit card required
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-600">
            * Calculations based on industry averages and actual customer results. Individual results may vary.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
