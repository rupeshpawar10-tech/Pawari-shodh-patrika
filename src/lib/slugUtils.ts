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

import { 
  Article, 
  PawariLokgeetItem, 
  PawariShabdkoshItem, 
  PawariPaheliItem, 
  PawariWriterItem 
} from '../types';
import { BookItem, BlogItem } from '../data/booksBlogsData';

export function findArticle(articles: Article[], identifier: string | null): Article | null {
  if (!identifier) return null;
  let cleanId = identifier.trim().toLowerCase();
  try {
    cleanId = decodeURIComponent(cleanId).trim().toLowerCase();
  } catch (e) {}

  if (!cleanId) return null;
  
  // 1. Exact ID match (case-insensitive)
  let found = articles.find(a => a.id && a.id.toLowerCase() === cleanId);
  if (found) return found;

  // 2. Exact slug match
  found = articles.find(a => a.slug && a.slug.toLowerCase() === cleanId);
  if (found) return found;

  // 3. Normalized slugified title match
  const targetSlug = createSlug(cleanId);
  found = articles.find(a => {
    const slugHi = createSlug(a.title_hindi);
    const slugEn = createSlug(a.title_english);
    const slugStored = a.slug ? createSlug(a.slug) : '';
    return slugStored === targetSlug || slugHi === targetSlug || slugEn === targetSlug;
  });
  if (found) return found;

  // 4. Legacy slug mapping
  const legacyMap: Record<string, string> = {
    '1': articles[0]?.id || '',
    '2': articles[1]?.id || '',
    '3': articles[2]?.id || '',
    'art-1': articles[0]?.id || '',
    'art-2': articles[1]?.id || '',
    'vol-1-issue-1-art-1': articles[0]?.id || ''
  };
  if (legacyMap[cleanId]) {
    found = articles.find(a => a.id === legacyMap[cleanId]);
    if (found) return found;
  }

  // 5. Prefix search on ID or slug for long queries (>= 8 chars)
  if (cleanId.length >= 8) {
    found = articles.find(a => 
      (a.id && a.id.toLowerCase().startsWith(cleanId)) ||
      (a.slug && a.slug.toLowerCase().startsWith(cleanId))
    );
  }
  return found || null;
}

export function findLokgeet(lokgeetList: PawariLokgeetItem[], identifier: string | null): PawariLokgeetItem | null {
  if (!identifier || !lokgeetList || lokgeetList.length === 0) return null;
  let cleanId = identifier.trim().toLowerCase();
  try {
    cleanId = decodeURIComponent(cleanId).trim().toLowerCase();
  } catch (e) {}
  if (!cleanId) return null;

  // 1. Exact ID match
  let found = lokgeetList.find(l => l.id && l.id.toLowerCase() === cleanId);
  if (found) return found;

  // 2. Exact slug match
  found = lokgeetList.find(l => l.slug && l.slug.toLowerCase() === cleanId);
  if (found) return found;

  // 3. Slugified title match
  const targetSlug = createSlug(cleanId);
  found = lokgeetList.find(l => {
    const slugPawari = createSlug(l.title_pawari || (l as any).title || '');
    const slugHi = createSlug(l.title_hindi || '');
    const storedSlug = l.slug ? createSlug(l.slug) : '';
    return storedSlug === targetSlug || slugPawari === targetSlug || slugHi === targetSlug;
  });
  if (found) return found;

  // 4. Prefix or substring match for IDs like lokgeet-gopinath-1 or 1
  if (/^\d+$/.test(cleanId)) {
    const num = parseInt(cleanId, 10);
    if (num > 0 && num <= lokgeetList.length) {
      return lokgeetList[num - 1];
    }
  }

  return null;
}

export function findShabdkosh(shabdkoshList: PawariShabdkoshItem[], identifier: string | null): PawariShabdkoshItem | null {
  if (!identifier || !shabdkoshList || shabdkoshList.length === 0) return null;
  let cleanId = identifier.trim().toLowerCase();
  try {
    cleanId = decodeURIComponent(cleanId).trim().toLowerCase();
  } catch (e) {}
  if (!cleanId) return null;

  // 1. Exact ID
  let found = shabdkoshList.find(s => s.id && s.id.toLowerCase() === cleanId);
  if (found) return found;

  // 2. Exact Slug
  found = shabdkoshList.find(s => s.slug && s.slug.toLowerCase() === cleanId);
  if (found) return found;

  // 3. Word match (Devanagari word or English pronunciation)
  found = shabdkoshList.find(s => {
    const wordHi = s.word_pawari ? s.word_pawari.trim().toLowerCase() : '';
    const pron = s.pronunciation_hindi ? s.pronunciation_hindi.trim().toLowerCase() : '';
    const slugWord = createSlug(s.word_pawari);
    const targetSlug = createSlug(cleanId);
    return wordHi === cleanId || pron === cleanId || slugWord === targetSlug;
  });
  if (found) return found;

  // 4. Numeric index fallback
  if (/^\d+$/.test(cleanId)) {
    const num = parseInt(cleanId, 10);
    if (num > 0 && num <= shabdkoshList.length) {
      return shabdkoshList[num - 1];
    }
  }

  return null;
}

export function findPaheli(paheliList: PawariPaheliItem[], identifier: string | null): PawariPaheliItem | null {
  if (!identifier || !paheliList || paheliList.length === 0) return null;
  let cleanId = identifier.trim().toLowerCase();
  try {
    cleanId = decodeURIComponent(cleanId).trim().toLowerCase();
  } catch (e) {}
  if (!cleanId) return null;

  // 1. Exact ID
  let found = paheliList.find(p => p.id && p.id.toLowerCase() === cleanId);
  if (found) return found;

  // 2. Exact Slug
  found = paheliList.find(p => p.slug && p.slug.toLowerCase() === cleanId);
  if (found) return found;

  // 3. Slug match on riddle text
  const targetSlug = createSlug(cleanId);
  found = paheliList.find(p => {
    const rPawari = createSlug(p.riddle_pawari || (p as any).riddle_hindi || '');
    const ans = createSlug(p.answer_hindi || (p as any).answer || '');
    const storedSlug = p.slug ? createSlug(p.slug) : '';
    return storedSlug === targetSlug || rPawari === targetSlug || ans === targetSlug;
  });
  if (found) return found;

  // 4. Numeric index fallback
  if (/^\d+$/.test(cleanId)) {
    const num = parseInt(cleanId, 10);
    if (num > 0 && num <= paheliList.length) {
      return paheliList[num - 1];
    }
  }

  return null;
}

export function findBook(books: BookItem[], identifier: string | null): BookItem | null {
  if (!identifier || !books || books.length === 0) return null;
  let cleanId = identifier.trim().toLowerCase();
  try {
    cleanId = decodeURIComponent(cleanId).trim().toLowerCase();
  } catch (e) {}
  if (!cleanId) return null;

  // 1. Exact ID
  let found = books.find(b => b.id && b.id.toLowerCase() === cleanId);
  if (found) return found;

  // 2. Exact Slug
  found = books.find(b => b.slug && b.slug.toLowerCase() === cleanId);
  if (found) return found;

  // 3. Title slug match
  const targetSlug = createSlug(cleanId);
  found = books.find(b => {
    const slugHi = createSlug(b.title_hindi);
    const slugEn = createSlug(b.title_english);
    const stored = b.slug ? createSlug(b.slug) : '';
    return stored === targetSlug || slugHi === targetSlug || slugEn === targetSlug;
  });
  if (found) return found;

  return null;
}

export function findBlog(blogs: BlogItem[], identifier: string | null): BlogItem | null {
  if (!identifier || !blogs || blogs.length === 0) return null;
  let cleanId = identifier.trim().toLowerCase();
  try {
    cleanId = decodeURIComponent(cleanId).trim().toLowerCase();
  } catch (e) {}
  if (!cleanId) return null;

  // 1. Exact ID
  let found = blogs.find(b => b.id && b.id.toLowerCase() === cleanId);
  if (found) return found;

  // 2. Exact Slug
  found = blogs.find(b => b.slug && b.slug.toLowerCase() === cleanId);
  if (found) return found;

  // 3. Title slug match
  const targetSlug = createSlug(cleanId);
  found = blogs.find(b => {
    const slugHi = createSlug(b.title_hindi);
    const slugEn = createSlug(b.title_english);
    const stored = b.slug ? createSlug(b.slug) : '';
    return stored === targetSlug || slugHi === targetSlug || slugEn === targetSlug;
  });
  if (found) return found;

  return null;
}

export function findWriter(writers: PawariWriterItem[], identifier: string | null): PawariWriterItem | null {
  if (!identifier || !writers || writers.length === 0) return null;
  let cleanId = identifier.trim().toLowerCase();
  try {
    cleanId = decodeURIComponent(cleanId).trim().toLowerCase();
  } catch (e) {}
  if (!cleanId) return null;

  // 1. Exact ID
  let found = writers.find(w => w.id && w.id.toLowerCase() === cleanId);
  if (found) return found;

  // 2. Exact Slug
  found = writers.find(w => (w as any).slug && (w as any).slug.toLowerCase() === cleanId);
  if (found) return found;

  // 3. Name slug match
  const targetSlug = createSlug(cleanId);
  found = writers.find(w => {
    const slugHi = createSlug(w.name_hindi);
    const slugEn = createSlug(w.name_english);
    return slugHi === targetSlug || slugEn === targetSlug;
  });
  if (found) return found;

  return null;
}

export function ensureUniqueSlug(
  title: string, 
  fallbackId: string = '', 
  itemsListOrSlugs: Array<{ id: string; slug?: string }> | string[] = [], 
  currentSlug: string = ''
): string {
  let baseSlug = createSlug(title, fallbackId);
  let uniqueSlug = baseSlug;
  let counter = 1;

  let existingSlugs: string[] = [];
  if (Array.isArray(itemsListOrSlugs)) {
    if (itemsListOrSlugs.length > 0 && typeof itemsListOrSlugs[0] === 'string') {
      existingSlugs = itemsListOrSlugs as string[];
    } else {
      existingSlugs = (itemsListOrSlugs as Array<{ id: string; slug?: string }>)
        .filter(item => item.id !== fallbackId)
        .map(item => item.slug)
        .filter(Boolean) as string[];
    }
  }

  if (currentSlug) {
    existingSlugs = existingSlugs.filter(s => s !== currentSlug);
  }

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

