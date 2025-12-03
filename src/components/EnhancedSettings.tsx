/**
 * MaycoleTracker vol XII™ - Enhanced Settings
 * User profile and application settings with authentication integration
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../lib/auth';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Bell, 
  Lock,
  Save,
  LogOut,
  Crown,
  Calendar,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export function EnhancedSettings() {
  const { user, organization, logout, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(
    organization?.settings.enableNotifications ?? true
  );
  const [voiceControl, setVoiceControl] = useState(
    organization?.settings.enableVoiceControl ?? true
  );
  const [barcodeScanning, setBarcodeScanning] = useState(
    organization?.settings.enableBarcodeScanning ?? true
  );

  // Handle profile update
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
      });
      
      toast.success('Profile Updated', {
        description: 'Your changes have been saved',
        icon: <CheckCircle className="w-4 h-4" />,
      });
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast.success('Logged out successfully', {
        description: 'See you next time!',
      });
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    toast.info('Password Change', {
      description: 'This feature requires backend integration',
    });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-400">
            Manage your account and application preferences
          </p>
        </motion.div>

        <div className="space-y-6">
          
          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      value={user?.email}
                      disabled
                      className="pl-10 bg-gray-800 border-gray-700 text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Email address cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Organization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  Organization
                </CardTitle>
                <CardDescription>
                  Your organization and subscription details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Organization Name</p>
                    <p className="text-lg">{organization?.name}</p>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Subscription Plan</p>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="capitalize">{organization?.subscriptionTier}</span>
                      <Badge
                        variant="outline"
                        className={
                          organization?.subscriptionStatus === 'active'
                            ? 'border-green-500/30 text-green-400'
                            : 'border-orange-500/30 text-orange-400'
                        }
                      >
                        {organization?.subscriptionStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {organization?.subscriptionExpiresAt && (
                  <>
                    <Separator className="bg-gray-800" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Subscription Expires</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(organization.subscriptionExpiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator className="bg-gray-800" />

                <div>
                  <p className="text-sm text-gray-400 mb-2">User Role</p>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                    <Shield className="w-3 h-3 mr-1" />
                    {user?.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  Preferences
                </CardTitle>
                <CardDescription>
                  Configure your application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-400">
                      Receive email updates about inventory changes
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Voice Control</Label>
                    <p className="text-sm text-gray-400">
                      Enable voice commands for hands-free operation
                    </p>
                  </div>
                  <Switch
                    checked={voiceControl}
                    onCheckedChange={setVoiceControl}
                  />
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Barcode Scanning</Label>
                    <p className="text-sm text-gray-400">
                      Enable barcode scanner for quick product lookup
                    </p>
                  </div>
                  <Switch
                    checked={barcodeScanning}
                    onCheckedChange={setBarcodeScanning}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-500" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1">Password</p>
                    <p className="text-sm text-gray-400">
                      Last changed: {new Date(user?.updatedAt || '').toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleChangePassword}
                    className="border-gray-700"
                  >
                    Change Password
                  </Button>
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1">Last Login</p>
                    <p className="text-sm text-gray-400">
                      {user?.lastLoginAt 
                        ? new Date(user.lastLoginAt).toLocaleString()
                        : 'Never'
                      }
                    </p>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1">Account Status</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          user?.isActive
                            ? 'border-green-500/30 text-green-400'
                            : 'border-red-500/30 text-red-400'
                        }
                      >
                        {user?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gray-900 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible account actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1">Logout</p>
                    <p className="text-sm text-gray-400">
                      Sign out of your account
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
