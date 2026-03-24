import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const IngredientsList = ({ ingredients, servings, originalServings = 4 }) => {
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [isMetric, setIsMetric] = useState(true);

  const handleIngredientCheck = (index) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked?.has(index)) {
      newChecked?.delete(index);
    } else {
      newChecked?.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const adjustQuantity = (quantity, unit) => {
    if (quantity == null || Number.isNaN(Number(quantity))) return null;
    const multiplier = servings / originalServings;
    const adjustedQuantity = quantity * multiplier;
    
    // Round to reasonable precision
    if (adjustedQuantity < 1) {
      return (Math.round(adjustedQuantity * 8) / 8)?.toString();
    } else if (adjustedQuantity < 10) {
      return (Math.round(adjustedQuantity * 4) / 4)?.toString();
    } else {
      return Math.round(adjustedQuantity)?.toString();
    }
  };

  const convertMeasurement = (quantity, unit) => {
    if (quantity == null) return { quantity: null, unit: null };
    if (!isMetric) return { quantity, unit };
    
    const conversions = {
      'cups': { factor: 240, unit: 'ml' },
      'cup': { factor: 240, unit: 'ml' },
      'tbsp': { factor: 15, unit: 'ml' },
      'tsp': { factor: 5, unit: 'ml' },
      'oz': { factor: 28.35, unit: 'g' },
      'lb': { factor: 453.6, unit: 'g' },
      'lbs': { factor: 453.6, unit: 'g' }
    };

    const conversion = conversions?.[unit?.toLowerCase()];
    if (conversion) {
      const convertedQuantity = parseFloat(quantity) * conversion?.factor;
      return {
        quantity: convertedQuantity >= 1000 && conversion?.unit === 'ml' 
          ? (convertedQuantity / 1000)?.toFixed(1) 
          : Math.round(convertedQuantity)?.toString(),
        unit: convertedQuantity >= 1000 && conversion?.unit === 'ml' ? 'L' : conversion?.unit
      };
    }
    
    return { quantity, unit };
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Ingredients</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMetric(!isMetric)}
          iconName="RotateCcw"
          iconPosition="left"
        >
          {isMetric ? 'Metric' : 'Imperial'}
        </Button>
      </div>
      <div className="space-y-4">
        {ingredients?.map((ingredient, index) => {
          const isString = typeof ingredient === 'string';
          const name = isString ? ingredient : (ingredient?.name || '')
          const rawQty = isString ? null : parseFloat(ingredient?.quantity);
          const adjustedQuantity = adjustQuantity(rawQty, ingredient?.unit);
          const converted = convertMeasurement(adjustedQuantity, ingredient?.unit);
          const isChecked = checkedIngredients?.has(index);

          return (
            <div
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isChecked ? 'bg-muted/50' : 'hover:bg-muted/30'
              }`}
            >
              <Checkbox
                checked={isChecked}
                onChange={() => handleIngredientCheck(index)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-body ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {name}
                  </span>
                  {!isString && ingredient?.substitutes && (
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Info"
                      className="text-muted-foreground hover:text-foreground"
                      title={`Substitutes: ${ingredient?.substitutes?.join(', ')}`}
                    />
                  )}
                </div>

                {!isString && adjustedQuantity != null && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-sm font-body ${isChecked ? 'line-through text-muted-foreground' : 'text-primary font-medium'}`}>
                      {converted?.quantity} {converted?.unit}
                    </span>
                    {ingredient?.notes && (
                      <span className="text-xs text-muted-foreground font-body">
                        ({ingredient?.notes})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Shopping List Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-body">
            {checkedIngredients?.size} of {ingredients?.length} ingredients checked
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCheckedIngredients(new Set())}
              iconName="RotateCcw"
            >
              Clear
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="ShoppingCart"
              iconPosition="left"
            >
              Add to List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsList;