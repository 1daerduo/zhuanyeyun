import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/majors';

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = 'https://zhuanyeyun.com';
  const slugs = getAllSlugs();

  const staticPages = [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/tools/compare/`, priority: 0.9 },
    { url: `${BASE_URL}/tools/salary/`, priority: 0.8 },
    { url: `${BASE_URL}/ranking/gaoxin/`, priority: 0.9 },
    { url: `${BASE_URL}/ranking/jiuye/`, priority: 0.9 },
    { url: `${BASE_URL}/ranking/ai-safe/`, priority: 0.9 },
    { url: `${BASE_URL}/ranking/roi/`, priority: 0.8 },
    { url: `${BASE_URL}/ranking/manyidu/`, priority: 0.7 },
    { url: `${BASE_URL}/privacy/`, priority: 0.3 },
    { url: `${BASE_URL}/terms/`, priority: 0.3 },
  ];

  const majorPages = slugs.map((slug) => ({
    url: `${BASE_URL}/major/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages.map((page) => ({
      ...page,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
    })),
    ...majorPages,
  ];
}
