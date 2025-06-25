import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
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
  FileText
} from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      contact: '+1 (555) 123-4567',
      responseTime: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available in app',
      responseTime: 'Mon-Fri, 9AM-6PM EST'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Market Street, Suite 400\nSan Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@gastrohub.com'
    },
    {
      city: 'New York',
      address: '456 Broadway, Floor 12\nNew York, NY 10013',
      phone: '+1 (555) 987-6543',
      email: 'ny@gastrohub.com'
    },
    {
      city: 'London',
      address: '789 Oxford Street\nLondon W1C 1DX, UK',
      phone: '+44 20 7123 4567',
      email: 'london@gastrohub.com'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
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
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <Button onClick={() => setIsSubmitted(false)} className="w-full">
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
              Fill out the form below and we'll get back to you soon
            </p>
          </div>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Your full name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="your.email@company.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company Name"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your company name"
                />
                <Select
                  label="Inquiry Type"
                  options={inquiryTypes}
                  value={formData.inquiryType}
                  onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                  required
                />
              </div>

              <Input
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
                placeholder="Brief description of your inquiry"
              />

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-[var(--stroke)] text-[var(--foreground)] rounded-lg text-sm placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  className="h-4 w-4 text-[var(--primary-600)] focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="newsletter" className="text-sm text-neutral-700">
                  I'd like to receive updates about GastroHub products and services
                </label>
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full"
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-[var(--card-muted,#f9fafb)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Our Offices
            </h2>
            <p className="text-xl text-[var(--muted-foreground)]">
              Visit us at one of our global locations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" padding="lg">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-[var(--primary-600)]" />
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {office.city}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-700 mb-1">Address:</p>
                    <p className="text-[var(--muted-foreground)] whitespace-pre-line">{office.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700 mb-1">Phone:</p>
                    <p className="text-[var(--muted-foreground)]">{office.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700 mb-1">Email:</p>
                    <p className="text-[var(--primary-600)]">{office.email}</p>
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
                We offer flexible payment terms including net 30, credit card, and bank transfer options. 
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

          <div className="text-center mt-12">
            <p className="text-[var(--muted-foreground)] mb-4">
              Can't find what you're looking for?
            </p>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Visit Help Center
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ContactPage;