import React, { useState, useRef } from 'react';
import { useCms } from '../../lib/CmsContext';
import { fileBlobManager } from '../../lib/fileBlobManager';
import { SafeImage } from '../common/SafeImage';
import { SAMPLE_BOOKS, SAMPLE_BLOGS, BookItem, BlogItem } from '../../data/booksBlogsData';
import { downloadPdf } from '../../lib/pdfUtils';
import { PawariCulturalSection } from './PawariCulturalSection';
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
  Copy,
  RotateCcw
} from 'lucide-react';

import { parseRouteFromUrl, getUrlForBook, getUrlForBlog } from '../../lib/router';

interface BooksBlogsViewProps {
  initialTab?: 'all' | 'books' | 'blogs' | 'reviews' | 'folklore' | 'research_papers';
}

export const BooksBlogsView: React.FC<BooksBlogsViewProps> = ({ initialTab = 'all' }) => {
  const { lang, articles, books: cmsBooks, blogs: cmsBlogs, saveBook, saveBlog, submitPublicContribution, uploadFileToStorage, logActivity, setActiveView } = useCms();

  const rawBooks = (cmsBooks && cmsBooks.length > 0) ? cmsBooks : SAMPLE_BOOKS;
  const rawBlogs = (cmsBlogs && cmsBlogs.length > 0) ? cmsBlogs : SAMPLE_BLOGS;

  const booksList = rawBooks.filter(b => b.status === 'approved' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_')));
  const blogsList = rawBlogs.filter(b => b.status === 'approved' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_')));

  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'blogs' | 'reviews' | 'folklore' | 'research_papers'>(initialTab as any);

  // Reader state
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

  React.useEffect(() => {
    const route = parseRouteFromUrl();
    const searchParams = new URLSearchParams(window.location.search);
    const urlTab = searchParams.get('tab') as any;

    if (route.bookId) {
      const b = booksList.find(item => item.id === route.bookId || item.isbn === route.bookId);
      if (b) {
        setSelectedBook(b);
        setActiveTab('books');
      }
    } else if (route.blogId) {
      const bl = blogsList.find(item => item.id === route.blogId);
      if (bl) {
        setSelectedBlog(bl);
        setActiveTab('blogs');
      }
    } else if (urlTab && ['all', 'books', 'blogs', 'reviews', 'folklore', 'research_papers'].includes(urlTab)) {
      setActiveTab(urlTab);
    } else if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab, cmsBooks, cmsBlogs]);

  const handleSelectBook = (book: BookItem) => {
    setSelectedBook(book);
    setSelectedBlog(null);
    window.history.pushState({ bookId: book.id }, '', getUrlForBook(book.id));
  };

  const handleCloseBook = () => {
    setSelectedBook(null);
    const newUrl = activeTab === 'all' ? '/books-literature' : `/books-literature?tab=${activeTab}`;
    if (window.location.pathname.startsWith('/book/') || window.location.search.includes('book=')) {
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleSelectBlog = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setSelectedBook(null);
    window.history.pushState({ blogId: blog.id }, '', getUrlForBlog(blog.id));
  };

  const handleCloseBlog = () => {
    setSelectedBlog(null);
    const newUrl = activeTab === 'all' ? '/books-literature' : `/books-literature?tab=${activeTab}`;
    if (window.location.pathname.startsWith('/blog/') || window.location.search.includes('blog=')) {
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleTabChange = (tabKey: 'all' | 'books' | 'blogs' | 'reviews' | 'folklore' | 'research_papers') => {
    setActiveTab(tabKey);
    setSelectedBook(null);
    setSelectedBlog(null);
    const newUrl = tabKey === 'all' ? '/books-literature' : `/books-literature?tab=${tabKey}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.pushState({ tab: tabKey }, '', newUrl);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [likedBlogs, setLikedBlogs] = useState<Record<string, number>>({});
  const [readerFontSize, setReaderFontSize] = useState<number>(18);
  const [copiedArticleLink, setCopiedArticleLink] = useState<boolean>(false);

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
          const res = await uploadFileToStorage(pdfFile, 'documents');
          pdfUrl = res.url;
        } catch (e) {
          pdfUrl = await readFileAsDataUrl(pdfFile);
        }
      }

      const generatedId = 'pub_' + Date.now();
      const generatedRefNo = 'PSP-PUB-' + Math.floor(100000 + Math.random() * 900000);

      if (publishTab === 'book') {
        const newBook: BookItem & { status?: 'pending' | 'approved' | 'rejected'; contributor_name?: string } = {
          id: generatedId,
          title_hindi: subForm.titleHindi,
          title_english: subForm.titleEnglish || subForm.titleHindi,
          authors: subForm.authorName,
          publisher: subForm.publisher || 'पावारी शोध संस्थान प्रकाशन',
          publication_year: new Date().getFullYear().toString(),
          isbn: subForm.isbn || ('ISBN-987-81-' + Math.floor(1000000 + Math.random() * 9000000)),
          pages: parseInt(subForm.pages) || 150,
          category: subForm.category,
          cover_image: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
          synopsis_hindi: subForm.content,
          synopsis_english: subForm.content,
          table_of_contents_hindi: ['विषय प्रवेश एवं प्रस्तावना', 'पवारी भाषा का समाजशास्त्रीय अध्ययन', 'निष्कर्ष एवं सन्दर्भ ग्रन्थ सूची'],
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
          author_role: subForm.authorRole || 'समीक्षक एवं शोधार्थी',
          date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          read_time: '7 मिनट',
          category: 'पुस्तक समीक्षा',
          cover_image: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
          excerpt_hindi: `समीक्षित पुस्तक: ${subForm.reviewedBookDetails || subForm.titleHindi}`,
          excerpt_english: `Reviewed Book: ${subForm.reviewedBookDetails || subForm.titleHindi}`,
          content_hindi: subForm.content,
          content_english: subForm.content,
          tags: subForm.tags ? subForm.tags.split(',').map(t => t.trim()) : ['पुस्तक_समीक्षा', 'साहित्य'],
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

  // Published research papers from CMS
  const publishedArticles = articles.filter(a => a.status === 'published');

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

  const handleLikeBlog = (e: React.MouseEvent, blogId: string, initialLikes: number = 0) => {
    e.stopPropagation();
    setLikedBlogs(prev => ({
      ...prev,
      [blogId]: (prev[blogId] || initialLikes) + 1
    }));
  };

  const handleShareArticle = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy', title: string) => {
    const siteUrl = window.location.href;
    const shareText = `📖 पवारी साहित्य आलेख: "${title}"\n\nपढ़ें पवारी शोध पत्रिका पोर्टल पर: ${siteUrl}`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}`);
      setCopiedArticleLink(true);
      setTimeout(() => setCopiedArticleLink(false), 2500);
    }
  };

  /* =========================================================================
     MAIN PAWARI LITERATURE CATALOG & HUB VIEW WITH INLINE READER SHOWCASE
     ========================================================================= */
  const featuredBook = booksList.find(b => b.is_featured) || booksList[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* ---------------- HERO BANNER ---------------- */}
      <div className="bg-gradient-to-br from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/30 space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hi' ? 'पवारी साहित्य एवं शोध ग्रंथालय' : 'Pawari Literature & Research Library'}</span>
            </div>

            <button
              onClick={() => handleOpenPublishModal('book')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-red-950 font-bold text-xs sm:text-sm shadow-xl flex items-center space-x-2 transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <Upload className="w-4 h-4 text-red-950" />
              <span>{lang === 'hi' ? 'अपनी पुस्तक, समीक्षा या आलेख जोड़ें' : 'Submit Book, Review or Article'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 leading-tight">
            {lang === 'hi' ? 'पवारी साहित्य, ग्रंथालय एवं शोध विमर्श' : 'Pawari Literature, Monographs & Scholarly Essays'}
          </h1>

          <p className="text-xs sm:text-sm text-amber-200/85 max-w-3xl leading-relaxed">
            {lang === 'hi'
              ? 'बैतूल, छिंदवाड़ा, सिवनी, वर्धा एवं ताप्ती अंचल की समृद्ध पवारी भाषा, ऐतिहासिक शोध ग्रंथ, शब्दकोश, लोकसाहित्य पुस्तकें, समीक्षाएं एवं विद्वत वैचारिक आलेख।'
              : 'A comprehensive archive of authentic research monographs, dictionaries, folklore literature, book reviews, and academic essays from the Tapti & Satpura belt.'}
          </p>
        </div>

        {/* Action Bar / Main Navigation Tabs inside View */}
        <div className="relative z-10 pt-3 flex flex-wrap items-center gap-2 border-t border-amber-500/20">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'all' 
                ? 'bg-amber-500 text-red-950 shadow-md scale-105' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '🌟 समग्र साहित्य (All)' : 'All Literature'}</span>
          </button>

          <button
            onClick={() => handleTabChange('books')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'books' 
                ? 'bg-amber-500 text-red-950 shadow-md scale-105' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <Book className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? `📚 शोध ग्रंथ एवं पुस्तकें (${booksList.length})` : `Books (${booksList.length})`}</span>
          </button>

          <button
            onClick={() => handleTabChange('blogs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'blogs' 
                ? 'bg-amber-500 text-red-950 shadow-md scale-105' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? `✍️ वैचारिक ब्लॉग एवं आलेख (${blogsList.length})` : `Blogs & Essays (${blogsList.length})`}</span>
          </button>

          <button
            onClick={() => handleTabChange('reviews')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'reviews' 
                ? 'bg-amber-500 text-red-950 shadow-md scale-105' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '📑 पुस्तक समीक्षाएं' : 'Book Reviews'}</span>
          </button>

          <button
            onClick={() => setActiveView('pawari_lokgeet')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? '🎵 पवारी लोकगीत अर्काइव ➔' : 'Lokgeet Archive ➔'}</span>
          </button>

          <button
            onClick={() => setActiveView('pawari_shabdkosh')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? '📖 शब्दकोश व पहेली ➔' : 'Dictionary & Riddles ➔'}</span>
          </button>
        </div>
      </div>

      {/* ---------------- INLINE FEATURED BOOK READER VIEW ---------------- */}
      {selectedBook && (
        <div className="bg-gradient-to-br from-red-950 via-amber-950 to-slate-950 border-2 border-amber-500 p-6 sm:p-8 rounded-3xl text-amber-100 shadow-2xl relative space-y-6 animate-in slide-in-from-top-4 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs font-mono">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>ग्रंथ विवरण एवं सारांश (Selected Book Details)</span>
            </div>
            <button
              onClick={handleCloseBook}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
              <span>{lang === 'hi' ? '✕ बंद करें' : '✕ Close'}</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-36 sm:w-48 aspect-3/4 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-slate-950 mx-auto md:mx-0">
              <SafeImage src={selectedBook.cover_image} alt={selectedBook.title_english} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-500 text-amber-950 font-bold text-xs px-3 py-0.5 rounded-full uppercase font-mono">
                  {selectedBook.category}
                </span>
                <span className="bg-slate-900 border border-amber-500/30 text-amber-300 text-xs px-3 py-0.5 rounded-full font-mono">
                  प्रकाशन वर्ष: {selectedBook.publication_year}
                </span>
                {selectedBook.pages && (
                  <span className="bg-slate-900 border border-amber-500/30 text-amber-300 text-xs px-3 py-0.5 rounded-full font-mono">
                    पृष्ठ: {selectedBook.pages}
                  </span>
                )}
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-0.5 rounded-full font-semibold">
                  {selectedBook.price || 'Open Access / निःशुल्क'}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-serif font-black text-amber-200 leading-tight">
                {lang === 'hi' ? selectedBook.title_hindi : selectedBook.title_english}
              </h2>

              <p className="text-xs font-bold text-amber-300">
                लेखक / सम्पादक: {selectedBook.authors} {selectedBook.publisher && `| प्रकाशक: ${selectedBook.publisher}`}
              </p>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 leading-relaxed font-serif space-y-2">
                <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">ग्रंथ सारांश (Synopsis):</h4>
                <p>{(selectedBook.synopsis_hindi || selectedBook.synopsis_english)}</p>
              </div>

              {selectedBook.table_of_contents_hindi && selectedBook.table_of_contents_hindi.length > 0 && (
                <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/20 space-y-2">
                  <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">विषय सूची (Table of Contents):</h4>
                  <ul className="space-y-1 text-xs text-amber-100/90 font-serif">
                    {selectedBook.table_of_contents_hindi.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedBook.sample_pdf_url && (
                  <a
                    href={selectedBook.sample_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition"
                  >
                    <FileText className="w-4 h-4 text-amber-950" />
                    <span>📄 पूर्ण ग्रंथ PDF देखें / डाउनलोड करें</span>
                  </a>
                )}

                <button
                  onClick={() => handleShareArticle('whatsapp', selectedBook.title_hindi)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp शेयर</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- INLINE FEATURED BLOG READER VIEW ---------------- */}
      {selectedBlog && (
        <div className="bg-white border-2 border-amber-500 p-6 sm:p-8 rounded-3xl text-slate-900 shadow-2xl relative space-y-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-3 text-xs font-bold text-slate-700">
              <span className="bg-red-950 text-amber-300 px-3 py-1 rounded-full font-mono">{selectedBlog.category}</span>
              <span>अक्षर आकार:</span>
              <button onClick={() => setReaderFontSize(prev => Math.max(14, prev - 2))} className="w-7 h-7 rounded bg-slate-100 font-bold">A-</button>
              <span className="font-mono">{readerFontSize}px</span>
              <button onClick={() => setReaderFontSize(prev => Math.min(26, prev + 2))} className="w-7 h-7 rounded bg-slate-100 font-bold">A+</button>
            </div>
            <button
              onClick={handleCloseBlog}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>{lang === 'hi' ? '✕ बंद करें' : '✕ Close'}</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
            {lang === 'hi' ? selectedBlog.title_hindi : selectedBlog.title_english}
          </h2>

          <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono border-b border-slate-100 pb-3">
            <span>लेखक: <strong>{selectedBlog.author}</strong></span>
            <span>•</span>
            <span>प्रकाशन: {selectedBlog.date}</span>
          </div>

          <div 
            style={{ fontSize: `${readerFontSize}px`, lineHeight: 1.8 }}
            className="prose prose-amber max-w-none text-slate-800 font-serif space-y-4"
          >
            {selectedBlog.content_hindi.split('\n\n').map((paragraph, i) => (
              <p key={i} className="leading-relaxed">{paragraph}</p>
            ))}
          </div>

          {selectedBlog.pdf_url && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-red-950">मूल आलेख PDF फ़ाइल उपलब्ध है</span>
              <a href={selectedBlog.pdf_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-red-950 text-amber-200 text-xs font-bold rounded-xl flex items-center space-x-1.5">
                <Download className="w-4 h-4" />
                <span>PDF डाउनलोड करें</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* ---------------- SEARCH & FILTER BAR ---------------- */}
      <div className="bg-white border border-amber-900/10 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'hi' 
                  ? 'पुस्तक शीर्षक, लेखक, ब्लॉग विषय या कीवर्ड द्वारा खोजें...' 
                  : 'Search by book title, author, blog topic, or keywords...'
              }
              className="w-full pl-10 pr-10 py-2 bg-slate-50 text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
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
      </div>

      {/* ---------------- FEATURED HIGHLIGHT MONOGRAPH (When viewing All or Books) ---------------- */}
      {(activeTab === 'all' || activeTab === 'books') && featuredBook && !selectedBook && !searchQuery && (
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-amber-100 shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="w-32 sm:w-40 aspect-3/4 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-slate-950">
            <SafeImage src={featuredBook.cover_image} alt={featuredBook.title_english} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-3 flex-1 min-w-0 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500 text-amber-950 font-mono text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सम्पादक की विशेष अनुशंसा / Featured Research Monograph</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-black text-amber-100 leading-tight">
              {lang === 'hi' ? featuredBook.title_hindi : featuredBook.title_english}
            </h3>

            <p className="text-xs text-amber-300 font-bold">
              लेखक: {featuredBook.authors} | {featuredBook.publisher} ({featuredBook.publication_year})
            </p>

            <p className="text-xs text-amber-200/80 line-clamp-2 leading-relaxed font-serif">
              {lang === 'hi' ? featuredBook.synopsis_hindi : featuredBook.synopsis_english}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => handleSelectBook(featuredBook)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-red-950 font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 hover:from-amber-300 hover:to-amber-400 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>ग्रंथ विवरण एवं विषय-सूची देखें</span>
              </button>

              {featuredBook.sample_pdf_url && (
                <a
                  href={featuredBook.sample_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-amber-400/40 text-amber-200 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF पढ़ें</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CULTURAL QUICK TILES (When viewing All) ---------------- */}
      {activeTab === 'all' && !searchQuery && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => setActiveView('pawari_lokgeet')}
            className="bg-gradient-to-br from-amber-900/30 to-red-950/40 border border-amber-900/30 hover:border-amber-500 rounded-2xl p-5 cursor-pointer transition group flex items-center space-x-4 shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900 transition">
                पवारी लोकगीत अर्काइव
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                विवाह, भक्ति व पारंपरिक लोकगाथाएं ➔
              </p>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('pawari_shabdkosh')}
            className="bg-gradient-to-br from-amber-900/30 to-red-950/40 border border-amber-900/30 hover:border-amber-500 rounded-2xl p-5 cursor-pointer transition group flex items-center space-x-4 shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900 transition">
                पवारी शब्दकोश (2000+ शब्द)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                अर्थ, उच्चारण व वाक्य प्रयोग ➔
              </p>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('pawari_paheli')}
            className="bg-gradient-to-br from-amber-900/30 to-red-950/40 border border-amber-900/30 hover:border-amber-500 rounded-2xl p-5 cursor-pointer transition group flex items-center space-x-4 shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900 transition">
                पवारी बुझौवल एवं पहेलियाँ
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                374+ पहेलियाँ एवं संस्कृति क्विज़ ➔
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- BOOKS & MONOGRAPHS GRID ---------------- */}
      {(activeTab === 'all' || activeTab === 'books') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <div className="flex items-center space-x-2">
              <Book className="w-5 h-5 text-red-900" />
              <h2 className="text-xl font-serif font-bold text-red-950">
                {lang === 'hi' ? 'प्रकाशित शोध ग्रंथ एवं पुस्तकें' : 'Published Books & Monographs'}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold">
              {filteredBooks.length} {lang === 'hi' ? 'ग्रंथ उपलब्ध' : 'Books Available'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBooks.map((book) => (
              <div 
                key={book.id}
                onClick={() => handleSelectBook(book)}
                className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl p-5 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-28 sm:w-32 aspect-3/4 max-h-44 shrink-0 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900 shadow-md group-hover:scale-105 transition duration-200">
                    <SafeImage 
                      src={book.cover_image} 
                      alt={book.title_english} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">
                        {book.category}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {book.publication_year}
                      </span>
                      {book.pages && (
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {book.pages} पृ.
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 group-hover:text-red-950 leading-snug">
                      {lang === 'hi' ? book.title_hindi : book.title_english}
                    </h3>

                    <p className="text-xs font-bold text-red-900">
                      {book.authors}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {lang === 'hi' ? book.synopsis_hindi : book.synopsis_english}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">ISBN: {book.isbn}</span>
                  <span className="text-red-900 font-bold group-hover:underline flex items-center space-x-1">
                    <span>{lang === 'hi' ? 'ग्रंथ का विवरण देखें →' : 'View Book Details →'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- BLOGS & ESSAYS GRID ---------------- */}
      {(activeTab === 'all' || activeTab === 'blogs' || activeTab === 'reviews') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-red-900" />
              <h2 className="text-xl font-serif font-bold text-red-950">
                {activeTab === 'reviews' 
                  ? (lang === 'hi' ? 'पुस्तक समीक्षाएं (Book Reviews)' : 'Book Reviews')
                  : (lang === 'hi' ? 'साहित्यिक आलेख एवं वैचारिक विमर्श' : 'Scholarly Blogs & Essays')}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold">
              {filteredBlogs.length} {lang === 'hi' ? 'आलेख उपलब्ध' : 'Articles Available'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog.id}
                onClick={() => handleSelectBlog(blog)}
                className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 w-full relative bg-slate-900 overflow-hidden">
                    <SafeImage src={blog.cover_image} alt={blog.title_english} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute top-3 left-3 bg-red-950/90 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-amber-400/30">
                      {blog.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-serif font-bold text-slate-900 group-hover:text-red-950 text-base leading-snug">
                      {lang === 'hi' ? blog.title_hindi : blog.title_english}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {lang === 'hi' ? blog.excerpt_hindi : blog.excerpt_english}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span className="truncate max-w-[120px] font-bold text-slate-800">{blog.author}</span>
                  </div>

                  <span className="text-red-900 font-bold group-hover:underline">
                    {lang === 'hi' ? 'आलेख पढ़ें →' : 'Read Article →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
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

            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-mono">
                <FileUp className="w-3.5 h-3.5 text-amber-700" />
                <span>{lang === 'hi' ? 'मां ताप्ती पवारी शोध संस्थान प्रकाशन' : 'Research & Publication Portal'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {lang === 'hi' ? 'अपनी पुस्तक, समीक्षा या ब्लॉग प्रकाशित कराएं' : 'Submit Book, Book Review or Blog Article'}
              </h2>
            </div>

            {submitRefNo ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-emerald-950">प्रकाशन प्रस्ताव सफलतापूर्वक दर्ज हुआ!</h3>
                  <p className="text-xs text-emerald-800 font-mono">समीक्षा सन्दर्भ संख्या: <strong>{submitRefNo}</strong></p>
                </div>
                <button onClick={handleResetPublishForm} className="px-6 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
                  समीक्षा पूर्ण (बंद करें)
                </button>
              </div>
            ) : (
              <form onSubmit={handlePublishSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">लेखक का नाम (Author Name) *</label>
                    <input type="text" required value={subForm.authorName} onChange={(e) => setSubForm(prev => ({ ...prev, authorName: e.target.value }))} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">शीर्षक (Title) *</label>
                    <input type="text" required value={subForm.titleHindi} onChange={(e) => setSubForm(prev => ({ ...prev, titleHindi: e.target.value }))} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">विस्तृत सामग्री / आलेख (Full Text / Content) *</label>
                  <textarea rows={5} required value={subForm.content} onChange={(e) => setSubForm(prev => ({ ...prev, content: e.target.value }))} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-serif leading-relaxed" />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={handleResetPublishForm} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">रद्द करें</button>
                  <button type="submit" disabled={isSubmittingPublish} className="px-6 py-2.5 bg-red-950 hover:bg-red-900 text-amber-300 font-bold text-xs rounded-xl shadow-md">
                    {isSubmittingPublish ? 'जमा हो रहा है...' : 'सबमिट करें'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
