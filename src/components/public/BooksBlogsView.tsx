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

interface BooksBlogsViewProps {
  initialTab?: 'all' | 'books' | 'blogs' | 'reviews' | 'research_papers' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz';
}

export const BooksBlogsView: React.FC<BooksBlogsViewProps> = ({ initialTab = 'all' }) => {
  const { lang, articles, books: cmsBooks, blogs: cmsBlogs, saveBook, saveBlog, submitPublicContribution, uploadFileToStorage, logActivity, setActiveView } = useCms();

  const rawBooks = (cmsBooks && cmsBooks.length > 0) ? cmsBooks : SAMPLE_BOOKS;
  const rawBlogs = (cmsBlogs && cmsBlogs.length > 0) ? cmsBlogs : SAMPLE_BLOGS;

  const booksList = rawBooks.filter(b => b.status === 'approved' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_')));
  const blogsList = rawBlogs.filter(b => b.status === 'approved' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_')));

  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'blogs' | 'reviews' | 'research_papers' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Reader state
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
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
          isbn: subForm.isbn || ('ISBN-978-81-' + Math.floor(1000000 + Math.random() * 9000000)),
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
     1️⃣ DEDICATED FULL-PAGE BOOK READER VIEW
     ========================================================================= */
  if (selectedBook) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
        {/* Top Back Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-amber-500/30 rounded-2xl text-amber-100 shadow-xl sticky top-4 z-40 backdrop-blur-md">
          <button
            onClick={() => setSelectedBook(null)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-md"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>{lang === 'hi' ? '← वापस पवारी साहित्य एवं ब्लॉग संग्रह पर जाएं' : '← Back to Pawari Literature Collection'}</span>
          </button>

          <div className="flex items-center space-x-3 text-xs font-bold text-amber-300">
            <span className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 font-mono">
              ISBN: {selectedBook.isbn}
            </span>
          </div>
        </div>

        {/* Book Header Hero Banner */}
        <div className="bg-gradient-to-br from-red-950 via-amber-950 to-slate-950 border-2 border-amber-500/40 p-6 sm:p-10 rounded-3xl text-amber-100 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            {/* Book Cover */}
            <div className="w-44 sm:w-52 aspect-3/4 shrink-0 rounded-2xl overflow-hidden border-4 border-amber-400/60 shadow-2xl bg-slate-950 mx-auto md:mx-0">
              <SafeImage src={selectedBook.cover_image} alt={selectedBook.title_english} className="w-full h-full object-cover" />
            </div>

            {/* Book Details */}
            <div className="space-y-4 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-500 text-amber-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {selectedBook.category}
                </span>
                <span className="bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs px-3 py-1 rounded-full font-mono">
                  {selectedBook.publication_year}
                </span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-semibold">
                  {selectedBook.price || 'Open Access'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-black text-amber-200 leading-tight">
                {lang === 'hi' ? selectedBook.title_hindi : selectedBook.title_english}
              </h1>

              <div className="flex items-center space-x-2 text-sm font-bold text-amber-300">
                <User className="w-4 h-4 text-amber-400" />
                <span>लेखक / सम्पादक: {selectedBook.authors}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-950/70 rounded-2xl border border-amber-500/20 text-xs font-mono text-amber-200/90">
                <div>
                  <span className="text-amber-400/70 block text-[10px] uppercase">प्रकाशक</span>
                  <span className="font-bold">{selectedBook.publisher}</span>
                </div>
                <div>
                  <span className="text-amber-400/70 block text-[10px] uppercase">कुल पृष्ठ</span>
                  <span className="font-bold">{selectedBook.pages} पृष्ठ</span>
                </div>
                <div>
                  <span className="text-amber-400/70 block text-[10px] uppercase">ISBN</span>
                  <span className="font-bold text-[11px]">{selectedBook.isbn}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedBook.sample_pdf_url && (
                  <a
                    href={selectedBook.sample_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-bold text-xs rounded-xl shadow-xl flex items-center space-x-2 transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-950" />
                    <span>📄 पूर्ण ग्रंथ PDF देखें / डाउनलोड करें</span>
                  </a>
                )}

                <button
                  onClick={() => handleShareArticle('whatsapp', selectedBook.title_hindi)}
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp शेयर</span>
                </button>

                <button
                  onClick={() => handleShareArticle('copy', selectedBook.title_hindi)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold text-xs rounded-xl border border-amber-500/30 flex items-center space-x-1.5 cursor-pointer transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedArticleLink ? 'लिंक कॉपी हो गया!' : 'लिंक कॉपी करें'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Synopsis & Table of Contents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Synopsis Body */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-amber-900/15 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-slate-900 pb-3 border-b border-amber-900/10 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-red-950" />
                <span>ग्रंथ परिचय एवं विस्तृत सारांश (Synopsis & Overview)</span>
              </h2>

              <div className="prose prose-amber max-w-none text-slate-800 leading-relaxed font-serif space-y-4 text-base">
                {(selectedBook.synopsis_hindi || selectedBook.synopsis_english).split('\n\n').map((para, i) => (
                  <p key={i} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Table of Contents Sidebar */}
          <div className="space-y-6">
            {selectedBook.table_of_contents_hindi && (
              <div className="bg-amber-50/70 border border-amber-300 p-6 rounded-3xl space-y-4 shadow-sm">
                <h3 className="font-serif font-bold text-slate-900 text-base flex items-center space-x-2 pb-2 border-b border-amber-200">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>विषय अनुक्रमणिका (Table of Contents)</span>
                </h3>

                <ul className="space-y-2.5 text-xs text-slate-800 font-medium">
                  {selectedBook.table_of_contents_hindi.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gradient-to-br from-red-950 to-amber-950 p-6 rounded-3xl text-amber-100 space-y-3 shadow-xl border border-amber-500/30">
              <h4 className="font-serif font-bold text-amber-200 text-sm">शोध ग्रंथ ओपन एक्सेस प्रति</h4>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                यह शोध ग्रंथ माँ ताप्ती पवारी शोध संस्थान के शोध संकलन का हिस्सा है। अकादमिक सन्दर्भ हेतु इसका निःशुल्क उपयोग किया जा सकता है।
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2️⃣ DEDICATED FULL-PAGE BLOG READER VIEW (WITH WORD COPY-PASTE FORMATTING)
     ========================================================================= */
  if (selectedBlog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
        {/* Sticky Back Navigation Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-amber-500/30 rounded-2xl text-amber-100 shadow-xl sticky top-4 z-40 backdrop-blur-md">
          <button
            onClick={() => setSelectedBlog(null)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-md"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>{lang === 'hi' ? '← वापस पवारी साहित्य एवं ब्लॉग संग्रह पर जाएं' : '← Back to Pawari Blog List'}</span>
          </button>

          {/* Reader Controls: Font Size Scaling */}
          <div className="flex items-center space-x-3 text-xs font-bold text-amber-200">
            <span>अक्षर आकार:</span>
            <button
              onClick={() => setReaderFontSize(prev => Math.max(14, prev - 2))}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold flex items-center justify-center border border-amber-500/30"
              title="अक्षर छोटा करें"
            >
              A-
            </button>
            <span className="font-mono text-xs text-amber-400">{readerFontSize}px</span>
            <button
              onClick={() => setReaderFontSize(prev => Math.min(26, prev + 2))}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold flex items-center justify-center border border-amber-500/30"
              title="अक्षर बड़ा करें"
            >
              A+
            </button>
          </div>
        </div>

        {/* Blog Article Banner */}
        <div className="space-y-6 bg-white border border-amber-900/15 p-6 sm:p-10 rounded-3xl shadow-md">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-950 text-amber-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-amber-400/30 font-mono">
                {selectedBlog.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center space-x-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{selectedBlog.read_time}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 leading-tight">
              {lang === 'hi' ? selectedBlog.title_hindi : selectedBlog.title_english}
            </h1>

            {/* Author Profile Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-amber-500 shrink-0 shadow-sm">
                  <SafeImage src={selectedBlog.author_avatar || ''} alt={selectedBlog.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{selectedBlog.author}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">{selectedBlog.author_role || 'लेखक एवं शोधकर्ता'}</p>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-500 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>प्रकाशन तिथि: {selectedBlog.date}</span>
              </div>
            </div>
          </div>

          {/* Article Cover Image */}
          {selectedBlog.cover_image && (
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg bg-slate-950">
              <SafeImage src={selectedBlog.cover_image} alt={selectedBlog.title_english} className="w-full h-full object-cover" />
            </div>
          )}

          {/* MAIN RICH TEXT ARTICLE BODY (Supports MS Word / Docs Copy-Paste HTML Formatting) */}
          <div 
            style={{ fontSize: `${readerFontSize}px`, lineHeight: 1.8 }}
            className="prose prose-amber max-w-none text-slate-800 font-serif space-y-6 pt-4 border-t border-slate-100"
          >
            {/* HTML DangerouslySetInnerHTML Render if Contains HTML Tags */}
            {selectedBlog.content_hindi && (selectedBlog.content_hindi.includes('<p>') || selectedBlog.content_hindi.includes('<div>') || selectedBlog.content_hindi.includes('<strong>') || selectedBlog.content_hindi.includes('<h1>')) ? (
              <div dangerouslySetInnerHTML={{ __html: selectedBlog.content_hindi }} />
            ) : (
              /* Line break text parsing with markdown style bold & headings */
              selectedBlog.content_hindi.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('###') || paragraph.startsWith('##')) {
                  return (
                    <h3 key={i} className="font-serif font-bold text-red-950 text-xl sm:text-2xl mt-6 mb-3 border-b border-amber-200 pb-1">
                      {paragraph.replace(/#/g, '').trim()}
                    </h3>
                  );
                }
                if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                  return (
                    <li key={i} className="ml-6 list-disc text-slate-800 font-medium my-1">
                      {paragraph.replace(/^[-*]\s*/, '').trim()}
                    </li>
                  );
                }
                return (
                  <p key={i} className="text-slate-800 leading-relaxed font-normal">
                    {paragraph.trim()}
                  </p>
                );
              })
            )}
          </div>

          {/* Article PDF File Download Bar */}
          {selectedBlog.pdf_url && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center space-x-3 text-xs font-bold text-red-950">
                <FileText className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm">{lang === 'hi' ? 'मूल शोध लेख PDF फ़ाइल डाउनलोड करें' : 'Download Original Article PDF'}</p>
                  <p className="text-xs text-slate-500 font-normal">{lang === 'hi' ? 'अकादमिक अध्ययन हेतु अधिकृत प्रति' : 'Official PDF Document'}</p>
                </div>
              </div>
              <a
                href={selectedBlog.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF'}</span>
              </a>
            </div>
          )}

          {/* Tags & Category Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
            <Tag className="w-4 h-4 text-slate-400" />
            {selectedBlog.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-amber-50 text-amber-900 font-mono px-3 py-1 rounded-full border border-amber-200">
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom Action Bar: Like & Social Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
            <button
              onClick={(e) => handleLikeBlog(e, selectedBlog.id, selectedBlog.likes_count)}
              className="px-5 py-2.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100 transition flex items-center space-x-2 border border-rose-200 cursor-pointer shadow-2xs"
            >
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
              <span>{lang === 'hi' ? 'पसंद करें' : 'Like'} ({likedBlogs[selectedBlog.id] || selectedBlog.likes_count || 0})</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleShareArticle('whatsapp', selectedBlog.title_hindi)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleShareArticle('facebook', selectedBlog.title_hindi)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition"
              >
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleShareArticle('copy', selectedBlog.title_hindi)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold text-xs rounded-xl border border-amber-500/30 flex items-center space-x-1.5 cursor-pointer transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedArticleLink ? 'लिंक कॉपी हो गया!' : 'लिंक कॉपी करें'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     3️⃣ MAIN PAWARI LITERATURE CATALOG & HUB VIEW
     ========================================================================= */
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* ---------------- HERO BANNER ---------------- */}
      <div className="bg-gradient-to-br from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/30 space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hi' ? 'पुस्तकालय एवं वैचारिक मंच' : 'Library & Scholarly Blog'}</span>
            </div>

            <button
              onClick={() => handleOpenPublishModal('book')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-red-950 font-bold text-xs sm:text-sm shadow-xl flex items-center space-x-2 transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <Upload className="w-4 h-4 text-red-950" />
              <span>{lang === 'hi' ? 'अपनी पुस्तक, समीक्षा या ब्लॉग प्रकाशित कराएं' : 'Publish Book, Review or Blog'}</span>
            </button>
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

      {/* ---------------- CULTURAL MODULES TAB VIEW ---------------- */}
      {(activeTab === 'shabdkosh' || activeTab === 'paheli' || activeTab === 'lokgeet' || activeTab === 'quiz') && (
        <section className="space-y-4">
          <PawariCulturalSection initialTab={activeTab} />
        </section>
      )}

      {/* ---------------- BOOKS & MONOGRAPHS GRID ---------------- */}
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
                    <span>{lang === 'hi' ? 'पूरा ग्रंथ पढ़ें →' : 'Read Book →'}</span>
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
                  : (lang === 'hi' ? 'वैचारिक ब्लॉग एवं आलेख' : 'Scholarly Blogs & Articles')}
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
                onClick={() => setSelectedBlog(blog)}
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
                    {lang === 'hi' ? 'पूरा आलेख पढ़ें →' : 'Read Article →'}
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
