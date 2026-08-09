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
  cover_image: string;
  pdf_url?: string;
  excerpt_hindi: string;
  excerpt_english: string;
  content_hindi: string;
  content_english: string;
  tags: string[];
  likes_count?: number;
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

