import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InputMethodCard = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  variant = "default",
  disabled = false,
  meta
}) => {
  return (
    <div className="w-full">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        className="w-full h-32 sm:h-36 lg:h-40 p-6 border-2 border-border hover:border-primary hover:shadow-warm-md transition-all duration-300 group"
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
            <Icon 
              name={icon} 
              size={24} 
              className="text-primary group-hover:text-primary transition-colors duration-300" 
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="font-body text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
              {description}
            </p>
            {meta && (
              <p className="font-body text-[10px] sm:text-xs text-muted-foreground">
                {meta}
              </p>
            )}
          </div>
        </div>
      </Button>
    </div>
  );
};

export default InputMethodCard;