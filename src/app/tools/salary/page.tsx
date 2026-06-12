'use client';

import { useState } from 'react';
import { getAllMajors } from '@/lib/majors';

const allMajors = getAllMajors();

export default function SalaryToolPage() {
  const [major, setMajor] = useState('');
  const [city, setCity] = useState('上海');
  const [years, setYears] = useState(1);

  const selected = allMajors.find((m) => m.slug === major);

  const cityMultiplier: Record<string, number> = {
    '北京': 1.15, '上海': 1.15, '深圳': 1.10, '杭州': 1.05,
    '广州': 1.00, '成都': 0.85, '武汉': 0.85, '南京': 0.95,
    '西安': 0.80, '其他': 0.80,
  };

  const estimate = selected ? Math.round(selected.starting_salary * (cityMultiplier[city] || 1) * (1 + (years - 1) * 0.18)) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">薪资估算器</h1>
      <p className="text-gray-500 mb-8">根据专业、城市和工作年限估算预期月薪</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">选择专业</label>
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="">请选择专业</option>
            {allMajors.map((m) => (
              <option key={m.id} value={m.slug}>{m.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">工作城市</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          >
            {Object.keys(cityMultiplier).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">工作年限: {years} 年</label>
          <input
            type="range"
            min={1}
            max={10}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1年</span><span>5年</span><span>10年</span>
          </div>
        </div>

        {estimate !== null && selected && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-100">
            <p className="text-sm text-gray-600 mb-2">
              {selected.name} · {city} · {years}年经验
            </p>
            <div className="text-4xl font-bold text-blue-600 mb-1">
              ¥{estimate.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">预估月薪（税前）</p>
            <p className="text-xs text-gray-400 mt-3">
              5年后预估: ¥{Math.round(estimate * 1.8).toLocaleString()}/月
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          * 基于公开就业数据估算，仅供参考。实际薪资受个人能力、公司规模、行业景气度等多种因素影响。
        </p>
      </div>
    </div>
  );
}
