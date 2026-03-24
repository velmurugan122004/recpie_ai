import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RecipeCard from './components/RecipeCard';
import SearchBar from './components/SearchBar';
import FilterChips from './components/FilterChips';
import SortDropdown from './components/SortDropdown';
import EmptyState from './components/EmptyState';
import BulkActions from './components/BulkActions';
import ShareDialog from './components/ShareDialog';
import { listSavedRecipes, removeSavedByTitle } from '../../utils/saved';

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recentlySaved');
  const [activeFilters, setActiveFilters] = useState({
    cuisine: 'All',
    dietary: 'All',
    prepTime: 'All',
    difficulty: 'All'
  });
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shareDialog, setShareDialog] = useState({ isOpen: false, recipe: null });
  const [showMealPlanDialog, setShowMealPlanDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock saved recipes data (used only as visual fallback when nothing is saved yet)
  const mockSavedRecipes = [
    {
      id: 1,
      title: "Butter Chicken with Basmati Rice",
      cuisine: "Indian",
      image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
      prepTime: 45,
      servings: 4,
      difficulty: "Medium",
      rating: 4.8,
      lastViewed: "2025-01-17T10:30:00Z",
      savedDate: "2025-01-15T14:20:00Z",
      viewCount: 12,
      dietary: ["Gluten-Free"],
      ingredients: ["chicken", "butter", "tomatoes", "cream", "spices"]
    },
    {
      id: 2,
      title: "Classic Margherita Pizza",
      cuisine: "Italian",
      image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
      prepTime: 30,
      servings: 2,
      difficulty: "Easy",
      rating: 4.6,
      lastViewed: "2025-01-16T18:45:00Z",
      savedDate: "2025-01-14T09:15:00Z",
      viewCount: 8,
      dietary: ["Vegetarian"],
      ingredients: ["flour", "tomatoes", "mozzarella", "basil", "olive oil"]
    },
    {
      id: 3,
      title: "Kung Pao Chicken",
      cuisine: "Chinese",
      image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg",
      prepTime: 25,
      servings: 3,
      difficulty: "Medium",
      rating: 4.7,
      lastViewed: "2025-01-15T12:20:00Z",
      savedDate: "2025-01-13T16:30:00Z",
      viewCount: 15,
      dietary: ["Dairy-Free"],
      ingredients: ["chicken", "peanuts", "vegetables", "soy sauce", "chili"]
    },
    {
      id: 4,
      title: "Mediterranean Quinoa Bowl",
      cuisine: "Mediterranean",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      prepTime: 20,
      servings: 2,
      difficulty: "Easy",
      rating: 4.5,
      lastViewed: "2025-01-14T14:10:00Z",
      savedDate: "2025-01-12T11:45:00Z",
      viewCount: 6,
      dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
      ingredients: ["quinoa", "chickpeas", "cucumber", "tomatoes", "olives"]
    },
    {
      id: 5,
      title: "Chocolate Lava Cake",
      cuisine: "French",
      image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
      prepTime: 35,
      servings: 4,
      difficulty: "Hard",
      rating: 4.9,
      lastViewed: "2025-01-13T20:30:00Z",
      savedDate: "2025-01-11T15:20:00Z",
      viewCount: 20,
      dietary: ["Vegetarian"],
      ingredients: ["chocolate", "butter", "eggs", "flour", "sugar"]
    },
    {
      id: 6,
      title: "Thai Green Curry",
      cuisine: "Thai",
      image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg",
      prepTime: 40,
      servings: 4,
      difficulty: "Medium",
      rating: 4.6,
      lastViewed: "2025-01-12T19:15:00Z",
      savedDate: "2025-01-10T13:30:00Z",
      viewCount: 9,
      dietary: ["Dairy-Free"],
      ingredients: ["coconut milk", "green curry paste", "chicken", "vegetables", "basil"]
    }
  ];

  const [savedRecipes, setSavedRecipes] = useState([]);

  // Load saved recipes from localStorage
  useEffect(() => {
    const load = () => {
      try {
        const list = listSavedRecipes();
        setSavedRecipes(Array.isArray(list) ? list : []);
      } catch (e) {
        setSavedRecipes([]);
      }
    };
    load();
    // Listen to storage changes from other tabs
    const onStorage = (e) => { if (e.key === 'saved_recipes') load(); };
    // Listen to same-tab updates via custom event
    const onCustom = () => load();
    const onFocus = () => load();
    window.addEventListener('storage', onStorage);
    window.addEventListener('saved_recipes_updated', onCustom);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('saved_recipes_updated', onCustom);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    const baseList = (savedRecipes && savedRecipes.length > 0) ? savedRecipes : mockSavedRecipes;
    let filtered = baseList?.filter(recipe => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery?.toLowerCase();
        const matchesSearch = 
          recipe?.title?.toLowerCase()?.includes(searchLower) ||
          recipe?.cuisine?.toLowerCase()?.includes(searchLower) ||
          recipe?.ingredients?.some(ingredient => ingredient?.toLowerCase()?.includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Cuisine filter
      if (activeFilters?.cuisine !== 'All' && recipe?.cuisine !== activeFilters?.cuisine) {
        return false;
      }

      // Dietary filter
      if (activeFilters?.dietary !== 'All') {
        if (!recipe?.dietary?.includes(activeFilters?.dietary)) {
          return false;
        }
      }

      // Prep time filter
      if (activeFilters?.prepTime !== 'All') {
        const prepTime = recipe?.prepTime;
        switch (activeFilters?.prepTime) {
          case 'Under 15 min':
            if (prepTime >= 15) return false;
            break;
          case '15-30 min':
            if (prepTime < 15 || prepTime > 30) return false;
            break;
          case '30-60 min':
            if (prepTime < 30 || prepTime > 60) return false;
            break;
          case 'Over 1 hour':
            if (prepTime <= 60) return false;
            break;
        }
      }

      // Difficulty filter
      if (activeFilters?.difficulty !== 'All' && recipe?.difficulty !== activeFilters?.difficulty) {
        return false;
      }

      return true;
    });

    // Sort recipes
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a?.title?.localeCompare(b?.title);
        case 'recentlySaved':
          return new Date(b.savedDate) - new Date(a.savedDate);
        case 'mostViewed':
          return b?.viewCount - a?.viewCount;
        case 'prepTime':
          return a?.prepTime - b?.prepTime;
        case 'rating':
          return b?.rating - a?.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, activeFilters, sortBy, savedRecipes]);

  // Handle pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle filter change
  const handleFilterChange = (categoryId, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Handle recipe actions
  const handleRemoveRecipe = (recipeIdOrTitle) => {
    // RecipeCard may pass id; our storage uses title as key. Try both.
    const recipe = (savedRecipes || []).find(r => r.id === recipeIdOrTitle || r.title === recipeIdOrTitle);
    const title = recipe?.title || recipeIdOrTitle;
    const changed = removeSavedByTitle(title);
    if (changed) {
      const list = listSavedRecipes();
      setSavedRecipes(Array.isArray(list) ? list : []);
    }
  };

  const handleShareRecipe = (recipe) => {
    setShareDialog({ isOpen: true, recipe });
  };

  const handleAddToMealPlan = (recipe) => {
    console.log('Adding to meal plan:', recipe?.title);
    setShowMealPlanDialog(true);
    setTimeout(() => setShowMealPlanDialog(false), 2000);
  };

  // Handle bulk actions
  const handleBulkModeToggle = () => {
    setIsBulkMode(!isBulkMode);
    setSelectedRecipes([]);
  };

  const handleRecipeSelect = (recipeId) => {
    setSelectedRecipes(prev => 
      prev?.includes(recipeId) 
        ? prev?.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRecipes(filteredAndSortedRecipes?.map(recipe => recipe?.id));
  };

  const handleDeselectAll = () => {
    setSelectedRecipes([]);
  };

  const handleBulkRemove = () => {
    console.log('Bulk removing recipes:', selectedRecipes);
    setSelectedRecipes([]);
    setIsBulkMode(false);
  };

  const handleBulkAddToMealPlan = () => {
    console.log('Bulk adding to meal plan:', selectedRecipes);
    setShowMealPlanDialog(true);
    setTimeout(() => {
      setShowMealPlanDialog(false);
      setSelectedRecipes([]);
      setIsBulkMode(false);
    }, 2000);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 lg:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                My Saved Recipes
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredAndSortedRecipes?.length} recipe{filteredAndSortedRecipes?.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            
            {filteredAndSortedRecipes?.length > 0 && (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  iconName={isRefreshing ? "Loader2" : "RefreshCw"}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                <Button
                  variant={isBulkMode ? "default" : "outline"}
                  onClick={handleBulkModeToggle}
                  iconName="CheckSquare"
                  iconPosition="left"
                >
                  {isBulkMode ? 'Cancel' : 'Select'}
                </Button>
              </div>
            )}
          </div>

          {/* Bulk Actions Bar */}
          {isBulkMode && (
            <div className="mb-6">
              <BulkActions
                selectedRecipes={selectedRecipes}
                totalRecipes={filteredAndSortedRecipes?.length}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onBulkRemove={handleBulkRemove}
                onBulkAddToMealPlan={handleBulkAddToMealPlan}
                onExitBulkMode={handleBulkModeToggle}
              />
            </div>
          )}

          {/* Search and Filters */}
          {!isBulkMode && (
            <div className="space-y-6 mb-8">
              {/* Search Bar */}
              <SearchBar
                onSearch={handleSearch}
                searchQuery={searchQuery}
              />

              {/* Filters and Sort */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <FilterChips
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
                <div className="lg:w-64">
                  <SortDropdown
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recipe Grid */}
          {filteredAndSortedRecipes?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedRecipes?.map((recipe) => (
                <RecipeCard
                  key={recipe?.id}
                  recipe={recipe}
                  onRemove={handleRemoveRecipe}
                  onShare={handleShareRecipe}
                  onAddToMealPlan={handleAddToMealPlan}
                  isSelected={selectedRecipes?.includes(recipe?.id)}
                  onSelect={isBulkMode ? handleRecipeSelect : null}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              hasSearchQuery={!!searchQuery}
              searchQuery={searchQuery}
              onClearSearch={handleClearSearch}
            />
          )}
        </div>
      </main>
      {/* Share Dialog */}
      <ShareDialog
        recipe={shareDialog?.recipe}
        isOpen={shareDialog?.isOpen}
        onClose={() => setShareDialog({ isOpen: false, recipe: null })}
      />
      {/* Meal Plan Success Toast */}
      {showMealPlanDialog && (
        <div className="fixed bottom-4 right-4 bg-success text-success-foreground px-6 py-3 rounded-lg shadow-warm-lg z-50 flex items-center space-x-2">
          <Icon name="Check" size={20} />
          <span className="font-medium">Added to meal plan!</span>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;