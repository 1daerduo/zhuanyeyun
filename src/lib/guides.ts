export interface GuideSection {
  id: string;
  title: string;
  type: 'text' | 'comparison' | 'list' | 'callout' | 'cta';
  content: string;
  items?: string[];
  comparisonData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface GuideFAQ {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  coverEmoji: string;
  date: string;
  readTime: string;
  tags: string[];
  sections: GuideSection[];
  relatedMajors: string[];
  faq: GuideFAQ[];
}

import allGuides from '@/data/guides';

export function getGuide(slug: string): Guide | undefined {
  return allGuides.find((g) => g.slug === slug);
}

export function getAllGuides(): Guide[] {
  return allGuides;
}

export function getGuidesByCategory(category: string): Guide[] {
  return allGuides.filter((g) => g.category === category);
}
