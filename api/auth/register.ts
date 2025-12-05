/**
 * Register Endpoint
 * Create a new user account
 *
 * POST /api/auth/register
 *
 * Body:
 * {
 *   email: string,
 *   password: string,
 *   firstName: string,
 *   lastName: string,
 *   company?: string
 * }
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db/client';
import { hashPassword, generateToken, isValidEmail, isValidPassword } from '@/lib/auth-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, firstName, lastName, company } = req.body;

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      error: 'Password does not meet requirements',
      details: passwordValidation.errors,
    });
  }

  try {
    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, company)
      VALUES (${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${company || null})
      RETURNING id, email, first_name, last_name;
    `;

    const user = result.rows[0];
    const token = await generateToken(user.id);

    console.log(`User registered: ${user.email}`);

    return res.status(201).json({
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
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to register' });
  }
}
