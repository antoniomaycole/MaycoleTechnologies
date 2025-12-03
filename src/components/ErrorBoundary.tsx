import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { config } from '../lib/config';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console
    console.error('Error caught by boundary:', error, errorInfo);

    // Store error info
    this.setState({
      error,
      errorInfo,
    });

    // Send to error tracking service (e.g., Sentry)
    if (config.sentry.dsn) {
      // Sentry.captureException(error, { extra: errorInfo });
      console.log('Would send to Sentry:', error);
    }

    // Track error in analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true,
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <Card className="max-w-2xl w-full border-red-600/50">
            <CardContent className="p-8 md:p-12">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
              </div>

              {/* Error Message */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Oops! Something went wrong
                  </span>
                </h1>
                <p className="text-lg text-gray-300 mb-6">
                  We're sorry for the inconvenience. Our team has been notified and we're working to fix the issue.
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {config.dev.enabled && this.state.error && (
                <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-red-600/30">
                  <h3 className="text-sm font-semibold text-red-600 mb-2">Error Details (Dev Mode):</h3>
                  <pre className="text-xs text-gray-400 overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={this.handleReload}
                  className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go to Homepage
                </Button>
              </div>

              {/* Support Information */}
              <div className="mt-8 pt-8 border-t border-gray-700 text-center">
                <p className="text-sm text-gray-400 mb-2">
                  If this problem persists, please contact our support team:
                </p>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="text-green-600 hover:text-green-500 font-medium"
                >
                  {config.contact.email}
                </a>
              </div>

              {/* Branding */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
                    MaycoleTechnologies
                  </span>
                  <sup style={{ fontSize: '0.4em', verticalAlign: 'super' }}>™</sup>
                  {' '}- Changing The Future One Product At A Time
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
