import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecipeOverview = ({ recipe, servings, onServingsChange }) => {
  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'hard':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getDifficultyIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'Smile';
      case 'medium':
        return 'Meh';
      case 'hard':
        return 'Frown';
      default:
        return 'HelpCircle';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Prep Time */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-body">Prep Time</p>
            <p className="text-sm font-body font-medium text-foreground">{recipe?.prepTime}</p>
          </div>
        </div>

        {/* Cook Time */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Flame" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-body">Cook Time</p>
            <p className="text-sm font-body font-medium text-foreground">{recipe?.cookTime}</p>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex items-center space-x-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDifficultyColor(recipe?.difficulty)}`}>
            <Icon name={getDifficultyIcon(recipe?.difficulty)} size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-body">Difficulty</p>
            <p className="text-sm font-body font-medium text-foreground">{recipe?.difficulty}</p>
          </div>
        </div>

        {/* Servings */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-body">Servings</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onServingsChange(Math.max(1, servings - 1))}
                iconName="Minus"
                className="w-6 h-6 p-0"
              />
              <span className="text-sm font-body font-medium text-foreground min-w-[20px] text-center">
                {servings}
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onServingsChange(servings + 1)}
                iconName="Plus"
                className="w-6 h-6 p-0"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Recipe Tags */}
      {recipe?.tags && recipe?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipe?.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-muted-foreground text-xs font-body rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeOverview;