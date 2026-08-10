import { Article, JournalSettings } from '../types';
import { getCanonicalUrl, getUrlForView } from './router';

const DEFAULT_DOMAIN = 'https://pawari-shodh-patrika.vercel.app';

export function updateMetaTags(
  view: string,
  settings: JournalSettings,
  article?: Article | null,
  lang: 'hi' | 'en' = 'hi',
  isNotFound = false,
  itemDetails?: {
    title?: string;
    description?: string;
    image?: string;
    canonicalPath?: string;
  } | null
) {
  if (typeof document === 'undefined') return;

  // Set html lang attribute
  document.documentElement.lang = lang;

  const origin = typeof window !== 'undefined' && window.location && window.location.origin 
    ? window.location.origin 
    : DEFAULT_DOMAIN;

  const journalTitle = lang === 'hi' 
    ? (settings.journal_title_hindi || 'पवारी शोध पत्रिका') 
    : (settings.journal_title_english || 'Pawari Shodh Patrika');
  
  const subtitle = lang === 'hi' 
    ? settings.subtitle_hindi 
    : settings.subtitle_english;

  // 1. Remove old dynamic meta & citation tags
  const existingDynamic = document.querySelectorAll('meta[data-seo="true"], link[rel="canonical"], script[type="application/ld+json"][data-seo="true"]');
  existingDynamic.forEach(el => el.remove());

  const head = document.head;

  const addMeta = (nameOrProp: string, content: string, isProperty = false) => {
    if (!content) return;
    const meta = document.createElement('meta');
    meta.setAttribute(isProperty ? 'property' : 'name', nameOrProp);
    meta.setAttribute('content', content);
    meta.setAttribute('data-seo', 'true');
    head.appendChild(meta);
  };

  const addLink = (rel: string, href: string) => {
    if (!href) return;
    const link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    link.setAttribute('data-seo', 'true');
    head.appendChild(link);
  };

  const addJsonLd = (data: any) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo', 'true');
    script.textContent = JSON.stringify(data);
    head.appendChild(script);
  };

  // 404 Not Found Handling
  if (isNotFound || (view === 'article_detail' && !article)) {
    const notFoundTitle = lang === 'hi' 
      ? `404 - पृष्ठ या शोध पत्र उपलब्ध नहीं है | ${journalTitle}` 
      : `404 - Page or Article Not Found | ${journalTitle}`;
    document.title = notFoundTitle;
    addMeta('robots', 'noindex, nofollow');
    addMeta('prerender-status-code', '404');
    addMeta('http-status', '404');
    addMeta('description', lang === 'hi' 
      ? 'अनुरोधित पृष्ठ या शोध पत्र उपलब्ध नहीं है। कृपया शोध पत्रिका के मुख्य पृष्ठ या आर्काइव में खोजें।' 
      : 'The requested page or research article could not be found. Please search our published archives or homepage.');
    return;
  }

  // Admin route noindex
  if (view === 'admin' || view === 'author_article_editor') {
    document.title = `CMS Admin | ${journalTitle}`;
    addMeta('robots', 'noindex, nofollow');
    return;
  }

  // Helper for absolute image URLs
  const getAbsoluteUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return getCanonicalUrl(url);
  };

  // Handle Article Detail Page
  if (view === 'article_detail' && article) {
    const articleTitle = lang === 'hi' ? article.title_hindi || article.title_english : article.title_english || article.title_hindi;
    const abstract = lang === 'hi' ? article.abstract_hindi || article.abstract_english : article.abstract_english || article.abstract_hindi;
    const cleanAbstract = (abstract || '').replace(/[#*`_]/g, '').slice(0, 280).trim() + (abstract && abstract.length > 280 ? '...' : '');
    const pageUrl = getCanonicalUrl(getUrlForView('article_detail', article.slug || article.id));

    // Page Title
    document.title = `${articleTitle} | Vol. ${article.volume} Issue ${article.issue} (${article.year}) | ${journalTitle}`;

    // Standard SEO Tags
    addMeta('description', cleanAbstract);
    if (article.keywords && article.keywords.length > 0) {
      addMeta('keywords', article.keywords.join(', '));
    }
    addLink('canonical', pageUrl);

    // OpenGraph
    addMeta('og:title', articleTitle, true);
    addMeta('og:description', cleanAbstract, true);
    addMeta('og:type', 'article', true);
    addMeta('og:url', pageUrl, true);
    addMeta('og:site_name', journalTitle, true);
    if (settings.logo_url) addMeta('og:image', getAbsoluteUrl(settings.logo_url), true);

    // Twitter
    addMeta('twitter:card', 'summary_large_image');
    addMeta('twitter:title', articleTitle);
    addMeta('twitter:description', cleanAbstract);
    if (settings.logo_url) addMeta('twitter:image', getAbsoluteUrl(settings.logo_url));

    // --- Google Scholar Highwire Press Meta Tags ---
    addMeta('citation_title', articleTitle);

    const resolvedAuthors = (article.authors || []).map(a => {
      const authorObj = a as any;
      const resolvedName = authorObj.name || (lang === 'hi' ? authorObj.name_hindi || authorObj.name_english : authorObj.name_english || authorObj.name_hindi) || '';
      return {
        name: resolvedName.trim(),
        affiliation: (authorObj.affiliation || '').trim(),
        orcid: authorObj.orcid
      };
    }).filter(a => a.name.length > 0);

    resolvedAuthors.forEach(author => {
      addMeta('citation_author', author.name);
      if (author.affiliation) {
        addMeta('citation_author_institution', author.affiliation);
      }
    });

    const rawPubDate = article.date_published || `${article.year || new Date().getFullYear()}/06/01`;
    const pubDateFormatted = rawPubDate.replace(/-/g, '/');
    addMeta('citation_publication_date', pubDateFormatted);
    addMeta('citation_journal_title', journalTitle);
    if (article.volume) addMeta('citation_volume', String(article.volume));
    if (article.issue) addMeta('citation_issue', String(article.issue));
    
    if (article.doi) {
      addMeta('citation_doi', article.doi);
    }

    const validIssn = (settings.issn_online && settings.issn_online !== 'Applied For')
      ? settings.issn_online
      : (settings.issn_print && settings.issn_print !== 'Applied For' ? settings.issn_print : null);
    if (validIssn) {
      addMeta('citation_issn', validIssn);
    }

    if (article.language) {
      addMeta('citation_language', article.language.toLowerCase().startsWith('eng') ? 'en' : 'hi');
    }

    addMeta('citation_abstract_html_url', pageUrl);

    if (article.page_numbers) {
      const parts = article.page_numbers.split(/[-–—]/);
      if (parts[0] && parts[0].trim()) addMeta('citation_firstpage', parts[0].trim());
      if (parts[1] && parts[1].trim()) addMeta('citation_lastpage', parts[1].trim());
    }

    if (article.pdf_url) {
      addMeta('citation_pdf_url', getAbsoluteUrl(article.pdf_url));
    }

    if (article.keywords && article.keywords.length > 0) {
      addMeta('citation_keywords', article.keywords.join('; '));
    }

    // JSON-LD ScholarlyArticle Schema
    const structuredAuthors = resolvedAuthors.map(a => ({
      '@type': 'Person',
      'name': a.name,
      ...(a.affiliation ? { 'affiliation': { '@type': 'Organization', 'name': a.affiliation } } : {}),
      ...(a.orcid ? { 'sameAs': `https://orcid.org/${a.orcid}` } : {})
    }));

    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ScholarlyArticle',
      'headline': articleTitle,
      'name': articleTitle,
      'abstract': cleanAbstract,
      'inLanguage': article.language === 'English' ? 'en' : 'hi',
      'datePublished': pubDateFormatted.replace(/\//g, '-'),
      'author': structuredAuthors,
      'isPartOf': {
        '@type': 'PublicationIssue',
        'issueNumber': String(article.issue),
        'datePublished': String(article.year),
        'isPartOf': {
          '@type': 'Periodical',
          'name': journalTitle,
          'issn': [settings.issn_online, settings.issn_print].filter(i => i && i !== 'Applied For')
        }
      },
      'publisher': {
        '@type': 'Organization',
        'name': settings.publisher_english || 'Maa Tapti Research Institute, Multai'
      },
      'mainEntityOfPage': pageUrl,
      'url': pageUrl,
      ...(article.pdf_url ? {
        'encoding': {
          '@type': 'MediaObject',
          'contentUrl': getAbsoluteUrl(article.pdf_url),
          'encodingFormat': 'application/pdf'
        }
      } : {})
    });

    return;
  }

  // Public View Titles & Descriptions
  let pageTitle = `${journalTitle} (पवारी शोध पत्रिका) — Peer-Reviewed Research Journal`;
  let description = 'Pawari Shodh Patrika is a bilingual peer-reviewed research journal centered on Pawari language, literature, history, and regional dialects, folk traditions, tribal linguistics, and social heritage of Madhya Pradesh and neighboring regions.';
  let path = getUrlForView(view as any);

  switch (view) {
    case 'home':
      pageTitle = `${journalTitle} (पवारी शोध पत्रिका) — International Refereed Journal`;
      description = 'Official portal of Pawari Shodh Patrika, an international peer-reviewed refereed multidisciplinary journal published by Maa Tapti Research Institute, Multai.';
      break;
    case 'about':
      pageTitle = lang === 'hi' ? `पत्रिका परिचय एवं उद्देश्य | ${journalTitle}` : `About Journal & Scope | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका का परिचय, उद्देश्य, विषय क्षेत्र, सम्पादकीय नीतियां एवं ओपन एक्सेस दिशा-निर्देश।' : 'Learn about Pawari Shodh Patrika, its aims, scope, indexing status, open-access publication policies, and peer-review ethics.';
      break;
    case 'current_issue':
      pageTitle = lang === 'hi' ? `वर्तमान अंक एवं शोध पत्र | ${journalTitle}` : `Current Issue & Table of Contents | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका का नवीनतम प्रकाशित शोध अंक, विषय-सूची एवं समीक्षित शोध पत्र।' : 'Browse the latest published volume, current issue research articles, and table of contents of Pawari Shodh Patrika.';
      break;
    case 'archive':
      pageTitle = lang === 'hi' ? `शोध संग्रह एवं पुराने अंक | ${journalTitle}` : `Journal Archives & Past Volumes | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका के सभी प्रकाशित अंकों, वॉल्यूम और शोध पत्रों का पूर्ण डिजिटलाइज्ड आर्काइव।' : 'Explore the complete digital repository of past issues, published volumes, and peer-reviewed research papers in Pawari Shodh Patrika.';
      break;
    case 'articles':
    case 'books_blogs':
      pageTitle = lang === 'hi' ? `प्रकाशित शोध पत्र एवं साहित्य | ${journalTitle}` : `Published Research Papers & Literature | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका के अंतर्गत प्रकाशित शोध पत्र, शोध ग्रंथ एवं साहित्य संग्रह।' : 'Search and access open-access research articles, scholarly books, and cultural literature published in Pawari Shodh Patrika.';
      break;
    case 'editorial_board':
      pageTitle = lang === 'hi' ? `संपादकीय मण्डल एवं विषय विशेषज्ञ | ${journalTitle}` : `Editorial Board & Reviewers | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका के मुख्य संरक्षक, प्रधान संपादक, संपादकीय मण्डल एवं अंतरराष्ट्रीय विशेषज्ञ समीक्षा समिति।' : 'Meet the Editor-in-Chief, advisory board, patrons, and international peer review committee of Pawari Shodh Patrika.';
      break;
    case 'author_guidelines':
      pageTitle = lang === 'hi' ? `लेखक दिशानिर्देश एवं सबमिशन नियम | ${journalTitle}` : `Author Guidelines & Submission Rules | ${journalTitle}`;
      description = lang === 'hi' ? 'शोध पत्र प्रारूपण नियम, संदर्भ शैली, साहित्यिक चोरी रोकथाम नीति एवं समकक्ष समीक्षा प्रक्रिया।' : 'Manuscript preparation rules, citation style requirements, ethical policies, and submission guidelines for Pawari Shodh Patrika.';
      break;
    case 'submit_manuscript':
      pageTitle = lang === 'hi' ? `ऑनलाइन शोध पत्र सबमिशन | ${journalTitle}` : `Submit Manuscript Online | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका हेतु अपना शोध पत्र ऑनलाइन प्रस्तुत करें।' : 'Online paper submission portal for authors to submit research manuscripts for peer-reviewed publication.';
      break;
    case 'contact':
      pageTitle = lang === 'hi' ? `संपर्क एवं शोध पीठ | ${journalTitle}` : `Contact Editorial Office | ${journalTitle}`;
      description = lang === 'hi' ? 'माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.) - संपर्क सूत्र, ईमेल एवं सम्पादकीय कार्यालय विवरण।' : 'Contact details, publisher address, and editorial office location for Pawari Shodh Patrika at Maa Tapti Research Institute.';
      break;
    case 'pawari_writers':
      pageTitle = lang === 'hi' ? `पवारी लेखक एवं शोधकर्ता | ${journalTitle}` : `Pawari Writers & Scholars | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी भाषा, लोक-साहित्य और संस्कृति के प्रमुख लेखक, कवि और शोधकर्ताओं का परिचय।' : 'Profiles and bibliography of prominent Pawari language writers, poets, and researchers.';
      break;
    case 'pawari_shabdkosh':
      pageTitle = itemDetails?.title ? `${itemDetails.title} | Pawari Shabdkosh | ${journalTitle}` : `Pawari Shabdkosh (पवारी शब्दावली) | ${journalTitle}`;
      description = itemDetails?.description || 'Explore the comprehensive Pawari dialect dictionary and vocabulary database.';
      break;
    case 'pawari_paheli':
      pageTitle = itemDetails?.title ? `${itemDetails.title} | Pawari Paheli | ${journalTitle}` : `Pawari Riddles (पवारी पहेलियाँ) | ${journalTitle}`;
      description = itemDetails?.description || 'Collection of traditional Pawari folk riddles, culture, and linguistic puzzles.';
      break;
    case 'pawari_lokgeet':
      pageTitle = itemDetails?.title ? `${itemDetails.title} | Pawari Lokgeet | ${journalTitle}` : `Pawari Folk Songs (पवारी लोकगीत) | ${journalTitle}`;
      description = itemDetails?.description || 'Archive of traditional Pawari folk songs, oral literature, and cultural music lyrics.';
      break;
    case 'books_blogs':
      if (itemDetails?.title) {
        pageTitle = `${itemDetails.title} | ${journalTitle}`;
        description = itemDetails.description || description;
      } else {
        pageTitle = lang === 'hi' ? `ग्रंथ, ई-बुक्स, शोध लेख एवं समीक्षाएँ | ${journalTitle}` : `Books, Monographs, Scholarly Blogs & Reviews | ${journalTitle}`;
      }
      break;
    case 'pawari_quiz':
      pageTitle = `Pawari Heritage Quiz | ${journalTitle}`;
      description = 'Interactive quiz on Pawari language, culture, geography, and tribal heritage.';
      break;
    default:
      pageTitle = `${journalTitle} — ${subtitle || 'International Refereed Journal'}`;
      break;
  }

  const pageUrl = itemDetails?.canonicalPath ? getCanonicalUrl(itemDetails.canonicalPath) : getCanonicalUrl(path);

  document.title = pageTitle;
  addMeta('description', description);
  addLink('canonical', pageUrl);

  // OpenGraph
  addMeta('og:title', pageTitle, true);
  addMeta('og:description', description, true);
  addMeta('og:type', 'website', true);
  addMeta('og:url', pageUrl, true);
  addMeta('og:site_name', journalTitle, true);
  if (settings.logo_url) addMeta('og:image', getAbsoluteUrl(settings.logo_url), true);

  // Twitter
  addMeta('twitter:card', 'summary_large_image');
  addMeta('twitter:title', pageTitle);
  addMeta('twitter:description', description);
  if (settings.logo_url) addMeta('twitter:image', getAbsoluteUrl(settings.logo_url));

  // Breadcrumb items for JSON-LD Structured Data
  const breadcrumbList = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home',
      'item': getCanonicalUrl('/')
    }
  ];

  if (view !== 'home') {
    breadcrumbList.push({
      '@type': 'ListItem',
      'position': 2,
      'name': pageTitle.split('|')[0].trim(),
      'item': pageUrl
    });
  }

  // JSON-LD WebSite, Periodical & BreadcrumbList Schema
  addJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${getCanonicalUrl('/')}#website`,
        'url': getCanonicalUrl('/'),
        'name': journalTitle,
        'description': description,
        'inLanguage': ['hi', 'en'],
        'publisher': {
          '@type': 'Organization',
          'name': settings.publisher_english || 'Maa Tapti Research Institute, Multai',
          'email': settings.contact_email
        }
      },
      {
        '@type': 'Periodical',
        '@id': `${getCanonicalUrl('/')}#periodical`,
        'name': journalTitle,
        'alternateName': settings.journal_title_english,
        'issn': [settings.issn_online, settings.issn_print].filter(i => i && i !== 'Applied For'),
        'publisher': {
          '@type': 'Organization',
          'name': settings.publisher_english || 'Maa Tapti Research Institute, Multai'
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        'itemListElement': breadcrumbList
      }
    ]
  });
}
