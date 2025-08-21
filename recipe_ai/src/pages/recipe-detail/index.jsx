import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LoadingNavigation from '../../components/ui/LoadingNavigation';
import RecipeHero from './components/RecipeHero';
import RecipeOverview from './components/RecipeOverview';
import IngredientsList from './components/IngredientsList';
import CookingInstructions from './components/CookingInstructions';
import NutritionalInfo from './components/NutritionalInfo';
import FloatingActionBar from './components/FloatingActionBar';
import openai, { generateDetailedRecipe } from '../../utils/openai';
import { saveRecipe, isSaved } from '../../utils/saved';
import Icon from '../../components/AppIcon';


const RecipeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(4);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get recipe data from navigation state
  const recipe = location?.state?.recipe;
  const fromPopular = location?.state?.fromPopular;

  useEffect(() => {
    if (!recipe) {
      navigate('/chat_ai');
      return;
    }

    // Always try to fetch detailed ingredients & procedure from OpenAI when configured
    const generateDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (openai) {
          const details = await generateDetailedRecipe(recipe);
          setRecipeDetails({
            ...recipe,
            ...details,
          });
        } else {
          // No API key configured; use provided data as-is
          setRecipeDetails(recipe);
        }
      } catch (error) {
        console.error('Error generating recipe details:', error);
        setError('Failed to load recipe details. Using basic recipe instead.');
        setRecipeDetails(recipe);
      } finally {
        setIsLoading(false);
      }
    };

    generateDetails();
  }, [recipe, navigate]);

  // Initialize favorite state when details or base recipe available
  useEffect(() => {
    const current = recipeDetails || recipe;
    if (current) {
      setIsFavorite(isSaved(current));
    }
  }, [recipeDetails, recipe]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.title || 'Recipe',
        text: recipe?.description || 'Check out this recipe!',
        url: window.location.href,
      });
    }
  };

  const handleServingsChange = (newServings) => {
    setServings(newServings);
  };

  const handleSave = () => {
    const current = recipeDetails || recipe;
    const ok = saveRecipe(current);
    if (ok) {
      setIsFavorite(true);
      // Navigate to Saved Recipes so user sees it immediately
      navigate('/saved-recipes');
    }
  };

  const handleStartCooking = () => {
    // Navigate to cooking mode or timer
    console.log('Starting cooking mode for:', recipe);
  };

  if (!recipe) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LoadingNavigation 
        isLoading={isLoading}
        loadingText="Loading detailed recipe information..."
        progress={null}
      />
      
      <main className="pt-16">
        <RecipeHero 
          recipe={recipeDetails || recipe} 
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
        />
        <RecipeOverview 
          recipe={recipeDetails || recipe} 
          servings={servings}
          onServingsChange={handleServingsChange}
        />
        
        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={20} className="text-error" />
                <p className="text-sm font-body text-error">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <IngredientsList 
                recipe={recipeDetails || recipe} 
                ingredients={recipeDetails?.ingredients || recipe?.ingredients || []}
                servings={servings}
              />
              <CookingInstructions 
                recipe={recipeDetails || recipe} 
                instructions={recipeDetails?.instructions || recipe?.instructions || []}
              />
            </div>
            <div className="space-y-8">
              <NutritionalInfo 
                recipe={recipeDetails || recipe} 
                nutrition={recipeDetails?.nutrition || recipe?.nutrition || {}}
                servings={servings}
              />
            </div>
          </div>
        </div>
        
        <FloatingActionBar 
          recipe={recipeDetails || recipe} 
          onSave={handleSave}
          onStartCooking={handleStartCooking}
          onShare={handleShare}
        />
      </main>
    </div>
  );
};

export default RecipeDetail;