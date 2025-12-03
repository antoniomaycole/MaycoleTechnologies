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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication - in production, this would call your backend
    if (credentials.email === 'demo@maycoletech.com' && credentials.password === 'demo123') {
      const session = this.createMockSession(credentials.email);
      this.storeSession(session, credentials.remember);
      return session;
    }

    // Check if user exists in local storage (for demo purposes)
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In production, verify password hash here
    const session = this.createSessionFromUser(user);
    this.storeSession(session, credentials.remember);
    return session;
  }

  /**
   * Signup new user
   */
  static async signup(credentials: SignupCredentials): Promise<AuthSession> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if email already exists
    const users = this.getStoredUsers();
    if (users.find(u => u.email === credentials.email)) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser: User = {
      id: this.generateId(),
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      role: 'admin', // First user is admin
      organizationId: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      phone: credentials.phone,
      isActive: true,
    };

    const organization: Organization = {
      id: newUser.organizationId,
      name: credentials.organizationName,
      subscriptionTier: 'professional', // Default tier
      subscriptionStatus: 'trial',
      subscriptionExpiresAt: this.getTrialExpiryDate(),
      createdAt: new Date().toISOString(),
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        lowStockThreshold: 10,
        enableNotifications: true,
        enableVoiceControl: true,
        enableBarcodeScanning: true,
      },
    };

    // Store user
    users.push(newUser);
    this.storeUsers(users);

    // Create session
    const session: AuthSession = {
      user: newUser,
      organization,
      token: this.generateToken(),
      expiresAt: this.getSessionExpiry(false),
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newSession: AuthSession = {
      ...session,
      token: this.generateToken(),
      expiresAt: this.getSessionExpiry(false),
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedUser: User = {
      ...session.user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const newSession: AuthSession = {
      ...session,
      user: updatedUser,
    };

    this.storeSession(newSession, true);
    
    // Update in stored users
    const users = this.getStoredUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.storeUsers(users);
    }

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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, verify current password and hash new password
    // For demo, just simulate success
    if (currentPassword.length < 6 || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  // ==================== HELPER METHODS ====================

  private static createMockSession(email: string): AuthSession {
    const user: User = {
      id: '1',
      email,
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin',
      organizationId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isActive: true,
    };

    const organization: Organization = {
      id: '1',
      name: 'Demo Organization',
      subscriptionTier: 'professional',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: this.getTrialExpiryDate(),
      createdAt: new Date().toISOString(),
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        lowStockThreshold: 10,
        enableNotifications: true,
        enableVoiceControl: true,
        enableBarcodeScanning: true,
      },
    };

    return {
      user,
      organization,
      token: this.generateToken(),
      expiresAt: this.getSessionExpiry(false),
    };
  }

  private static createSessionFromUser(user: User): AuthSession {
    const organization: Organization = {
      id: user.organizationId,
      name: 'My Organization',
      subscriptionTier: 'professional',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: this.getTrialExpiryDate(),
      createdAt: new Date().toISOString(),
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        lowStockThreshold: 10,
        enableNotifications: true,
        enableVoiceControl: true,
        enableBarcodeScanning: true,
      },
    };

    return {
      user: {
        ...user,
        lastLoginAt: new Date().toISOString(),
      },
      organization,
      token: this.generateToken(),
      expiresAt: this.getSessionExpiry(false),
    };
  }

  private static storeSession(session: AuthSession, remember: boolean = false): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_EXPIRY_KEY, session.expiresAt);
  }

  private static generateToken(): string {
    return `mt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getSessionExpiry(remember: boolean): string {
    const expiryDays = remember ? 30 : 1;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expiryDays);
    return expiry.toISOString();
  }

  private static getTrialExpiryDate(): string {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    return expiry.toISOString();
  }

  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getStoredUsers(): User[] {
    try {
      const stored = localStorage.getItem('maycole_tracker_users');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  private static storeUsers(users: User[]): void {
    localStorage.setItem('maycole_tracker_users', JSON.stringify(users));
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
