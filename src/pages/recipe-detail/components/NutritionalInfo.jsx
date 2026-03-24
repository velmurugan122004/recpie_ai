import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NutritionalInfo = ({ nutrition, servings }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculatePerServing = (value) => {
    return Math.round((value / servings) * 10) / 10;
  };

  const getNutrientColor = (nutrient, value) => {
    // Color coding based on daily value percentages (simplified)
    const dailyValues = {
      calories: 2000,
      protein: 50,
      carbs: 300,
      fat: 65,
      fiber: 25,
      sugar: 50,
      sodium: 2300
    };

    const percentage = (value / dailyValues?.[nutrient]) * 100;
    
    if (percentage < 5) return 'text-success';
    if (percentage < 20) return 'text-warning';
    return 'text-error';
  };

  const mainNutrients = [
    { key: 'calories', label: 'Calories', value: nutrition?.calories, unit: 'kcal' },
    { key: 'protein', label: 'Protein', value: nutrition?.protein, unit: 'g' },
    { key: 'carbs', label: 'Carbohydrates', value: nutrition?.carbs, unit: 'g' },
    { key: 'fat', label: 'Total Fat', value: nutrition?.fat, unit: 'g' }
  ];

  const detailedNutrients = [
    { key: 'saturatedFat', label: 'Saturated Fat', value: nutrition?.saturatedFat, unit: 'g' },
    { key: 'cholesterol', label: 'Cholesterol', value: nutrition?.cholesterol, unit: 'mg' },
    { key: 'sodium', label: 'Sodium', value: nutrition?.sodium, unit: 'mg' },
    { key: 'fiber', label: 'Dietary Fiber', value: nutrition?.fiber, unit: 'g' },
    { key: 'sugar', label: 'Total Sugars', value: nutrition?.sugar, unit: 'g' },
    { key: 'vitaminC', label: 'Vitamin C', value: nutrition?.vitaminC, unit: 'mg' },
    { key: 'calcium', label: 'Calcium', value: nutrition?.calcium, unit: 'mg' },
    { key: 'iron', label: 'Iron', value: nutrition?.iron, unit: 'mg' }
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Nutrition Facts</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? 'Less' : 'More'}
        </Button>
      </div>
      <div className="text-sm text-muted-foreground font-body mb-4">
        Per serving ({servings} servings total)
      </div>
      {/* Main Nutrients */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mainNutrients?.map((nutrient) => (
          <div key={nutrient?.key} className="text-center p-4 bg-muted/30 rounded-lg">
            <div className={`text-2xl font-bold ${getNutrientColor(nutrient?.key, calculatePerServing(nutrient?.value))}`}>
              {calculatePerServing(nutrient?.value)}
            </div>
            <div className="text-xs text-muted-foreground font-body mt-1">
              {nutrient?.unit}
            </div>
            <div className="text-sm font-body font-medium text-foreground mt-1">
              {nutrient?.label}
            </div>
          </div>
        ))}
      </div>
      {/* Macronutrient Breakdown */}
      <div className="mb-6">
        <h3 className="text-sm font-body font-medium text-foreground mb-3">Macronutrient Breakdown</h3>
        <div className="space-y-2">
          {[
            { label: 'Protein', value: nutrition?.protein, color: 'bg-primary' },
            { label: 'Carbohydrates', value: nutrition?.carbs, color: 'bg-accent' },
            { label: 'Fat', value: nutrition?.fat, color: 'bg-secondary' }
          ]?.map((macro) => {
            const total = nutrition?.protein + nutrition?.carbs + nutrition?.fat;
            const percentage = Math.round((macro?.value / total) * 100);
            
            return (
              <div key={macro?.label} className="flex items-center space-x-3">
                <div className="w-16 text-xs font-body text-muted-foreground">
                  {macro?.label}
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${macro?.color} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-12 text-xs font-body text-foreground text-right">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Detailed Nutrients */}
      {isExpanded && (
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-sm font-body font-medium text-foreground mb-3">Detailed Nutrition</h3>
          {detailedNutrients?.map((nutrient) => (
            <div key={nutrient?.key} className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-foreground">{nutrient?.label}</span>
              <span className="text-sm font-body font-medium text-foreground">
                {calculatePerServing(nutrient?.value)} {nutrient?.unit}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Dietary Information */}
      {nutrition?.dietaryInfo && (
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-sm font-body font-medium text-foreground mb-3">Dietary Information</h3>
          <div className="flex flex-wrap gap-2">
            {nutrition?.dietaryInfo?.map((info, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-success/10 text-success text-xs font-body rounded-full flex items-center space-x-1"
              >
                <Icon name="Check" size={12} />
                <span>{info}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Data Source */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground font-body">
          Nutritional data calculated using USDA Food Database. Values are approximate and may vary based on specific ingredients and preparation methods.
        </p>
      </div>
    </div>
  );
};

export default NutritionalInfo;