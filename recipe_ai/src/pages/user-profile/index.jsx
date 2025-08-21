import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ProfileHeader from './components/ProfileHeader';
import DietaryPreferences from './components/DietaryPreferences';
import CuisinePreferences from './components/CuisinePreferences';
import AppSettings from './components/AppSettings';
import RecipeStatistics from './components/RecipeStatistics';
import AccountManagement from './components/AccountManagement';

const UserProfile = () => {
  const [user, setUser] = useState({
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    joinDate: "March 2024"
  });

  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    lowSodium: true,
    keto: false,
    paleo: false
  });

  const [cuisinePreferences, setCuisinePreferences] = useState({
    italian: true,
    indian: true,
    chinese: false,
    mexican: true,
    japanese: false,
    mediterranean: true,
    thai: false,
    french: false,
    american: false,
    korean: false
  });

  const [appSettings, setAppSettings] = useState({
    measurementUnit: 'metric',
    difficultyLevel: 'intermediate',
    defaultServingSize: '4',
    notifications: {
      newRecipes: true,
      cookingReminders: true,
      weeklyMealSuggestions: false,
      nutritionTips: true
    }
  });

  const [recipeStats, setRecipeStats] = useState({
    totalSaved: 43,
    totalCooked: 28,
    cookingStreak: 5,
    favoriteCuisine: 'Italian'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    // Simulate loading user data from localStorage or API
    const savedUserData = localStorage.getItem('userProfile');
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData);
        setUser(userData?.user || user);
        setDietaryPreferences(userData?.dietaryPreferences || dietaryPreferences);
        setCuisinePreferences(userData?.cuisinePreferences || cuisinePreferences);
        setAppSettings(userData?.appSettings || appSettings);
        setRecipeStats(userData?.recipeStats || recipeStats);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Save user data to localStorage whenever state changes
  useEffect(() => {
    const userData = {
      user,
      dietaryPreferences,
      cuisinePreferences,
      appSettings,
      recipeStats
    };
    localStorage.setItem('userProfile', JSON.stringify(userData));
  }, [user, dietaryPreferences, cuisinePreferences, appSettings, recipeStats]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateProfile = async (updatedData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ ...user, ...updatedData });
      showNotification('Profile updated successfully!');
    } catch (error) {
      showNotification('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDietaryPreferences = async (preferences) => {
    setDietaryPreferences(preferences);
    showNotification('Dietary preferences updated!');
  };

  const handleUpdateCuisinePreferences = async (preferences) => {
    setCuisinePreferences(preferences);
    showNotification('Cuisine preferences updated!');
  };

  const handleUpdateAppSettings = async (settings) => {
    setAppSettings(settings);
    showNotification('Settings updated!');
  };

  const handlePasswordChange = async (passwordData) => {
    // Simulate password change API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock validation - in real app, this would be handled by backend
    if (passwordData?.currentPassword !== 'currentpass123') {
      throw new Error('Current password is incorrect');
    }
    
    showNotification('Password changed successfully!');
  };

  const handleDataExport = async () => {
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const exportData = {
      user,
      dietaryPreferences,
      cuisinePreferences,
      appSettings,
      recipeStats,
      exportDate: new Date()?.toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `recipe-ai-data-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!');
  };

  const handleAccountDelete = async () => {
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Clear all data
    localStorage.removeItem('userProfile');
    localStorage.removeItem('savedRecipes');
    localStorage.removeItem('cookingHistory');
    
    showNotification('Account deleted successfully. Redirecting...', 'success');
    
    // In a real app, this would redirect to a goodbye page or login
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 lg:pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Notification */}
          {notification && (
            <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-warm-lg transition-all duration-300 ${
              notification?.type === 'error' ?'bg-error text-error-foreground' :'bg-success text-success-foreground'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{notification?.message}</span>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg shadow-warm-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                  <span className="text-foreground">Updating profile...</span>
                </div>
              </div>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account, preferences, and cooking statistics
            </p>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            <ProfileHeader 
              user={user} 
              onUpdateProfile={handleUpdateProfile} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <DietaryPreferences 
                  preferences={dietaryPreferences}
                  onUpdatePreferences={handleUpdateDietaryPreferences}
                />
                
                <AppSettings 
                  settings={appSettings}
                  onUpdateSettings={handleUpdateAppSettings}
                />
              </div>
              
              <div className="space-y-6">
                <CuisinePreferences 
                  preferences={cuisinePreferences}
                  onUpdatePreferences={handleUpdateCuisinePreferences}
                />
                
                <RecipeStatistics stats={recipeStats} />
              </div>
            </div>
            
            <AccountManagement 
              onPasswordChange={handlePasswordChange}
              onDataExport={handleDataExport}
              onAccountDelete={handleAccountDelete}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;