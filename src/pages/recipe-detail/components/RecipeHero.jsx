import React, { useState } from 'react';
import Image from '../../../components/AppImage';

import Button from '../../../components/ui/Button';

const RecipeHero = ({ recipe, onToggleFavorite, onShare }) => {
  const [isFavorited, setIsFavorited] = useState(recipe?.isFavorited || false);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    onToggleFavorite(recipe?.id, !isFavorited);
  };

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-muted">
      <Image
        src={recipe?.image}
        alt={recipe?.title}
        className="w-full h-full object-cover"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteToggle}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
          iconName={isFavorited ? "Heart" : "Heart"}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onShare}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
          iconName="Share2"
        />
      </div>
      {/* Recipe Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-2">
          {recipe?.title}
        </h1>
        <p className="text-white/90 text-sm sm:text-base font-body line-clamp-2">
          {recipe?.description}
        </p>
      </div>
    </div>
  );
};

export default RecipeHero;