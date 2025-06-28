import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuthContext } from '../../App';
import { supabase } from '../../lib/supabase';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Bell, 
  Eye, 
  Lock,
  Save,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';

export function SettingsPage() {
  const { user, recoverSession } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form states
  const [profileData, setProfileData] = useState({
    full_name: user?.profiles?.full_name || user?.user_metadata?.full_name || '',
    business_name: user?.profiles?.business_name || user?.user_metadata?.business_name || '',
    phone: user?.profiles?.phone || user?.user_metadata?.phone || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    new_password: '',
    confirm_password: '',
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.full_name,
          business_name: profileData.business_name,
          phone: profileData.phone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      await recoverSession();
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      showMessage('error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      showMessage('error', 'New passwords do not match.');
      return;
    }

    if (passwordData.new_password.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password
      });

      if (error) throw error;

      setPasswordData({
        new_password: '',
        confirm_password: '',
      });
      showMessage('success', 'Password updated successfully!');
    } catch (error) {
      console.error('Password update error:', error);
      showMessage('error', 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'success';
      case 'supplier': return 'primary';
      case 'buyer': return 'secondary';
      case 'delivery_partner': return 'warning';
      default: return 'default';
    }
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg border flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-success-50 border-success-200 text-success-800' 
              : 'bg-error-50 border-error-200 text-error-800'
          }`}>
            {message.type === 'success' ? 
              <CheckCircle className="w-5 h-5 flex-shrink-0" /> : 
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            }
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <Input
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <Input
                        value={profileData.email}
                        disabled
                        className="bg-muted"
                        placeholder="Email cannot be changed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Business Name
                      </label>
                      <Input
                        value={profileData.business_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, business_name: e.target.value }))}
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Change Password</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                      placeholder="Enter new password"
                      minLength={6}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      placeholder="Confirm new password"
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <Badge variant={getRoleBadgeColor(user?.role || 'user')} size="sm">
                    {formatRoleName(user?.role || 'user')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email Verified</span>
                  <Badge variant={user?.email_confirmed_at ? 'success' : 'warning'} size="sm">
                    {user?.email_confirmed_at ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 