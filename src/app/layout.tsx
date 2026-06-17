import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '专业就业通 - 大学专业就业数据分析平台',
  description:
    '涵盖883个本科专业的薪资、就业率、就业方向、AI影响评估。为高考志愿填报提供权威数据支撑，用数据帮你选专业。',
  keywords: '专业就业前景,大学专业薪资,高考志愿填报,专业就业率,专业选择,AI影响专业',
  alternates: {
    canonical: 'https://zhuanyeyun.com',
  },
  openGraph: {
    title: '专业就业通 - 大学专业就业数据分析平台',
    description: '涵盖883个本科专业的薪资、就业率、就业方向、AI影响评估。',
    url: 'https://zhuanyeyun.com',
    siteName: '专业就业通',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="baidu-site-verification" content="codeva-p83S4KGcvm" />
        <link rel="icon" href="/favicon.ico" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/pagefind/pagefind-ui.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: '专业就业通',
              url: 'https://zhuanyeyun.com',
              description:
                '大学专业就业数据分析平台 — 涵盖883个本科专业的薪资、就业率、就业方向、AI影响评估',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://zhuanyeyun.com/major/{search_term}/',
                'query-input': 'required name=search_term',
              },
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GDVGWM0L8G"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GDVGWM0L8G');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
