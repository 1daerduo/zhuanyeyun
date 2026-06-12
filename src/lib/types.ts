export interface School {
  name: string;
  employment_rate: number;
  avg_salary: number;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface SalaryTrend {
  year: number;
  salary: number;
}

export interface Major {
  id: string;
  slug: string;
  name: string;
  category: string;
  degree: string;
  duration: number;
  description: string;

  // Employment
  starting_salary: number;
  salary_3year: number;
  salary_5year: number;
  salary_trend: SalaryTrend[];
  employment_rate: number;
  relevance_rate: number;
  satisfaction: number;

  // ROI
  roi_index: number;
  roi_grade: string;

  // AI
  ai_risk_level: string;
  ai_risk_score: number;
  ai_risk_description: string;

  // Destinations
  top_industries: string[];
  top_positions: string[];
  top_cities: string[];

  // Schools
  top_schools: School[];

  // Related
  related_majors: string[];

  // FAQ
  faq: FAQ[];

  // Tags
  tags: string[];
  gender_ratio: string;
  recommended_for: string[];

  // SEO
  seo_title: string;
  seo_description: string;
}

export interface RankingItem {
  rank: number;
  major_name: string;
  major_slug: string;
  value: number;
  unit: string;
}

export interface Ranking {
  id: string;
  title: string;
  description: string;
  items: RankingItem[];
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
  related_majors: string[];
  seo_title: string;
  seo_description: string;
}
