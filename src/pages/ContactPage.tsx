import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { supabase } from '../lib/supabase';
import { 
  ChefHat, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Users,
  Headphones,
  FileText,
  AlertTriangle
} from 'lucide-react';

// Validation schema with security measures
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  company: z.string()
    .max(100, 'Company name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&'\.]+$/, 'Company name contains invalid characters')
    .optional()
    .or(z.literal('')),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
  inquiryType: z.enum(['general', 'sales', 'support', 'billing', 'feedback']),
  newsletter: z.boolean().optional()
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      subject: '',
      message: '',
      inquiryType: 'general',
      newsletter: false
    }
  });

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Partnerships' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@gastrohub.com',
      responseTime: 'Within 24 hours'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Support',
      description: 'Speak with our team',
      contact: '+27 21 123 4567',
      responseTime: 'Mon-Fri, 9AM-6PM SAST'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available in app',
      responseTime: 'Mon-Fri, 9AM-6PM SAST'
    }
  ];

  const offices = [
    {
      city: 'Cape Town',
      address: 'GastroHub, 12 Loop Street, Cape Town, 8001, South Africa',
      phone: '+27 21 123 4567',
      email: 'info@gastrohub.com'
    }
  ];

  // Sanitize form data before sending
  const sanitizeFormData = (data: ContactFormData) => {
    return {
      name: DOMPurify.sanitize(data.name.trim()),
      email: DOMPurify.sanitize(data.email.trim().toLowerCase()),
      company: data.company ? DOMPurify.sanitize(data.company.trim()) : '',
      subject: DOMPurify.sanitize(data.subject.trim()),
      message: DOMPurify.sanitize(data.message.trim()),
      inquiryType: data.inquiryType,
      newsletter: data.newsletter || false,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      // Add simple honeypot field for bot detection
      source: 'contact_form'
    };
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Sanitize the form data
      const sanitizedData = sanitizeFormData(data);

      // Call Supabase Edge Function to send email
      const { data: result, error } = await supabase.functions.invoke('send-contact-email', {
        body: sanitizedData
      });

      if (error) {
        console.error('Error sending email:', error);
        throw new Error(error.message || 'Failed to send message');
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      // Success
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to send message. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternative: Use Netlify Forms (simpler, no API keys needed)
  const onSubmitNetlify = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Sanitize form data
      const sanitizedData = sanitizeFormData(data);

      // Create form data for Netlify
      const formData = new FormData();
      formData.append('form-name', 'contact');
      formData.append('name', sanitizedData.name);
      formData.append('email', sanitizedData.email);
      formData.append('company', sanitizedData.company || '');
      formData.append('inquiryType', sanitizedData.inquiryType);
      formData.append('subject', sanitizedData.subject);
      formData.append('message', sanitizedData.message);
      formData.append('newsletter', sanitizedData.newsletter ? 'Yes' : 'No');

      // Submit to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--primary-50)] via-[var(--background)] to-[var(--secondary-50)] py-12 px-4">
          <Card className="max-w-md w-full text-center" padding="lg">
            <div className="w-16 h-16 bg-[var(--success-100)] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--success-600)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              Message Sent Successfully!
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours at the email address you provided.
            </p>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setSubmitError(null);
              }} 
              className="w-full"
            >
              Send Another Message
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--primary-900)] text-[var(--foreground)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-[var(--background)]/10 rounded-2xl mb-6">
              <Headphones className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-[var(--muted-foreground)] mb-8 max-w-3xl mx-auto">
              We're here to help. Get in touch with our team for support, partnerships, or any questions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-[var(--card-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-[var(--muted-foreground)]">
              Choose the best way to reach us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow" padding="lg">
                <div className="inline-flex p-4 bg-[var(--primary-50)] text-[var(--primary-600)] rounded-2xl mb-4">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  {method.title}
                </h3>
                <p className="text-[var(--muted-foreground)] mb-3">
                  {method.description}
                </p>
                <p className="font-semibold text-[var(--primary-900)] mb-2">
                  {method.contact}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {method.responseTime}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Send Us a Message
            </h2>
            <p className="text-xl text-[var(--muted-foreground)]">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <Card padding="lg">
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium">Error sending message</h4>
                  <p className="text-red-700 text-sm mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-3 py-2 border border-[var(--stroke)] bg-background text-[var(--foreground)] rounded-lg text-sm placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border border-[var(--stroke)] bg-background text-[var(--foreground)] rounded-lg text-sm placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                    placeholder="your.email@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    {...register('company')}
                    className="w-full px-3 py-2 border border-[var(--stroke)] bg-background text-[var(--foreground)] rounded-lg text-sm placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                    placeholder="Your company name"
                  />
                  {errors.company && (
                    <p className="text-red-600 text-xs mt-1">{errors.company.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Inquiry Type *
                  </label>
                  <select
                    {...register('inquiryType')}
                    className="w-full px-3 py-2 border border-[var(--stroke)] bg-background text-[var(--foreground)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.inquiryType && (
                    <p className="text-red-600 text-xs mt-1">{errors.inquiryType.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  {...register('subject')}
                  className="w-full px-3 py-2 border border-[var(--stroke)] bg-background text-[var(--foreground)] rounded-lg text-sm placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                  placeholder="Brief description of your inquiry"
                />
                {errors.subject && (
                  <p className="text-red-600 text-xs mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  rows={6}
                  className="w-full px-3 py-2 border border-[var(--stroke)] bg-background text-[var(--foreground)] rounded-lg text-sm placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                  placeholder="Please provide details about your inquiry..."
                />
                {errors.message && (
                  <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>
                )}
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {watch('message')?.length || 0}/2000 characters
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  {...register('newsletter')}
                  className="h-4 w-4 text-[var(--primary-600)] focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="newsletter" className="text-sm text-neutral-700">
                  I'd like to receive updates about GastroHub products and services
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>

              <p className="text-xs text-[var(--muted-foreground)] text-center">
                By submitting this form, you agree that your data will be processed securely and used only to respond to your inquiry.
              </p>
            </form>
          </Card>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-gray-900 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-white dark:text-gray-100 mb-4">
              Our Offices
            </h2>
            <p className="text-xl text-gray-300 dark:text-gray-400">
              Visit us at one of our global locations
            </p>
          </div>
          
          <div className={`${offices.length === 1 
            ? 'flex justify-center' 
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          }`}>
            {offices.map((office, index) => (
              <Card 
                key={index} 
                className={`
                  hover:shadow-2xl hover:scale-105 transition-all duration-300 
                  bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 
                  border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500
                  shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20
                  ${offices.length === 1 ? 'w-full max-w-lg' : ''}
                `} 
                padding="lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {office.city}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address:</p>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{office.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone:</p>
                    <p className="text-gray-600 dark:text-gray-400">{office.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email:</p>
                    <p className="text-blue-600 dark:text-blue-400">{office.email}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[var(--muted-foreground)]">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                How do I get started with GastroHub?
              </h3>
              <p className="text-[var(--muted-foreground)]">
                Simply sign up for an account, complete your profile, and start browsing our marketplace. 
                Our onboarding team will guide you through the process.
              </p>
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                What are your payment terms?
              </h3>
              <p className="text-[var(--muted-foreground)]">
                We offer flexible payment terms including EFT, SnapScan, Zapper, credit/debit cards, and 30-day accounts. 
                Contact our sales team for custom payment arrangements.
              </p>
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Do you offer customer support?
              </h3>
              <p className="text-[var(--muted-foreground)]">
                Yes! We provide 24/7 customer support via email, phone, and live chat. 
                Our dedicated support team is here to help you succeed.
              </p>
            </Card>
          </div>

          {/* <div className="text-center mt-12">
            <p className="text-[var(--muted-foreground)] mb-4">
              Can't find what you're looking for?
            </p>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Visit Help Center
            </Button>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ContactPage;