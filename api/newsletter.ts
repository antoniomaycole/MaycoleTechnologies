/**
 * Newsletter Signup Endpoint
 * Subscribe email to newsletter
 *
 * POST /api/newsletter
 *
 * Body:
 * {
 *   email: string,
 *   name?: string
 * }
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db/client';
import { isValidEmail } from '@/lib/auth-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Accept both POST and GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.method === 'GET' ? req.query : req.body;

  // Validation
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Check if already subscribed
    const existing = await sql`
      SELECT id FROM newsletter_subscribers
      WHERE email = ${email} AND status = 'subscribed'
    `;

    if (existing.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter.',
      });
    }

    // Insert or update subscriber
    const result = await sql`
      INSERT INTO newsletter_subscribers (email, name, status, subscribed_at)
      VALUES (${email}, ${name || null}, 'subscribed', CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE SET
        status = 'subscribed',
        subscribed_at = CURRENT_TIMESTAMP,
        name = COALESCE(EXCLUDED.name, newsletter_subscribers.name)
      RETURNING id;
    `;

    console.log(`Newsletter signup: ${email}`);

    return res.status(201).json({
      success: true,
      id: result.rows[0].id,
      message: 'Successfully subscribed to newsletter!',
    });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
