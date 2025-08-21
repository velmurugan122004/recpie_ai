import React from 'react';
import Icon from '../AppIcon';

const LoadingNavigation = ({ 
  isLoading = false, 
  loadingText = "Processing...", 
  progress = null,
  showBackButton = true,
  onBack = null 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Loading Content */}
          <div className="flex items-center space-x-3">
            <div className="animate-spin">
              <Icon name="ChefHat" size={20} color="var(--color-primary)" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-body font-medium text-foreground">
                {loadingText}
              </span>
              {progress !== null && (
                <div className="w-32 h-1 bg-muted rounded-full mt-1">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Back Button */}
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-3 py-1 text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200"
              disabled={isLoading}
            >
              <Icon name="ArrowLeft" size={16} />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingNavigation;