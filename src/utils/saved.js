// Simple localStorage-based saved recipes utility
// Key: 'saved_recipes'

const STORAGE_KEY = 'saved_recipes';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to read saved recipes:', e);
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
    try {
      // Let any open views refresh immediately (same-tab updates)
      if (typeof window !== 'undefined' && window?.dispatchEvent) {
        window.dispatchEvent(new Event('saved_recipes_updated'));
      }
    } catch (_) {}
  } catch (e) {
    console.warn('Failed to write saved recipes:', e);
  }
}

function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60);
}

export function listSavedRecipes() {
  return readAll();
}

export function isSaved(recipe) {
  if (!recipe) return false;
  const list = readAll();
  return list.some(r => r.title === recipe.title);
}

export function saveRecipe(recipe) {
  if (!recipe || !recipe.title) return false;
  const list = readAll();
  if (list.some(r => r.title === recipe.title)) return true;
  const id = `${slugify(recipe.title)}-${Date.now()}`;
  const entry = {
    id,
    title: recipe.title,
    description: recipe.description || '',
    cuisine: recipe.cuisine || '',
    image: recipe.image || '',
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    nutrition: recipe.nutrition || null,
    savedAt: new Date().toISOString(),
    source: recipe.source || 'app'
  };
  writeAll([entry, ...list]);
  return true;
}

export function removeSavedByTitle(title) {
  const list = readAll();
  const next = list.filter(r => r.title !== title);
  writeAll(next);
  return next.length !== list.length;
}

export async function shareRecipe(recipe) {
  if (!recipe) return;
  const title = recipe.title || 'Recipe';
  const desc = recipe.description || '';
  const ingredients = (recipe.ingredients || []).join(', ');
  const steps = (recipe.instructions || []).map((s, i) => `${i + 1}. ${s}`).join('\n');
  const body = `${title}\n\n${desc}\n\nIngredients:\n${ingredients}\n\nSteps:\n${steps}`;

  try {
    if (navigator?.share) {
      await navigator.share({ title, text: body });
      return true;
    }
  } catch (e) {
    console.warn('navigator.share failed, falling back:', e);
  }

  const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  window.open(mailto, '_blank');
  return true;
}
