import { JournalSettings, PageContent, Article, Issue, EditorialMember, Announcement, UserProfile } from '../types';

export const DEFAULT_SETTINGS: JournalSettings = {
  journal_title_hindi: 'पवारी शोध पत्रिका',
  journal_title_english: 'Pawari Shodh Patrika',
  subtitle_hindi: 'पवारी भाषा, साहित्य एवं मध्यप्रदेश की लोकभाषाओं, संस्कृतियों व क्षेत्रीय अध्ययन की शोध पत्रिका',
  subtitle_english: 'A Peer-Reviewed Journal of Pawari Language, Literature & Regional Dialects, Folk Culture and Social History of Central India',
  logo_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&auto=format&fit=crop&q=80',
  issn_online: 'Applied For',
  issn_print: 'Applied For',
  publisher_hindi: 'माँ ताप्ती शोध संस्थान, मुलताई',
  publisher_english: 'Maa Tapti Research Institute, Multai',
  frequency_hindi: 'अर्द्धवार्षिक (वर्ष में 2 अंक: जून और दिसंबर)',
  frequency_english: 'Half-Yearly (2 Issues per Year: Published in June and December)',
  language_policy: 'Hindi / English (द्विभाषी - हिंदी एवं अंग्रेजी)',
  contact_email: 'maa.tapti.shodh.sansthan@gmail.com',
  contact_phone: '8604476649, 9975981957',
  contact_address_hindi: 'माँ ताप्ती शोध संस्थान, अनुसंधान एवं प्रकाशन विभाग, मुलताई – 460661, ज़िला बैतूल, मध्यप्रदेश, भारत',
  contact_address_english: 'Maa Tapti Research Institute, Research & Publication Dept., Multai – 460661, District Betul, Madhya Pradesh, India',
  footer_text_hindi: '© 2025 पवारी शोध पत्रिका। सर्वाधिकार सुरक्षित। माँ ताप्ती शोध संस्थान, मुलताई द्वारा प्रकाशित।',
  footer_text_english: '© 2025 Pawari Shodh Patrika. All Rights Reserved. Published by Maa Tapti Research Institute, Multai, India.',
  call_for_papers: {
    title_badge_english: 'Call for Papers - December 2026 Issue',
    title_badge_hindi: 'शोध पत्र आमंत्रण - दिसंबर 2026 अंक',
    heading_english: 'Submit Research Manuscript for December 2026 Issue',
    heading_hindi: 'दिसंबर 2026 अंक हेतु शोध पत्र सबमिशन आमंत्रण',
    description_english: 'Fast-track double-blind peer review process. Zero publication fees.',
    description_hindi: 'त्वरित डबल-ब्लाइंड पीर-रिव्यू प्रक्रिया। शून्य प्रकाशन शुल्क।',
    deadline_date: '31 October 2026',
    target_volume_issue: 'Vol. 2 Issue 2 (December 2026)',
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
**पवारी शोध पत्रिका (Pawari Shodh Patrika)** माँ ताप्ती शोध संस्थान, मुलताई द्वारा प्रकाशित एक द्विभाषी (हिंदी एवं अंग्रेजी) एवं अर्द्धवार्षिक पीर-रिव्यूड (Peer-Reviewed) अकादमिक शोध पत्रिका है। यह पत्रिका पवारी (भोयरी/पंवारी) भाषा, साहित्य, इतिहास और संस्कृति के अध्ययन को प्रमुख केंद्र मानते हुए मध्यप्रदेश एवं समीपवर्ती अंचलों की विभिन्न बोलियों (मालवी, निमाड़ी, बुन्देली, बघेली, राजस्थानी), जनजातीय भाषिक परंपराओं (गोंडी, कोरकू, नहाली, भीली, भिलाली, बरेली), लोकसाहित्य, क्षेत्रीय समाजशास्त्र और मौखिक विरासत पर केंद्रित मौलिक अनुसंधान को समर्पित है।

### प्रमुख उद्देश्य एवं विषय दायरा (Aims & Scope)
1. **पवारी भाषा एवं साहित्य:** पवारी (भोयरी/पंवारी) भाषा के ध्वनिविज्ञान, व्याकरण, शब्दकोश, लोकगीत, लोककथाओं और मौखिक इतिहास का वैज्ञानिक विश्लेषण।
2. **क्षेत्रीय बोलियाँ एवं लोकभाषाएँ:** राजस्थानी, मालवी, निमाड़ी, बुन्देली, बघेली एवं मध्यप्रदेश की अन्य उपभाषाओं व स्थानीय रूपों का अध्ययन।
3. **जनजातीय भाषिक परंपराएँ:** गोंडी, कोरकू, नहाली (निहाली), भीली, भिलाली, बरेली तथा अन्य अल्पप्रचलित व संकटग्रस्त भाषिक रूपों का प्रलेखन।
4. **लोकसाहित्य एवं वाचिक विरासत:** लोकगीत, लोककथाएँ, गाथाएँ, कहावतें, लोकनाट्य और जनस्मृतियों का संकलन व संरक्षण।
5. **इतिहास, समाजशास्त्र व लोकज्ञान:** क्षेत्रीय इतिहास, पुरालेख, ताम्रपत्र, वंश/गोत्र अध्ययन, लोक-पारिस्थितिकी (Ethno-Ecology) व पारंपरिक ज्ञान प्रणालियाँ।
6. **तुलनात्मक एवं डिजिटल अध्ययन:** तुलनात्मक भाषाविज्ञान, अनुवाद, पाठ-संपादन, शब्दकोश निर्माण तथा डिजिटल अभिलेखीकरण।
    `,
    content_english: `
### About the Journal
**Pawari Shodh Patrika** is a bilingual (Hindi & English), double-blind peer-reviewed academic journal published by Maa Tapti Research Institute, Multai. Centered on the Pawari (Bhoyari/Panwari) language, literature, history, and culture, the journal provides a scholarly platform for research on the regional dialects (Malvi, Nimadi, Bundeli, Bagheli, Rajasthani), tribal language traditions (Gondi, Korku, Nahali, Bhili, Bhilali, Bareli), folklore, oral history, and social heritage across Madhya Pradesh and neighboring regions.

### Aims & Scope
1. **Pawari Language & Literature:** Scientific study of Pawari grammar, phonetics, lexicon, folk literature, and oral traditions.
2. **Regional Dialects & Folk Languages:** In-depth studies on Rajasthani, Malvi, Nimadi, Bundeli, Bagheli, and regional speech forms of Central India.
3. **Tribal & Indigenous Languages:** Documentation of Gondi, Korku, Nahali (Nihali), Bhili, Bhilali, Bareli, and endangered language varieties.
4. **Folklore & Oral Heritage:** Collection and critical analysis of folk songs, folk tales, proverbs, ritual chants, and folk theater.
5. **History, Sociology & Ethno-Knowledge:** Regional history, epigraphy, clan lineages, traditional agricultural knowledge, and ethno-ecological systems.
6. **Comparative Linguistics & Digital Archiving:** Comparative literature, translation studies, lexicography, and digital archiving.
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
    editorial_note_hindi: 'इस अंक में सतपुड़ा-ताप्ती नदी अंचल (बैतूल, छिंदवाड़ा, पांढुर्णा) की 72 गोत्र पवार समुदाय की पवारी बोली, लोकसाहित्य एवं सामाजिक संरचना पर आधारित 5 उत्कृष्ट पीर-रिव्यूड शोध पत्र सम्मिलित हैं।',
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

// Sample public PDF data URL so the viewer renders instantly out of the box (CORS-free embedded PDF)
export const SAMPLE_PDF_BLOB = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iaiA8PC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUj4+IGVuZG9iagoyIDAgb2JqIDw8L1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDE+PiBlbmRvYmoKMyAwIG9iaiA8PC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL1Jlc291cmNlcyA8PC9Gb250IDw8L0YxIDQgMCBSPj4+PiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvQ29udGVudHMgNSAwIFI+PiBlbmRvYmoKNCAwIG9iaiA8PC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkPj4gZW5kb2JqCjUgMCBvYmogPDwvTGVuZ3RoIDE4MD4+IHN0cmVhbQpCVAovRjEgMTggVGYKNDAgODAwIFRkCihQQVdBUkkgU0hPREggUEFUUklLQSAtIFJFU0VBUkNIIEFSVElDTEUpIFRqCjAgLTMwIFRkCi9GMSAxMiBUZgooUGVlci1SZXZpZXdlZCBSZWZlcmVlZCBNdWx0aWRpc2NpcGxpbmFyeSBSZXNlYXJjaCBKb3VybmFsKSBUagowIC0yNSBUZAooSVNTTjogV2lsbCBBcHBseSB8IFZvbHVtZSAyLCBJc3N1ZSAxICgyMDI2KSkgVGoKMCAtNDAgVGQKKFRoaXMgaXMgYSB2YWxpZCBlbWJlZGRlZCBhY2FkZW1pYyBQREYgZG9jdW1lbnQgZm9yIFBhd2FyaSBTaG9kaCBQYXRyaWthLikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NT3NSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQ4IDAwMDAwIG4gCjAwMDAwMDAzMjIgMDAwMDAgbiAKdHJhaWxlciA8PC9TaXplIDYgL1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKNDMzCiUlRU9G';

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: 'art-v1i1-001',
    title_hindi: 'क्षत्रिय पवार (भोयर पवार / भोयर) जाति के गोत्र एवं उनके अपभ्रंश',
    title_english: 'Surnames and Clan Mutations (Apabhramsha) of Kshatriya Pawar (Bhoyar Pawar) Community: An Ethno-Linguistic and Historical Study',
    short_title: 'Kshatriya Pawar 72 Clans & Surnames Study',
    slug: 'kshatriya-pawar-bhoyar-pawar-clans-surnames-apabhramsha',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'राजेश बारंगे पंवार', affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई (ज़िला बैतूल, म.प्र.)', email: 'Rajeshbarange00@gmail.com', is_corresponding: true, orcid: '0000-0002-8819-2025' },
      { name: 'प्रणय चोपड़े', affiliation: 'शोधार्थी, पवारी भाषा व संस्कृति अध्ययन केंद्र', email: 'pranaychopde123@gmail.com' },
      { name: 'राजेश बोबडे', affiliation: 'सह-शोधार्थी, माँ ताप्ती शोध संस्थान, मुलताई', email: 'rajeshbobade10@gmail.com' },
      { name: 'माँ ताप्ती शोध संस्थान, मुलताई', affiliation: 'अनुसंधान एवं प्रकाशन विभाग, मुलताई (बैतूल, म.प्र.)', email: 'maa.tapti.shodh.sansthan@gmail.com' }
    ],
    abstract_hindi: 'प्रस्तुत शोध पत्र में क्षत्रिय पवार (भोयर पवार / भोयर) जाति के 72 मूल गोत्रों (कुलों), उनके ऐतिहासिक प्रवासन तथा कालक्रम में हुए भाषावैज्ञानिक अपभ्रंशों का गहन अध्ययन प्रस्तुत किया गया है। 16वीं से 18वीं शताब्दी के मध्य मालवा से सतपुड़ा अंचल (बैतूल, मुलताई, छिंदवाड़ा, पांढुर्णा, वर्धा, नागपुर) में हुए प्रवासन, मराठी भाषा के व्याकरणिक प्रभाव, अंग्रेजी लिप्यंतरण तथा क्षेत्रीय उच्चारण भिन्नताओं के कारण गोत्र नामों में आए परिवर्तनों का विस्तृत एवं प्रामाणिक विश्लेषण किया गया है।',
    abstract_english: 'This research paper provides a historical and sociolinguistic study of the 72 clans (Gotras/Surnames) of the Kshatriya Pawar (Bhoyar Pawar) community. It traces their 16th to 18th-century migration from Malwa to the Satpura plateau (Betul, Multai, Chhindwara, Pandhurna, Wardha, Nagpur) and systematically documents clan surname mutations (Apabhramsha) resulting from Marathi linguistic influence, English transliteration, and local phonetic adaptations.',
    keywords: ['क्षत्रिय पवार (Kshatriya Pawar)', 'भोयर पवार (Bhoyar Pawar)', '72 गोत्र (72 Clan Surnames)', 'अपभ्रंश (Phonetic Mutation)', 'मालवा से सतपुड़ा प्रवासन (Malwa Migration)', 'बैतूल-मुलताई (Betul-Multai)'],
    doi: '10.5281/zenodo.18490543',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-v1i1-001-kshatriya-pawar-gotra.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'History & Clan Anthropology',
    language: 'Hindi',
    status: 'published',
    page_numbers: '01–11',
    content_mode: 'full_text',
    citation_text: 'पंवार, आर. बी., चोपड़े, पी., बोबडे, आर., व संस्थान, म. ता. शो. (2025). क्षत्रिय पवार (भोयर पवार / भोयर) जाति के गोत्र एवं उनके अपभ्रंश. पवारी शोध पत्रिका, 1(1), 01–11. https://doi.org/10.5281/zenodo.18490543',
    date_received: '2025-01-10',
    date_revised: '2025-03-15',
    date_accepted: '2025-04-20',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना (Introduction)
क्षत्रिय पवार, जिसे पवार, भोयर या भोयर पवार के नाम से भी जाना जाता है, एक क्षत्रिय (राजपूत) जाति है। हिंदू वैदिक वर्ण व्यवस्था के अनुसार, यह जाति क्षत्रिय वर्ण में आती है। ये मूल रूप से मालवा के राजपूतों के वंशज हैं, जो राजस्थान, गुजरात, सिंध और भारत के अन्य क्षेत्रों से प्रवास करके मालवा में आकर बसे थे।

वर्तमान में इनका प्रमुख निवास मध्य प्रदेश के बैतूल, छिंदवाड़ा और पांढुर्णा जिलों तथा महाराष्ट्र के वर्धा और नागपुर जिलों में है। यह 72 कुलों वाला पवारों का समूह 16वीं से 18वीं शताब्दी के बीच मालवा से बैतूल में प्रवासित हुआ और वहां से धीरे-धीरे छिंदवाड़ा, पांढुर्णा, वर्धा, अमरावती, नागपुर, भोपाल, इंदौर और रायपुर-बिलासपुर जिलों में फैल गया।`,
    full_text_literature_review: `२. साहित्य अवलोकन (Literature Review)
पवार समाज के इतिहास और गोत्रों पर पूर्व प्रकाशित संदर्भों जैसे 'पवार कुल दर्शन' (1984, संपादक: कृष्णराव बालाजी पवार), 'पवार समाज: एक सिंहावलोकन' (1984, डॉ. ज्ञानेश्वर टेंभरे), 'पवारी' (1985, रामकिशोर टेंभरे), 'आबुदगिरी से सतपुड़ा में पंवारों का सफर' (2001, डॉ. ज्ञानेश्वर टेंभरे) तथा 'Kshatriya Pawar (72 Clan): Journey from Malwa to Satpura' (2024, राजेश बारंगे पंवार) में पवार समाज के मालवा प्रवासन और क्षेत्रीय विस्तार का उल्लेख है।`,
    full_text_methodology: `३. भोयर पवारों के 72 गोत्रों की प्रामाणिक सूची (72 Clans Directory)
भोयर पवारों के 72 गोत्र एवं उनके अपभ्रंश रूप इस प्रकार हैं:

1. बारंगिया / बारंग्या / बारंगा / बारंगे
2. बागवान / भोयर / भुईहार
3. बोगाना / बैंगने / बोगा
4. बरखेड़िया / बरखाड्या / बरखेड़े / बरखाड़े
5. बारबुहारा / बारबुहारे
6. बड़नगरिया / बड़नगरया / बड़नगरे / बन्नगरे / नागरे
7. भादिया / भादय्या / भादया / भादे / भादेकर
8. बोबाट / भोभाट / भोभटकर / बोभाट / बोभाटकर
9. बोबड़ा / बोबड्या / बोबड़े / बोबाड़े
10. बुहाड़िया / बुवाड्या / बोवाड्या / बुआड्या / भोहाड्या / बुवाड़े / बोवाड़े / बोआड़े / भोहाडे
11. बरगाड़िया / बिरगड्या / बिरगड़े / बिरगाड़े / बिरखाड़े / वीरगाड़े / वीरखाड़े / वीरखड़े / बिडगड़े / बिसेन
12. चोपड़िया / चोपड्या / चोपड़े / चोपड़ा / चोपाड़े
13. चौधरी
14. चिकानिया / चिकनया / चिकन्या / चिकान्या / चिकने / चिकाने / चनखार / चनखर / चकनार / चखनर
15. ढुंडारिया / डंडारे / ढंडारे / डंडाले / दंडाले
16. डालू / डाला / डहारे / डाले / डकारे
17. देवासिया / देवास्या / देवासे
18. देशमुख
19. धारफोड़िया / धारपुरे / धारे / धारफोड़े
20. ढोटा / ढोटया / धोटे / ढोटे
21. ढोंडी
22. ढोबारिया / ढोबारया / डोबारया / ढोबले / ढोबाले / ढोबारे / डोबले / डोबाले / डोबारे
23. ढोलिया / ढोल्या / ढोले
24. डिगरसिया / डिगरस्या / डिगरसे / डिगसे / डिग्रसे / दीग्रसे
25. डोंगरदिया / डोंगरया / डोंगरदिए / डोंगरे / डोंगरदे / डोंगरकर / डोंगरदेव
26. दुखी / दुर्वे / दुःखी / दुख्खे
27. फरकाड़िया / फरकाड्या / फरकाड़े / फरकासे / फरखासे / फरकसे
28. गाड़किया / गाखरे / गाकरे
29. गागरिया / गाडगे / गागरे / आगरे / गागडे
30. गाडरी / गाडरया / गडरे / गधड़े / गद्रे / गादड़े / गाडरे / काटोले / काटवले
31. घागरे
32. गिरहारिया / गिरहारया / गिरहारे / गिरारे / गिराले / गुसाई
33. गोंदिया
34. गोहितिया / गोहित्य / गोहिते / गोहते / गोयरे / गोहिता / गोहाटे / गोयते
35. गोरिया / गोरया / गोरे
36. हजारिया / हजारया / हजारे
37. हिंगवा / हिंगवे
38. कालभोर / कालभूत्या / कालभूत / कालभौर
39. करदातिया / करदात्या / करदाते / दाते
40. कड़वा / कड़वे / कड़वेकर / कडू / कडूकर
41. कामड़ी
42. कसाई / कासलीकर / कसारे / कासलेकर / खसारे / केसलीकर
43. खौसी / खौसे / खवसे / खवासे / कौशिक / खवशिय / खवसकर
44. खपरिया / खपरया / खापरे / खपरे / खपरिए
45. खरगोसिया / खारफुसे / खुसखुसे / खरफसे / खारखुसे / खारखुसा / खरखुसे / खनखुसरे
46. किरंजकर / करंजकर
47. किनकर / किनेकर / किंकर
48. कोडलिया / कोडल्या / कोडले / कोरडे
49. लबाड़ / लबड़े
50. लावरी
51. लाडकिया / लाडके
52. लोखंडिया / लोखंड्या / लोखंडे
53. माटिया / माट्या / माटे
54. मानमोड़िया / मानमोड्या / मानमोड़े / मानमुड़े
55. मुनी / मुन्ने / मुने
56. नाडीतोड़
57. उकार / ओंकार / ओमकार
58. पठाडिया / पठाड्या / पठाड़े / राखड़े
59. पड़ीयार / परिहार / पराडकर / पराड़ / पड़याड़ / पड़िहाड़ / पड़ीमार / प्रतिहार
60. पाठा / पाठे / पाठेकर / पथे
61. पिंजारा / पिंजारया / पिंजारे / पिंजरकर / पिंजरा
62. रावत / राऊत
63. रबड़िया / रबड्या / रबड़े / राबड़े
64. रमधम / रमधमे
65. रोलकिया / रोडल्या / रोडले
66. सरोदिया / सरोदया / सरोदे / सरोदा
67. सवाई
68. शेरकिया / शेरक्या / शेरके / छेरके
69. टावरी / ठवरी / ठवरे / ठवले
70. ठुस्सी
71. टोपरिया / टोपल्या / टोपले
72. उकडलिया / उकडल्या / उकडले / उधड़े / उकंडे / उकड़ते / उकले / उघड़े

# अतिरिक्त अपभ्रंश (जिनका मूल गोत्र शोध का विषय है):
कुहिके, भुसारी, पेंधें, भोंगाड़े - यह चार गोत्र भी पवारों के 72 गोत्रों में से ही अपभ्रंश हैं, जिन पर आगे शोध जारी है।`,
    full_text_results_discussion: `४. गोत्रों के परिवर्तन एवं अपभ्रंश के प्रमुख कारण (Results & Discussion)
भोयर पवार जाति केवल ऊपर दिए गए 72 गोत्रों तक सीमित है। समय और स्थान परिवर्तन के साथ इनके अपभ्रंश होने के मुख्य ऐतिहासिक, भौगोलिक और भाषाई कारण निम्नलिखित हैं:

१. मालवा से सतपुड़ा क्षेत्र में माइग्रेशन:
16वीं से 18वीं शताब्दी के मध्य मालवा से बैतूल, मुलताई, पांढुर्णा, सौसर और छिंदवाड़ा क्षेत्र में प्रवास के दौरान उच्चारण और लेखन शैली में क्षेत्रीय प्रभाव आया।

२. मराठी भाषा का प्रभाव:
महाराष्ट्र के निकटवर्ती क्षेत्रों (पांढुर्णा, कारंजा, नागपुर) में मराठी व्याकरण व उच्चारण के कारण हिंदी गोत्र मराठी शैली में लिखे जाने लगे।
उदाहरण: बारंगिया → बारंगा → बारंगे | चोपड़िया → चोपड़ा → चोपड़े

३. अंग्रेजी में लिखने के कारण परिवर्तन:
अंग्रेजी में लिप्यंतरण के समय वर्तनी में बदलाव आए। उदाहरण: Chopde (चोपड़े) → Chopade (चोपाड़े)।

४. भाषाई और व्याकरणिक प्रभाव:
हिंदी के "अ" स्वर स्थान पर मराठी में "ए" या "आ" का प्रयोग हुआ (उदा. चिकाणे → चिकाने, पठाडिया → पठाड़े)।

५. स्थान-विशेष एवं सामाजिक पहचान:
क्षेत्रीय उच्चारण के अनुसार जैसे मुलताई में "डोंगरदिए", नागपुर में "डोंगरे", और छिंदवाड़ा में "डोंगरडे" या "डोंगरदेव" प्रचलित हुए।`,
    full_text_conclusion: `५. निष्कर्ष एवं अध्ययन का महत्व (Conclusion)
गोत्रों में परिवर्तन एक स्वाभाविक सामाजिक, भौगोलिक और भाषाई अनुकूलन की प्रक्रिया थी। पवार समुदाय के गोत्रों के इस विकास और अपभ्रंश को समझना न केवल उनके इतिहास को संरक्षित करने का माध्यम है, बल्कि यह उनकी सामाजिक-सांस्कृतिक यात्रा और भाषाई अनुकूलन का सशक्त प्रमाण भी है।`,
    full_text_acknowledgement: `आभार: शोधकर्ता माँ ताप्ती शोध संस्थान, मुलताई (बैतूल) एवं पवारी साहित्य सरिता परिवार के प्रति अपना हार्दिक आभार व्यक्त करते हैं।`,
    full_text_conflict_of_interest: 'लेखक घोषणा करते हैं कि इस शोध कार्य में किसी भी प्रकार का हित-संघर्ष (Conflict of Interest) नहीं है।',
    full_text_funding: 'यह शोध कार्य माँ ताप्ती शोध संस्थान, मुलताई द्वारा संवर्धित एवं समर्थित है।',
    references: [
      'पवार कुल दर्शन. (1984). कृष्णराव बालाजी पवार (संपादक), पवार संदेश, अंक 01. नागपुर: पवार युवक संगठन.',
      'पवार समाज: एक सिंहावलोकन. (1984). डॉ. ज्ञानेश्वर टेंभरे, पवार संदेश, पृष्ठ 13-22.',
      'टेंभरे, रामकिशोर. (1985). पवारी. पवार संदेश, अंक 02. नागपुर: पवार युवक संगठन.',
      'टेंभरे, डॉ. ज्ञानेश्वर. (2001). आबुदगिरी से सतपुड़ा में पंवारों का सफर. पवार भारती, अंक 06. बालाघाट.',
      'बारंगे, राजेश पंवार. (2024). Kshatriya Pawar (72 Clan): Journey from Malwa to Satpura. लैम्बर्ट पब्लिशिंग.',
      'Pawar, R. B., Chopde, P., & बैतूल (म. प्र.). (2023). 36 गोत्र और 72 गोत्र पंवार में ऐतिहासिक तथ्य. पवारी साहित्य सरिता 2023, 04.'
    ],
    views_count: 512,
    downloads_count: 238,
    created_at: '2025-06-30',
    updated_at: '2025-06-30',
  },
  {
    id: 'art-001',
    title_hindi: 'पवारी भाषा का उद्भव, विकास एवं उसकी ध्वन्यात्मक विशेषताएँ: एक भाषावैज्ञानिक अध्ययन',
    title_english: 'Origin, Evolution and Phonetic Characteristics of Pawari Dialect: A Linguistic Study',
    short_title: 'Phonetic Study of Pawari Dialect',
    slug: 'origin-evolution-phonetic-characteristics-pawari-dialect',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'डॉ. रामेश्वर पवार', affiliation: 'विभागाध्यक्ष, भाषाविज्ञान विभाग, शासकीय स्नातकोत्तर महाविद्यालय, बालाघाट', email: 'r.pawar@balaghat.edu.in', is_corresponding: true, orcid: '0000-0002-1823-9211' },
      { name: 'प्रो. सुनीता शिंदे', affiliation: 'सहायक प्राध्यापक, हिंदी विभाग, नागपुर विश्वविद्यालय', email: 'sunita.shinde@nagpur.ac.in', orcid: '0000-0001-5099-2810' }
    ],
    abstract_hindi: 'प्रस्तुत शोध पत्र में मध्य भारत के सतपुड़ा एवं माँ ताप्ती नदी घाटी क्षेत्र (बैतूल, छिंदवाड़ा, पांढुर्णा) में 72 गोत्र पवार समाज द्वारा बोली जाने वाली पवारी बोली की ध्वन्यात्मक एवं व्याकरणिक विशेषताओं का गहन भाषावैज्ञानिक विश्लेषण प्रस्तुत किया गया है। शोध में पाया गया कि पवारी में राजस्थानी, मराठी एवं मालवी भाषा-परिवार के तत्त्वों का सुंदर समन्वय है। अध्ययन में पवारी के विशिष्ट स्वर एवं व्यंजन ध्वनियों का आरेखीय एवं तुलनात्मक विवरण दिया गया है।',
    abstract_english: 'This research paper presents a comprehensive linguistic analysis of the phonetic and grammatical features of the Pawari dialect spoken across the Satpura and Tapti River basin (Betul, Chhindwara, Pandhurna) by the 72 Clan Pawar community of Central India. The study reveals a unique confluence of Indo-Aryan elements including Rajasthani, Marathi, and Malvi roots. The paper systematically documents the vowel inventory, phonemes, and tonal variations unique to Pawari.',
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
    content_mode: 'full_text',
    citation_text: 'Pawar, R., & Shinde, S. (2026). Origin, Evolution and Phonetic Characteristics of Pawari Dialect: A Linguistic Study. Pawari Shodh Patrika, 2(1), 01–14. https://doi.org/10.5281/zenodo.psp.2026.0101',
    date_received: '2026-02-10',
    date_revised: '2026-03-25',
    date_accepted: '2026-04-18',
    date_published: '2026-06-10',
    full_text_introduction: `१. प्रस्तावना (Introduction)
मध्य भारत का सतपुड़ा पर्वतमाला एवं माँ ताप्ती नदी घाटी (बैतूल, छिंदवाड़ा, पांढुर्णा अंचल) बहुसांस्कृतिक और बहुभाषी अंचल रहा है। इस क्षेत्र में 72 गोत्र पवार समाज द्वारा बोली जाने वाली पवारी बोली न केवल ऐतिहासिक दृष्टिकोण से समृद्ध है, बल्कि भाषावैज्ञानिक दृष्टि से भी अत्यंत रोचक संरचना प्रस्तुत करती है। पवार (परमार) राजवंश के धार एवं मालवा से सतपुड़ा अंचल में प्रवासन के साथ इस बोली का बीजारोपण मध्य भारत के बैतूल, मुलताई, छिंदवाड़ा, पांढुर्णा तथा नागपुर-वर्धा जिलों में हुआ।

प्रस्तुत अध्ययन का मुख्य उद्देश्य पवारी की ध्वन्यात्मक संरचना, इसके विशिष्ट स्वरों तथा व्यंजनों की ध्वन्यात्मक पहचान और इसके निकटवर्ती भाषा-रूपों (मराठी, मालवी, बुंदेली) के साथ इसके तुलनात्मक अध्ययन को रेखांकित करना है।`,
    full_text_literature_review: `२. साहित्य अवलोकन (Literature Review)
भारतीय भाषावैज्ञानिक सर्वेक्षण (Linguistic Survey of India) में सर जॉर्ज ग्रियर्सन ने पवारी को राजस्थानी समूह की मालवी बोली की एक उप-शाखा के रूप में वर्गीकृत किया था। तत्पश्चात, डॉ. हरदेव बाहरी तथा डॉ. धीरेंद्र वर्मा ने मध्य भारत की बोलियों का पुनर्मूल्यांकन करते हुए इसे एक स्वतंत्र बोली के रूप में मान्यता देने की अनुशंसा की। हाल के दशकों में पवार (२०१५) तथा देशमुख (२०२०) के अध्ययनों ने पवारी पर मराठी व्याकरण तथा मालवी शब्दावली के द्विभाषी प्रभाव की पुष्टि की है।`,
    full_text_methodology: `३. अनुसंधान कार्यप्रणाली (Methodology)
इस भाषावैज्ञानिक अध्ययन हेतु वर्णनात्मक एवं तुलनात्मक भाषाविज्ञान विधि का प्रयोग किया गया है:
१. क्षेत्र-कार्य (Fieldwork): बालाघाट एवं गोंदिया जिले के २० ग्रामीण क्षेत्रों में ६० वक्ताओं (आयु वर्ग १८ से ७५ वर्ष) से ऑडियो-रिकॉर्डिंग एवं प्रत्यक्ष साक्षात्कार द्वारा सामग्री का संकलन।
२. अंतर्राष्ट्रीय ध्वन्यात्मक वर्णमाला (IPA): संकलित पवारी उच्चारणों को IPA प्रतीकों में लिप्यंतरित किया गया।
३. स्वर-यंत्र विश्लेषक उपकरण (Acoustic Phonetics): Praat सॉफ्टवेयर के माध्यम से फॉर्मेंट आवृत्तियों (F1, F2) का मापन कर पवारी स्वर त्रिकोण (Vowel Triangle) का निर्माण किया गया।`,
    full_text_results_discussion: `४. परिणाम एवं विश्लेषण (Results and Discussion)
४.१ स्वर ध्वनियाँ (Vowels):
पवारी में कुल १० शुद्ध स्वर ध्वनियाँ पाई जाती हैं: [a, ā, i, ī, u, ū, e, ai, o, au]। मालवी की भाँति इसमें अनुनासिक स्वरों का प्रचुर प्रयोग मिलता है (उदा. 'खाँओ', 'जाँओ')।

४.२ व्यंजन ध्वनियाँ (Consonants):
पवारी व्यंजन तालिका में ३४ व्यंजन ध्वनियाँ चिह्नित की गई हैं। इसमें 'ल' का मूर्धन्य रूप 'ळ' (L retroflex) तथा 'र' की मूर्धन्य अल्पप्राण ध्वनि बहुतायत से प्रयुक्त होती है।

४.३ प्रमुख ध्वन्यात्मक नियम (Phonetic Rules):
१. अकारान्त लोप (Schwa Syncope): शब्द के अंतिम स्वर का लोप होकर व्यंजनांत उच्चारण।
२. 'स' एवं 'ह' का विनिमय: कई स्थानीय वक्ताओं में 'स' ध्वनि 'ह' में परिवर्तित हो जाती है (उदा. 'सात' -> 'हात')।
३. संयुक्त व्यंजनों का सरलीकरण: तत्सम शब्दों के संयुक्त व्यंजनों में 'इ' या 'अ' का आगम करके सरल बनाया जाता है (उदा. 'स्त्री' -> 'इस्त्री')।`,
    full_text_conclusion: `५. निष्कर्ष (Conclusion)
पवारी बोली इंडो-आर्यन भाषा परिवार की एक अनूठी धरोहर है जो मालवी (राजस्थानी), बुंदेली एवं मराठी के संगम बिंदु पर विकसित हुई है। आधुनिक शिक्षा एवं वैश्वीकरण के कारण इसके मूल ध्वन्यात्मक स्वरूप में क्षरण देखा जा रहा है। इस शोध पत्र के माध्यम से पवारी के मानक भाषावैज्ञानिक दस्तावेजीकरण हेतु एक वैज्ञानिक आधार प्रस्तुत किया गया है।`,
    full_text_acknowledgement: `आभार: शोधकर्ता भाषाविज्ञान विभाग, बालाघाट एवं क्षेत्रीय पवारी लोकसाहित्य परिषद के प्रति अपना हार्दिक आभार व्यक्त करते हैं जिन्होंने क्षेत्र-कार्य में बहुमूल्य सहयोग प्रदान किया।`,
    full_text_conflict_of_interest: 'लेखक घोषणा करते हैं कि इस शोध कार्य में किसी भी प्रकार का हित-संघर्ष (Conflict of Interest) नहीं है।',
    full_text_funding: 'यह अध्ययन विश्वविद्यालय अनुदान आयोग (UGC) के लघु शोध अनुदान योजना के अंतर्गत आंशिक रूप से वित्तपोषित है।',
    references: [
      'Grierson, G. A. (1908). Linguistic Survey of India (Vol. IX, Indo-Aryan Family, Central Group). Office of the Superintendent of Government Printing, Calcutta.',
      'Pawar, R. (2015). Pawari Boli Ka Bhashavaigyanik Adhyayan. Shodh Sansthan Prakashan, Bhopal.',
      'Deshmukh, A. (2020). Folklife and Language Shift in Tapti River Basin (Betul & Chhindwara). Journal of Central Indian Studies, 12(2), 45-62.',
      'Verma, D. (1972). Hindi Bhasha Ka Itihas. Hindustan Academy, Allahabad.'
    ],
    custom_sections: [
      {
        id: 'cs-01',
        type: 'quote',
        title: 'पवारी बोली कहावत (Traditional Pawari Proverb)',
        content: '"जैसी ताप्ती माई की धार, वैसी पवार की वाण।" (अर्थात: जिस प्रकार माँ ताप्ती नदी निरंतर प्रवाहित होकर जीवन और उर्वरता देती है, उसी प्रकार पवारी बोली अपनी सहजता और मिठास से 72 गोत्र पवार समाज को बांधे रखती है।)'
      },
      {
        id: 'cs-fig-01',
        type: 'figure',
        title: 'Figure 1: Geographic Map of Pawari Speech Area',
        content: 'Geographic distribution of Pawari speakers in Satpura and Tapti river basin (Betul, Chhindwara, Pandhurna).',
        caption: 'चित्र १ / Figure 1: माँ ताप्ती नदी घाटी और सतपुड़ा अंचल (बैतूल, छिंदवाड़ा, पांढुर्णा) में पवारी बोलीभाषी क्षेत्र का भौगोलिक मानचित्र (Geographical map highlighting primary Pawari dialect clusters).',
        image_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Map of Satpura and Tapti valley showing Pawari dialect distribution across Betul, Chhindwara, Pandhurna, Multai, and Nagpur.',
        source_credit: 'Source: Author Fieldwork Survey & Central India Linguistic Atlas (2025)',
        figure_number: 1,
        placement: 'in_body'
      },
      {
        id: 'cs-fig-02',
        type: 'figure',
        title: 'Figure 2: Spectrogram & Formant Analysis',
        content: 'Acoustic phonetic spectrogram comparing Pawari retroflex sounds.',
        caption: 'चित्र २ / Figure 2: पवारी बोली के अनुनासिक स्वरों एवं मूर्द्धन्य ध्वनियों का स्पेक्ट्रोग्राम ध्वनि विश्लेषण (Acoustic spectrogram showing formant frequencies F1/F2).',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Acoustic waveform graph showing sound frequency peaks in Pawari vocalic phonemes.',
        source_credit: 'Source: Phonetics Research Laboratory, Central Institute of Indian Languages',
        figure_number: 2,
        placement: 'at_end'
      }
    ],
    views_count: 342,
    downloads_count: 128,
    created_at: '2026-06-10',
    updated_at: '2026-06-15',
  },
  {
    id: 'art-002',
    title_hindi: 'सतपुड़ा एवं ताप्ती नदी अंचल के लोकगीतों में 72 गोत्र पवार संस्कृति के विविध रंग',
    title_english: 'Diverse Shades of Pawari Culture in Folk Songs of Satpura and Tapti River Region',
    slug: 'diverse-shades-pawari-culture-folk-songs',
    authors: [
      { name: 'डॉ. अनिमेश देशमुख', affiliation: 'शोध निदेशक, पवारी लोकसाहित्य अनुसंधान केंद्र, बैतूल', email: 'animesh.d@folklore.org', is_corresponding: true }
    ],
    abstract_hindi: 'लोकगीत किसी भी समुदाय की आत्मा और सांस्कृतिक दर्पण होते हैं। बैतूल, छिंदवाड़ा एवं पांढुर्णा क्षेत्र के 72 गोत्र पवार समाज में जन्मोत्सव, विवाह, कृषि कार्य एवं पर्व-त्योहारों (जैसे भुजरिया) पर माँ ताप्ती नदी तट पर गाए जाने वाले लोकगीतों में जीवनदर्शन की गंभीर अभिव्यक्तियाँ मिलती हैं।',
    abstract_english: 'Folk music acts as the cultural repository of community heritage. In the 72 Clan Pawar community of Betul, Chhindwara, and Pandhurna, traditional songs associated with agricultural cycles, wedding rituals, and seasonal festivals along the Tapti river bank reflect profound folk wisdom.',
    keywords: ['लोकगीत (Folk Songs)', 'पवारी संस्कृति (Pawari Culture)', 'ताप्ती अंचल (Tapti Region)', 'बैतूल-छिंदवाड़ा (Betul-Chhindwara)', '72 गोत्र पवार (72 Clan Pawar)'],
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
    title_hindi: 'पवारी लोककथाओं में पर्यावरणीय चेतना एवं माँ ताप्ती नदी घाटी का जैव-विविधता दर्शन',
    title_english: 'Environmental Consciousness and Ethno-Ecological Wisdom in Pawari Folktales of Tapti River Basin',
    slug: 'environmental-consciousness-ethno-ecological-wisdom-pawari-folktales',
    authors: [
      { name: 'सविता बिसेन', affiliation: 'शोधार्थी, पर्यावरण एवं हिंदी साहित्य विभाग, छिंदवाड़ा विश्वविद्यालय', email: 'savita.bisen@chhindwara.ac.in', is_corresponding: true }
    ],
    abstract_hindi: 'पवारी लोककथाओं में प्रकृति, वनों, नदियों तथा वन्यजीवों के साथ मानव के घनिष्ठ संबंधों का चित्रांकन मिलता है। बैतूल, मुलताई, छिंदवाड़ा तथा पांढुर्णा के माँ ताप्ती नदी अंचल में प्रचलित पवारी दंतकथाओं के माध्यम से प्राकृतिक संसाधनों के विवेकपूर्ण उपयोग एवं संरक्षण की प्राचीन परंपरा का साक्ष्य प्राप्त होता है।',
    abstract_english: 'Ethno-ecological narratives embedded in Indigenous folklore offer key insights into sustainable living. This study analyzes oral storytelling traditions within the Pawari speaking belts of the Tapti river basin across Betul and Chhindwara, illustrating ancient conservation ethics and human-nature harmony.',
    keywords: ['पर्यावरण साहित्य (Eco-Literature)', 'लोककथाएँ (Folktales)', 'ताप्ती नदी (Tapti River)', 'बैतूल-छिंदवाड़ा (Betul-Chhindwara)', 'पवारी बोली (Pawari)'],
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

export const DEFAULT_PAWARI_MEMBER_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#420708"/>
      <stop offset="50%" stop-color="#2a0506"/>
      <stop offset="100%" stop-color="#190304"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#bg)" rx="24"/>
  <circle cx="150" cy="150" r="140" stroke="url(#gold)" stroke-width="3" fill="none" opacity="0.6"/>
  <!-- Scholar Silhouette -->
  <circle cx="150" cy="110" r="46" fill="#fef3c7" opacity="0.92"/>
  <path d="M70 235 C70 180 110 170 150 170 C190 170 230 180 230 235 Z" fill="#fef3c7" opacity="0.92"/>
  <!-- Journal Crest Badge -->
  <rect x="35" y="244" width="230" height="36" rx="8" fill="url(#gold)"/>
  <text x="150" y="267" font-family="'Samskrit','Noto Serif Devanagari',serif" font-size="15" font-weight="bold" fill="#420708" text-anchor="middle">पवारी शोध पत्रिका</text>
</svg>
`)}`;

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
