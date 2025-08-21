import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecipeCard = ({ recipe, onRemove, onShare, onAddToMealPlan, isSelected, onSelect }) => {
  const navigate = useNavigate();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const handleCardClick = () => {
    navigate('/recipe-detail', { state: { recipe } });
  };

  const handleRemoveConfirm = () => {
    onRemove(recipe?.id);
    setShowRemoveDialog(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date?.toLocaleDateString();
  };

  return (
    <>
      <div className="bg-card rounded-xl shadow-warm border border-border overflow-hidden hover:shadow-warm-md transition-all duration-200 group">
        {/* Selection Checkbox */}
        {onSelect && (
          <div className="absolute top-3 left-3 z-10">
            <button
              onClick={(e) => {
                e?.stopPropagation();
                onSelect(recipe?.id);
              }}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isSelected 
                  ? 'bg-primary border-primary' :'bg-white border-gray-300 hover:border-primary'
              }`}
            >
              {isSelected && <Icon name="Check" size={14} color="white" />}
            </button>
          </div>
        )}

        {/* Recipe Image */}
        <div className="relative h-48 overflow-hidden cursor-pointer" onClick={handleCardClick}>
          <Image
            src={recipe?.image}
            alt={recipe?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Recipe Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 
              className="font-heading font-semibold text-foreground text-lg leading-tight cursor-pointer hover:text-primary transition-colors duration-200 line-clamp-2"
              onClick={handleCardClick}
            >
              {recipe?.title}
            </h3>
          </div>

          {/* Recipe Meta */}
          <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Globe" size={14} />
              <span>{recipe?.cuisine}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{recipe?.prepTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{recipe?.servings}</span>
            </div>
          </div>

          {/* Difficulty & Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                recipe?.difficulty === 'Easy' ?'bg-success/10 text-success' 
                  : recipe?.difficulty === 'Medium' ?'bg-warning/10 text-warning' :'bg-error/10 text-error'
              }`}>
                {recipe?.difficulty}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} color="var(--color-warning)" />
              <span className="text-sm font-medium text-foreground">{recipe?.rating}</span>
            </div>
          </div>

          {/* Last Viewed */}
          <p className="text-xs text-muted-foreground mb-4">
            Last viewed {formatDate(recipe?.lastViewed)}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onShare(recipe);
                }}
                iconName="Share2"
                className="text-muted-foreground hover:text-primary"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onAddToMealPlan(recipe);
                }}
                iconName="Calendar"
                className="text-muted-foreground hover:text-primary"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                setShowRemoveDialog(true);
              }}
              iconName="Heart"
              className="text-error hover:text-error/80"
            />
          </div>
        </div>
      </div>
      {/* Remove Confirmation Dialog */}
      {showRemoveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl p-6 max-w-sm w-full shadow-warm-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="Heart" size={20} color="var(--color-error)" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">Remove Recipe</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to remove "{recipe?.title}" from your saved recipes?
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRemoveDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemoveConfirm}
                className="flex-1"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeCard;