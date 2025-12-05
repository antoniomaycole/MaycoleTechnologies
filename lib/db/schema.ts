/**
 * Database Schema Definitions
 * Types for all database tables
 */

/**
 * Users table
 */
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Subscriptions table
 */
export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  tier: 'free' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Payments/Orders table
 */
export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string;
  stripe_invoice_id?: string;
  amount: number; // in cents
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  description?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Contact Form Submissions
 */
export interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  message: string;
  status: 'new' | 'viewed' | 'responded';
  created_at: Date;
  updated_at: Date;
}

/**
 * Newsletter Subscriptions
 */
export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'subscribed' | 'unsubscribed';
  subscribed_at: Date;
  unsubscribed_at?: Date;
}

/**
 * Session/JWT tokens
 */
export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}
