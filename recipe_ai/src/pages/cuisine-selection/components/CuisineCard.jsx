import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CuisineCard = ({ cuisine, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(cuisine?.id)}
      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-warm-lg' 
          : 'shadow-warm hover:shadow-warm-md'
      }`}
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <Image
          src={cuisine?.image}
          alt={`${cuisine?.name} cuisine`}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" />
          </div>
        )}
      </div>
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-heading font-bold text-lg mb-1">{cuisine?.name}</h3>
        <p className="text-sm opacity-90 mb-2 line-clamp-2">{cuisine?.description}</p>
        
        {/* Popular Dishes */}
        <div className="flex flex-wrap gap-1">
          {cuisine?.popularDishes?.slice(0, 2)?.map((dish, index) => (
            <span
              key={index}
              className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
            >
              {dish}
            </span>
          ))}
          {cuisine?.popularDishes?.length > 2 && (
            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              +{cuisine?.popularDishes?.length - 2} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CuisineCard;