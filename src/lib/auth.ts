/**
 * MaycoleTracker vol XII™ - Authentication System
 * Frontend authentication with secure session management
 */

import { User, Organization } from '../types/database';

// ==================== AUTHENTICATION STATE ====================

export interface AuthSession {
  user: User;
  organization: Organization;
  token: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  phone?: string;
}

export interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ==================== LOCAL STORAGE KEYS ====================

const AUTH_STORAGE_KEY = 'maycole_tracker_auth';
const SESSION_EXPIRY_KEY = 'maycole_tracker_expiry';

// ==================== AUTHENTICATION SERVICE ====================

export class AuthService {
  /**
   * Login with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthSession> {
    // Call backend API
    const response = await fetch(`${config.api.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid email or password');
    }

    const data = await response.json();
    const session: AuthSession = {
      user: data.user,
      organization: data.organization,
      token: data.token,
      expiresAt: data.expiresAt,
    };

    this.storeSession(session, credentials.remember);
    return session;
  }

  /**
   * Signup new user
   */
  static async signup(credentials: SignupCredentials): Promise<AuthSession> {
    // Call backend API
    const response = await fetch(`${config.api.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result = await response.json();
    const session: AuthSession = {
      user: result.user,
      organization: result.organization,
      token: result.token,
      expiresAt: result.expiresAt,
    };

    this.storeSession(session, false);
    return session;
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
  }

  /**
   * Get current session
   */
  static getSession(): AuthSession | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;

      const session: AuthSession = JSON.parse(stored);

      // Check if session expired
      const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
      if (expiry && new Date(expiry) < new Date()) {
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Refresh session token
   */
  static async refreshToken(): Promise<AuthSession> {
    const session = this.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const response = await fetch(`${config.api.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh session');
    }

    const data = await response.json();
    const newSession: AuthSession = {
      ...session,
      token: data.token,
      expiresAt: data.expiresAt,
    };

    this.storeSession(newSession, true);
    return newSession;
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<User>): Promise<User> {
    const session = this.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${config.api.baseUrl}/users/${session.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await response.json();
    const newSession: AuthSession = {
      ...session,
      user: updatedUser,
    };

    this.storeSession(newSession, true);
    return updatedUser;
  }

  /**
   * Change password
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const session = this.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    if (currentPassword.length < 6 || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const response = await fetch(`${config.api.baseUrl}/users/${session.user.id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }
  }

  // ==================== HELPER METHODS ====================

  private static storeSession(session: AuthSession, remember: boolean = false): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_EXPIRY_KEY, session.expiresAt);
  }

  private static generateToken(): string {
    return `mt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ==================== PASSWORD VALIDATION ====================

export class PasswordValidator {
  static validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static getStrength(password: string): 'weak' | 'medium' | 'strong' {
    const validation = this.validate(password);

    if (password.length < 8) return 'weak';
    if (validation.errors.length > 2) return 'weak';
    if (validation.errors.length > 0) return 'medium';
    return 'strong';
  }
}

// ==================== EMAIL VALIDATION ====================

export class EmailValidator {
  static validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
