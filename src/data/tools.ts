import { ToolItem, CategoryInfo, ToolCategory } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'image',
    name: 'Image & Media',
    description: 'Compress, resize, and crop images directly in your browser without uploading to any server.',
    iconName: 'Image',
  },
  {
    id: 'text',
    name: 'Text & Content',
    description: 'Analyze word counts, convert letter casing, and format textual content effortlessly.',
    iconName: 'FileText',
  },
  {
    id: 'calculator',
    name: 'Calculators & Math',
    description: 'Calculate exact chronological age, perform everyday arithmetic, and solve mathematical expressions.',
    iconName: 'Calculator',
  },
  {
    id: 'pdf',
    name: 'PDF Utilities',
    description: 'Convert pictures into multi-page PDF documents or render PDF pages as image files in seconds.',
    iconName: 'FileStack',
  },
];

export const TOOLS: ToolItem[] = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    tagline: 'Reduce JPEG, PNG, and WebP file size without losing visual clarity',
    description: 'Smart browser-based image compression that shrinks image bytes by up to 85% with zero quality loss. Fast, completely private, and works offline.',
    category: 'image',
    categoryName: 'Image & Media',
    iconName: 'Minimize2',
    featured: true,
    popular: true,
    browserOnly: true,
    processingTime: 'Instant',
    features: [
      'Multi-format support for JPG, PNG, and WebP',
      'Configurable compression slider with real-time file size preview',
      '100% private: images are processed locally on your device',
      'Batch download for compressed images',
      'No file size restrictions or watermarks'
    ],
    howToUse: [
      { step: 'Select or drag your image', detail: 'Upload one or multiple JPG, PNG, or WebP files from your phone or computer.' },
      { step: 'Adjust compression ratio', detail: 'Use the quality slider to find your preferred balance between file size and sharpness.' },
      { step: 'Download optimized image', detail: 'Compare original vs compressed size and click Download instantly.' }
    ],
    faqs: [
      { question: 'Does ToolBox BD upload my photos to an external server?', answer: 'No. All image compression runs 100% locally in your web browser using HTML5 Canvas and WebAssembly. Your photos never leave your device.' },
      { question: 'What is the maximum image file size allowed?', answer: 'Because compression is performed on your device, you can compress images of any reasonable size up to 50MB without server limits.' },
      { question: 'Will image compression affect my image dimensions?', answer: 'No. Standard compression maintains pixel resolution while optimizing compression tables and color data.' }
    ],
    metaKeywords: ['image compressor', 'compress jpg online', 'reduce photo size', 'png compressor bd', 'free image optimizer']
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    tagline: 'Scale images to custom pixel dimensions or preset ratios',
    description: 'Quickly adjust the width and height of any image. Lock aspect ratio, choose percentage scaling, or select standard dimensions for social media.',
    category: 'image',
    categoryName: 'Image & Media',
    iconName: 'Maximize2',
    featured: true,
    popular: true,
    browserOnly: true,
    processingTime: 'Instant',
    features: [
      'Exact pixel dimension input (width and height)',
      'Aspect ratio lock to prevent image stretching or distortion',
      'Preset sizes for Facebook, Instagram, YouTube, and passport photos',
      'Percentage-based scaling (25%, 50%, 75%, 200%)',
      'High-quality bicubic interpolation for clean edges'
    ],
    howToUse: [
      { step: 'Upload your photo', detail: 'Choose any image file from your device.' },
      { step: 'Specify new dimensions', detail: 'Type custom width and height in pixels or choose a preset social media ratio.' },
      { step: 'Save the resized file', detail: 'Download your resized image in your chosen format.' }
    ],
    faqs: [
      { question: 'Can I resize photos for official passport and ID forms in Bangladesh?', answer: 'Yes! You can enter exact millimeter or pixel requirements like 300x300px or standard passport sizes.' },
      { question: 'Does resizing decrease sharpness?', answer: 'Downscaling preserves high visual sharpness. Upscaling uses advanced smoothing algorithms to minimize pixelation.' }
    ],
    metaKeywords: ['image resizer', 'resize picture online', 'resize photo for passport', 'photo resolution changer']
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    tagline: 'Crop and trim photos with precise aspect ratios and angles',
    description: 'Intuitive touch-friendly crop tool. Frame your pictures with square 1:1, widescreen 16:9, landscape 4:3, or custom freeform crop areas.',
    category: 'image',
    categoryName: 'Image & Media',
    iconName: 'Crop',
    featured: false,
    popular: true,
    browserOnly: true,
    processingTime: 'Instant',
    features: [
      'Touch and mouse drag bounding box handles',
      'Preset aspect ratios: 1:1 (Square), 4:3, 16:9, 9:16 (Stories), 3:2',
      'Circular avatar crop preview mode',
      '90-degree image rotation and flipping',
      'Smooth zoom and pan control'
    ],
    howToUse: [
      { step: 'Load your picture', detail: 'Select the image you want to crop.' },
      { step: 'Frame the subject', detail: 'Drag the corner handles or choose an aspect ratio preset to compose the perfect shot.' },
      { step: 'Export cropped result', detail: 'Click Crop & Download to obtain the cropped photo immediately.' }
    ],
    faqs: [
      { question: 'Can I crop circular profile pictures?', answer: 'Yes, our circular crop mode allows you to preview and download round avatars for social accounts.' },
      { question: 'Does it support mobile pinch-to-zoom?', answer: 'Yes, the crop viewport is optimized for mobile touchscreens with responsive touch dragging.' }
    ],
    metaKeywords: ['image cropper', 'crop photo online', 'circle crop avatar', 'picture cut tool']
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    tagline: 'Create custom, high-resolution QR codes in seconds',
    description: 'Generate clean QR codes for website URLs, contact info, Wi-Fi networks, text messages, phone numbers, and bKash/Nagad merchant links.',
    category: 'text',
    categoryName: 'Text & Content',
    iconName: 'QrCode',
    featured: true,
    popular: true,
    browserOnly: true,
    processingTime: 'Instant',
    features: [
      'Support for URL, Plain Text, Wi-Fi, Phone, and Email payloads',
      'Custom foreground and background color customization',
      'High-resolution PNG and SVG vector export',
      'Multiple error correction levels (L, M, Q, H)',
      'Instant real-time QR preview as you type'
    ],
    howToUse: [
      { step: 'Select QR data type', detail: 'Choose whether you want to encode a website link, text message, Wi-Fi setup, or phone number.' },
      { step: 'Enter content', detail: 'Type or paste your link or text into the input field.' },
      { step: 'Download QR code', detail: 'Customize colors if desired and download as PNG or vector SVG.' }
    ],
    faqs: [
      { question: 'Do the generated QR codes expire?', answer: 'Never. These are standard static QR codes encoding your direct data. They will work indefinitely as long as your link exists.' },
      { question: 'Can I scan these codes on both Android and iPhone cameras?', answer: 'Yes! Standard camera apps on all modern Android and iOS devices can scan them instantly.' }
    ],
    metaKeywords: ['qr code generator', 'free qr maker', 'make qr code bangladesh', 'custom qr generator online']
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    tagline: 'Real-time text analytics, word and character statistics',
    description: 'A distraction-free writing counter that counts words, characters, sentences, paragraphs, reading time, and estimated speaking duration.',
    category: 'text',
    categoryName: 'Text & Content',
    iconName: 'WholeWord',
    featured: false,
    popular: true,
    browserOnly: true,
    processingTime: 'Real-time',
    features: [
      'Live word, character (with and without spaces), sentence, and paragraph counts',
      'Estimated reading time and speaking duration indicators',
      'Keyword density and word frequency analysis',
      'One-click text copy and clear buttons',
      'Writing progress meter with custom target goals'
    ],
    howToUse: [
      { step: 'Paste or type text', detail: 'Type directly into the writing box or paste copied text from Word, Google Docs, or articles.' },
      { step: 'Review statistics', detail: 'Watch the live counters update immediately across words, characters, and reading duration.' },
      { step: 'Export or copy', detail: 'Use the copy button to transfer your text or save word count metrics.' }
    ],
    faqs: [
      { question: 'Does this tool save my typed draft anywhere?', answer: 'No. Everything stays in your browser memory. We never store or transmit your sensitive writing or drafts.' },
      { question: 'How is reading time estimated?', answer: 'Reading time is calculated based on the universal standard average of 200 to 225 words per minute.' }
    ],
    metaKeywords: ['word counter', 'character count tool', 'online word counter', 'reading time calculator', 'essay word count']
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    tagline: 'Convert text between UPPERCASE, lowercase, Title Case, and more',
    description: 'Quickly change letter capitalization across any text. Switch between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case.',
    category: 'text',
    categoryName: 'Text & Content',
    iconName: 'Type',
    featured: false,
    popular: false,
    browserOnly: true,
    processingTime: 'Instant',
    features: [
      'UPPERCASE: Capitalizes every letter',
      'lowercase: Converts all letters to lowercase',
      'Title Case: Capitalizes the first letter of each significant word',
      'Sentence case: Capitalizes the start of each sentence',
      'camelCase & snake_case: Format variable names for programmers'
    ],
    howToUse: [
      { step: 'Enter your text', detail: 'Paste or type any sentence, paragraph, or list.' },
      { step: 'Click desired case format', detail: 'Select any case converter button (e.g., Title Case, UPPERCASE, etc.).' },
      { step: 'Copy converted text', detail: 'Click the Copy button to place the converted result on your clipboard.' }
    ],
    faqs: [
      { question: 'Does Title Case handle small words like "and", "of", and "the"?', answer: 'Yes! Our Title Case logic properly keeps minor prepositions and conjunctions lowercase unless they start the sentence.' }
    ],
    metaKeywords: ['case converter', 'title case converter', 'uppercase to lowercase', 'capital letter converter online']
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    tagline: 'Calculate exact age in years, months, days, and next birthday countdown',
    description: 'Find out your exact chronological age from date of birth. Breakdown your life milestones in total months, weeks, days, hours, and minutes.',
    category: 'calculator',
    categoryName: 'Calculators & Math',
    iconName: 'Calendar',
    featured: true,
    popular: true,
    browserOnly: true,
    processingTime: 'Instant',
    features: [
      'Accurate age breakdown in Years, Months, and Days',
      'Total lifetime metrics (Total Days, Total Weeks, Total Hours lived)',
      'Countdown timer to your upcoming birthday',
      'Day of the week you were born on',
      'Compare age difference between two distinct dates'
    ],
    howToUse: [
      { step: 'Enter your birth date', detail: 'Select your date of birth using the date picker or input fields.' },
      { step: 'Select reference date', detail: 'Choose "Today" or any specific past/future date you wish to calculate against.' },
      { step: 'View chronological breakdown', detail: 'See your comprehensive age breakdown, next birthday, and milestones.' }
    ],
    faqs: [
      { question: 'Does this calculator account for leap years?', answer: 'Yes. The algorithm rigorously factors in Gregorian leap years (366 days in February) for 100% precision.' }
    ],
    metaKeywords: ['age calculator', 'calculate exact age', 'date of birth calculator', 'how old am i calculator']
  },
  {
    id: 'calculator',
    name: 'Calculator',
    tagline: 'Standard and scientific digital calculator with calculation history',
    description: 'A clean, responsive browser calculator for everyday math, percentages, roots, powers, and scientific calculations with interactive tape history.',
    category: 'calculator',
    categoryName: 'Calculators & Math',
    iconName: 'Hash',
    featured: false,
    popular: true,
    browserOnly: true,
    processingTime: 'Instant',
    features: [
      'Standard arithmetic (+, -, *, /) and percentage calculations',
      'Scientific functions (sin, cos, tan, log, square root, exponentiation)',
      'Calculation history roll to review past calculations',
      'Keyboard support for desktop (numpad, enter, backspace)',
      'Large touch-friendly buttons for fast mobile calculation'
    ],
    howToUse: [
      { step: 'Input your numbers', detail: 'Click or tap the on-screen calculator keys or type on your physical keyboard.' },
      { step: 'Apply operators', detail: 'Use add, subtract, multiply, divide, or scientific functions.' },
      { step: 'Press Equals (=)', detail: 'Get the exact result with high numeric precision.' }
    ],
    faqs: [
      { question: 'Can I use keyboard shortcuts on my computer?', answer: 'Yes! The calculator responds to your keyboard numbers 0-9, +, -, *, /, Enter, and Escape (for Clear).' }
    ],
    metaKeywords: ['online calculator', 'free scientific calculator', 'math calculator browser', 'percentage calculator']
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    tagline: 'Instant real-time converter for length, weight, area, and temperature',
    description: 'All-in-one unit converter supporting metric, imperial, and regional standards. Convert length, mass/weight, area, and temperature with high precision.',
    category: 'calculator',
    categoryName: 'Calculators & Math',
    iconName: 'Ruler',
    featured: true,
    popular: true,
    browserOnly: true,
    processingTime: 'Instant',
    features: [
      'Length: mm, cm, m, km, inch, foot, yard, mile, nautical mile',
      'Weight: mg, g, kg, ton, ounce, pound, stone, tola, maund (mon)',
      'Area: sq mm, sq cm, sq m, sq km, sq ft, acre, hectare, decimal (shatak), katha, bigha',
      'Temperature: Celsius (°C), Fahrenheit (°F), Kelvin (K)',
      'All Units at a Glance comparison matrix with 1-click copy'
    ],
    howToUse: [
      { step: 'Select conversion category', detail: 'Choose Length, Weight, Area, or Temperature from the top tabs.' },
      { step: 'Enter value & units', detail: 'Type any quantity and select your From and To units.' },
      { step: 'View & copy result', detail: 'Get instant real-time results or copy equivalent measurements from the comprehensive unit grid.' }
    ],
    faqs: [
      { question: 'Does this tool support Bangladeshi land units?', answer: 'Yes! Our area converter includes traditional land measurement units like Shatak/Decimal (435.6 sq ft), Katha (1.65 decimal), and Bigha (20 katha).' },
      { question: 'Does it work offline?', answer: 'Yes. All conversion logic runs directly inside your browser without any network requests.' }
    ],
    metaKeywords: ['unit converter', 'length converter', 'weight converter', 'area converter bd', 'temperature converter', 'shatak to sq ft']
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    tagline: 'Combine JPG, PNG, and WebP images into a single clean PDF document',
    description: 'Effortlessly merge multiple photos into an organized, print-ready PDF file. Set page margins, orientation (Portrait/Landscape), and page order.',
    category: 'pdf',
    categoryName: 'PDF Utilities',
    iconName: 'FileImage',
    featured: true,
    popular: true,
    browserOnly: true,
    processingTime: 'Fast',
    features: [
      'Combine multiple image files into one single PDF',
      'Drag-and-drop page reordering to organize slides or pages',
      'Page orientation controls: Auto, Portrait, or Landscape',
      'Configurable margins (None, Small, Standard)',
      '100% client-side compilation without server uploads'
    ],
    howToUse: [
      { step: 'Upload image files', detail: 'Select all the pictures you want included in your PDF document.' },
      { step: 'Organize and configure', detail: 'Drag cards to reorder pages and pick your preferred orientation and margin.' },
      { step: 'Generate and save PDF', detail: 'Click "Create PDF" and download your finished document.' }
    ],
    faqs: [
      { question: 'Is there a limit on how many images I can convert?', answer: 'You can convert dozens of photos at once depending on your device memory. For best performance, batches of 1 to 50 photos are recommended.' }
    ],
    metaKeywords: ['image to pdf', 'convert jpg to pdf', 'combine pictures into pdf', 'photo to pdf converter free']
  },
  {
  id: 'merge-pdf',
  name: 'Merge PDF',
  tagline: 'Combine multiple PDF files into one PDF document',
  description: 'Merge two or more PDF files into a single PDF document directly in your browser.',
  category: 'pdf',
  categoryName: 'PDF Utilities',
  iconName: 'FileCheck',
  featured: true,
  popular: true,
  browserOnly: true,
  processingTime: 'Fast',
  features: [
    'Merge multiple PDF files into one',
    'Works directly in your browser',
    'No server upload or storage',
    'Download the merged PDF instantly'
  ],
  howToUse: [
    { step: 'Select PDF files', detail: 'Choose two or more PDF files from your device.' },
    { step: 'Merge files', detail: 'Click the Merge PDF button to combine the selected files.' },
    { step: 'Download PDF', detail: 'Download your merged PDF file.' }
  ],
  faqs: [
    { question: 'Are my PDF files uploaded to a server?', answer: 'No. The PDF files are processed directly in your browser.' }
  ],
  metaKeywords: ['merge pdf', 'combine pdf', 'pdf merger', 'merge pdf online']
},
    id: 'pdf-to-image',
    name: 'PDF to Image',
    tagline: 'Extract PDF pages and convert them into high-res JPG or PNG images',
    description: 'Transform each page of your PDF into crisp, high-resolution image files. Download individual pages or get all pages bundled in a single ZIP.',
    category: 'pdf',
    categoryName: 'PDF Utilities',
    iconName: 'FileCheck',
    featured: false,
    popular: true,
    browserOnly: true,
    processingTime: 'Fast',
    features: [
      'Convert all or selected pages of any PDF document',
      'Choose output format: PNG (lossless) or JPG (compact)',
      'DPI resolution selector for ultra-sharp page renders',
      'Individual page preview and single-page download',
      'Privacy guaranteed: PDF rendering happens inside your browser'
    ],
    howToUse: [
      { step: 'Select a PDF document', detail: 'Upload the PDF file you need to extract images from.' },
      { step: 'Select pages & quality', detail: 'Choose all pages or click individual pages to convert with your chosen DPI.' },
      { step: 'Download image files', detail: 'Download individual page images or all pages at once.' }
    ],
    faqs: [
      { question: 'Does this require Adobe Reader or special software?', answer: 'No! Everything runs directly inside modern web browsers on mobile phones and desktop computers.' }
    ],
    metaKeywords: ['pdf to image', 'convert pdf to jpg', 'pdf to png free', 'extract images from pdf']
  }
];

export function getToolById(id: string): ToolItem | undefined {
  return TOOLS.find((t) => t.id === id);
}

export function getToolsByCategory(cat: ToolCategory): ToolItem[] {
  return TOOLS.filter((t) => t.category === cat);
}
