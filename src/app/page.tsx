import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import MajorCard from '@/components/MajorCard';
import {
  getTopMajorsByROI,
  getTopMajorsBySalary,
  getAISafeMajors,
  getAllMajors,
} from '@/lib/majors';
import { getAllGuides } from '@/lib/guides';

export default function HomePage() {
  const topROI = getTopMajorsByROI(6);
  const topSalary = getTopMajorsBySalary(6);
  const aiSafe = getAISafeMajors(6);
  const allCount = getAllMajors().length;
  const guides = getAllGuides();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              用数据帮你选专业
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              覆盖 {allCount}+ 本科专业的就业深度分析 — 薪资、就业率、AI影响评估
            </p>
            <SearchBar />
            <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-blue-200">
              <span>热门搜索：</span>
              <Link href="/major/jisuanji-kexue-yu-jishu/" className="hover:text-white">计算机</Link>
              <span>·</span>
              <Link href="/major/rengong-zhineng/" className="hover:text-white">人工智能</Link>
              <span>·</span>
              <Link href="/major/linchuang-yixue/" className="hover:text-white">临床医学</Link>
              <span>·</span>
              <Link href="/major/kouqiang-yixue/" className="hover:text-white">口腔医学</Link>
              <span>·</span>
              <Link href="/major/jinrong-xue/" className="hover:text-white">金融学</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{allCount}+</div>
              <div className="text-sm text-gray-500 mt-1">本科专业覆盖</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-500 mt-1">分析维度</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-purple-600">12+</div>
              <div className="text-sm text-gray-500 mt-1">学科门类</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-orange-600">持续</div>
              <div className="text-sm text-gray-500 mt-1">数据更新</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Top */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">专业投资回报率排行</h2>
            <p className="text-sm text-gray-500 mt-1">综合薪资、就业率、AI抗风险能力的全方位评分</p>
          </div>
          <Link href="/ranking/gaoxin/" className="text-sm text-blue-600 font-medium shrink-0">查看全部 →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topROI.map((m) => (<MajorCard key={m.id} major={m} />))}
        </div>
      </section>

      {/* Salary Top */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">高薪专业 TOP 6</h2>
              <p className="text-sm text-gray-500 mt-1">2025届毕业生平均起薪排行</p>
            </div>
            <Link href="/ranking/gaoxin/" className="text-sm text-blue-600 font-medium shrink-0">查看完整排行 →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topSalary.map((m) => (<MajorCard key={m.id} major={m} />))}
          </div>
        </div>
      </section>

      {/* AI Safe */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI时代最抗风险专业</h2>
            <p className="text-sm text-gray-500 mt-1">AI替代难度最低的专业方向</p>
          </div>
          <Link href="/ranking/ai-safe/" className="text-sm text-blue-600 font-medium shrink-0">查看完整排行 →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiSafe.map((m) => (<MajorCard key={m.id} major={m} />))}
        </div>
      </section>

      {/* Guides */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">专题深度文章</h2>
              <p className="text-sm text-gray-500 mt-1">专业对比分析、志愿填报指南、AI时代选专业策略</p>
            </div>
            <Link href="/guides/" className="text-sm text-blue-600 font-medium shrink-0">查看全部 →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.slice(0, 3).map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}/`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{g.coverEmoji}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{g.category}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1.5">
                  {g.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{g.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{g.readTime}</span>
                  <span>·</span>
                  <span>{g.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 md:p-14 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">不确定选什么专业？</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-xl mx-auto">
            使用专业对比工具，同时比较两个专业的薪资、就业率、AI风险和推荐院校
          </p>
          <Link href="/tools/compare/" className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            开始专业对比 →
          </Link>
        </div>
      </section>
    </div>
  );
}
