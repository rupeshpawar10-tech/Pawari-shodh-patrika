import React, { useState, useRef, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { fileBlobManager } from '../../lib/fileBlobManager';
import { SafeImage } from '../common/SafeImage';
import { SAMPLE_BOOKS, SAMPLE_BLOGS, SAMPLE_WRITERS, BookItem, BlogItem } from '../../data/booksBlogsData';
import { PawariWriterItem, Article } from '../../types';
import { downloadPdf } from '../../lib/pdfUtils';
import { PawariCulturalSection } from './PawariCulturalSection';
import { PublicContributionModal } from './PublicContributionModal';
import { BlogDetailOnPage } from './BlogDetailOnPage';
import { BookDetailOnPage } from './BookDetailOnPage';
import { SahityaHubView } from '../sahitya/SahityaHubView';
import { ShabdkoshView } from '../sahitya/ShabdkoshView';
import { PaheliView } from '../sahitya/PaheliView';
import { LokgeetView } from '../sahitya/LokgeetView';
import { BooksLibraryView } from '../sahitya/BooksLibraryView';
import { ReviewsView } from '../sahitya/ReviewsView';
import { QuizView } from '../sahitya/QuizView';
import { 
  BookOpen, 
  Search, 
  Book, 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Share2, 
  Download, 
  Eye, 
  Heart, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowRight,
  Bookmark,
  HelpCircle,
  Music,
  Award,
  Upload,
  Plus,
  Send,
  Check,
  FileUp,
  Image as ImageIcon,
  AlertCircle,
  PenTool,
  Link2,
  Globe,
  Copy,
  UserCheck,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

interface BooksBlogsViewProps {
  initialTab?: 'all' | 'books' | 'blogs' | 'writers' | 'reviews' | 'research_papers' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz';
}

export const BooksBlogsView: React.FC<BooksBlogsViewProps> = ({ initialTab = 'all' }) => {
  const { 
    lang, 
    articles, 
    books: cmsBooks, 
    blogs: cmsBlogs, 
    writers: cmsWriters,
    lokgeetList = [],
    quizQuestions = [],
    paheliList = [],
    shabdkoshList = [],
    saveBook, 
    saveBlog, 
    submitPublicContribution, 
    uploadFileToStorage, 
    logActivity, 
    setActiveView,
    selectedBookId,
    setSelectedBookId,
    selectedBlogId,
    setSelectedBlogId
  } = useCms();

  const rawBooks = (cmsBooks && cmsBooks.length > 0) ? cmsBooks : SAMPLE_BOOKS;
  const rawBlogs = (cmsBlogs && cmsBlogs.length > 0) ? cmsBlogs : SAMPLE_BLOGS;
  const rawWriters = (cmsWriters && cmsWriters.length > 0) ? cmsWriters : SAMPLE_WRITERS;

  const booksList = rawBooks.filter(b => b.status === 'approved' || b.status === 'published' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_')));
  const blogsList = rawBlogs.filter(b => b.status === 'approved' || b.status === 'published' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_')));
  const writersList = rawWriters.filter(w => w.status === 'approved' || w.status === 'published' || (!w.status));

  const approvedLokgeetCount = (lokgeetList && lokgeetList.length > 0) 
    ? lokgeetList.filter(l => l.status === 'approved' || l.status === 'published' || (!l.status && !l.id.startsWith('contrib_'))).length 
    : 24;

  const approvedShabdkoshCount = (shabdkoshList && shabdkoshList.length > 0)
    ? shabdkoshList.filter(s => s.status === 'approved' || s.status === 'published' || (!s.status && !s.id.startsWith('contrib_'))).length
    : 120;

  const approvedPaheliCount = (paheliList && paheliList.length > 0)
    ? paheliList.filter(p => p.status === 'approved' || p.status === 'published' || (!p.status && !p.id.startsWith('contrib_'))).length
    : 35;

  const quizCount = (quizQuestions && quizQuestions.length > 0) ? quizQuestions.length : 12;

  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'blogs' | 'writers' | 'reviews' | 'research_papers' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
  const [selectedWriter, setSelectedWriter] = useState<PawariWriterItem | null>(null);
  const [isContribModalOpen, setIsContribModalOpen] = useState(false);
  const [contribDefaultTab, setContribDefaultTab] = useState<'books' | 'blogs' | 'writers' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'cultural_quizzes' | 'reviews'>('books');
  const [likedBlogs, setLikedBlogs] = useState<Record<string, number>>({});
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Auto open from context/URL
  React.useEffect(() => {
    if (selectedBookId) {
      const found = booksList.find(b => b.id === selectedBookId);
      if (found) {
        setSelectedBook(found);
        setActiveTab('books');
      }
    }
  }, [selectedBookId, booksList]);

  React.useEffect(() => {
    if (selectedBlogId) {
      const found = blogsList.find(b => b.id === selectedBlogId);
      if (found) {
        setSelectedBlog(found);
        setActiveTab('blogs');
      }
    }
  }, [selectedBlogId, blogsList]);

  const handleCopyDirectLink = (e: React.MouseEvent, type: 'book' | 'blog', id: string) => {
    e.stopPropagation();
    const directUrl = `${window.location.origin}/${type}/${id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(directUrl).then(() => {
        setCopiedLinkId(`${type}-${id}`);
        setTimeout(() => setCopiedLinkId(null), 2500);
      }).catch(() => {
        prompt(lang === 'hi' ? 'डायरेक्ट पेज लिंक कॉपी करें:' : 'Copy direct page link:', directUrl);
      });
    } else {
      prompt(lang === 'hi' ? 'डायरेक्ट पेज लिंक कॉपी करें:' : 'Copy direct page link:', directUrl);
    }
  };

  const handleOpenAttachedItem = (item: { type: string; url?: string; targetId?: string }) => {
    if (item.type === 'book' && item.targetId) {
      const targetBook = booksList.find(b => b.id === item.targetId);
      if (targetBook) {
        setSelectedBook(targetBook);
        if (setSelectedBookId) setSelectedBookId(targetBook.id);
        return;
      }
    }
    if (item.type === 'blog' && item.targetId) {
      const targetBlog = blogsList.find(b => b.id === item.targetId);
      if (targetBlog) {
        setSelectedBlog(targetBlog);
        if (setSelectedBlogId) setSelectedBlogId(targetBlog.id);
        return;
      }
    }
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  // Publication Submission Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTab, setPublishTab] = useState<'book' | 'review' | 'blog'>('book');

  const [subForm, setSubForm] = useState({
    authorName: '',
    authorRole: '',
    email: '',
    phone: '',
    titleHindi: '',
    titleEnglish: '',
    category: 'भाषाविज्ञान एवं लोकसाहित्य',
    reviewedBookDetails: '',
    publisher: 'पावारी शोध संस्थान प्रकाशन',
    isbn: '',
    pages: '150',
    content: '',
    tags: 'पवारी, लोकसाहित्य, शोध',
    coverImageUrl: '',
    pdfUrl: ''
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);
  const [submitRefNo, setSubmitRefNo] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleOpenPublishModal = (tab: 'book' | 'review' | 'blog' = 'book') => {
    setPublishTab(tab);
    setSubmitRefNo(null);
    setIsPublishModalOpen(true);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.authorName.trim() || !subForm.titleHindi.trim() || !subForm.content.trim()) {
      alert(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें (लेखक का नाम, शीर्षक एवं विवरण)' : 'Please fill all required fields (Author name, title & details)');
      return;
    }

    setIsSubmittingPublish(true);

    try {
      let coverUrl = subForm.coverImageUrl.trim();
      let pdfUrl = subForm.pdfUrl.trim();

      if (coverFile) {
        try {
          const res = await uploadFileToStorage(coverFile, 'covers');
          coverUrl = res.url;
        } catch (e) {
          coverUrl = await readFileAsDataUrl(coverFile);
        }
      }

      if (pdfFile) {
        try {
          const res = await uploadFileToStorage(pdfFile, 'manuscripts');
          pdfUrl = res.url;
        } catch (e) {
          pdfUrl = fileBlobManager.registerBlob('file_' + Date.now(), pdfFile);
        }
      }

      const generatedId = 'pub_' + Date.now();
      const generatedRefNo = 'PUB-' + Math.floor(100000 + Math.random() * 900000);

      if (publishTab === 'book') {
        const newBook: BookItem & { status?: 'pending' | 'approved' | 'rejected'; contributor_name?: string } = {
          id: generatedId,
          title_hindi: subForm.titleHindi,
          title_english: subForm.titleEnglish || subForm.titleHindi,
          authors: subForm.authorName + (subForm.authorRole ? ` (${subForm.authorRole})` : ''),
          publisher: subForm.publisher || 'पावारी शोध संस्थान प्रकाशन',
          publication_year: new Date().getFullYear().toString(),
          pages: parseInt(subForm.pages) || 120,
          isbn: subForm.isbn || ('978-93-' + Math.floor(100000 + Math.random() * 900000) + '-0'),
          category: subForm.category,
          cover_image: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
          synopsis_hindi: subForm.content,
          synopsis_english: subForm.content,
          price: 'Open Access / निःशुल्क',
          sample_pdf_url: pdfUrl || undefined,
          status: 'pending',
          contributor_name: subForm.authorName
        };
        await submitPublicContribution('books', newBook);
      } else if (publishTab === 'review') {
        const newReview: BlogItem & { status?: 'pending' | 'approved' | 'rejected'; contributor_name?: string } = {
          id: generatedId,
          title_hindi: `पुस्तक समीक्षा: ${subForm.titleHindi}`,
          title_english: `Book Review: ${subForm.titleEnglish || subForm.titleHindi}`,
          author: subForm.authorName,
          author_role: subForm.authorRole || 'विद्वान समीक्षक',
          date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          read_time: '6 मिनट',
          category: 'पुस्तक समीक्षा',
          cover_image: coverUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
          excerpt_hindi: `समीक्षित पुस्तक/कृति: ${subForm.reviewedBookDetails || subForm.titleHindi}\n${subForm.content.slice(0, 150)}...`,
          excerpt_english: subForm.content.slice(0, 150),
          content_hindi: `### समीक्षित पुस्तक विवरण\n**पुस्तक एवं लेखक:** ${subForm.reviewedBookDetails || subForm.titleHindi}\n\n### समीक्षा आलेख\n${subForm.content}\n\n### समीक्षक परिचय\n**नाम:** ${subForm.authorName}\n**संबद्धता:** ${subForm.authorRole || 'शोधार्थी / समीक्षक'}`,
          content_english: subForm.content,
          tags: ['पुस्तक_समीक्षा', 'साहित्य', 'पवारी_शोध'],
          likes_count: 0,
          pdf_url: pdfUrl || undefined,
          status: 'pending',
          contributor_name: subForm.authorName
        };
        await submitPublicContribution('blogs', newReview);
      } else {
        const newBlog: BlogItem & { status?: 'pending' | 'approved' | 'rejected'; contributor_name?: string } = {
          id: generatedId,
          title_hindi: subForm.titleHindi,
          title_english: subForm.titleEnglish || subForm.titleHindi,
          author: subForm.authorName,
          author_role: subForm.authorRole || 'लेखक एवं शोधकर्ता',
          date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          read_time: '5 मिनट',
          category: subForm.category || 'लोकसंस्कृति',
          cover_image: coverUrl || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
          excerpt_hindi: subForm.content.slice(0, 160) + '...',
          excerpt_english: subForm.content.slice(0, 160),
          content_hindi: subForm.content,
          content_english: subForm.content,
          tags: subForm.tags ? subForm.tags.split(',').map(t => t.trim()) : ['पवारी', 'ब्लॉग', 'लोकसंस्कृति'],
          likes_count: 0,
          pdf_url: pdfUrl || undefined,
          status: 'pending',
          contributor_name: subForm.authorName
        };
        await submitPublicContribution('blogs', newBlog);
      }

      setSubmitRefNo(generatedRefNo);
      setIsSubmittingPublish(false);
    } catch (err) {
      console.error(err);
      setIsSubmittingPublish(false);
      alert(lang === 'hi' ? 'जमा करने में त्रुटि आई। कृपया पुनः प्रयास करें।' : 'Error submitting form. Please try again.');
    }
  };

  const handleResetPublishForm = () => {
    setSubForm({
      authorName: '',
      authorRole: '',
      email: '',
      phone: '',
      titleHindi: '',
      titleEnglish: '',
      category: 'भाषाविज्ञान एवं लोकसाहित्य',
      reviewedBookDetails: '',
      publisher: 'पावारी शोध संस्थान प्रकाशन',
      isbn: '',
      pages: '150',
      content: '',
      tags: 'पवारी, लोकसाहित्य, शोध',
      coverImageUrl: '',
      pdfUrl: ''
    });
    setCoverFile(null);
    setPdfFile(null);
    setSubmitRefNo(null);
    setIsPublishModalOpen(false);
  };

  // Published research papers from CMS with deduplication
  const publishedArticles = useMemo(() => {
    const map = new Map<string, Article>();
    articles.forEach(a => {
      if (a && a.id && (!a.status || ['published', 'accepted', 'approved'].includes(a.status.toLowerCase()))) {
        if (!map.has(a.id)) {
          map.set(a.id, a);
        }
      }
    });
    return Array.from(map.values());
  }, [articles]);

  // Filtered books
  const filteredBooks = booksList.filter(book => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = book.title_hindi.toLowerCase().includes(q) || 
                          book.title_english.toLowerCase().includes(q) || 
                          book.authors.toLowerCase().includes(q) ||
                          book.isbn.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered blogs
  const filteredBlogs = blogsList.filter(blog => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = blog.title_hindi.toLowerCase().includes(q) || 
                          blog.title_english.toLowerCase().includes(q) || 
                          blog.author.toLowerCase().includes(q) ||
                          (blog.tags && blog.tags.some(t => t.toLowerCase().includes(q)));
    
    let matchesCategory = true;
    if (activeTab === 'reviews') {
      matchesCategory = blog.category === 'पुस्तक समीक्षा';
    } else if (selectedCategory !== 'all') {
      matchesCategory = blog.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  // Filtered writers
  const filteredWriters = writersList.filter(writer => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return writer.name_hindi.toLowerCase().includes(q) ||
           writer.name_english.toLowerCase().includes(q) ||
           writer.designation.toLowerCase().includes(q) ||
           writer.region.toLowerCase().includes(q) ||
           (writer.specialization && writer.specialization.some(s => s.toLowerCase().includes(q)));
  });

  const handleLikeBlog = (e: React.MouseEvent, blogId: string, initialLikes: number = 0) => {
    e.stopPropagation();
    setLikedBlogs(prev => ({
      ...prev,
      [blogId]: (prev[blogId] || initialLikes) + 1
    }));
  };

  if (selectedBlog) {
    return (
      <BlogDetailOnPage
        blog={selectedBlog}
        allBlogs={blogsList}
        onBack={() => {
          setSelectedBlog(null);
          if (setSelectedBlogId) setSelectedBlogId(null);
          window.history.pushState({}, '', '/reviews');
        }}
        onSelectBlog={(b) => {
          setSelectedBlog(b);
          if (setSelectedBlogId) setSelectedBlogId(b.id);
          window.history.pushState({}, '', `/blog/${b.id}`);
        }}
        onOpenAttachedItem={handleOpenAttachedItem}
        onLikeBlog={handleLikeBlog}
        likedCount={likedBlogs[selectedBlog.id]}
        lang={lang}
      />
    );
  }

  if (selectedBook) {
    return (
      <BookDetailOnPage
        book={selectedBook}
        allBooks={booksList}
        onBack={() => {
          setSelectedBook(null);
          if (setSelectedBookId) setSelectedBookId(null);
          window.history.pushState({}, '', '/books');
        }}
        onSelectBook={(b) => {
          setSelectedBook(b);
          if (setSelectedBookId) setSelectedBookId(b.id);
          window.history.pushState({}, '', `/book/${b.id}`);
        }}
        onOpenAttachedItem={handleOpenAttachedItem}
        lang={lang}
      />
    );
  }

  const handleNavigateSection = (sec: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => {
    if (sec === 'hub') {
      window.history.pushState({}, '', '/sahitya');
      setActiveTab('all');
    } else if (sec === 'shabdkosh') {
      window.history.pushState({}, '', '/pawari-shabdkosh');
      setActiveTab('shabdkosh');
    } else if (sec === 'paheli') {
      window.history.pushState({}, '', '/pawari-paheli');
      setActiveTab('paheli');
    } else if (sec === 'lokgeet') {
      window.history.pushState({}, '', '/pawari-lokgeet');
      setActiveTab('lokgeet');
    } else if (sec === 'books') {
      window.history.pushState({}, '', '/books');
      setActiveTab('books');
    } else if (sec === 'reviews') {
      window.history.pushState({}, '', '/reviews');
      setActiveTab('reviews');
    } else if (sec === 'quiz') {
      window.history.pushState({}, '', '/quiz');
      setActiveTab('quiz');
    }
  };

  return (
    <div className="w-full">
      {activeTab === 'all' && (
        <SahityaHubView
          onNavigateSection={handleNavigateSection}
          onOpenContributeModal={() => {
            setContribDefaultTab('books');
            setIsContribModalOpen(true);
          }}
        />
      )}

      {activeTab === 'shabdkosh' && (
        <ShabdkoshView
          onNavigateSection={handleNavigateSection}
          onOpenContributeModal={() => {
            setContribDefaultTab('shabdkosh');
            setIsContribModalOpen(true);
          }}
        />
      )}

      {activeTab === 'paheli' && (
        <PaheliView
          onNavigateSection={handleNavigateSection}
          onOpenContributeModal={() => {
            setContribDefaultTab('paheli');
            setIsContribModalOpen(true);
          }}
        />
      )}

      {activeTab === 'lokgeet' && (
        <LokgeetView
          onNavigateSection={handleNavigateSection}
          onOpenContributeModal={() => {
            setContribDefaultTab('lokgeet');
            setIsContribModalOpen(true);
          }}
        />
      )}

      {activeTab === 'books' && (
        <BooksLibraryView
          onNavigateSection={handleNavigateSection}
          onOpenBookDetail={(b) => {
            setSelectedBook(b);
            if (setSelectedBookId) setSelectedBookId(b.id);
            window.history.pushState({}, '', `/book/${b.id}`);
          }}
          onOpenContributeModal={() => {
            setContribDefaultTab('books');
            setIsContribModalOpen(true);
          }}
        />
      )}

      {(activeTab === 'reviews' || activeTab === 'blogs') && (
        <ReviewsView
          onNavigateSection={handleNavigateSection}
          onOpenBlogDetail={(b) => {
            setSelectedBlog(b);
            if (setSelectedBlogId) setSelectedBlogId(b.id);
            window.history.pushState({}, '', `/blog/${b.id}`);
          }}
          onOpenContributeModal={() => {
            setContribDefaultTab('reviews');
            setIsContribModalOpen(true);
          }}
        />
      )}

      {activeTab === 'quiz' && (
        <QuizView
          onNavigateSection={handleNavigateSection}
          onOpenContributeModal={() => {
            setContribDefaultTab('cultural_quizzes');
            setIsContribModalOpen(true);
          }}
        />
      )}

      {activeTab === 'writers' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                {lang === 'hi' ? 'पवारी भाषा एवं साहित्यकार संदर्भ' : 'Pawari Writers & Scholars Directory'}
              </h2>
              <p className="text-xs text-stone-500">
                {lang === 'hi' ? 'पवारी भाषा एवं साहित्य के मूर्धन्य रचनाकार एवं शोधकर्ता' : 'Eminent authors and folklorists of Pawari language'}
              </p>
            </div>
            <button
              onClick={() => handleNavigateSection('hub')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
            >
              ← {lang === 'hi' ? 'साहित्य हब पर लौटें' : 'Back to Hub'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writersList.map((writer) => (
              <div
                key={writer.id}
                onClick={() => {
                  setSelectedWriter(writer);
                  if (setActiveView) setActiveView('pawari_writers');
                }}
                className="bg-white border border-stone-200/90 hover:border-amber-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-amber-200">
                    <SafeImage
                      src={writer.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                      alt={writer.name_hindi}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-bold border border-amber-200">
                      {writer.location_hindi || writer.region || 'मध्य भारत'}
                    </span>
                    <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-red-950 transition truncate mt-1">
                      {writer.name_hindi}
                    </h3>
                    <p className="text-xs text-stone-500 truncate">
                      {writer.designation_hindi || writer.designation || 'पवारी साहित्यकार'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {writer.bio_hindi || writer.bio_english || 'पवारी भाषा व साहित्य के मूर्धन्य रचनाकार।'}
                </p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
                  <span>{lang === 'hi' ? 'प्रोफाइल देखें →' : 'View Profile →'}</span>
                  {writer.books_count && (
                    <span className="font-mono text-[11px] text-stone-500">
                      📚 {writer.books_count} कृतियाँ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy hidden */}
      {false && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* ---------------- HERO BANNER & LITERATURE HUB HEADER ---------------- */}
      <div className="bg-gradient-to-br from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-500/30 space-y-6 relative overflow-hidden">
        {/* Background Decorative Gradient Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-amber-500/15 via-amber-500/5 to-transparent pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-1/3 h-1/2 bg-radial from-red-800/20 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top Bar with Badge & Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs uppercase tracking-wider shadow-xs">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hi' ? 'पुस्तकालय, साहित्य एवं सांस्कृतिक मंच' : 'Library, Literature & Cultural Hub'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setContribDefaultTab('books');
                  setIsContribModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all cursor-pointer transform hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4 text-red-950" />
                <span>{lang === 'hi' ? 'सार्वजनिक योगदान फॉर्म' : 'Community Submission'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenPublishModal('book')}
                className="px-3.5 py-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-amber-200 border border-amber-400/30 font-bold text-xs sm:text-sm shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <FileUp className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'प्रकाशन प्रस्ताव' : 'Publish Proposal'}</span>
              </button>
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 leading-tight">
              {lang === 'hi' ? 'पवारी साहित्य, शोध ग्रंथ, साहित्यकार एवं वैचारिक ब्लॉग' : 'Pawari Literature, Research Books, Writers & Scholarly Blogs'}
            </h1>

            <p className="text-xs sm:text-sm text-amber-200/90 max-w-3xl leading-relaxed">
              {lang === 'hi'
                ? 'पवारी शोध पत्रिका तथा माँ ताप्ती शोध संस्थान द्वारा प्रकाशित प्रामाणिक शोध ग्रंथ, शब्दकोश, लोकसाहित्य पुस्तकें, लेखक प्रोफाइल, समीक्षाएं एवं विद्वत शोध आलेख।'
                : 'Authentic research monographs, dictionaries, folklore literature books, writer profiles, critical reviews, and academic research articles published by Pawari Shodh Patrika & MTRI.'}
            </p>
          </div>

          {/* Quick Metrics & Summary Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-2">
            <div 
              onClick={() => setActiveTab('books')}
              className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center space-x-2.5 text-xs ${
                activeTab === 'books' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-black/25 hover:bg-black/40 border-amber-500/20 text-amber-100'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 font-bold shrink-0">
                <Book className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold block text-sm sm:text-base text-amber-300">{booksList.length}</span>
                <span className="text-[11px] text-amber-200/80 truncate block">{lang === 'hi' ? 'शोध ग्रंथ' : 'Books'}</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('blogs')}
              className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center space-x-2.5 text-xs ${
                activeTab === 'blogs' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-black/25 hover:bg-black/40 border-amber-500/20 text-amber-100'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 font-bold shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold block text-sm sm:text-base text-amber-300">{blogsList.length}</span>
                <span className="text-[11px] text-amber-200/80 truncate block">{lang === 'hi' ? 'वैचारिक ब्लॉग' : 'Blogs'}</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('writers')}
              className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center space-x-2.5 text-xs ${
                activeTab === 'writers' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-black/25 hover:bg-black/40 border-amber-500/20 text-amber-100'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 font-bold shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold block text-sm sm:text-base text-amber-300">{writersList.length}</span>
                <span className="text-[11px] text-amber-200/80 truncate block">{lang === 'hi' ? 'साहित्यकार' : 'Writers'}</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('research_papers')}
              className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center space-x-2.5 text-xs ${
                activeTab === 'research_papers' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-black/25 hover:bg-black/40 border-amber-500/20 text-amber-100'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 font-bold shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold block text-sm sm:text-base text-amber-300">{publishedArticles.length}</span>
                <span className="text-[11px] text-amber-200/80 truncate block">{lang === 'hi' ? 'शोध पत्र' : 'Papers'}</span>
              </div>
            </div>

            {/* DIRECT LOKGEET PILL */}
            <div 
              onClick={() => setActiveTab('lokgeet')}
              className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center space-x-2.5 text-xs ${
                activeTab === 'lokgeet' ? 'bg-amber-500/30 border-amber-300 text-amber-100 ring-2 ring-amber-400/50' : 'bg-gradient-to-br from-amber-950/40 to-black/30 hover:bg-amber-950/60 border-amber-500/40 text-amber-100 shadow-sm'
              }`}
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-600/30 text-amber-300 font-bold shrink-0 border border-amber-400/30">
                <Music className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <span className="font-black block text-sm sm:text-base text-amber-300">{approvedLokgeetCount}</span>
                <span className="text-[11px] text-amber-200 font-semibold truncate block">{lang === 'hi' ? '🎵 लोकगीत' : 'Lokgeet'}</span>
              </div>
            </div>

            {/* DIRECT QUIZ PILL */}
            <div 
              onClick={() => setActiveTab('quiz')}
              className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center space-x-2.5 text-xs ${
                activeTab === 'quiz' ? 'bg-amber-500/30 border-amber-300 text-amber-100 ring-2 ring-amber-400/50' : 'bg-gradient-to-br from-amber-950/40 to-black/30 hover:bg-amber-950/60 border-amber-500/40 text-amber-100 shadow-sm'
              }`}
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-600/30 text-amber-300 font-bold shrink-0 border border-amber-400/30">
                <Award className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <span className="font-black block text-sm sm:text-base text-amber-300">{quizCount}+</span>
                <span className="text-[11px] text-amber-200 font-semibold truncate block">{lang === 'hi' ? '🏆 क्विज़ व प्रमाण' : 'Quiz & Cert'}</span>
              </div>
            </div>

            {/* SHABDKOSH & PAHELI PILL */}
            <div 
              onClick={() => setActiveTab('shabdkosh')}
              className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center space-x-2.5 text-xs col-span-2 sm:col-span-1 ${
                activeTab === 'shabdkosh' || activeTab === 'paheli' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-black/25 hover:bg-black/40 border-amber-500/20 text-amber-100'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 font-bold shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold block text-sm sm:text-base text-amber-300">{approvedShabdkoshCount + approvedPaheliCount}</span>
                <span className="text-[11px] text-amber-200/80 truncate block">{lang === 'hi' ? 'शब्द व पहेली' : 'Glossary'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- NAVIGATION TABS (ARRANGED & FULLY VISIBLE) ---------------- */}
        <div className="relative z-10 pt-4 border-t border-amber-500/25 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 uppercase tracking-wider font-bold">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'सभी अनुभाग (All Categories & Sections):' : 'All Sections & Categories:'}</span>
            </div>
            <div className="text-[11px] text-amber-200/80 font-sans">
              {lang === 'hi' ? 'किसी भी अनुभाग पर क्लिक कर तुरंत देखें' : 'Click any section to view content'}
            </div>
          </div>

          {/* Group 1: मुख्य साहित्य एवं शोध ग्रंथ (Literature & Research) */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-amber-300/80 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'साहित्य, शोध एवं समीक्षाएं:' : 'Literature & Research:'}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 min-h-[38px] cursor-pointer shadow-xs ${
                  activeTab === 'all' 
                    ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-red-950 shadow-md ring-2 ring-amber-300 font-black' 
                    : 'bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-500/30 hover:border-amber-400/50'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-300 group-hover:text-amber-200" />
                <span>{lang === 'hi' ? 'सभी सामग्री (All)' : 'All Items'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('books')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 min-h-[38px] cursor-pointer shadow-xs ${
                  activeTab === 'books' 
                    ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-red-950 shadow-md ring-2 ring-amber-300 font-black' 
                    : 'bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-500/30 hover:border-amber-400/50'
                }`}
              >
                <Book className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? '📚 पुस्तकें व ग्रंथ' : 'Books'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'books' ? 'bg-red-950 text-amber-200' : 'bg-red-950/70 text-amber-200 border border-amber-500/30'
                }`}>
                  {booksList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('blogs')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 min-h-[38px] cursor-pointer shadow-xs ${
                  activeTab === 'blogs' 
                    ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-red-950 shadow-md ring-2 ring-amber-300 font-black' 
                    : 'bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-500/30 hover:border-amber-400/50'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? '✍️ ब्लॉग व आलेख' : 'Blogs'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'blogs' ? 'bg-red-950 text-amber-200' : 'bg-red-950/70 text-amber-200 border border-amber-500/30'
                }`}>
                  {blogsList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('writers')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 min-h-[38px] cursor-pointer shadow-xs ${
                  activeTab === 'writers' 
                    ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-red-950 shadow-md ring-2 ring-amber-300 font-black' 
                    : 'bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-500/30 hover:border-amber-400/50'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? '🖋️ साहित्यकार' : 'Writers'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'writers' ? 'bg-red-950 text-amber-200' : 'bg-red-950/70 text-amber-200 border border-amber-500/30'
                }`}>
                  {writersList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 min-h-[38px] cursor-pointer shadow-xs ${
                  activeTab === 'reviews' 
                    ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-red-950 shadow-md ring-2 ring-amber-300 font-black' 
                    : 'bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-500/30 hover:border-amber-400/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? '📑 समीक्षाएं' : 'Reviews'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('research_papers')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 min-h-[38px] cursor-pointer shadow-xs ${
                  activeTab === 'research_papers' 
                    ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-red-950 shadow-md ring-2 ring-amber-300 font-black' 
                    : 'bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-500/30 hover:border-amber-400/50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? '📄 शोध पत्र' : 'Papers'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'research_papers' ? 'bg-red-950 text-amber-200' : 'bg-red-950/70 text-amber-200 border border-amber-500/30'
                }`}>
                  {publishedArticles.length}
                </span>
              </button>
            </div>
          </div>

          {/* Group 2: लोकसंस्कृति, लोकगीत एवं क्विज़ केंद्र (Folk Culture, Songs & Quiz) */}
          <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
            <div className="text-[11px] font-semibold text-amber-300/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'पवारी लोकसंस्कृति, लोकगीत एवं क्विज़ केंद्र:' : 'Pawari Folk Culture & Heritage:'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* LOKGEET TAB */}
              <button
                type="button"
                onClick={() => setActiveTab('lokgeet')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 shrink-0 min-h-[38px] cursor-pointer shadow-md ${
                  activeTab === 'lokgeet' 
                    ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-red-950 shadow-xl ring-2 ring-amber-200 font-black' 
                    : 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 hover:from-amber-900 hover:to-slate-800 text-amber-200 border border-amber-400/50'
                }`}
              >
                <Music className={`w-4 h-4 ${activeTab === 'lokgeet' ? 'text-red-950' : 'text-amber-300'}`} />
                <span>{lang === 'hi' ? '🎵 पवारी लोकगीत संग्रह' : 'Pawari Folk Songs'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'lokgeet' ? 'bg-red-950 text-amber-200' : 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                }`}>
                  {approvedLokgeetCount}
                </span>
              </button>

              {/* CULTURE QUIZ TAB */}
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 shrink-0 min-h-[38px] cursor-pointer shadow-md ${
                  activeTab === 'quiz' 
                    ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-red-950 shadow-xl ring-2 ring-amber-200 font-black' 
                    : 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 hover:from-amber-900 hover:to-slate-800 text-amber-200 border border-amber-400/50'
                }`}
              >
                <Award className={`w-4 h-4 ${activeTab === 'quiz' ? 'text-red-950' : 'text-amber-300'}`} />
                <span>{lang === 'hi' ? '🏆 संस्कृति क्विज़ व प्रमाण-पत्र' : 'Culture Quiz & Certificate'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'quiz' ? 'bg-red-950 text-amber-200' : 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 animate-pulse'
                }`}>
                  Live
                </span>
              </button>

              {/* SHABDKOSH TAB */}
              <button
                type="button"
                onClick={() => setActiveTab('shabdkosh')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 min-h-[38px] cursor-pointer shadow-xs ${
                  activeTab === 'shabdkosh' 
                    ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-red-950 shadow-md ring-2 ring-amber-300 font-black' 
                    : 'bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-500/30 hover:border-amber-400/50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? '📖 शब्दकोश' : 'Shabdkosh'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'shabdkosh' ? 'bg-red-950 text-amber-200' : 'bg-red-950/70 text-amber-200 border border-amber-500/30'
                }`}>
                  {approvedShabdkoshCount}+
                </span>
              </button>

              {/* PAHELI TAB */}
              <button
                type="button"
                onClick={() => setActiveTab('paheli')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 min-h-[38px] cursor-pointer shadow-xs ${
                  activeTab === 'paheli' 
                    ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-red-950 shadow-md ring-2 ring-amber-300 font-black' 
                    : 'bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-500/30 hover:border-amber-400/50'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? '🧩 पारम्परिक पहेलियाँ' : 'Pawari Riddles'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'paheli' ? 'bg-red-950 text-amber-200' : 'bg-red-950/70 text-amber-200 border border-amber-500/30'
                }`}>
                  {approvedPaheliCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- SEARCH & FILTER BAR (For Books, Blogs, Reviews, Writers, Papers) ---------------- */}
      {(activeTab === 'all' || activeTab === 'books' || activeTab === 'blogs' || activeTab === 'reviews' || activeTab === 'writers' || activeTab === 'research_papers') && (
        <div className="bg-white border border-amber-900/15 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-800/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'hi' 
                    ? 'पुस्तक शीर्षक, लेखक, ब्लॉग विषय या कीवर्ड द्वारा खोजें...' 
                    : 'Search by book title, author, blog topic, or keywords...'
                }
                className="w-full pl-10 pr-10 py-2.5 bg-amber-50/40 text-slate-900 text-xs sm:text-sm rounded-xl border border-amber-300/70 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <div className="w-full sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 bg-amber-50/40 border border-amber-300/70 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              >
                <option value="all">{lang === 'hi' ? 'सभी श्रेणियां (All Categories)' : 'All Categories'}</option>
                <option value="भाषाविज्ञान एवं लोकसाहित्य">भाषाविज्ञान एवं लोकसाहित्य</option>
                <option value="संस्कृति एवं मानविकी">संस्कृति एवं मानविकी</option>
                <option value="कोष ग्रंथ (Lexicography)">कोष ग्रंथ (Lexicography)</option>
                <option value="मौखिक साहित्य">मौखिक साहित्य</option>
                <option value="भाषाविज्ञान">भाषाविज्ञान (Blog)</option>
                <option value="लोकसंस्कृति">लोकसंस्कृति (Blog)</option>
                <option value="डिजिटल मानविकी">डिजिटल मानविकी (Blog)</option>
                <option value="पुस्तक समीक्षा">पुस्तक समीक्षा</option>
              </select>
            </div>
          </div>

          {/* Quick Active Filter Indicator */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-xs">
              <span className="text-slate-600">
                {lang === 'hi' ? 'सक्रिय फ़िल्टर के साथ परिणाम:' : 'Filtered results:'}
                <strong className="text-red-950 ml-1.5 font-mono">
                  {filteredBooks.length} Books • {filteredBlogs.length} Blogs • {filteredWriters.length} Writers
                </strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-red-900 font-bold hover:underline cursor-pointer"
              >
                {lang === 'hi' ? 'फ़िल्टर हटाएं ×' : 'Reset Filters ×'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------- CULTURAL MODULES TAB VIEW (Shabdkosh, Paheli, Lokgeet, Quiz) ---------------- */}
      {(activeTab === 'shabdkosh' || activeTab === 'paheli' || activeTab === 'lokgeet' || activeTab === 'quiz') && (
        <section className="space-y-4">
          <PawariCulturalSection key={activeTab} initialTab={activeTab} />
        </section>
      )}

      {/* ---------------- CONTENT SECTION 1: BOOKS & RESEARCH MONOGRAPHS (PRIMARY) ---------------- */}
      {(activeTab === 'all' || activeTab === 'books') && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-amber-900/15 pb-3 gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-red-950">
                <Book className="w-5 h-5 text-red-900" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950">
                  {lang === 'hi' ? 'प्रकाशित शोध ग्रंथ एवं संदर्भ पुस्तकें' : 'Published Books & Research Monographs'}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {lang === 'hi' ? 'प्रामाणिक संदर्भ ग्रंथ, शब्दकोश एवं शोध मोनोग्राफ' : 'Peer-reviewed monographs and authentic reference books'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-3 py-1 bg-amber-100/80 text-amber-950 rounded-full font-bold border border-amber-300">
                {filteredBooks.length} {lang === 'hi' ? 'ग्रंथ उपलब्ध' : 'Books'}
              </span>
              <button
                type="button"
                onClick={() => handleOpenPublishModal('book')}
                className="px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-amber-200 font-bold text-xs shadow-xs flex items-center space-x-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'पुस्तक जोड़ें' : 'Add Book'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBooks.map((book) => (
              <div 
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  if (setSelectedBookId) setSelectedBookId(book.id);
                }}
                className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-3xl p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="flex gap-4 sm:gap-5 items-start">
                  {/* Book Cover Image */}
                  <div className="w-28 sm:w-36 aspect-3/4 max-h-48 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-slate-900 shadow-md group-hover:scale-[1.03] transition duration-200">
                    <SafeImage 
                      src={book.cover_image} 
                      alt={book.title_english} 
                      loading="lazy"
                      decoding="async"
                      width={144}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Book Metadata */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="bg-amber-100 text-amber-950 font-bold px-2.5 py-0.5 rounded-md border border-amber-300/60">
                        {book.category}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        {book.publication_year}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 group-hover:text-red-950 leading-snug transition">
                      {lang === 'hi' ? book.title_hindi : book.title_english}
                    </h3>

                    <p className="text-xs font-bold text-red-900">
                      ✍️ {book.authors}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-amber-50/30 p-2 rounded-xl border border-amber-100/60">
                      {lang === 'hi' ? book.synopsis_hindi : book.synopsis_english}
                    </p>

                    <div className="text-[11px] font-mono text-slate-500 pt-0.5 flex flex-wrap gap-2">
                      <span>ISBN: <strong>{book.isbn}</strong></span>
                      <span>•</span>
                      <span>{book.pages} Pages</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs gap-2">
                  <span className="text-amber-900 font-bold font-mono text-[11px] truncate max-w-[130px] sm:max-w-[180px]">
                    🏛️ {book.publisher}
                  </span>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleCopyDirectLink(e, 'book', book.id)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer"
                      title={lang === 'hi' ? 'डायरेक्ट पेज लिंक कॉपी करें' : 'Copy Direct Page Link'}
                    >
                      <Link2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>{copiedLinkId === `book-${book.id}` ? (lang === 'hi' ? 'कॉपी हुआ ✓' : 'Copied ✓') : (lang === 'hi' ? 'लिंक' : 'Link')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(book);
                        if (setSelectedBookId) setSelectedBookId(book.id);
                      }}
                      className="px-3.5 py-1.5 bg-red-950 hover:bg-red-900 text-amber-200 font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <span>{lang === 'hi' ? 'ग्रंथ विवरण पढ़ें' : 'Read Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- CONTENT SECTION 2: ACADEMIC BLOGS & ARTICLES ---------------- */}
      {(activeTab === 'all' || activeTab === 'blogs' || activeTab === 'reviews') && (
        <section className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between border-b border-amber-900/15 pb-3 gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-red-950">
                <FileText className="w-5 h-5 text-red-900" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950">
                  {activeTab === 'reviews' 
                    ? (lang === 'hi' ? 'साहित्यिक समीक्षाएं एवं समालोचना' : 'Literary & Book Reviews')
                    : (lang === 'hi' ? 'वैचारिक ब्लॉग एवं साहित्यिक आलेख' : 'Scholarly Blogs & Cultural Essays')}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {lang === 'hi' ? 'शोधार्थियों एवं विद्वानों के नवीनतम आलेख एवं समीक्षाएं' : 'Scholarly articles and critical essays by researchers'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-3 py-1 bg-amber-100/80 text-amber-950 rounded-full font-bold border border-amber-300">
                {filteredBlogs.length} {lang === 'hi' ? 'आलेख उपलब्ध' : 'Articles'}
              </span>
              <button
                type="button"
                onClick={() => handleOpenPublishModal('blog')}
                className="px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-amber-200 font-bold text-xs shadow-xs flex items-center space-x-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'ब्लॉग लिखें' : 'Write Blog'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog.id}
                onClick={() => {
                  setSelectedBlog(blog);
                  if (setSelectedBlogId) setSelectedBlogId(blog.id);
                }}
                className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Blog Cover Banner */}
                  <div className="w-full h-44 overflow-hidden relative bg-slate-900">
                    <SafeImage 
                      src={blog.cover_image} 
                      alt={blog.title_english} 
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={176}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-red-950/90 text-amber-300 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider backdrop-blur-xs border border-amber-500/30">
                      {blog.category}
                    </div>
                  </div>

                  {/* Blog Body */}
                  <div className="p-5 space-y-3">
                    
                    {/* Author & Date Bar */}
                    <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border-2 border-amber-400 shrink-0">
                        <SafeImage 
                          src={blog.author_avatar || ''} 
                          alt={blog.author} 
                          loading="lazy"
                          decoding="async"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-xs truncate">{blog.author}</p>
                        <p className="text-[10px] text-slate-500 truncate">{blog.author_role}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-[11px] text-amber-900 font-semibold shrink-0">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>{blog.read_time}</span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 group-hover:text-red-950 leading-snug transition">
                      {lang === 'hi' ? blog.title_hindi : blog.title_english}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {lang === 'hi' ? blog.excerpt_hindi : blog.excerpt_english}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {blog.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-mono font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 text-[11px] font-medium">{blog.date}</span>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => handleCopyDirectLink(e, 'blog', blog.id)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold rounded-lg transition flex items-center space-x-1 cursor-pointer"
                      title={lang === 'hi' ? 'डायरेक्ट पेज लिंक कॉपी करें' : 'Copy Direct Page Link'}
                    >
                      <Link2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>{copiedLinkId === `blog-${blog.id}` ? (lang === 'hi' ? 'कॉपी ✓' : 'Copied ✓') : (lang === 'hi' ? 'लिंक' : 'Link')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleLikeBlog(e, blog.id, blog.likes_count)}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer text-xs"
                      title="Like Post"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{likedBlogs[blog.id] || blog.likes_count || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBlog(blog);
                        if (setSelectedBlogId) setSelectedBlogId(blog.id);
                      }}
                      className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-red-950 font-bold rounded-xl transition flex items-center space-x-1 cursor-pointer shadow-2xs"
                    >
                      <span>{lang === 'hi' ? 'पूरा लेख पढ़ें' : 'Read Article'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-red-950" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- CONTENT SECTION 3: PAWARI WRITERS & AUTHORS ---------------- */}
      {(activeTab === 'all' || activeTab === 'writers') && (
        <section className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between border-b border-amber-900/15 pb-3 gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-red-950">
                <UserCheck className="w-5 h-5 text-red-900" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950">
                  {lang === 'hi' ? 'पवारी भाषा एवं मध्य भारत के साहित्यकार' : 'Pawari Language & Cultural Writers'}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {lang === 'hi' ? 'पवारी साहित्य व संस्कृति को समृद्ध करने वाले लेखक एवं रचनाकार' : 'Authors, poets, and researchers enriching Pawari literature'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-3 py-1 bg-amber-100/80 text-amber-950 rounded-full font-bold border border-amber-300">
                {filteredWriters.length} {lang === 'hi' ? 'साहित्यकार' : 'Writers'}
              </span>

              <button
                type="button"
                onClick={() => {
                  setContribDefaultTab('writers');
                  setIsContribModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-amber-200 font-serif font-bold text-xs shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'hi' ? 'साहित्यकार प्रोफाइल फॉर्म' : 'Writer Profile Form'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredWriters.map((writer) => {
              const writerIdentifier = writer.slug || writer.id;
              const writerProfileUrl = typeof window !== 'undefined' ? `${window.location.origin}/writer/${writerIdentifier}` : `/writer/${writerIdentifier}`;

              return (
                <div 
                  key={writer.id}
                  onClick={() => setActiveView('writer_profile', null, null, null, null, writerIdentifier)}
                  className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-3xl p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3.5">
                      <div className="relative shrink-0">
                        <SafeImage 
                          src={writer.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                          alt={writer.name_hindi}
                          loading="lazy"
                          decoding="async"
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/60 shadow-xs group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold truncate border border-amber-300/50">
                            {writer.location_hindi || writer.region || 'मध्य भारत'}
                          </span>
                        </div>
                        <h3 className="text-base font-serif font-bold text-red-950 group-hover:text-amber-700 transition truncate mt-1">
                          {writer.name_hindi}
                        </h3>
                        <p className="text-xs font-sans text-slate-600 font-medium truncate">
                          {writer.designation_hindi || writer.designation || writer.designation_english || 'पवारी साहित्यकार'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-3 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/80">
                      {writer.bio_hindi || writer.biography_hindi || writer.bio_english || 'पवारी भाषा व साहित्य के मूर्धन्य रचनाकार।'}
                    </p>

                    {/* Specialization tags */}
                    {writer.specialization && writer.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {writer.specialization.slice(0, 3).map((spec, sIdx) => (
                          <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                            #{spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800 group-hover:text-amber-900 flex items-center space-x-1">
                      <span>{lang === 'hi' ? 'संपूर्ण प्रोफाइल देखें' : 'View Full Profile'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-amber-600" />
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(writerProfileUrl);
                            setCopiedLinkId(`writer-${writer.id}`);
                            setTimeout(() => setCopiedLinkId(null), 2000);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 transition"
                        title={lang === 'hi' ? 'प्रोफाइल URL कॉपी करें' : 'Copy Profile URL'}
                      >
                        {copiedLinkId === `writer-${writer.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5 text-amber-800" />
                        )}
                      </button>

                      {writer.books_count && writer.books_count > 0 ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-amber-200 font-bold">
                          📚 {writer.books_count}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- CONTENT SECTION 4: RESEARCH PAPERS (PEER-REVIEWED) ---------------- */}
      {(activeTab === 'all' || activeTab === 'research_papers') && (
        <section className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between border-b border-amber-900/15 pb-3 gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-red-950">
                <BookOpen className="w-5 h-5 text-red-900" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950">
                  {lang === 'hi' ? 'प्रकाशित शोध पत्र संग्रह' : 'Published Peer-Reviewed Research Papers'}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {lang === 'hi' ? 'पवारी शोध पत्रिका (ISSN 2394-5230) के प्रकाशित पीयर-रिव्यूड आलेख' : 'Peer-reviewed research articles published in Pawari Shodh Patrika'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('articles')}
              className="px-3.5 py-1.5 bg-red-950 hover:bg-red-900 text-amber-200 text-xs font-bold rounded-xl transition flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <span>{lang === 'hi' ? 'सभी शोध पत्र देखें →' : 'View All Papers →'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedArticles.slice(0, 4).map(art => (
              <div 
                key={art.id}
                onClick={() => setActiveView('articles')}
                className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition cursor-pointer space-y-2.5 group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="bg-red-100 text-red-950 font-bold px-2 py-0.5 rounded text-[10px]">
                    {art.category}
                  </span>
                  <span className="text-slate-500 font-semibold">Vol {art.volume}, Issue {art.issue} ({art.year})</span>
                </div>

                <h3 className="font-serif font-bold text-slate-900 group-hover:text-red-950 text-sm sm:text-base leading-snug transition">
                  {lang === 'hi' ? art.title_hindi : art.title_english}
                </h3>

                <p className="text-xs font-semibold text-slate-700">
                  ✍️ {art.authors.map(a => a.name).join('; ')}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
                  <span className="text-red-900 font-bold group-hover:underline flex items-center space-x-1">
                    <span>{lang === 'hi' ? 'पूर्ण शोध पत्र पढ़ें' : 'Read Abstract'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">DOI: {art.doi || '10.5281/zenodo'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- CONTENT SECTION 4: PAWARI CULTURAL SHOWCASE (LOKGEET, QUIZ, SHABDKOSH, PAHELI) ---------------- */}
      {activeTab === 'all' && (
        <section className="space-y-6 pt-6 border-t border-amber-900/20">
          {/* Section Heading */}
          <div className="flex flex-wrap items-center justify-between border-b border-amber-900/15 pb-3 gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-red-950 shadow-md">
                <Sparkles className="w-5 h-5 text-red-950" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 flex items-center gap-2">
                  <span>{lang === 'hi' ? 'पवारी लोकसंस्कृति, लोकगीत एवं क्विज़ केंद्र' : 'Pawari Folk Culture, Lokgeet & Quiz Center'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-red-900 border border-amber-500/40 font-mono font-bold hidden sm:inline-block">
                    Live Heritage
                  </span>
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {lang === 'hi' ? 'पारम्परिक पवारी लोकगीत, संस्कृति क्विज़, शब्दकोश एवं पहेलियों का समृद्ध डिजिटल संग्रह' : 'Rich digital archive of authentic folk songs, interactive quizzes, dictionary & folklore riddles'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => setActiveTab('lokgeet')} 
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-red-950 border border-amber-500/40 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Music className="w-3.5 h-3.5 text-amber-700" />
                <span>{lang === 'hi' ? '🎵 लोकगीत संग्रह' : 'Lokgeet'}</span>
              </button>
              <button 
                onClick={() => setActiveTab('quiz')} 
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-red-950 border border-amber-500/40 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>{lang === 'hi' ? '🏆 संस्कृति क्विज़' : 'Quiz'}</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Gateway Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Lokgeet */}
            <div 
              onClick={() => setActiveTab('lokgeet')}
              className="bg-gradient-to-br from-amber-950 via-slate-900 to-black text-amber-100 p-5 rounded-2xl border-2 border-amber-600/40 hover:border-amber-400 shadow-xl cursor-pointer transition transform hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 group-hover:scale-110 transition-transform">
                    <Music className="w-5 h-5 text-amber-300" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    {approvedLokgeetCount} लोकगीत
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300 transition-colors">
                  {lang === 'hi' ? 'पवारी लोकगीत संग्रह' : 'Pawari Folk Songs'}
                </h3>
                <p className="text-xs text-amber-100/70 mt-1.5 line-clamp-2">
                  {lang === 'hi' ? 'विवाह, भांवर, हल्दी, फाग, भजन व पारम्परिक गीतों के बोल, भावार्थ एवं ऑडियो।' : 'Traditional wedding, bhajan, faag & seasonal folk lyrics with Hindi meanings.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>{lang === 'hi' ? 'गीत सुनें व पढ़ें' : 'Listen & Read'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Quiz */}
            <div 
              onClick={() => setActiveTab('quiz')}
              className="bg-gradient-to-br from-red-950 via-slate-900 to-black text-amber-100 p-5 rounded-2xl border-2 border-amber-600/40 hover:border-amber-400 shadow-xl cursor-pointer transition transform hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5 text-amber-300" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 animate-pulse">
                    Live Test
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300 transition-colors">
                  {lang === 'hi' ? 'संस्कृति क्विज़ व प्रमाण-पत्र' : 'Culture Quiz & Cert'}
                </h3>
                <p className="text-xs text-amber-100/70 mt-1.5 line-clamp-2">
                  {lang === 'hi' ? 'पवारी भाषा एवं संस्कृति ज्ञान की ऑनलाइन परीक्षा दें और आकर्षक ई-प्रमाण-पत्र पाएं।' : 'Test your cultural knowledge with interactive MCQs and earn verified e-certificates.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>{lang === 'hi' ? 'क्विज़ प्रारंभ करें' : 'Start Quiz'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Shabdkosh */}
            <div 
              onClick={() => setActiveTab('shabdkosh')}
              className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-amber-100 p-5 rounded-2xl border-2 border-amber-600/30 hover:border-amber-400 shadow-xl cursor-pointer transition transform hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5 text-amber-300" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    {approvedShabdkoshCount}+ शब्द
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300 transition-colors">
                  {lang === 'hi' ? 'पवारी-हिंदी शब्दकोश' : 'Pawari Dictionary'}
                </h3>
                <p className="text-xs text-amber-100/70 mt-1.5 line-clamp-2">
                  {lang === 'hi' ? 'दैनिक जीवन, कृषि, रिश्ते व संस्कृति के पारंपरिक शब्दों के प्रामाणिक अर्थ।' : 'Comprehensive lexicon of dialectical vocabulary with pronunciation and examples.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>{lang === 'hi' ? 'शब्द खोजें' : 'Search Words'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Paheli */}
            <div 
              onClick={() => setActiveTab('paheli')}
              className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-amber-100 p-5 rounded-2xl border-2 border-amber-600/30 hover:border-amber-400 shadow-xl cursor-pointer transition transform hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-5 h-5 text-amber-300" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    {approvedPaheliCount} पहेलियाँ
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-amber-200 group-hover:text-amber-300 transition-colors">
                  {lang === 'hi' ? 'पारम्परिक पहेलियाँ (पाहलोड़ी)' : 'Pawari Riddles'}
                </h3>
                <p className="text-xs text-amber-100/70 mt-1.5 line-clamp-2">
                  {lang === 'hi' ? 'ग्रामीण लोक जीवन की रोचक बुझौवलें एवं मनोरंजक पहेलियाँ।' : 'Traditional folklore riddles and cultural brainteasers with interactive answers.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>{lang === 'hi' ? 'पहेली बुझो' : 'Solve Riddles'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Embedded Full Cultural Experience */}
          <div className="bg-slate-950/60 rounded-3xl p-4 sm:p-6 border border-amber-900/30 shadow-2xl">
            <PawariCulturalSection initialTab="lokgeet" />
          </div>
        </section>
      )}

      {/* ---------------- CALL TO ACTION CARD ---------------- */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'मां ताप्ती शोध संस्थान प्रकाशन आमंत्रण' : 'Publication Call for Authors & Scholars'}</span>
          </div>
          <h3 className="font-serif font-bold text-amber-100 text-lg sm:text-2xl leading-snug">
            {lang === 'hi' ? 'अपनी पुस्तक, समीक्षा या ब्लॉग प्रकाशित कराएं' : 'Publish Your Book, Review or Academic Blog'}
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/85 leading-relaxed">
            {lang === 'hi'
              ? 'यदि आप पवारी भाषा, मध्य भारत की लोकसंस्कृति या सामाजिक विषयों पर शोध ग्रंथ, पुस्तक समीक्षा अथवा वैचारिक ब्लॉग प्रकाशित कराना चाहते हैं, तो हमसे संपर्क करें।'
              : 'Submit your research monographs, book reviews, or scholarly blog articles for publication with Pawari Shodh Patrika.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto shrink-0">
          <button
            onClick={() => handleOpenPublishModal('book')}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-red-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer transform hover:scale-[1.02]"
          >
            <FileUp className="w-4 h-4 text-red-950" />
            <span>{lang === 'hi' ? 'प्रकाशन हेतु ऑनलाइन भेजें' : 'Submit for Publication'}</span>
          </button>
          <button
            onClick={() => setActiveView('contact')}
            className="w-full sm:w-auto px-4 py-3 bg-red-900/60 hover:bg-red-900/90 text-amber-200 font-bold text-xs sm:text-sm rounded-xl border border-amber-500/30 transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}</span>
          </button>
        </div>
      </div>
      </div>
      )}

      {/* ---------------- PUBLICATION SUBMISSION MODAL ---------------- */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-500/30 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={handleResetPublishForm}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-mono">
                <FileUp className="w-3.5 h-3.5 text-amber-700" />
                <span>{lang === 'hi' ? 'मां ताप्ती पवारी शोध संस्थान प्रकाशन' : 'Research & Publication Portal'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {lang === 'hi' ? 'अपनी पुस्तक, समीक्षा या ब्लॉग प्रकाशित कराएं' : 'Submit Book, Book Review or Blog Article'}
              </h2>
              <p className="text-xs text-slate-600">
                {lang === 'hi'
                  ? 'पवारी भाषा, लोकसंस्कृति, इतिहास एवं शोध पर आधारित अपनी कृतियां व आलेख डिजिटल एवं मुद्रित माध्यम हेतु जमा करें।'
                  : 'Submit your books, manuscripts, book reviews or blog articles for digital and print publication.'}
              </p>
            </div>

            {/* Submission Success Screen */}
            {submitRefNo ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-emerald-950">
                    {lang === 'hi' ? 'प्रकाशन हेतु सफलतापूर्वक जमा किया गया!' : 'Successfully Submitted for Publication!'}
                  </h3>
                  <p className="text-xs text-emerald-800">
                    {lang === 'hi'
                      ? 'आपकी प्रविष्टि समीक्षा हेतु मां ताप्ती शोध संस्थान प्रकाशन समिति को भेज दी गई है।'
                      : 'Your submission has been sent to the Editorial Review Committee.'}
                  </p>
                </div>
                <div className="p-3 bg-white border border-emerald-200 rounded-xl inline-block font-mono text-xs font-bold text-slate-800">
                  {lang === 'hi' ? 'संदर्भ / ट्रैकिंग नंबर:' : 'Reference No:'} <span className="text-red-900">{submitRefNo}</span>
                </div>
                <div>
                  <button
                    onClick={handleResetPublishForm}
                    className="px-6 py-2.5 bg-red-950 hover:bg-red-900 text-amber-200 text-xs font-bold rounded-xl shadow-md transition"
                  >
                    {lang === 'hi' ? 'पुस्तकालय व ब्लॉग में देखें' : 'View in Library & Blogs'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePublishSubmit} className="space-y-5">
                {/* Tab Selector: Book vs Review vs Blog */}
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPublishTab('book')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
                      publishTab === 'book'
                        ? 'bg-red-950 text-amber-300 shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{lang === 'hi' ? '1. पुस्तक (Book)' : '1. Book'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishTab('review')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
                      publishTab === 'review'
                        ? 'bg-red-950 text-amber-300 shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>{lang === 'hi' ? '2. पुस्तक समीक्षा' : '2. Book Review'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishTab('blog')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
                      publishTab === 'blog'
                        ? 'bg-red-950 text-amber-300 shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    <span>{lang === 'hi' ? '3. ब्लॉग / लेख' : '3. Blog Article'}</span>
                  </button>
                </div>

                {/* Author Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'hi' ? 'लेखक / समीक्षक का नाम *' : 'Author / Reviewer Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={subForm.authorName}
                      onChange={(e) => setSubForm({ ...subForm, authorName: e.target.value })}
                      placeholder={lang === 'hi' ? 'उदा. डॉ. रामेश्वर पवार' : 'e.g. Dr. Rameshwar Pawar'}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'hi' ? 'पद एवं संस्थान / संबद्धता' : 'Role / Affiliation'}
                    </label>
                    <input
                      type="text"
                      value={subForm.authorRole}
                      onChange={(e) => setSubForm({ ...subForm, authorRole: e.target.value })}
                      placeholder={lang === 'hi' ? 'उदा. प्रोफेसर / पवारी लोकसाहित्य शोधार्थी' : 'e.g. Pawari Culture Scholar'}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'hi' ? 'ईमेल (Email ID)' : 'Email ID'}
                    </label>
                    <input
                      type="email"
                      value={subForm.email}
                      onChange={(e) => setSubForm({ ...subForm, email: e.target.value })}
                      placeholder="author@example.com"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'hi' ? 'संपर्क मोबाइल नंबर' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={subForm.phone}
                      onChange={(e) => setSubForm({ ...subForm, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Content Title & Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {publishTab === 'book'
                          ? (lang === 'hi' ? 'पुस्तक का शीर्षक (हिन्दी/पवारी) *' : 'Book Title (Hindi/Pawari) *')
                          : publishTab === 'review'
                          ? (lang === 'hi' ? 'समीक्षा शीर्षक *' : 'Review Title *')
                          : (lang === 'hi' ? 'लेख का शीर्षक *' : 'Article Title *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={subForm.titleHindi}
                        onChange={(e) => setSubForm({ ...subForm, titleHindi: e.target.value })}
                        placeholder={
                          publishTab === 'book'
                            ? 'उदा. पवारी लोककथाएं एवं संस्कृति'
                            : publishTab === 'review'
                            ? 'उदा. पवारी व्याकरण ग्रंथ का समालोचनात्मक अध्ययन'
                            : 'उदा. सतपुड़ा की पहाड़ियों में पवारी गीतों की स्वर-लहरी'
                        }
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {lang === 'hi' ? 'शीर्षक अंग्रेजी में (Title in English)' : 'Title in English'}
                      </label>
                      <input
                        type="text"
                        value={subForm.titleEnglish}
                        onChange={(e) => setSubForm({ ...subForm, titleEnglish: e.target.value })}
                        placeholder="e.g. Pawari Folktales and Heritage"
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Review-Specific Field */}
                  {publishTab === 'review' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {lang === 'hi' ? 'समीक्षित की जाने वाली पुस्तक एवं उसके लेखक का विवरण *' : 'Reviewed Book & Author Details *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={subForm.reviewedBookDetails}
                        onChange={(e) => setSubForm({ ...subForm, reviewedBookDetails: e.target.value })}
                        placeholder="उदा. 'पवारी शब्दकोश' (लेखक: डॉ. कैलाश पवार, प्रकाशक: सतपुड़ा संस्थान)"
                        className="w-full text-xs p-2.5 bg-amber-50 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  )}

                  {/* Category & Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {lang === 'hi' ? 'विषय श्रेणी' : 'Category'}
                      </label>
                      <select
                        value={subForm.category}
                        onChange={(e) => setSubForm({ ...subForm, category: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        <option value="भाषाविज्ञान एवं लोकसाहित्य">भाषाविज्ञान एवं लोकसाहित्य</option>
                        <option value="लोकसंस्कृति एवं परम्परा">लोकसंस्कृति एवं परम्परा</option>
                        <option value="इतिहास व शोध">इतिहास व शोध</option>
                        <option value="दर्शन व समाजशास्त्र">दर्शन व समाजशास्त्र</option>
                        <option value="काव्य एवं साहित्य">काव्य एवं साहित्य</option>
                        <option value="पुस्तक समीक्षा">पुस्तक समीक्षा</option>
                      </select>
                    </div>

                    {publishTab === 'book' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {lang === 'hi' ? 'प्रस्तावित प्रकाशक' : 'Publisher'}
                          </label>
                          <input
                            type="text"
                            value={subForm.publisher}
                            onChange={(e) => setSubForm({ ...subForm, publisher: e.target.value })}
                            className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {lang === 'hi' ? 'अनुमानित पृष्ठ संख्या' : 'Approx Pages'}
                          </label>
                          <input
                            type="number"
                            value={subForm.pages}
                            onChange={(e) => setSubForm({ ...subForm, pages: e.target.value })}
                            className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Main Content Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {publishTab === 'book'
                        ? (lang === 'hi' ? 'पुस्तक का सारांश / परिचय / प्रस्तावना *' : 'Book Abstract / Synopsis *')
                        : publishTab === 'review'
                        ? (lang === 'hi' ? 'पुस्तक समीक्षा आलेख (पूर्ण पाठ) *' : 'Book Review Full Content *')
                        : (lang === 'hi' ? 'ब्लॉग आलेख का पूरा पाठ *' : 'Full Article Content *')}
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={subForm.content}
                      onChange={(e) => setSubForm({ ...subForm, content: e.target.value })}
                      placeholder={
                        publishTab === 'review'
                          ? 'यहाँ पुस्तक समीक्षा का विस्तृत आलेख लिखें (उद्देश्य, विषय-वस्तु, भाषा-शैली, निष्कर्ष)...'
                          : 'यहाँ अपना पूरा पाठ या सारांश लिखें...'
                      }
                      className="w-full text-xs p-3 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed font-sans"
                    />
                  </div>

                  {/* File Uploads: Cover Image + PDF Document */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <ImageIcon className="w-4 h-4 text-amber-600" />
                        <span>{lang === 'hi' ? 'कवर / मुख्य चित्र (Cover Image)' : 'Cover Image Upload'}</span>
                      </label>
                      <input
                        type="file"
                        ref={coverInputRef}
                        accept="image/*"
                        onChange={handleCoverFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="w-full p-2.5 bg-white border border-dashed border-amber-400 rounded-xl hover:bg-amber-100/50 transition text-xs font-bold text-slate-700 flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-amber-600" />
                        <span>
                          {coverFile ? coverFile.name : (lang === 'hi' ? 'चित्र अपलोड करें (Browse Image)' : 'Browse Cover Image')}
                        </span>
                      </button>
                    </div>

                    {/* PDF Manuscript Upload */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <FileUp className="w-4 h-4 text-red-700" />
                        <span>{lang === 'hi' ? 'मूल PDF दस्तावेज़ (PDF Manuscript)' : 'Upload PDF Document'}</span>
                      </label>
                      <input
                        type="file"
                        ref={pdfInputRef}
                        accept="application/pdf"
                        onChange={handlePdfFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => pdfInputRef.current?.click()}
                        className="w-full p-2.5 bg-white border border-dashed border-red-300 rounded-xl hover:bg-red-50 transition text-xs font-bold text-slate-700 flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-red-700" />
                        <span>
                          {pdfFile ? pdfFile.name : (lang === 'hi' ? 'PDF अपलोड करें (Browse PDF)' : 'Browse PDF File')}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleResetPublishForm}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingPublish}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-red-950 text-xs font-bold rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingPublish ? (
                      <span>{lang === 'hi' ? 'जमा हो रहा है...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {publishTab === 'book'
                            ? (lang === 'hi' ? 'पुस्तक जमा करें' : 'Submit Book')
                            : publishTab === 'review'
                            ? (lang === 'hi' ? 'समीक्षा जमा करें' : 'Submit Review')
                            : (lang === 'hi' ? 'ब्लॉग जमा करें' : 'Submit Blog')}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ---------------- PUBLIC COMMUNITY CONTRIBUTION MODAL ---------------- */}
      <PublicContributionModal
        isOpen={isContribModalOpen}
        onClose={() => setIsContribModalOpen(false)}
        defaultTab={contribDefaultTab}
      />

    </div>
  );
};
