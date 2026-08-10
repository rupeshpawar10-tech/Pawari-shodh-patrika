/**
 * Utility functions for generating, normalizing, and handling canonical slugs.
 */

export function createSlug(title: string, fallbackId: string = ''): string {
  if (!title || title.trim() === '') {
    return fallbackId ? `item-${fallbackId}` : `item-${Date.now()}`;
  }

  // Clean whitespace and special punctuation
  let slug = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F-]/g, '') // Keep alphanumeric, Devanagari, spaces, hyphens
    .replace(/[\s_]+/g, '-')              // Convert spaces and underscores to hyphens
    .replace(/-+/g, '-')                  // Collapse multiple consecutive hyphens
    .replace(/^-+|-+$/g, '');             // Trim leading/trailing hyphens

  if (!slug || slug.trim() === '') {
    slug = fallbackId ? `item-${fallbackId}` : `item-${Date.now()}`;
  }
  return slug;
}

export function ensureUniqueSlug<T extends { id: string; slug?: string }>(
  baseTitle: string,
  itemId: string,
  existingList: T[],
  currentSlugOverride?: string
): string {
  let baseSlug = (currentSlugOverride && currentSlugOverride.trim() !== '')
    ? createSlug(currentSlugOverride, itemId)
    : createSlug(baseTitle, itemId);

  let slug = baseSlug;
  let counter = 1;

  while (existingList.some(item => item.id !== itemId && item.slug === slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}
