import React from 'react';
import { Button } from './ui/Button';
import { Mail } from 'lucide-react';

interface MailtoButtonProps {
  email?: string;
  subject?: string;
  body?: string;
  className?: string;
}

export function MailtoButton({ 
  email = 'info@gastrohub.com', 
  subject = 'Contact from GastroHub Website',
  body = '',
  className 
}: MailtoButtonProps) {
  const handleMailto = () => {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    
    const mailtoUrl = `mailto:${email}?${params.toString()}`;
    window.location.href = mailtoUrl;
  };

  return (
    <Button onClick={handleMailto} className={className} variant="solid">
      <Mail className="w-4 h-4 mr-2" />
      Send Email
    </Button>
  );
}

// Usage example:
export function QuickContactForm() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Quick Contact</h3>
      <p className="text-gray-600 mb-4">
        Click below to open your email client with our address pre-filled:
      </p>
      <MailtoButton 
        subject="Inquiry from GastroHub Website"
        body="Hi GastroHub team,%0D%0A%0D%0AI would like to inquire about:%0D%0A%0D%0A[Please describe your inquiry here]%0D%0A%0D%0AThank you!"
      />
    </div>
  );
} 