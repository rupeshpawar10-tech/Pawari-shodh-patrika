export interface ActivityLogItem {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'status_change' | 'role_change' | 'login' | 'system';
  category: 'books' | 'blogs' | 'users' | 'articles' | 'issues' | 'settings' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz' | 'general';
  title: string;
  details?: string;
  performedBy?: string;
  performedByEmail?: string;
}

export type Role = 'super_admin' | 'director' | 'editorial' | 'editor' | 'public' | string;
export type UserRole = Role;

export interface RolePermissions {
  canManageArticles: boolean;
  canManageIssues: boolean;
  canManageSubmissions: boolean;
  canManagePages: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
  canManageBooks?: boolean;
  canManageBlogs?: boolean;
  canManageOther?: boolean;
}

export interface CustomRole {
  id: string;
  name: string;
  description?: string;
  is_system?: boolean;
  permissions: RolePermissions;
  created_at?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  display_name: string;
  role: Role;
  status: 'active' | 'inactive' | 'suspended' | 'disabled';
  password?: string;
  created_at: string;
  assigned_modules?: string[];
}

export interface Author {
  name: string;
  affiliation?: string;
  email?: string;
  is_corresponding?: boolean;
  orcid?: string;
}

export interface CustomSectionBlock {
  id: string;
  type: 'heading_h2' | 'subheading_h3' | 'paragraph' | 'quote' | 'figure' | 'table' | 'appendix' | 'footnote';
  title?: string;
  content: string;
  caption?: string;
  image_url?: string;
  alt_text?: string;
  is_decorative?: boolean;
  source_credit?: string;
  figure_number?: number;
  placement?: 'in_body' | 'at_end';
  table_data?: { headers: string[]; rows: string[][] };
  parent_section?: 'intro' | 'literature' | 'methodology' | 'results' | 'conclusion' | 'custom';
}

export interface ArticleSection {
  id: string;
  article_id?: string;
  section_type: 'title' | 'abstract' | 'keywords' | 'introduction' | 'literature_review' | 'methodology' | 'results' | 'discussion' | 'conclusion' | 'acknowledgement' | 'references' | 'author_info' | 'custom';
  section_title: string;
  section_title_hindi?: string;
  content_html: string;
  sort_order: number;
  word_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleMedia {
  id: string;
  article_id?: string;
  section_id?: string;
  file_url: string;
  file_name?: string;
  caption?: string;
  figure_number?: number;
  alt_text?: string;
  source_credit?: string;
  copyright_declaration?: string;
  alignment?: 'left' | 'center' | 'right';
  width_percent?: number;
  sort_order?: number;
}

export interface ArticleRevision {
  id: string;
  timestamp: string;
  note: string;
  article_data: Partial<Article>;
}

export interface Article {
  id: string;
  title_hindi: string;
  title_english: string;
  subtitle?: string;
  short_title?: string;
  slug: string;
  article_type?: 'Research Article' | 'Review Article' | 'Case Report' | 'Research Note' | 'Editorial' | 'Book Review' | string;
  authors: Author[];
  abstract_hindi: string;
  abstract_english: string;
  keywords: string[];
  doi?: string;
  pdf_url?: string;
  pdf_storage_path?: string;
  word_url?: string;
  word_storage_path?: string;
  volume: number;
  issue: number;
  year: number;
  month?: string;
  category: string; // e.g. "Pawari Literature", "Linguistics", "Culture & History", "Social Sciences", "Multidisciplinary"
  language: 'Hindi' | 'English' | 'Pawari' | 'Bilingual';
  status: 'published' | 'draft' | 'under_review' | 'revision_required' | 'accepted' | 'rejected' | 'archived' | string;
  page_numbers?: string;
  content_mode?: 'full_text' | 'pdf_only';
  citation_text?: string;
  
  // Additional Author / Metadata fields
  institution?: string;
  department?: string;
  city?: string;
  country?: string;
  corresponding_email?: string;
  license?: string;
  copyright_statement?: string;

  // Article History Dates
  date_received?: string;
  date_revised?: string;
  date_accepted?: string;
  date_published?: string;

  // Full Article Content Sections
  full_text_introduction?: string;
  full_text_literature_review?: string;
  full_text_methodology?: string;
  full_text_results_discussion?: string;
  full_text_conclusion?: string;
  full_text_acknowledgement?: string;
  full_text_conflict_of_interest?: string;
  full_text_funding?: string;
  references?: string[];

  // Structured Sections & Media
  sections?: ArticleSection[];
  media_files?: ArticleMedia[];

  // Optional custom content blocks
  custom_sections?: CustomSectionBlock[];

  // Editorial comments & history
  editorial_comments?: string;
  revisions_history?: ArticleRevision[];

  views_count?: number;
  downloads_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: string;
  title_hindi: string;
  title_english: string;
  volume: number;
  issue_number: number;
  year: number;
  month: string;
  cover_image_url?: string;
  status: 'current' | 'published' | 'draft' | 'archived';
  editorial_note_hindi?: string;
  editorial_note_english?: string;
  publication_date: string;
  created_at: string;
}

export interface EditorialMember {
  id: string;
  name_hindi: string;
  name_english: string;
  role: string;
  affiliation_hindi?: string;
  affiliation_english?: string;
  designation_hindi?: string;
  designation_english?: string;
  photo_url?: string;
  email?: string;
  research_areas?: string[];
  subject_areas?: string[];
  bio_hindi?: string;
  bio_english?: string;
  order: number;
}

export interface Announcement {
  id: string;
  title_hindi: string;
  title_english: string;
  content_hindi: string;
  content_english: string;
  date: string;
  is_important?: boolean;
  is_active: boolean;
  link_url?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  storage_path: string;
  type: string; // 'pdf' | 'image'
  size: number;
  uploaded_at: string;
  uploaded_by?: string;
}

export interface HomepageSection {
  id: string;
  key: 'hero' | 'about_summary' | 'latest_issue' | 'featured_articles' | 'director_message' | 'announcements' | 'editorial_board_teaser' | 'journal_stats' | 'indexing_badges';
  title_hindi: string;
  title_english: string;
  visible: boolean;
  order: number;
}

export type ThemePreset = 'maroon_gold' | 'academic_navy' | 'emerald_teal' | 'slate_classic' | 'burgundy_wine' | 'custom';

export interface CallForPapersSettings {
  title_badge_english?: string;
  title_badge_hindi?: string;
  heading_english?: string;
  heading_hindi?: string;
  description_english?: string;
  description_hindi?: string;
  deadline_date?: string;
  target_volume_issue?: string;
  is_active?: boolean;
}

export interface JournalMetricsSettings {
  impact_factor_label?: string;
  impact_factor_value?: string;
  peer_review_text?: string;
  indexing_badge_1?: string;
  indexing_badge_2?: string;
  indexing_badge_3?: string;
  indexing_badge_4?: string;
}

export interface JournalSettings {
  journal_title_hindi: string;
  journal_title_english: string;
  subtitle_hindi: string;
  subtitle_english: string;
  logo_url: string;
  issn_online: string;
  issn_print: string;
  publisher_hindi: string;
  publisher_english: string;
  frequency_hindi: string;
  frequency_english: string;
  language_policy: string;
  contact_email: string;
  contact_phone: string;
  contact_address_hindi: string;
  contact_address_english: string;
  footer_text_hindi: string;
  footer_text_english: string;
  manuscript_template_url?: string;
  manuscript_template_name?: string;
  copyright_form_url?: string;
  copyright_form_name?: string;
  call_for_papers?: CallForPapersSettings;
  journal_metrics?: JournalMetricsSettings;
  homepage_sections: HomepageSection[];
  theme_preset?: ThemePreset;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  navigation_labels: {
    home_hindi: string;
    home_english: string;
    about_hindi: string;
    about_english: string;
    current_issue_hindi: string;
    current_issue_english: string;
    archive_hindi: string;
    archive_english: string;
    articles_hindi: string;
    articles_english: string;
    books_blogs_hindi?: string;
    books_blogs_english?: string;
    editorial_board_hindi: string;
    editorial_board_english: string;
    author_guidelines_hindi: string;
    author_guidelines_english: string;
    contact_hindi: string;
    contact_english: string;
  };
}

export interface PageContent {
  id: string; // 'about' | 'director_message' | 'author_guidelines' | 'ethics_policy'
  title_hindi: string;
  title_english: string;
  content_hindi: string;
  content_english: string;
  banner_url?: string;
  updated_at: string;
}

export interface ReviewerAssignment {
  id: string;
  reviewer_id?: string;
  reviewer_name: string;
  reviewer_email?: string;
  assigned_at: string;
  status: 'pending' | 'in_progress' | 'completed' | 'declined';
  comments?: string;
  score?: number; // 1 to 5 rating
  recommendation?: 'accept' | 'minor_revision' | 'major_revision' | 'reject';
  reviewed_at?: string;
}

export interface Submission {
  id: string;
  author_name: string;
  email: string;
  title: string;
  title_hindi?: string;
  abstract?: string;
  abstract_hindi?: string;
  category?: string;
  paper_type?: string;
  co_authors?: string;
  affiliation?: string;
  doi?: string;
  keywords?: string;
  license_type?: string;
  file_url?: string;
  file_name?: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'revision_requested';
  submitted_at: string;
  assigned_reviewers?: ReviewerAssignment[];
  editorial_comments?: string;
  review_score?: number;
  converted_article_id?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read';
}

export interface PawariShabdkoshItem {
  id: string;
  word_pawari: string;
  pronunciation_hindi?: string;
  meaning_hindi: string;
  meaning_english?: string;
  example_pawari?: string;
  example_hindi?: string;
  category: string;
  image_url?: string;
  audio_url?: string;
  slug?: string;
  contributor_name?: string;
  contributor_email?: string;
  editorial_comments?: string;
  status: 'draft' | 'pending' | 'changes_requested' | 'approved' | 'published' | 'rejected' | string;
  created_at: string;
}

export interface PawariPaheliItem {
  id: string;
  riddle_pawari: string;
  answer_hindi: string;
  answer_pawari?: string;
  hint_hindi?: string;
  explanation_hindi?: string;
  category: string;
  image_url?: string;
  slug?: string;
  contributor_name?: string;
  contributor_email?: string;
  editorial_comments?: string;
  status: 'draft' | 'pending' | 'changes_requested' | 'approved' | 'published' | 'rejected' | string;
  created_at: string;
}

export interface PawariLokgeetItem {
  id: string;
  title_pawari: string;
  title_hindi?: string;
  category: string;
  lyrics_pawari: string;
  lyrics_hindi_meaning?: string;
  singer_or_collector?: string;
  audio_url?: string;
  youtube_url?: string;
  image_url?: string;
  slug?: string;
  contributor_name?: string;
  contributor_email?: string;
  editorial_comments?: string;
  status: 'draft' | 'pending' | 'changes_requested' | 'approved' | 'published' | 'rejected' | string;
  created_at: string;
}

export type QuizCategoryType = 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'general' | 'writers' | 'articles';

export interface QuizQuestion {
  id: string;
  question_pawari: string;
  question_hindi: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
  section_type: QuizCategoryType;
  difficulty?: 'easy' | 'medium' | 'hard';
  cultural_notes?: string;
}

export interface QuizCertificate {
  id: string;
  user_name: string;
  user_photo_url?: string;
  quiz_score: number;
  total_questions: number;
  percentage: number;
  issued_date: string;
  certificate_no: string;
  exam_title?: string;
  grade?: string;
  category_breakdown?: Record<string, { score: number; total: number }>;
  verification_url?: string;
  patron_name?: string;
  chief_editor_name?: string;
}

export interface QuizLeaderboardEntry {
  id: string;
  user_name: string;
  user_photo_url?: string;
  quiz_score: number;
  total_questions: number;
  percentage: number;
  issued_date: string;
  certificate_no: string;
  created_at?: string;
  grade?: string;
}

export interface PawariWriterItem {
  id: string;
  name_hindi: string;
  name_english: string;
  photo_url?: string;
  designation_hindi?: string;
  designation_english?: string;
  designation?: string; // alias
  location_hindi?: string;
  location_english?: string;
  region?: string; // alias
  bio_hindi: string;
  bio_english?: string;
  biography_hindi?: string; // alias
  specialization_hindi?: string | string[];
  specialization?: string[]; // alias
  awards_hindi?: string[];
  awards_honors?: string[]; // alias
  published_books?: string[];
  published_blogs?: string[];
  contact_email?: string;
  email?: string; // alias
  contact_phone?: string;
  phone?: string; // alias
  website_url?: string;
  social_links?: {
    facebook?: string;
    youtube?: string;
    wikipedia?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  books_count?: number;
  is_featured?: boolean;
  status: 'approved' | 'pending' | 'rejected' | string;
  slug?: string;
  created_at: string;
}

