import { JournalSettings, PageContent, Article, Issue, EditorialMember, Announcement, UserProfile } from '../types';

export const DEFAULT_SETTINGS: JournalSettings = {
  journal_title_hindi: 'पवारी शोध पत्रिका',
  journal_title_english: 'Pawari Shodh Patrika',
  subtitle_hindi: 'भाषा, साहित्य, संस्कृति एवं समाजशास्त्र की अंतर्राष्ट्रीय बहुविषयी शोध पत्रिका',
  subtitle_english: 'An International Multidisciplinary Peer-Reviewed Research Journal of Language, Literature, Culture & Social Sciences',
  logo_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&auto=format&fit=crop&q=80',
  issn_online: 'Applied For',
  issn_print: 'Applied For',
  publisher_hindi: 'माँ ताप्ती शोध संस्थान, मुलताई',
  publisher_english: 'Maa Tapti Research Institute, Multai',
  frequency_hindi: 'अर्द्धवार्षिक (छमाही - जून एवं दिसंबर)',
  frequency_english: 'Half-Yearly (June & December)',
  language_policy: 'Hindi / English (द्विभाषी - हिंदी एवं अंग्रेजी)',
  contact_email: 'maa.tapti.shodh.sansthan@gmail.com',
  contact_phone: '8604476649, 9975981957',
  contact_address_hindi: 'माँ ताप्ती शोध संस्थान, अनुसंधान एवं प्रकाशन विभाग, मुलताई – 460661, ज़िला बैतूल, मध्यप्रदेश, भारत',
  contact_address_english: 'Maa Tapti Research Institute, Research & Publication Dept., Multai – 460661, District Betul, Madhya Pradesh, India',
  footer_text_hindi: '© 2025 पवारी शोध पत्रिका। सर्वाधिकार सुरक्षित। माँ ताप्ती शोध संस्थान, मुलताई द्वारा प्रकाशित।',
  footer_text_english: '© 2025 Pawari Shodh Patrika. All Rights Reserved. Published by Maa Tapti Research Institute, Multai, India.',
  call_for_papers: {
    title_badge_english: 'Call for Papers 2025',
    title_badge_hindi: 'शोध पत्र आमंत्रण 2025',
    heading_english: 'Submit Manuscript for Next Issue',
    heading_hindi: 'शोध पत्र सबमिशन हेतु आमंत्रण',
    description_english: 'Fast-track peer review process. Zero publication fees.',
    description_hindi: 'पीर-रिव्यू प्रक्रिया। शून्य प्रकाशन शुल्क।',
    deadline_date: '31st May',
    target_volume_issue: 'Vol. 1 Issue 1',
    is_active: true
  },
  journal_metrics: {
    impact_factor_label: 'Peer-Reviewed & Open Access Journal',
    impact_factor_value: 'Bilingual',
    peer_review_text: 'Refereed & Double-Blind Peer Reviewed',
    indexing_badge_1: 'Google Scholar',
    indexing_badge_2: 'Zenodo',
    indexing_badge_3: 'ResearchGate',
    indexing_badge_4: 'Academia.edu'
  },
  theme_preset: 'maroon_gold',
  primary_color: '#420708',
  secondary_color: '#7f1d1d',
  accent_color: '#d97706',
  homepage_sections: [
    { id: 'sec-1', key: 'hero', title_hindi: 'मुख्य बैनर', title_english: 'Hero Banner', visible: true, order: 1 },
    { id: 'sec-2', key: 'announcements', title_hindi: 'सूचनाएं एवं समाचार', title_english: 'Announcements & News', visible: true, order: 2 },
    { id: 'sec-3', key: 'about_summary', title_hindi: 'पत्रिका परिचय', title_english: 'About Journal', visible: true, order: 3 },
    { id: 'sec-4', key: 'latest_issue', title_hindi: 'वर्तमान अंक', title_english: 'Latest Issue Highlight', visible: true, order: 4 },
    { id: 'sec-5', key: 'featured_articles', title_hindi: 'प्रमुख शोध पत्र', title_english: 'Featured Research Papers', visible: true, order: 5 },
    { id: 'sec-6', key: 'director_message', title_hindi: 'संरक्षक संदेश', title_english: 'Patron Message', visible: true, order: 6 },
    { id: 'sec-7', key: 'journal_stats', title_hindi: 'शोध आंकड़े', title_english: 'Journal Metrics & Impact', visible: true, order: 7 },
    { id: 'sec-8', key: 'editorial_board_teaser', title_hindi: 'संपादकीय मंडल', title_english: 'Editorial Leadership', visible: true, order: 8 },
    { id: 'sec-9', key: 'indexing_badges', title_hindi: 'इंडेक्सिंग एवं इंडेक्स', title_english: 'Indexing & Databases', visible: true, order: 9 },
  ],
  navigation_labels: {
    home_hindi: 'मुख्य पृष्ठ',
    home_english: 'Home',
    about_hindi: 'पत्रिका के बारे में',
    about_english: 'About Journal',
    current_issue_hindi: 'वर्तमान अंक',
    current_issue_english: 'Current Issue',
    archive_hindi: 'पुराने अंक (संग्रह)',
    archive_english: 'Archive',
    articles_hindi: 'पुस्तकें एवं ब्लॉग',
    articles_english: 'Books & Blogs',
    books_blogs_hindi: 'पुस्तकें एवं ब्लॉग',
    books_blogs_english: 'Books & Blogs',
    editorial_board_hindi: 'संपादकीय मंडल',
    editorial_board_english: 'Editorial Board',
    author_guidelines_hindi: 'लेखक निर्देश',
    author_guidelines_english: 'Author Guidelines',
    contact_hindi: 'संपर्क करें',
    contact_english: 'Contact Us',
  },
};

export const DEFAULT_PAGES: Record<string, PageContent> = {
  about: {
    id: 'about',
    title_hindi: 'पवारी शोध पत्रिका - परिचय एवं उद्देश्य',
    title_english: 'About Pawari Shodh Patrika - Aims & Scope',
    content_hindi: `
### शोध पत्रिका का परिचय
**पवारी शोध पत्रिका (Pawari Shodh Patrika)** एक अंतर्राष्ट्रीय, द्विभाषी एवं अर्द्धवार्षिक (Half-Yearly) पीर-रिव्यूड (Peer-Reviewed) बहुविषयी शोध पत्रिका है। इस पत्रिका का मुख्य उद्देश्य मध्य भारत की समृद्ध लोकसंस्कृति, पवारी बोली/भाषा, साहित्य, इतिहास, समाजशास्त्र, लोककला तथा मानविकी विषयों में गुणवत्तापूर्ण एवं मौलिक शोध को प्रोत्साहित करना है।

### प्रमुख उद्देश्य एवं क्षेत्र (Aims & Scope)
1. **पवारी भाषा एवं साहित्य का संरक्षण:** पवारी बोली के ध्वनिविज्ञान, व्याकरण, शब्दकोश एवं मौखिक परंपराओं का वैज्ञानिक अध्ययन।
2. **सतपुड़ा-वैनगंगा अंचल का लोकसाहित्य:** बालाघाट, गोंदिया, छिंदवाड़ा, सिवनी तथा भंडारा क्षेत्र की सांस्कृतिक धरोहर पर शोध प्रस्तुत करना।
3. **बहुविषयी मानविकी शोध:** समाजशास्त्र, इतिहास, भाषाविज्ञान, शिक्षाशास्त्र, लोककला तथा तुलनात्मक साहित्य।
4. **पीर-रिव्यू प्रक्रिया:** सभी प्रविष्टियों का डबल-ब्लाइंड पीर-रिव्यू (Double-Blind Peer Review) किया जाता है ताकि उच्च अकादमिक मानकों को सुनिश्चित किया जा सके।
5. **ओपन एक्सेस नीति (Open Access Policy):** यह पत्रिका पूर्णतः खुला पहुंच प्रदान करती है जिससे ज्ञान का प्रसार वैश्विक स्तर पर निष्पक्ष रूप से हो सके।
    `,
    content_english: `
### About the Journal
**Pawari Shodh Patrika** is an international, peer-reviewed, multidisciplinary research journal dedicated to advancing scholarly inquiry into the Pawari language, culture, folk literature, social sciences, history, and humanities of Central India.

### Aims & Scope
1. **Linguistics & Dialectology:** Scientific exploration of Pawari vocabulary, phonetics, grammar, and oral traditions.
2. **Regional Cultural Heritage:** Preserving the folk songs, rituals, and indigenous knowledge systems of Satpura and Wainganga basin (Balaghat, Gondia, Seoni, Chhindwara, Bhandara).
3. **Multidisciplinary Humanities:** Research spanning Sociology, History, Anthropology, Comparative Literature, and Folk Arts.
4. **Rigorous Peer Review:** Following standard double-blind peer review to maintain high academic integrity.
5. **Open Access:** Providing immediate, barrier-free access to all published research articles to foster international knowledge sharing.
    `,
    banner_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
    updated_at: '2026-01-15',
  },
  director_message: {
    id: 'director_message',
    title_hindi: 'संरक्षक एवं निदेशक का संदेश',
    title_english: "Director & Patron's Message",
    content_hindi: `
प्रिय शोधार्थियों, विद्वानों एवं पाठकों,

**पवारी शोध पत्रिका** के माध्यम से हमें मध्य भारत की अनमोल भाषाई एवं सांस्कृतिक विरासत को वैश्विक अकादमिक पटल पर प्रस्तुत करते हुए अत्यंत हर्ष हो रहा है।

हमारी पवारी भाषा न केवल अभिव्यक्ति का माध्यम है, बल्कि इसमें शताब्दियों का लोकज्ञान, पारिस्थितिकीय समझ और सामाजिक समरसता निहित है। आधुनिकता और वैश्विक बदलावों के दौर में क्षेत्रीय बोलियों और लोकसाहित्य को वैज्ञानिक दृष्टि से लिपिबद्ध करना और उनका गंभीर अध्ययन करना हम सभी का नैतिक दायित्व है।

यह पत्रिका केवल एक प्रकाशन मंच नहीं है, बल्कि यह एक अकादमिक क्रांति है जो ग्रामीण एवं अंचलीय शोधार्थियों को अंतर्राष्ट्रीय स्तर के शोध मानकों से जोड़ती है। मैं सभी युवा शोधकर्ताओं और वरिष्ठ विद्वानों का आह्वान करता हूं कि वे अपने मौलिक शोध ग्रंथों से इस पत्रिका को समृद्ध करें।

सादर,
**डॉ. बी. एल. पवार**
संरक्षक एवं निदेशक, पवारी शोध संस्थान
    `,
    content_english: `
Dear Scholars, Researchers, and Readers,

It gives me immense pride and joy to welcome you to **Pawari Shodh Patrika**, a dedicated academic vehicle designed to bring the rich linguistic, historical, and cultural heritage of Central India into global scholarly discourse.

The Pawari dialect carries centuries of oral history, ecological wisdom, and social harmony. In an era of rapid globalization, documenting and analyzing regional languages through rigorous scientific frameworks is a crucial responsibility.

Pawari Shodh Patrika serves as a bridge connecting grassroots researchers with international peer-reviewed standards. We invite scholars across disciplines to contribute original, high-impact research.

Warm regards,
**Dr. B. L. Pawar**
Patron & Director, Pawari Shodh Institute
    `,
    banner_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80',
    updated_at: '2026-01-10',
  },
  author_guidelines: {
    id: 'author_guidelines',
    title_hindi: 'शोधकर्ताओं एवं लेखकों के लिए दिशानिर्देश',
    title_english: 'Guidelines for Authors and Contributors',
    content_hindi: `शोध पत्र प्रस्तुतिकरण नियम (Manuscript Submission Rules)

1. भाषा एवं प्रारूप: शोध पत्र हिंदी (Kruti Dev / Mangal / Unicode), पवारी या अंग्रेजी में स्वीकार किए जाते हैं।
2. शब्द सीमा: शोध पत्र साधारणतः 3000 से 5000 शब्दों के बीच होना चाहिए (सामान्य लेख 1000-1500 शब्द)।
3. आवश्यक संरचना:
   • शीर्षक: हिंदी एवं अंग्रेजी दोनों में अनिवार्य।
   • शोध सार (Abstract): 150-250 शब्द (हिंदी और अंग्रेजी दोनों में)।
   • बीज शब्द (Keywords): 4 से 6 कीवर्ड।
   • मुख्य पाठ: प्रस्तावना, शोध विधि/साहित्य समीक्षा, विश्लेषण/विवेचना, निष्कर्ष।
   • संदर्भ सूची (References): APA (American Psychological Association) 7th Edition शैली में।
4. मौलिकता एवं प्लेगेरिज्म (Plagiarism): शोध पत्र पूर्णतः मौलिक एवं अप्रकाशित होना चाहिए। प्लेगेरिज्म 10% से अधिक होने पर प्रविष्टि निरस्त कर दी जाएगी।
5. प्रकाशक एवं सर्वाधिकार: सर्वाधिकार माँ ताप्ती शोध संस्थान मुलताई के पास सुरक्षित रहेंगे।
6. प्रकाशन शुल्क (Processing Fee): पत्रिका किसी भी प्रकार का व्यावसायिक या अनिवार्य प्रकाशन शुल्क नहीं लेती (Non-Commercial Open Access)।`,
    content_english: `Manuscript Preparation & Submission Rules

1. Language & Font: Manuscripts can be written in Hindi (Unicode/Mangal/Krutidev 010), Pawari, or English (Times New Roman, 12pt).
2. Word Count: Research articles should typically range between 3,000 to 5,000 words. General articles: 1,000 to 1,500 words.
3. Required Article Structure:
   • Title in both Hindi and English
   • Bilingual Abstract (150-250 words in both English and Hindi)
   • Keywords (4-6 index terms)
   • Main Body: Introduction, Literature Review, Methodology, Results/Analysis, Conclusion
   • References in APA 7th Edition format
4. Plagiarism Policy: All manuscripts are screened using similarity software. Similarity index must be below 10%.
5. Originality & Ethics: Submissions must be original and unpublished. Authors hold full responsibility for the content.
6. Article Processing Charge (APC): Pawari Shodh Patrika is an open-access academic initiative with no mandatory publication fees for independent researchers.`,
    banner_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
    updated_at: '2026-01-20',
  },
};

export const SAMPLE_ISSUES: Issue[] = [
  {
    id: 'issue-v2i1-2026',
    title_hindi: 'वर्ष 2, अंक 1 (जनवरी - जून 2026) - वर्तमान अंक',
    title_english: 'Volume 2, Issue 1 (Jan - Jun 2026) - Current Issue',
    volume: 2,
    issue_number: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    status: 'current',
    editorial_note_hindi: 'इस अंक में सतपुड़ा-वैनगंगा अंचल की बोलियों, लोकसाहित्य एवं सामाजिक संरचना पर आधारित 5 उत्कृष्ट पीर-रिव्यूड शोध पत्र सम्मिलित हैं।',
    editorial_note_english: 'This current issue features 5 peer-reviewed articles covering Central Indian dialectology, folk traditions, and sociological frameworks.',
    publication_date: '2026-06-15',
    created_at: '2026-06-01',
  },
  {
    id: 'issue-v1i2-2025',
    title_hindi: 'वर्ष 1, अंक 2 (जुलाई - दिसंबर 2025)',
    title_english: 'Volume 1, Issue 2 (Jul - Dec 2025)',
    volume: 1,
    issue_number: 2,
    year: 2025,
    month: 'Jul - Dec 2025',
    cover_image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    editorial_note_hindi: 'विशेष अंक: पवारी लोकगीत, पर्यावरण चेतना एवं भाषावैज्ञानिक संरचना।',
    editorial_note_english: 'Special Issue focusing on Pawari folk songs, environmental consciousness, and linguistic structures.',
    publication_date: '2025-12-20',
    created_at: '2025-12-10',
  },
  {
    id: 'issue-v1i1-2025',
    title_hindi: 'वर्ष 1, अंक 1 (जनवरी - जून 2025) - उद्घाटन अंक',
    title_english: 'Volume 1, Issue 1 (Jan - Jun 2025) - Inaugural Issue',
    volume: 1,
    issue_number: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    editorial_note_hindi: 'पवारी शोध पत्रिका का ऐतिहासिक उद्घाटन अंक जिसमें पवारी भाषा की उत्पत्ति और सांस्कृतिक पहचान पर मौलिक ग्रंथ हैं।',
    editorial_note_english: 'Inaugural edition exploring the historic origins of the Pawari dialect and regional cultural anthropology.',
    publication_date: '2025-06-30',
    created_at: '2025-06-01',
  },
];

// Sample public PDF data URL so the viewer renders instantly out of the box
const SAMPLE_PDF_BLOB = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: 'art-001',
    title_hindi: 'पवारी भाषा का उद्भव, विकास एवं उसकी ध्वन्यात्मक विशेषताएँ: एक भाषावैज्ञानिक अध्ययन',
    title_english: 'Origin, Evolution and Phonetic Characteristics of Pawari Dialect: A Linguistic Study',
    slug: 'origin-evolution-phonetic-characteristics-pawari-dialect',
    authors: [
      { name: 'डॉ. रामेश्वर पवार', affiliation: 'विभागाध्यक्ष, भाषाविज्ञान विभाग, शासकीय स्नातकोत्तर महाविद्यालय, बालाघाट', email: 'r.pawar@balaghat.edu.in', is_corresponding: true },
      { name: 'प्रो. सुनीता शिंदे', affiliation: 'सहायक प्राध्यापक, हिंदी विभाग, नागपुर विश्वविद्यालय', email: 'sunita.shinde@nagpur.ac.in' }
    ],
    abstract_hindi: 'प्रस्तुत शोध पत्र में मध्य भारत के सतपुड़ा एवं वैनगंगा मैदानी क्षेत्र में बोली जाने वाली पवारी बोली की ध्वन्यात्मक एवं व्याकरणिक विशेषताओं का गहन भाषावैज्ञानिक विश्लेषण प्रस्तुत किया गया है। शोध में पाया गया कि पवारी में राजस्थानी, मराठी एवं मालवी भाषा-परिवार के तत्त्वों का सुंदर समन्वय है। अध्ययन में पवारी के विशिष्ट स्वर एवं व्यंजन ध्वनियों का आरेखीय एवं तुलनात्मक विवरण दिया गया है।',
    abstract_english: 'This research paper presents a comprehensive linguistic analysis of the phonetic and grammatical features of the Pawari dialect spoken across the Satpura and Wainganga plains of Central India. The study reveals a unique confluence of Indo-Aryan elements including Rajasthani, Marathi, and Malvi roots. The paper systematically documents the vowel inventory, phonemes, and tonal variations unique to Pawari.',
    keywords: ['पवारी बोली (Pawari Dialect)', 'ध्वनिविज्ञान (Phonetics)', 'भाषाविज्ञान (Linguistics)', 'सतपुड़ा अंचल (Satpura Region)', 'मध्य भारत (Central India)'],
    doi: '10.5281/zenodo.psp.2026.0101',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-001-pawari-phonetics.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Linguistics & Dialectology',
    language: 'Hindi',
    status: 'published',
    page_numbers: '01–14',
    views_count: 342,
    downloads_count: 128,
    created_at: '2026-06-10',
    updated_at: '2026-06-15',
  },
  {
    id: 'art-002',
    title_hindi: 'सतपुड़ा एवं वैनगंगा अंचल के लोकगीतों में पवारी संस्कृति के विविध रंग',
    title_english: 'Diverse Shades of Pawari Culture in Folk Songs of Satpura and Wainganga Region',
    slug: 'diverse-shades-pawari-culture-folk-songs',
    authors: [
      { name: 'डॉ. अनिमेश देशमुख', affiliation: 'शोध निदेशक, लोकसाहित्य केंद्र, गोंदिया', email: 'animesh.d@folklore.org', is_corresponding: true }
    ],
    abstract_hindi: 'लोकगीत किसी भी समुदाय की आत्मा और सांस्कृतिक दर्पण होते हैं। पवारी समाज में जन्मोत्सव, विवाह, कृषि कार्य एवं पर्व-त्योहारों पर गाए जाने वाले लोकगीतों में जीवनदर्शन की गभीर अभिव्यक्तियाँ मिलती हैं। इस अध्ययन में बालाघाट और भंडारा जिले के 50 से अधिक पारंपरिक पवारी लोकगीतों का संकलन एवं सांस्कृतिक विश्लेषण किया गया है।',
    abstract_english: 'Folk music acts as the cultural repository of community heritage. In the Pawari community, traditional songs associated with agricultural cycles, wedding rituals, and seasonal festivals reflect profound folk wisdom. This paper documents over 50 authentic Pawari folk songs collected across Balaghat and Bhandara districts, categorizing their social and artistic motifs.',
    keywords: ['लोकगीत (Folk Songs)', 'पवारी संस्कृति (Pawari Culture)', 'कृषि लोकगाथा (Agricultural Folklore)', 'बालाघाट (Balaghat)', 'सांस्कृतिक अध्ययन (Cultural Studies)'],
    doi: '10.5281/zenodo.psp.2026.0102',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-002-pawari-culture.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Culture & Folk Literature',
    language: 'Hindi',
    status: 'published',
    page_numbers: '15–28',
    views_count: 289,
    downloads_count: 94,
    created_at: '2026-06-12',
    updated_at: '2026-06-15',
  },
  {
    id: 'art-003',
    title_hindi: 'मध्य भारत में सामाजिक-सांस्कृतिक पहचान एवं बोली संरक्षण: पवार समुदाय का विशेष अध्ययन',
    title_english: 'Socio-Cultural Identity and Preservation of Dialects in Central India: Special Reference to Powari Speaking Community',
    slug: 'socio-cultural-identity-preservation-powari-community',
    authors: [
      { name: 'Dr. Vijay K. Harinkhede', affiliation: 'Department of Sociology, Central University of Madhya Pradesh', email: 'v.harinkhede@cump.ac.in', is_corresponding: true },
      { name: 'Dr. Neha Bisen', affiliation: 'Research Fellow, ICSSR New Delhi', email: 'neha.bisen@icssr.org' }
    ],
    abstract_hindi: 'वैश्वीकरण के युग में क्षेत्रीय भाषाओं और जातियों की सांस्कृतिक पहचान के सामने कई चुनौतियाँ खड़ी हुई हैं। यह पत्र पवार समुदाय में बोली जाने वाली पवारी भाषा के संरक्षण के सामाजिक प्रयासों, डिजीटल माध्यमों तथा सामुदायिक पहल का मूल्याँकन करता है।',
    abstract_english: 'Globalization poses significant threats to endangered regional dialects and community identities. This research paper evaluates community-driven initiatives, digital archiving, and literary platforms established by the Powari speaking diaspora in Central India to safeguard their linguistic heritage against language shift.',
    keywords: ['Powari Community', 'Sociolinguistics', 'Cultural Preservation', 'Central India', 'Language Shift'],
    doi: '10.5281/zenodo.psp.2026.0103',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-003-powari-identity.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Social Sciences',
    language: 'English',
    status: 'published',
    page_numbers: '29–42',
    views_count: 410,
    downloads_count: 176,
    created_at: '2026-06-14',
    updated_at: '2026-06-15',
  },
  {
    id: 'art-004',
    title_hindi: 'पवारी लोककथाओं में पर्यावरणीय चेतना एवं वैनगंगा नदी घाटी का जैव-विविधता दर्शन',
    title_english: 'Environmental Consciousness and Ethno-Ecological Wisdom in Pawari Folktales',
    slug: 'environmental-consciousness-ethno-ecological-wisdom-pawari-folktales',
    authors: [
      { name: 'सविता बिसेन', affiliation: 'शोधार्थी, पर्यावरण एवं हिंदी साहित्य विभाग, छिंदवाड़ा विश्वविद्यालय', email: 'savita.bisen@chhindwara.ac.in', is_corresponding: true }
    ],
    abstract_hindi: 'पवारी लोककथाओं में प्रकृति, वनों, नदियों तथा वन्यजीवों के साथ मानव के घनिष्ठ संबंधों का चित्रांकन मिलता है। वैनगंगा नदी घाटी में प्रचलित पवारी दंतकथाओं के माध्यम से प्राकृतिक संसाधनों के विवेकपूर्ण उपयोग एवं संरक्षण की प्राचीन परंपरा का साक्ष्य प्राप्त होता है।',
    abstract_english: 'Ethno-ecological narratives embedded in Indigenous folklore offer key insights into sustainable living. This study analyzes oral storytelling traditions within the Pawari speaking belts of the Wainganga river basin, illustrating ancient conservation ethics and human-nature harmony.',
    keywords: ['पर्यावरण साहित्य (Eco-Literature)', 'लोककथाएँ (Folktales)', 'वैनगंगा नदी (Wainganga River)', 'पारिस्थितिकी (Ecology)', 'पवारी बोली (Pawari)'],
    doi: '10.5281/zenodo.psp.2025.0201',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-004-eco-wisdom.pdf',
    volume: 1,
    issue: 2,
    year: 2025,
    month: 'Jul - Dec 2025',
    category: 'Environmental Humanities',
    language: 'Hindi',
    status: 'published',
    page_numbers: '01–16',
    views_count: 512,
    downloads_count: 205,
    created_at: '2025-12-15',
    updated_at: '2025-12-20',
  },
  {
    id: 'art-005',
    title_hindi: 'डिजिटल आर्काइविंग एवं पवारी शब्दावली का देवनागरी मानकीकरण',
    title_english: 'Digital Documentation and Devanagari Standardization of Pawari Vocabulary',
    slug: 'digital-documentation-devanagari-standardization-pawari-vocabulary',
    authors: [
      { name: 'Prof. Rajesh Kumar Tembhare', affiliation: 'Department of Computer Science & Humanities, NIT Nagpur', email: 'r.tembhare@nitn.ac.in', is_corresponding: true }
    ],
    abstract_hindi: 'डिजिटल युग में अलिखित बोलियों का संगणकीय प्रसंस्करण (Computational Processing) अत्यंत आवश्यक है। इस शोध पत्र में पवारी बोली के 5000+ मूल शब्दों का कोषीय डेटाबेस तैयार करने तथा देवनागरी लिपि में उनके मानकीकृत वर्तनी नियमों के निर्धारण की पद्धति साझा की गई है।',
    abstract_english: 'Computational linguistics plays a decisive role in archiving vulnerable dialects. This research outlines a digital lexicography framework developed to digitize and standardize 5,000+ core Pawari lexemes into Unicode Devanagari format for Natural Language Processing (NLP) applications.',
    keywords: ['Computational Linguistics', 'Digital Lexicography', 'Devanagari Unicode', 'NLP for Dialects', 'Pawari Dictionary'],
    doi: '10.5281/zenodo.psp.2025.0202',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-005-digital-lexicography.pdf',
    volume: 1,
    issue: 2,
    year: 2025,
    month: 'Jul - Dec 2025',
    category: 'Computational Linguistics',
    language: 'English',
    status: 'published',
    page_numbers: '17–32',
    views_count: 620,
    downloads_count: 280,
    created_at: '2025-12-18',
    updated_at: '2025-12-20',
  },
];

export const SAMPLE_EDITORIAL_BOARD: EditorialMember[] = [
  {
    id: 'ed-001',
    name_hindi: 'डॉ. बी. एल. पवार',
    name_english: 'Dr. B. L. Pawar',
    role: 'Patron',
    designation_hindi: 'संरक्षक एवं संस्थापक निदेशक',
    designation_english: 'Patron & Founder Director',
    affiliation_hindi: 'पवारी शोध एवं लोकसाहित्य संस्थान, मध्य प्रदेश',
    affiliation_english: 'Pawari Research & Folklore Institute, Madhya Pradesh',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    email: 'director@pawarishodh.org',
    research_areas: ['पवारी लोकसाहित्य (Pawari Folklore)', 'सांस्कृतिक नृविज्ञान (Cultural Anthropology)', 'क्षेत्रीय इतिहास (Regional History)'],
    order: 1,
  },
  {
    id: 'ed-002',
    name_hindi: 'प्रो. (डॉ.) रमाकांत शर्मा',
    name_english: 'Prof. (Dr.) Ramakant Sharma',
    role: 'Chief Editor',
    designation_hindi: 'मुख्य संपादक',
    designation_english: 'Chief Editor',
    affiliation_hindi: 'प्रोफेसर एवं पूर्व अध्यक्ष, भाषाविज्ञान एवं हिंदी विभाग, केंद्रीय विश्वविद्यालय',
    affiliation_english: 'Professor & Former Head, Dept. of Linguistics & Hindi, Central University',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    email: 'chiefeditor@pawarishodh.org',
    research_areas: ['भाषाविज्ञान (Linguistics)', 'तुलनात्मक साहित्य (Comparative Literature)', 'ध्वनिविज्ञान (Phonetics)'],
    order: 2,
  },
  {
    id: 'ed-003',
    name_hindi: 'डॉ. सीमा चौधरी',
    name_english: 'Dr. Seema Choudhary',
    role: 'Executive Editor',
    designation_hindi: 'कार्यकारी संपादक',
    designation_english: 'Executive Editor',
    affiliation_hindi: 'एसोसिएट प्रोफेसर, समाजशास्त्र विभाग, नागपुर',
    affiliation_english: 'Associate Professor, Department of Sociology, Nagpur',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    email: 'executive@pawarishodh.org',
    research_areas: ['ग्रामीण समाजशास्त्र (Rural Sociology)', 'महिला अध्ययन (Gender Studies)', 'जनजातीय संस्कृति (Tribal Culture)'],
    order: 3,
  },
  {
    id: 'ed-004',
    name_hindi: 'डॉ. देवेंद्र हरिनखेड़े',
    name_english: 'Dr. Devendra Harinkhede',
    role: 'Managing Editor',
    designation_hindi: 'प्रबंध संपादक एवं अनुसंधान समन्वयक',
    designation_english: 'Managing Editor & Research Coordinator',
    affiliation_hindi: 'वरिष्ठ अनुसंधानकर्ता, पवारी शोध संस्थान, बालाघाट',
    affiliation_english: 'Senior Fellow, Pawari Shodh Sansthan, Balaghat',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    email: 'managing@pawarishodh.org',
    research_areas: ['डिजिटल आर्काइविंग (Digital Archiving)', 'लोकगीत संकलन (Folklore Collection)', 'शब्दावली निर्माण (Lexicography)'],
    order: 4,
  },
  {
    id: 'ed-005',
    name_hindi: 'प्रो. जॉन आर. मिलर',
    name_english: 'Prof. John R. Miller',
    role: 'Advisory Committee',
    designation_hindi: 'अंतर्राष्ट्रीय सलाहकार मंडल सदस्य',
    designation_english: 'International Advisory Board Member',
    affiliation_hindi: 'अंतर्राष्ट्रीय भाषाविज्ञान संघ एवं ओरिएंटल स्टडीज विभाग',
    affiliation_english: 'Department of Asian Languages & Dialectology, UK',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    email: 'j.miller@linguistics-assoc.org',
    research_areas: ['Indo-Aryan Dialects', 'Language Documentation', 'Sociolinguistics'],
    order: 5,
  },
];

export const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title_hindi: 'शोध पत्र आमंत्रण: वर्ष 2, अंक 2 (दिसंबर 2026)',
    title_english: 'Call for Papers: Volume 2, Issue 2 (December 2026)',
    content_hindi: 'पवारी शोध पत्रिका के आगामी दिसंबर 2026 अंक हेतु मौलिक एवं अप्रकाशित शोध पत्र आमंत्रित हैं। पांडुलिपि भेजने की अंतिम तिथि 31 अक्टूबर 2026 है।',
    content_english: 'Manuscripts are invited for Volume 2, Issue 2 (Dec 2026). Authors are requested to submit papers by October 31, 2026 via our online guidelines.',
    date: '2026-07-20',
    is_important: true,
    is_active: true,
  },
  {
    id: 'ann-002',
    title_hindi: 'राष्ट्रीय संगोष्ठी: "सतपुड़ा अंचल की लोक बोलियाँ एवं डिजिटल युग"',
    title_english: 'National Symposium on Central Indian Dialects & Digital Age',
    content_hindi: 'पवारी शोध संस्थान द्वारा बालाघाट में 15-16 नवंबर 2026 को दो दिवसीय राष्ट्रीय संगोष्ठी का आयोजन किया जा रहा है।',
    content_english: 'A two-day national academic conference will be organized on November 15-16, 2026 focused on digital preservation of regional oral traditions.',
    date: '2026-07-10',
    is_important: false,
    is_active: true,
  },
  {
    id: 'ann-003',
    title_hindi: 'पवारी शोध पत्रिका को अंतर्राष्ट्रीय मानक अंक (ISSN Online) प्राप्त',
    title_english: 'Pawari Shodh Patrika Awarded ISSN 2583-9128 (Online)',
    content_hindi: 'अकादमिक जगत के लिए हर्ष का विषय है कि हमारी पत्रिका को नेशनल साइंस लाइब्रेरी (INSDOC) द्वारा अंतर्राष्ट्रीय मानक अंक प्रदान किया गया है।',
    content_english: 'We are pleased to inform that Pawari Shodh Patrika has been assigned ISSN 2583-9128 by the National ISSN Centre.',
    date: '2026-05-18',
    is_important: false,
    is_active: true,
  },
];

export const DEMO_USERS: UserProfile[] = [
  {
    uid: 'demo-rupesh-pawar-uid',
    email: 'rupeshpawar10@gmail.com',
    display_name: 'Prof. Rupesh Pawar (Chief Admin)',
    role: 'super_admin',
    status: 'active',
    created_at: '2026-01-01',
  },
  {
    uid: 'demo-superadmin-uid',
    email: 'superadmin@pawarishodh.org',
    display_name: 'Super Admin (मुख्य प्रशासक)',
    role: 'super_admin',
    status: 'active',
    created_at: '2026-01-01',
  },
  {
    uid: 'demo-director-uid',
    email: 'director@pawarishodh.org',
    display_name: 'Dr. B. L. Pawar (निदेशक/Patron)',
    role: 'director',
    status: 'active',
    created_at: '2026-01-01',
  },
  {
    uid: 'demo-editorial-uid',
    email: 'editorial@pawarishodh.org',
    display_name: 'Editorial Team (संपादकीय मंडल)',
    role: 'editorial',
    status: 'active',
    created_at: '2026-01-01',
  },
];
