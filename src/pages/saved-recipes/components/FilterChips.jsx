import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ activeFilters, onFilterChange }) => {
  const filterCategories = [
    {
      id: 'cuisine',
      label: 'Cuisine',
      icon: 'Globe',
      options: ['All', 'Indian', 'Italian', 'Chinese', 'Mediterranean', 'Mexican', 'Thai', 'French']
    },
    {
      id: 'dietary',
      label: 'Dietary',
      icon: 'Leaf',
      options: ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb']
    },
    {
      id: 'prepTime',
      label: 'Prep Time',
      icon: 'Clock',
      options: ['All', 'Under 15 min', '15-30 min', '30-60 min', 'Over 1 hour']
    },
    {
      id: 'difficulty',
      label: 'Difficulty',
      icon: 'BarChart3',
      options: ['All', 'Easy', 'Medium', 'Hard']
    }
  ];

  const handleFilterClick = (categoryId, option) => {
    onFilterChange(categoryId, option);
  };

  const getActiveCount = () => {
    return Object.values(activeFilters)?.filter(filter => filter !== 'All')?.length;
  };

  const clearAllFilters = () => {
    const clearedFilters = {};
    filterCategories?.forEach(category => {
      clearedFilters[category.id] = 'All';
    });
    Object.keys(clearedFilters)?.forEach(key => {
      onFilterChange(key, 'All');
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={18} color="var(--color-muted-foreground)" />
          <span className="text-sm font-medium text-muted-foreground">Filters</span>
          {getActiveCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveCount()}
            </span>
          )}
        </div>
        {getActiveCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Clear all
          </button>
        )}
      </div>
      {/* Filter Categories */}
      <div className="space-y-3">
        {filterCategories?.map((category) => (
          <div key={category?.id}>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={category?.icon} size={14} color="var(--color-muted-foreground)" />
              <span className="text-sm font-medium text-foreground">{category?.label}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {category?.options?.map((option) => {
                const isActive = activeFilters?.[category?.id] === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleFilterClick(category?.id, option)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-warm'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;