import majorsData from '@/data/majors.json';
import { Major } from './types';

export function getAllMajors(): Major[] {
  return majorsData as Major[];
}

export function getMajorBySlug(slug: string): Major | undefined {
  return (majorsData as Major[]).find((m) => m.slug === slug);
}

export function getMajorsByCategory(category: string): Major[] {
  return (majorsData as Major[]).filter((m) => m.category === category);
}

export function getTopMajorsByROI(limit: number = 20): Major[] {
  return [...(majorsData as Major[])]
    .sort((a, b) => b.roi_index - a.roi_index)
    .slice(0, limit);
}

export function getTopMajorsBySalary(limit: number = 20): Major[] {
  return [...(majorsData as Major[])]
    .sort((a, b) => b.starting_salary - a.starting_salary)
    .slice(0, limit);
}

export function getTopMajorsByEmployment(limit: number = 20): Major[] {
  return [...(majorsData as Major[])]
    .sort((a, b) => b.employment_rate - a.employment_rate)
    .slice(0, limit);
}

export function getAISafeMajors(limit: number = 20): Major[] {
  return [...(majorsData as Major[])]
    .sort((a, b) => a.ai_risk_score - b.ai_risk_score)
    .slice(0, limit);
}

export function searchMajors(query: string): Major[] {
  const q = query.toLowerCase();
  return (majorsData as Major[]).filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      (m.tags || []).some((t) => t.toLowerCase().includes(q)) ||
      (m.top_industries || []).some((t) => t.toLowerCase().includes(q))
  );
}

export function getAllSlugs(): string[] {
  return (majorsData as Major[]).map((m) => m.slug);
}

export function getRelatedMajors(slug: string, limit: number = 6): Major[] {
  const major = getMajorBySlug(slug);
  if (!major) return [];
  return major.related_majors
    .map((s) => getMajorBySlug(s))
    .filter((m): m is Major => m !== undefined)
    .slice(0, limit);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  (majorsData as Major[]).forEach((m) => {
    counts[m.category] = (counts[m.category] || 0) + 1;
  });
  return counts;
}
