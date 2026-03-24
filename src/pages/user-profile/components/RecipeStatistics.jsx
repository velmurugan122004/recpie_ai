import React from 'react';
import Icon from '../../../components/AppIcon';

const RecipeStatistics = ({ stats }) => {
  const statisticCards = [
    {
      id: 'totalSaved',
      label: 'Saved Recipes',
      value: stats?.totalSaved || 0,
      icon: 'BookOpen',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'totalCooked',
      label: 'Recipes Cooked',
      value: stats?.totalCooked || 0,
      icon: 'ChefHat',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'cookingStreak',
      label: 'Cooking Streak',
      value: `${stats?.cookingStreak || 0} days`,
      icon: 'Flame',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      id: 'favoritesCuisine',
      label: 'Favorite Cuisine',
      value: stats?.favoriteCuisine || 'Italian',
      icon: 'Globe',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  const topCuisines = [
    { name: 'Italian', count: 15, percentage: 35 },
    { name: 'Indian', count: 12, percentage: 28 },
    { name: 'Mexican', count: 8, percentage: 19 },
    { name: 'Chinese', count: 5, percentage: 12 },
    { name: 'Thai', count: 3, percentage: 6 }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: 'Recipe Explorer',
      description: 'Saved 10 recipes from different cuisines',
      icon: 'Award',
      date: '2 days ago',
      color: 'text-primary'
    },
    {
      id: 2,
      title: 'Cooking Streak',
      description: 'Cooked for 7 consecutive days',
      icon: 'Flame',
      date: '1 week ago',
      color: 'text-accent'
    },
    {
      id: 3,
      title: 'Healthy Choice',
      description: 'Tried 5 low-calorie recipes',
      icon: 'Heart',
      date: '2 weeks ago',
      color: 'text-success'
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm mb-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="BarChart3" size={20} color="var(--color-primary)" />
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Recipe Statistics
        </h2>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statisticCards?.map((stat) => (
          <div key={stat?.id} className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={16} className={stat?.color} />
              </div>
            </div>
            <div className="text-2xl font-heading font-bold text-foreground mb-1">
              {stat?.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat?.label}
            </div>
          </div>
        ))}
      </div>
      {/* Top Cuisines */}
      <div className="mb-8">
        <h3 className="text-lg font-heading font-medium text-foreground mb-4">
          Most Cooked Cuisines
        </h3>
        <div className="space-y-3">
          {topCuisines?.map((cuisine, index) => (
            <div key={cuisine?.name} className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{cuisine?.name}</span>
                  <span className="text-xs text-muted-foreground">{cuisine?.count} recipes</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cuisine?.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Achievements */}
      <div>
        <h3 className="text-lg font-heading font-medium text-foreground mb-4">
          Recent Achievements
        </h3>
        <div className="space-y-3">
          {recentAchievements?.map((achievement) => (
            <div key={achievement?.id} className="flex items-start space-x-3 p-3 rounded-lg bg-background border border-border">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name={achievement?.icon} size={16} className={achievement?.color} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {achievement?.title}
                </h4>
                <p className="text-xs text-muted-foreground mb-1">
                  {achievement?.description}
                </p>
                <span className="text-xs text-muted-foreground">
                  {achievement?.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeStatistics;