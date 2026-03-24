import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import ThemeToggle from '../theme/ThemeToggle';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'chat_ai',
      path: '/chat_ai',
      icon: 'Search',
      tooltip: 'Find recipes with AI'
    },
    {
      label: 'Discover',
      path: '/discover',
      icon: 'Compass',
      tooltip: 'Browse cuisines and picks'
    },
    {
      label: 'My Recipes',
      path: '/saved-recipes',
      icon: 'BookOpen',
      tooltip: 'Your saved recipes'
    },
    {
      label: 'Profile',
      path: '/user-profile',
      icon: 'User',
      tooltip: 'Account settings'
    }
  ];

  const getPageTitle = () => {
    const pathTitles = {
      '/chat_ai': 'Discover Recipes',
      '/discover': 'Discover',
      '/cuisine-selection': 'Choose Cuisine',
      '/recipe-results': 'Recipe Results',
      '/recipe-detail': 'Recipe Details',
      '/saved-recipes': 'My Recipes',
      '/user-profile': 'Profile'
    };
    return pathTitles?.[location?.pathname] || 'Recipe AI';
  };

  const showBackButton = () => {
    const backButtonPaths = ['/cuisine-selection', '/recipe-results', '/recipe-detail'];
    return backButtonPaths?.includes(location?.pathname);
  };

  const handleBack = () => {
    const backNavigation = {
      '/cuisine-selection': '/chat_ai',
      '/recipe-results': '/cuisine-selection',
      '/recipe-detail': '/recipe-results'
    };
    const backPath = backNavigation?.[location?.pathname];
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const isActiveTab = (path) => {
    if (path === '/chat_ai') {
      return ['/chat_ai', '/cuisine-selection', '/recipe-results', '/recipe-detail']?.includes(location?.pathname);
    }
    return location?.pathname === path;
  };

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="ChefHat" size={20} color="white" />
      </div>
      <span className="text-xl font-heading font-bold text-foreground">Recipe AI</span>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-4">
            {showBackButton() && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="lg:hidden"
                iconName="ArrowLeft"
              />
            )}
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {showBackButton() && (
              <Button
                variant="ghost"
                onClick={handleBack}
                iconName="ArrowLeft"
                iconPosition="left"
                className="mr-4"
              >
                Back
              </Button>
            )}
            
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActiveTab(item?.path) ? "default" : "ghost"}
                onClick={() => navigate(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                className="px-4 py-2"
                title={item?.tooltip}
              >
                {item?.label}
              </Button>
            ))}
            {/* Theme toggle for desktop */}
            <div className="pl-3 ml-3 border-l border-border">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-foreground hover:bg-accent/10"
              aria-label="Toggle menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {showBackButton() && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  className="w-full justify-start mb-2"
                >
                  Back
                </Button>
              )}
              
              {navigationItems?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isActiveTab(item?.path) ? "default" : "ghost"}
                  onClick={() => {
                    navigate(item?.path);
                    setIsMobileMenuOpen(false);
                  }}
                  iconName={item?.icon}
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  {item?.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Page Title for Mobile */}
        <div className="lg:hidden mt-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-heading font-bold text-foreground">
              {getPageTitle()}
            </h1>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;