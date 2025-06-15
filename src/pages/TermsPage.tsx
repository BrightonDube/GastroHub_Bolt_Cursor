import React from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { 
  ChefHat, 
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';

export function TermsPage() {
  const lastUpdated = 'January 1, 2024';

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using GastroHub ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: '2. Platform Description',
      content: `GastroHub is a B2B marketplace platform that connects food buyers, suppliers, and delivery partners. We provide technology services to facilitate transactions between these parties but are not directly involved in the actual transaction between buyers and suppliers.`
    },
    {
      title: '3. User Accounts',
      content: `To access certain features of the Platform, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.`
    },
    {
      title: '4. User Responsibilities',
      content: `Users must provide accurate, current, and complete information during registration and maintain the accuracy of such information. You are responsible for all content you post and activities conducted through your account. You agree not to use the Platform for any unlawful purpose or in any way that could damage, disable, or impair the Platform.`
    },
    {
      title: '5. Prohibited Activities',
      content: `You may not: (a) use the Platform for any illegal activities; (b) post false, misleading, or fraudulent content; (c) interfere with or disrupt the Platform's operation; (d) attempt to gain unauthorized access to other user accounts; (e) violate any applicable laws or regulations; (f) engage in any form of harassment or abuse of other users.`
    },
    {
      title: '6. Content and Intellectual Property',
      content: `Users retain ownership of content they post but grant GastroHub a license to use, display, and distribute such content on the Platform. GastroHub owns all intellectual property rights in the Platform itself, including but not limited to software, design, trademarks, and proprietary algorithms.`
    },
    {
      title: '7. Transactions and Payments',
      content: `GastroHub facilitates transactions between buyers and suppliers but is not a party to these transactions. Payment processing is handled through third-party payment processors. Users are responsible for all applicable taxes and fees related to their transactions.`
    },
    {
      title: '8. Privacy and Data Protection',
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using the Platform, you consent to the collection and use of your information as described in our Privacy Policy.`
    },
    {
      title: '9. Platform Availability',
      content: `While we strive to maintain continuous service, GastroHub does not guarantee that the Platform will be available at all times. We may suspend or terminate service for maintenance, updates, or other operational reasons. We are not liable for any downtime or service interruptions.`
    },
    {
      title: '10. Limitation of Liability',
      content: `GastroHub's liability is limited to the maximum extent permitted by law. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount paid by you to GastroHub in the twelve months preceding the claim.`
    },
    {
      title: '11. Indemnification',
      content: `You agree to indemnify and hold harmless GastroHub, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.`
    },
    {
      title: '12. Termination',
      content: `Either party may terminate this agreement at any time. GastroHub may suspend or terminate your account immediately if you violate these Terms. Upon termination, your right to use the Platform ceases immediately, but provisions regarding liability, indemnification, and dispute resolution shall survive.`
    },
    {
      title: '13. Dispute Resolution',
      content: `Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in San Francisco, California, and shall be conducted in English.`
    },
    {
      title: '14. Governing Law',
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any legal action or proceeding shall be brought exclusively in the courts of San Francisco, California.`
    },
    {
      title: '15. Changes to Terms',
      content: `GastroHub reserves the right to modify these Terms at any time. We will notify users of significant changes via email or platform notifications. Continued use of the Platform after changes constitutes acceptance of the new Terms.`
    },
    {
      title: '16. Contact Information',
      content: `If you have any questions about these Terms of Service, please contact us at legal@gastrohub.com or write to us at: GastroHub Legal Department, 123 Market Street, Suite 400, San Francisco, CA 94105.`
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-[var(--background)]/10 rounded-2xl mb-6">
              <FileText className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-[var(--primary-900)] mb-8 max-w-3xl mx-auto">
              Please read these terms carefully before using GastroHub
            </p>
            <div className="flex items-center justify-center space-x-2 text-[var(--primary-200)]">
              <Calendar className="w-5 h-5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-warning-50 border-b border-warning-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-warning-800 mb-1">
                Important Legal Agreement
              </h3>
              <p className="text-warning-700 text-sm">
                These Terms of Service constitute a legally binding agreement between you and GastroHub. 
                By using our platform, you agree to be bound by these terms. If you do not agree with any 
                part of these terms, you should not use our services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-4">
                Introduction
              </h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                Welcome to GastroHub. These Terms of Service ("Terms") govern your use of our platform 
                and services. GastroHub operates as a B2B marketplace connecting food industry professionals 
                including buyers, suppliers, and delivery partners. By creating an account or using our 
                services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={index} padding="lg" className="hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                    {section.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    {section.content}
                  </p>
                </Card>
              ))}
            </div>

            {/* Effective Date */}
            <Card padding="lg" className="mt-12 bg-[var(--card-muted,#f9fafb)]">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  Effective Date
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  These Terms of Service are effective as of {lastUpdated} and will remain in effect 
                  until modified or terminated in accordance with the terms herein.
                </p>
              </div>
            </Card>

            {/* Contact Information */}
            <Card padding="lg" className="mt-8 bg-primary-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-[var(--muted-foreground)] mb-4">
                  If you have any questions about these Terms of Service, please don't hesitate to contact us.
                </p>
                <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
                  <p><strong>Email:</strong> legal@gastrohub.com</p>
                  <p><strong>Address:</strong> GastroHub Legal Department</p>
                  <p>123 Market Street, Suite 400</p>
                  <p>San Francisco, CA 94105</p>
                </div>
              </div>
            </Card>
          </div>
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

export default TermsPage;