import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InputMethodCard from './components/InputMethodCard';
import VoiceRecordingModal from './components/VoiceRecordingModal';
import FileUploadModal from './components/FileUploadModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ChatInput from '../../components/chat/ChatInput';
import { generateRecipeRecommendations, generateDetailedRecipe } from '../../utils/openai';
import { saveRecipe, isSaved, removeSavedByTitle, shareRecipe } from '../../utils/saved';

  // Local fallback if OpenAI is unavailable - with specific recipes for common dishes
const buildMockDetailedRecipe = (title) => {
  const t = String(title || '').toLowerCase();
  
  // Specific recipes for common dishes
  const specificRecipes = {
    'sambar': {
      title: 'Sambar',
      description: 'Traditional South Indian lentil curry with vegetables and aromatic spices',
      ingredients: [
        '1 cup toor dal (pigeon peas)',
        '2 tbsp sambar powder',
        '1 tsp turmeric powder',
        '2 tbsp tamarind paste',
        '1 large onion, chopped',
        '2 tomatoes, chopped',
        '1 drumstick, cut into pieces',
        '1 small eggplant, cubed',
        '10-12 okra, chopped',
        '2 tbsp coconut oil',
        '1 tsp mustard seeds',
        '1 tsp cumin seeds',
        '2 dried red chilies',
        '10-12 curry leaves',
        '2 cloves garlic, minced',
        '1 inch ginger, minced',
        '2 green chilies, slit',
        'Salt to taste',
        'Fresh coriander for garnish'
      ],
      instructions: [
        'Wash and cook toor dal with turmeric in a pressure cooker until soft and mushy.',
        'Soak tamarind in warm water and extract thick paste.',
        'Heat coconut oil in a large pot. Add mustard seeds, cumin seeds, and dried red chilies.',
        'When seeds splutter, add curry leaves, garlic, ginger, and green chilies.',
        'Add chopped onions and sauté until golden brown.',
        'Add tomatoes and cook until they break down completely.',
        'Add drumstick, eggplant, and okra. Cook for 5 minutes.',
        'Add sambar powder and cook for 2 minutes until fragrant.',
        'Add cooked dal, tamarind paste, and 2 cups water. Mix well.',
        'Bring to a boil, then simmer for 15-20 minutes until vegetables are tender.',
        'Season with salt and garnish with fresh coriander.',
        'Serve hot with rice, idli, or dosa.'
      ],
      nutrition: {
        calories: 180,
        protein: '8g',
        carbs: '32g',
        fat: '6g',
        fiber: '7g'
      }
    },
    'butter chicken': {
      title: 'Butter Chicken',
      description: 'Creamy and rich North Indian curry with tender chicken in tomato-based sauce',
      ingredients: [
        '2 lbs boneless chicken, cut into pieces',
        '1 cup plain yogurt',
        '2 tsp garam masala',
        '1 tsp turmeric',
        '2 tbsp ginger-garlic paste',
        '1 can (14 oz) crushed tomatoes',
        '1/2 cup heavy cream',
        '4 tbsp butter',
        '1 large onion, finely chopped',
        '2 tsp cumin seeds',
        '1 tsp red chili powder',
        '1 tsp fenugreek leaves (kasoori methi)',
        'Salt to taste',
        'Fresh cilantro for garnish'
      ],
      instructions: [
        'Marinate chicken with yogurt, 1 tsp garam masala, turmeric, and salt for 30 minutes.',
        'Heat 2 tbsp butter in a pan and cook marinated chicken until done. Set aside.',
        'In the same pan, add remaining butter and cumin seeds.',
        'Add chopped onions and cook until golden brown.',
        'Add ginger-garlic paste and cook for 2 minutes.',
        'Add crushed tomatoes, remaining garam masala, and chili powder.',
        'Simmer for 10 minutes until sauce thickens.',
        'Add cooked chicken and heavy cream. Simmer for 5 minutes.',
        'Crush fenugreek leaves and add to the curry.',
        'Garnish with fresh cilantro and serve with rice or naan.'
      ],
      nutrition: {
        calories: 320,
        protein: '28g',
        carbs: '8g',
        fat: '20g',
        fiber: '2g'
      }
    },
    'biryani': {
      title: 'Chicken Biryani',
      description: 'Aromatic layered rice dish with spiced chicken and fragrant basmati rice',
      ingredients: [
        '2 cups basmati rice',
        '1 lb chicken, cut into pieces',
        '1 cup yogurt',
        '2 tbsp biryani masala powder',
        '1 tsp turmeric',
        '2 tbsp ginger-garlic paste',
        '2 large onions, thinly sliced',
        '1/4 cup ghee',
        '4-5 green cardamom pods',
        '2 bay leaves',
        '1 inch cinnamon stick',
        '4 cloves',
        '1 tsp cumin seeds',
        '1/4 cup mint leaves',
        '1/4 cup cilantro leaves',
        'Saffron soaked in 1/4 cup warm milk',
        'Salt to taste'
      ],
      instructions: [
        'Marinate chicken with yogurt, biryani masala, turmeric, ginger-garlic paste, and salt for 1 hour.',
        'Soak basmati rice for 30 minutes, then drain.',
        'Deep fry sliced onions until golden brown and crispy. Set aside.',
        'Cook marinated chicken in a heavy-bottomed pot until 70% done.',
        'In a separate pot, boil water with whole spices and salt.',
        'Add soaked rice and cook until 70% done. Drain.',
        'Layer the partially cooked rice over chicken.',
        'Sprinkle fried onions, mint, cilantro, and saffron milk on top.',
        'Cover with aluminum foil, then place lid. Cook on high heat for 3 minutes.',
        'Reduce heat to low and cook for 45 minutes.',
        'Let it rest for 10 minutes before opening.',
        'Gently mix and serve hot with raita and boiled eggs.'
      ],
      nutrition: {
        calories: 420,
        protein: '25g',
        carbs: '45g',
        fat: '15g',
        fiber: '2g'
      }
    },
    'pasta': {
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper',
      ingredients: [
        '1 lb spaghetti',
        '6 oz pancetta or guanciale, diced',
        '4 large eggs',
        '1 cup freshly grated Pecorino Romano cheese',
        '1/2 cup freshly grated Parmesan cheese',
        '2 cloves garlic, minced',
        'Freshly ground black pepper',
        'Salt for pasta water',
        'Fresh parsley for garnish'
      ],
      instructions: [
        'Bring a large pot of salted water to boil for pasta.',
        'In a large bowl, whisk together eggs, Pecorino Romano, Parmesan, and black pepper.',
        'Cook pancetta in a large skillet over medium heat until crispy.',
        'Add minced garlic to pancetta and cook for 1 minute.',
        'Cook spaghetti according to package directions until al dente.',
        'Reserve 1 cup pasta cooking water before draining.',
        'Add hot pasta to the skillet with pancetta.',
        'Remove from heat and quickly toss with egg mixture.',
        'Add pasta water gradually to create a creamy sauce.',
        'Serve immediately with extra cheese and black pepper.',
        'Garnish with fresh parsley.'
      ],
      nutrition: {
        calories: 380,
        protein: '18g',
        carbs: '42g',
        fat: '16g',
        fiber: '2g'
      }
    }
  };

  // Check for specific recipes first
  for (const [key, recipe] of Object.entries(specificRecipes)) {
    if (t.includes(key)) {
      return {
        ...recipe,
        cookingTips: [
          'Taste and adjust seasoning as needed.',
          'Use fresh ingredients for best flavor.',
          'Don\'t rush the cooking process for best results.'
        ],
        variations: [
          'Add your favorite vegetables for extra nutrition.',
          'Adjust spice levels according to your preference.',
          'Try different protein options for variety.'
        ],
        storageInstructions: 'Store in refrigerator for up to 3 days. Reheat gently before serving.'
      };
    }
  }

  // Fallback to generic recipe builder for unknown dishes
  const has = (k) => t.includes(k);
  const baseSpices = ['salt', 'black pepper'];
  const protein = has('chicken') ? 'chicken' : has('paneer') ? 'paneer' : has('egg') ? 'eggs' : has('fish') ? 'fish' : has('tofu') ? 'tofu' : 'mixed vegetables';
  const cuisineHints = has('butter') || has('masala') || has('tikka') || has('dal') ? 'Indian' : has('pizza') || has('pasta') || has('margherita') ? 'Italian' : has('noodles') || has('kung pao') || has('fried rice') ? 'Chinese' : has('taco') || has('salsa') ? 'Mexican' : has('curry') || has('thai') ? 'Thai' : 'Global';
  const fats = cuisineHints === 'Italian' ? 'olive oil' : cuisineHints === 'Indian' ? 'ghee or oil' : cuisineHints === 'Chinese' ? 'neutral oil' : 'oil';
  const aromatics = cuisineHints === 'Indian' ? ['onion', 'ginger', 'garlic'] : cuisineHints === 'Italian' ? ['garlic'] : cuisineHints === 'Chinese' ? ['garlic', 'ginger'] : ['onion', 'garlic'];
  const herbs = cuisineHints === 'Italian' ? ['basil', 'oregano'] : cuisineHints === 'Indian' ? ['coriander', 'curry leaves'] : cuisineHints === 'Mexican' ? ['cilantro'] : ['parsley'];
  const spiceBlend = cuisineHints === 'Indian' ? ['turmeric', 'coriander powder', 'red chili (optional)'] : cuisineHints === 'Chinese' ? ['soy sauce', 'chili (optional)'] : cuisineHints === 'Mexican' ? ['cumin', 'paprika'] : cuisineHints === 'Thai' ? ['green curry paste'] : [];
  const carb = has('rice') ? 'cooked rice' : has('pizza') ? 'pizza dough' : has('pasta') ? 'pasta' : has('noodle') ? 'noodles' : 'bread or rice';

  const ingredients = [
    `2 tbsp ${fats}`,
    ...aromatics.map(a => `1 ${a}`),
    `${protein} (~400g)`,
    ...spiceBlend,
    ...herbs,
    ...baseSpices,
    has('soup') || has('curry') ? '2 cups stock or water' : '1 cup tomatoes (fresh or canned)'
  ];

  const instructions = [
    `Heat ${fats} in a pan over medium heat.`,
    `Add ${aromatics.join(', ')} and sauté until fragrant.`,
    `Add ${protein} and cook until lightly browned.`,
    spiceBlend.length ? `Stir in ${spiceBlend.join(', ')} and cook 1 minute.` : 'Season lightly and continue cooking.',
    has('soup') || has('curry') ? 'Pour in stock/water and simmer 10-15 minutes.' : 'Add tomatoes and cook until saucy.',
    `Adjust salt and pepper. Finish with ${herbs[0]}. Serve hot with ${carb}.`
  ];

  return {
    title,
    description: `A practical, flavorful ${cuisineHints} style recipe for ${title}.`,
    ingredients,
    instructions,
    nutrition: {
      calories: 220,
      protein: protein === 'mixed vegetables' ? '6g' : '22g',
      carbs: carb.includes('rice') || carb.includes('pasta') || carb.includes('noodles') ? '28g' : '12g',
      fat: '10g',
      fiber: '3g'
    },
    cookingTips: [
      'Taste and adjust seasoning gradually.',
      'If sauce gets too thick, add a splash of water/stock.'
    ],
    variations: [
      `Swap ${protein} for tofu or paneer for a vegetarian option.`,
      `Add vegetables like bell peppers or spinach for extra nutrients.`
    ],
    storageInstructions: 'Refrigerate up to 2 days; reheat gently and add water if thick.'
  };
};

const HomeInputSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromCuisine = location?.state?.fromCuisine || null;
  const csUserInput = location?.state?.csUserInput || '';
  const csDietaryFilters = location?.state?.dietaryFilters || [];
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState(null);
  const [suggestionSavedMap, setSuggestionSavedMap] = useState({});
  // Bot messages shown below the welcome card
  const [botMessages, setBotMessages] = useState([
    { id: 'm1', text: "Hello! I'm your Recipe AI Assistant. Tell me a dish name to get the full recipe, or ask for ideas.", time: 'Just now' }
  ]);

  // Chat state persistence (only chat, not saved recipes)
  const CHAT_STORAGE_KEY = 'chat_ai_state';
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.botMessages)) setBotMessages(parsed.botMessages);
          if (parsed.detailedRecipe) setDetailedRecipe(parsed.detailedRecipe);
          if (Array.isArray(parsed.suggestions)) setSuggestions(parsed.suggestions);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      const payload = JSON.stringify({ botMessages, detailedRecipe, suggestions });
      localStorage.setItem(CHAT_STORAGE_KEY, payload);
    } catch (_) {}
  }, [botMessages, detailedRecipe, suggestions]);

  const clearChat = () => {
    try { localStorage.removeItem(CHAT_STORAGE_KEY); } catch (_) {}
    setBotMessages([{ id: 'm1', text: "Hello! I'm your Recipe AI Assistant. Tell me a dish name to get the full recipe, or ask for ideas.", time: 'Just now' }]);
    setDetailedRecipe(null);
    setSuggestions([]);
    setSuggestionSavedMap({});
    setSuggestLoading(false);
  };

  // Popular recipes section has been removed

  const inputMethods = [
    {
      icon: "Mic",
      title: "Voice Recording",
      description: "Tell us what ingredients you have or what you\'re craving",
      onClick: () => setIsVoiceModalOpen(true)
    },
    {
      icon: "Camera",
      title: "Photo Upload",
      description: "Take a photo of your ingredients or a dish you want to recreate",
      meta: "Formats: JPG, JPEG, PNG, WebP (max 10MB)",
      onClick: () => setIsPhotoModalOpen(true)
    },
    {
      icon: "Keyboard",
      title: "Text Input",
      description: "Type your ingredients or describe what you want to cook",
      onClick: () => navigate('/cuisine-selection', { 
        state: { inputType: 'text', inputData: null } 
      })
    },
    {
      icon: "Image",
      title: "Screenshot Upload",
      description: "Upload a menu item, recipe, or food image for inspiration",
      meta: "Formats: .jpg, .jpeg, .png, .webp (max 10MB)",
      onClick: () => setIsScreenshotModalOpen(true)
    }
  ];

  const handleVoiceRecordingComplete = (recordedText) => {
    navigate('/cuisine-selection', { 
      state: { 
        inputType: 'voice', 
        inputData: recordedText 
      } 
    });
  };

  const toggleSaveDetailed = (e) => {
    e?.stopPropagation?.();
    if (!detailedRecipe?.title) return;
    if (isSaved(detailedRecipe)) {
      removeSavedByTitle(detailedRecipe.title);
      // force re-render by cloning
      setDetailedRecipe({ ...detailedRecipe });
    } else {
      saveRecipe(detailedRecipe);
      setDetailedRecipe({ ...detailedRecipe });
    }
  };

  const shareDetailed = async (e) => {
    e?.stopPropagation?.();
    if (!detailedRecipe) return;
    try { await shareRecipe(detailedRecipe); } catch {}
  };

  const toggleSaveSuggestion = (e, rec) => {
    e.stopPropagation();
    if (!rec?.title) return;
    const already = !!suggestionSavedMap[rec.title];
    if (already) {
      removeSavedByTitle(rec.title);
    } else {
      saveRecipe(rec);
    }
    setSuggestionSavedMap(prev => ({ ...prev, [rec.title]: !already }));
  };

  const shareSuggestion = async (e, rec) => {
    e.stopPropagation();
    try { await shareRecipe(rec); } catch {}
  };

  // If we arrive with a direct dish name in csUserInput (from any input flow), auto-generate full details
  useEffect(() => {
    let cancelled = false;
    async function genDetailIfDish() {
      if (!csUserInput) return;
      if (!isLikelyDishName(csUserInput)) return;
      try {
        setSuggestLoading(true);
        setDetailedRecipe(null);
        const details = await generateDetailedRecipe({ title: csUserInput, description: '' });
        if (cancelled) return;
        const full = {
          title: csUserInput,
          description: details?.description || `Detailed recipe for ${csUserInput}.`,
          ingredients: details?.ingredients || [],
          instructions: details?.instructions || [],
          nutrition: details?.nutrition || undefined,
          cookingTips: details?.cookingTips || [],
          variations: details?.variations || [],
          storageInstructions: details?.storageInstructions || ''
        };
        setDetailedRecipe(full);
        setSuggestions([]);
        setBotMessages(prev => [
          ...prev,
          { id: `m-${Date.now()}`, text: `Here is how to make "${csUserInput}".`, time: 'Just now' }
        ]);
      } catch (_) {
        // Use mock details so user still gets output
        if (!cancelled) {
          const mock = buildMockDetailedRecipe(csUserInput);
          setDetailedRecipe(mock);
          setSuggestions([]);
          setBotMessages(prev => [
            ...prev,
            { id: `m-${Date.now()}`, text: `Here is how to make "${csUserInput}" (mock recipe).`, time: 'Just now' }
          ]);
        }
      } finally {
        if (!cancelled) setSuggestLoading(false);
      }
    }
    genDetailIfDish();
    return () => { cancelled = true; };
  }, [csUserInput]);

  // If navigated from Discover/Cuisine Selection with a selected cuisine, pre-generate 10 related dishes
  useEffect(() => {
    let cancelled = false;
    async function loadSuggestions() {
      if (!fromCuisine) return;
      setSuggestLoading(true);
      try {
        const recs = await generateRecipeRecommendations({
          userInput: csUserInput || '',
          selectedCuisines: [fromCuisine],
          dietaryFilters: csDietaryFilters,
          inputType: 'text'
        });
        if (!cancelled) {
          const top10 = (recs || []).slice(0, 10);
          setSuggestions(top10);
          const map = {};
          top10.forEach(r => { if (r?.title) map[r.title] = isSaved(r); });
          setSuggestionSavedMap(map);
        }
      } catch (e) {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setSuggestLoading(false);
      }
    }
    loadSuggestions();
    return () => { cancelled = true; };
  }, [fromCuisine, csUserInput, JSON.stringify(csDietaryFilters)]);

  const handleChooseSuggestion = (recipe) => {
    navigate('/recipe-detail', { state: { recipe } });
  };

  const handlePhotoUpload = (file, previewUrl, analysisResult) => {
    navigate('/cuisine-selection', { 
      state: { 
        inputType: 'photo', 
        inputData: { 
          file, 
          previewUrl, 
          fileName: file?.name,
          analysis: analysisResult,
          source: 'upload'
        }
      } 
    });
  };

  const handleCameraCapture = (file) => {
    const previewUrl = URL.createObjectURL(file);
    navigate('/cuisine-selection', { 
      state: { 
        inputType: 'photo', 
        inputData: { 
          file, 
          previewUrl, 
          fileName: 'camera-capture.jpg',
          source: 'camera'
        }
      } 
    });
  };

  const handleScreenshotUpload = (file, previewUrl, analysisResult) => {
    navigate('/cuisine-selection', { 
      state: { 
        inputType: 'screenshot', 
        inputData: { 
          file, 
          previewUrl, 
          fileName: file?.name,
          analysis: analysisResult 
        }
      } 
    });
  };

const isLikelyDishName = (t) => {
    if (!t) return false;
    const s = String(t).trim();
    if (s.length < 3) return false;
    // Heuristics: short-ish, few separators, not a question, contains letters
    const separators = /[,;?!]/;
    const looksQueryish = /(make|cook|with|ideas|recipes|what|how|suggest|help)/i;
    return s.length <= 60 && !separators.test(s) && !looksQueryish.test(s) && /[a-zA-Z]/.test(s);
  };

const handleSendText = async (text) => {
    try {
      setIsSending(true);
      setSuggestLoading(true);
      setDetailedRecipe(null);
      setSuggestions([]);
      setSuggestionSavedMap({});

      try {
        const details = await generateDetailedRecipe({ title: text, description: '' });
        const full = {
          title: text,
          description: details?.description || `Detailed recipe for ${text}.`,
          ingredients: details?.ingredients || [],
          instructions: details?.instructions || [],
          nutrition: details?.nutrition || undefined,
          cookingTips: details?.cookingTips || [],
          variations: details?.variations || [],
          storageInstructions: details?.storageInstructions || ''
        };
        setDetailedRecipe(full);
        setBotMessages(prev => [
          ...prev,
          { id: `m-${Date.now()}`, text: `Here is how to make "${text}".`, time: 'Just now' }
        ]);
      } catch (_) {
        // Fallback to a local mock full recipe so the user still gets output
        const mock = buildMockDetailedRecipe(text);
        setDetailedRecipe(mock);
        setBotMessages(prev => [
          ...prev,
          { id: `m-${Date.now()}`, text: `Here is how to make "${text}" (mock recipe).`, time: 'Just now' }
        ]);
      }
    } finally {
      setIsSending(false);
      setSuggestLoading(false);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-16 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Message */}
          <div className="welcome-message flex items-start gap-3 bg-muted/40 border border-border rounded-xl p-3 mb-4">
            <div className="welcome-avatar w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Bot" size={16} className="text-primary" />
            </div>
            <div className="welcome-content text-sm text-foreground">
              <h3 className="font-heading font-semibold mb-1">Welcome to Recipe AI! 🍳</h3>
              <p className="text-muted-foreground">Tell me a dish name for a full recipe, or ask for ideas.</p>
            </div>
          </div>

          {/* Detailed Recipe Card */}
          {detailedRecipe && (
            <div className="bg-background border border-border rounded-xl p-4 mb-4">
              <h4 className="font-heading font-semibold text-foreground mb-1">{detailedRecipe.title}</h4>
              {detailedRecipe.description && (
                <p className="text-sm text-muted-foreground mb-3">{detailedRecipe.description}</p>
              )}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={toggleSaveDetailed}
                  className={`px-2 py-1 text-xs rounded border ${isSaved(detailedRecipe) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:bg-accent'}`}
                >
                  {isSaved(detailedRecipe) ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={shareDetailed}
                  className="px-2 py-1 text-xs rounded border bg-background text-foreground border-border hover:bg-accent"
                >
                  Share
                </button>
              </div>
              {Array.isArray(detailedRecipe.ingredients) && detailedRecipe.ingredients.length > 0 && (
                <div className="mb-3">
                  <div className="font-medium mb-1">Ingredients</div>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {detailedRecipe.ingredients.map((ing, i) => (<li key={i}>{ing}</li>))}
                  </ul>
                </div>
              )}
              {Array.isArray(detailedRecipe.instructions) && detailedRecipe.instructions.length > 0 && (
                <div className="mb-3">
                  <div className="font-medium mb-1">Instructions</div>
                  <ol className="list-decimal pl-5 text-sm space-y-1">
                    {detailedRecipe.instructions.map((step, i) => (<li key={i}>{step}</li>))}
                  </ol>
                </div>
              )}
              {detailedRecipe.nutrition && (
                <div className="mb-3 text-sm text-muted-foreground">
                  <div className="font-medium text-foreground mb-1">Nutrition (approx.)</div>
                  <div>Calories: {detailedRecipe.nutrition.calories}</div>
                  <div>Protein: {detailedRecipe.nutrition.protein} · Carbs: {detailedRecipe.nutrition.carbs} · Fat: {detailedRecipe.nutrition.fat} · Fiber: {detailedRecipe.nutrition.fiber}</div>
                </div>
              )}
              <div className="mt-3">
                <button
                  onClick={() => navigate('/recipe-detail', { state: { recipe: detailedRecipe } })}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm border border-primary hover:opacity-90"
                >
                  <Icon name="BookOpen" size={14} /> Open full recipe
                </button>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {(fromCuisine || suggestions.length > 0 || suggestLoading) && (
            <div className="bg-muted/40 border border-border rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-semibold text-sm text-foreground">{fromCuisine ? `AI Suggestions for ${fromCuisine}` : 'AI Suggestions'}</h4>
                {suggestLoading && <span className="text-xs text-muted-foreground">Loading…</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(suggestLoading ? Array.from({ length: 6 }) : suggestions).map((s, idx) => (
                  <button
                    key={s?.title || idx}
                    onClick={() => !suggestLoading && handleChooseSuggestion(s)}
                    className="text-left bg-background border border-border rounded-lg p-3 hover:bg-accent/30 transition"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">{s?.title || '—'}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{s?.description || ''}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleSaveSuggestion(e, s)}
                          className={`px-2 py-0.5 text-[11px] rounded border ${s?.title && suggestionSavedMap[s.title] ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:bg-accent'}`}
                        >
                          {s?.title && suggestionSavedMap[s.title] ? 'Saved' : 'Save'}
                        </button>
                        <button
                          onClick={(e) => shareSuggestion(e, s)}
                          className="px-2 py-0.5 text-[11px] rounded border bg-background text-foreground border-border hover:bg-accent"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bot Messages */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recipe AI Assistant</span>
              <button
                onClick={clearChat}
                className="text-xs px-2 py-1 rounded border bg-background text-foreground border-border hover:bg-accent"
                title="Clear only the chat (saved recipes remain)"
              >
                Clear Chat
              </button>
            </div>
            {botMessages.map(msg => (
              <div key={msg.id} className="message bot-message flex items-start gap-3">
                <div className="message-avatar w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Bot" size={16} className="text-primary" />
                </div>
                <div className="message-content bg-background border border-border rounded-xl p-3 text-sm">
                  <div className="message-text">{msg.text}</div>
                  {msg.time && (
                    <span className="message-time block mt-1 text-xs text-muted-foreground">{msg.time}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area-fullpage border-t border-border p-3">
            <ChatInput
              onSend={handleSendText}
              onVoiceClick={() => setIsVoiceModalOpen(true)}
              onImageClick={() => setIsPhotoModalOpen(true)}
              onCameraCapture={handleCameraCapture}
              isSending={isSending}
            />
          </div>
        </div>
      </main>

      {/* Quick Actions - bottom section */}
      <div className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-warm max-w-3xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Sparkles" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Need Recipe Inspiration?
              </h3>
              <p className="font-body text-muted-foreground max-w-md mx-auto">
                Browse your saved recipes, explore trending dishes, or take a photo of your ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/saved-recipes')}
                  iconName="BookOpen"
                  iconPosition="left"
                >
                  My Saved Recipes
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate('/cuisine-selection', { 
                    state: { inputType: 'explore', inputData: null } 
                  })}
                  iconName="Globe"
                  iconPosition="left"
                >
                  Explore Cuisines
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsPhotoModalOpen(true)}
                  iconName="Camera"
                  iconPosition="left"
                >
                  Take a Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <VoiceRecordingModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onRecordingComplete={handleVoiceRecordingComplete}
      />
      <FileUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onFileUpload={handlePhotoUpload}
        title="Upload Photo"
        acceptedTypes="image/jpeg, image/png, image/webp"
        description="Upload a photo of your ingredients or a dish you want to recreate"
      />
      <FileUploadModal
        isOpen={isScreenshotModalOpen}
        onClose={() => setIsScreenshotModalOpen(false)}
        onFileUpload={handleScreenshotUpload}
        title="Upload Screenshot"
        acceptedTypes=".jpg, .jpeg, .png, .webp"
        description="Upload a menu item, recipe screenshot, or food image for inspiration"
      />
    </div>
  );
};

export default HomeInputSelection;
