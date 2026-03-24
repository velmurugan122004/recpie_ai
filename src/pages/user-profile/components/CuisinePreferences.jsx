import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const CuisinePreferences = ({ preferences, onUpdatePreferences }) => {
  const cuisineOptions = [
    {
      id: 'italian',
      label: 'Italian',
      description: 'Pasta, pizza, risotto, and Mediterranean flavors',
      flag: '🇮🇹'
    },
    {
      id: 'indian',
      label: 'Indian',
      description: 'Spicy curries, rice dishes, and aromatic spices',
      flag: '🇮🇳'
    },
    {
      id: 'chinese',
      label: 'Chinese',
      description: 'Stir-fries, dumplings, and traditional Asian flavors',
      flag: '🇨🇳'
    },
    {
      id: 'mexican',
      label: 'Mexican',
      description: 'Tacos, burritos, and vibrant Latin American cuisine',
      flag: '🇲🇽'
    },
    {
      id: 'japanese',
      label: 'Japanese',
      description: 'Sushi, ramen, and delicate Japanese preparations',
      flag: '🇯🇵'
    },
    {
      id: 'mediterranean',
      label: 'Mediterranean',
      description: 'Healthy oils, fresh vegetables, and coastal flavors',
      flag: '🌊'
    },
    {
      id: 'thai',
      label: 'Thai',
      description: 'Sweet, sour, and spicy Southeast Asian dishes',
      flag: '🇹🇭'
    },
    {
      id: 'french',
      label: 'French',
      description: 'Classic techniques and refined European cuisine',
      flag: '🇫🇷'
    },
    {
      id: 'american',
      label: 'American',
      description: 'Comfort food, BBQ, and classic American dishes',
      flag: '🇺🇸'
    },
    {
      id: 'korean',
      label: 'Korean',
      description: 'Fermented foods, BBQ, and bold Korean flavors',
      flag: '🇰🇷'
    }
  ];

  const handlePreferenceChange = (cuisineId, checked) => {
    const updatedPreferences = {
      ...preferences,
      [cuisineId]: checked
    };
    onUpdatePreferences(updatedPreferences);
  };

  const selectedCount = Object.values(preferences)?.filter(Boolean)?.length;

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Globe" size={20} color="var(--color-primary)" />
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Favorite Cuisines
          </h2>
        </div>
        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {selectedCount} selected
        </span>
      </div>
      <p className="text-muted-foreground mb-6">
        Choose your favorite cuisines to get more relevant recipe suggestions
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cuisineOptions?.map((cuisine) => (
          <div key={cuisine?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mt-1">
              <span className="text-xl">{cuisine?.flag}</span>
            </div>
            <div className="flex-1">
              <Checkbox
                label={cuisine?.label}
                description={cuisine?.description}
                checked={preferences?.[cuisine?.id] || false}
                onChange={(e) => handlePreferenceChange(cuisine?.id, e?.target?.checked)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuisinePreferences;