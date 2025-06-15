import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { User, Mail, Phone, Edit3, CheckCircle } from 'lucide-react';

export function ProfilePage() {
  // Mock user data
  const user = {
    name: 'Alex Morgan',
    email: 'alex.morgan@gastrohub.com',
    phone: '+1 (555) 123-4567',
    role: 'Buyer',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card padding="lg" style={{ background: 'var(--card, #fff)' }}>
          <div className="flex items-center space-x-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4"
              style={{ borderColor: 'var(--primary-600)' }}
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{user.name}</h2>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="success" size="sm" style={{ backgroundColor: 'var(--success-600)' }}>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {user.status}
                </Badge>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{user.role}</span>
              </div>
              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <Mail className="inline w-4 h-4 mr-1" />{user.email}
              </div>
              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <Phone className="inline w-4 h-4 mr-1" />{user.phone}
              </div>
            </div>
            <Button variant="outline" size="sm" style={{ color: 'var(--primary-600)' }}>
              <Edit3 className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
        </Card>

        {/* Profile Details Form (read-only) */}
        <Card padding="lg" style={{ background: 'var(--card, #fff)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Profile Details
          </h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Name
              </label>
              <Input value={user.name} readOnly style={{ background: 'var(--input)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Email
              </label>
              <Input value={user.email} readOnly style={{ background: 'var(--input)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Phone
              </label>
              <Input value={user.phone} readOnly style={{ background: 'var(--input)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Role
              </label>
              <Input value={user.role} readOnly style={{ background: 'var(--input)', color: 'var(--foreground)' }} />
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
