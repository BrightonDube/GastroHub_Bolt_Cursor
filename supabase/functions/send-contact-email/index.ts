import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Enhanced security and validation for contact form emails
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'sales' | 'support' | 'billing' | 'feedback';
  newsletter?: boolean;
  timestamp: string;
  userAgent: string;
  source: string;
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (now > limit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (limit.count >= 5) { // Max 5 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
}

// Validate and sanitize input data
function validateAndSanitizeData(data: any): ContactFormData | null {
  try {
    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message || !data.inquiryType) {
      return null;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return null;
    }

    // Length validation
    if (data.name.length > 100 || 
        data.email.length > 255 || 
        data.subject.length > 200 || 
        data.message.length > 2000) {
      return null;
    }

    // Character validation for name (letters, spaces, hyphens, apostrophes, dots)
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(data.name)) {
      return null;
    }

    // Valid inquiry types
    const validInquiryTypes = ['general', 'sales', 'support', 'billing', 'feedback'];
    if (!validInquiryTypes.includes(data.inquiryType)) {
      return null;
    }

    // Sanitize strings (basic HTML entity encoding)
    const sanitize = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
    };

    return {
      name: sanitize(data.name),
      email: sanitize(data.email.toLowerCase()),
      company: data.company ? sanitize(data.company) : undefined,
      subject: sanitize(data.subject),
      message: sanitize(data.message),
      inquiryType: data.inquiryType,
      newsletter: Boolean(data.newsletter),
      timestamp: data.timestamp || new Date().toISOString(),
      userAgent: data.userAgent || 'Unknown',
      source: data.source || 'contact_form'
    };
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
}

// Generate email content
function generateEmailContent(data: ContactFormData): { subject: string; html: string; text: string } {
  const inquiryTypeLabels = {
    general: 'General Inquiry',
    sales: 'Sales & Partnerships',
    support: 'Technical Support',
    billing: 'Billing & Payments',
    feedback: 'Feedback & Suggestions'
  };

  const subject = `[GastroHub Contact] ${data.subject}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; }
          .value { margin-top: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            ${data.company ? `
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${data.company}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Inquiry Type:</div>
              <div class="value">${inquiryTypeLabels[data.inquiryType]}</div>
            </div>
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${data.subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value" style="white-space: pre-wrap;">${data.message}</div>
            </div>
            <div class="field">
              <div class="label">Newsletter Subscription:</div>
              <div class="value">${data.newsletter ? 'Yes' : 'No'}</div>
            </div>
          </div>
          <div class="footer">
            <p>Submitted on: ${new Date(data.timestamp).toLocaleString()}</p>
            <p>Source: ${data.source}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}\n` : ''}
Inquiry Type: ${inquiryTypeLabels[data.inquiryType]}
Subject: ${data.subject}

Message:
${data.message}

Newsletter Subscription: ${data.newsletter ? 'Yes' : 'No'}

Submitted on: ${new Date(data.timestamp).toLocaleString()}
Source: ${data.source}
  `;

  return { subject, html, text };
}

Deno.serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), 
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and validate request body
    const rawData = await req.json();
    const validatedData = validateAndSanitizeData(rawData);
    
    if (!validatedData) {
      return new Response(
        JSON.stringify({ error: 'Invalid form data' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check for required environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate email content
    const emailContent = generateEmailContent(validatedData);

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'GastroHub Contact <noreply@gastrohub.com>',
        to: ['info@gastrohub.com'],
        reply_to: validatedData.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        tags: [
          { name: 'source', value: 'contact_form' },
          { name: 'inquiry_type', value: validatedData.inquiryType }
        ]
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email');
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult.id);

    // Send confirmation email to user
    try {
      const confirmationResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'GastroHub Support <support@gastrohub.com>',
          to: [validatedData.email],
          subject: 'Thank you for contacting GastroHub',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Thank you for your message!</h2>
              <p>Hi ${validatedData.name},</p>
              <p>We've received your message and will get back to you within 24 hours.</p>
              <p><strong>Your inquiry:</strong> ${validatedData.subject}</p>
              <p>Best regards,<br>The GastroHub Team</p>
            </div>
          `,
          text: `Hi ${validatedData.name},\n\nWe've received your message and will get back to you within 24 hours.\n\nYour inquiry: ${validatedData.subject}\n\nBest regards,\nThe GastroHub Team`
        }),
      });

      if (confirmationResponse.ok) {
        console.log('Confirmation email sent to user');
      }
    } catch (confirmationError) {
      console.error('Failed to send confirmation email:', confirmationError);
      // Don't fail the whole request if confirmation email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully',
        id: emailResult.id 
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error. Please try again later.' 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}); 