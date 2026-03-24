import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SortDropdown = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'alphabetical', label: 'Alphabetical (A-Z)', icon: 'ArrowUpAZ' },
    { value: 'recentlySaved', label: 'Recently Saved', icon: 'Clock' },
    { value: 'mostViewed', label: 'Most Viewed', icon: 'Eye' },
    { value: 'prepTime', label: 'Prep Time (Low to High)', icon: 'Timer' },
    { value: 'rating', label: 'Highest Rated', icon: 'Star' }
  ];

  const currentSort = sortOptions?.find(option => option?.value === sortBy) || sortOptions?.[0];

  const handleSortSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors duration-200 min-w-48"
      >
        <Icon name={currentSort?.icon} size={16} color="var(--color-muted-foreground)" />
        <span className="text-sm font-medium text-foreground flex-1 text-left">
          {currentSort?.label}
        </span>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          color="var(--color-muted-foreground)" 
        />
      </button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-warm-md z-20 overflow-hidden">
            {sortOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleSortSelect(option?.value)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-colors duration-200 ${
                  sortBy === option?.value ? 'bg-muted' : ''
                }`}
              >
                <Icon name={option?.icon} size={16} color="var(--color-muted-foreground)" />
                <span className="text-sm font-medium text-foreground">{option?.label}</span>
                {sortBy === option?.value && (
                  <Icon name="Check" size={16} color="var(--color-primary)" className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;