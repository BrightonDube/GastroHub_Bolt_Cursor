import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuthContext } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
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

  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: false,
    order_updates: true,
    security_alerts: true,
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
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

      // Refresh user data
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
        current_password: '',
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

  const handlePreferencesUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      showMessage('success', 'Preferences updated successfully!');
    } catch (error) {
      console.error('Preferences update error:', error);
      showMessage('error', 'Failed to update preferences. Please try again.');
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Message Alert */}
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
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Profile */}
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

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Security Settings</span>
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

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { key: 'email_notifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'sms_notifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                    { key: 'marketing_emails', label: 'Marketing Emails', description: 'Receive promotional and marketing emails' },
                    { key: 'order_updates', label: 'Order Updates', description: 'Get notified about order status changes' },
                    { key: 'security_alerts', label: 'Security Alerts', description: 'Receive security-related notifications' },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">{pref.label}</h4>
                        <p className="text-sm text-muted-foreground">{pref.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreferences(prev => ({ 
                          ...prev, 
                          [pref.key]: !prev[pref.key as keyof typeof prev] 
                        }))}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                          preferences[pref.key as keyof typeof preferences] ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            preferences[pref.key as keyof typeof preferences] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                  <Button onClick={handlePreferencesUpdate} disabled={loading} variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Overview Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm text-foreground">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-3" />
                  View Activity Log
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-3" />
                  Two-Factor Auth
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-3" />
                  Export Data
                </Button>
                <Button variant="ghost" className="w-full justify-start text-error-600 hover:text-error-700">
                  <AlertCircle className="w-4 h-4 mr-3" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 