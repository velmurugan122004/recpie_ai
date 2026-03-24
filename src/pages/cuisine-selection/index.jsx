import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LoadingNavigation from '../../components/ui/LoadingNavigation';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';

import SelectedCuisineChip from './components/SelectedCuisineChip';
import DietaryFilterChip from './components/DietaryFilterChip';
import CuisineGrid from './components/CuisineGrid';
import FloatingActionButton from './components/FloatingActionButton';

const CuisineSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for cuisines
  const cuisines = [
    {
      id: 'indian',
      name: 'Indian',
      description: 'Rich spices, aromatic curries, and diverse regional flavors from the Indian subcontinent.',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      popularDishes: ['Butter Chicken', 'Biryani', 'Masala Dosa', 'Tandoori']
    },
    {
      id: 'italian',
      name: 'Italian',
      description: 'Classic pasta, pizza, and Mediterranean ingredients with fresh herbs and olive oil.',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      popularDishes: ['Pasta Carbonara', 'Margherita Pizza', 'Risotto', 'Tiramisu']
    },
    {
      id: 'chinese',
      name: 'Chinese',
      description: 'Balanced flavors with stir-fries, dumplings, and traditional cooking techniques.',
      image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg',
      popularDishes: ['Kung Pao Chicken', 'Fried Rice', 'Dumplings', 'Sweet & Sour']
    },
    {
      id: 'mediterranean',
      name: 'Mediterranean',
      description: 'Fresh vegetables, olive oil, seafood, and herbs from the Mediterranean region.',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      popularDishes: ['Greek Salad', 'Hummus', 'Grilled Fish', 'Falafel']
    },
    {
      id: 'mexican',
      name: 'Mexican',
      description: 'Vibrant spices, fresh salsas, and traditional ingredients like corn and beans.',
      image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
      popularDishes: ['Tacos', 'Guacamole', 'Enchiladas', 'Quesadillas']
    },
    {
      id: 'thai',
      name: 'Thai',
      description: 'Perfect balance of sweet, sour, salty, and spicy flavors with fresh herbs.',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      popularDishes: ['Pad Thai', 'Green Curry', 'Tom Yum', 'Mango Sticky Rice']
    },
    {
      id: 'french',
      name: 'French',
      description: 'Elegant techniques, rich sauces, and refined culinary artistry.',
      image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg',
      popularDishes: ['Coq au Vin', 'Ratatouille', 'Croissants', 'Bouillabaisse']
    },
    {
      id: 'american',
      name: 'American',
      description: 'Comfort food classics, BBQ, and diverse regional specialties.',
      image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg',
      popularDishes: ['Burgers', 'BBQ Ribs', 'Mac & Cheese', 'Apple Pie']
    }
  ];

  // Mock dietary filters
  const dietaryFilters = [
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
    { id: 'vegan', label: 'Vegan', icon: 'Sprout' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: 'Wheat' },
    { id: 'dairy-free', label: 'Dairy-Free', icon: 'Milk' },
    { id: 'low-carb', label: 'Low-Carb', icon: 'TrendingDown' },
    { id: 'keto', label: 'Keto', icon: 'Zap' }
  ];

  // Get input data from previous screen
  const inputData = location?.state?.inputData || null;
  const inputType = location?.state?.inputType || 'text';

  useEffect(() => {
    // Redirect if no input data
    if (!inputData) {
      navigate('/chat_ai');
    }
  }, [inputData, navigate]);

  const handleCuisineSelect = (cuisineId) => {
    setSelectedCuisines(prev => {
      if (prev?.includes(cuisineId)) {
        return prev?.filter(id => id !== cuisineId);
      } else {
        return [...prev, cuisineId];
      }
    });
  };

  const handleCuisineRemove = (cuisineId) => {
    setSelectedCuisines(prev => prev?.filter(id => id !== cuisineId));
  };

  const handleFilterToggle = (filterId) => {
    setSelectedFilters(prev => {
      if (prev?.includes(filterId)) {
        return prev?.filter(id => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleGenerateRecipes = async () => {
    if (selectedCuisines?.length === 0) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare user input based on input type
      let userInput = '';
      
      switch (inputType) {
        case 'voice':
          userInput = inputData || '';
          break;
        case 'photo': case'screenshot':
          userInput = inputData?.analysis || `Image uploaded: ${inputData?.fileName}`;
          break;
        case 'text':
          userInput = inputData || '';
          break;
        default:
          userInput = inputData || '';
      }

      const selectedCuisineData = cuisines?.filter(c => selectedCuisines?.includes(c?.id));
      const selectedFilterData = dietaryFilters?.filter(f => selectedFilters?.includes(f?.id));

      // Generate recipes using OpenAI and navigate to results page
      const { generateRecipeRecommendations } = await import('../../utils/openai');
      
      const recipes = await generateRecipeRecommendations({
        userInput: userInput || '',
        selectedCuisines: selectedCuisineData,
        dietaryFilters: selectedFilterData,
        inputType: inputType
      });

      // Navigate to recipe results page with generated recipes
      navigate('/recipe-results', {
        state: {
          recipes: recipes || [],
          inputData: {
            type: inputType,
            content: userInput,
            originalData: inputData
          },
          selectedCuisines: selectedCuisineData,
          selectedFilters: selectedFilterData
        }
      });
    } catch (error) {
      console.error('Error preparing context:', error);
      setError('Failed to proceed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedCuisineData = () => {
    return cuisines?.filter(cuisine => selectedCuisines?.includes(cuisine?.id));
  };

  if (!inputData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LoadingNavigation 
        isLoading={isLoading}
        loadingText="Generating personalized recipes with AI..."
        progress={null}
      />
      <main className="pt-28 lg:pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-3">
              Choose Your Cuisine Style
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select one or more cuisines to personalize your AI-generated recipe recommendations.
            </p>
          </div>

          {/* Input Summary */}
          {inputData && (
            <div className="bg-card rounded-xl p-4 mb-6 border border-border">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon 
                    name={inputType === 'text' ? 'Type' : inputType === 'voice' ? 'Mic' : 'Image'} 
                    size={20} 
                    color="var(--color-primary)" 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-1">Your Input</h3>
                  <p className="text-sm text-muted-foreground">
                    {inputType === 'text' && inputData}
                    {inputType === 'voice' && `Voice input: "${inputData}"`}
                    {(inputType === 'photo' || inputType === 'screenshot') && (
                      <span>
                        Image: {inputData?.fileName || 'Uploaded image'} 
                        {inputData?.analysis && (
                          <span className="block mt-1 text-foreground">
                            AI Analysis: {inputData?.analysis}
                          </span>
                        )}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={20} className="text-error" />
                <p className="text-sm font-body text-error">{error}</p>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Input
                type="search"
                placeholder="Search cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Icon name="Search" size={18} />
              </div>
            </div>
          </div>

          {/* Dietary Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
              Dietary Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {dietaryFilters?.map((filter) => (
                <DietaryFilterChip
                  key={filter?.id}
                  filter={filter}
                  isActive={selectedFilters?.includes(filter?.id)}
                  onToggle={handleFilterToggle}
                />
              ))}
            </div>
          </div>

          {/* Selected Cuisines */}
          {selectedCuisines?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
                Selected Cuisines ({selectedCuisines?.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {getSelectedCuisineData()?.map((cuisine) => (
                  <SelectedCuisineChip
                    key={cuisine?.id}
                    cuisine={cuisine}
                    onRemove={handleCuisineRemove}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cuisine Grid */}
          <div className="mb-8">
            <CuisineGrid
              cuisines={cuisines}
              selectedCuisines={selectedCuisines}
              onCuisineSelect={handleCuisineSelect}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </main>
      {/* Floating Action Button */}
      <FloatingActionButton
        selectedCount={selectedCuisines?.length}
        onGenerateRecipes={handleGenerateRecipes}
        isDisabled={selectedCuisines?.length === 0 || isLoading}
      />
    </div>
  );
};

export default CuisineSelection;
