import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasSearchQuery, searchQuery, onClearSearch }) => {
  const navigate = useNavigate();

  if (hasSearchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          No recipes found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't find any saved recipes matching "{searchQuery}". Try adjusting your search terms or filters.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClearSearch}
            iconName="X"
            iconPosition="left"
          >
            Clear Search
          </Button>
          <Button
            variant="default"
            onClick={() => navigate('/chat_ai')}
            iconName="Plus"
            iconPosition="left"
          >
            Discover New Recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Icon name="BookOpen" size={32} color="var(--color-primary)" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
        No saved recipes yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Start building your personal recipe collection by saving recipes you love. Your saved recipes will appear here for easy access.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          onClick={() => navigate('/chat_ai')}
          iconName="Search"
          iconPosition="left"
        >
          Discover Recipes
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/user-profile')}
          iconName="User"
          iconPosition="left"
        >
          View Profile
        </Button>
      </div>
      
      {/* Quick Tips */}
      <div className="mt-12 max-w-md">
        <h4 className="text-sm font-medium text-foreground mb-4">Quick Tips:</h4>
        <div className="space-y-3 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="Heart" size={12} color="var(--color-success)" />
            </div>
            <p className="text-sm text-muted-foreground">
              Tap the heart icon on any recipe to save it to your collection
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="Search" size={12} color="var(--color-warning)" />
            </div>
            <p className="text-sm text-muted-foreground">
              Use our AI-powered search to find recipes based on ingredients or photos
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="Calendar" size={12} color="var(--color-accent)" />
            </div>
            <p className="text-sm text-muted-foreground">
              Add saved recipes to your meal planning for easy weekly organization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;