import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { 
  ChefHat, 
  Search, 
  HelpCircle,
  Book,
  MessageSquare,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  Star,
  Users,
  Settings,
  CreditCard,
  Truck,
  Shield
} from 'lucide-react';

export function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Getting Started',
      description: 'Learn the basics of using GastroHub',
      articles: 12,
      color: 'primary'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Account Management',
      description: 'Manage your profile and settings',
      articles: 8,
      color: 'secondary'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Billing & Payments',
      description: 'Payment methods and billing questions',
      articles: 15,
      color: 'success'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Orders & Delivery',
      description: 'Track orders and delivery information',
      articles: 10,
      color: 'warning'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Security & Privacy',
      description: 'Keep your account safe and secure',
      articles: 6,
      color: 'error'
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      articles: 20,
      color: 'primary'
    }
  ];

  const popularArticles = [
    {
      title: 'How to create your first order',
      category: 'Getting Started',
      views: '2.5k',
      rating: 4.8
    },
    {
      title: 'Setting up payment methods',
      category: 'Billing & Payments',
      views: '1.8k',
      rating: 4.9
    },
    {
      title: 'Understanding delivery options',
      category: 'Orders & Delivery',
      views: '1.6k',
      rating: 4.7
    },
    {
      title: 'Managing your supplier profile',
      category: 'Account Management',
      views: '1.4k',
      rating: 4.6
    },
    {
      title: 'Two-factor authentication setup',
      category: 'Security & Privacy',
      views: '1.2k',
      rating: 4.8
    }
  ];

  const faqs = [
    {
      question: 'How do I sign up for GastroHub?',
      answer: 'You can sign up by clicking the "Get Started" button on our homepage. Choose your role (buyer, supplier, or delivery partner), fill in your details, and verify your email address. Our onboarding team will guide you through the setup process.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and digital wallets. For enterprise customers, we also offer net 30 payment terms and custom payment arrangements.'
    },
    {
      question: 'How does the delivery system work?',
      answer: 'Our delivery network consists of verified delivery partners who handle order fulfillment. You can track your orders in real-time, receive notifications at each stage, and communicate directly with delivery partners if needed.'
    },
    {
      question: 'Is my data secure on GastroHub?',
      answer: 'Yes, we take security seriously. We use industry-standard encryption, secure data centers, and regular security audits. We\'re also compliant with GDPR and other data protection regulations.'
    },
    {
      question: 'How do I become a verified supplier?',
      answer: 'To become verified, complete your profile with business documentation, provide references, and pass our quality assessment. Verification typically takes 3-5 business days and gives you access to premium features.'
    },
    {
      question: 'What are the fees for using GastroHub?',
      answer: 'We charge a small transaction fee on completed orders. The exact fee depends on your subscription tier and order volume. Contact our sales team for detailed pricing information.'
    }
  ];

  const contactOptions = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Support',
      description: 'Speak with our team',
      availability: 'Mon-Fri, 9AM-6PM EST',
      action: 'Call Now'
    }
  ];

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-100 text-[var(--primary-600)]';
      case 'secondary':
        return 'bg-secondary-100 text-secondary-600';
      case 'success':
        return 'bg-success-100 text-success-600';
      case 'warning':
        return 'bg-warning-100 text-warning-600';
      case 'error':
        return 'bg-error-100 text-error-600';
      default:
        return 'bg-neutral-100 text-[var(--muted-foreground)]';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-[var(--background)]/10 rounded-2xl mb-6">
              <HelpCircle className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl md:text-2xl text-[var(--primary-900)] mb-8 max-w-3xl mx-auto">
              Find answers to your questions and get the help you need
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-5 h-5" />
                <Input
                  placeholder="Search for help articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-4 text-lg bg-[var(--background)]/10 border-white/20 text-white placeholder-white/70"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-[var(--card-muted,#f9fafb)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-[var(--muted-foreground)]">
              Find help articles organized by topic
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow cursor-pointer" padding="lg">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${getCategoryColor(category.color)}`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary-600)] transition-colors">
                        {category.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary-600)] transition-colors" />
                    </div>
                    <p className="text-[var(--muted-foreground)] text-sm mb-3">
                      {category.description}
                    </p>
                    <Badge variant="secondary" size="sm">
                      {category.articles} articles
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-6">
                Popular Articles
              </h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Card key={index} className="group hover:shadow-md transition-shadow cursor-pointer" padding="md">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-[var(--foreground)] group-hover:text-[var(--primary-600)] transition-colors mb-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                          <Badge variant="outline" size="sm">
                            {article.category}
                          </Badge>
                          <span>{article.views} views</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-[var(--secondary-400)] fill-current" />
                            <span>{article.rating}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary-600)] transition-colors" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Options */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-6">
                Need More Help?
              </h2>
              <div className="space-y-4">
                {contactOptions.map((option, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow" padding="md">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 text-[var(--primary-600)] rounded-lg">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--foreground)] mb-1">
                          {option.title}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] mb-2">
                          {option.description}
                        </p>
                        <p className="text-xs text-neutral-500 mb-3">
                          {option.availability}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          {option.action}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[var(--card-muted,#f9fafb)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[var(--muted-foreground)]">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden" padding="none">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[var(--card-muted,#f9fafb)] transition-colors"
                >
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {faq.question}
                  </h3>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-neutral-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-neutral-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-[var(--muted-foreground)]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card padding="lg" className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-4">
              Still Need Help?
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline">
                <Book className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="w-8 h-8 text-[var(--secondary-400)]" />
            <span className="text-xl font-heading font-bold">GastroHub</span>
          </div>
          <p className="text-[var(--muted-foreground)]">
            © 2024 GastroHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HelpCenterPage;