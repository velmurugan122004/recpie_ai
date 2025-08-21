import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-warm animate-pulse">
      <div className="h-40 sm:h-48 bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-2/3"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full w-16"></div>
          <div className="h-6 bg-muted rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;