import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import RecipeDetail from './pages/recipe-detail';
import RecipeResults from './pages/recipe-results';
import SavedRecipes from './pages/saved-recipes';
import CuisineSelection from './pages/cuisine-selection';
import UserProfile from './pages/user-profile';
import HomeInputSelection from './pages/home-input-selection';
import Discover from './pages/discover';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<HomeInputSelection />} />
        <Route path="/recipe-detail" element={<RecipeDetail />} />
        <Route path="/recipe-results" element={<RecipeResults />} />
        <Route path="/saved-recipes" element={<SavedRecipes />} />
        <Route path="/cuisine-selection" element={<CuisineSelection />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/chat_ai" element={<HomeInputSelection />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
