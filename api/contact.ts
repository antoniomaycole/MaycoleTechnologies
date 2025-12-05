/**
 * Contact Form Endpoint
 * Store contact form submissions in database
 *
 * POST /api/contact
 *
 * Body:
 * {
 *   firstName: string,
 *   lastName: string,
 *   email: string,
 *   company?: string,
 *   message: string
 * }
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db/client';
import { isValidEmail } from '@/lib/auth-utils';
import { sendContactEmail } from '@/src/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, company, message } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters' });
  }

  try {
    // Store in database
    const result = await sql`
      INSERT INTO contact_submissions (first_name, last_name, email, company, message, status)
      VALUES (${firstName}, ${lastName}, ${email}, ${company || null}, ${message}, 'new')
      RETURNING id;
    `;

    const submissionId = result.rows[0].id;

    // Send confirmation email via SendGrid
    try {
      await sendContactEmail({
        firstName,
        lastName,
        email,
        company: company || '',
        message,
      });
    } catch (emailError) {
      console.warn('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    // Log the submission
    console.log(`Contact form submitted: ${submissionId}`);

    return res.status(201).json({
      success: true,
      id: submissionId,
      message: 'Thank you for your message. We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to submit form' });
  }
}
