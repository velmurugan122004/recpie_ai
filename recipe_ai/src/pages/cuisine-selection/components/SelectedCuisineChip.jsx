import React from 'react';
import Icon from '../../../components/AppIcon';

const SelectedCuisineChip = ({ cuisine, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-2 text-sm font-body">
      <span className="text-primary font-medium">{cuisine?.name}</span>
      <button
        onClick={() => onRemove(cuisine?.id)}
        className="text-primary hover:text-primary/70 transition-colors duration-200"
        aria-label={`Remove ${cuisine?.name}`}
      >
        <Icon name="X" size={14} />
      </button>
    </div>
  );
};

export default SelectedCuisineChip;