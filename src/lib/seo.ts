export const SITE_NAME = '专业就业通';
export const SITE_URL = 'https://zhuanyeyun.com';
export const SITE_DESCRIPTION =
  '大学专业就业数据分析平台 — 涵盖883个本科专业的薪资、就业率、就业方向、AI影响评估，为高考志愿填报提供数据支撑。';

export function generateMetadata({
  title,
  description,
  path,
  imagePath,
}: {
  title: string;
  description: string;
  path?: string;
  imagePath?: string;
}) {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;
  const image = imagePath ? `${SITE_URL}${imagePath}` : `${SITE_URL}/images/og-default.png`;

  return {
    title: `${title} - ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} - ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'zh_CN',
      type: 'website' as const,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${title} - ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}

export function generateArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}

export function generateFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
