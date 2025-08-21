import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AppSettings = ({ settings, onUpdateSettings }) => {
  const measurementOptions = [
    { value: 'metric', label: 'Metric (kg, liters, °C)' },
    { value: 'imperial', label: 'Imperial (lbs, cups, °F)' }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner - Simple recipes only' },
    { value: 'intermediate', label: 'Intermediate - Moderate complexity' },
    { value: 'advanced', label: 'Advanced - All difficulty levels' }
  ];

  const servingSizeOptions = [
    { value: '1', label: '1 person' },
    { value: '2', label: '2 people' },
    { value: '4', label: '4 people (family)' },
    { value: '6', label: '6+ people (large family)' }
  ];

  const handleSettingChange = (key, value) => {
    onUpdateSettings({
      ...settings,
      [key]: value
    });
  };

  const notificationSettings = [
    {
      id: 'newRecipes',
      label: 'New Recipe Recommendations',
      description: 'Get notified when we find recipes matching your preferences'
    },
    {
      id: 'cookingReminders',
      label: 'Cooking Reminders',
      description: 'Reminders for meal prep and cooking times'
    },
    {
      id: 'weeklyMealSuggestions',
      label: 'Weekly Meal Planning',
      description: 'Receive weekly meal plan suggestions'
    },
    {
      id: 'nutritionTips',
      label: 'Nutrition Tips',
      description: 'Educational content about healthy eating'
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm mb-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Settings" size={20} color="var(--color-primary)" />
        <h2 className="text-xl font-heading font-semibold text-foreground">
          App Settings
        </h2>
      </div>
      <div className="space-y-8">
        {/* Measurement Units */}
        <div>
          <h3 className="text-lg font-heading font-medium text-foreground mb-3">
            Measurement Units
          </h3>
          <Select
            label="Preferred measurement system"
            description="Choose how ingredients and temperatures are displayed"
            options={measurementOptions}
            value={settings?.measurementUnit || 'metric'}
            onChange={(value) => handleSettingChange('measurementUnit', value)}
          />
        </div>

        {/* Difficulty Level */}
        <div>
          <h3 className="text-lg font-heading font-medium text-foreground mb-3">
            Recipe Difficulty
          </h3>
          <Select
            label="Comfort level"
            description="Filter recipes based on your cooking experience"
            options={difficultyOptions}
            value={settings?.difficultyLevel || 'intermediate'}
            onChange={(value) => handleSettingChange('difficultyLevel', value)}
          />
        </div>

        {/* Default Serving Size */}
        <div>
          <h3 className="text-lg font-heading font-medium text-foreground mb-3">
            Household Size
          </h3>
          <Select
            label="Default serving size"
            description="Recipes will be scaled to this serving size by default"
            options={servingSizeOptions}
            value={settings?.defaultServingSize || '4'}
            onChange={(value) => handleSettingChange('defaultServingSize', value)}
          />
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="text-lg font-heading font-medium text-foreground mb-4">
            Notifications
          </h3>
          <div className="space-y-4">
            {notificationSettings?.map((notification) => (
              <div key={notification?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <Icon name="Bell" size={16} color="var(--color-primary)" />
                </div>
                <div className="flex-1">
                  <Checkbox
                    label={notification?.label}
                    description={notification?.description}
                    checked={settings?.notifications?.[notification?.id] || false}
                    onChange={(e) => handleSettingChange('notifications', {
                      ...settings?.notifications,
                      [notification?.id]: e?.target?.checked
                    })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;