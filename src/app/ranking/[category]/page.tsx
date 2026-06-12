import { Metadata } from 'next';
import Link from 'next/link';
import { getAllMajors } from '@/lib/majors';
import type { Major } from '@/lib/types';

export function generateStaticParams() {
  return [
    { category: 'gaoxin' },
    { category: 'jiuye' },
    { category: 'ai-safe' },
    { category: 'roi' },
    { category: 'manyidu' },
    { category: 'gongxue' },
    { category: 'lixue' },
    { category: 'yixue' },
    { category: 'jingjixue' },
    { category: 'guanlixue' },
    { category: 'faxue' },
    { category: 'wenxue' },
    { category: 'jiaoyuxue' },
  ];
}

const RANKING_CATEGORIES: Record<string, { title: string; description: string; sortFn: (a: Major, b: Major) => number; key: string; unit: string }> = {
  gaoxin: {
    title: '高薪专业排行榜',
    description: '按2025届毕业生平均起薪排序，展示收入最高的专业方向',
    sortFn: (a, b) => b.starting_salary - a.starting_salary,
    key: 'starting_salary',
    unit: '元/月',
  },
  jiuye: {
    title: '就业率最高专业排行榜',
    description: '按2025届毕业生就业率排序，展示就业形势最好的专业',
    sortFn: (a, b) => b.employment_rate - a.employment_rate,
    key: 'employment_rate',
    unit: '%',
  },
  'ai-safe': {
    title: 'AI抗风险专业排行榜',
    description: '按AI替代风险评分排序（分数越低越安全），展示最难被AI取代的专业',
    sortFn: (a, b) => a.ai_risk_score - b.ai_risk_score,
    key: 'ai_risk_score',
    unit: '分',
  },
  roi: {
    title: '专业投资回报率排行榜',
    description: '按综合ROI评分排序，综合考虑薪资、就业率、专业相关度和AI抗风险能力',
    sortFn: (a, b) => b.roi_index - a.roi_index,
    key: 'roi_index',
    unit: '分',
  },
  manyidu: {
    title: '就业满意度排行榜',
    description: '按毕业生就业满意度排序，展示从业者幸福感最高的专业',
    sortFn: (a, b) => b.satisfaction - a.satisfaction,
    key: 'satisfaction',
    unit: '%',
  },
};

const CATEGORY_MAP: Record<string, string> = {
  gongxue: '工学',
  lixue: '理学',
  yixue: '医学',
  jingjixue: '经济学',
  guanlixue: '管理学',
  faxue: '法学',
  wenxue: '文学',
  jiaoyuxue: '教育学',
};

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const config = RANKING_CATEGORIES[params.category];
  const catName = CATEGORY_MAP[params.category];
  if (config) {
    return {
      title: `${config.title}（2026最新）`,
      description: config.description,
    };
  }
  if (catName) {
    return {
      title: `${catName}类专业就业前景排行`,
      description: `${catName}类各专业的就业前景、薪资、就业率综合分析排名`,
    };
  }
  return { title: '排行榜' };
}

export default function RankingPage({ params }: { params: { category: string } }) {
  const config = RANKING_CATEGORIES[params.category];

  if (config) {
    const sorted = [...getAllMajors()].sort(config.sortFn).slice(0, 30);
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
        <p className="text-gray-500 mb-8">{config.description}</p>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-3 px-5 font-semibold text-gray-900 w-16">排名</th>
                <th className="text-left py-3 px-5 font-semibold text-gray-900">专业名称</th>
                <th className="text-center py-3 px-5 font-semibold text-gray-900">门类</th>
                <th className="text-center py-3 px-5 font-semibold text-gray-900">起薪</th>
                <th className="text-center py-3 px-5 font-semibold text-gray-900">就业率</th>
                <th className="text-center py-3 px-5 font-semibold text-gray-900">ROI</th>
                <th className="text-right py-3 px-5 font-semibold text-gray-900">{config.key === 'starting_salary' ? '起薪' : config.key === 'employment_rate' ? '就业率' : config.key === 'ai_risk_score' ? 'AI风险' : config.key === 'roi_index' ? 'ROI' : '满意度'}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((major, idx) => (
                <tr key={major.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-400 text-white' :
                      idx === 1 ? 'bg-gray-300 text-white' :
                      idx === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <Link href={`/major/${major.slug}/`} className="font-medium text-gray-900 hover:text-blue-600">
                      {major.name}
                    </Link>
                    <div className="text-xs text-gray-500 mt-0.5">{major.degree} · {major.duration}年</div>
                  </td>
                  <td className="py-3 px-5 text-center text-gray-600">{major.category}</td>
                  <td className="py-3 px-5 text-center text-blue-600 font-medium">¥{major.starting_salary.toLocaleString()}</td>
                  <td className="py-3 px-5 text-center text-green-600 font-medium">{major.employment_rate}%</td>
                  <td className="py-3 px-5 text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      major.roi_grade === 'A' ? 'bg-green-100 text-green-700' :
                      major.roi_grade === 'B' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{major.roi_grade}</span>
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-gray-900">
                    {(() => {
                      const val = major[config.key as keyof Major];
                      if (typeof val === 'number') {
                        if (config.key === 'starting_salary') return `¥${val.toLocaleString()}`;
                        return `${val}${config.unit === '%' ? '%' : '分'}`;
                      }
                      return String(val);
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Category filter view
  const catName = CATEGORY_MAP[params.category];
  if (catName) {
    const majors = getAllMajors().filter((m) => m.category === catName).sort((a, b) => b.roi_index - a.roi_index);
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{catName}类专业就业前景</h1>
        <p className="text-gray-500 mb-8">共 {majors.length} 个专业，按ROI综合评分排序</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {majors.map((major) => (
            <Link key={major.id} href={`/major/${major.slug}/`} className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{major.name}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  major.roi_grade === 'A' ? 'bg-green-100 text-green-700' :
                  major.roi_grade === 'B' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{major.roi_grade}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{major.description.slice(0, 80)}...</p>
              <div className="flex gap-4 text-xs text-gray-600">
                <span>💰 ¥{major.starting_salary.toLocaleString()}/月</span>
                <span>📊 {major.employment_rate}%</span>
                <span>🤖 AI{major.ai_risk_level}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">专业排行榜</h1>
      <p className="text-gray-500 mb-8">选择你关心的排行维度</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(RANKING_CATEGORIES).map(([slug, cat]) => (
          <Link key={slug} href={`/ranking/${slug}/`} className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
            <h3 className="font-semibold text-gray-900 mb-1">{cat.title}</h3>
            <p className="text-sm text-gray-500">{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
