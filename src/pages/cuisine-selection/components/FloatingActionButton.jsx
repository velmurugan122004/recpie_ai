import React from 'react';
import Button from '../../../components/ui/Button';

const FloatingActionButton = ({ selectedCount, onGenerateRecipes, isDisabled }) => {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-40 lg:left-1/2 lg:right-auto lg:transform lg:-translate-x-1/2">
      <div className="max-w-sm mx-auto">
        <Button
          onClick={onGenerateRecipes}
          disabled={isDisabled}
          fullWidth
          size="lg"
          iconName="ChefHat"
          iconPosition="left"
          className="shadow-warm-lg backdrop-blur-sm"
        >
          Generate Recipes
          {selectedCount > 0 && (
            <span className="ml-2 bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
              {selectedCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FloatingActionButton;