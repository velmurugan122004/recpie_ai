import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AccountManagement = ({ onPasswordChange, onDataExport, onAccountDelete }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData?.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData?.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData?.newPassword?.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e?.preventDefault();
    const errors = validatePassword();
    setPasswordErrors(errors);
    
    if (Object.keys(errors)?.length === 0) {
      setIsChangingPassword(true);
      try {
        await onPasswordChange(passwordData);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } catch (error) {
        setPasswordErrors({ submit: 'Failed to change password. Please try again.' });
      } finally {
        setIsChangingPassword(false);
      }
    }
  };

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      await onDataExport();
    } finally {
      setIsExporting(false);
    }
  };

  const handleAccountDelete = async () => {
    await onAccountDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Shield" size={20} color="var(--color-primary)" />
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Account Management
        </h2>
      </div>
      <div className="space-y-6">
        {/* Password Change Section */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-heading font-medium text-foreground">
                Change Password
              </h3>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              iconName={showPasswordForm ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-background p-4 rounded-lg border border-border">
              <Input
                label="Current Password"
                type="password"
                value={passwordData?.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e?.target?.value })}
                error={passwordErrors?.currentPassword}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={passwordData?.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e?.target?.value })}
                error={passwordErrors?.newPassword}
                description="Must be at least 8 characters long"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData?.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e?.target?.value })}
                error={passwordErrors?.confirmPassword}
                required
              />
              
              {passwordErrors?.submit && (
                <div className="text-sm text-error bg-error/10 p-3 rounded-lg">
                  {passwordErrors?.submit}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  variant="default"
                  loading={isChangingPassword}
                  iconName="Lock"
                  iconPosition="left"
                >
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordErrors({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Data Export Section */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-medium text-foreground">
                Export Your Data
              </h3>
              <p className="text-sm text-muted-foreground">
                Download a copy of your saved recipes and preferences
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDataExport}
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
            >
              Export Data
            </Button>
          </div>
        </div>

        {/* Account Deletion Section */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-medium text-error">
                Delete Account
              </h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Account
            </Button>
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-3 mb-4">
                <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
                <div>
                  <h4 className="text-sm font-medium text-error mb-2">
                    Are you absolutely sure?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers, including:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    <li>• All saved recipes and favorites</li>
                    <li>• Your dietary preferences and settings</li>
                    <li>• Cooking history and statistics</li>
                    <li>• Profile information and achievements</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  onClick={handleAccountDelete}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Yes, Delete My Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;