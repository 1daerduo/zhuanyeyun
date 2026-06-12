'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { name: '工学', slug: 'gongxue' },
  { name: '医学', slug: 'yixue' },
  { name: '经济学', slug: 'jingjixue' },
  { name: '管理学', slug: 'guanlixue' },
  { name: '法学', slug: 'faxue' },
  { name: '理学', slug: 'lixue' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">专业就业通</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/major/jisuanji-kexue-yu-jishu" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              热门专业
            </Link>
            <div className="relative group">
              <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                专业分类
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/ranking/${cat.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/ranking/gaoxin" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              薪资排行
            </Link>
            <Link href="/ranking/jiuye" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              就业排行
            </Link>
            <Link href="/tools/compare" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              专业比对
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            <Link href="/major/jisuanji-kexue-yu-jishu" className="block py-2 text-sm text-gray-700 hover:text-blue-600">
              热门专业
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/ranking/${cat.slug}`}
                className="block py-2 text-sm text-gray-700 hover:text-blue-600"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/ranking/gaoxin" className="block py-2 text-sm text-gray-700 hover:text-blue-600">
              薪资排行
            </Link>
            <Link href="/tools/compare" className="block py-2 text-sm text-gray-700 hover:text-blue-600">
              专业比对
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
