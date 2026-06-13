import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSlugs, getMajorBySlug, getRelatedMajors } from '@/lib/majors';
import { getAffiliateForMajor } from '@/lib/affiliate';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo';
import SalaryChart from '@/components/SalaryChart';
import AffiliateCard from '@/components/AffiliateCard';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const major = getMajorBySlug(params.slug);
  if (!major) return { title: '专业未找到' };

  return {
    title: major.seo_title,
    description: major.seo_description,
    keywords: `${major.name}专业,${major.name}就业前景,${major.name}薪资,${major.name}就业率,${major.tags.join(',')}`,
    alternates: { canonical: `https://zhuanyeyun.com/major/${major.slug}/` },
    openGraph: {
      title: major.seo_title,
      description: major.seo_description,
      url: `https://zhuanyeyun.com/major/${major.slug}/`,
      siteName: '专业就业通',
      locale: 'zh_CN',
      type: 'article',
    },
  };
}

export default function MajorPage({ params }: { params: { slug: string } }) {
  const major = getMajorBySlug(params.slug);
  if (!major) notFound();

  const related = getRelatedMajors(params.slug);
  const affiliate = getAffiliateForMajor(params.slug);
  const roiColor: Record<string, string> = {
    A: 'bg-green-500', B: 'bg-blue-500', C: 'bg-yellow-500', D: 'bg-orange-500', E: 'bg-red-500',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span>/</span>
        <Link href={`/ranking/${major.category === '工学' ? 'gongxue' : major.category === '医学' ? 'yixue' : major.category === '经济学' ? 'jingjixue' : major.category === '管理学' ? 'guanlixue' : major.category === '法学' ? 'faxue' : 'lixue'}`} className="hover:text-blue-600">{major.category}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{major.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{major.category}</span>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{major.degree}</span>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{major.duration}年制</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {major.name}专业就业前景深度分析
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">{major.description}</p>
          </div>

          {/* ROI Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">专业投资回报指数（ROI）</h3>
              <span className="text-3xl font-bold text-blue-600">{major.roi_index}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full mb-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${roiColor[major.roi_grade]}`}
                style={{ width: `${major.roi_index}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              综合评级 <span className="font-bold text-blue-600">{major.roi_grade}级</span> — 该专业在薪资水平、就业率、专业相关度和AI抗风险能力方面表现{major.roi_grade === 'A' ? '优异' : major.roi_grade === 'B' ? '良好' : '中等'}。
            </p>
          </div>

          {/* Core Data */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">核心就业数据</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">¥{major.starting_salary.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">平均起薪/月</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{major.employment_rate}%</div>
              <div className="text-xs text-gray-500 mt-1">就业率</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{major.relevance_rate}%</div>
              <div className="text-xs text-gray-500 mt-1">专业相关度</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{major.satisfaction}%</div>
              <div className="text-xs text-gray-500 mt-1">就业满意度</div>
            </div>
          </div>

          {/* Salary Trend */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">薪资走势（1-5年）</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
            <SalaryChart data={major.salary_trend} />
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-sm text-gray-500">起薪</div>
                <div className="text-lg font-bold text-gray-900">¥{major.starting_salary.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">3年后</div>
                <div className="text-lg font-bold text-gray-900">¥{major.salary_3year.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">5年后</div>
                <div className="text-lg font-bold text-gray-900">¥{major.salary_5year.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* AI Impact */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">AI影响评估</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                major.ai_risk_score < 20 ? 'bg-green-500' : major.ai_risk_score < 40 ? 'bg-blue-500' : major.ai_risk_score < 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {major.ai_risk_score}
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  AI替代风险: <span className={
                    major.ai_risk_score < 20 ? 'text-green-600' : major.ai_risk_score < 40 ? 'text-blue-600' : major.ai_risk_score < 60 ? 'text-yellow-600' : 'text-red-600'
                  }>{major.ai_risk_level}</span>
                </div>
                <div className="text-sm text-gray-500">评分越低越安全（0-100分制）</div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{major.ai_risk_description}</p>
          </div>

          {/* Top Industries & Positions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">主要就业行业</h3>
              <ul className="space-y-2">
                {major.top_industries.map((ind) => (
                  <li key={ind} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">常见就业岗位</h3>
              <ul className="space-y-2">
                {major.top_positions.map((pos) => (
                  <li key={pos} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    {pos}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">就业热门城市</h3>
            <div className="flex flex-wrap gap-2">
              {major.top_cities.map((city, idx) => (
                <span key={city} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                  {idx === 0 && '🥇 '}{idx === 1 && '🥈 '}{idx === 2 && '🥉 '}{city}
                </span>
              ))}
            </div>
          </div>

          {/* Top Schools */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">推荐院校（按就业质量排序）</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-900">院校名称</th>
                  <th className="text-center py-3 font-semibold text-gray-900">就业率</th>
                  <th className="text-right py-3 font-semibold text-gray-900">平均月薪</th>
                </tr>
              </thead>
              <tbody>
                {major.top_schools.map((s) => (
                  <tr key={s.name} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900 font-medium">{s.name}</td>
                    <td className="py-3 text-center text-green-600 font-medium">{s.employment_rate}%</td>
                    <td className="py-3 text-right text-gray-900 font-medium">¥{s.avg_salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">常见问题</h2>
          <div className="space-y-4 mb-8">
            {major.faq.map((item) => (
              <details key={item.q} className="bg-white border border-gray-200 rounded-xl group">
                <summary className="px-5 py-4 cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  {item.q}
                </summary>
                <div className="px-5 pb-4 text-gray-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>

          {/* Affiliate Recommendations */}
          {affiliate && (
            <AffiliateCard intro={affiliate.intro} products={affiliate.products} />
          )}

          {/* SEO Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                generateBreadcrumbSchema([
                  { name: '首页', url: 'https://zhuanyeyun.com' },
                  { name: major.category, url: `https://zhuanyeyun.com/ranking/${major.category === '工学' ? 'gongxue' : 'lixue'}` },
                  { name: major.name, url: `https://zhuanyeyun.com/major/${major.slug}/` },
                ]),
                generateFAQSchema(major.faq),
              ]),
            }}
          />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {/* Quick Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">专业速览</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">专业门类</dt>
                <dd className="font-medium text-gray-900">{major.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">授予学位</dt>
                <dd className="font-medium text-gray-900">{major.degree}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">学制</dt>
                <dd className="font-medium text-gray-900">{major.duration}年</dd>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <dt className="text-gray-500">起薪</dt>
                <dd className="font-bold text-blue-600">¥{major.starting_salary.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">5年薪资</dt>
                <dd className="font-bold text-blue-600">¥{major.salary_5year.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">就业率</dt>
                <dd className="font-bold text-green-600">{major.employment_rate}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">ROI评级</dt>
                <dd><span className={`inline-block text-xs font-bold text-white px-2 py-0.5 rounded-full ${roiColor[major.roi_grade]}`}>{major.roi_grade}级</span></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">AI风险</dt>
                <dd className="font-medium text-gray-900">{major.ai_risk_level}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">性别比例</dt>
                <dd className="font-medium text-gray-900">{major.gender_ratio}</dd>
              </div>
            </dl>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">适合人群</h4>
              <ul className="space-y-1.5">
                {major.recommended_for.map((r) => (
                  <li key={r} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="text-blue-500">✓</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <Link
                href={`/tools/compare/?a=${major.slug}`}
                className="block text-center w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                与其他专业对比
              </Link>
            </div>
          </div>

          {/* Related Majors */}
          {related.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">相关专业</h3>
              <ul className="space-y-2">
                {related.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/major/${m.slug}/`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                    >
                      <div className="font-medium text-gray-900 text-sm">{m.name}</div>
                      <div className="text-xs text-gray-500 mt-1">起薪 ¥{m.starting_salary.toLocaleString()}/月 · {m.roi_grade}级</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
