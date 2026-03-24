import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ onSearch, searchQuery }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(localQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localQuery, onSearch]);

  const handleClear = () => {
    setLocalQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <Icon name="Search" size={20} />
        </div>
        <Input
          type="search"
          placeholder="Search your saved recipes..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e?.target?.value)}
          className="pl-10 pr-10 h-12 bg-background border-border focus:border-primary"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
      {/* Search Suggestions */}
      {localQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-warm-md z-10 max-h-48 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Icon name="Clock" size={14} />
              <span>Recent searches</span>
            </div>
            <div className="space-y-1">
              {['pasta', 'chicken curry', 'chocolate cake']?.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setLocalQuery(suggestion);
                    onSearch(suggestion);
                  }}
                  className="w-full text-left px-2 py-1 text-sm text-foreground hover:bg-muted rounded transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;