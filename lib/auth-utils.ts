/**
 * Authentication Utilities
 * JWT token generation, password hashing, session management
 */

import { jwtVerify, SignJWT } from 'jose';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

/**
 * Hash password using bcrypt-like approach
 * For production, use bcryptjs package
 */
export async function hashPassword(password: string): Promise<string> {
  // Simple hash for now - use bcryptjs in production
  const hash = crypto
    .createHash('sha256')
    .update(password + (process.env.JWT_SECRET || 'salt'))
    .digest('hex');
  return hash;
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = crypto
    .createHash('sha256')
    .update(password + (process.env.JWT_SECRET || 'salt'))
    .digest('hex');
  return computed === hash;
}

/**
 * Generate JWT token
 */
export async function generateToken(userId: string, expiresIn: string = '7d'): Promise<string> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload.sub as string;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain number');

  return {
    valid: errors.length === 0,
    errors,
  };
}
