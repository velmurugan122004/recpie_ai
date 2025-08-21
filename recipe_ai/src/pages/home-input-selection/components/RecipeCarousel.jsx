import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecipeCarousel = ({ recipes, onRecipeClick }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef?.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef?.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef?.current) {
      const scrollAmount = 280;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef?.current?.scrollLeft - scrollAmount
        : scrollContainerRef?.current?.scrollLeft + scrollAmount;
      
      scrollContainerRef?.current?.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    const handleScroll = () => checkScrollButtons();
    
    if (scrollContainerRef?.current) {
      scrollContainerRef?.current?.addEventListener('scroll', handleScroll);
      return () => {
        if (scrollContainerRef?.current) {
          scrollContainerRef?.current?.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
          Popular Recipes
        </h2>
        <div className="hidden sm:flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            iconName="ChevronLeft"
            className="w-8 h-8"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            iconName="ChevronRight"
            className="w-8 h-8"
          />
        </div>
      </div>
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recipes?.map((recipe) => (
          <div
            key={recipe?.id}
            className="flex-shrink-0 w-64 sm:w-72 bg-card rounded-xl shadow-warm hover:shadow-warm-md transition-all duration-300 cursor-pointer group"
            onClick={() => onRecipeClick(recipe)}
          >
            <div className="relative overflow-hidden rounded-t-xl h-40">
              <Image
                src={recipe?.image}
                alt={recipe?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <Icon name="Clock" size={14} className="text-primary" />
                <span className="text-xs font-body font-medium text-foreground">
                  {recipe?.cookTime}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-heading font-semibold text-base text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {recipe?.name}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm font-body text-muted-foreground">
                      {recipe?.rating}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={14} className="text-muted-foreground" />
                    <span className="text-sm font-body text-muted-foreground">
                      {recipe?.servings}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="TrendingUp" size={14} className="text-success" />
                  <span className="text-xs font-body text-success font-medium">
                    Popular
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeCarousel;