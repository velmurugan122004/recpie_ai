import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import { saveRecipe, isSaved, removeSavedByTitle, shareRecipe } from '../../utils/saved';
import { generateRecipeRecommendations } from '../../utils/openai';

const CUISINES = [
  'Italian', 'Indian', 'Chinese', 'Mexican', 'Mediterranean', 'French', 'Japanese', 'Thai'
];
// Simple cuisine image helper
const cuisineImage = (cuisine) => {
  const map = {
    Italian: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?q=80&w=1200&auto=format&fit=crop',
    Indian: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    Chinese: 'https://images.unsplash.com/photo-1544025162-8e99f13b47e9?q=80&w=1200&auto=format&fit=crop',
    Mexican: 'https://images.unsplash.com/photo-1558640472-690c5148de54?q=80&w=1200&auto=format&fit=crop',
    Mediterranean: 'https://images.unsplash.com/photo-1522184216315-dc2b4f7d6237?q=80&w=1200&auto=format&fit=crop',
    French: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop',
    Japanese: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop',
    Thai: 'https://images.unsplash.com/photo-1604908176997-431651c36d6a?q=80&w=1200&auto=format&fit=crop',
  };
  return map[cuisine] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop';
};

const Discover = () => {
  const navigate = useNavigate();
  const [selectedCuisine, setSelectedCuisine] = useState(CUISINES[0]);
  const [recipes, setRecipes] = useState([]);
  const [savedMap, setSavedMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const recs = await generateRecipeRecommendations({
          userInput: '',
          selectedCuisines: [selectedCuisine],
          dietaryFilters: [],
          inputType: 'text'
        });
        if (!cancelled) {
          // Normalize and cap to 10
          const top10 = (recs || []).slice(0, 10).map((r, i) => ({
            id: `${selectedCuisine.toLowerCase()}-${i + 1}`,
            title: r.title,
            description: r.description,
            cuisine: selectedCuisine,
            image: cuisineImage(selectedCuisine),
            cookTime: r.prepTime || '—',
            difficulty: r.difficulty || 'Easy',
            servings: r.servings || 2,
            ingredients: r.ingredients || [],
            instructions: r.instructions || [],
          }));
          setRecipes(top10);
          // Update saved map based on titles
          const map = {};
          top10.forEach(r => { map[r.title] = isSaved(r); });
          setSavedMap(map);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load recipes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedCuisine]);

  const onSelectRecipe = (recipe) => {
    // Navigate to existing recipe-detail page using its supported state shape
    navigate('/recipe-detail', {
      state: {
        recipe,
        fromPopular: true,
      },
    });
  };

  const onToggleSave = (e, recipe) => {
    e.stopPropagation();
    const already = savedMap[recipe.title];
    if (already) {
      removeSavedByTitle(recipe.title);
    } else {
      saveRecipe(recipe);
    }
    setSavedMap(prev => ({ ...prev, [recipe.title]: !already }));
  };

  const onShare = async (e, recipe) => {
    e.stopPropagation();
    try { await shareRecipe(recipe); } catch {}
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 lg:pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title + Cuisine selector */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Discover</h1>
              <p className="text-muted-foreground">Browse cuisine-based picks. Select a recipe to view full details.</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {CUISINES.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCuisine(c)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                    selectedCuisine === c
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
              <button
                onClick={() => navigate('/chat_ai', { state: { fromCuisine: selectedCuisine } })}
                className="ml-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 border border-primary"
              >
                Generate with AI
              </button>
            </div>
          </div>

          {/* State: error */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Grid of 10 recipes for the selected cuisine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(loading ? Array.from({ length: 6 }) : recipes).map((r, idx) => (
              <div
                key={r?.id || idx}
                className="group bg-card border border-border rounded-xl overflow-hidden shadow-warm hover:shadow-md transition-shadow"
                onClick={() => !loading && onSelectRecipe(r)}
              >
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-full h-40 bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative w-full h-40 overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                      <div className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-black/60 text-white">
                        {r.cuisine}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-heading font-semibold text-foreground line-clamp-2">{r.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                        <span className="inline-flex items-center gap-1"><Icon name="Clock" size={14} /> {r.cookTime}</span>
                        <span className="inline-flex items-center gap-1"><Icon name="Smile" size={14} /> {r.difficulty}</span>
                        <span className="inline-flex items-center gap-1"><Icon name="Users" size={14} /> {r.servings} servings</span>
                      </div>
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={(e) => onToggleSave(e, r)}
                          className={`px-2 py-1 text-xs rounded border ${savedMap[r.title] ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:bg-accent'}`}
                        >
                          {savedMap[r.title] ? 'Saved' : 'Save'}
                        </button>
                        <button
                          onClick={(e) => onShare(e, r)}
                          className="px-2 py-1 text-xs rounded border bg-background text-foreground border-border hover:bg-accent"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Discover;
