import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { 
  ChefHat, 
  Shield,
  Calendar,
  AlertCircle,
  Lock,
  Eye,
  Database,
  UserCheck
} from 'lucide-react';

export function PrivacyPolicyPage() {
  const lastUpdated = 'January 1, 2024';

  const sections = [
    {
      title: '1. Information We Collect',
      icon: <Database className="w-5 h-5" />,
      content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, phone number, business information, payment details, and any other information you choose to provide. We also automatically collect certain information about your device and how you interact with our platform, including IP address, browser type, operating system, and usage patterns.`
    },
    {
      title: '2. How We Use Your Information',
      icon: <UserCheck className="w-5 h-5" />,
      content: `We use the information we collect to provide, maintain, and improve our services; process transactions; send you technical notices and support messages; communicate with you about products, services, and promotional offers; monitor and analyze trends and usage; detect and prevent fraudulent transactions; and comply with legal obligations. We may also use your information to personalize your experience and provide relevant content and recommendations.`
    },
    {
      title: '3. Information Sharing and Disclosure',
      icon: <Eye className="w-5 h-5" />,
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with service providers who assist us in operating our platform; business partners when you engage in certain activities; law enforcement or government agencies when required by law; and other parties in connection with a merger, acquisition, or sale of assets.`
    },
    {
      title: '4. Data Security',
      icon: <Lock className="w-5 h-5" />,
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure data transmission protocols, regular security assessments, access controls, and employee training on data protection. However, no method of transmission over the internet or electronic storage is 100% secure.`
    },
    {
      title: '5. Data Retention',
      icon: <Database className="w-5 h-5" />,
      content: `We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it. Account information is typically retained for the duration of your account plus a reasonable period thereafter for legal and business purposes.`
    },
    {
      title: '6. Your Rights and Choices',
      icon: <UserCheck className="w-5 h-5" />,
      content: `You have certain rights regarding your personal information, including the right to access, update, or delete your information; opt out of certain communications; request data portability; and lodge complaints with supervisory authorities. You can exercise these rights by contacting us through the methods provided in this policy. We will respond to your requests in accordance with applicable law.`
    },
    {
      title: '7. Cookies and Tracking Technologies',
      icon: <Eye className="w-5 h-5" />,
      content: `We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities and to provide personalized content and advertisements. You can control cookies through your browser settings, but disabling cookies may affect the functionality of our platform. We also use analytics services to understand how users interact with our platform.`
    },
    {
      title: '8. International Data Transfers',
      icon: <Database className="w-5 h-5" />,
      content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than your country. When we transfer your information internationally, we implement appropriate safeguards to protect your information in accordance with applicable law.`
    },
    {
      title: '9. Children\'s Privacy',
      icon: <Shield className="w-5 h-5" />,
      content: `Our platform is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly. If you believe we have collected information from a child under 13, please contact us immediately.`
    },
    {
      title: '10. Changes to This Privacy Policy',
      icon: <AlertCircle className="w-5 h-5" />,
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of any material changes by posting the new Privacy Policy on our platform and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.`
    }
  ];

  const dataTypes = [
    {
      category: 'Account Information',
      examples: ['Name, email address, phone number', 'Business name and address', 'Account preferences and settings']
    },
    {
      category: 'Transaction Data',
      examples: ['Order history and details', 'Payment information', 'Shipping and billing addresses']
    },
    {
      category: 'Usage Information',
      examples: ['Pages visited and time spent', 'Search queries and filters used', 'Device and browser information']
    },
    {
      category: 'Communication Data',
      examples: ['Messages sent through our platform', 'Customer support interactions', 'Marketing preferences']
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
              <Shield className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-[var(--primary-900)] mb-8 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center space-x-2 text-[var(--primary-200)]">
              <Calendar className="w-5 h-5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-8 bg-success-50 border-b border-success-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-success-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-success-800 mb-1">
                Our Privacy Commitment
              </h3>
              <p className="text-success-700 text-sm">
                At GastroHub, we are committed to protecting your privacy and ensuring the security of your 
                personal information. This Privacy Policy explains how we collect, use, share, and protect 
                your information when you use our platform and services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-4">
              Introduction
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              GastroHub ("we," "our," or "us") respects your privacy and is committed to protecting your 
              personal information. This Privacy Policy describes how we collect, use, disclose, and 
              safeguard your information when you use our B2B marketplace platform. This policy applies 
              to all users of our platform, including buyers, suppliers, and delivery partners.
            </p>
          </div>

          {/* Data Types We Collect */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-6">
              Types of Information We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataTypes.map((type, index) => (
                <Card key={index} padding="lg" className="hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                    {type.category}
                  </h3>
                  <ul className="space-y-2">
                    {type.examples.map((example, idx) => (
                      <li key={idx} className="text-[var(--muted-foreground)] text-sm flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} padding="lg" className="hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="p-2 bg-primary-100 text-[var(--primary-600)] rounded-lg">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {section.title}
                  </h3>
                </div>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  {section.content}
                </p>
              </Card>
            ))}
          </div>

          {/* GDPR Rights */}
          <Card padding="lg" className="mt-12 bg-primary-50 text-primary-900 dark:bg-primary-900 dark:text-primary-100">
  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
    Your Rights Under GDPR
  </h3>
  <p className="text-[var(--muted-foreground)] mb-4">
    If you are located in the European Union, you have additional rights under the General
    Data Protection Regulation (GDPR), including:
  </p>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-primary-600 rounded-full dark:bg-primary-200"></div>
        <span className="text-sm text-primary-900 dark:text-primary-100">Right to access your data</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-primary-600 rounded-full dark:bg-primary-200"></div>
        <span className="text-sm text-primary-900 dark:text-primary-100">Right to rectification</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-primary-600 rounded-full dark:bg-primary-200"></div>
        <span className="text-sm text-primary-900 dark:text-primary-100">Right to erasure</span>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-primary-600 rounded-full dark:bg-primary-200"></div>
        <span className="text-sm text-primary-900 dark:text-primary-100">Right to data portability</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-primary-600 rounded-full dark:bg-primary-200"></div>
        <span className="text-sm text-primary-900 dark:text-primary-100">Right to object to processing</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-primary-600 rounded-full dark:bg-primary-200"></div>
        <span className="text-sm text-primary-900 dark:text-primary-100">Right to restrict processing</span>
      </div>
    </div>
  </div>
</Card>

          {/* Contact Information */}
          <Card padding="lg" className="mt-8 bg-[var(--card-muted,#f9fafb)] text-[var(--foreground)] dark:bg-background dark:text-[var(--foreground)]">
  <div className="text-center">
    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
      Contact Us About Privacy
    </h3>
    <p className="text-[var(--muted-foreground)] mb-4">
      If you have any questions about this Privacy Policy or our privacy practices,
      please contact our Data Protection Officer.
    </p>
    <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
      <p><strong>Email:</strong> privacy@gastrohub.com</p>
      <p><strong>Data Protection Officer:</strong> dpo@gastrohub.com</p>
      <p><strong>Address:</strong> GastroHub Privacy Team</p>
      <p>123 Market Street, Suite 400</p>
      <p>San Francisco, CA 94105</p>
    </div>
  </div>
</Card>
        </div>
      </section>

      {/* Footer */}

    </div>
  );
}

export default PrivacyPolicyPage;