import { PawariWriterItem } from '../types';

export interface AttachedItem {
  id?: string;
  title: string;
  type: 'book' | 'blog' | 'article' | 'pdf' | 'external';
  url?: string;
  targetId?: string;
  description?: string;
}

export interface BookItem {
  id: string;
  title_hindi: string;
  title_english: string;
  authors: string;
  editor?: string;
  category: string;
  publisher: string;
  publication_year: number | string;
  pages: number;
  isbn: string;
  cover_image: string;
  price?: string;
  synopsis_hindi: string;
  synopsis_english: string;
  table_of_contents_hindi?: string[];
  sample_pdf_url?: string;
  is_featured?: boolean;
  slug?: string;
  status?: 'draft' | 'pending' | 'changes_requested' | 'approved' | 'published' | 'rejected' | string;
  editorial_comments?: string;
  contributor_name?: string;
  contributor_email?: string;
  submitted_at?: string;
  attached_items?: AttachedItem[];
  attached_books?: string[];
  attached_blogs?: string[];
}

export interface BlogItem {
  id: string;
  title_hindi: string;
  title_english: string;
  author: string;
  author_role?: string;
  author_avatar?: string;
  date: string;
  read_time: string;
  category: string;
  language?: 'pawari' | 'hindi' | 'english' | 'mixed' | string;
  cover_image: string;
  pdf_url?: string;
  excerpt_hindi: string;
  excerpt_english: string;
  content_hindi: string;
  content_english: string;
  tags: string[];
  likes_count?: number;
  views_count?: number;
  slug?: string;
  status?: 'draft' | 'pending' | 'changes_requested' | 'approved' | 'published' | 'rejected' | string;
  editorial_comments?: string;
  contributor_name?: string;
  contributor_email?: string;
  contributor_phone?: string;
  consent_given?: boolean;
  submission_ref?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  submitted_at?: string;
  updated_at?: string;
  published_at?: string;
  attached_items?: AttachedItem[];
  attached_books?: string[];
  attached_blogs?: string[];
}

export const SAMPLE_BOOKS: BookItem[] = [
  {
    id: 'book-1',
    title_hindi: 'पवारी बोली एवं लोकसाहित्य का प्रामाणिक इतिहास',
    title_english: 'An Authentic History of Pawari Dialect & Folklore',
    authors: 'डॉ. कैलाश पवार एवं प्रो. रामेश्वर शर्मा',
    category: 'भाषाविज्ञान एवं लोकसाहित्य',
    publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
    publication_year: 2025,
    pages: 384,
    isbn: '978-81-954321-0-1',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    price: '₹ 450 (Free Open PDF)',
    is_featured: true,
    synopsis_hindi: 'बैतूल, छिंदवाड़ा, सिवनी एवं वर्धा-नागपुर सीमावर्ती अंचल में बोली जाने वाली पवारी बोली के उद्भव, विकास, ध्वनिविज्ञान, व्याकरण तथा समृद्ध मौखिक लोकपरंपराओं का विस्तृत प्रामाणिक इतिहास। इसमें पवारी के ऐतिहासिक ग्रंथों तथा मौखिक लोककथाओं का वैज्ञानिक विश्लेषण प्रस्तुत किया गया है।',
    synopsis_english: 'A comprehensive authentic history of the origin, development, phonology, grammar, and oral traditions of the Pawari dialect spoken across Betul, Chhindwara, Seoni, and Nagpur regions.',
    table_of_contents_hindi: [
      'अध्याय 1: पवारी बोली का ऐतिहासिक एवं भौगोलिक परिचय',
      'अध्याय 2: पवारी का ध्वनिविज्ञान एवं पद-संरचना',
      'अध्याय 3: पवारी लोकगीत: प्रकार एवं सामाजिक चेतना',
      'अध्याय 4: पवारी लोककथाएं एवं मौखिक परंपराएं',
      'अध्याय 5: पवारी शब्दावली एवं अन्य बोलियों से संबंध'
    ],
    attached_items: [
      {
        id: 'att-b1-1',
        title: 'संलग्न ब्लॉग: पवारी बोली का उद्भव और ऐतिहासिक प्रसार आलेख',
        type: 'blog',
        targetId: 'blog-1',
        description: 'डॉ. कैलाश पवार द्वारा रचित पवारी बोली की ऐतिहासिक पृष्ठभूमि पर विशेष वैचारिक लेख।'
      },
      {
        id: 'att-b1-2',
        title: 'संलग्न ग्रन्थ: पवारी-हिंदी-अंग्रेजी बृहत् त्रिभाषीय शब्दकोश',
        type: 'book',
        targetId: 'book-3',
        description: '15,000 से अधिक पवारी प्रविष्टियों वाला अधिकृत शब्दकोश ग्रन्थ।'
      },
      {
        id: 'att-b1-3',
        title: 'माँ ताप्ती शोध संस्थान ई-पुस्तकालय पोर्टल',
        type: 'external',
        url: 'https://pawari-shodh-patrika.vercel.app/books-literature',
        description: 'संस्थान के अधिकृत डिजिटल पुस्तकालय का नया पेज डायरेक्ट लिंक।'
      }
    ]
  },
  {
    id: 'book-2',
    title_hindi: 'मध्य भारत की लोकसंस्कृति और ताप्ती अंचल',
    title_english: 'Folklore & Culture of Central India & Tapti Region',
    authors: 'डॉ. अनिता मालवीय एवं प्रो. संतराम चौधरी',
    category: 'संस्कृति एवं मानविकी',
    publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
    publication_year: 2024,
    pages: 290,
    isbn: '978-81-954321-1-8',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    price: '₹ 380',
    is_featured: true,
    synopsis_hindi: 'ताप्ती नदी घाटी सभ्यता, पवारी लोकगीत, लोकनृत्य, पर्व-त्योहारों तथा जनजातीय-लोक चेतना का समाजशास्त्रीय अध्ययन। ताप्ती के उद्गम स्थल मुलताई से लेकर सीमावर्ती अंचलों की सांस्कृतिक धरोहर का सचित्र प्रामाणिक संकलन।',
    synopsis_english: 'A sociological study of Tapti river valley civilization, Pawari folk songs, folk dances, festivals, and tribal-folk consciousness in Central India.',
    table_of_contents_hindi: [
      'अध्याय 1: ताप्ती घाटी सभ्यता एवं लोक जीवन',
      'अध्याय 2: मुलताई अंचल के प्रमुख लोक पर्व एवं मेले',
      'अध्याय 3: लोकवाद्य, लोकनृत्य एवं नाट्य परंपराएं',
      'अध्याय 4: जनजातीय संस्कृति एवं पवारी लोक समन्वय'
    ],
    attached_items: [
      {
        id: 'att-b2-1',
        title: 'संलग्न ब्लॉग: ताप्ती नदी तट की लोक परंपराएं एवं भुजरिया पर्व',
        type: 'blog',
        targetId: 'blog-2',
        description: 'डॉ. अनिता मालवीय द्वारा मुलताई अंचल की लोक चेतना पर विस्तृत आलेख।'
      },
      {
        id: 'att-b2-2',
        title: 'संलग्न ग्रन्थ: पवारी लोकगाथाएं और मौखिक परंपरा',
        type: 'book',
        targetId: 'book-4',
        description: 'रामनाथ पवार द्वारा संकलित पवारी बीरगाथाएं एवं भक्ति लोकगीत।'
      }
    ]
  },
  {
    id: 'book-3',
    title_hindi: 'पवारी - हिंदी - अंग्रेजी बृहत् त्रिभाषीय शब्दकोश',
    title_english: 'Comprehensive Pawari-Hindi-English Dictionary',
    authors: 'मुख्य संपादक: डॉ. बी. एल. पवार, सह-संपादक: डॉ. रेखा मुदगल',
    category: 'कोष ग्रंथ (Lexicography)',
    publisher: 'माँ ताप्ती शोध संस्थान',
    publication_year: 2025,
    pages: 520,
    isbn: '978-81-954321-2-5',
    cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    price: '₹ 650',
    is_featured: false,
    synopsis_hindi: '15,000 से अधिक पवारी शब्दों का प्रामाणिक अर्थ, व्युत्पत्ति, मुहावरे, कहावतें एवं उनका हिंदी तथा अंग्रेजी में सटीक अनुवाद। भाषाविदों, शोधार्थियों एवं विद्यार्थियों के लिए अमूल्य संदर्भ ग्रंथ।',
    synopsis_english: 'A landmark dictionary featuring over 15,000 Pawari entries with authentic meanings, etymology, idioms, and precise translations in Hindi and English.',
    table_of_contents_hindi: [
      'भाग 1: पवारी वर्णमाला एवं उच्चारण निर्देश',
      'भाग 2: शब्दकोश (पवारी से हिंदी एवं अंग्रेजी)',
      'भाग 3: पवारी मुहावरे एवं कहावतें',
      'भाग 4: पारिभाषिक लोक-शब्दावली'
    ],
    attached_items: [
      {
        id: 'att-b3-1',
        title: 'संलग्न मॉड्यूल: ऑनलाइन डिजिटल पवारी शब्दकोश (Shabdkosh)',
        type: 'external',
        url: 'https://pawari-shodh-patrika.vercel.app/shabdkosh',
        description: 'खोज योग्य पवारी ऑनलाइन डिजिटल शब्दकोश पेज का डायरेक्ट लिंक।'
      },
      {
        id: 'att-b3-2',
        title: 'संलग्न ग्रन्थ: पवारी बोली एवं लोकसाहित्य का प्रामाणिक इतिहास',
        type: 'book',
        targetId: 'book-1',
        description: 'भाषाशास्त्रीय अध्ययन हेतु संदर्भ ग्रन्थ।'
      }
    ]
  },
  {
    id: 'book-4',
    title_hindi: 'पवारी लोकगाथाएं और मौखिक परंपरा',
    title_english: 'Pawari Folk Ballads & Oral Traditions',
    authors: 'रामनाथ पवार "सरस"',
    category: 'मौखिक साहित्य',
    publisher: 'माँ ताप्ती शोध संस्थान',
    publication_year: 2023,
    pages: 240,
    isbn: '978-81-954321-3-2',
    cover_image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
    price: '₹ 300',
    is_featured: false,
    synopsis_hindi: 'सदियों से मौखिक रूप से गाई जाने वाली पवारी लोकगाथाओं, भरथरी, आल्हा एवं लोकगीतों का वैज्ञानिक संकलन। इसमें लोकगाथाओं का पवारी मूल पाठ एवं हिंदी भावार्थ संगृहीत है।',
    synopsis_english: 'Scientific compilation of traditional oral Pawari folk ballads, epic songs, and narratives preserved over centuries in Central India.',
    table_of_contents_hindi: [
      'अध्याय 1: लोकगाथा का स्वरूप और वर्गीकरण',
      'अध्याय 2: पवारी आल्हा एवं बीरगाथाएं',
      'अध्याय 3: भक्ति एवं सामाजिक लोकगाथाएं'
    ],
    attached_items: [
      {
        id: 'att-b4-1',
        title: 'संलग्न ब्लॉग: डिजिटल युग में मौखिक लोकसाहित्य का संरक्षण',
        type: 'blog',
        targetId: 'blog-3',
        description: 'प्रो. रामेश्वर शर्मा द्वारा मौखिक लोकगाथाओं के आर्काइविंग पर विशेष लेख।'
      },
      {
        id: 'att-b4-2',
        title: 'संलग्न मॉड्यूल: पवारी लोकगीत संग्रह (Lokgeet Section)',
        type: 'external',
        url: 'https://pawari-shodh-patrika.vercel.app/lokgeet',
        description: 'ऑडियो व पवारी बोल के साथ लोकगीतों का संग्रह।'
      }
    ]
  }
];

export const SAMPLE_BLOGS: BlogItem[] = [
  {
    id: 'blog-1',
    title_hindi: 'पवारी बोली का उद्भव और मध्य प्रदेश के सीमावर्ती क्षेत्रों में इसका ऐतिहासिक प्रसार',
    title_english: 'Origin of Pawari Dialect and its Historical Spread in Border Regions of MP',
    author: 'डॉ. कैलाश पवार',
    author_role: 'वरिष्ठ भाषाविद् एवं शोध निदेशक',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    date: '15 जनवरी 2026',
    read_time: '6 मिनट',
    category: 'भाषाविज्ञान',
    cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    excerpt_hindi: 'पवारी बोली मालवी, बुंदेली और मराठी के संगम स्थल पर विकसित एक समृद्ध बोली है। मध्य प्रदेश के बैतूल, छिंदवाड़ा तथा महाराष्ट्र के नागपुर, गोंदिया, वर्धा जिलों में फैली इस बोली का अपना विशिष्ट व्याकरण और शब्दावली है।',
    excerpt_english: 'Pawari dialect developed at the confluence of Malvi, Bundeli, and Marathi. Spanning Betul, Chhindwara, Nagpur, and Gondia, it possesses unique grammar and vocabulary.',
    content_hindi: `
### पवारी बोली की ऐतिहासिक पृष्ठभूमि
पवारी बोली केवल एक अभिव्यक्ति का माध्यम नहीं, बल्कि मध्य भारत के एक बड़े अंचल की सांस्कृतिक पहचान है। ऐतिहासिक दृष्टि से पवार (पवार/परमार) राजपूतों के मालवा से दक्षिण-पूर्व की ओर पलायन के साथ इस बोली का प्रसार हुआ।

### ध्वन्यात्मक एवं व्याकरणिक विशेषताएं
1. **स्वर एवं व्यञ्जन:** पवारी में मालवी की भांति स्वरों में संवृत्तता पाई जाती है, जबकि मराठी के संपर्क से इसमें लिंग भेद एवं क्रिया रूप में विशेष लचीलापन दिखता है।
2. **कारक चिह्न:** पवारी में कारक चिह्नों का प्रयोग अत्यंत रोचक है। जैसे 'को' के लिए 'ले' या 'का' के लिए 'ना/नी' का प्रयोग।
3. **क्रिया पद:** क्रिया पदों में काल एवं पुरुष के अनुसार स्पष्ट प्रत्यय जुड़ते हैं।

### वर्तमान में संरक्षण के प्रयास
आज के डिजिटल युग में पवारी शोध पत्रिका तथा माँ ताप्ती शोध संस्थान द्वारा पवारी शब्दावली के संकलन और डिजिटलीकरण का कार्य तीव्र गति से किया जा रहा है।
    `,
    content_english: `
### Historical Background of Pawari
Pawari dialect represents the cultural identity of a vast belt in Central India. Historically, as Parmar/Pawar communities migrated from Malwa towards South-East MP and Vidarbha, Pawari naturally integrated features of Malvi, Bundeli, and Marathi.
    `,
    tags: ['पवारी बोली', 'भाषाविज्ञान', 'मालवी-मराठी संगम', 'बैतूल-छिंदवाड़ा'],
    likes_count: 42,
    attached_items: [
      {
        id: 'att-bl1-1',
        title: 'संलग्न मूल ग्रन्थ: पवारी बोली एवं लोकसाहित्य का प्रामाणिक इतिहास',
        type: 'book',
        targetId: 'book-1',
        description: 'डॉ. कैलाश पवार द्वारा लिखित 384 पृष्ठों का प्रामाणिक शोध ग्रन्थ।'
      },
      {
        id: 'att-bl1-2',
        title: 'संलग्न ग्रन्थ: पवारी-हिंदी-अंग्रेजी बृहत् शब्दकोश',
        type: 'book',
        targetId: 'book-3',
        description: '15,000 पवारी शब्दों का प्रामाणिक कोष ग्रन्थ।'
      },
      {
        id: 'att-bl1-3',
        title: 'माँ ताप्ती शोध पत्रिका - अंक संग्रह लिंक',
        type: 'external',
        url: 'https://pawari-shodh-patrika.vercel.app/archives',
        description: 'पत्रिका के समस्त प्रकाशित पीयर-रिव्यूड अंकों का डायरेक्ट लिंक।'
      }
    ]
  },
  {
    id: 'blog-2',
    title_hindi: 'ताप्ती नदी तट की लोक परंपराएं एवं भाद्रपद मास के लोक उत्सव',
    title_english: 'Folk Traditions Along Tapti River & Bhadrapada Festivals',
    author: 'डॉ. अनिता मालवीय',
    author_role: 'लोकसंस्कृति अध्येता',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    date: '28 दिसंबर 2025',
    read_time: '8 मिनट',
    category: 'लोकसंस्कृति',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    excerpt_hindi: 'मुलताई (मूलताप्ती) से प्रस्फुटित होने वाली पवित्र ताप्ती नदी केवल एक जलधारा नहीं, अपितु लोकजीवन की सांस्कृतिक चेतना है। भाद्रपद मास में मनाए जाने वाले भुजरिया उत्सव और पवारी लोक नृत्यों की ऐतिहासिकता।',
    excerpt_english: 'Originating from Multai, River Tapti is the lifeline of cultural consciousness. Exploring the Bhujariya festival and Pawari folk traditions during Bhadrapada month.',
    content_hindi: `
### माँ ताप्ती और लोक चेतना
मुलताई स्थित ताप्ती सरोवर से सूर्यपुत्री ताप्ती का उद्गम होता है। इस अंचल के पवारी समाज में ताप्ती को माँ का दर्जा प्राप्त है। प्रत्येक मांगलिक अवसर पर ताप्ती मां की स्तुति एवं लोकगीत गाए जाते हैं।

### भुजरिया एवं लोक पर्व
भाद्रपद मास में भुजरिया (गेहूं के अंकुर) विसर्जन का पर्व सद्भाव और भाईचारे का प्रतीक है। इस अवसर पर पवारी बोली में बधाई एवं फाग शैली के गीत गाए जाते हैं।
    `,
    content_english: `
### Mother Tapti and Folk Consciousness
River Tapti originates at Multai. In the Pawari society of this region, Tapti holds the revered status of Mother. During Bhadrapada festivals, Wheat sprouts (Bhujariya) are immersed with devotional Pawari folk songs.
    `,
    tags: ['ताप्ती नदी', 'मुलताई', 'लोक उत्सव', 'भुजरिया', 'पवारी संस्कृति'],
    likes_count: 38,
    attached_items: [
      {
        id: 'att-bl2-1',
        title: 'संलग्न ग्रन्थ: मध्य भारत की लोकसंस्कृति और ताप्ती अंचल',
        type: 'book',
        targetId: 'book-2',
        description: 'डॉ. अनिता मालवीय द्वारा ताप्ती घाटी संस्कृति पर रचित शोध ग्रन्थ।'
      },
      {
        id: 'att-bl2-2',
        title: 'संलग्न लोकगीत संग्रह: ताप्ती माँ की पवारी स्तुति गीत',
        type: 'external',
        url: 'https://pawari-shodh-patrika.vercel.app/lokgeet',
        description: 'पवारी लोकगीत एवं ऑडियो पोर्टल लिंक।'
      }
    ]
  },
  {
    id: 'blog-3',
    title_hindi: 'डिजिटल युग में मौखिक लोकसाहित्य का संरक्षण: चुनौतियां और अवसर',
    title_english: 'Preserving Oral Folklore in Digital Era: Challenges & Opportunities',
    author: 'प्रो. रामेश्वर शर्मा',
    author_role: 'संपादक, पवारी शोध पत्रिका',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    date: '10 नवंबर 2025',
    read_time: '5 मिनट',
    category: 'डिजिटल मानविकी',
    cover_image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80',
    excerpt_hindi: 'वर्तमान तीव्र गति से बदलते परिवेश में ग्रामीण अंचलों के वयोवृद्ध लोकगायकों एवं कथावाचकों की मौखिक परंपराओं को डिजिटल प्लेटफॉर्म्स और ऑडियो-वीडियो अभिलेखागार में सहेजना समय की महती आवश्यकता है।',
    excerpt_english: 'In today’s rapidly changing environment, archiving oral folk songs and stories from veteran rural bards into digital audio-video repositories is urgent.',
    content_hindi: `
### मौखिक साहित्य के विलुप्त होने का खतरा
ग्रामीण क्षेत्रों में शहरीकरण और डिजिटल मीडिया के प्रसार से नई पीढ़ी मौखिक गाथाओं से दूर हो रही है। कई प्राचीन पवारी लोकगीत केवल वरिष्ठ बुजुर्गों की स्मृति में जीवित हैं।

### डिजिटल मानविकी की भूमिका
1. **ऑडियो रिकॉर्डिंग एवं डिजिटल आर्काइविंग:** गांवों में जाकर लोक गायकों की रिकॉर्डिंग।
2. **अंतर्राष्ट्रीय इंडेक्सिंग:** पवारी लोकसाहित्य को अंतर्राष्ट्रीय डिजिटल प्लेटफार्मों पर उपलब्ध कराना।
    `,
    content_english: `
### Role of Digital Humanities
Creating open-access audio archives and publishing annotated folk manuscripts ensures that regional dialects like Pawari reach researchers worldwide.
    `,
    tags: ['डिजिटल मानविकी', 'लोक साहित्य', 'संरक्षण', 'ऑडियो रिकॉर्डिंग'],
    likes_count: 51,
    attached_items: [
      {
        id: 'att-bl3-1',
        title: 'संलग्न ग्रन्थ: पवारी लोकगाथाएं और मौखिक परंपरा',
        type: 'book',
        targetId: 'book-4',
        description: 'रामनाथ पवार "सरस" द्वारा संकलित प्राचीन पवारी लोकगाथाएं।'
      }
    ]
  },
  {
    id: 'blog-4',
    title_hindi: 'पुस्तक समीक्षा: "सतपुड़ा के लोकदेवता और अनुष्ठान" (लेखक: सुरेश देशमुख)',
    title_english: 'Book Review: "Folk Deities & Rituals of Satpura" by Suresh Deshmukh',
    author: 'डॉ. अरविंद जोशी',
    author_role: 'समीक्षक एवं शोध विद्वान',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    date: '02 फरवरी 2026',
    read_time: '4 मिनट',
    category: 'पुस्तक समीक्षा',
    cover_image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80',
    excerpt_hindi: 'यह पुस्तक मध्य भारत की जनजातीय एवं लोकदेवता परंपरा पर एक अत्यंत गंभीर और दस्तावेजी कार्य है। लेखक ने सतपुड़ा की घाटियों में प्रचलित लोकदेवता मेघनाथ, मुठवा तथा खण्डोबा अनुष्ठानों का सूक्ष्म अध्ययन किया है।',
    excerpt_english: 'This book is an in-depth documented work on tribal and folk deity traditions in Central India, capturing Meghnath, Muthwa, and Khandoba rituals.',
    content_hindi: `
### पुस्तक समीक्षा निष्कर्ष
सुरेश देशमुख जी की यह कृति पवारी एवं सतपुड़ा अंचल की लोक मान्यता-अनुष्ठानों को समझने के लिए अनिवार्य ग्रन्थ है। पुस्तक में प्रचुर मात्रा में दुर्लभ रेखाचित्र और चित्र शामिल हैं।
    `,
    content_english: `
### Review Conclusion
Suresh Deshmukh’s work provides an indispensable guide for understanding Pawari and Satpura folk rituals. Highly recommended for researchers of mythology and anthropology.
    `,
    tags: ['पुस्तक समीक्षा', 'सतपुड़ा लोकदेवता', 'अनुष्ठान', 'संस्कृति'],
    likes_count: 29,
    attached_items: [
      {
        id: 'att-bl4-1',
        title: 'संलग्न ग्रन्थ: मध्य भारत की लोकसंस्कृति और ताप्ती अंचल',
        type: 'book',
        targetId: 'book-2',
        description: 'ताप्ती एवं सतपुड़ा अंचल की संस्कृति पर विशेष ग्रन्थ।'
      }
    ]
  }
];

export const SAMPLE_WRITERS: PawariWriterItem[] = [
  {
    id: 'writer-1',
    slug: 'dr-kailash-pawar',
    name_hindi: 'डॉ. कैलाश पवार',
    name_english: 'Dr. Kailash Pawar',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'वरिष्ठ पवारी भाषाविद्, कोषकार एवं शोध निदेशक',
    designation_english: 'Senior Pawari Linguist, Lexicographer & Research Director',
    location_hindi: 'मुलताई (जिला बैतूल, म.प्र.)',
    location_english: 'Multai (Betul District, M.P.)',
    specialization_hindi: 'पवारी भाषाविज्ञान, ध्वनिविज्ञान, व्याकरण एवं शब्दकोश निर्माण',
    bio_hindi: 'डॉ. कैलाश पवार माँ ताप्ती शोध संस्थान, मुलताई के अध्यक्ष एवं पवारी भाषा व लोकसाहित्य के अग्रणी शोधकर्ता हैं। इन्होंने पवारी बोली के ध्वनिविज्ञान, व्याकरण, एवं 15,000+ प्रविष्टियों वाले त्रिभाषीय शब्दकोश पर विगत 25 वर्षों में गहन शोध कार्य किया है। इनके संपादन में अनेक प्रामाणिक ग्रंथ एवं शोध पत्रिकाएं प्रकाशित हुई हैं।',
    bio_english: 'Dr. Kailash Pawar is the President of Maa Tapti Shodh Sansthan, Multai, and a pioneering researcher of Pawari language phonology, grammar, and lexicography.',
    awards_hindi: ['माँ ताप्ती साहित्य रत्न सम्मान (2024)', 'मध्य प्रदेश लोकसंस्कृति शोध पुरस्कार', 'सतपुड़ा भाषा गौरव उपाधि'],
    published_books: ['पवारी बोली एवं लोकसाहित्य का प्रामाणिक इतिहास', 'पवारी-हिंदी-अंग्रेजी बृहत् त्रिभाषीय शब्दकोश', 'ताप्ती कछार की भाषा एवं संस्कृति'],
    published_blogs: ['पवारी बोली का उद्भव और ऐतिहासिक प्रसार', 'पवारी लोकगीत और ताप्ती अंचल', 'पवारी ध्वनिविज्ञान और लिपि विमर्श'],
    contact_email: 'dr.kailashpawar@pawarishodh.org',
    contact_phone: '+91 94250 12345',
    website_url: 'https://pawarishodh.org/scholars/dr-kailash-pawar',
    social_links: {
      facebook: 'https://facebook.com/pawarishodh',
      youtube: 'https://youtube.com/@pawarishodh',
      wikipedia: 'https://hi.wikipedia.org'
    },
    is_featured: true,
    status: 'approved',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'writer-2',
    slug: 'prof-rameshwar-sharma',
    name_hindi: 'प्रो. रामेश्वर शर्मा',
    name_english: 'Prof. Rameshwar Sharma',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'लोकसंस्कृतिविद् एवं वरिष्ठ साहित्यकार',
    designation_english: 'Folklorist & Eminent Literary Scholar',
    location_hindi: 'छिंदवाड़ा एवं नागपुर (अंचल)',
    location_english: 'Chhindwara & Nagpur Region',
    specialization_hindi: 'मध्य भारत का लोकसाहित्य, पवारी विवाह गीत एवं मौखिक गाथाएं',
    bio_hindi: 'प्रो. रामेश्वर शर्मा सतपुड़ा एवं वर्धा-नागपुर सीमावर्ती अंचल के मूर्धन्य लोकसंस्कृतिविद हैं। इन्होंने पवारी लोकगीतों, विवाह गीतों एवं लोककथाओं का व्यापक क्षेत्रीय संकलन तथा वैज्ञानिक वर्गीकरण किया है।',
    bio_english: 'Prof. Rameshwar Sharma is a renowned folklorist specializing in Central Indian oral literature and Pawari folk ballad classification.',
    awards_hindi: ['सतपुड़ा साहित्य गौरव (2023)', 'लोककला संवर्धन पुरस्कार', 'विदर्भ-सतपुड़ा सेतु सम्मान'],
    published_books: ['सतपुड़ा अंचल के पवारी लोकगीत एवं कथाएं', 'पवारी लोकगाथाएं और मौखिक परंपरा'],
    published_blogs: ['डिजिटल युग में पवारी लोकसाहित्य का दस्तावेजीकरण', 'पवारी विवाह गीतों का शास्त्रीय सौंदर्य'],
    contact_email: 'rameshwar.sharma@pawarishodh.org',
    is_featured: true,
    status: 'approved',
    created_at: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'writer-3',
    slug: 'dr-anita-malviya',
    name_hindi: 'डॉ. अनिता मालवीय',
    name_english: 'Dr. Anita Malviya',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'पवारी कवयित्री एवं नारी लोक चेतना अध्येता',
    designation_english: 'Pawari Poetess & Women Folklore Scholar',
    location_hindi: 'बैतूल (म.प्र.)',
    location_english: 'Betul (M.P.)',
    specialization_hindi: 'पवारी काव्य सृजन, नारी लोक चेतना एवं भुजरिया-फाग पर्व',
    bio_hindi: 'डॉ. अनिता मालवीय पवारी भाषा में आधुनिक काव्य सृजन करने वाली प्रमुख रचनाकार हैं। इनकी रचनाएं पवारी समाज में नारी चेतना, पर्यावरण संरक्षण, ताप्ती महिमा और लोक उत्सवों को समर्पित हैं।',
    bio_english: 'Dr. Anita Malviya is a prominent Pawari poetess creating modern literature rooted in folk tradition and women cultural consciousness.',
    awards_hindi: ['पवारी काव्य श्री सम्मान (2025)', 'महिला साहित्य सर्जना पुरस्कार', 'मध्य प्रदेश साहित्य अकादमी फेलोशिप'],
    published_books: ['मध्य भारत की लोकसंस्कृति और ताप्ती अंचल', 'पवारी काव्य धारा: लोक चेतना के स्वर', 'ताप्ती तट के संस्कार गीत'],
    published_blogs: ['ताप्ती नदी तट की लोक परंपराएं एवं भाद्रपद मास के लोक उत्सव', 'पवारी लोकोत्सवों में मातृशक्तियों की भूमिका'],
    contact_email: 'anita.malviya@pawarishodh.org',
    is_featured: true,
    status: 'approved',
    created_at: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'writer-4',
    slug: 'suresh-deshmukh',
    name_hindi: 'श्री सुरेश देशमुख',
    name_english: 'Shri Suresh Deshmukh',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'पवारी लोकसाहित्यकार एवं पहेली-कहावत मर्मज्ञ',
    designation_english: 'Pawari Folklorist & Riddle-Proverb Specialist',
    location_hindi: 'सिवनी एवं छिंदवाड़ा (म.प्र.)',
    location_english: 'Seoni & Chhindwara (M.P.)',
    specialization_hindi: 'पवारी पहेलियाँ, लोकोक्तियाँ, मुहावरे एवं लोकदेवता अनुष्ठान',
    bio_hindi: 'श्री सुरेश देशमुख सिवनी-छिंदवाड़ा क्षेत्र में पवारी लोक मुहावरों, कहावतों, पारम्परिक पहेलियों एवं लोकदेवता मेघनाथ-मुठवा अनुष्ठानों के अग्रणी संकलनकर्ता हैं।',
    bio_english: 'Shri Suresh Deshmukh is an esteemed author collecting Pawari riddles, proverbs, and tribal-folk deity rituals.',
    awards_hindi: ['पवारी लोकसेवा सम्मान', 'सतपुड़ा शोध रत्न (2024)', 'जन-संस्कृति संवाहक उपाधि'],
    published_books: ['सतपुड़ा के लोकदेवता और अनुष्ठान', 'पवारी लोक कहावतें एवं बुझौवल', 'पवारी पहेली सागर'],
    published_blogs: ['सतपुड़ा की पवारी कहावतों में सामाजिक दर्शन', 'मेघनाथ मेला एवं लोक आस्था'],
    contact_email: 'suresh.deshmukh@pawarishodh.org',
    is_featured: true,
    status: 'approved',
    created_at: '2026-01-20T00:00:00.000Z'
  },
  {
    id: 'writer-5',
    slug: 'pt-ramnath-pawar-saras',
    name_hindi: 'पं. रामनाथ पवार "सरस"',
    name_english: 'Pt. Ramnath Pawar "Saras"',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'पवारी महाकाव्यकार एवं वरिष्ठ लोकगाथा गायक',
    designation_english: 'Pawari Epic Poet & Senior Folk Ballad Singer',
    location_hindi: 'बालाघाट एवं सिवनी (वैनगंगा अंचल)',
    location_english: 'Balaghat & Seoni (Wainganga Region)',
    specialization_hindi: 'पवारी छंदशास्त्र, रामायण काव्य एवं आल्हा-बिरहा गाथाएं',
    bio_hindi: 'पं. रामनाथ पवार "सरस" पवारी बोली में महाकाव्य रचना के अग्रदूत हैं। इन्होंने पवारी में रामायण प्रसंगों, महाभारत आख्यानों और वैनगंगा कछार की मौखिक लोकगाथाओं को पारंपरिक दोहा-चौपाई छंद में लिपिबद्ध व संगीतबद्ध किया है।',
    bio_english: 'Pt. Ramnath Pawar "Saras" is a pioneering epic poet in Pawari, versifying the Ramayana and regional ballads into classical folk metres.',
    awards_hindi: ['पवारी महाकवि सम्मान (2022)', 'वैनगंगा लोकसाहित्य शिरोमणि', 'मध्य प्रदेश संस्कृति परिषद मानपत्र'],
    published_books: ['पवारी श्रीराम गाथा (महाकाव्य)', 'पवारी लोकगाथाएं और मौखिक परंपरा', 'वैनगंगा कछार के बिरहा गीत'],
    published_blogs: ['पवारी छंद रचना की विशिष्टता', 'आल्हा शैली में पवारी वीर गाथाएं'],
    contact_email: 'ramnath.saras@pawarishodh.org',
    is_featured: true,
    status: 'approved',
    created_at: '2026-01-22T00:00:00.000Z'
  },
  {
    id: 'writer-6',
    slug: 'smt-sushila-pawar',
    name_hindi: 'श्रीमती सुशीला पवार',
    name_english: 'Smt. Sushila Pawar',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'पवारी लोकगायिका, संस्कार गीत संरक्षिका एवं लेखिका',
    designation_english: 'Pawari Folk Singer, Ritual Songs Archivist & Author',
    location_hindi: 'मुलताई (बैतूल) एवं वरुड़ (अमरावती सीमा)',
    location_english: 'Multai (Betul) & Warud (Amravati Border)',
    specialization_hindi: 'पवारी विवाह संस्कार गीत (बन्ना-बन्नी, भांवर, हल्दी), जचकी गीत एवं लोरी',
    bio_hindi: 'श्रीमती सुशीला पवार पवारी परिवार व्यवस्था और संस्कार गीतों की जीवंत धरोहर हैं। इन्होंने विगत 3 दशकों में 250 से अधिक पारंपरिक गीतों का ऑडियो संग्रह व लिपिबद्ध संकलन तैयार किया है जो आज शोधार्थियों के लिए अमूल्य निधि है।',
    bio_english: 'Smt. Sushila Pawar is an acclaimed preserver of Pawari wedding, childbirth, and festival ritual songs with over 250 documented songs.',
    awards_hindi: ['लोक मातृत्व सम्मान (2025)', 'पवारी संस्कार गीत संवर्धन पुरस्कार', 'ताप्ती लोकगंगा सम्मान'],
    published_books: ['पवारी विवाह एवं संस्कार गीत मंजूषा', 'मायके की याद: पवारी लोकगीत संग्रह'],
    published_blogs: ['पवारी विवाह के सात वचनों में निहित लोक दर्शन', 'हल्दी और बन्ना गीतों का सांस्कृतिक मर्म'],
    contact_email: 'sushila.pawar@pawarishodh.org',
    is_featured: true,
    status: 'approved',
    created_at: '2026-01-25T00:00:00.000Z'
  },
  {
    id: 'writer-7',
    slug: 'dr-manohar-singh-pawar',
    name_hindi: 'डॉ. मनोहर सिंह पवार',
    name_english: 'Dr. Manohar Singh Pawar',
    photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'सह-प्राध्यापक (भाषाविज्ञान) एवं व्याकरण अन्वेषक',
    designation_english: 'Associate Professor (Linguistics) & Grammar Researcher',
    location_hindi: 'पांढुरना एवं सौंसर (छिंदवाड़ा)',
    location_english: 'Pandhurna & Sausar (Chhindwara)',
    specialization_hindi: 'पवारी व्याकरण, वाक्य-संरचना एवं द्रविड़-आर्य भाषा संपर्क',
    bio_hindi: 'डॉ. मनोहर सिंह पवार पवारी बोली के वैज्ञानिक व्याकरण और ध्वनिशास्त्र के ख्यातिप्राप्त विशेषज्ञ हैं। इन्होंने पवारी का मराठी, गोंडी एवं हिंदी के साथ तुलनात्मक व्याकरणिक विश्लेषण तैयार किया है।',
    bio_english: 'Dr. Manohar Singh Pawar is a distinguished linguist working on the syntactic structures and cross-linguistic contacts of Pawari.',
    awards_hindi: ['भाषा वैज्ञानिक शोध प्रतिभा सम्मान (2023)', 'केंद्रीय हिंदी निदेशालय शोध अनुदान'],
    published_books: ['पवारी व्याकरण और संरचनात्मक रूपरेखा', 'सतपुड़ा अंचल की भाषाएं: एक तुलनात्मक अध्ययन'],
    published_blogs: ['पवारी क्रिया रूपों का वैज्ञानिक विश्लेषण', 'पवारी और मराठी का भाषाई समन्वय'],
    contact_email: 'manohar.pawar@pawarishodh.org',
    is_featured: false,
    status: 'approved',
    created_at: '2026-01-28T00:00:00.000Z'
  },
  {
    id: 'writer-8',
    slug: 'shri-gajanan-pawar-pathik',
    name_hindi: 'श्री गजानन पवार "पथिक"',
    name_english: 'Shri Gajanan Pawar "Pathik"',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'पवारी लोकनाट्य (गम्मत) नाटककार, निर्देशक एवं गीतकार',
    designation_english: 'Pawari Folk Theatre (Gammat) Playwright & Director',
    location_hindi: 'कटंगी एवं वारासिवनी (बालाघाट)',
    location_english: 'Katangi & Waraseoni (Balaghat)',
    specialization_hindi: 'पवारी स्वांग, गम्मत, प्रहसन एवं सामाजिक चेतना के रंगमंच',
    bio_hindi: 'श्री गजानन पवार "पथिक" पवारी लोकनाट्य "गम्मत" को आधुनिक रंगमंच पर प्रतिष्ठा दिलाने वाले अग्रणी नाटककार हैं। इनके लिखे 15 से अधिक पवारी नाटकों और सामाजिक प्रहसनों का सैकड़ों गांवों में मंचन हो चुका है।',
    bio_english: 'Shri Gajanan Pawar "Pathik" is a celebrated folk dramatist reviving the traditional Gammat theatre in Pawari.',
    awards_hindi: ['लोकनाट्य गौरव पुरस्कार (2024)', 'मध्य प्रदेश नाट्य कला रत्न', 'वैनगंगा रंगश्री सम्मान'],
    published_books: ['पवारी गम्मत और लोकनाट्य परंपरा', 'माटी की सुगंध: पवारी एकांकी संग्रह'],
    published_blogs: ['पवारी गम्मत का ऐतिहासिक उद्भव और सामाजिक प्रासंगिकता'],
    contact_email: 'gajanan.pathik@pawarishodh.org',
    is_featured: false,
    status: 'approved',
    created_at: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'writer-9',
    slug: 'shri-chintaman-pawar-madhup',
    name_hindi: 'श्री चिंतामण पवार "मधुप"',
    name_english: 'Shri Chintaman Pawar "Madhup"',
    photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'पवारी हास्य-व्यंग्यकार एवं समकालीन जनकवि',
    designation_english: 'Pawari Satirist & Contemporary People’s Poet',
    location_hindi: 'भैंसदेही एवं आठनेर (बैतूल)',
    location_english: 'Bhainsdehi & Athner (Betul)',
    specialization_hindi: 'पवारी व्यंग्य, समकालीन लोककविता, कृषि दर्शन एवं बारहमासा',
    bio_hindi: 'श्री चिंतामण पवार "मधुप" पवारी बोली के अत्यंत लोकप्रिय जन-कवि हैं। ग्रामीण जीवन के सुख-दुख, कृषि ऋतु चक्र और सामाजिक कुरीतियों पर तीखा व्यंग्य इनके पवारी दोहों और मुक्तकों की प्रमुख विशेषता है।',
    bio_english: 'Shri Chintaman Pawar "Madhup" is a beloved folk poet capturing agrarian life, seasons, and social satire in Pawari rhymed couplets.',
    awards_hindi: ['पवारी हास्य रत्न (2025)', 'सतपुड़ा जनकवि सम्मान', 'ताप्ती साहित्य साधक पुरस्कार'],
    published_books: ['पवारी व्यंग्य बाण एवं दोहावली', 'खेत-खलिहान के पवारी गीत: बारहमासा'],
    published_blogs: ['पवारी दोहों में ग्रामीण जीवन का यथार्थ'],
    contact_email: 'chintaman.madhup@pawarishodh.org',
    is_featured: false,
    status: 'approved',
    created_at: '2026-02-03T00:00:00.000Z'
  },
  {
    id: 'writer-10',
    slug: 'smt-kamala-thakur-pawar',
    name_hindi: 'श्रीमती कमला ठाकुर (पवार)',
    name_english: 'Smt. Kamala Thakur (Pawar)',
    photo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'पवारी बालसाहित्यकार एवं लोककथा संकलनकर्ता',
    designation_english: 'Pawari Children’s Author & Folktale Collector',
    location_hindi: 'बरघाट एवं उगली (सिवनी)',
    location_english: 'Barghat & Ugli (Seoni)',
    specialization_hindi: 'पवारी बालगीत, नानी-दादी की लोककथाएं एवं बाल संस्कार साहित्य',
    bio_hindi: 'श्रीमती कमला ठाकुर पवारी की नई पीढ़ी को अपनी मातृबोली से जोड़ने के लिए पवारी सचित्र बाल कहानियों, पहेलियों और बालगीतों का सृजन करने वाली प्रतिष्ठित लेखिका हैं।',
    bio_english: 'Smt. Kamala Thakur is a dedicated children’s writer producing illustrated folk stories and nursery rhymes in Pawari.',
    awards_hindi: ['बाल साहित्य संवर्धक सम्मान (2024)', 'पवारी सेवा साधक पुरस्कार'],
    published_books: ['पवारी बाल लोककथाएं (सचित्र)', 'चिड़िया और बंदर: पवारी बालगीत'],
    published_blogs: ['मातृबोली में प्राथमिक शिक्षा और पवारी बाल साहित्य'],
    contact_email: 'kamala.thakur@pawarishodh.org',
    is_featured: false,
    status: 'approved',
    created_at: '2026-02-05T00:00:00.000Z'
  },
  {
    id: 'writer-11',
    slug: 'dr-rajaram-pawar',
    name_hindi: 'डॉ. राजाराम पवार',
    name_english: 'Dr. Rajaram Pawar',
    photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'मानवविज्ञानी, इतिहासकार एवं पुरातात्विक अन्वेषक',
    designation_english: 'Anthropologist, Historian & Archaeological Explorer',
    location_hindi: 'आमला एवं मुलताई (बैतूल)',
    location_english: 'Amla & Multai (Betul)',
    specialization_hindi: 'सतपुड़ा अंचल का जनजातीय इतिहास, पवारी समाज का उद्भव एवं गढ़ी-किले',
    bio_hindi: 'डॉ. राजाराम पवार सतपुड़ा के ऐतिहासिक अभिलेखों, ताम्रपत्रों, गढ़ी-किलों और मध्य भारत में पवारी समुदाय के ऐतिहासिक प्रवासन पर विगत दो दशकों से कार्यरत वरिष्ठ शोधार्थी हैं।',
    bio_english: 'Dr. Rajaram Pawar is a senior historian and researcher studying the anthropological migration and fort history of the Pawari community.',
    awards_hindi: ['इतिहास अन्वेषक सम्मान (2023)', 'मध्य भारत शोध विभूति', 'सतपुड़ा पुरातत्व रत्न'],
    published_books: ['सतपुड़ा के किले एवं पवारी समाज का इतिहास', 'ताप्ती-वर्धा संगम का ऐतिहासिक वैभव'],
    published_blogs: ['पवार राजाओं के ताम्रपत्र और सतपुड़ा का इतिहास'],
    contact_email: 'rajaram.pawar@pawarishodh.org',
    is_featured: false,
    status: 'approved',
    created_at: '2026-02-08T00:00:00.000Z'
  },
  {
    id: 'writer-12',
    slug: 'shri-dhanraj-pawar-kaviraj',
    name_hindi: 'श्री धनराज पवार "कविराज"',
    name_english: 'Shri Dhanraj Pawar "Kaviraj"',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    designation_hindi: 'पवारी भजन-कीर्तनकार एवं संत साहित्य मर्मज्ञ',
    designation_english: 'Pawari Bhajan Singer & Saint Literature Scholar',
    location_hindi: 'सौंसर (छिंदवाड़ा) व सावनेर (नागपुर सीमा)',
    location_english: 'Sausar (Chhindwara) & Saoner (Nagpur Border)',
    specialization_hindi: 'पवारी निर्गुणी भजन, कबीर-गोरखनाथ परंपरा के पवारी पद एवं आध्यात्मिक संगीत',
    bio_hindi: 'श्री धनराज पवार "कविराज" पवारी बोली में आध्यात्मिक पदों, निर्गुणी भजनों और कीर्तनों के सुप्रसिद्ध रचयिता एवं गायक हैं। इन्होंने 100 से अधिक गांवों में पवारी भजन मंडलियों को संगठित किया है।',
    bio_english: 'Shri Dhanraj Pawar "Kaviraj" is a devotional saint-poet and musician composing Nirguni Bhajans in Pawari dialect.',
    awards_hindi: ['संत साहित्य संवाहक सम्मान (2025)', 'पवारी भजन शिरोमणि'],
    published_books: ['पवारी निर्गुणी भजन अमृत', 'सतपुड़ा की आध्यात्मिक धारा'],
    published_blogs: ['पवारी निर्गुणी भजनों में कबीर दर्शन'],
    contact_email: 'dhanraj.kaviraj@pawarishodh.org',
    is_featured: false,
    status: 'approved',
    created_at: '2026-02-10T00:00:00.000Z'
  }
];



