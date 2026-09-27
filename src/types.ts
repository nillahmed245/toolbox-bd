export type ToolCategory = 'image' | 'text' | 'calculator' | 'pdf';

export interface HowToStep {
  step: string;
  detail: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  categoryName: string;
  iconName: string;
  featured?: boolean;
  popular?: boolean;
  browserOnly?: boolean;
  processingTime?: string;
  features: string[];
  howToUse: HowToStep[];
  faqs: FAQItem[];
  metaKeywords: string[];
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
}

export type PageRoute = 
  | { type: 'home' }
  | { type: 'tool'; toolId: string }
  | { type: 'category'; categoryId: ToolCategory }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'privacy' }
  | { type: 'terms' };
