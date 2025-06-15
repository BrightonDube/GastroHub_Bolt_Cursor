import React from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ChefHat, 
  Shield,
  Lock,
  Eye,
  Server,
  AlertTriangle,
  CheckCircle,
  Key,
  FileText,
  Users,
  Globe,
  Zap
} from 'lucide-react';

export function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'End-to-End Encryption',
      description: 'All data transmission is protected with industry-standard SSL/TLS encryption',
      status: 'Active'
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: 'Multi-Factor Authentication',
      description: 'Additional security layer with SMS, email, or authenticator app verification',
      status: 'Available'
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: 'Secure Data Centers',
      description: 'Data stored in SOC 2 Type II certified facilities with 24/7 monitoring',
      status: 'Certified'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Regular Security Audits',
      description: 'Third-party penetration testing and vulnerability assessments quarterly',
      status: 'Ongoing'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Access Controls',
      description: 'Role-based permissions and principle of least privilege access',
      status: 'Enforced'
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: 'Threat Monitoring',
      description: 'Real-time monitoring and automated threat detection systems',
      status: '24/7'
    }
  ];

  const certifications = [
    {
      name: 'SOC 2 Type II',
      description: 'Security, availability, and confidentiality controls',
      issuer: 'AICPA',
      validUntil: '2024-12-31'
    },
    {
      name: 'ISO 27001',
      description: 'Information security management system',
      issuer: 'ISO',
      validUntil: '2024-11-15'
    },
    {
      name: 'PCI DSS Level 1',
      description: 'Payment card industry data security standard',
      issuer: 'PCI Security Standards Council',
      validUntil: '2024-10-20'
    },
    {
      name: 'GDPR Compliant',
      description: 'General Data Protection Regulation compliance',
      issuer: 'EU',
      validUntil: 'Ongoing'
    }
  ];

  const securityPractices = [
    {
      category: 'Data Protection',
      practices: [
        'Data encryption at rest and in transit',
        'Regular automated backups',
        'Data anonymization and pseudonymization',
        'Secure data deletion procedures'
      ]
    },
    {
      category: 'Access Management',
      practices: [
        'Multi-factor authentication',
        'Role-based access controls',
        'Regular access reviews',
        'Automated account lockout policies'
      ]
    },
    {
      category: 'Infrastructure Security',
      practices: [
        'Network segmentation and firewalls',
        'Intrusion detection systems',
        'Regular security patches',
        'Secure development lifecycle'
      ]
    },
    {
      category: 'Incident Response',
      practices: [
        '24/7 security monitoring',
        'Automated threat detection',
        'Incident response procedures',
        'Regular security training'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'certified':
      case 'enforced':
        return 'success';
      case 'available':
      case 'ongoing':
        return 'primary';
      case '24/7':
        return 'warning';
      default:
        return 'secondary';
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
              <Shield className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Security & Trust
            </h1>
            <p className="text-xl md:text-2xl text-[var(--primary-900)] mb-8 max-w-3xl mx-auto">
              Your security is our top priority. Learn about our comprehensive security measures 
              and industry certifications.
            </p>
            <div className="flex items-center justify-center space-x-6 text-[var(--primary-200)]">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-[var(--success-400)]" />
                <CheckCircle className="w-5 h-5 text-success-400" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-400" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-400" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-[var(--card-muted,#f9fafb)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
              We implement multiple layers of security to protect your data and ensure platform integrity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow" padding="lg">
                <div className="inline-flex p-4 bg-primary-100 text-[var(--primary-600)] rounded-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--muted-foreground)] mb-4">
                  {feature.description}
                </p>
                <Badge variant={getStatusColor(feature.status) as any}>
                  {feature.status}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Industry Certifications
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Our security practices are validated by leading industry standards and certifications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow" padding="lg">
                <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  {cert.name}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-3">
                  {cert.description}
                </p>
                <div className="text-xs text-neutral-500">
                  <p className="mb-1">Issued by: {cert.issuer}</p>
                  <p>Valid until: {cert.validUntil}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-16 bg-[var(--card-muted,#f9fafb)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Security Practices
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Comprehensive security measures across all aspects of our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityPractices.map((section, index) => (
              <Card key={index} padding="lg" className="hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.practices.map((practice, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--muted-foreground)]">{practice}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Transparency */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--foreground)] mb-4">
              Transparency & Accountability
            </h2>
            <p className="text-xl text-[var(--muted-foreground)]">
              We believe in transparency about our security practices and incident response
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card padding="lg" className="text-center">
              <FileText className="w-12 h-12 text-[var(--primary-600)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                Security Reports
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                Regular security assessment reports and audit findings
              </p>
              <Button variant="outline" size="sm">
                View Reports
              </Button>
            </Card>

            <Card padding="lg" className="text-center">
              <Globe className="w-12 h-12 text-[var(--primary-600)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                Status Page
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                Real-time platform status and incident notifications
              </p>
              <Button variant="outline" size="sm">
                Check Status
              </Button>
            </Card>

            <Card padding="lg" className="text-center">
              <Zap className="w-12 h-12 text-[var(--primary-600)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                Bug Bounty
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                Responsible disclosure program for security researchers
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="py-16 bg-[var(--card-muted,#f9fafb)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card padding="lg" className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-warning-600 mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-4">
                Security Incident Response
              </h2>
              <p className="text-[var(--muted-foreground)] mb-6 max-w-2xl mx-auto">
                In the unlikely event of a security incident, we have comprehensive response procedures 
                to minimize impact and keep you informed throughout the process.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 text-[var(--primary-600)] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">Immediate Response</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Incident detected and contained within 1 hour</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning-100 text-warning-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">Customer Notification</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Affected users notified within 24 hours</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">Full Report</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Detailed incident report within 72 hours</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report Security Issue
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Security Documentation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card padding="lg" className="text-center">
            <h2 className="text-2xl font-heading font-bold text-[var(--foreground)] mb-4">
              Contact Our Security Team
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              Have questions about our security practices or need to report a security concern?
            </p>
            <div className="space-y-2 text-sm text-[var(--muted-foreground)] mb-6">
              <p><strong>Security Team:</strong> security@gastrohub.com</p>
              <p><strong>Bug Bounty:</strong> security-research@gastrohub.com</p>
              <p><strong>Emergency:</strong> +1 (555) 123-SECURITY</p>
            </div>
            <Button>
              Contact Security Team
            </Button>
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

export default SecurityPage;