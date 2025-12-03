/**
 * MaycoleTracker vol XII™ - Authentication Context
 * React context for managing authentication state
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, AuthSession, LoginCredentials, SignupCredentials } from '../lib/auth';
import { User, Organization } from '../types/database';

// ==================== CONTEXT TYPES ====================

interface AuthContextType {
  session: AuthSession | null;
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// ==================== CONTEXT CREATION ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER COMPONENT ====================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const existingSession = AuthService.getSession();
        setSession(existingSession);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const newSession = await AuthService.login(credentials);
      setSession(newSession);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (credentials: SignupCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const newSession = await AuthService.signup(credentials);
      setSession(newSession);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.logout();
      setSession(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await AuthService.updateProfile(updates);
      if (session) {
        setSession({
          ...session,
          user: updatedUser,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    session,
    user: session?.user || null,
    organization: session?.organization || null,
    isAuthenticated: !!session,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==================== HOOK ====================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ==================== PROTECTED ROUTE COMPONENT ====================

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <p className="text-gray-400">Please log in to continue</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
