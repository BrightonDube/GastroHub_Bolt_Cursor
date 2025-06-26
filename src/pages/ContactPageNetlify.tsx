import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Send,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Headphones
} from 'lucide-react';

// Simple validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Please enter a valid email address').max(255, 'Email too long'),
  company: z.string().max(100, 'Company name too long').optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  inquiryType: z.enum(['general', 'sales', 'support', 'billing', 'feedback']),
  newsletter: z.boolean().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'sales', label: 'Sales & Partnerships' },
  { value: 'support', label: 'Technical Support' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'feedback', label: 'Feedback & Suggestions' },
];

const contactMethods = [
  {
    icon: <Mail className="w-8 h-8" />,
    title: 'Email Support',
    description: 'Get help via email',
    contact: 'info@gastrohub.com',
    responseTime: 'Response within 24 hours',
  },
  {
    icon: <Phone className="w-8 h-8" />,
    title: 'Phone Support',
    description: 'Talk to our team directly',
    contact: '+27 11 123 4567',
    responseTime: 'Mon-Fri, 9AM-5PM',
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: 'Live Chat',
    description: 'Chat with us in real-time',
    contact: 'Available in app',
    responseTime: 'Instant response',
  },
];

function ContactPageNetlify() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiryType: 'general',
      newsletter: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Create form data for Netlify
      const formData = new FormData();
      formData.append('form-name', 'contact');
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Submit to Netlify (this form will be processed by Netlify and emailed to you)
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
      setSubmitError('Failed to send message. Please try again or email us directly.');
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
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
      <section className="bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--primary-900)] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-6">
              <Headphones className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              We're here to help. Get in touch with our team for support, partnerships, or any questions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-gray-50">
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
                <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  {method.title}
                </h3>
                <p className="text-[var(--muted-foreground)] mb-3">
                  {method.description}
                </p>
                <p className="font-semibold text-blue-900 mb-2">
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

            {/* Hidden field for Netlify form detection */}
            <form 
              name="contact" 
              onSubmit={handleSubmit(onSubmit)} 
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="space-y-6"
            >
              {/* Hidden honeypot field for spam protection */}
              <input type="hidden" name="form-name" value="contact" />
              <div style={{ display: 'none' }}>
                <input name="bot-field" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide details about your inquiry..."
                />
                {errors.message && (
                  <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {watch('message')?.length || 0}/2000 characters
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  {...register('newsletter')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-700">
                  I'd like to receive updates about GastroHub products and services
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                variant="solid"
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree that your data will be processed securely and used only to respond to your inquiry.
              </p>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactPageNetlify; 