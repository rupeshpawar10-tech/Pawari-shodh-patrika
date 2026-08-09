import { PublicPageView } from './CmsContext';

export interface RouteMatch {
  view: PublicPageView;
  articleIdOrSlug: string | null;
  issueId: string | null;
  tab: string | null;
  bookId?: string | null;
  blogId?: string | null;
  isNotFound: boolean;
}

const DOMAIN_URL = 'https://pawari-shodh-patrika.vercel.app';

export function getCanonicalUrl(path = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${DOMAIN_URL}${cleanPath}`;
}

/**
 * Parse current window location pathname and search params into structured route match
 */
export function parseRouteFromUrl(): RouteMatch {
  try {
    const pathname = window.location.pathname.replace(/\/+/g, '/').toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    // Check query params / hash fallbacks first for legacy deep links
    const articleParam = searchParams.get('article') || searchParams.get('paper') || searchParams.get('id');
    if (articleParam) {
      return { view: 'article_detail', articleIdOrSlug: articleParam, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    const bookParam = searchParams.get('book') || searchParams.get('bookId') || searchParams.get('book_id');
    if (bookParam) {
      return { view: 'books_blogs', articleIdOrSlug: null, issueId: null, tab: 'books', bookId: bookParam, blogId: null, isNotFound: false };
    }

    const blogParam = searchParams.get('blog') || searchParams.get('blogId') || searchParams.get('blog_id');
    if (blogParam) {
      return { view: 'books_blogs', articleIdOrSlug: null, issueId: null, tab: 'blogs', bookId: null, blogId: blogParam, isNotFound: false };
    }

    if (hash.startsWith('#/article/')) {
      const targetId = hash.replace('#/article/', '').split('?')[0];
      if (targetId) return { view: 'article_detail', articleIdOrSlug: targetId, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (hash.startsWith('#/book/')) {
      const targetId = hash.replace('#/book/', '').split('?')[0];
      if (targetId) return { view: 'books_blogs', articleIdOrSlug: null, issueId: null, tab: 'books', bookId: targetId, blogId: null, isNotFound: false };
    }

    if (hash.startsWith('#/blog/')) {
      const targetId = hash.replace('#/blog/', '').split('?')[0];
      if (targetId) return { view: 'books_blogs', articleIdOrSlug: null, issueId: null, tab: 'blogs', bookId: null, blogId: targetId, isNotFound: false };
    }

    // Exact or prefix path matching
    if (pathname === '/' || pathname === '/home') {
      return { view: 'home', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/about' || pathname === '/about-us') {
      return { view: 'about', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/current-issue' || pathname === '/current') {
      return { view: 'current_issue', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/archives' || pathname === '/archive') {
      const issueId = searchParams.get('issue');
      return { view: 'archive', articleIdOrSlug: null, issueId, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname.startsWith('/issue/')) {
      const issueId = pathname.replace('/issue/', '').trim();
      return { view: 'archive', articleIdOrSlug: null, issueId: issueId || null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname.startsWith('/book/')) {
      const bookId = pathname.replace('/book/', '').trim();
      return { view: 'books_blogs', articleIdOrSlug: null, issueId: null, tab: 'books', bookId: bookId || null, blogId: null, isNotFound: false };
    }

    if (pathname.startsWith('/blog/')) {
      const blogId = pathname.replace('/blog/', '').trim();
      return { view: 'books_blogs', articleIdOrSlug: null, issueId: null, tab: 'blogs', bookId: null, blogId: blogId || null, isNotFound: false };
    }

    if (pathname === '/articles' || pathname === '/books-literature' || pathname === '/books-blogs') {
      const tab = searchParams.get('tab') || null;
      return { view: 'books_blogs', articleIdOrSlug: null, issueId: null, tab, bookId: bookParam || null, blogId: blogParam || null, isNotFound: false };
    }

    if (pathname === '/shabdkosh' || pathname === '/pawari-shabdkosh') {
      return { view: 'pawari_shabdkosh', articleIdOrSlug: null, issueId: null, tab: 'shabdkosh', bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/paheli' || pathname === '/pawari-paheli') {
      return { view: 'pawari_paheli', articleIdOrSlug: null, issueId: null, tab: 'paheli', bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/lokgeet' || pathname === '/pawari-lokgeet') {
      return { view: 'pawari_lokgeet', articleIdOrSlug: null, issueId: null, tab: 'lokgeet', bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/quiz' || pathname === '/pawari-quiz') {
      return { view: 'pawari_quiz', articleIdOrSlug: null, issueId: null, tab: 'quiz', bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname.startsWith('/article/')) {
      const slugOrId = pathname.replace('/article/', '').trim();
      if (slugOrId) {
        return { view: 'article_detail', articleIdOrSlug: slugOrId, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
      }
    }

    if (pathname === '/editorial-board' || pathname === '/editorial_board') {
      return { view: 'editorial_board', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/author-guidelines' || pathname === '/author_guidelines') {
      return { view: 'author_guidelines', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/submit-manuscript' || pathname === '/submit_manuscript') {
      return { view: 'submit_manuscript', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/contact' || pathname === '/contact-us') {
      return { view: 'contact', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname === '/author/articles/new' || pathname === '/author/articles/new/') {
      return { view: 'author_article_editor', articleIdOrSlug: 'new', issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    if (pathname.startsWith('/author/articles/') && (pathname.endsWith('/edit') || pathname.endsWith('/edit/'))) {
      const parts = pathname.split('/');
      // /author/articles/[id]/edit
      const artId = parts[3];
      if (artId) {
        return { view: 'author_article_editor', articleIdOrSlug: artId, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
      }
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      return { view: 'admin', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
    }

    // Unmatched path -> 404 Not Found
    return { view: 'home', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: true };
  } catch (e) {
    return { view: 'home', articleIdOrSlug: null, issueId: null, tab: null, bookId: null, blogId: null, isNotFound: false };
  }
}

/**
 * Generates clean canonical URL path for a view
 */
export function getUrlForView(
  view: PublicPageView, 
  articleIdOrSlug?: string | null, 
  issueId?: string | null,
  bookId?: string | null,
  blogId?: string | null
): string {
  if (bookId) return `/book/${bookId}`;
  if (blogId) return `/blog/${blogId}`;

  switch (view) {
    case 'home': return '/';
    case 'about': return '/about';
    case 'current_issue': return '/current-issue';
    case 'archive': return issueId ? `/issue/${issueId}` : '/archives';
    case 'articles':
    case 'books_blogs': return '/books-literature';
    case 'pawari_shabdkosh': return '/shabdkosh';
    case 'pawari_paheli': return '/paheli';
    case 'pawari_lokgeet': return '/lokgeet';
    case 'pawari_quiz': return '/quiz';
    case 'article_detail': return articleIdOrSlug ? `/article/${articleIdOrSlug}` : '/current-issue';
    case 'editorial_board': return '/editorial-board';
    case 'author_guidelines': return '/author-guidelines';
    case 'submit_manuscript': return '/submit-manuscript';
    case 'contact': return '/contact';
    case 'admin': return '/admin';
    case 'author_article_editor': return (!articleIdOrSlug || articleIdOrSlug === 'new') ? '/author/articles/new' : `/author/articles/${articleIdOrSlug}/edit`;
    default: return '/';
  }
}

/**
 * Programmatically updates window location using History API
 */
export function navigateTo(
  view: PublicPageView, 
  articleIdOrSlug?: string | null, 
  issueId?: string | null,
  bookId?: string | null,
  blogId?: string | null
) {
  const targetUrl = getUrlForView(view, articleIdOrSlug, issueId, bookId, blogId);
  if (window.location.pathname + window.location.search !== targetUrl) {
    window.history.pushState({ view, articleIdOrSlug, issueId, bookId, blogId }, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
  }
}
