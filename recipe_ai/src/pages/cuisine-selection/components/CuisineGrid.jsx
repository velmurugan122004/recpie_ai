import React from 'react';
import CuisineCard from './CuisineCard';
import Icon from '../../../components/AppIcon';


const CuisineGrid = ({ cuisines, selectedCuisines, onCuisineSelect, searchTerm }) => {
  const filteredCuisines = cuisines?.filter(cuisine =>
    cuisine?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    cuisine?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    cuisine?.popularDishes?.some(dish => 
      dish?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
  );

  if (filteredCuisines?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No cuisines found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or browse all available cuisines.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredCuisines?.map((cuisine) => (
        <CuisineCard
          key={cuisine?.id}
          cuisine={cuisine}
          isSelected={selectedCuisines?.includes(cuisine?.id)}
          onSelect={onCuisineSelect}
        />
      ))}
    </div>
  );
};

export default CuisineGrid;