export type Language = 'en' | 'bn';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Header & Brand
    brandName: 'ToolBox BD',
    brandTagline: 'Fast · Free · Private',
    allTools: 'All Tools',
    images: 'Images',
    textTools: 'Text Tools',
    calculators: 'Calculators',
    pdfTools: 'PDF Tools',
    about: 'About',
    searchPlaceholder: 'Search tools...',
    searchToolsKbd: 'Search tools... ⌘K',
    bookmarks: 'Bookmarks',
    installApp: 'Install App',
    language: 'Language',
    languageEnglish: 'English',
    languageBengali: 'বাংলা',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    toggleTheme: 'Toggle theme',
    menu: 'Menu',
    closeMenu: 'Close menu',

    // Hero Section
    heroKicker: 'ToolBox BD · 11 Free Web Utilities',
    heroTitle: 'Fast, Free & Private Online Tools for Everyone',
    heroDescription:
      'Compress photos, count words, calculate dates, and convert documents directly in your browser. No file uploads, no signup, 100% private.',
    heroSearchPlaceholder: 'Search by tool name or keyword (e.g. compress, qr, age)...',
    popular: 'Popular:',
    clear: 'Clear',

    // Recently Used
    recentlyUsed: 'Recently Used',
    recentlyUsedSubtitle: 'Quickly return to the utilities you recently used.',
    clearHistory: 'Clear History',
    lastVisited: 'Last Visited',
    openTool: 'Open Tool',
    toolSingle: 'tool',
    toolPlural: 'tools',

    // Catalog & Filter
    allCategories: 'All Categories',
    all: 'All',
    showing: 'Showing',
    of: 'of',
    resetFilters: 'Reset Filters',
    noToolsFound: 'No tools matched your search',
    noToolsDesc: "We couldn't find anything matching your query. Try resetting your filters.",
    inBrowserBadge: '100% In-Browser',
    addToFavorites: 'Add to bookmarks',
    removeFromFavorites: 'Remove from bookmarks',

    // Why Section
    whyToolBoxBD: 'Why ToolBox BD?',
    whyTitle: 'Engineered for Speed, Simplicity & Ironclad Privacy',
    whyDescription:
      'Unlike other online utility sites that upload your photos, documents, and personal writing to remote servers, ToolBox BD does the heavy lifting right inside your web browser.',
    feature1Title: '100% In-Browser Privacy',
    feature1Desc:
      'Your files never leave your device. All image processing, conversions, and calculations run entirely in local memory.',
    feature2Title: 'Lightning Fast Performance',
    feature2Desc:
      'Zero server queues or network latency. Process tasks instantly on high-end PCs and mobile devices alike.',
    feature3Title: 'Completely Free Forever',
    feature3Desc:
      'No subscription paywalls, no hidden usage limits, and no registration or personal account requirements.',
    feature4Title: 'Offline & PWA Ready',
    feature4Desc:
      'Install ToolBox BD to your home screen or desktop and enjoy seamless access even with no internet connection.',

    // Footer
    quickLinks: 'Quick Links',
    legal: 'Legal & Privacy',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contact: 'Contact Support',
    rightsReserved: 'All rights reserved. Fast, client-side online tools for Bangladesh & the world.',

    // Mobile Bottom Nav
    bottomNavHome: 'Home',
    bottomNavCategories: 'Categories',
    bottomNavFavorites: 'Favorites',
    bottomNavSearch: 'Search',

    // Offline & Status
    offlineIndicator: 'Offline Mode — All client-side tools remain fully functional.',
  },
  bn: {
    // Header & Brand
    brandName: 'টুলবক্স বিডি',
    brandTagline: 'দ্রুত · ফ্রি · নিরাপদ',
    allTools: 'সকল টুলস',
    images: 'ছবি ও মিডিয়া',
    textTools: 'টেক্সট টুলস',
    calculators: 'ক্যালকুলেটর',
    pdfTools: 'পিডিএফ টুলস',
    about: 'পরিচিতি',
    searchPlaceholder: 'টুল খুঁজুন...',
    searchToolsKbd: 'টুল খুঁজুন... ⌘K',
    bookmarks: 'বুকমার্কস',
    installApp: 'অ্যাপ ইন্সটল',
    language: 'ভাষা',
    languageEnglish: 'English',
    languageBengali: 'বাংলা',
    darkMode: 'ডার্ক মোড',
    lightMode: 'লাইট মোড',
    toggleTheme: 'থিম পরিবর্তন করুন',
    menu: 'মেন্যু',
    closeMenu: 'মেন্যু বন্ধ করুন',

    // Hero Section
    heroKicker: 'টুলবক্স বিডি · ১১টি ফ্রি ওয়েব টুলস',
    heroTitle: 'সবার জন্য দ্রুত, ফ্রি ও সম্পূর্ণ নিরাপদ অনলাইন টুলস',
    heroDescription:
      'ছবি কমপ্রেস, শব্দ গণনা, বয়স হিসাব এবং ডকুমেন্ট রূপান্তর করুন সরাসরি আপনার ব্রাউজারে। কোনো ফাইল আপলোড বা সাইনআপ ছাড়া ১০০% নিরাপদ।',
    heroSearchPlaceholder: 'টুলের নাম বা বিষয় দিয়ে খুঁজুন (যেমন: কমপ্রেস, কিউআর, বয়স)...',
    popular: 'জনপ্রিয়:',
    clear: 'মুছুন',

    // Recently Used
    recentlyUsed: 'সম্প্রতি ব্যবহৃত',
    recentlyUsedSubtitle: 'আপনার সম্প্রতি ব্যবহৃত টুলগুলোতে দ্রুত ফিরে যান।',
    clearHistory: 'হিস্ট্রি মুছুন',
    lastVisited: 'সর্বশেষ ব্যবহৃত',
    openTool: 'টুল খুলুন',
    toolSingle: 'টুল',
    toolPlural: 'টুলস',

    // Catalog & Filter
    allCategories: 'সকল ক্যাটাগরি',
    all: 'সবগুলো',
    showing: 'প্রদর্শিত',
    of: 'এর মধ্যে',
    resetFilters: 'ফিল্টার রিসেট করুন',
    noToolsFound: 'কোনো টুল খুঁজে পাওয়া যায়নি',
    noToolsDesc: 'আপনার অনুসন্ধানের সাথে মিলছে এমন কিছু পাওয়া যায়নি। ফিল্টার রিসেট করে চেষ্টা করুন।',
    inBrowserBadge: '১০০% ব্রাউজারে',
    addToFavorites: 'বুকমার্কে যোগ করুন',
    removeFromFavorites: 'বুকমার্ক থেকে সরান',

    // Why Section
    whyToolBoxBD: 'কেন টুলবক্স বিডি?',
    whyTitle: 'গতি, সরলতা ও কঠোর গোপনীয়তার নিশ্চয়তা',
    whyDescription:
      'অন্যান্য ওয়েবসাইটের মতো আপনার ছবি বা ডকুমেন্ট সার্ভারে আপলোড করার প্রয়োজন নেই, টুলবক্স বিডি সবকিছু সরাসরি আপনার ব্রাউজারেই সম্পন্ন করে।',
    feature1Title: '১০০% ব্রাউজার প্রসেসিং',
    feature1Desc:
      'আপনার ফাইল কখনোই ডিভাইস থেকে বাইরে যায় না। ছবি প্রসেসিং, কনভার্সন ও হিসাব সম্পূর্ণ লোকালি সম্পন্ন হয়।',
    feature2Title: 'বিদ্যুতগতি পারফরম্যান্স',
    feature2Desc:
      'সার্ভার লাইনে অপেক্ষার ঝামেলা ছাড়া সাথে সাথে কাজ শেষ হয়। মোবাইল কিংবা কম্পিউটারে দারুণ দ্রুত গতি।',
    feature3Title: 'আজীবন সম্পূর্ণ ফ্রি',
    feature3Desc:
      'কোনো সাবস্ক্রিপশন ফি নেই, কোনো লুকানো লিমিট নেই, এবং কোনো অ্যাকাউন্ট খোলার ঝামেলা নেই।',
    feature4Title: 'অফলাইন ও PWA সাপোর্ট',
    feature4Desc:
      'মোবাইল বা পিসিতে অ্যাপ হিসেবে ইন্সটল করে ইন্টারনেট সংযোগ ছাড়াই যেকোনো সময় নিশ্চিন্তে ব্যবহার করুন।',

    // Footer
    quickLinks: 'গুরুত্বপূর্ণ লিংক',
    legal: 'নীতিমালা ও শর্তাবলী',
    privacyPolicy: 'গোপনীয়তা নীতি',
    termsOfService: 'ব্যবহারের শর্তাবলী',
    contact: 'যোগাযোগ ও সাপোর্ট',
    rightsReserved: 'সর্বস্বত্ব সংরক্ষিত। বাংলাদেশ ও বিশ্বের জন্য দ্রুত ও নিরাপদ অনলাইন টুলস।',

    // Mobile Bottom Nav
    bottomNavHome: 'হোম',
    bottomNavCategories: 'ক্যাটাগরি',
    bottomNavFavorites: 'বুকমার্কস',
    bottomNavSearch: 'অনুসন্ধান',

    // Offline & Status
    offlineIndicator: 'অফলাইন মোড — ব্রাউজারে সব টুলস স্বাভাবিকভাবেই কাজ করছে।',
  },
};

export const TOOL_TRANSLATIONS: Record<
  string,
  { bn: { name: string; tagline: string; description: string; categoryName: string } }
> = {
  'image-compressor': {
    bn: {
      name: 'ইমেজ কমপ্রেসার',
      tagline: 'ছবির গুণমান বজায় রেখে JPEG, PNG ও WebP ফাইলের সাইজ কমান',
      description: 'স্মার্ট ব্রাউজার-ভিত্তিক ইমেজ কম্প্রেশন যা গুণমান না কমিয়ে ফাইলের সাইজ ৮৫% পর্যন্ত ছোট করে। দ্রুত, সম্পূর্ণ নিরাপদ এবং অফলাইনে কাজ করে।',
      categoryName: 'ছবি ও মিডিয়া',
    },
  },
  'image-resizer': {
    bn: {
      name: 'ইমেজ রিসাইজার',
      tagline: 'পাসপোর্ট ও সোশ্যাল মিডিয়ার জন্য ছবির সাইজ পরিবর্তন করুন',
      description: 'যেকোনো ছবির প্রস্থ ও উচ্চতা সহজে পরিবর্তন করুন। অ্যাসপেক্ট রেশিও ঠিক রেখে ফেসবুক, ইনস্টাগ্রাম বা অফিসিয়াল ফর্মের মাপ নির্বাচন করুন।',
      categoryName: 'ছবি ও মিডিয়া',
    },
  },
  'image-cropper': {
    bn: {
      name: 'ইমেজ ক্রপার',
      tagline: 'নিখুঁত অনুপাতে ছবি ক্রপ ও রোটেট করুন',
      description: 'সহজেই ছবি ক্রপ করার টুল। ১:১ স্কয়ার, ১৬:৯ ওয়াইডস্ক্রিন বা গোল প্রোফাইল অবতার আকারে কাটুন।',
      categoryName: 'ছবি ও মিডিয়া',
    },
  },
  'qr-code-generator': {
    bn: {
      name: 'কিউআর কোড জেনারেটর',
      tagline: 'ওয়েবসাইট, ওয়াই-ফাই ও বিকাশ/নগদ পেমেন্টের জন্য QR কোড তৈরি করুন',
      description: 'যেকোনো লিংক, ওয়াই-ফাই নেটওয়ার্ক বা মোবাইল ব্যাংকিং পেমেন্টের জন্য সেকেন্ডে হাই-রেজোলিউশন QR কোড ডাউনলোড করুন।',
      categoryName: 'টেক্সট ও কন্টেন্ট',
    },
  },
  'word-counter': {
    bn: {
      name: 'ওয়ার্ড কাউন্টার',
      tagline: 'শব্দ, অক্ষর, বাক্য ও পড়ার সময় গণনা করুন',
      description: 'আপনার লেখার শব্দ ও অক্ষর নির্ভুলভাবে গণনা করুন। আর্টিকেল বা অ্যাসাইনমেন্টের পড়ার ও বলার আনুমানিক সময় জানুন।',
      categoryName: 'টেক্সট ও কন্টেন্ট',
    },
  },
  'text-case-converter': {
    bn: {
      name: 'টেক্সট কেস কনভার্টার',
      tagline: 'UPPERCASE, lowercase ও Title Case-এ টেক্সট রূপান্তর করুন',
      description: 'যেকোনো প্যারাগ্রাফ বা লিস্ট এক ক্লিকে ক্যাপিটালাইজ, ছোট হাতের বা টাইটেল কেসে পরিবর্তন করুন।',
      categoryName: 'টেক্সট ও কন্টেন্ট',
    },
  },
  'age-calculator': {
    bn: {
      name: 'বয়স ক্যালকুলেটর',
      tagline: 'বছর, মাস ও দিনে সঠিক বয়স এবং পরবর্তী জন্মদিন হিসাব করুন',
      description: 'জন্মতারিখ থেকে আপনার সঠিক বয়স, মোট দিন, সপ্তাহ এবং পরবর্তী জন্মদিনের কাউন্টডাউন দেখুন।',
      categoryName: 'ক্যালকুলেটর ও গণিত',
    },
  },
  'calculator': {
    bn: {
      name: 'ক্যালকুলেটর',
      tagline: 'দৈনন্দিন সাধারণ ও বৈজ্ঞানিক ডিজিটাল ক্যালকুলেটর',
      description: 'যোগ, বিয়োগ, গুণ, ভাগ, শতকরা এবং বৈজ্ঞানিক হিসাবের জন্য একটি পরিচ্ছন্ন ও দ্রুত অনলাইন ক্যালকুলেটর।',
      categoryName: 'ক্যালকুলেটর ও গণিত',
    },
  },
  'unit-converter': {
    bn: {
      name: 'ইউনিট কনভার্টার',
      tagline: 'দৈর্ঘ্য, ওজন, জমি/ক্ষেত্রফল ও তাপমাত্রার তাৎক্ষণিক রূপান্তর',
      description: 'মিটার, ফুট, কেজি, পাউন্ড, শতক/ডেসিমেল, কাঠা, বিঘা এবং সেলসিয়াস-ফারেনহাইটের মতো দেশি ও বিদেশি এককের নির্ভুল কনভার্টার।',
      categoryName: 'ক্যালকুলেটর ও গণিত',
    },
  },
  'image-to-pdf': {
    bn: {
      name: 'ইমেজ টু পিডিএফ',
      tagline: 'একাধিক ছবি যুক্ত করে একটি গোছানো PDF ডকুমেন্ট তৈরি করুন',
      description: 'JPG, PNG বা WebP ছবিগুলোকে একটি ফাইলে একত্রিত করে প্রিন্ট-রেডি পিডিএফ তৈরি করুন।',
      categoryName: 'পিডিএফ টুলস',
    },
  },
  'pdf-to-image': {
    bn: {
      name: 'পিডিএফ টু ইমেজ',
      tagline: 'পিডিএফ এর প্রতি পাতা থেকে উচ্চ মানের JPG বা PNG ছবি বের করুন',
      description: 'আপনার পিডিএফ ফাইলের প্রতিটি পৃষ্ঠাকে স্পষ্ট ছবিতে রূপান্তর করুন এবং একক পাতা বা জিপ (ZIP) আকারে ডাউনলোড করুন।',
      categoryName: 'পিডিএফ টুলস',
    },
  },
};

export const CATEGORY_TRANSLATIONS: Record<
  string,
  { bn: { name: string; description: string } }
> = {
  image: {
    bn: {
      name: 'ছবি ও মিডিয়া',
      description: 'সার্ভারে আপলোড না করে সরাসরি ব্রাউজারেই ছবি কমপ্রেস, সাইজ পরিবর্তন ও ক্রপ করুন।',
    },
  },
  text: {
    bn: {
      name: 'টেক্সট ও কন্টেন্ট',
      description: 'শব্দ গণনা, লেখার কেস পরিবর্তন এবং সহজেই টেক্সট বিশ্লেষণ করুন।',
    },
  },
  calculator: {
    bn: {
      name: 'ক্যালকুলেটর ও গণিত',
      description: 'সঠিক বয়স হিসাব, সাধারণ গাণিতিক হিসাব এবং বিভিন্ন পরিমাপের রূপান্তর।',
    },
  },
  pdf: {
    bn: {
      name: 'পিডিএফ টুলস',
      description: 'ছবি থেকে পিডিএফ ডকুমেন্ট তৈরি করুন অথবা পিডিএফ এর পাতাগুলো ছবিতে রূপান্তর করুন।',
    },
  },
};
