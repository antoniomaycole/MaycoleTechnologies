/**
 * Email Service
 * Handle transactional emails, notifications, and marketing emails
 */

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    type: string;
  }>;
}

/**
 * Send email
 */
export async function sendEmail(
  options: EmailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com';

    const message: any = {
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      replyTo: options.replyTo || fromEmail,
    };

    if (options.html) {
      message.html = options.html;
    }
    if (options.text) {
      message.text = options.text;
    }
    if (options.cc) {
      message.cc = options.cc;
    }
    if (options.bcc) {
      message.bcc = options.bcc;
    }
    if (options.attachments) {
      message.attachments = options.attachments;
    }

    const response = await sgMail.send(message);

    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
    };
  } catch (error) {
    console.error('[Email Service] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  firstName: string,
  onboardingLink?: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to MaycoleTechnologies, ${firstName}!</h1>
          </div>
          <div class="content">
            <p>Thank you for joining us. We're excited to have you on board!</p>
            <p>Your account is ready to use. Get started by completing your profile and exploring the tracker app.</p>
            ${
              onboardingLink
                ? `<a href="${onboardingLink}" class="button">Complete Your Profile</a>`
                : ''
            }
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The MaycoleTechnologies Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MaycoleTechnologies. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Welcome to MaycoleTechnologies, ${firstName}!\n\nThank you for joining us.\n\nBest regards,\nThe MaycoleTechnologies Team`;

  return await sendEmail({
    to: email,
    subject: `Welcome to MaycoleTechnologies, ${firstName}!`,
    html,
    text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .warning { background: #fff3cd; padding: 12px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your password.</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <div class="warning">
              <strong>Note:</strong> This link expires in 1 hour.
            </div>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The MaycoleTechnologies Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Click here to reset your password: ${resetLink}\n\nThis link expires in 1 hour.`;

  return await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
    text,
  });
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  email: string,
  tier: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .details { background: white; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Subscription Confirmed!</h1>
          </div>
          <div class="content">
            <p>Thank you for your purchase!</p>
            <div class="details">
              <div class="row">
                <strong>Plan:</strong>
                <span>${tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
              </div>
              <div class="row">
                <strong>Amount:</strong>
                <span>$${(amount / 100).toFixed(2)}/month</span>
              </div>
              <div class="row">
                <strong>Status:</strong>
                <span>Active</span>
              </div>
            </div>
            <p>Your subscription is now active. You can manage it anytime from your account settings.</p>
            <p>Best regards,<br>The MaycoleTechnologies Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan Confirmed`,
    html,
  });
}

/**
 * Send invoice email
 */
export async function sendInvoiceEmail(
  email: string,
  invoiceNumber: string,
  amount: number,
  invoicePdfUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice #${invoiceNumber}</h1>
          </div>
          <div class="content">
            <p>Your invoice is ready.</p>
            <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
            ${invoicePdfUrl ? `<a href="${invoicePdfUrl}" class="button">Download Invoice</a>` : ''}
            <p>Thank you for your business!</p>
            <p>Best regards,<br>The MaycoleTechnologies Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Invoice #${invoiceNumber}`,
    html,
  });
}

/**
 * Send contact form confirmation
 */
export async function sendContactConfirmationEmail(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>We Got Your Message</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for reaching out! We've received your message and will get back to you as soon as possible.</p>
            <p>Best regards,<br>The MaycoleTechnologies Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'We Got Your Message',
    html,
  });
}
