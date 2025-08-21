import React from 'react';
import Icon from '../../../components/AppIcon';

const DietaryFilterChip = ({ filter, isActive, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(filter?.id)}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-body transition-all duration-200 ${
        isActive
          ? 'bg-accent text-white shadow-warm'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
    >
      <Icon name={filter?.icon} size={14} />
      <span>{filter?.label}</span>
    </button>
  );
};

export default DietaryFilterChip;