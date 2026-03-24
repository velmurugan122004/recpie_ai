import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from './components/BreadcrumbNavigation';
import FilterChips from './components/FilterChips';
import RecipeList from './components/RecipeList';
import FloatingActions from './components/FloatingActions';
import ShareModal from './components/ShareModal';
import LoadingNavigation from '../../components/ui/LoadingNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';


const RecipeResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  // Get data from navigation state
  const stateData = location?.state || {};
  const inputData = stateData?.inputData || {};
  const selectedCuisines = stateData?.selectedCuisines || [];
  const selectedFilters = stateData?.selectedFilters || [];
  const generatedRecipes = stateData?.recipes || [];

  // Use AI-generated recipes instead of mock data
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // If no recipes data, redirect back to home
    if (!generatedRecipes?.length && !inputData?.type) {
      navigate('/chat_ai');
      return;
    }

    // Set initial loading and then load recipes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setRecipes(generatedRecipes);
      setIsLoading(false);
      setError(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [generatedRecipes, inputData, navigate]);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleLoadMore = () => {
    // For now, disable load more since we're generating a fixed set of recipes
    // In a real app, you might generate more recipes or paginate through results
    setHasMore(false);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleRefineSearch = () => {
    // Go back to cuisine selection with existing data
    navigate('/cuisine-selection', {
      state: {
        inputType: inputData?.type,
        inputData: inputData?.originalData || inputData?.content
      }
    });
  };

  // Generate search summary for breadcrumb
  const getSearchSummary = () => {
    if (inputData?.type === 'voice') {
      return inputData?.content?.slice(0, 50) + (inputData?.content?.length > 50 ? '...' : '');
    } else if (inputData?.type === 'photo' || inputData?.type === 'screenshot') {
      return `Image: ${inputData?.originalData?.fileName || 'Uploaded image'}`;
    } else {
      return inputData?.content?.slice(0, 50) + (inputData?.content?.length > 50 ? '...' : '') || 'Recipe search';
    }
  };

  const getCuisineSummary = () => {
    return selectedCuisines?.map(c => c?.name)?.join(', ') || 'Multiple cuisines';
  };

  // Show error state if no recipes
  if (!isLoading && !recipes?.length && !error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Search" size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              No Recipes Found
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We couldn't generate recipes based on your input. Please try again with different criteria.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/chat_ai')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Start Over
              </Button>
              <Button
                variant="default"
                onClick={handleRefineSearch}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Try Different Cuisines
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LoadingNavigation 
        isLoading={isLoading}
        loadingText="Loading your personalized recipes..."
        progress={null}
      />
      <main className="pt-16 lg:pt-16">
        <BreadcrumbNavigation 
          searchQuery={getSearchSummary()}
          selectedCuisine={getCuisineSummary()}
        />
        
        <FilterChips 
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          totalResults={recipes?.length}
        />

        {/* AI Generation Notice */}
        {!isLoading && recipes?.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Sparkles" size={20} className="text-primary" />
                <p className="text-sm font-body text-primary">
                  <strong>AI-Generated Recipes:</strong> These personalized recipes were created based on your input using artificial intelligence.
                </p>
              </div>
            </div>
          </div>
        )}

        <RecipeList 
          recipes={recipes}
          activeFilters={activeFilters}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />

        <FloatingActions 
          onRefineSearch={handleRefineSearch}
          onShare={handleShare}
        />

        <ShareModal 
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          recipes={recipes}
        />
      </main>
    </div>
  );
};

export default RecipeResults;