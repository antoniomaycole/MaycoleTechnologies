/**
 * MaycoleTechnologies™ - Email Service
 * Handles contact form submissions and newsletter signups
 */

import { config } from './config';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
}

/**
 * Send contact form email via SendGrid
 */
export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  // Check if SendGrid is configured
  const sendgridKey = config.sendgrid.apiKey;
  
  if (!sendgridKey) {
    console.warn('SendGrid API key not configured. Email not sent.');
    // In demo mode, simulate success
    if (config.demo.enabled) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      return {
        success: true,
        message: 'Demo mode: Email simulated successfully'
      };
    }
    return {
      success: false,
      message: 'Email service not configured'
    };
  }

  try {
    // SendGrid API call
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sendgridKey}`
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: config.contact.email }],
          subject: `Contact Form: ${data.company || 'New Inquiry'}`
        }],
        from: {
          email: config.sendgrid.fromEmail,
          name: 'MaycoleTechnologies™ Website'
        },
        content: [{
          type: 'text/html',
          value: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Company:</strong> ${data.company}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
          `
        }]
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Email sent successfully!'
      };
    } else {
      const error = await response.json();
      console.error('SendGrid error:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.'
    };
  }
}

/**
 * Subscribe to newsletter via Mailchimp
 */
export async function subscribeToNewsletter(data: NewsletterFormData): Promise<{ success: boolean; message: string }> {
  // Check if Mailchimp is configured
  const mailchimpKey = config.mailchimp.apiKey;
  const audienceId = config.mailchimp.audienceId;
  const serverPrefix = config.mailchimp.serverPrefix;

  if (!mailchimpKey || !audienceId) {
    console.warn('Mailchimp not configured. Newsletter subscription not sent.');
    // In demo mode, simulate success
    if (config.demo.enabled) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      return {
        success: true,
        message: 'Demo mode: Subscription simulated successfully'
      };
    }
    return {
      success: false,
      message: 'Newsletter service not configured'
    };
  }

  try {
    // Mailchimp API call
    const response = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`anystring:${mailchimpKey}`)}`
        },
        body: JSON.stringify({
          email_address: data.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: data.name?.split(' ')[0] || '',
            LNAME: data.name?.split(' ').slice(1).join(' ') || ''
          },
          tags: ['Website Signup']
        })
      }
    );

    if (response.ok) {
      return {
        success: true,
        message: 'Successfully subscribed to newsletter!'
      };
    } else {
      const error = await response.json();
      
      // Check if already subscribed
      if (error.title === 'Member Exists') {
        return {
          success: true,
          message: 'You are already subscribed!'
        };
      }
      
      console.error('Mailchimp error:', error);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again.'
      };
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.'
    };
  }
}

/**
 * Alternative: Use Netlify Forms (no API key needed)
 * Just add data-netlify="true" to your form HTML
 */
export async function sendViaNetlifyForms(formName: string, data: Record<string, any>): Promise<{ success: boolean; message: string }> {
  try {
    const formData = new FormData();
    formData.append('form-name', formName);
    
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    const response = await fetch('/', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Form submitted successfully!'
      };
    } else {
      return {
        success: false,
        message: 'Failed to submit form. Please try again.'
      };
    }
  } catch (error) {
    console.error('Netlify form error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.'
    };
  }
}
