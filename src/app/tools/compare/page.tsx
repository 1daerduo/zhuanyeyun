'use client';

import { useState, useMemo } from 'react';
import { getAllMajors } from '@/lib/majors';
import SalaryChart from '@/components/SalaryChart';

const allMajors = getAllMajors();

export default function ComparePage() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const majorA = useMemo(() => allMajors.find((m) => m.slug === a), [a]);
  const majorB = useMemo(() => allMajors.find((m) => m.slug === b), [b]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">专业对比器</h1>
      <p className="text-gray-500 mb-8">选择两个专业，全面比较薪资、就业率、AI风险和推荐院校</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">专业 A</label>
          <select
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="">请选择专业</option>
            {allMajors.map((m) => (
              <option key={m.id} value={m.slug}>{m.name} ({m.category})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">专业 B</label>
          <select
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="">请选择专业</option>
            {allMajors.map((m) => (
              <option key={m.id} value={m.slug}>{m.name} ({m.category})</option>
            ))}
          </select>
        </div>
      </div>

      {majorA && majorB && (
        <div className="space-y-8">
          {/* Head to Head */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-blue-600 mb-1">{majorA.name}</h2>
              <p className="text-xs text-gray-500">{majorA.category} · {majorA.degree}</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-300">VS</span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-green-600 mb-1">{majorB.name}</h2>
              <p className="text-xs text-gray-500">{majorB.category} · {majorB.degree}</p>
            </div>
          </div>

          {/* Stats Comparison */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-900 w-1/3">对比维度</th>
                  <th className="text-center py-3 font-semibold text-blue-600">{majorA.name}</th>
                  <th className="text-center py-3 font-semibold text-green-600">{majorB.name}</th>
                  <th className="text-center py-3 font-semibold text-gray-500">优势</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '月平均起薪', a: `¥${majorA.starting_salary.toLocaleString()}`, b: `¥${majorB.starting_salary.toLocaleString()}`, aV: majorA.starting_salary, bV: majorB.starting_salary, better: 'higher' },
                  { label: '3年后月薪', a: `¥${majorA.salary_3year.toLocaleString()}`, b: `¥${majorB.salary_3year.toLocaleString()}`, aV: majorA.salary_3year, bV: majorB.salary_3year, better: 'higher' },
                  { label: '5年后月薪', a: `¥${majorA.salary_5year.toLocaleString()}`, b: `¥${majorB.salary_5year.toLocaleString()}`, aV: majorA.salary_5year, bV: majorB.salary_5year, better: 'higher' },
                  { label: '就业率', a: `${majorA.employment_rate}%`, b: `${majorB.employment_rate}%`, aV: majorA.employment_rate, bV: majorB.employment_rate, better: 'higher' },
                  { label: '专业相关度', a: `${majorA.relevance_rate}%`, b: `${majorB.relevance_rate}%`, aV: majorA.relevance_rate, bV: majorB.relevance_rate, better: 'higher' },
                  { label: '就业满意度', a: `${majorA.satisfaction}%`, b: `${majorB.satisfaction}%`, aV: majorA.satisfaction, bV: majorB.satisfaction, better: 'higher' },
                  { label: 'ROI综合评分', a: `${majorA.roi_index} (${majorA.roi_grade}级)`, b: `${majorB.roi_index} (${majorB.roi_grade}级)`, aV: majorA.roi_index, bV: majorB.roi_index, better: 'higher' },
                  { label: 'AI替代风险', a: `${majorA.ai_risk_level} (${majorA.ai_risk_score}分)`, b: `${majorB.ai_risk_level} (${majorB.ai_risk_score}分)`, aV: majorA.ai_risk_score, bV: majorB.ai_risk_score, better: 'lower' },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900 font-medium">{row.label}</td>
                    <td className="py-3 text-center text-blue-700 font-semibold">{row.a}</td>
                    <td className="py-3 text-center text-green-700 font-semibold">{row.b}</td>
                    <td className="py-3 text-center">
                      {row.aV === row.bV ? (
                        <span className="text-gray-400">持平</span>
                      ) : (row.better === 'higher' ? row.aV > row.bV : row.aV < row.bV) ? (
                        <span className="text-blue-600 font-medium">{majorA.name} ✓</span>
                      ) : (
                        <span className="text-green-600 font-medium">{majorB.name} ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Salary Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{majorA.name} 薪资走势</h3>
              <SalaryChart data={majorA.salary_trend} />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{majorB.name} 薪资走势</h3>
              <SalaryChart data={majorB.salary_trend} />
            </div>
          </div>

          {/* Industries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{majorA.name} 就业行业</h3>
              <ul className="space-y-1.5">
                {majorA.top_industries.map((i) => (
                  <li key={i} className="text-sm text-gray-700">• {i}</li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{majorB.name} 就业行业</h3>
              <ul className="space-y-1.5">
                {majorB.top_industries.map((i) => (
                  <li key={i} className="text-sm text-gray-700">• {i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {(!majorA || !majorB) && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚖️</div>
          <p className="text-lg text-gray-500">
            {!a && !b ? '请在上方选择两个专业开始对比' : '请选择另一个专业'}
          </p>
        </div>
      )}
    </div>
  );
}
