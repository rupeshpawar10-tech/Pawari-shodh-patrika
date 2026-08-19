import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
  Share2, 
  Download, 
  Heart, 
  Sparkles, 
  User, 
  MapPin, 
  Clock, 
  BookOpen, 
  Search, 
  Check, 
  ListMusic, 
  Sliders
} from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

export interface AudioTrack {
  id: string;
  title_hindi: string;
  title_pawari: string;
  category: 'vivah' | 'phag' | 'diwari' | 'stuti' | 'veergatha' | 'kavita';
  category_name_hindi: string;
  artist_hindi: string;
  artist_role?: string;
  artist_image?: string;
  location_hindi: string;
  duration: string;
  duration_seconds: number;
  lyrics_pawari: string[];
  lyrics_hindi: string[];
  description_hindi: string;
  audio_frequency?: number[]; // simulated melodic notes for Web Audio synthesis
}

export const PAWARI_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'track-1',
    title_hindi: 'पारंपरिक विवाह मायरो एवं हल्दी गीत',
    title_pawari: 'ओ मायरो ल्यायो रे म्हारा बीरा (हल्दी गीत)',
    category: 'vivah',
    category_name_hindi: 'विवाह लोकगीत',
    artist_hindi: 'श्रीमती सुशीला बाई पवार एवं लोक मंडली',
    artist_role: 'पारंपरिक लोकगायिका',
    artist_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    location_hindi: 'मुलताई (जिला बैतूल, म.प्र.)',
    duration: '04:15',
    duration_seconds: 255,
    description_hindi: 'पवारी समाज के वैवाहिक अनुष्ठानों में मायरा (भात) और हल्दी के समय गाए जाने वाले अत्यंत भावपूर्ण पारंपरिक लोकगीत।',
    lyrics_pawari: [
      'ओ मायरो ल्यायो रे म्हारा बीरा, रेशम की चुनरिया लायो।',
      'ताप्ती मैया की किरपा से, आंगन म मंगल छायो॥',
      'पीली-पीली हल्दी लगावो बहना को, मुखड़े प रूप सवायो।',
      'दादो-दादी देवे आशीष, पोरी को घर बसायो॥'
    ],
    lyrics_hindi: [
      'हे मेरे प्यारे भाई, तुम बहन के लिए सुंदर रेशमी चुनरी लेकर आए हो।',
      'माँ ताप्ती की कृपा से आज हमारे आंगन में चारों ओर मंगल छाया हुआ है।',
      'बहन को प्रेम से पीली हल्दी लगाओ, उसका मुखड़ा रूपवान हो गया है।',
      'दादा और दादी स्नेहपूर्वक आशीर्वाद दे रहे हैं कि बेटी का घर सुख-समृद्धि से भरा रहे।'
    ],
    audio_frequency: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00]
  },
  {
    id: 'track-2',
    title_hindi: 'फाग एवं होली लोकगीत (धमार व रंग)',
    title_pawari: 'फागुन मास रंगीलो आयो, ताप्ती तीरे मची धमार',
    category: 'phag',
    category_name_hindi: 'फाग लोकगीत',
    artist_hindi: 'श्री गजानन पवार एवं फाग मंडल',
    artist_role: 'वरिष्ठ फाग गायक एवं ढोलक वादक',
    artist_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    location_hindi: 'आमला एवं मुलताई अंचल',
    duration: '03:48',
    duration_seconds: 228,
    description_hindi: 'वसंत ऋतु एवं होली के अवसर पर गाई जाने वाली पवारी फाग, जिसमें ढोलक, झांझ और मंजीरे की थाप पर लोक आनंद मुखरित होता है।',
    lyrics_pawari: [
      'फागुन मास रंगीलो आयो, उड़े अबीर गुलाल रे।',
      'केसर रंग में रंगी चुनरिया, बाजे ताल मृदंग रे॥',
      'पवारी ग्वालिया नाचत गावत, खेलत रंग अपार रे।',
      'ताप्ती तीरे सखी सहेली, गावे फाग मल्हार रे॥'
    ],
    lyrics_hindi: [
      'आनंददायी फागुन का महीना आ गया है और चारों ओर अबीर-गुलाल उड़ रहा है।',
      'केसरिया रंग में चुनरियां रंग गई हैं और मृदंग व ढोलक की थाप गूंज रही है।',
      'पवारी ग्वाले नाचते-गाते हुए उल्लासपूर्वक रंग खेल रहे हैं।',
      'ताप्ती नदी के पावन तट पर सखियां मिलकर मधुर फाग गा रही हैं।'
    ],
    audio_frequency: [293.66, 329.63, 369.99, 392.00, 440.00, 493.88]
  },
  {
    id: 'track-3',
    title_hindi: 'दिवारी एवं गोवर्धन पूजा लोकगाथा',
    title_pawari: 'दिवारी का दिन आयो, गैया की आरती सजाओ',
    category: 'diwari',
    category_name_hindi: 'दिवारी लोकगीत',
    artist_hindi: 'श्री सुखदेव राव पवार',
    artist_role: 'पारंपरिक लोकगाथा गायक',
    artist_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    location_hindi: 'छिंदवाड़ा एवं सौंसर अंचल',
    duration: '05:10',
    duration_seconds: 310,
    description_hindi: 'दीपावली के दूसरे दिन गोवर्धन पूजा व पड़वा पर गाए जाने वाले पवारी दिवारी दोहे एवं गाय-बैल की वंदना।',
    lyrics_pawari: [
      'दिवारी का दिन आयो भाइयो, मोरी गैया सिंगारो।',
      'मोरपंख माथे सजावो, बाजे घुंघरू प्यारो॥',
      'गोवर्धन बाबा की जय बोलो, अन्न-धन से भंडार भरो।',
      'पवारी माटी का यह उत्सव, नित-नित मंगल करो॥'
    ],
    lyrics_hindi: [
      'भाइयों, दीपावली और दिवारी का पावन दिन आ गया है, हमारी गौमाता को सजाओ।',
      'गौमाता के माथे पर मोरपंख सजाओ और उनके पैरों में मधुर घुंघरू बांधो।',
      'गोवर्धन भगवान की जयकार करो जो हमारे घर-आंगन को अन्न-धन से भरते हैं।',
      'पवारी धरा का यह पावन पर्व सदा हमारे जीवन में सुख-समृद्धि लाए।'
    ],
    audio_frequency: [220.00, 246.94, 277.18, 293.66, 329.63, 369.99]
  },
  {
    id: 'track-4',
    title_hindi: 'माँ ताप्ती प्राकट्य वंदना एवं स्तुति',
    title_pawari: 'जय ताप्ती मात भवानी, मुलताई की पावन रानी',
    category: 'stuti',
    category_name_hindi: 'लोक वंदना',
    artist_hindi: 'डॉ. अनिता मालवीय एवं साथी',
    artist_role: 'कवयित्री एवं लोकगायिका',
    artist_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    location_hindi: 'मुलताई (पवित्र उद्गम तीर्थ)',
    duration: '04:32',
    duration_seconds: 272,
    description_hindi: 'सूर्यपुत्री माँ ताप्ती की स्तुति में रचित पवारी लोक वंदना, जिसे प्रातःकाल मुलताई सरोवर तट पर गाया जाता है।',
    lyrics_pawari: [
      'जय ताप्ती मात भवानी, मुलताई की पावन रानी।',
      'सूर्यदेव की प्यारी बेटी, तेरी महिमा सबने मानी॥',
      'सात कुंड से निकली धारा, सब दुख हरने वारी।',
      'पवारी प्रजा करे वंदना, राखो लाज हमारी॥'
    ],
    lyrics_hindi: [
      'माँ ताप्ती भवानी की जय हो, जो पवित्र तीर्थ मुलताई की अधिष्ठात्री हैं।',
      'आप भगवान सूर्य नारायण की परम तेजस्वी पुत्री हैं, जिनकी महिमा सर्वत्र व्याप्त है।',
      'सप्त कुंडों से प्रस्फुटित आपकी शीतल जलधारा भक्तों के समस्त कष्टों का निवारण करती है।',
      'समस्त पवारी जन आपकी वंदना करते हैं, आप सदा हमारी रक्षा करें।'
    ],
    audio_frequency: [261.63, 329.63, 392.00, 523.25, 440.00]
  },
  {
    id: 'track-5',
    title_hindi: 'पवारी बीरगाथा (आल्हा शैली लोककाव्य)',
    title_pawari: 'सतपुड़ा रा बीर सिपाही, रण म मची पुकार',
    category: 'veergatha',
    category_name_hindi: 'बीरगाथा',
    artist_hindi: 'श्री रामनाथ पवार "सरस"',
    artist_role: 'लोकगाथा गायक',
    artist_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    location_hindi: 'सिवनी एवं छिंदवाड़ा',
    duration: '06:20',
    duration_seconds: 380,
    description_hindi: 'आल्हा-ऊदल एवं पवारी परमार वीरों के पराक्रम का आल्हा शैली में ओजस्वी गायन।',
    lyrics_pawari: [
      'सतपुड़ा की घाटी गूंजे, बीर पुकारे बारंबार।',
      'परमार कुल का मान बढ़ावे, खनके तीखी तलवार॥',
      'माटी खातर शीश नवावे, पीछे पग न हटावे बीर।',
      'पवारी गाथा गावे दुनिया, धन्य-धन्य सतपुड़ा तीर॥'
    ],
    lyrics_hindi: [
      'सतपुड़ा की विस्तृत घाटियों में वीर योद्धाओं की जयकार गूंज रही है।',
      'परमार वंश के गौरव की रक्षा के लिए वीरों की तलवारें चमक रही हैं।',
      'मातृभूमि की रक्षा हेतु अपने प्राण न्योछावर करने वाले वीर कभी पीछे नहीं हटते।',
      'संसार इन पवारी वीरों का यशोगान करता है, सतपुड़ा की यह पावन भूमि धन्य है।'
    ],
    audio_frequency: [196.00, 220.00, 246.94, 293.66, 329.63]
  },
  {
    id: 'track-6',
    title_hindi: 'पवारी कविता पाठ: "म्हारी पवारी बोली प्यारी"',
    title_pawari: 'म्हारी पवारी बोली प्यारी, सतपुड़ा की शान निराली',
    category: 'kavita',
    category_name_hindi: 'कविता पाठ',
    artist_hindi: 'डॉ. कैलाश पवार',
    artist_role: 'वरिष्ठ साहित्यकार एवं कवि',
    artist_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    location_hindi: 'मुलताई (म.प्र.)',
    duration: '03:15',
    duration_seconds: 195,
    description_hindi: 'पवारी मातृभाषा के गौरव, मधुरता और सांस्कृतिक स्वाभिमान पर स्वरचित ओजपूर्ण काव्य पाठ।',
    lyrics_pawari: [
      'दूध-जलेबी सी मीठी वाणी, म्हारी पवारी बोली।',
      'सच्चे मन से जो भी बोले, भर दे खुशियों की झोली॥',
      'ताप्ती की कल-कल धारा में, पवारी का रस बहता।',
      'सतपुड़ा का हर एक बच्चा, गर्व से पवारी कहता॥'
    ],
    lyrics_hindi: [
      'दूध और जलेबी जैसी मधुर व रसदार हमारी प्यारी पवारी बोली है।',
      'जो भी इसे सच्चे हृदय से बोलता है, उसका जीवन आनंद से भर जाता है।',
      'माँ ताप्ती की अविरल जलधारा में पवारी का अमृत रस प्रवाहित होता है।',
      'सतपुड़ा का प्रत्येक बालक गर्व से अपनी पवारी बोली का सम्मान करता है।'
    ],
    audio_frequency: [261.63, 293.66, 329.63, 392.00, 440.00]
  }
];

export const PawariAudioArchive: React.FC<{ lang?: 'hi' | 'en' }> = ({ lang = 'hi' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(PAWARI_AUDIO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Web Audio Context for synthesized melodious folk tone when playing
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<any>(null);

  const filteredTracks = PAWARI_AUDIO_TRACKS.filter(track => {
    const matchesCat = selectedCategory === 'all' || track.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      track.title_hindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.title_pawari.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist_hindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.location_hindi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Start sound synthesis simulation when playing
  const startSynth = (track: AudioTrack) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (e) {}
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine'; // warm harmonium/flute-like fundamental
      const baseFreq = (track.audio_frequency && track.audio_frequency[0]) || 261.63;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      gain.gain.setValueAtTime(isMuted ? 0 : 0.12, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn('Audio synthesis fallback inactive:', e);
    }
  };

  const stopSynth = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startSynth(currentTrack);
      timerRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= currentTrack.duration_seconds) {
            setIsPlaying(false);
            stopSynth();
            return 0;
          }
          return t + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      stopSynth();
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
      stopSynth();
    };
  }, [isPlaying, currentTrack, playbackSpeed, isMuted]);

  const handlePlayTrack = (track: AudioTrack) => {
    if (currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handleNext = () => {
    const idx = PAWARI_AUDIO_TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % PAWARI_AUDIO_TRACKS.length;
    setCurrentTrack(PAWARI_AUDIO_TRACKS[nextIdx]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const idx = PAWARI_AUDIO_TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + PAWARI_AUDIO_TRACKS.length) % PAWARI_AUDIO_TRACKS.length;
    setCurrentTrack(PAWARI_AUDIO_TRACKS[prevIdx]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleShare = (track: AudioTrack) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/audio/${track.id}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(track.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-amber-950 to-red-900 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
            <Music className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'पवारी मौखिक धरोहर एवं ध्वनि अभिलेखागार' : 'Pawari Oral Literature & Audio Archive'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            {lang === 'hi' ? 'ऑडियो लोकगीत, फाग एवं कविता पाठ संग्रह' : 'Pawari Audio Folk Songs & Poetry Recitation'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
            {lang === 'hi' 
              ? 'मुलताई, बैतूल, छिंदवाड़ा एवं सतपुड़ा अंचल के बुजुर्ग लोकगायकों द्वारा गाए गए मूल पारंपरिक विवाह गीत, फाग, दिवारी, बीरगाथाएं एवं स्वरचित कविता पाठ।'
              : 'Authentic oral folk songs, wedding songs, Phag, Diwari, heroic ballads, and poetry recitations from Satpura region with synchronized lyrics.'}
          </p>
        </div>

        {/* Live Audio Visualizer Pill */}
        <div className="relative z-10 bg-black/40 border border-amber-500/30 rounded-2xl p-4 flex items-center space-x-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-red-950 flex items-center justify-center font-bold shadow-md">
            {isPlaying ? <Music className="w-6 h-6 animate-bounce" /> : <ListMusic className="w-6 h-6" />}
          </div>
          <div className="text-xs">
            <p className="font-bold text-amber-200 font-serif">
              {isPlaying ? (lang === 'hi' ? '▶ ऑडियो बज रहा है' : '▶ Now Playing') : (lang === 'hi' ? 'ऑडियो प्लेयर तैयार' : 'Audio Player Ready')}
            </p>
            <p className="text-[11px] text-amber-300/70 font-mono truncate max-w-[180px]">
              {currentTrack.title_pawari}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- ACTIVE AUDIO PLAYER CONSOLE ---------------- */}
      <div className="bg-white border border-amber-900/15 rounded-3xl p-6 shadow-md space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Current Track Info */}
          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md bg-slate-900">
              <SafeImage 
                src={currentTrack.artist_image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'} 
                alt={currentTrack.artist_hindi} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-950 font-bold">
                  {currentTrack.category_name_hindi}
                </span>
                <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  <span>{currentTrack.location_hindi}</span>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 leading-snug">
                {currentTrack.title_pawari}
              </h3>
              <p className="text-xs font-semibold text-red-900">
                {lang === 'hi' ? 'स्वर:' : 'Singer:'} {currentTrack.artist_hindi} ({currentTrack.artist_role || 'लोक गायक'})
              </p>
            </div>
          </div>

          {/* Master Controls & Waveform */}
          <div className="w-full lg:flex-1 max-w-xl space-y-3">
            {/* Scrubber Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={currentTrack.duration_seconds}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>{formatTime(currentTime)}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Buttons Bar */}
            <div className="flex items-center justify-between">
              {/* Playback Speed */}
              <div className="flex items-center space-x-1 bg-slate-100 rounded-xl p-1 text-xs font-mono">
                {[0.75, 1.0, 1.25].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded-lg font-bold text-[10px] ${
                      playbackSpeed === speed ? 'bg-amber-500 text-red-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Main Play / Prev / Next */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl hover:bg-amber-100 text-slate-700 transition cursor-pointer"
                  title="पिछला ट्रैक (Previous)"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 rounded-2xl bg-gradient-to-r from-red-950 to-amber-900 hover:from-red-900 hover:to-amber-800 text-amber-200 shadow-md transition cursor-pointer transform hover:scale-105"
                  title={isPlaying ? 'विराम (Pause)' : 'चलाएं (Play)'}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl hover:bg-amber-100 text-slate-700 transition cursor-pointer"
                  title="अगला ट्रैक (Next)"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Volume / Mute */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title={isMuted ? 'ध्वनि चालू करें' : 'म्यूट करें'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleLike(currentTrack.id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition flex items-center space-x-1 text-xs"
                  title="पसंद करें (Like)"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                  <span className="font-mono text-xs">{likes[currentTrack.id] || 24}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Synchronized Lyrics Showcase */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-900/10 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <h4 className="font-serif font-bold text-sm text-red-950 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>{lang === 'hi' ? 'पवारी लोकगीत बोल (Lyrics) एवं हिंदी भावार्थ' : 'Pawari Lyrics & Meaning'}</span>
            </h4>
            <span className="text-[11px] font-mono text-amber-800 font-semibold">
              {currentTrack.category_name_hindi}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Pawari Column */}
            <div className="space-y-2 bg-white/70 p-4 rounded-xl border border-amber-200">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900">
                {lang === 'hi' ? 'मूल पवारी बोल' : 'Original Pawari Lyrics'}
              </span>
              <div className="space-y-1.5 font-serif font-bold text-red-950">
                {currentTrack.lyrics_pawari.map((line, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Hindi Column */}
            <div className="space-y-2 bg-white/70 p-4 rounded-xl border border-amber-200">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">
                {lang === 'hi' ? 'हिंदी भावार्थ' : 'Hindi Meaning'}
              </span>
              <div className="space-y-1.5 text-slate-700 font-sans">
                {currentTrack.lyrics_hindi.map((line, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- FILTER & TRACKS CATALOG ---------------- */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'सभी ट्रैक' },
              { id: 'vivah', label: '💍 विवाह गीत' },
              { id: 'phag', label: '🌸 फाग व होली' },
              { id: 'diwari', label: '🪔 दिवारी' },
              { id: 'stuti', label: '🙏 माँ ताप्ती स्तुति' },
              { id: 'veergatha', label: '⚔️ बीरगाथा' },
              { id: 'kavita', label: '✍️ कविता पाठ' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-red-950 text-amber-200 shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Track */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'गीत या गायक खोजें...' : 'Search track or singer...'}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTracks.map(track => {
            const isCurrent = currentTrack.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => handlePlayTrack(track)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between group space-y-3 ${
                  isCurrent 
                    ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-400' 
                    : 'bg-white border-amber-900/10 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-950">
                      {track.category_name_hindi}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{track.duration}</span>
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-400/60 shadow-xs bg-slate-900">
                      <SafeImage 
                        src={track.artist_image || ''} 
                        alt={track.artist_hindi} 
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-slate-900 group-hover:text-red-950 text-xs sm:text-sm line-clamp-1">
                        {track.title_pawari}
                      </h4>
                      <p className="text-[11px] text-red-900 font-semibold truncate mt-0.5">
                        {track.artist_hindi}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        📍 {track.location_hindi}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg">
                    {track.description_hindi}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-bold flex items-center space-x-1.5 ${isCurrent && isPlaying ? 'text-amber-800' : 'text-slate-600 group-hover:text-red-950'}`}>
                    {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isCurrent && isPlaying ? (lang === 'hi' ? 'विराम' : 'Pause') : (lang === 'hi' ? 'चलाएं' : 'Play')}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(track);
                      }}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-100 text-slate-600 transition"
                      title="लिंक कॉपी करें"
                    >
                      {copiedId === track.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
