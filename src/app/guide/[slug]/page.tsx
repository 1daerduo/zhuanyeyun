import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuide, getAllGuides, type Guide } from '@/lib/guides';
import { getMajorBySlug } from '@/lib/majors';

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return { title: '文章未找到' };
  return {
    title: `${guide.title} - 专业就业通`,
    description: guide.description,
    keywords: guide.tags.join(','),
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      publishedTime: guide.date,
      tags: guide.tags,
    },
    alternates: { canonical: `https://zhuanyeyun.com/guide/${guide.slug}/` },
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const relatedMajors = guide.relatedMajors
    .map((slug) => getMajorBySlug(slug))
    .filter(Boolean);

  return (
    <>
      {/* Schema.org Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.description,
            datePublished: guide.date,
            author: { '@type': 'Organization', name: '专业就业通' },
            publisher: { '@type': 'Organization', name: '专业就业通' },
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              {guide.coverEmoji} {guide.category}
            </span>
            <span className="text-sm text-white/70">{guide.date}</span>
            <span className="text-sm text-white/70">· {guide.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
            {guide.title}
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">{guide.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {guide.tags.map((tag) => (
              <span key={tag} className="text-xs bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <nav className="flex text-sm text-gray-500 gap-1.5">
          <Link href="/" className="hover:text-blue-600">首页</Link>
          <span>/</span>
          <Link href="/guides/" className="hover:text-blue-600">专题文章</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{guide.title.slice(0, 30)}</span>
        </nav>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">📑 目录</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {guide.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content Sections */}
      <article className="max-w-4xl mx-auto px-4 pb-16 space-y-12">
        {guide.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </article>

      {/* Related Majors */}
      {relatedMajors.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">相关专业数据</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {relatedMajors.map((major) => (
                <Link
                  key={major!.slug}
                  href={`/major/${major!.slug}/`}
                  className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-center"
                >
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-sm font-medium text-gray-900">{major!.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">起薪 ¥{major!.starting_salary.toLocaleString()}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {guide.faq.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">常见问题</h2>
            <div className="space-y-3">
              {guide.faq.map((item, idx) => (
                <details key={idx} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-900 pr-4">{item.q}</span>
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-10 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">用数据选专业，少走弯路</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            查看50个热门专业的完整薪资、就业率、AI评估数据，用对比工具帮你找到最适合的选择。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools/compare/"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              ⚖️ 专业PK对比
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-500/30 text-white font-semibold rounded-xl hover:bg-blue-500/40 transition-colors border border-blue-400/30"
            >
              🏠 探索所有专业
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Section Renderer ── */

function SectionRenderer({ section }: { section: Guide['sections'][0] }) {
  return (
    <section id={section.id}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        {section.title}
      </h2>

      {section.type === 'text' && (
        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}

      {section.type === 'comparison' && section.comparisonData && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                {section.comparisonData.headers.map((h, i) => (
                  <th key={i} className={`py-3 px-4 text-left font-bold text-gray-700 ${i === 0 ? '' : 'text-center'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.comparisonData.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-gray-100 hover:bg-blue-50/50">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`py-3 px-4 ${ci === 0 ? 'font-medium text-gray-800' : ci === row.length - 1 ? 'text-center text-blue-700 font-semibold text-xs' : 'text-center text-gray-600'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {section.content && (
            <div
              className="p-4 text-sm text-gray-500 border-t border-gray-100 bg-gray-50"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          )}
        </div>
      )}

      {section.type === 'list' && section.items && (
        <ul className="space-y-3">
          {section.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-blue-500 mt-0.5 shrink-0">•</span>
              <span
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </li>
          ))}
        </ul>
      )}

      {section.type === 'callout' && (
        <div
          className="bg-red-50 border border-red-200 rounded-xl p-5 text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}

      {section.type === 'cta' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <div
            className="text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
          <Link
            href="/tools/compare/"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            开始对比专业 →
          </Link>
        </div>
      )}
    </section>
  );
}
