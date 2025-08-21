import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  selectedRecipes, 
  onSelectAll, 
  onDeselectAll, 
  onBulkRemove, 
  onBulkAddToMealPlan,
  onExitBulkMode,
  totalRecipes 
}) => {
  const selectedCount = selectedRecipes?.length;
  const allSelected = selectedCount === totalRecipes && totalRecipes > 0;

  return (
    <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-warm-md">
      <div className="flex items-center justify-between">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onExitBulkMode}
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
          >
            <Icon name="X" size={20} />
          </button>
          <div>
            <p className="font-medium">
              {selectedCount} of {totalRecipes} selected
            </p>
            <div className="flex items-center space-x-4 mt-1">
              <button
                onClick={allSelected ? onDeselectAll : onSelectAll}
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
              >
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onBulkAddToMealPlan}
              iconName="Calendar"
              iconPosition="left"
              className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/20"
            >
              Add to Meal Plan
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkRemove}
              iconName="Trash2"
              iconPosition="left"
              className="bg-error/20 hover:bg-error/30 text-primary-foreground border-error/20"
            >
              Remove ({selectedCount})
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-primary-foreground/20 rounded-full h-1">
          <div 
            className="bg-primary-foreground h-1 rounded-full transition-all duration-300"
            style={{ width: `${(selectedCount / totalRecipes) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BulkActions;