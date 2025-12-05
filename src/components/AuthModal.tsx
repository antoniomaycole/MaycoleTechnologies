/**
 * MaycoleTracker vol XII™ - Authentication Modal
 * Login and Signup forms with validation
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { PasswordValidator, EmailValidator } from '../lib/auth';
import {
  X,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'signup';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login, signup, error, clearError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [phone, setPhone] = useState('');
  const [remember, setRemember] = useState(false);

  // Validation state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  // Handle email change
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !EmailValidator.validate(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Handle password change
  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (mode === 'signup') {
      const validation = PasswordValidator.validate(value);
      setPasswordError(validation.errors.join(', '));
      setPasswordStrength(PasswordValidator.getStrength(value));
    } else {
      setPasswordError('');
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!EmailValidator.validate(email)) {
      setEmailError('Invalid email address');
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password, remember });
      toast.success('Login successful!', {
        description: 'Welcome back to MaycoleTracker™',
        icon: <CheckCircle className="w-4 h-4" />,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Please check your credentials',
        icon: <AlertCircle className="w-4 h-4" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password || !firstName || !lastName || !organizationName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!EmailValidator.validate(email)) {
      setEmailError('Invalid email address');
      return;
    }

    const passwordValidation = PasswordValidator.validate(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.errors.join(', '));
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        email,
        password,
        firstName,
        lastName,
        organizationName,
        phone: phone || undefined,
      });
      toast.success('Account created!', {
        description: 'Welcome to MaycoleTracker™',
        icon: <CheckCircle className="w-4 h-4" />,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Signup failed', {
        description: error instanceof Error ? error.message : 'Please try again',
        icon: <AlertCircle className="w-4 h-4" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Switch mode
  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    clearError();
    setEmailError('');
    setPasswordError('');
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
    }
  };

  // Get password strength percentage
  const getPasswordStrengthPercentage = () => {
    switch (passwordStrength) {
      case 'weak':
        return 33;
      case 'medium':
        return 66;
      case 'strong':
        return 100;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-8 relative border border-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close auth modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-400 text-sm">
                {mode === 'login'
                  ? 'Sign in to access MaycoleTracker™'
                  : 'Get started with MaycoleTracker™'}
              </p>
            </div>

            {/* Demo credentials notice (only in login mode) */}
            {mode === 'login' && (
              <Alert className="mb-6 bg-blue-500/10 border-blue-500/30">
                <AlertDescription className="text-sm text-blue-300">
                  <strong>Demo:</strong> email: demo@maycoletech.com, password: demo123
                </AlertDescription>
              </Alert>
            )}

            {/* Error message */}
            {error && (
              <Alert className="mb-6 bg-red-500/10 border-red-500/30">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            {/* Forms */}
            <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-700"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-700"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization Name *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="organization"
                        type="text"
                        placeholder="Acme Corp"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700"
                    disabled={isLoading}
                  />
                </div>
                {emailError && <p className="text-xs text-red-400">{emailError}</p>}
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800 border-gray-700"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'signup' && password && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={getPasswordStrengthPercentage()}
                        className={`h-1 ${getPasswordStrengthColor()}`}
                      />
                      <span className="text-xs text-gray-400 capitalize">{passwordStrength}</span>
                    </div>
                    {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
                  </div>
                )}
              </div>

              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-gray-700 bg-gray-800"
                    />
                    Remember me
                  </label>
                  <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Switch mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  disabled={isLoading}
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Security notice */}
            <p className="mt-6 text-xs text-gray-500 text-center">
              Protected by enterprise-grade encryption
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
