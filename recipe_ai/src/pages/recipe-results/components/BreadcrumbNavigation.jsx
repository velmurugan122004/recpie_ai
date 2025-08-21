import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BreadcrumbNavigation = ({ searchQuery, selectedCuisine }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbs = [
    {
      label: 'chat_ai',
      path: '/chat_ai',
      icon: 'Home'
    },
    {
      label: selectedCuisine || 'Cuisine Selection',
      path: '/cuisine-selection',
      icon: 'Globe'
    },
    {
      label: 'Recipe Results',
      path: '/recipe-results',
      icon: 'ChefHat',
      current: true
    }
  ];

  const handleBreadcrumbClick = (path) => {
    if (path !== location?.pathname) {
      navigate(path);
    }
  };

  return (
    <div className="bg-muted border-b border-border px-4 py-3">
      {/* Search Context */}
      <div className="mb-3">
        <h1 className="text-xl font-heading font-bold text-foreground mb-1">
          Recipe Results
        </h1>
        {searchQuery && (
          <p className="text-sm text-muted-foreground">
            Showing results for: <span className="font-medium text-foreground">"{searchQuery}"</span>
            {selectedCuisine && (
              <span> in <span className="font-medium text-foreground">{selectedCuisine}</span> cuisine</span>
            )}
          </p>
        )}
      </div>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm">
        {breadcrumbs?.map((crumb, index) => (
          <React.Fragment key={crumb?.path}>
            {index > 0 && (
              <Icon name="ChevronRight" size={14} color="var(--color-muted-foreground)" />
            )}
            
            {crumb?.current ? (
              <div className="flex items-center space-x-1 text-primary font-medium">
                <Icon name={crumb?.icon} size={14} color="var(--color-primary)" />
                <span>{crumb?.label}</span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBreadcrumbClick(crumb?.path)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground p-1 h-auto"
              >
                <Icon name={crumb?.icon} size={14} />
                <span>{crumb?.label}</span>
              </Button>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default BreadcrumbNavigation;