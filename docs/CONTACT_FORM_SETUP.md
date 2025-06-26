# Contact Form Setup Guide

## Overview

The GastroHub contact form is a secure, validated form that sends emails to `info@gastrohub.com` using Supabase Edge Functions and the Resend email service. It includes comprehensive security measures, validation, sanitization, and rate limiting.

## Features

### 🔒 Security Features
- **Input Validation**: Comprehensive validation using Zod schema
- **Input Sanitization**: HTML entity encoding to prevent XSS attacks
- **Rate Limiting**: Max 5 requests per minute per IP address
- **CORS Protection**: Properly configured CORS headers
- **Data Validation**: Server-side validation with strict regex patterns
- **Email Validation**: RFC-compliant email validation

### 🛡️ Sanitization & Protection
- **XSS Prevention**: All user inputs are sanitized using HTML entity encoding
- **Character Validation**: Names must contain only letters, spaces, hyphens, apostrophes, and dots
- **Length Limits**: 
  - Name: 100 characters
  - Email: 255 characters
  - Subject: 200 characters
  - Message: 2000 characters
- **Content Type Validation**: Inquiry types are validated against allowed values

### 📧 Email Features
- **Dual Email Delivery**: Sends to info@gastrohub.com and confirmation to user
- **Professional Templates**: HTML and text email templates
- **Email Tagging**: Automatic tagging for organization
- **Reply-To Header**: Emails can be replied to directly

## Setup Instructions

### 1. Install Dependencies

The following packages have already been installed:

```bash
npm install react-hook-form @hookform/resolvers zod dompurify @types/dompurify
```

### 2. Set Up Resend Email Service

1. **Create Resend Account**:
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account
   - Verify your email address

2. **Get API Key**:
   - Go to API Keys section in Resend dashboard
   - Create a new API key
   - Copy the API key (starts with `re_`)

3. **Add Environment Variable**:
   Add the following to your Supabase Edge Function secrets:

   ```bash
   # Via Supabase Dashboard > Project Settings > Edge Functions > Environment Variables
   RESEND_API_KEY=re_your_api_key_here
   ```

   Or via CLI:
   ```bash
   supabase secrets set RESEND_API_KEY=re_your_api_key_here
   ```

### 3. Configure Domain (Optional but Recommended)

For production, configure your custom domain in Resend:

1. Go to Domains section in Resend dashboard
2. Add your domain (e.g., `gastrohub.com`)
3. Add the required DNS records
4. Wait for verification
5. Update the Edge Function to use your verified domain:

```typescript
from: 'GastroHub Contact <noreply@yourdomain.com>',
// and
from: 'GastroHub Support <support@yourdomain.com>',
```

### 4. Update Email Recipients

In the Edge Function (`supabase/functions/send-contact-email/index.ts`), update the recipient email:

```typescript
to: ['info@gastrohub.com'], // Change to your actual email
```

### 5. Test the Implementation

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the contact page**:
   ```
   http://localhost:3000/contact
   ```

3. **Fill out and submit the form** to test email delivery

### 6. Monitor and Debug

#### Check Edge Function Logs
```bash
# View recent logs
supabase functions logs send-contact-email
```

#### Common Issues and Solutions

1. **"Email service not configured" error**:
   - Verify `RESEND_API_KEY` environment variable is set
   - Check the API key is valid and active

2. **"Invalid form data" error**:
   - Check form validation rules
   - Ensure all required fields are filled
   - Verify inquiry type is one of the allowed values

3. **Rate limit exceeded**:
   - Users are limited to 5 submissions per minute
   - This is normal protection against spam

4. **Email not received**:
   - Check Resend dashboard for delivery status
   - Verify recipient email address
   - Check spam/junk folders

## Security Best Practices Implemented

### Input Validation
- **Client-side**: React Hook Form with Zod validation
- **Server-side**: Additional validation in Edge Function
- **Double validation**: Ensures data integrity

### Sanitization
```typescript
const sanitize = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};
```

### Rate Limiting
- **Per-IP tracking**: Prevents abuse from single sources
- **Time-based windows**: 1-minute sliding window
- **Configurable limits**: Easy to adjust thresholds

### CORS Configuration
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
```

## Form Fields and Validation

### Required Fields
- **Name**: 1-100 characters, letters/spaces/hyphens/apostrophes/dots only
- **Email**: Valid email format, max 255 characters
- **Subject**: 1-200 characters
- **Message**: 1-2000 characters
- **Inquiry Type**: Must be one of: general, sales, support, billing, feedback

### Optional Fields
- **Company**: Max 100 characters if provided
- **Newsletter**: Boolean checkbox for marketing consent

## Email Templates

### Professional HTML Template
- **Branded header** with GastroHub styling
- **Structured content** with clear field labels
- **Responsive design** for all devices
- **Footer metadata** with timestamp and source

### Plain Text Fallback
- **Clean formatting** for text-only email clients
- **All information preserved** in readable format

## Performance Considerations

### Edge Function Benefits
- **Global distribution**: Low latency worldwide
- **Auto-scaling**: Handles traffic spikes automatically
- **Cost-effective**: Pay per request pricing

### Rate Limiting Benefits
- **Spam protection**: Prevents automated abuse
- **Resource conservation**: Protects server resources
- **User experience**: Fast form submissions within limits

## Monitoring and Analytics

### Built-in Logging
- **Submission tracking**: All successful submissions logged
- **Error logging**: Failed attempts and reasons logged
- **Rate limit tracking**: Blocked requests logged

### Resend Analytics
- **Delivery tracking**: View email delivery status
- **Engagement metrics**: Open rates, click tracking
- **Error analysis**: Bounce and rejection tracking

## Production Checklist

- [ ] Resend API key configured
- [ ] Custom domain verified (optional but recommended)
- [ ] Recipient email updated to actual address
- [ ] Form tested with real submissions
- [ ] Edge Function logs reviewed
- [ ] Email delivery confirmed
- [ ] Rate limiting tested
- [ ] Error handling verified
- [ ] Spam folder checked for test emails
- [ ] Mobile responsiveness tested

## Support

If you encounter any issues with the contact form:

1. **Check the logs**: Review Edge Function logs for errors
2. **Verify configuration**: Ensure all environment variables are set
3. **Test manually**: Use the form to verify functionality
4. **Review documentation**: Double-check setup steps

The contact form is now fully functional and secure, ready for production use! 