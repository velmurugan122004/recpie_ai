import React from 'react';
import Button from '../../../components/ui/Button';

const FilterChips = ({ activeFilters, onFilterChange, totalResults }) => {
  const filterOptions = [
    { id: 'prep-time', label: 'Quick (< 30 min)', value: 'quick' },
    { id: 'difficulty', label: 'Easy', value: 'easy' },
    { id: 'vegetarian', label: 'Vegetarian', value: 'vegetarian' },
    { id: 'healthy', label: 'Healthy', value: 'healthy' },
    { id: 'one-pot', label: 'One Pot', value: 'one-pot' }
  ];

  const handleFilterToggle = (filterValue) => {
    const newFilters = activeFilters?.includes(filterValue)
      ? activeFilters?.filter(f => f !== filterValue)
      : [...activeFilters, filterValue];
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-background border-b border-border px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          {totalResults} Recipe{totalResults !== 1 ? 's' : ''} Found
        </h2>
        {activeFilters?.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange([])}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {filterOptions?.map((filter) => (
          <Button
            key={filter?.id}
            variant={activeFilters?.includes(filter?.value) ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterToggle(filter?.value)}
            className="text-xs"
          >
            {filter?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;