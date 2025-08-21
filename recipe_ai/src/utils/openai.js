import OpenAI from 'openai';

/**
 * Initialize OpenAI client with API key from environment variables
 */
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage in React
    })
  : null;

export function ensureOpenAIConfigured() {
  if (!apiKey) {
    throw new Error(
      'OpenAI API key not configured. Create a .env file with VITE_OPENAI_API_KEY=your_key and restart the dev server.'
    );
  }
}

// Enhanced mock generator with unique recipes based on actual dish knowledge
function getMockRecipes({ userInput = '', selectedCuisines = [], dietaryFilters = [] }) {
  const cuisineNames = selectedCuisines?.map(c => c?.name || c) || [];
  const dietNames = dietaryFilters?.map(f => f?.label || f) || [];

  const tags = [];
  if (cuisineNames.length) tags.push(...cuisineNames.map(n => n.toLowerCase()));
  if (dietNames.length) tags.push(...dietNames.map(n => n.toLowerCase()));

  // Detailed recipe database with unique ingredients and instructions for each dish
  const recipeDatabase = {
    Italian: [
      {
        title: 'Classic Margherita Pizza',
        description: 'Traditional Italian pizza with fresh tomatoes, mozzarella, and basil',
        prepTime: '25 min',
        difficulty: 'Medium',
        servings: 4,
        rating: 4.8,
        ingredients: [
          '1 pizza dough (store-bought or homemade)',
          '1/2 cup pizza sauce',
          '8 oz fresh mozzarella, sliced',
          '2 large tomatoes, sliced',
          '1/4 cup fresh basil leaves',
          '2 tbsp extra virgin olive oil',
          '1 tsp salt',
          '1/2 tsp black pepper'
        ],
        instructions: [
          'Preheat oven to 475°F (245°C).',
          'Roll out pizza dough on a floured surface.',
          'Spread pizza sauce evenly over dough.',
          'Add mozzarella slices and tomato slices.',
          'Drizzle with olive oil and season with salt and pepper.',
          'Bake for 12-15 minutes until crust is golden.',
          'Top with fresh basil leaves before serving.'
        ]
      },
      {
        title: 'Creamy Fettuccine Alfredo',
        description: 'Rich and creamy pasta dish with parmesan cheese and butter',
        prepTime: '20 min',
        difficulty: 'Easy',
        servings: 4,
        rating: 4.6,
        ingredients: [
          '1 lb fettuccine pasta',
          '1/2 cup unsalted butter',
          '1 cup heavy cream',
          '1 1/2 cups freshly grated Parmesan cheese',
          '3 cloves garlic, minced',
          '1/4 cup fresh parsley, chopped',
          'Salt and white pepper to taste',
          'Pinch of nutmeg'
        ],
        instructions: [
          'Cook fettuccine according to package directions until al dente.',
          'In a large pan, melt butter over medium heat.',
          'Add minced garlic and sauté for 1 minute.',
          'Pour in heavy cream and bring to a gentle simmer.',
          'Gradually whisk in Parmesan cheese until smooth.',
          'Add drained pasta and toss to coat.',
          'Season with salt, pepper, and nutmeg.',
          'Garnish with fresh parsley and serve immediately.'
        ]
      }
    ],
    Indian: [
      {
        title: 'Butter Chicken (Murgh Makhani)',
        description: 'Creamy tomato-based curry with tender chicken pieces',
        prepTime: '35 min',
        difficulty: 'Medium',
        servings: 4,
        rating: 4.9,
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
          'Garnish with fresh cilantro and serve with rice or naan.'
        ]
      },
      {
        title: 'Chana Masala',
        description: 'Spicy and tangy chickpea curry with aromatic spices',
        prepTime: '30 min',
        difficulty: 'Easy',
        servings: 4,
        rating: 4.7,
        ingredients: [
          '2 cans (15 oz each) chickpeas, drained and rinsed',
          '2 large onions, finely chopped',
          '4 tomatoes, chopped',
          '3 tbsp ginger-garlic paste',
          '2 tsp cumin seeds',
          '2 tsp coriander powder',
          '1 tsp turmeric powder',
          '2 tsp garam masala',
          '1 tsp red chili powder',
          '3 tbsp vegetable oil',
          '1 cup water',
          'Salt to taste',
          'Fresh cilantro and ginger for garnish'
        ],
        instructions: [
          'Heat oil in a large pan and add cumin seeds.',
          'Add chopped onions and cook until golden brown.',
          'Add ginger-garlic paste and cook for 2 minutes.',
          'Add chopped tomatoes and cook until they break down.',
          'Add all dry spices and cook for 2 minutes.',
          'Add chickpeas and mix well with the masala.',
          'Add water and bring to a boil.',
          'Simmer for 15-20 minutes until sauce thickens.',
          'Garnish with fresh cilantro and ginger.',
          'Serve hot with rice or Indian bread.'
        ]
      }
    ],
    Chinese: [
      {
        title: 'Kung Pao Chicken',
        description: 'Spicy Sichuan dish with chicken, peanuts, and dried chilies',
        prepTime: '25 min',
        difficulty: 'Medium',
        servings: 4,
        rating: 4.5,
        ingredients: [
          '1 lb boneless chicken thighs, diced',
          '1/2 cup roasted peanuts',
          '6-8 dried red chilies',
          '3 green onions, chopped',
          '3 cloves garlic, minced',
          '1 tbsp fresh ginger, minced',
          '2 tbsp soy sauce',
          '1 tbsp dark soy sauce',
          '1 tbsp rice vinegar',
          '1 tsp sugar',
          '1 tsp cornstarch',
          '2 tbsp vegetable oil',
          '1 tsp Sichuan peppercorns'
        ],
        instructions: [
          'Mix chicken with 1 tbsp soy sauce and cornstarch. Let marinate for 15 minutes.',
          'Heat oil in a wok over high heat.',
          'Add dried chilies and Sichuan peppercorns, stir-fry for 30 seconds.',
          'Add marinated chicken and stir-fry until cooked through.',
          'Add garlic and ginger, stir-fry for 1 minute.',
          'Mix remaining soy sauce, dark soy sauce, vinegar, and sugar.',
          'Pour sauce over chicken and stir to combine.',
          'Add roasted peanuts and green onions.',
          'Stir-fry for another minute and serve hot with rice.'
        ]
      }
    ],
    Mexican: [
      {
        title: 'Chicken Tinga Tacos',
        description: 'Shredded chicken in smoky chipotle tomato sauce',
        prepTime: '40 min',
        difficulty: 'Easy',
        servings: 6,
        rating: 4.8,
        ingredients: [
          '2 lbs boneless chicken thighs',
          '1 large onion, sliced',
          '3 tomatoes, quartered',
          '3 chipotle peppers in adobo sauce',
          '2 tbsp adobo sauce',
          '3 cloves garlic',
          '1 tsp cumin',
          '1 tsp oregano',
          '2 tbsp vegetable oil',
          'Salt and pepper to taste',
          'Corn tortillas',
          'White onion, diced',
          'Fresh cilantro',
          'Lime wedges'
        ],
        instructions: [
          'Season chicken with salt and pepper.',
          'Heat oil in a large pot and brown chicken on both sides.',
          'Add sliced onion and cook until softened.',
          'Blend tomatoes, chipotle peppers, adobo sauce, garlic, cumin, and oregano.',
          'Pour sauce over chicken and bring to a boil.',
          'Reduce heat, cover, and simmer for 25-30 minutes.',
          'Remove chicken and shred with two forks.',
          'Return shredded chicken to the pot and mix with sauce.',
          'Serve in warm tortillas with diced onion, cilantro, and lime.'
        ]
      }
    ]
  };

  const genericRecipes = [
    {
      title: 'Mediterranean Quinoa Bowl',
      description: 'Healthy bowl with quinoa, vegetables, and tahini dressing',
      prepTime: '25 min',
      difficulty: 'Easy',
      servings: 4,
      rating: 4.4,
      ingredients: [
        '1 cup quinoa',
        '2 cups vegetable broth',
        '1 cucumber, diced',
        '2 tomatoes, diced',
        '1/2 red onion, thinly sliced',
        '1/2 cup kalamata olives',
        '1/4 cup feta cheese, crumbled',
        '3 tbsp tahini',
        '2 tbsp lemon juice',
        '2 tbsp olive oil',
        'Fresh parsley and mint'
      ],
      instructions: [
        'Rinse quinoa and cook in vegetable broth until tender.',
        'Let quinoa cool to room temperature.',
        'Prepare vegetables and arrange in bowls.',
        'Whisk together tahini, lemon juice, and olive oil for dressing.',
        'Add cooked quinoa to bowls.',
        'Top with vegetables, olives, and feta cheese.',
        'Drizzle with tahini dressing.',
        'Garnish with fresh herbs and serve.'
      ]
    }
  ];

  // Select appropriate recipe pool based on cuisine
  let recipePool = [];
  if (cuisineNames.length > 0) {
    cuisineNames.forEach(cuisine => {
      if (recipeDatabase[cuisine]) {
        recipePool.push(...recipeDatabase[cuisine]);
      }
    });
  }
  
  // If no specific cuisine recipes found, use generic recipes
  if (recipePool.length === 0) {
    recipePool = genericRecipes;
  }

  // Generate unique recipes by cycling through the pool and adding variations
  return Array.from({ length: Math.min(10, recipePool.length * 2) }).map((_, i) => {
    const baseRecipe = recipePool[i % recipePool.length];
    const variation = Math.floor(i / recipePool.length);
    
    // Add slight variations for repeated recipes
    let recipe = { ...baseRecipe };
    if (variation > 0) {
      recipe.title = `${baseRecipe.title} (Variation ${variation + 1})`;
      recipe.prepTime = `${parseInt(baseRecipe.prepTime) + (variation * 5)} min`;
      recipe.difficulty = variation % 2 === 0 ? baseRecipe.difficulty : 
        (baseRecipe.difficulty === 'Easy' ? 'Medium' : 'Easy');
    }

    // Add user-specific tags
    recipe.tags = Array.from(new Set([
      ...tags, 
      recipe.difficulty.toLowerCase(),
      'homemade',
      userInput ? 'custom' : 'recommended'
    ])).slice(0, 5);

    return recipe;
  });
}

/**
 * Transcribes audio to text using OpenAI Whisper
 * @param {File} audioFile - The audio file to transcribe
 * @returns {Promise<string>} The transcribed text
 */
export async function transcribeAudio(audioFile) {
  try {
    ensureOpenAIConfigured();
    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    const response = await openai?.audio?.transcriptions?.create({
      model: 'whisper-1',
      file: audioFile,
      language: 'en', // Optional: specify language for better accuracy
    });

    return response?.text || '';
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(`Audio transcription failed: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Analyzes an image using OpenAI Vision API to extract recipe/cooking information
 * @param {string} imageBase64 - Base64 encoded image data
 * @param {string} imageType - MIME type of the image (e.g., 'image/jpeg')
 * @returns {Promise<string>} Analysis of the image content
 */
// Mock analysis for when API quota is exceeded
const getMockImageAnalysis = () => {
  const mockAnalyses = [
    "This appears to be a food image. I can see various ingredients that could be used to make a delicious meal. Try describing the ingredients you see or what kind of dish you'd like to make.",
    "I can see this is a food photo. For better assistance, please list the main ingredients you can identify in the image.",
    "This looks like a tasty dish! To help you better, could you describe what you see in the image or what kind of recipe you're looking for?"
  ];
  return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
};

export async function analyzeImage(imageBase64, imageType = 'image/jpeg') {
  try {
    // First try with OpenAI API if configured
    if (apiKey) {
      ensureOpenAIConfigured();
      if (!imageBase64) {
        throw new Error('No image data provided');
      }

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are Recipe AI, a smart cooking assistant. Take the user\'s input (ingredients, cuisine, dish name, question, or photo). Search your knowledge and generate helpful cooking output. If the input is a photo or unclear, guess the closest recipe and briefly explain what it is. Always vary outputs based on the input and avoid repeating defaults.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'Analyze this food-related image and extract concise cooking information: list visible ingredients if present; if it\'s a dish, describe it and infer likely ingredients; if it\'s a menu/recipe screenshot, summarize key items. Then suggest 1-2 likely recipe names to pursue next.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${imageType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        temperature: 0.8,
        max_tokens: 300,
      });

      return response?.choices?.[0]?.message?.content || 'Unable to analyze image';
    } else {
      // Fallback to mock response if no API key is configured
      return getMockImageAnalysis();
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // If it's a quota exceeded error, use mock response
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      console.log('API quota exceeded, falling back to mock response');
      return getMockImageAnalysis();
    }
    
    // For other errors, provide a user-friendly message
    return "I'm having trouble analyzing the image right now. Please try describing the image or ingredients in text instead.";
  }
}

/**
 * Generates recipe recommendations based on user input
 * @param {Object} params - Parameters for recipe generation
 * @param {string} params.userInput - User's input (ingredients, preferences, etc.)
 * @param {Array} params.selectedCuisines - Selected cuisine types
 * @param {Array} params.dietaryFilters - Selected dietary restrictions
 * @param {string} params.inputType - Type of input (text, voice, photo, etc.)
 * @returns {Promise<Array>} Array of recipe recommendations
 */
export async function generateRecipeRecommendations({
  userInput,
  selectedCuisines = [],
  dietaryFilters = [],
  inputType = 'text'
}) {
  try {
    // If no API key, return mock recipes immediately
    if (!apiKey) {
      return getMockRecipes({ userInput, selectedCuisines, dietaryFilters });
    }

    ensureOpenAIConfigured();
    if (!userInput) {
      // For better UX, when API is present but userInput is empty, still return mocks
      return getMockRecipes({ userInput, selectedCuisines, dietaryFilters });
    }

    const cuisineText = selectedCuisines?.length > 0 
      ? `focusing on ${selectedCuisines?.map(c => c?.name || c)?.join(', ')} cuisine(s)` 
      : '';
    
    const dietaryText = dietaryFilters?.length > 0 
      ? `with ${dietaryFilters?.map(f => f?.label || f)?.join(', ')} dietary requirements` 
      : '';

    const prompt = `Based on the user input: "${userInput}" ${cuisineText} ${dietaryText}, generate 10 UNIQUE and DIVERSE recipe recommendations. 

IMPORTANT REQUIREMENTS:
1. Each recipe must have COMPLETELY DIFFERENT ingredients and cooking methods
2. Vary cooking techniques: baking, frying, grilling, steaming, slow-cooking, etc.
3. Include different protein sources: chicken, beef, fish, vegetarian, vegan options
4. Vary complexity from simple 15-minute meals to elaborate dishes
5. Each recipe should reflect the specific user input and cuisine preferences
6. NO generic or repetitive recipes - make each one distinctive and authentic

For user input "${userInput}", consider:
- If it's ingredients: create recipes that prominently feature those ingredients
- If it's a dish name: provide authentic variations and related dishes
- If it's a cuisine: showcase diverse traditional dishes from that region
- If it's dietary needs: ensure all recipes meet those requirements

Return ONLY a JSON array with this exact structure:
[
  {
    "title": "Specific Recipe Name (not generic)",
    "description": "Detailed description highlighting unique ingredients and cooking method",
    "prepTime": "X min",
    "difficulty": "Easy|Medium|Hard",
    "servings": number,
    "rating": 4.0-5.0,
    "tags": ["specific", "relevant", "tags"],
    "ingredients": ["detailed ingredient with measurements", "specific ingredients for this dish"],
    "instructions": ["detailed step 1", "specific cooking instruction", "finishing touches"]
  }
]

Generate recipes that are authentic, practical, and distinctly different from each other.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are Recipe AI, a smart cooking assistant. Take the user\'s input (ingredients, cuisine name, dish name, or cooking question). Search your knowledge and generate relevant recipes that match the input. Always produce varied, practical recipes and avoid repeating the same default output. Respond in valid JSON only and conform to the provided schema.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'recipe_recommendations',
          schema: {
            type: 'object',
            properties: {
              recipes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    prepTime: { type: 'string' },
                    difficulty: { type: 'string' },
                    servings: { type: 'number' },
                    rating: { type: 'number' },
                    tags: { type: 'array', items: { type: 'string' } },
                    ingredients: { type: 'array', items: { type: 'string' } },
                    instructions: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['title', 'description', 'prepTime', 'difficulty', 'servings', 'rating', 'tags', 'ingredients', 'instructions'],
                  additionalProperties: false
                }
              }
            },
            required: ['recipes'],
            additionalProperties: false
          }
        }
      },
      temperature: 0.8,
      max_tokens: 2500,
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No response content received');
    }

    const result = JSON.parse(content);
    return result?.recipes || [];
  } catch (error) {
    console.error('Error generating recipe recommendations:', error);
    // Fallback gracefully on quota/network/unknown failures
    const msg = error?.message || '';
    const shouldFallback =
      msg.includes('quota') ||
      msg.includes('429') ||
      msg.includes('network') ||
      msg.includes('OpenAI API key not configured');
    if (shouldFallback) {
      return getMockRecipes({ userInput, selectedCuisines, dietaryFilters });
    }
    throw new Error(`Recipe generation failed: ${msg || 'Unknown error'}`);
  }
}

/**
 * Generates a detailed recipe with nutritional information
 * @param {Object} recipeBasic - Basic recipe information
 * @returns {Promise<Object>} Detailed recipe with nutrition data
 */
export async function generateDetailedRecipe(recipeBasic) {
  try {
    ensureOpenAIConfigured();
    if (!recipeBasic?.title) {
      throw new Error('Recipe title is required');
    }

    const prompt = `Generate AUTHENTIC and DETAILED information for this specific recipe: "${recipeBasic?.title}"
    
    Base description: ${recipeBasic?.description || 'No description provided'}
    
    IMPORTANT: Create a recipe that is SPECIFIC to "${recipeBasic?.title}" - not a generic template. Research the authentic ingredients, traditional cooking methods, and cultural context of this dish.

    Requirements:
    - Use AUTHENTIC ingredients specific to this dish (with exact measurements)
    - Include traditional cooking techniques and methods
    - Provide step-by-step instructions that reflect the actual cooking process
    - Calculate realistic nutritional information based on the specific ingredients
    - Give practical tips that are relevant to this particular dish
    - Suggest variations that are authentic to the cuisine/dish type
    - Provide appropriate storage instructions for this specific food type

    For "${recipeBasic?.title}":
    - Research the origin and traditional preparation method
    - Use ingredients that are actually used in this dish
    - Include cooking techniques specific to this recipe
    - Provide timing and temperature details appropriate for this dish
    - Consider dietary restrictions and authentic substitutions
    
    Return comprehensive details in valid JSON format only.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are Recipe AI, a smart cooking assistant. Take the user\'s input (ingredients, cuisine name, dish name, or question). Generate a relevant recipe that matches the input and varies per query. Output must be clear and home-cook friendly: Ingredients (include Metric and US measures where possible), Instructions (numbered, simple steps), and Nutrition per serving (Calories, Protein, Fat, Carbohydrates). Respond in valid JSON only and conform to the provided schema.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'detailed_recipe',
          schema: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              ingredients: { type: 'array', items: { type: 'string' } },
              instructions: { type: 'array', items: { type: 'string' } },
              nutrition: {
                type: 'object',
                properties: {
                  calories: { type: 'number' },
                  protein: { type: 'string' },
                  carbs: { type: 'string' },
                  fat: { type: 'string' },
                  fiber: { type: 'string' }
                },
                required: ['calories', 'protein', 'carbs', 'fat', 'fiber'],
                additionalProperties: false
              },
              cookingTips: { type: 'array', items: { type: 'string' } },
              variations: { type: 'array', items: { type: 'string' } },
              storageInstructions: { type: 'string' }
            },
            required: ['description', 'ingredients', 'instructions', 'nutrition', 'cookingTips', 'variations', 'storageInstructions'],
            additionalProperties: false
          }
        }
      },
      temperature: 0.85,
      max_tokens: 1000,
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No response content received');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating detailed recipe:', error);
    throw new Error(`Detailed recipe generation failed: ${error?.message || 'Unknown error'}`);
  }
}

export default openai;
