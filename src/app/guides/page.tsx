import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGuides } from '@/lib/guides';

export const metadata: Metadata = {
  title: '专题文章 - 高考选专业深度指南 | 专业就业通',
  description: '专业对比分析、AI影响评估、高考志愿填报指南。用数据和深度分析帮你选对大学专业。',
  alternates: { canonical: 'https://zhuanyeyun.com/guides/' },
};

export default function GuidesPage() {
  const guides = getAllGuides();

  const categories = Array.from(new Set(guides.map((g) => g.category)));

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 sm:py-18 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">专题文章</h1>
          <p className="text-lg text-blue-100 max-w-xl mx-auto">
            深度分析、数据对比、报考指南——帮你用更全面的视角理解专业选择
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-2">
        <nav className="flex text-sm text-gray-500 gap-1.5">
          <Link href="/" className="hover:text-blue-600">首页</Link>
          <span>/</span>
          <span className="text-gray-900">专题文章</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {categories.map((cat) => {
          const catGuides = guides.filter((g) => g.category === cat);
          return (
            <div key={cat} className="mb-12">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
                {cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guide/${guide.slug}/`}
                    className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl shrink-0">{guide.coverEmoji}</span>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1.5">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                          {guide.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{guide.date}</span>
                          <span>·</span>
                          <span>{guide.readTime}</span>
                          <span className="flex gap-1 ml-auto">
                            {guide.tags.slice(0, 2).map((t) => (
                              <span key={t} className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">#{t}</span>
                            ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">文章看完了，来做决定吧</h2>
          <p className="text-blue-100 mb-6">使用专业PK对比工具，把你犹豫的专业放进来，看看数据怎么说</p>
          <Link
            href="/tools/compare/"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            ⚖️ 开始专业对比 →
          </Link>
        </div>
      </section>
    </>
  );
}
