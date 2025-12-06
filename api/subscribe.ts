/**
 * Vercel API Route: Subscribe/Lead Capture
 * Path: /api/subscribe
 */

// @ts-ignore - @vercel/node not installed yet
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, source } = req.body;

    // Validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // TODO: Integrate with your email service
    // Options:
    // 1. SendGrid (configured in env)
    // 2. Mailchimp
    // 3. Your own database
    
    console.log('[Subscribe API] Lead captured:', { email, name, source });

    // For now, just acknowledge
    res.status(200).json({
      success: true,
      message: 'Subscription received',
      email,
    });
  } catch (error) {
    console.error('[Subscribe API] Error:', error);
    res.status(500).json({
      error: 'Failed to process subscription',
    });
  }
}
