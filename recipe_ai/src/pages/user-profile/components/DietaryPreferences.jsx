import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const DietaryPreferences = ({ preferences, onUpdatePreferences }) => {
  const dietaryOptions = [
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      description: 'No meat, poultry, or fish',
      icon: 'Leaf'
    },
    {
      id: 'vegan',
      label: 'Vegan',
      description: 'No animal products including dairy and eggs',
      icon: 'Sprout'
    },
    {
      id: 'glutenFree',
      label: 'Gluten-Free',
      description: 'No wheat, barley, rye, or gluten-containing ingredients',
      icon: 'Wheat'
    },
    {
      id: 'dairyFree',
      label: 'Dairy-Free',
      description: 'No milk, cheese, butter, or dairy products',
      icon: 'Milk'
    },
    {
      id: 'nutFree',
      label: 'Nut-Free',
      description: 'No tree nuts or peanuts',
      icon: 'Nut'
    },
    {
      id: 'lowSodium',
      label: 'Low Sodium',
      description: 'Reduced salt content for heart health',
      icon: 'Heart'
    },
    {
      id: 'keto',
      label: 'Ketogenic',
      description: 'High fat, very low carb diet',
      icon: 'Zap'
    },
    {
      id: 'paleo',
      label: 'Paleo',
      description: 'Whole foods, no processed ingredients',
      icon: 'Mountain'
    }
  ];

  const handlePreferenceChange = (preferenceId, checked) => {
    const updatedPreferences = {
      ...preferences,
      [preferenceId]: checked
    };
    onUpdatePreferences(updatedPreferences);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Utensils" size={20} color="var(--color-primary)" />
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Dietary Preferences
        </h2>
      </div>
      <p className="text-muted-foreground mb-6">
        Select your dietary restrictions to get personalized recipe recommendations
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dietaryOptions?.map((option) => (
          <div key={option?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
              <Icon name={option?.icon} size={16} color="var(--color-primary)" />
            </div>
            <div className="flex-1">
              <Checkbox
                label={option?.label}
                description={option?.description}
                checked={preferences?.[option?.id] || false}
                onChange={(e) => handlePreferenceChange(option?.id, e?.target?.checked)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietaryPreferences;