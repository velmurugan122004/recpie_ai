import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const FloatingActionBar = ({ recipe, onSave, onStartCooking, onShare }) => {
  const [isSaved, setIsSaved] = useState(recipe?.isSaved || false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(recipe?.id, !isSaved);
  };

  const shareOptions = [
    { label: 'Copy Link', icon: 'Link', action: () => navigator.clipboard?.writeText(window.location?.href) },
    { label: 'WhatsApp', icon: 'MessageCircle', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(window.location?.href)}`) },
    { label: 'Facebook', icon: 'Facebook', action: () => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location?.href)}`) },
    { label: 'Twitter', icon: 'Twitter', action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location?.href)}&text=${encodeURIComponent(recipe?.title)}`) },
    { label: 'Email', icon: 'Mail', action: () => window.open(`mailto:?subject=${encodeURIComponent(recipe?.title)}&body=${encodeURIComponent(window.location?.href)}`) }
  ];

  return (
    <>
      {/* Desktop Floating Bar */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-40">
        <div className="bg-white rounded-full shadow-warm-lg border border-border p-2 flex items-center space-x-2">
          <Button
            variant={isSaved ? "default" : "ghost"}
            size="icon"
            onClick={handleSave}
            iconName={isSaved ? "Heart" : "Heart"}
            className={isSaved ? "text-white" : ""}
            title={isSaved ? "Remove from favorites" : "Add to favorites"}
          />
          
          <Button
            variant="default"
            onClick={onStartCooking}
            iconName="Play"
            iconPosition="left"
            className="bg-primary hover:bg-primary/90"
          >
            Start Cooking
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShareMenu(!showShareMenu)}
              iconName="Share2"
              title="Share recipe"
            />
            
            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-warm-lg border border-border p-2 min-w-[160px]">
                {shareOptions?.map((option, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      option?.action();
                      setShowShareMenu(false);
                    }}
                    iconName={option?.icon}
                    iconPosition="left"
                    className="w-full justify-start mb-1 last:mb-0"
                  >
                    {option?.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-warm-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between space-x-4">
            <Button
              variant={isSaved ? "default" : "outline"}
              onClick={handleSave}
              iconName={isSaved ? "Heart" : "Heart"}
              iconPosition="left"
              className="flex-1"
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
            
            <Button
              variant="default"
              onClick={onStartCooking}
              iconName="Play"
              iconPosition="left"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Start Cooking
            </Button>
            
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowShareMenu(!showShareMenu)}
                iconName="Share2"
              />
              
              {showShareMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-warm-lg border border-border p-2 min-w-[160px]">
                  {shareOptions?.map((option, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        option?.action();
                        setShowShareMenu(false);
                      }}
                      iconName={option?.icon}
                      iconPosition="left"
                      className="w-full justify-start mb-1 last:mb-0"
                    >
                      {option?.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Overlay for mobile share menu */}
      {showShareMenu && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/20"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </>
  );
};

export default FloatingActionBar;