'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface PagefindInstance {
  search: (query: string) => Promise<{
    results: Array<{ data: () => Promise<PagefindSearchResult> }>;
  }>;
}

interface PagefindSearchResult {
  url: string;
  excerpt: string;
  meta: Record<string, string>;
  raw_url?: string;
}

let pagefindPromise: Promise<PagefindInstance> | null = null;

function getPagefind(): Promise<PagefindInstance> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
  if (pagefindPromise) return pagefindPromise;

  pagefindPromise = new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Pagefind) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve(new (window as any).Pagefind());
      return;
    }
    const script = document.createElement('script');
    script.src = '/pagefind/pagefind.js';
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve(new (window as any).Pagefind());
    };
    script.onerror = () => reject(new Error('Failed to load Pagefind'));
    document.head.appendChild(script);
  });
  return pagefindPromise;
}

export default function SearchBar({
  placeholder = '搜索专业名称（如：计算机、口腔医学）...',
}: {
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts: Ctrl+K or / to focus, Escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' && document.activeElement !== inputRef.current)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.trim().length < 1) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setLoading(true);
    try {
      const pagefind = await getPagefind();
      const search = await pagefind.search(value.trim());
      if (!search?.results?.length) {
        setResults([]);
        setShowResults(true);
        setLoading(false);
        return;
      }
      const data = await Promise.all(search.results.slice(0, 8).map((r) => r.data()));
      setResults(data);
      setShowResults(true);
    } catch {
      setResults([]);
      setShowResults(false);
    }
    setLoading(false);
  }, []);

  const renderExcerpt = (excerpt: string) => {
    return excerpt.replace(
      /<mark>/g,
      '<mark class="bg-yellow-200 text-yellow-900 rounded px-0.5">'
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim().length >= 1 && setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-20 py-3.5 text-base bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-3 hidden sm:flex items-center pointer-events-none">
          <kbd className="inline-flex items-center gap-0.5 px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded-md font-mono">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            搜索中...
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
          {results.map((result, idx) => (
            <Link
              key={idx}
              href={result.url}
              onClick={() => {
                setShowResults(false);
                setQuery('');
              }}
              className="block px-5 py-3.5 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="text-sm font-semibold text-gray-900 mb-0.5">
                {result.meta?.title || result.raw_url || ''}
              </div>
              {result.excerpt && (
                <div
                  className="text-xs text-gray-500 line-clamp-2 mt-0.5"
                  dangerouslySetInnerHTML={{ __html: renderExcerpt(result.excerpt) }}
                />
              )}
            </Link>
          ))}
          <div className="px-5 py-2 bg-gray-50 text-xs text-gray-400 text-center">
            全站搜索 · 共 {results.length} 条结果
          </div>
        </div>
      )}

      {/* No results */}
      {!loading && showResults && query.trim().length >= 1 && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6 text-center">
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-500">未找到「{query}」相关结果</p>
          <p className="text-xs text-gray-400 mt-1">试试其他关键词，如：薪资、就业率、计算机</p>
        </div>
      )}
    </div>
  );
}
