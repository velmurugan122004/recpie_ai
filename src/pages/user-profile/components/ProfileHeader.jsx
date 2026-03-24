import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileHeader = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name,
    email: user?.email
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name,
      email: user?.email
    });
    setIsEditing(false);
  };

  const handlePhotoUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const newPhotoUrl = URL.createObjectURL(file);
        onUpdateProfile({ ...editData, avatar: newPhotoUrl });
        setIsUploading(false);
      }, 1500);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm mb-6">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Profile Photo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {user?.avatar ? (
              <Image
                src={user?.avatar}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="User" size={32} color="var(--color-muted-foreground)" />
            )}
          </div>
          
          {/* Upload Button */}
          <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-warm">
            <Icon name="Camera" size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="animate-spin">
                <Icon name="Loader2" size={20} color="white" />
              </div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={editData?.name}
                onChange={(e) => setEditData({ ...editData, name: e?.target?.value })}
                placeholder="Enter your name"
              />
              <Input
                label="Email Address"
                type="email"
                value={editData?.email}
                onChange={(e) => setEditData({ ...editData, email: e?.target?.value })}
                placeholder="Enter your email"
              />
              <div className="flex space-x-2 justify-center sm:justify-start">
                <Button variant="default" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                {user?.name}
              </h1>
              <p className="text-muted-foreground mb-2">{user?.email}</p>
              <p className="text-sm text-muted-foreground mb-4">
                Member since {user?.joinDate}
              </p>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;