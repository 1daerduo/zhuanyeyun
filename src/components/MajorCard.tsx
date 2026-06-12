import Link from 'next/link';
import type { Major } from '@/lib/types';

export default function MajorCard({ major }: { major: Major }) {
  const roiColors: Record<string, string> = {
    A: 'bg-green-100 text-green-700',
    B: 'bg-blue-100 text-blue-700',
    C: 'bg-yellow-100 text-yellow-700',
    D: 'bg-orange-100 text-orange-700',
    E: 'bg-red-100 text-red-700',
  };

  const riskColors: Record<string, string> = {
    '极低': 'bg-green-50 text-green-700 border-green-200',
    '低': 'bg-blue-50 text-blue-700 border-blue-200',
    '中': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    '中高': 'bg-orange-50 text-orange-700 border-orange-200',
    '高': 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <Link
      href={`/major/${major.slug}/`}
      className="block group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {major.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {major.category} · {major.degree} · {major.duration}年制
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${roiColors[major.roi_grade]}`}>
            {major.roi_grade}级
          </span>
          <span className={`text-xs px-2 py-1 rounded-full border ${riskColors[major.ai_risk_level]}`}>
            AI{major.ai_risk_level}风险
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
        {major.description.slice(0, 120)}...
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-blue-600">
            ¥{major.starting_salary.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">月起薪</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-green-600">{major.employment_rate}%</div>
          <div className="text-xs text-gray-500 mt-0.5">就业率</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-purple-600">{major.roi_index}</div>
          <div className="text-xs text-gray-500 mt-0.5">ROI评分</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {major.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
