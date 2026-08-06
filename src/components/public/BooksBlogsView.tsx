import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
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
  Award
} from 'lucide-react';

interface BooksBlogsViewProps {
  initialTab?: 'all' | 'books' | 'blogs' | 'reviews' | 'research_papers' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz';
}

export const BooksBlogsView: React.FC<BooksBlogsViewProps> = ({ initialTab = 'all' }) => {
  const { lang, articles, books: cmsBooks, blogs: cmsBlogs, setActiveView } = useCms();

  const booksList = (cmsBooks && cmsBooks.length > 0) ? cmsBooks : SAMPLE_BOOKS;
  const blogsList = (cmsBlogs && cmsBlogs.length > 0) ? cmsBlogs : SAMPLE_BLOGS;

  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'blogs' | 'reviews' | 'research_papers' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz'>(initialTab);

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
  const [likedBlogs, setLikedBlogs] = useState<Record<string, number>>({});

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* ---------------- HERO BANNER ---------------- */}
      <div className="bg-gradient-to-br from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/30 space-y-4 relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'पुस्तकालय एवं वैचारिक मंच' : 'Library & Scholarly Blog'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 leading-tight">
            {lang === 'hi' ? 'पुस्तकें, शोध ग्रंथ एवं अकादमिक ब्लॉग' : 'Books, Research Monographs & Academic Blogs'}
          </h1>

          <p className="text-xs sm:text-sm text-amber-200/85 max-w-3xl leading-relaxed">
            {lang === 'hi'
              ? 'पवारी शोध पत्रिका तथा माँ ताप्ती शोध संस्थान द्वारा प्रकाशित प्रामाणिक शोध ग्रंथ, शब्दकोश, लोकसाहित्य पुस्तकें, समीक्षाएं एवं विद्वत ब्लॉग।'
              : 'Authentic research monographs, dictionaries, folklore literature books, book reviews, and scholarly blog posts published by Pawari Shodh Patrika and MTRI.'}
          </p>
        </div>

        {/* Action Bar / Main Navigation Tabs inside View */}
        <div className="relative z-10 pt-2 flex flex-wrap items-center gap-2 border-t border-amber-500/20">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'all' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'सभी सामग्री' : 'All Items'}</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'books' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <Book className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '📚 पुस्तकें' : 'Books'}</span>
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'blogs' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '✍️ ब्लॉग' : 'Blogs'}</span>
          </button>

          <button
            onClick={() => setActiveTab('shabdkosh')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'shabdkosh' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'hi' ? '📖 शब्दकोश' : 'Shabdkosh'}</span>
          </button>

          <button
            onClick={() => setActiveTab('paheli')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'paheli' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'hi' ? '🧩 पहेली' : 'Paheli'}</span>
          </button>

          <button
            onClick={() => setActiveTab('lokgeet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'lokgeet' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'hi' ? '🎵 लोकगीत' : 'Lokgeet'}</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'quiz' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'hi' ? '🏆 क्विज़' : 'Quiz'}</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'reviews' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '📑 समीक्षाएं' : 'Reviews'}</span>
          </button>

          <button
            onClick={() => setActiveTab('research_papers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'research_papers' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '📄 शोध पत्र' : 'Research Papers'}</span>
          </button>
        </div>
      </div>

      {/* ---------------- SEARCH & FILTER BAR ---------------- */}
      <div className="bg-white border border-amber-900/10 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
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

          {/* Category Filter Dropdown */}
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

      {/* ---------------- CULTURAL MODULES TAB VIEW (Shabdkosh, Paheli, Lokgeet, Quiz) ---------------- */}
      {(activeTab === 'shabdkosh' || activeTab === 'paheli' || activeTab === 'lokgeet' || activeTab === 'quiz') && (
        <section className="space-y-4">
          <PawariCulturalSection initialTab={activeTab} />
        </section>
      )}

      {/* ---------------- CONTENT SECTION 1: BOOKS & MONOGRAPHS ---------------- */}
      {(activeTab === 'all' || activeTab === 'books') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <div className="flex items-center space-x-2">
              <Book className="w-5 h-5 text-red-900" />
              <h2 className="text-xl font-serif font-bold text-red-950">
                {lang === 'hi' ? 'प्रकाशित पुस्तकें एवं शोध ग्रंथ' : 'Published Books & Research Monographs'}
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
                onClick={() => setSelectedBook(book)}
                className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl p-5 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="flex gap-4 items-start">
                  {/* Book Cover Image */}
                  <div className="w-28 sm:w-32 aspect-3/4 max-h-44 shrink-0 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900 shadow-md group-hover:scale-105 transition duration-200">
                    <SafeImage 
                      src={book.cover_image} 
                      alt={book.title_english} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Book Metadata */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">
                        {book.category}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {book.publication_year}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 group-hover:text-red-950 leading-snug">
                      {lang === 'hi' ? book.title_hindi : book.title_english}
                    </h3>

                    <p className="text-xs font-bold text-red-900">
                      {book.authors}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {lang === 'hi' ? book.synopsis_hindi : book.synopsis_english}
                    </p>

                    <div className="text-[11px] font-mono text-slate-500 pt-1">
                      <span>ISBN: {book.isbn}</span> • <span>{book.pages} Pages</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-amber-800 font-bold font-mono">
                    {book.publisher}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBook(book);
                    }}
                    className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-lg transition flex items-center space-x-1"
                  >
                    <span>{lang === 'hi' ? 'विवरण एवं अनुक्रमणिका' : 'Details & Chapters'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- CONTENT SECTION 2: ACADEMIC BLOGS & REVIEWS ---------------- */}
      {(activeTab === 'all' || activeTab === 'blogs' || activeTab === 'reviews') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-red-900" />
              <h2 className="text-xl font-serif font-bold text-red-950">
                {activeTab === 'reviews' 
                  ? (lang === 'hi' ? 'पुस्तक समीक्षाएं' : 'Book Reviews')
                  : (lang === 'hi' ? 'वैचारिक ब्लॉग एवं साहित्यिक लेख' : 'Scholarly Blogs & Cultural Essays')}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold">
              {filteredBlogs.length} {lang === 'hi' ? 'लेख उपलब्ध' : 'Articles Available'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Blog Cover Banner */}
                  <div className="w-full h-40 overflow-hidden relative bg-slate-900">
                    <SafeImage 
                      src={blog.cover_image} 
                      alt={blog.title_english} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-red-950/90 text-amber-300 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider backdrop-blur-xs border border-amber-500/30">
                      {blog.category}
                    </div>
                  </div>

                  {/* Blog Body */}
                  <div className="p-5 space-y-3">
                    
                    {/* Author & Date Bar */}
                    <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 border border-amber-400 shrink-0">
                        <SafeImage src={blog.author_avatar || ''} alt={blog.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-xs truncate">{blog.author}</p>
                        <p className="text-[10px] text-slate-500">{blog.author_role}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-[11px] text-slate-400 shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{blog.read_time}</span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 group-hover:text-red-950 leading-snug">
                      {lang === 'hi' ? blog.title_hindi : blog.title_english}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {lang === 'hi' ? blog.excerpt_hindi : blog.excerpt_english}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {blog.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 text-[11px]">{blog.date}</span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleLikeBlog(e, blog.id, blog.likes_count)}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Like Post"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{likedBlogs[blog.id] || blog.likes_count || 0}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBlog(blog);
                      }}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 font-bold rounded-lg transition flex items-center space-x-1"
                    >
                      <span>{lang === 'hi' ? 'पूरा लेख पढ़ें' : 'Read Article'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- CONTENT SECTION 3: RESEARCH PAPERS (INTEGRATED) ---------------- */}
      {(activeTab === 'all' || activeTab === 'research_papers') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-red-900" />
              <h2 className="text-xl font-serif font-bold text-red-950">
                {lang === 'hi' ? 'प्रकाशित शोध पत्र संग्रह' : 'Published Peer-Reviewed Research Papers'}
              </h2>
            </div>
            <button
              onClick={() => setActiveView('articles')}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'सभी शोध पत्र देखें →' : 'View All Papers →'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedArticles.slice(0, 4).map(art => (
              <div 
                key={art.id}
                onClick={() => setActiveView('articles')}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="bg-red-100 text-red-950 font-bold px-2 py-0.5 rounded text-[10px]">
                    {art.category}
                  </span>
                  <span className="text-slate-500">Vol {art.volume}, Issue {art.issue} ({art.year})</span>
                </div>

                <h3 className="font-serif font-bold text-slate-900 group-hover:text-red-950 text-sm sm:text-base leading-snug">
                  {lang === 'hi' ? art.title_hindi : art.title_english}
                </h3>

                <p className="text-xs font-semibold text-slate-700">
                  {art.authors.map(a => a.name).join('; ')}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
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

      {/* ---------------- CONTENT SECTION 4: PAWARI SHABDKOSH, PAHELI, LOKGEET & QUIZ ---------------- */}
      {activeTab === 'all' && (
        <section className="space-y-4 pt-4 border-t border-amber-900/10">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-serif font-bold text-red-950">
                {lang === 'hi' ? 'पवारी शब्दकोश, पहेली, लोकगीत एवं संस्कृति क्विज़' : 'Pawari Dictionary, Riddles, Folk Songs & Quiz'}
              </h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('shabdkosh')} 
                className="text-xs font-bold text-red-900 hover:underline"
              >
                {lang === 'hi' ? 'विस्तार से देखें →' : 'View Full →'}
              </button>
            </div>
          </div>

          <PawariCulturalSection initialTab="shabdkosh" />
        </section>
      )}

      {/* ---------------- CALL TO ACTION CARD ---------------- */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-300 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-red-950 text-base sm:text-lg">
            {lang === 'hi' ? 'अपनी पुस्तक, समीक्षा या ब्लॉग प्रकाशित कराएं' : 'Publish Your Book, Review or Academic Blog'}
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            {lang === 'hi'
              ? 'यदि आप पवारी भाषा, मध्य भारत की लोकसंस्कृति या सामाजिक विषयों पर शोध ग्रंथ, पुस्तक समीक्षा अथवा वैचारिक ब्लॉग प्रकाशित कराना चाहते हैं, तो हमसे संपर्क करें।'
              : 'Submit your research monographs, book reviews, or scholarly blog articles for publication with Pawari Shodh Patrika.'}
          </p>
        </div>

        <button
          onClick={() => setActiveView('submit_manuscript')}
          className="px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-300 font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>{lang === 'hi' ? 'प्रकाशन हेतु भेजें' : 'Submit for Publication'}</span>
        </button>
      </div>

      {/* ---------------- BOOK DETAIL MODAL ---------------- */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-500/30 relative">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-36 aspect-3/4 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-lg bg-slate-900 mx-auto sm:mx-0">
                <SafeImage src={selectedBook.cover_image} alt={selectedBook.title_english} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-3 flex-1 min-w-0">
                <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded text-xs">
                  {selectedBook.category}
                </span>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight">
                  {lang === 'hi' ? selectedBook.title_hindi : selectedBook.title_english}
                </h2>

                <p className="text-sm font-bold text-red-950">
                  {selectedBook.authors}
                </p>

                <div className="space-y-1 text-xs text-slate-600 font-mono">
                  <p><strong>प्रकाशक:</strong> {selectedBook.publisher}</p>
                  <p><strong>प्रकाशन वर्ष:</strong> {selectedBook.publication_year} | <strong>पृष्ठ:</strong> {selectedBook.pages}</p>
                  <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                  {selectedBook.price && <p><strong>मूल्य / एक्सेस:</strong> {selectedBook.price}</p>}
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-serif font-bold text-slate-900 text-sm">
                {lang === 'hi' ? 'पुस्तक परिचय एवं सारांश' : 'Synopsis & Overview'}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {lang === 'hi' ? selectedBook.synopsis_hindi : selectedBook.synopsis_english}
              </p>
            </div>

            {/* Table of Contents */}
            {selectedBook.table_of_contents_hindi && (
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-slate-900 text-sm">
                  {lang === 'hi' ? 'विषय अनुक्रमणिका (Table of Contents)' : 'Table of Contents'}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                  {selectedBook.table_of_contents_hindi.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {selectedBook.sample_pdf_url ? (
                <a
                  href={selectedBook.sample_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'hi' ? '📄 PDF देखें / डाउनलोड करें' : '📄 View / Download Book PDF'}</span>
                </a>
              ) : <div />}

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                >
                  {lang === 'hi' ? 'बंद करें' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    alert(lang === 'hi' ? 'यह पुस्तक/शोध ग्रंथ खुले एक्सेस में उपलब्ध है। अधिक जानकारी के लिए माँ ताप्ती शोध संस्थान से संपर्क करें।' : 'This book is available in open research access.');
                  }}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-red-950 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'प्रति प्राप्त करें / संपर्क करें' : 'Order / Request Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- BLOG READER MODAL ---------------- */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 space-y-6 shadow-2xl border border-amber-500/30 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner */}
            <div className="w-full h-56 rounded-2xl overflow-hidden relative bg-slate-900 border border-amber-500/20 shadow-md">
              <SafeImage src={selectedBlog.cover_image} alt={selectedBlog.title_english} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-red-950 text-amber-300 font-bold text-xs px-3 py-1 rounded-full border border-amber-400/30 font-mono">
                {selectedBlog.category}
              </div>
            </div>

            {/* Title & Author Info */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-slate-900 leading-snug">
                {lang === 'hi' ? selectedBlog.title_hindi : selectedBlog.title_english}
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-amber-500 shrink-0">
                    <SafeImage src={selectedBlog.author_avatar || ''} alt={selectedBlog.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{selectedBlog.author}</p>
                    <p className="text-[10px] text-slate-500">{selectedBlog.author_role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedBlog.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedBlog.read_time}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Markdown / Main Article Content */}
            <div className="prose prose-amber max-w-none text-sm text-slate-800 leading-relaxed font-sans space-y-4 border-t border-b border-slate-100 py-4">
              {selectedBlog.content_hindi.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('###')) {
                  return (
                    <h3 key={i} className="font-serif font-bold text-red-950 text-lg sm:text-xl mt-4 mb-2">
                      {paragraph.replace('###', '').trim()}
                    </h3>
                  );
                }
                return (
                  <p key={i} className="text-slate-800 text-sm leading-relaxed">
                    {paragraph.trim()}
                  </p>
                );
              })}
            </div>

            {/* Blog PDF Document Download */}
            {selectedBlog.pdf_url && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3 text-xs font-bold text-red-950">
                  <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p>{lang === 'hi' ? 'इस ब्लॉग/लेख की मूल PDF फ़ाइल उपलब्ध है' : 'Official PDF available for this article'}</p>
                    <p className="text-[10px] text-slate-500 font-normal">{lang === 'hi' ? 'Firebase Storage से सीधे डाउनलोड करें' : 'Download directly from Firebase Storage'}</p>
                  </div>
                </div>
                <a
                  href={selectedBlog.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'hi' ? 'PDF फ़ाइल डाउनलोड करें' : 'Download PDF'}</span>
                </a>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              {selectedBlog.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-amber-50 text-amber-900 font-mono px-3 py-1 rounded-full border border-amber-200">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={(e) => handleLikeBlog(e, selectedBlog.id, selectedBlog.likes_count)}
                className="px-4 py-2 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100 transition flex items-center space-x-1.5 border border-rose-200"
              >
                <Heart className="w-4 h-4 fill-rose-600" />
                <span>{lang === 'hi' ? 'पसंद करें' : 'Like'} ({likedBlogs[selectedBlog.id] || selectedBlog.likes_count || 0})</span>
              </button>

              <button
                onClick={() => setSelectedBlog(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
              >
                {lang === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
