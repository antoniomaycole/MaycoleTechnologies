/**
 * Performance Optimization Dashboard Component
 * Real-time monitoring of Core Web Vitals, bundle size, and optimization status
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, TrendingDown, Zap } from 'lucide-react';
import {
  initCoreWebVitalsTracking,
  reportCoreWebVitals,
  trackImageMetrics,
  getImageOptimizationRecommendations,
  getBundleOptimizationRecommendations,
  generatePerformanceReport,
  formatPerformanceReport,
  type PerformanceReport,
} from '../lib/performance-optimizer';

export const PerformanceOptimizationDashboard: React.FC = () => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'bundle' | 'images'>(
    'overview'
  );

  useEffect(() => {
    // Initialize tracking
    initCoreWebVitalsTracking();
    trackImageMetrics();

    // Generate initial report after a delay (let vitals populate)
    const timer = setTimeout(() => {
      const newReport = generatePerformanceReport();
      setReport(newReport);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Zap className="mx-auto mb-4 h-8 w-8 animate-pulse text-blue-500" />
          <p className="text-gray-600">Analyzing performance metrics...</p>
        </div>
      </div>
    );
  }

  const gradeColors = {
    A: 'text-green-600 bg-green-50',
    B: 'text-blue-600 bg-blue-50',
    C: 'text-yellow-600 bg-yellow-50',
    D: 'text-orange-600 bg-orange-50',
    F: 'text-red-600 bg-red-50',
  };

  const getVitalStatus = (
    value: number,
    type: 'lcp' | 'fid' | 'cls',
    unit: string
  ): { status: 'good' | 'needs-improvement' | 'poor'; color: string } => {
    let status: 'good' | 'needs-improvement' | 'poor' = 'good';
    let color = 'text-green-600';

    if (type === 'lcp') {
      if (value > 3500) status = 'poor';
      else if (value > 2500) status = 'needs-improvement';
      color =
        status === 'good'
          ? 'text-green-600'
          : status === 'needs-improvement'
            ? 'text-yellow-600'
            : 'text-red-600';
    } else if (type === 'fid') {
      if (value > 300) status = 'poor';
      else if (value > 100) status = 'needs-improvement';
      color =
        status === 'good'
          ? 'text-green-600'
          : status === 'needs-improvement'
            ? 'text-yellow-600'
            : 'text-red-600';
    } else if (type === 'cls') {
      if (value > 0.25) status = 'poor';
      else if (value > 0.1) status = 'needs-improvement';
      color =
        status === 'good'
          ? 'text-green-600'
          : status === 'needs-improvement'
            ? 'text-yellow-600'
            : 'text-red-600';
    }

    return { status, color };
  };

  const lcpStatus = getVitalStatus(report.vitals.lcp, 'lcp', 'ms');
  const fidStatus = getVitalStatus(report.vitals.fid, 'fid', 'ms');
  const clsStatus = getVitalStatus(report.vitals.cls, 'cls', '');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Performance Optimization</h1>
            <p className="mt-2 text-gray-600">
              Real-time Core Web Vitals monitoring and optimization
            </p>
          </div>
          <div className={`rounded-lg px-6 py-4 text-center ${gradeColors[report.grade]}`}>
            <div className="text-5xl font-bold">{report.grade}</div>
            <div className="mt-2 text-sm font-semibold">Score: {report.score}/100</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {(['overview', 'vitals', 'bundle', 'images'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label={`View ${tab === 'vitals' ? 'Core Web Vitals' : tab} metrics`}
              aria-selected={activeTab === tab}
            >
              {tab === 'vitals' ? 'Core Web Vitals' : tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">LCP</div>
                <div className={`mt-2 text-3xl font-bold ${lcpStatus.color}`}>
                  {report.vitals.lcp.toFixed(0)}ms
                </div>
                <div className="mt-1 text-xs text-gray-500">Target: &lt;2.5s</div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">FID</div>
                <div className={`mt-2 text-3xl font-bold ${fidStatus.color}`}>
                  {report.vitals.fid.toFixed(0)}ms
                </div>
                <div className="mt-1 text-xs text-gray-500">Target: &lt;100ms</div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">CLS</div>
                <div className={`mt-2 text-3xl font-bold ${clsStatus.color}`}>
                  {report.vitals.cls.toFixed(3)}
                </div>
                <div className="mt-1 text-xs text-gray-500">Target: &lt;0.1</div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">Overall</div>
                <div className="mt-2 text-3xl font-bold text-blue-600">{report.score}</div>
                <div className="mt-1 text-xs text-gray-500">Grade: {report.grade}</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                <AlertCircle className="mr-2 h-5 w-5 text-blue-500" />
                Recommendations
              </h2>
              <div className="space-y-3">
                {report.recommendations.length > 0 ? (
                  report.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 rounded-lg bg-gray-50 p-4">
                      <div className="mt-1 flex-shrink-0">
                        {rec.includes('⚠️') && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                        {rec.includes('✅') && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {rec.includes('💡') && <Zap className="h-5 w-5 text-blue-500" />}
                      </div>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">
                    No recommendations - great performance! 🎉
                  </p>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-lg bg-blue-50 p-6">
              <h2 className="mb-4 flex items-center text-lg font-semibold text-blue-900">
                <TrendingDown className="mr-2 h-5 w-5" />
                Next Steps
              </h2>
              <ul className="space-y-2">
                {report.nextSteps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-blue-900">
                    <span className="flex-shrink-0 font-semibold">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Vitals Tab */}
        {activeTab === 'vitals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* LCP */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Largest Contentful Paint</h3>
                <div className="mb-4 flex items-baseline gap-2">
                  <div className={`text-4xl font-bold ${lcpStatus.color}`}>
                    {report.vitals.lcp.toFixed(0)}
                  </div>
                  <span className="text-gray-600">ms</span>
                </div>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full ${
                      lcpStatus.status === 'good'
                        ? 'bg-green-500'
                        : lcpStatus.status === 'needs-improvement'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((report.vitals.lcp / 4000) * 100, 100)}%` }}
                  />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>🟢 Good: &lt;2,500 ms</div>
                  <div>🟡 Needs improvement: 2,500-4,000 ms</div>
                  <div>🔴 Poor: &gt;4,000 ms</div>
                </div>
              </div>

              {/* FID/INP */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">First Input Delay / INP</h3>
                <div className="mb-4 flex items-baseline gap-2">
                  <div className={`text-4xl font-bold ${fidStatus.color}`}>
                    {report.vitals.fid.toFixed(0)}
                  </div>
                  <span className="text-gray-600">ms</span>
                </div>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full ${
                      fidStatus.status === 'good'
                        ? 'bg-green-500'
                        : fidStatus.status === 'needs-improvement'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((report.vitals.fid / 300) * 100, 100)}%` }}
                  />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>🟢 Good: &lt;100 ms</div>
                  <div>🟡 Needs improvement: 100-300 ms</div>
                  <div>🔴 Poor: &gt;300 ms</div>
                </div>
              </div>

              {/* CLS */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Cumulative Layout Shift</h3>
                <div className="mb-4 flex items-baseline gap-2">
                  <div className={`text-4xl font-bold ${clsStatus.color}`}>
                    {report.vitals.cls.toFixed(3)}
                  </div>
                </div>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full ${
                      clsStatus.status === 'good'
                        ? 'bg-green-500'
                        : clsStatus.status === 'needs-improvement'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((report.vitals.cls / 0.5) * 100, 100)}%` }}
                  />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>🟢 Good: &lt;0.1</div>
                  <div>🟡 Needs improvement: 0.1-0.25</div>
                  <div>🔴 Poor: &gt;0.25</div>
                </div>
              </div>

              {/* TTFB */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Time to First Byte</h3>
                <div className="mb-4 flex items-baseline gap-2">
                  <div className="text-4xl font-bold text-blue-600">
                    {(report.vitals.ttfb || 0).toFixed(0)}
                  </div>
                  <span className="text-gray-600">ms</span>
                </div>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.min(((report.vitals.ttfb || 0) / 1000) * 100, 100)}%` }}
                  />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>🟢 Good: &lt;600 ms</div>
                  <div>🟡 Needs improvement: 600-1,800 ms</div>
                  <div>🔴 Poor: &gt;1,800 ms</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bundle Tab */}
        {activeTab === 'bundle' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Bundle Size Analysis</h2>
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Total Bundle</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">&lt;400 KB</p>
                  <p className="mt-1 text-xs text-gray-500">Target (gzipped)</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-600">JS Chunks</p>
                  <p className="mt-2 text-2xl font-bold text-blue-600">~10</p>
                  <p className="mt-1 text-xs text-gray-500">Code-split</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-gray-600">Optimization</p>
                  <p className="mt-2 text-2xl font-bold text-green-600">✓</p>
                  <p className="mt-1 text-xs text-gray-500">Configured</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Run <code className="bg-gray-100 px-2 py-1">npm run build</code> to analyze bundle
                size with the visualizer plugin.
              </p>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Image Optimization</h2>
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">Current Status</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-700">Lazy loading utilities: Ready</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-700">
                        Responsive image components: Ready
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm text-gray-700">
                        WebP format: Pending compression
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm text-gray-700">Image optimization: Pending</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="mb-3 font-semibold text-blue-900">Next Steps</h3>
                  <ol className="space-y-2 text-sm text-blue-900">
                    <li>1. Compress all images using compression-strategy.ts guide</li>
                    <li>2. Convert to WebP format with JPEG fallbacks</li>
                    <li>3. Add loading="lazy" to images</li>
                    <li>4. Replace img tags with OptimizedImage component</li>
                    <li>5. Preload hero images</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 rounded-lg bg-gray-100 p-6 text-center text-sm text-gray-600">
          <p>Performance optimizations powered by AI Optimization Bot</p>
          <p className="mt-2">Last updated: {new Date(report.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizationDashboard;
