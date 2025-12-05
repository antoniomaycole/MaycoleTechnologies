/**
 * Login Endpoint
 * Authenticate user and return JWT token
 *
 * POST /api/auth/login
 *
 * Body:
 * {
 *   email: string,
 *   password: string
 * }
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db/client';
import { verifyPassword, generateToken, isValidEmail } from '@/lib/auth-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Find user
    const users = await sql`
      SELECT id, email, password_hash, first_name, last_name FROM users
      WHERE email = ${email}
    `;

    if (users.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users.rows[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = await generateToken(user.id);

    console.log(`User logged in: ${user.email}`);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
}
