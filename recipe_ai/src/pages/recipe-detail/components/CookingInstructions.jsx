import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CookingInstructions = ({ instructions }) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeTimer, setActiveTimer] = useState(null);
  const steps = Array.isArray(instructions) ? instructions : [];
  const total = steps.length;

  const handleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted?.has(stepIndex)) {
      newCompleted?.delete(stepIndex);
    } else {
      newCompleted?.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const startTimer = (stepIndex, duration) => {
    setActiveTimer({ stepIndex, duration, startTime: Date.now() });
    // In a real app, you would implement actual timer functionality
  };

  const getStepIcon = (type) => {
    const iconMap = {
      'prep': 'ChefHat',
      'cook': 'Flame',
      'mix': 'Shuffle',
      'wait': 'Clock',
      'serve': 'Utensils'
    };
    return iconMap?.[type] || 'Circle';
  };

  const getStepColor = (type) => {
    const colorMap = {
      'prep': 'text-primary bg-primary/10',
      'cook': 'text-accent bg-accent/10',
      'mix': 'text-secondary bg-secondary/10',
      'wait': 'text-warning bg-warning/10',
      'serve': 'text-success bg-success/10'
    };
    return colorMap?.[type] || 'text-muted-foreground bg-muted';
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Instructions</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground font-body">
            {completedSteps?.size} of {total} completed
          </span>
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${total > 0 ? (completedSteps?.size / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = completedSteps?.has(index);
          const stepNumber = index + 1;
          const isString = typeof step === 'string';
          const text = isString ? step : (step?.instruction || '');

          return (
            <div
              key={index}
              className={`relative flex space-x-4 p-4 rounded-lg transition-all duration-200 ${
                isCompleted ? 'bg-muted/50' : 'hover:bg-muted/30'
              }`}
            >
              {/* Step Number and Checkbox */}
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCompleted ? 'bg-success text-white' : 'bg-primary text-white'
                }`}>
                  {isCompleted ? <Icon name="Check" size={16} /> : stepNumber}
                </div>
                <Checkbox
                  checked={isCompleted}
                  onChange={() => handleStepComplete(index)}
                />
              </div>
              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {!isString && step?.type && (
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${getStepColor(step?.type)}`}>
                        <Icon name={getStepIcon(step?.type)} size={14} />
                      </div>
                    )}
                    {!isString && step?.duration && (
                      <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded font-body">
                        {step?.duration}
                      </span>
                    )}
                  </div>
                  
                  {!isString && step?.duration && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => startTimer(index, step?.duration)}
                      iconName="Timer"
                      className="text-muted-foreground hover:text-foreground"
                    />
                  )}
                </div>

                <p className={`font-body leading-relaxed ${
                  isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}>
                  {text}
                </p>

                {!isString && step?.tips && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <div className="flex items-start space-x-2">
                      <Icon name="Lightbulb" size={16} color="var(--color-primary)" className="mt-0.5" />
                      <p className="text-sm text-primary font-body">
                        <span className="font-medium">Tip:</span> {step?.tips}
                      </p>
                    </div>
                  </div>
                )}

                {!isString && step?.warning && (
                  <div className="mt-3 p-3 bg-warning/5 rounded-lg border-l-4 border-warning">
                    <div className="flex items-start space-x-2">
                      <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5" />
                      <p className="text-sm text-warning font-body">
                        <span className="font-medium">Warning:</span> {step?.warning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {total === 0 && (
          <div className="text-sm text-muted-foreground">No instructions provided.</div>
        )}
      </div>
      {/* Cooking Mode Toggle */}
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="default"
          fullWidth
          iconName="Play"
          iconPosition="left"
          className="bg-primary hover:bg-primary/90"
        >
          Start Cooking Mode
        </Button>
      </div>
    </div>
  );
};

export default CookingInstructions;