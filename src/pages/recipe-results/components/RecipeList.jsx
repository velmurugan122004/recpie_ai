import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import Icon from '../../../components/AppIcon';

const RecipeList = ({ recipes, activeFilters, onLoadMore, hasMore, isLoading }) => {
  const [favorites, setFavorites] = useState(new Set());
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  useEffect(() => {
    // Filter recipes based on active filters
    let filtered = recipes;

    if (activeFilters?.length > 0) {
      filtered = recipes?.filter(recipe => {
        return activeFilters?.some(filter => {
          switch (filter) {
            case 'quick':
              return parseInt(recipe?.prepTime) <= 30;
            case 'easy':
              return recipe?.difficulty?.toLowerCase() === 'easy';
            case 'vegetarian':
              return recipe?.tags?.some(tag => tag?.toLowerCase()?.includes('vegetarian'));
            case 'healthy':
              return recipe?.tags?.some(tag => tag?.toLowerCase()?.includes('healthy'));
            case 'one-pot':
              return recipe?.tags?.some(tag => tag?.toLowerCase()?.includes('one pot'));
            default:
              return true;
          }
        });
      });
    }

    setFilteredRecipes(filtered);
  }, [recipes, activeFilters]);

  const handleFavorite = (recipeId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites?.has(recipeId)) {
      newFavorites?.delete(recipeId);
    } else {
      newFavorites?.add(recipeId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify([...newFavorites]));
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement?.scrollTop
      >= document.documentElement?.offsetHeight - 1000
    ) {
      if (hasMore && !isLoading) {
        onLoadMore();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);

  if (filteredRecipes?.length === 0 && activeFilters?.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="Search" size={24} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No recipes found
        </h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Try adjusting your filters or search with different criteria to find more recipes.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredRecipes?.map((recipe) => (
          <RecipeCard
            key={recipe?.id}
            recipe={recipe}
            onFavorite={handleFavorite}
            isFavorited={favorites?.has(recipe?.id)}
          />
        ))}
      </div>
      {/* Loading More Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin mr-3">
            <Icon name="ChefHat" size={20} color="var(--color-primary)" />
          </div>
          <span className="text-muted-foreground">Loading more recipes...</span>
        </div>
      )}
      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Load More Recipes
          </button>
        </div>
      )}
      {/* End of Results */}
      {!hasMore && filteredRecipes?.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You've seen all available recipes. Try a new search for more options!
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;