import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecipeCard = ({ recipe, onFavorite, isFavorited }) => {
  const navigate = useNavigate();
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleCardClick = () => {
    navigate('/recipe-detail', { state: { recipe } });
  };

  const handleFavoriteClick = (e) => {
    e?.stopPropagation();
    onFavorite(recipe?.id);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg shadow-warm hover:shadow-warm-md transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Mobile Layout */}
      <div className="flex lg:hidden">
        {/* Image Section */}
        <div className="relative w-32 h-32 flex-shrink-0">
          {isImageLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse rounded-l-lg" />
          )}
          <Image
            src={recipe?.image}
            alt={recipe?.title}
            className="w-full h-full object-cover rounded-l-lg"
            onLoad={() => setIsImageLoading(false)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Icon 
              name={isFavorited ? "Heart" : "Heart"} 
              size={16} 
              color={isFavorited ? "var(--color-error)" : "var(--color-muted-foreground)"} 
              className={isFavorited ? "fill-current" : ""}
            />
          </Button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          <h3 className="font-heading font-semibold text-foreground text-sm line-clamp-2 mb-2">
            {recipe?.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {recipe?.description}
          </p>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} color="var(--color-muted-foreground)" />
                <span className="text-muted-foreground">{recipe?.prepTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={12} color="var(--color-muted-foreground)" />
                <span className="text-muted-foreground">{recipe?.servings}</span>
              </div>
            </div>
            <span className={`font-medium ${getDifficultyColor(recipe?.difficulty)}`}>
              {recipe?.difficulty}
            </span>
          </div>
        </div>
      </div>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Image Section */}
        <div className="relative h-48">
          {isImageLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse rounded-t-lg" />
          )}
          <Image
            src={recipe?.image}
            alt={recipe?.title}
            className="w-full h-full object-cover rounded-t-lg"
            onLoad={() => setIsImageLoading(false)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Icon 
              name={isFavorited ? "Heart" : "Heart"} 
              size={18} 
              color={isFavorited ? "var(--color-error)" : "var(--color-muted-foreground)"} 
              className={isFavorited ? "fill-current" : ""}
            />
          </Button>
          
          {/* Recipe Tags */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {recipe?.tags?.slice(0, 2)?.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="font-heading font-semibold text-foreground text-lg line-clamp-2 mb-2">
            {recipe?.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {recipe?.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} color="var(--color-muted-foreground)" />
                <span className="text-sm text-muted-foreground">{recipe?.prepTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} color="var(--color-muted-foreground)" />
                <span className="text-sm text-muted-foreground">{recipe?.servings} servings</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} color="var(--color-warning)" className="fill-current" />
                <span className="text-sm text-muted-foreground">{recipe?.rating}</span>
              </div>
            </div>
            <span className={`text-sm font-medium ${getDifficultyColor(recipe?.difficulty)}`}>
              {recipe?.difficulty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;