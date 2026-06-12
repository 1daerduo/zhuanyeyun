'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllMajors } from '@/lib/majors';
import type { Major } from '@/lib/types';

const allMajors = getAllMajors();

export default function SearchBar({ placeholder = '搜索专业名称（如：计算机、口腔医学）...' }: { placeholder?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Major[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 1) {
      const filtered = allMajors.filter(
        (m) =>
          m.name.includes(value) ||
          m.category.includes(value) ||
          m.tags.some((t) => t.includes(value))
      ).slice(0, 8);
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (slug: string) => {
    setShowResults(false);
    setQuery('');
    router.push(`/major/${slug}/`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0].slug);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.trim().length >= 1 && setShowResults(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3.5 text-base bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
          />
        </div>
      </form>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {results.map((major) => (
            <button
              key={major.id}
              onClick={() => handleSelect(major.slug)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between transition-colors border-b border-gray-100 last:border-0"
            >
              <div>
                <span className="text-sm font-medium text-gray-900">{major.name}</span>
                <span className="text-xs text-gray-500 ml-2">{major.category} · {major.degree}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="text-green-600 font-medium">¥{major.starting_salary.toLocaleString()}/月</span>
                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{major.roi_grade}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query.trim().length >= 1 && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6 text-center">
          <p className="text-sm text-gray-500">未找到相关专业，试试其他关键词</p>
        </div>
      )}
    </div>
  );
}
