import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FloatingActions = ({ onRefineSearch, onShare }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRefineSearch = () => {
    navigate('/chat_ai');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Recipe AI - Discover Amazing Recipes',
          text: 'Check out these amazing recipe suggestions I found!',
          url: window.location?.href
        });
      } catch (error) {
        // Fallback to custom share
        onShare();
      }
    } else {
      onShare();
    }
  };

  const actions = [
    {
      id: 'refine',
      label: 'Refine Search',
      icon: 'Search',
      onClick: handleRefineSearch,
      variant: 'default'
    },
    {
      id: 'share',
      label: 'Share Results',
      icon: 'Share2',
      onClick: handleShare,
      variant: 'outline'
    }
  ];

  return (
    <>
      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-4 z-40 lg:hidden">
        <div className="flex flex-col items-end space-y-3">
          {/* Action Buttons */}
          {isExpanded && (
            <div className="flex flex-col space-y-2 animate-in slide-in-from-bottom-2 duration-200">
              {actions?.map((action) => (
                <Button
                  key={action?.id}
                  variant={action?.variant}
                  size="sm"
                  onClick={action?.onClick}
                  iconName={action?.icon}
                  iconPosition="left"
                  className="shadow-warm-lg"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          )}

          {/* Main FAB */}
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 rounded-full shadow-warm-lg"
          >
            <Icon 
              name={isExpanded ? "X" : "MoreHorizontal"} 
              size={20} 
              color="white"
            />
          </Button>
        </div>
      </div>
      {/* Desktop Action Bar */}
      <div className="hidden lg:block fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-background border border-border rounded-full shadow-warm-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            {actions?.map((action, index) => (
              <React.Fragment key={action?.id}>
                <Button
                  variant={action?.variant}
                  size="sm"
                  onClick={action?.onClick}
                  iconName={action?.icon}
                  iconPosition="left"
                >
                  {action?.label}
                </Button>
                {index < actions?.length - 1 && (
                  <div className="w-px h-6 bg-border" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {/* Backdrop for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default FloatingActions;