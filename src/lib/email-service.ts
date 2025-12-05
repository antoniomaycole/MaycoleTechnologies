/**
 * SendGrid Email Service Module
 * Handles transactional email sending (contact forms, notifications, password resets, etc.)
 *
 * Usage:
 * import { sendEmail, sendContactFormEmail, sendWelcomeEmail } from '@/lib/email-service'
 *
 * await sendEmail({
 *   to: 'recipient@example.com',
 *   subject: 'Welcome to MaycoleTechnologies',
 *   htmlContent: '<h1>Welcome!</h1>'
 * })
 */

import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key from environment
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@maycoletechnologies.com';
const FROM_NAME = 'MaycoleTechnologies™';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('[SendGrid] Email service initialized');
} else {
  console.warn('[SendGrid] API key not found. Email sending disabled.');
}

/**
 * Email configuration interface
 */
export interface EmailConfig {
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: string;
  tags?: string[];
  categories?: string[];
  trackingSettings?: {
    openTracking?: boolean;
    clickTracking?: boolean;
    subscriptionTracking?: boolean;
  };
  customHeaders?: Record<string, string>;
}

/**
 * Send a simple email
 */
export async function sendEmail(config: EmailConfig): Promise<any> {
  try {
    if (!SENDGRID_API_KEY) {
      console.error('[Email] SendGrid API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const msg: any = {
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      to: config.to,
      subject: config.subject,
      html: config.htmlContent,
      text: config.textContent || stripHtml(config.htmlContent),
    };

    // Optional fields
    if (config.cc) msg.cc = config.cc;
    if (config.bcc) msg.bcc = config.bcc;
    if (config.replyTo) msg.replyTo = config.replyTo;

    // Email tracking
    if (config.trackingSettings) {
      msg.trackingSettings = {
        openTracking: {
          enable: config.trackingSettings.openTracking ?? false,
        },
        clickTracking: {
          enable: config.trackingSettings.clickTracking ?? false,
        },
        subscriptionTracking: {
          enable: config.trackingSettings.subscriptionTracking ?? false,
        },
      };
    }

    // Tags for categorization (visible in SendGrid dashboard)
    if (config.tags) {
      msg.categories = config.tags;
    }

    // Custom headers
    if (config.customHeaders) {
      msg.headers = config.customHeaders;
    }

    const response = await sgMail.send(msg);

    console.log('[SendGrid] Email sent successfully:', {
      to: config.to,
      subject: config.subject,
      statusCode: response[0].statusCode,
    });

    return { success: true, statusCode: response[0].statusCode };
  } catch (error: any) {
    console.error('[SendGrid] Email sending failed:', {
      error: error.message,
      code: error.code,
      to: config.to,
      subject: config.subject,
    });

    return { success: false, error: error.message };
  }
}

/**
 * Send contact form email to admin
 */
export async function sendContactFormEmail(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<any> {
  const adminEmail = 'help@maycoletechnologies.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Contact Form Submission</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      </div>
      
      <h3>Message:</h3>
      <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      
      <p style="color: #666; font-size: 12px;">
        This is an automated message from MaycoleTechnologies™ website.
        <br>
        <strong>Reply to:</strong> ${escapeHtml(email)}
      </p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    htmlContent,
    tags: ['contact-form', 'inquiry'],
    trackingSettings: {
      openTracking: false,
      clickTracking: false,
    },
  });
}

/**
 * Send welcome email to new subscriber
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<any> {
  const displayName = name || 'there';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1a472a 0%, #2d6a4f 100%); color: white; border-radius: 8px;">
        <h1 style="margin: 0;">Welcome to MaycoleTechnologies™</h1>
      </div>
      
      <div style="padding: 30px;">
        <p>Hi ${escapeHtml(displayName)},</p>
        
        <p>Thank you for joining our community! We're excited to have you on board.</p>
        
        <h3>What's Next?</h3>
        <ul style="line-height: 2; color: #333;">
          <li>Explore our latest products and solutions</li>
          <li>Read our documentation and guides</li>
          <li>Join our webinars and training sessions</li>
          <li>Connect with our support team anytime</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://maycoletechnologies.com" 
             style="background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Visit Our Website
          </a>
        </div>
        
        <p>If you have any questions, feel free to reply to this email or contact us at help@maycoletechnologies.com</p>
        
        <p>Best regards,<br>The MaycoleTechnologies™ Team</p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px;">
        <p style="margin: 0;">© 2025 MaycoleTechnologies™. All rights reserved.</p>
        <p style="margin: 5px 0 0;">
          <a href="https://maycoletechnologies.com/privacy" style="color: #0ea5e9; text-decoration: none;">Privacy Policy</a> | 
          <a href="https://maycoletechnologies.com/terms" style="color: #0ea5e9; text-decoration: none;">Terms of Service</a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to MaycoleTechnologies™!',
    htmlContent,
    tags: ['welcome', 'onboarding'],
    trackingSettings: {
      openTracking: true,
      clickTracking: true,
    },
  });
}

/**
 * Send lead notification email
 */
export async function sendLeadNotificationEmail(
  name: string,
  email: string,
  productInterest?: string
): Promise<any> {
  const adminEmail = 'help@maycoletechnologies.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Lead Generated</h2>
      
      <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2d6a4f;">
        <p style="margin: 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${productInterest ? `<p style="margin: 5px 0;"><strong>Interested In:</strong> ${escapeHtml(productInterest)}</p>` : ''}
        <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
        <a href="mailto:${email}" 
           style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reply to Lead
        </a>
      </div>
      
      <p style="color: #666; font-size: 12px;">
        This is an automated notification from MaycoleTechnologies™.
      </p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    replyTo: email,
    subject: `New Lead: ${name}`,
    htmlContent,
    tags: ['lead', 'sales'],
    trackingSettings: {
      openTracking: false,
      clickTracking: false,
    },
  });
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  invoiceNumber: string,
  amount: number,
  plan: string,
  renewalDate?: string
): Promise<any> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1a472a 0%, #2d6a4f 100%); color: white; border-radius: 8px;">
        <h1 style="margin: 0;">✓ Payment Received</h1>
        <p style="margin: 10px 0 0;">Thank you for your purchase</p>
      </div>
      
      <div style="padding: 30px;">
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Invoice:</strong> ${escapeHtml(invoiceNumber)}</p>
          <p style="margin: 5px 0;"><strong>Plan:</strong> ${escapeHtml(plan)}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${amount.toFixed(2)}</p>
          ${renewalDate ? `<p style="margin: 5px 0;"><strong>Renewal Date:</strong> ${escapeHtml(renewalDate)}</p>` : ''}
        </div>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Full access to all features</li>
          <li>Priority customer support</li>
          <li>Regular updates and improvements</li>
          <li>Community access</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://maycoletechnologies.com/dashboard" 
             style="background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Your Account
          </a>
        </div>
        
        <p>If you have any questions about your purchase, please contact support at help@maycoletechnologies.com</p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px;">
        <p style="margin: 0;">© 2025 MaycoleTechnologies™. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Payment Confirmation - Invoice ${invoiceNumber}`,
    htmlContent,
    tags: ['payment', 'invoice', 'transactional'],
    trackingSettings: {
      openTracking: true,
      clickTracking: false,
    },
  });
}

/**
 * Send error/issue email
 */
export async function sendErrorNotificationEmail(error: string, context: string): Promise<any> {
  const adminEmail = 'help@maycoletechnologies.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #ffebee; padding: 20px; border-radius: 8px; border-left: 4px solid #d32f2f;">
        <h2 style="margin-top: 0; color: #d32f2f;">Application Error Alert</h2>
        
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Context:</strong> ${escapeHtml(context)}</p>
        
        <h3>Error Details:</h3>
        <pre style="background: #fff; padding: 15px; border-radius: 4px; overflow: auto; font-size: 12px;">
${escapeHtml(error)}
        </pre>
      </div>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This is an automated alert from MaycoleTechnologies™ monitoring system.
      </p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `Error Alert: ${context}`,
    htmlContent,
    tags: ['alert', 'error', 'system'],
    trackingSettings: {
      openTracking: false,
      clickTracking: false,
    },
  });
}

/**
 * Helper: Strip HTML tags from content
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
}

/**
 * Helper: Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export default {
  sendEmail,
  sendContactFormEmail,
  sendWelcomeEmail,
  sendLeadNotificationEmail,
  sendPaymentConfirmationEmail,
  sendErrorNotificationEmail,
};
